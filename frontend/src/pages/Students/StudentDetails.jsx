import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BrainCircuit, TrendingUp, RefreshCw, Lightbulb, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { getStudent, predictStudent } from "../../services/api";

export default function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await getStudent(id);
        const stData = res.data;
        setStudent(stData);

        // Fetch AI improvement feedback for student attributes
        if (stData) {
          const predRes = await predictStudent({
            study_hours: stData.study_hours,
            attendance: stData.attendance,
            past_score: stData.past_score,
            assignment_score: stData.assignment_score,
            sleep_hours: stData.sleep_hours,
            age: stData.age,
            gender: stData.gender,
            parental_education: stData.parental_education,
            internet_access: stData.internet_access,
            extracurricular: stData.extracurricular,
          });
          setFeedback(predRes.data.feedback);
        }
      } catch (err) {
        console.error("Error loading student details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="panel" style={{ padding: "3rem", textAlign: "center" }}>
        <RefreshCw className="spin" size={28} /> Loading student record...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="panel" style={{ padding: "3rem", textAlign: "center" }}>
        <h2>Student Not Found</h2>
        <Link to="/students" className="btn primary" style={{ marginTop: "1rem" }}>
          Back to Students
        </Link>
      </div>
    );
  }

  const initials = student.name
    ? student.name.split(" ").map((x) => x[0]).join("")
    : "ST";

  return (
    <>
      <div className="page-intro">
        <div>
          <span className="eyebrow">STUDENT / {student.student_code}</span>
          <h1>Student Profile</h1>
        </div>
        <Link to="/students" className="btn ghost">
          <ArrowLeft size={17} /> All students
        </Link>
      </div>

      <div className="profile-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="panel profile-main">
            <div className="profile-hero">
              <div className="avatar xl">{initials}</div>
              <div>
                <h2>{student.name}</h2>
                <p>{student.program} · Age {student.age}</p>
                <span className={`badge ${student.risk_level === "Attention" ? "warn" : student.risk_level === "High risk" ? "danger" : "ok"}`}>
                  {student.risk_level}
                </span>
              </div>
            </div>

            <div className="detail-grid">
              <div>
                <small>Age</small>
                <b>{student.age}</b>
              </div>
              <div>
                <small>Attendance</small>
                <b>{student.attendance}%</b>
              </div>
              <div>
                <small>Study hours</small>
                <b>{student.study_hours} / week</b>
              </div>
              <div>
                <small>Past average</small>
                <b>{student.past_score}</b>
              </div>
              <div>
                <small>Assignment score</small>
                <b>{student.assignment_score}</b>
              </div>
              <div>
                <small>Internet access</small>
                <b>{student.internet_access}</b>
              </div>
            </div>
          </div>

          {/* AI Improvement Feedback Card */}
          {feedback && (
            <div className="panel" style={{ borderLeft: "4px solid var(--accent, #3b82f6)" }}>
              <div className="panel-head">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Lightbulb size={20} style={{ color: "var(--accent, #3b82f6)" }} />
                  <div>
                    <span className="eyebrow">AI ACADEMIC FEEDBACK</span>
                    <h3>Improvement Recommendations for {student.name.split(" ")[0]}</h3>
                  </div>
                </div>
              </div>

              <div style={{ background: "rgba(59, 130, 246, 0.05)", padding: "0.85rem 1rem", borderRadius: "8px", margin: "0.75rem 0", fontSize: "0.9rem" }}>
                <strong>Assessment:</strong> {feedback.summary}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {feedback.actionable_tips?.map((tip, i) => (
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

        <div className="panel forecast">
          <div className="feature-icon">
            <BrainCircuit />
          </div>
          <span className="eyebrow">AI FORECAST</span>
          <div className="big-score">{student.predicted_score ?? student.final_exam_score}</div>
          <p>Predicted final exam score</p>
          <div className="meter">
            <i style={{ width: `${student.predicted_score || 80}%` }} />
          </div>
          <div className="confidence">
            <span>Confidence</span>
            <b>{student.confidence || 94.1}%</b>
          </div>
          <Link className="btn primary full" to="/prediction">
            Run new prediction <TrendingUp size={16} />
          </Link>
        </div>
      </div>
    </>
  );
}
