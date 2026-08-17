import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Eye, RefreshCw, BrainCircuit } from "lucide-react";
import { getStudents } from "../../services/api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("All risk levels");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getStudents({ search, risk });
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, risk]);

  return (
    <>
      <div className="page-intro">
        <div>
          <span className="eyebrow">DATA / STUDENTS</span>
          <h1>EduPredict AI Student Records</h1>
          <p>Manage student academic records and monitor AI prediction status.</p>
        </div>
        <Link className="btn primary" to="/students/add">
          <Plus size={17} /> Add student
        </Link>
      </div>

      <div className="panel">
        <div className="toolbar">
          <div className="search">
            <Search size={17} />
            <input
              placeholder="Search by student, ID, or program..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select value={risk} onChange={(e) => setRisk(e.target.value)}>
            <option>All risk levels</option>
            <option>Low risk</option>
            <option>Attention</option>
            <option>High risk</option>
          </select>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
              <RefreshCw className="spin" size={24} /> Loading student records...
            </div>
          ) : students.length === 0 ? (
            <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
              <BrainCircuit size={40} style={{ color: "var(--muted)", marginBottom: "1rem" }} />
              <h3>No Student Records Found</h3>
              <p style={{ color: "var(--muted)", margin: "0.5rem 0 1.5rem 0" }}>
                Generate a prediction or add a student to view records here.
              </p>
              <Link to="/prediction" className="btn primary">
                <BrainCircuit size={17} /> Run Prediction
              </Link>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Program</th>
                  <th>Predicted Score</th>
                  <th>Attendance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((r) => (
                  <tr key={r.id || r.student_code}>
                    <td>
                      <div className="student-cell">
                        <div className="avatar">
                          {r.name
                            ? r.name
                                .split(" ")
                                .map((x) => x[0])
                                .join("")
                            : "ST"}
                        </div>
                        <div>
                          <b>{r.name}</b>
                          <small>{r.student_code}</small>
                        </div>
                      </div>
                    </td>
                    <td>{r.program}</td>
                    <td>
                      <strong>{r.predicted_score ?? r.final_exam_score ?? "N/A"}</strong>/100
                    </td>
                    <td>{r.attendance}%</td>
                    <td>
                      <span className={`badge ${r.risk_level === "Attention" ? "warn" : r.risk_level === "High risk" ? "danger" : "ok"}`}>
                        {r.risk_level}
                      </span>
                    </td>
                    <td>
                      <Link to={`/students/${r.id || r.student_code}`} className="icon-btn">
                        <Eye size={17} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
