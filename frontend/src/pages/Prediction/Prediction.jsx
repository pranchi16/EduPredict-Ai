import { useState } from "react";
import { BrainCircuit, Sparkles, ArrowRight, RefreshCw, AlertCircle, Lightbulb, CheckCircle2, AlertTriangle, Info, Sliders, ShieldCheck, Printer, Target, Percent } from "lucide-react";
import { predictStudent } from "../../services/api";

export default function Prediction() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    study_hours: 18,
    attendance: 92,
    past_score: 74,
    assignment_score: 82,
    age: 20,
    sleep_hours: 7,
    gender: "Female",
    parental_education: "Graduate",
    internet_access: "Yes",
    extracurricular: "Yes",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (result) {
      triggerQuickPredict(updated);
    }
  };

  const triggerQuickPredict = async (dataToPredict) => {
    try {
      const res = await predictStudent(dataToPredict);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await predictStudent(formData);
      setResult(res.data);
    } catch (err) {
      console.error("Prediction API error:", err);
      setError(err.response?.data?.error || "Failed to generate prediction from Django backend. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <>
      <div className="page-intro">
        <div>
          <span className="eyebrow">AI ENGINE / SCENARIO SIMULATOR</span>
          <h1>EduPredict AI Performance Forecast & What-If Simulator</h1>
          <p>Estimate final exam performance, test What-If scenarios with live sliders, and receive personalized study feedback.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {result && (
            <button className="btn ghost" onClick={handlePrintReport}>
              <Printer size={16} /> Print AI Report Card
            </button>
          )}
          <span className="model-chip">
            <span className="status-dot"></span> {result?.algorithm || "Random Forest Regressor"}
          </span>
        </div>
      </div>

      <div className="prediction-layout">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <div className="panel-head">
            <div>
              <span className="eyebrow">INPUT & INTERACTIVE WHAT-IF SLIDERS</span>
              <h3>Student Performance Attributes</h3>
            </div>
            <Sliders size={20} style={{ color: "var(--accent, #3b82f6)" }} />
          </div>

          <div className="form-grid">
            <label>
              Study Hours / Week: <b>{formData.study_hours} hrs</b>
              <input
                type="range"
                name="study_hours"
                min="0"
                max="40"
                step="1"
                value={formData.study_hours}
                onChange={handleChange}
              />
            </label>

            <label>
              Attendance: <b>{formData.attendance}%</b>
              <input
                type="range"
                name="attendance"
                min="0"
                max="100"
                step="1"
                value={formData.attendance}
                onChange={handleChange}
              />
            </label>

            <label>
              Past Exam Average: <b>{formData.past_score}</b>
              <input
                type="range"
                name="past_score"
                min="0"
                max="100"
                step="1"
                value={formData.past_score}
                onChange={handleChange}
              />
            </label>

            <label>
              Assignment Score: <b>{formData.assignment_score}</b>
              <input
                type="range"
                name="assignment_score"
                min="0"
                max="100"
                step="1"
                value={formData.assignment_score}
                onChange={handleChange}
              />
            </label>

            <label>
              Age
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </label>

            <label>
              Sleep Hours
              <input
                type="number"
                name="sleep_hours"
                value={formData.sleep_hours}
                onChange={handleChange}
              />
            </label>

            <label>
              Gender
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Parental Education
              <select name="parental_education" value={formData.parental_education} onChange={handleChange}>
                <option>High School</option>
                <option>Graduate</option>
                <option>Postgraduate</option>
              </select>
            </label>

            <label>
              Internet Access
              <select name="internet_access" value={formData.internet_access} onChange={handleChange}>
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>

            <label>
              Extracurricular Activity
              <select name="extracurricular" value={formData.extracurricular} onChange={handleChange}>
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>
          </div>

          {error && (
            <div style={{ color: "var(--danger, #ef4444)", marginTop: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button className="btn primary full" disabled={loading} style={{ marginTop: "1.5rem" }}>
            {loading ? <RefreshCw className="spin" size={17} /> : "Run Full Model Prediction & Feedback"} <ArrowRight size={17} />
          </button>
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Result Card */}
          <div className="panel result-card">
            {result === null ? (
              <div className="result-empty">
                <div className="feature-icon">
                  <BrainCircuit />
                </div>
                <h3>Ready to predict</h3>
                <p>Use the sliders on the left to set student attributes and instantly generate predictions and What-If scenarios.</p>
              </div>
            ) : (
              <>
                <span className="eyebrow">ESTIMATED FINAL EXAM SCORE</span>
                <div className="result-score">
                  {result.predicted_score}
                  <span>/100</span>
                </div>
                <span className={`badge ${result.risk_level === "Attention" ? "warn" : result.risk_level === "High risk" ? "danger" : "ok"}`}>
                  {result.risk_level}
                </span>

                <div className="confidence" style={{ marginTop: "1.5rem" }}>
                  <span>Model Confidence</span>
                  <b>{result.confidence}%</b>
                </div>
                <div className="meter">
                  <i style={{ width: result.predicted_score + "%" }} />
                </div>

                {/* Classification Probabilities */}
                {result.probabilities && (
                  <div style={{ background: "var(--surface-light, #f8fafc)", padding: "1rem", borderRadius: "10px", marginTop: "1.5rem", border: "1px solid var(--border-light, #f1f5f9)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <ShieldCheck size={18} style={{ color: "#3b82f6" }} />
                      <strong style={{ fontSize: "0.85rem" }}>Outcome Probabilities</strong>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", textAlign: "center" }}>
                      <div style={{ background: "#fff", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border, #e2e8f0)" }}>
                        <small style={{ fontSize: "0.7rem", color: "#64748b" }}>Pass Rate</small>
                        <div style={{ color: "#10b981", fontWeight: "700", fontSize: "0.95rem" }}>{result.probabilities.pass_probability}%</div>
                      </div>
                      <div style={{ background: "#fff", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border, #e2e8f0)" }}>
                        <small style={{ fontSize: "0.7rem", color: "#64748b" }}>Honors (80+)</small>
                        <div style={{ color: "#3b82f6", fontWeight: "700", fontSize: "0.95rem" }}>{result.probabilities.honors_probability}%</div>
                      </div>
                      <div style={{ background: "#fff", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border, #e2e8f0)" }}>
                        <small style={{ fontSize: "0.7rem", color: "#64748b" }}>At-Risk</small>
                        <div style={{ color: "#ef4444", fontWeight: "700", fontSize: "0.95rem" }}>{result.probabilities.fail_probability}%</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SHAP Mathematical Feature Attributions */}
                {result.shap_attributions && (
                  <div className="result-note" style={{ marginTop: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <Target size={16} style={{ color: "#3b82f6" }} />
                      <b>SHAP Mathematical Point Attribution</b>
                    </div>
                    <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.5rem" }}>
                      {result.shap_attributions?.map((s) => (
                        <div key={s.feature} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                          <span>{s.feature} ({s.value})</span>
                          <span className={`badge ${s.delta.startsWith("+") ? "ok" : "danger"}`} style={{ fontSize: "0.75rem" }}>
                            {s.delta}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* AI Improvement Feedback Card */}
          {result && result.feedback && (
            <div className="panel" style={{ borderLeft: "4px solid var(--accent, #3b82f6)" }}>
              <div className="panel-head">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Lightbulb size={20} style={{ color: "var(--accent, #3b82f6)" }} />
                  <div>
                    <span className="eyebrow">AI RECOMMENDATIONS</span>
                    <h3>Personalized Study Improvement Plan</h3>
                  </div>
                </div>
              </div>

              <div style={{ background: "rgba(59, 130, 246, 0.05)", padding: "1rem", borderRadius: "8px", margin: "1rem 0", color: "var(--fg, #0f172a)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                <strong>Summary Assessment:</strong> {result.feedback.summary}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {result.feedback.actionable_tips?.map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", padding: "0.75rem", background: "var(--surface-light, #f8fafc)", borderRadius: "8px", border: "1px solid var(--border-light, #f1f5f9)" }}>
                    <div style={{ marginTop: "0.2rem" }}>
                      {tip.priority === "High" ? (
                        <AlertTriangle size={18} style={{ color: "#ef4444" }} />
                      ) : tip.priority === "Medium" ? (
                        <Info size={18} style={{ color: "#f59e0b" }} />
                      ) : (
                        <CheckCircle2 size={18} style={{ color: "#10b981" }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                        <strong style={{ fontSize: "0.85rem" }}>{tip.category}</strong>
                        <span className={`badge ${tip.priority === "High" ? "danger" : tip.priority === "Medium" ? "warn" : "ok"}`} style={{ fontSize: "0.7rem", padding: "0.15rem 0.4rem" }}>
                          {tip.priority} Priority
                        </span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--muted, #475569)", margin: 0, lineHeight: "1.4" }}>
                        {tip.advice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
