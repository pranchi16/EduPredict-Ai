import { Outlet, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, BrainCircuit, BarChart3, UploadCloud, GraduationCap, Menu, X, Activity } from "lucide-react";
import { useState } from "react";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState("Teacher"); // "Teacher" or "Student"
  const loc = useLocation();

  const nav = [
    ["/dashboard", "Dashboard", LayoutDashboard],
    ["/students", "Students", Users],
    ["/prediction", "AI Prediction", BrainCircuit],
    ["/analytics", "Analytics", BarChart3],
    ...(userRole === "Teacher" ? [["/upload", "Data Import", UploadCloud]] : []),
  ];

  const title = nav.find((x) => loc.pathname.startsWith(x[0]))?.[1] || "Student Intelligence";

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "show" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <GraduationCap />
          </div>
          <div>
            <b>EduPredict</b>
            <span>AI Intelligence</span>
          </div>
        </div>
        <div className="nav-label">WORKSPACE</div>
        {nav.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
        
        {/* Role Switcher in Sidebar */}
        <div style={{ margin: "1.5rem 0.75rem 0.5rem", padding: "0.75rem", background: "var(--surface-light, rgba(255,255,255,0.05))", borderRadius: "10px", border: "1px solid var(--border-light, rgba(255,255,255,0.1))" }}>
          <small style={{ fontSize: "0.7rem", color: "var(--muted, #94a3b8)", textTransform: "uppercase", letterSpacing: "0.5px" }}>ACTIVE ROLE VIEW</small>
          <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.4rem" }}>
            <button
              style={{ flex: 1, padding: "0.35rem", fontSize: "0.75rem", borderRadius: "6px", border: "none", cursor: "pointer", background: userRole === "Teacher" ? "var(--accent, #3b82f6)" : "transparent", color: "#fff", fontWeight: userRole === "Teacher" ? "600" : "400" }}
              onClick={() => setUserRole("Teacher")}
            >
              Teacher
            </button>
            <button
              style={{ flex: 1, padding: "0.35rem", fontSize: "0.75rem", borderRadius: "6px", border: "none", cursor: "pointer", background: userRole === "Student" ? "var(--accent, #3b82f6)" : "transparent", color: "#fff", fontWeight: userRole === "Student" ? "600" : "400" }}
              onClick={() => setUserRole("Student")}
            >
              Student
            </button>
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="profile-mini">
            <div className="avatar">{userRole === "Teacher" ? "AD" : "ST"}</div>
            <div>
              <b>{userRole === "Teacher" ? "Academic Advisor" : "Student View"}</b>
              <small>{userRole === "Teacher" ? "Administrator" : "Student"}</small>
            </div>
          </div>
        </div>
      </aside>
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
          <div>
            <span className="eyebrow">EDUPREDICT AI / {title.toUpperCase()}</span>
            <h2>{title}</h2>
          </div>
          <div className="top-actions">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(16, 185, 129, 0.08)", color: "#10b981", padding: "0.35rem 0.75rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600" }}>
              <Activity size={14} className="spin" />
              <span>Model v1.2.0 Active</span>
            </div>
            <div className="avatar">{userRole === "Teacher" ? "AD" : "ST"}</div>
          </div>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}