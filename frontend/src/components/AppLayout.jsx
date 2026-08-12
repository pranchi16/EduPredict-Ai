import { Outlet, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, BrainCircuit, BarChart3, UploadCloud, Gauge, Settings, LogOut, GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

const nav=[["/dashboard","Dashboard",LayoutDashboard],["/students","Students",Users],["/prediction","AI Prediction",BrainCircuit],["/analytics","Analytics",BarChart3],["/upload","Data Import",UploadCloud],["/model-performance","Model Performance",Gauge]];
export default function AppLayout(){
 const [open,setOpen]=useState(false); const loc=useLocation();
 const title=nav.find(x=>loc.pathname.startsWith(x[0]))?.[1] || (loc.pathname==="/settings"?"Settings":"Student Intelligence");
 return <div className="app-shell">
  <aside className={"sidebar "+(open?"show":"")}>
   <div className="brand"><div className="brand-mark"><GraduationCap/></div><div><b>EduPredict</b><span>AI Intelligence</span></div></div>
   <div className="nav-label">WORKSPACE</div>
   {nav.map(([to,label,Icon])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>isActive?"nav-item active":"nav-item"}><Icon size={19}/><span>{label}</span></NavLink>)}
   <div className="nav-label">SYSTEM</div>
   <NavLink to="/settings" onClick={()=>setOpen(false)} className={({isActive})=>isActive?"nav-item active":"nav-item"}><Settings size={19}/><span>Settings</span></NavLink>
   <div className="sidebar-bottom"><div className="profile-mini"><div className="avatar">PD</div><div><b>Project Admin</b><small>Administrator</small></div></div><NavLink to="/" className="logout"><LogOut size={17}/> Sign out</NavLink></div>
  </aside>
  {open&&<div className="overlay" onClick={()=>setOpen(false)}/>}
  <main className="main">
   <header className="topbar"><button className="mobile-menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><div><span className="eyebrow">EDUPREDICT / {title.toUpperCase()}</span><h2>{title}</h2></div><div className="top-actions"><span className="status-dot"></span><span className="live">System online</span><div className="avatar">PD</div></div></header>
   <section className="content"><Outlet/></section>
  </main>
 </div>
}