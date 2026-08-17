import { useEffect, useState } from "react";
import { Users, BrainCircuit, TrendingUp, AlertTriangle, ArrowUpRight, RefreshCw, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard";
import { getAnalytics } from "../../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await getAnalytics();
        setData(res.data);
      } catch (err) {
        console.error("Dashboard analytics load error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const hasData = data && data.total_students > 0;

  return (
    <>
      <div className="page-intro">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>EduPredict AI Dashboard</h1>
          <p>Here is the latest view of your student performance intelligence and ML prediction analytics.</p>
        </div>
        <Link className="btn primary" to="/prediction">
          <BrainCircuit size={17} /> New prediction
        </Link>
      </div>

      {loading ? (
        <div className="panel" style={{ padding: "2rem", textAlign: "center" }}>
          <RefreshCw className="spin" size={24} /> Loading EduPredict AI stats...
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard icon={Users} label="Students tracked" value={data?.total_students || 0} change={hasData ? "+1 new student" : "No records yet"} />
            <StatCard icon={BrainCircuit} label="Predictions made" value={data?.predictions_made || 0} change={hasData ? "Active pipeline" : "0 predictions"} />
            <StatCard icon={TrendingUp} label="Average predicted" value={hasData ? data?.average_predicted : "0.0"} change={hasData ? "Current average" : "N/A"} />
            <StatCard icon={AlertTriangle} label="Needs attention" value={data?.at_risk_count || 0} sub={`${data?.at_risk_percentage || "0%"} of students`} />
          </div>

          {!hasData ? (
            <div className="panel" style={{ padding: "3rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div className="feature-icon" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", width: "56px", height: "56px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BrainCircuit size={28} />
              </div>
              <div>
                <h2>No Student Predictions Yet</h2>
                <p style={{ color: "var(--muted, #64748b)", maxWidth: "480px", margin: "0.5rem auto 0 auto" }}>
                  Your dashboard is currently empty. Run your first AI performance prediction or add student records to begin generating analytics.
                </p>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <Link to="/prediction" className="btn primary">
                  <BrainCircuit size={17} /> Run Prediction Now
                </Link>
                <Link to="/students/add" className="btn ghost">
                  <PlusCircle size={17} /> Add Student Record
                </Link>
              </div>
            </div>
          ) : (
            <div className="dashboard-grid">
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <span className="eyebrow">PERFORMANCE TREND</span>
                    <h3>Predicted score distribution</h3>
                  </div>
                  <span className="select-like">Current Term ▾</span>
                </div>
                <div className="chart">
                  <div className="ylabels">
                    <span>90</span>
                    <span>80</span>
                    <span>70</span>
                    <span>60</span>
                  </div>
                  <svg viewBox="0 0 700 240" preserveAspectRatio="none">
                    <path
                      d="M0 185 C80 170,95 145,150 158 S240 135,290 145 S380 100,440 118 S530 75,590 92 S650 55,700 65"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      d="M0 185 C80 170,95 145,150 158 S240 135,290 145 S380 100,440 118 S530 75,590 92 S650 55,700 65 L700 240 L0 240Z"
                      fill="currentColor"
                      opacity=".06"
                    />
                  </svg>
                </div>
                <div className="xlabels">
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <span className="eyebrow">STUDENT RECORDS</span>
                    <h3>Recent predictions</h3>
                  </div>
                  <Link to="/students">
                    View all <ArrowUpRight size={15} />
                  </Link>
                </div>
                {data?.recent_students?.map((s) => (
                  <div className="driver" key={s.id || s.student_code}>
                    <div>
                      <b>{s.name}</b>
                      <small>{s.student_code} · {s.program}</small>
                    </div>
                    <strong>{s.predicted_score}/100</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}