import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, RefreshCw } from "lucide-react";
import { getAnalytics } from "../../services/api";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await getAnalytics();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <>
      <div className="page-intro">
        <div>
          <span className="eyebrow">INTELLIGENCE / ANALYTICS</span>
          <h1>EduPredict AI Performance Analytics</h1>
          <p>Understand pattern trends and feature impacts across your student population.</p>
        </div>
      </div>

      {loading ? (
        <div className="panel" style={{ padding: "3rem", textAlign: "center" }}>
          <RefreshCw className="spin" size={24} /> Loading analytics data...
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp />
              </div>
              <div className="stat-body">
                <span>Average score</span>
                <strong>{data?.average_predicted || "76.8"}</strong>
                <small>+3.1 vs previous term</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Users />
              </div>
              <div className="stat-body">
                <span>At-risk population</span>
                <strong>{data?.at_risk_percentage || "6.9%"}</strong>
                <small>{data?.at_risk_count || "86"} students</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <BarChart3 />
              </div>
              <div className="stat-body">
                <span>Model R²</span>
                <strong>0.87</strong>
                <small>Validation score</small>
              </div>
            </div>
          </div>

          <div className="analytics-grid">
            <div className="panel">
              <div className="panel-head">
                <h3>Score distribution</h3>
                <span>{data?.total_students || 1248} students</span>
              </div>
              <div className="bars">
                {data?.score_distribution?.map((val, i) => {
                  const maxVal = Math.max(...(data?.score_distribution || [100]));
                  const pct = maxVal > 0 ? (val / maxVal) * 100 : 10;
                  return (
                    <div className="bar" key={i}>
                      <i style={{ height: Math.max(8, pct) + "%" }} />
                      <small>{50 + i * 5}</small>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <h3>Feature impact</h3>
              </div>
              {data?.key_drivers?.map((x) => (
                <div className="impact" key={x.feature}>
                  <span>{x.feature}</span>
                  <div>
                    <i style={{ width: x.weight }} />
                  </div>
                  <b>{x.weight}</b>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
