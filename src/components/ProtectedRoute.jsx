import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Session error:", error);
      setAuthenticated(false);
    } else {
      setAuthenticated(!!data.session);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
          fontWeight: "bold"
        }}
      >
        Checking authentication...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;