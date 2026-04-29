import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";

const COLORS = ["#d7ab73", "#a96f35", "#f0d7b1", "#7a4d23"];

export default function Dashboard({ analytics }) {
  const modelData = analytics?.metrics?.models || [];
  const confusion = analytics?.metrics?.confusionMatrix || [
    [0, 0],
    [0, 0],
  ];
  const featureData = analytics?.featureImportance || [];

  const dataset = analytics?.datasetStats || {
    placementData: [],
    avgData: [],
    scatterData: [],
  };

  const confusionData = [
    { name: "True Negative", value: confusion[0]?.[0] || 0 },
    { name: "False Positive", value: confusion[0]?.[1] || 0 },
    { name: "False Negative", value: confusion[1]?.[0] || 0 },
    { name: "True Positive", value: confusion[1]?.[1] || 0 },
  ];

  const tooltipStyle = {
    background: "#0d0a08",
    border: "1px solid rgba(212,170,112,0.16)",
    borderRadius: "14px",
    color: "#f5e7d0",
  };

  const noData =
    !analytics ||
    (!modelData.length &&
      !featureData.length &&
      !dataset.placementData.length &&
      !dataset.avgData.length &&
      !dataset.scatterData.length);

  if (noData) {
    return (
      <section className="dashboard" id="dashboard">
        <div className="section-head">
          <span className="mini-badge">Model Analytics</span>
          <h2>Analytics Dashboard</h2>
          <p className="section-subtext">
            Analytics data is not loading. Check backend `/api/analytics` and dataset path.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard" id="dashboard">
      <div className="section-head">
        <span className="mini-badge">Model Analytics</span>
        <h2>Analytics Dashboard</h2>
        <p className="section-subtext">
          All graphs below are generated from model files and real dataset analytics.
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h3>Model Accuracy</h3>
          {modelData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modelData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,170,112,0.15)" />
                <XAxis dataKey="model" stroke="#d3b187" />
                <YAxis
                  domain={[0, 1]}
                  tickFormatter={(value) => `${Math.round(value * 100)}%`}
                  stroke="#d3b187"
                />
                <Tooltip
                  formatter={(value) => `${Math.round(Number(value) * 100)}%`}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="accuracy" fill="#d7ab73" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="muted">No model accuracy data available.</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Confusion Matrix</h3>
          {confusionData.some((item) => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={confusionData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={95}
                  innerRadius={45}
                  paddingAngle={3}
                  label
                >
                  {confusionData.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="muted">No confusion matrix data available.</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Placement Distribution</h3>
          {dataset.placementData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataset.placementData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={95}
                  innerRadius={45}
                  paddingAngle={3}
                  label
                >
                  {dataset.placementData.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="muted">No placement distribution data available.</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Average Feature Values</h3>
          {dataset.avgData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataset.avgData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,170,112,0.15)" />
                <XAxis dataKey="feature" stroke="#d3b187" />
                <YAxis stroke="#d3b187" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#a96f35" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="muted">No average feature data available.</p>
          )}
        </div>

        <div className="chart-card">
          <h3>CGPA vs Placement</h3>
          {dataset.scatterData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,170,112,0.15)" />
                <XAxis
                  type="number"
                  dataKey="cgpa"
                  name="CGPA"
                  domain={[0, 10]}
                  stroke="#d3b187"
                />
                <YAxis
                  type="number"
                  dataKey="placement"
                  name="Placement"
                  domain={[0, 1]}
                  ticks={[0, 1]}
                  stroke="#d3b187"
                />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={tooltipStyle} />
                <Scatter data={dataset.scatterData} fill="#d7ab73" />
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <p className="muted">No scatter data available.</p>
          )}
        </div>

        <div className="chart-card full-width">
          <h3>Feature Importance</h3>
          {featureData.length ? (
            <ResponsiveContainer width="100%" height={340}>
              <BarChart
                data={featureData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 80, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,170,112,0.15)" />
                <XAxis type="number" stroke="#d3b187" />
                <YAxis
                  type="category"
                  dataKey="feature"
                  width={180}
                  stroke="#d3b187"
                />
                <Tooltip
                  formatter={(value) => Number(value).toFixed(3)}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="importance" fill="#a96f35" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="muted">No feature importance data available.</p>
          )}
        </div>
      </div>
    </section>
  );
}