import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#120500", color: "#f7d088" }}>
        <h2>Checking Admin Access...</h2>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;