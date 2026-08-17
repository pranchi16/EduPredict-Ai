import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import { createStudent } from "../../services/api";

export default function AddStudent() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: 20,
    program: "Computer Engineering",
    study_hours: 18,
    attendance: 90,
    past_score: 75,
    assignment_score: 80,
    sleep_hours: 7,
    gender: "Female",
    parental_education: "Graduate",
    internet_access: "Yes",
    extracurricular: "Yes",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createStudent(formData);
      nav("/students");
    } catch (err) {
      console.error("Error creating student:", err);
      alert("Failed to save student record to Django backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-intro">
        <div>
          <span className="eyebrow">STUDENTS / NEW RECORD</span>
          <h1>Add Student Record</h1>
          <p>Enter the student attributes used by the EduPredict AI inference pipeline.</p>
        </div>
        <Link to="/students" className="btn ghost">
          <ArrowLeft size={17} /> Back
        </Link>
      </div>

      <form className="panel form-panel" onSubmit={handleSubmit}>
        <h3>Student Information</h3>
        <div className="form-grid">
          <label>
            Full name
            <input
              type="text"
              name="name"
              placeholder="e.g. Priya Patel"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Program / Course
            <input
              type="text"
              name="program"
              placeholder="e.g. Computer Engineering"
              value={formData.program}
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
            Study hours per week
            <input
              type="number"
              name="study_hours"
              value={formData.study_hours}
              onChange={handleChange}
            />
          </label>

          <label>
            Attendance percentage
            <input
              type="number"
              name="attendance"
              value={formData.attendance}
              onChange={handleChange}
            />
          </label>

          <label>
            Past exam average
            <input
              type="number"
              name="past_score"
              value={formData.past_score}
              onChange={handleChange}
            />
          </label>

          <label>
            Assignment score
            <input
              type="number"
              name="assignment_score"
              value={formData.assignment_score}
              onChange={handleChange}
            />
          </label>

          <label>
            Sleep hours
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
            Parental education
            <select
              name="parental_education"
              value={formData.parental_education}
              onChange={handleChange}
            >
              <option>High School</option>
              <option>Graduate</option>
              <option>Postgraduate</option>
            </select>
          </label>

          <label>
            Internet access
            <select
              name="internet_access"
              value={formData.internet_access}
              onChange={handleChange}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </label>

          <label>
            Extracurricular activity
            <select
              name="extracurricular"
              value={formData.extracurricular}
              onChange={handleChange}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn ghost" onClick={() => nav("/students")}>
            Cancel
          </button>
          <button className="btn primary" disabled={loading}>
            {loading ? <RefreshCw className="spin" size={17} /> : <Save size={17} />} Save student
          </button>
        </div>
      </form>
    </>
  );
}
