import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import PredictionForm from "./components/PredictionForm.jsx";
import ResultCard from "./components/ResultCard.jsx";
import Dashboard from "./components/Dashboard.jsx";
import HistoryPanel from "./components/HistoryPanel.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { useAuth } from "./context/AuthContext";

const API_BASE = "http://localhost:5000";

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/analytics`);
      const data = await res.json();

      if (!res.ok) {
        console.error("Analytics fetch failed:", data);
        setAnalytics(null);
        return;
      }

      setAnalytics(data);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setAnalytics(null);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchHistory = async () => {
    if (!user?.token) {
      setHistory([]);
      return;
    }

    setLoadingHistory(true);

    try {
      const res = await fetch(`${API_BASE}/api/history`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("History fetch failed:", data);
        setHistory([]);
        return;
      }

      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("History fetch error:", error);
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handlePredict = async (formData) => {
    if (!user?.token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({
          error: data.details || data.error || "Prediction failed",
        });
        return;
      }

      setResult(data);
      await fetchHistory();
    } catch (error) {
      console.error("Prediction error:", error);
      setResult({
        error: "Prediction failed. Backend not reachable.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ around line ~95
const handleDeleteHistory = async (id) => {
  const previousHistory = history;

  // 🔥 INSTANT UI UPDATE
  setHistory((prev) => prev.filter((item) => item._id !== id));
  setDeletingId(id);

  try {
    await fetch(`${API_BASE}/api/history/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  } catch (error) {
    // ❌ rollback if API fails
    setHistory(previousHistory);
    console.error(error);
  } finally {
    setDeletingId(null);
  }
};

  return (
    <div className="app-shell">
      <Navbar />
      <Hero />

      <main className="container">
        <div className="grid-two">
          <PredictionForm onPredict={handlePredict} loading={loading} />
          <ResultCard result={result} loading={loading} />
        </div>

        {user && (
          <div className="history-section">
            <HistoryPanel
              history={history}
              loadingHistory={loadingHistory}
              onDeleteHistory={handleDeleteHistory}
              deletingId={deletingId}
            />
          </div>
        )}

        <Dashboard analytics={analytics} />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}