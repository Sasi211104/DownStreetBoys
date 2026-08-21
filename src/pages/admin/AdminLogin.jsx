import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/admin/dashboard");
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        
        {/* Orange Ganesha Image */}
        <div className="admin-logo-wrapper">
          <img
            src="/images/orangeganesh.png"
            alt="Lord Ganesha"
            className="admin-ganesh-img"
          />
        </div>

        <h1>Admin Login</h1>

        <p className="admin-login-subtitle">DOWN STREET BOYS</p>

        <form onSubmit={handleLogin}>
          <div className="admin-input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              autoCapitalize="none"
              autoComplete="off"
              spellCheck="false"
              required
            />
          </div>

          <div className="admin-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: "15px",
                padding: "12px",
                borderRadius: "8px",
                background: "#ffe5e5",
                color: "#b3261e",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "🔐 Login"}
          </button>
        </form>

        <button
          type="button"
          className="back-to-landing-btn"
          onClick={() => navigate("/")}
        >
          <span className="btn-arrow">←</span> Back to Home
        </button>

        <p className="admin-login-note">Authorized administrators only</p>
      </div>
    </div>
  );
}

export default AdminLogin;