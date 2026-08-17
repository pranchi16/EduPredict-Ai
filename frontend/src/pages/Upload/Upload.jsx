import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UploadCloud, CheckCircle2, RefreshCw, AlertCircle, FileSpreadsheet, Download, Users, BrainCircuit, ArrowRight, Sparkles, Database, Filter } from "lucide-react";
import { uploadCSV } from "../../services/api";

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [viewTab, setViewTab] = useState("cleaned"); // "cleaned" or "records"

  const handleDownloadSample = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "student_code,name,program,study_hours,attendance,past_score,assignment_score,age,gender,parental_education,internet_access,extracurricular\n" +
      "ST-2001,Aarav Patel,Computer Engineering,22,94,85,88,20,Male,Graduate,Yes,Yes\n" +
      "ST-2002,Priya Sharma,Information Tech.,18,91,78,82,21,Female,Postgraduate,Yes,Yes\n" +
      "ST-2003,Rahul Verma,Electronics,12,72,62,68,20,Male,High School,No,No\n" +
      "ST-2004,Sneha Kulkarni,Computer Engineering,26,97,92,95,20,Female,Postgraduate,Yes,Yes\n" +
      "ST-2005,Vikram Singh,Mechanical,10,65,58,60,22,Male,Graduate,Yes,No\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "edupredict_raw_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCleanedCSV = () => {
    if (!result?.cleaned_csv) return;
    const blob = new Blob([result.cleaned_csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `edupredict_cleaned_dataset_${file?.name || "dataset"}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processUpload = async (selectedFile) => {
    setFile(selectedFile);
    setUploading(true);
    setErrorMsg(null);
    setResult(null);
    setCurrentStep(1);

    const timer1 = setTimeout(() => setCurrentStep(2), 350);
    const timer2 = setTimeout(() => setCurrentStep(3), 700);
    const timer3 = setTimeout(() => setCurrentStep(4), 1050);

    try {
      const res = await uploadCSV(selectedFile);
      setCurrentStep(5);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || "Failed to process CSV on Django backend. Please verify file format.");
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processUpload(selectedFile);
    }
  };

  return (
    <>
      <div className="page-intro">
        <div>
          <span className="eyebrow">PANDAS PREPROCESSING & INGESTION</span>
          <h1>EduPredict AI Dataset Cleaning & Ingestion</h1>
          <p>Upload a raw CSV dataset. The Pandas pipeline will clean, impute missing values, encode features, run predictions, and provide the cleaned dataset.</p>
        </div>
        <button className="btn ghost" onClick={handleDownloadSample}>
          <Download size={17} /> Raw Sample CSV Template
        </button>
      </div>

      {!result ? (
        <div className="upload-layout">
          <label className="dropzone" style={{ border: file ? "2px dashed var(--accent, #3b82f6)" : "2px dashed var(--border, #e2e8f0)" }}>
            <input type="file" accept=".csv" onChange={handleFileChange} disabled={uploading} />
            <div className="upload-icon" style={{ color: "var(--accent, #3b82f6)" }}>
              {uploading ? <RefreshCw className="spin" size={36} /> : <UploadCloud size={36} />}
            </div>
            <h3>{file ? file.name : "Drop your raw CSV dataset here"}</h3>
            <p>{file ? (uploading ? "Cleaning dataset with Pandas & predicting..." : "File selected.") : "or click to browse from your computer"}</p>
            <span>Supported: CSV format · Automatic Pandas Cleaning & Categorical Encoding</span>
          </label>

          <div className="panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">PROCESSING ENGINE</span>
                <h3>5-Stage Data Pipeline</h3>
              </div>
              <Sparkles size={18} />
            </div>

            {errorMsg && (
              <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.85rem", borderRadius: "8px", marginBottom: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <AlertCircle size={18} /> {errorMsg}
              </div>
            )}

            {[
              "01. Validate Column Structure & Data Schemas",
              "02. Clean Missing Values via Median Imputation",
              "03. Encode Categorical Features (Gender, Parental Edu, Internet)",
              "04. Execute Scikit-Learn Batch Inference Engine on Cleaned Data",
              "05. Generate Cleaned Dataset CSV & Persist to Django Database",
            ].map((stepText, idx) => {
              const stepNum = idx + 1;
              const isDone = currentStep > stepNum || (currentStep === 5 && !uploading);
              const isCurrent = uploading && currentStep === stepNum;

              return (
                <div key={stepText} className="pipeline-step" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: idx < 4 ? "1px solid var(--border-light, #f1f5f9)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <b style={{ color: isDone ? "var(--success, #10b981)" : isCurrent ? "var(--accent, #3b82f6)" : "var(--muted, #94a3b8)" }}>
                      0{stepNum}
                    </b>
                    <span style={{ fontWeight: isDone || isCurrent ? "600" : "400", color: isDone ? "var(--fg, #0f172a)" : "var(--muted, #64748b)" }}>
                      {stepText.slice(4)}
                    </span>
                  </div>
                  {isDone ? (
                    <CheckCircle2 size={18} style={{ color: "var(--success, #10b981)" }} />
                  ) : isCurrent ? (
                    <RefreshCw className="spin" size={16} style={{ color: "var(--accent, #3b82f6)" }} />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Success Banner */}
          <div className="panel" style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ background: "#10b981", color: "#fff", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <span className="eyebrow" style={{ color: "#10b981" }}>DATASET CLEANED & PREDICTED</span>
                  <h2 style={{ fontSize: "1.35rem", margin: "0.15rem 0" }}>{result.message}</h2>
                  <p style={{ color: "var(--muted, #64748b)", margin: 0 }}>The Pandas pipeline cleaned missing values, encoded features, and calculated predicted scores for all records.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button className="btn primary" onClick={handleDownloadCleanedCSV}>
                  <Download size={16} /> Download Cleaned CSV
                </button>
                <button className="btn ghost" onClick={() => setResult(null)}>
                  Upload Another CSV
                </button>
                <Link to="/dashboard" className="btn ghost">
                  Dashboard <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Batch Summary Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
                <FileSpreadsheet />
              </div>
              <div className="stat-body">
                <span>Cleaned Records</span>
                <strong>{result.records_processed}</strong>
                <small>Pandas Pipeline Cleaned</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                <BrainCircuit />
              </div>
              <div className="stat-body">
                <span>Predicted Average</span>
                <strong>{result.summary?.avg_score || 0} / 100</strong>
                <small>From Cleaned Features</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
                <Users />
              </div>
              <div className="stat-body">
                <span>At-Risk Students</span>
                <strong>{result.summary?.at_risk || 0}</strong>
                <small>Needs Support</small>
              </div>
            </div>
          </div>

          {/* Cleaned Dataset vs Stored Records Tab View */}
          <div className="panel">
            <div className="panel-head" style={{ borderBottom: "1px solid var(--border, #e2e8f0)", paddingBottom: "1rem" }}>
              <div>
                <span className="eyebrow">PREPROCESSED PIPELINE OUTPUT</span>
                <h3>Cleaned Dataset & Model Predictions</h3>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className={`btn ${viewTab === "cleaned" ? "primary" : "ghost"}`} onClick={() => setViewTab("cleaned")}>
                  <Filter size={15} /> Preprocessed Cleaned Features
                </button>
                <button className={`btn ${viewTab === "records" ? "primary" : "ghost"}`} onClick={() => setViewTab("records")}>
                  <Database size={15} /> Ingested Database Records
                </button>
              </div>
            </div>

            <div className="table-wrap" style={{ marginTop: "1rem" }}>
              {viewTab === "cleaned" ? (
                <table>
                  <thead>
                    <tr>
                      <th>Student Code</th>
                      <th>Name</th>
                      <th>Study Hrs</th>
                      <th>Attendance</th>
                      <th>Past Score</th>
                      <th>Parental Edu (Encoded)</th>
                      <th>Internet (Encoded)</th>
                      <th>Predicted Score</th>
                      <th>Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.records?.map((r) => (
                      <tr key={r.id || r.student_code}>
                        <td>
                          <b>{r.student_code}</b>
                        </td>
                        <td>{r.name}</td>
                        <td>{r.study_hours} hrs/wk</td>
                        <td>{r.attendance}%</td>
                        <td>{r.past_score}</td>
                        <td>
                          <span className="badge" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
                            {r.parental_education} ({r.parental_education?.toLowerCase().includes("post") ? 2 : r.parental_education?.toLowerCase().includes("grad") ? 1 : 0})
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                            {r.internet_access} ({r.internet_access?.toLowerCase() === "yes" ? 1 : 0})
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: "var(--accent, #3b82f6)", fontSize: "1.05rem" }}>{r.predicted_score}</strong>/100
                        </td>
                        <td>
                          <span className={`badge ${r.risk_level === "Attention" ? "warn" : r.risk_level === "High risk" ? "danger" : "ok"}`}>
                            {r.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Program</th>
                      <th>Predicted Score</th>
                      <th>Attendance</th>
                      <th>Study Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.records?.map((r) => (
                      <tr key={r.id || r.student_code}>
                        <td>
                          <b>{r.student_code}</b>
                        </td>
                        <td>{r.name}</td>
                        <td>{r.program}</td>
                        <td>
                          <strong>{r.predicted_score}</strong>/100
                        </td>
                        <td>{r.attendance}%</td>
                        <td>{r.study_hours} hrs/wk</td>
                        <td>
                          <span className={`badge ${r.risk_level === "Attention" ? "warn" : r.risk_level === "High risk" ? "danger" : "ok"}`}>
                            {r.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
