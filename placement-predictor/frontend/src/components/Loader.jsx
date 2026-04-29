import { motion } from "framer-motion";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="saas-loader-wrap" role="status" aria-live="polite">
      <div className="saas-loader">
        <motion.span
          className="saas-loader-dot"
          animate={{ y: [0, -8, 0], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: 0 }}
        />
        <motion.span
          className="saas-loader-dot"
          animate={{ y: [0, -8, 0], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: 0.12 }}
        />
        <motion.span
          className="saas-loader-dot"
          animate={{ y: [0, -8, 0], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: 0.24 }}
        />
      </div>

      <motion.p
        className="saas-loader-text"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );
}