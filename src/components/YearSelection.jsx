import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ganeshaImage from "../assets/ganesha.jpg";

function YearSelection() {
  const navigate = useNavigate();

  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadYears();
  }, []);

  async function loadYears() {
    const { data, error } = await supabase
      .from("festival_years")
      .select("id, year, title, location, description")
      .order("year", { ascending: false });

    if (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setYears(data || []);
    setLoading(false);
  }

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff3c4",
          color: "#8b2500",
          fontFamily: "Arial"
        }}
      >
        <h2>Loading Festival Years...</h2>
      </div>
    );
  }

  // ============================
  // ERROR
  // ============================

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff3c4",
          fontFamily: "Arial"
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            textAlign: "center"
          }}
        >
          <h2 style={{ color: "#b3261e" }}>
            Unable to Load Years
          </h2>

          <p>{error}</p>

          <button
            onClick={loadYears}
            style={{
              marginTop: "20px",
              padding: "12px 25px",
              border: "none",
              borderRadius: "10px",
              background: "#8b2500",
              color: "white",
              cursor: "pointer"
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================
  // MAIN PAGE
  // ============================

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "60px 8%",
        background:
          "linear-gradient(135deg, #fff8e7, #ffd28a)",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box"
      }}
    >

      {/* HEADER */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "55px"
        }}
      >

        <div
          style={{
            fontSize: "55px",
            marginBottom: "10px"
          }}
        >
          🕉️
        </div>

        <h1
          style={{
            fontSize: "clamp(35px, 6vw, 55px)",
            color: "#8b2500",
            margin: "0 0 15px",
            fontWeight: "900"
          }}
        >
          DSB Vinayaka Mahotsav
        </h1>

        <p
          style={{
            fontSize: "19px",
            color: "#6b3a00",
            marginBottom: "10px"
          }}
        >
          Welcome to the DSB Vinayaka Mahotsav
        </p>

        <p
          style={{
            color: "#8b2500",
            fontWeight: "bold",
            fontSize: "18px"
          }}
        >
          🙏 Select a festival year to continue 🙏
        </p>

      </div>


      {/* YEAR CARDS */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",

          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

          gap: "30px"
        }}
      >

        {years.map((festival) => (

          <button
            key={festival.id}

            onClick={() =>
              navigate(
                `/festival/${festival.year}`
              )
            }

            style={{
              position: "relative",

              minHeight: "300px",

              border: "none",

              borderRadius: "25px",

              overflow: "hidden",

              cursor: "pointer",

              padding: "0",

              backgroundImage: `
                linear-gradient(
                  rgba(0, 0, 0, 0.20),
                  rgba(0, 0, 0, 0.65)
                ),
                url(${ganeshaImage})
              `,

              backgroundSize: "cover",

              backgroundPosition: "center",

              boxShadow:
                "0 12px 30px rgba(0,0,0,0.2)",

              transition:
                "all 0.35s ease"
            }}

            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-10px) scale(1.02)";

              e.currentTarget.style.boxShadow =
                "0 20px 40px rgba(0,0,0,0.3)";

              e.currentTarget.style.backgroundPosition =
                "center center";
            }}

            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0) scale(1)";

              e.currentTarget.style.boxShadow =
                "0 12px 30px rgba(0,0,0,0.2)";
            }}
          >

            {/* CARD CONTENT */}

            <div
              style={{
                position: "absolute",

                inset: 0,

                display: "flex",

                flexDirection: "column",

                justifyContent: "flex-end",

                alignItems: "center",

                padding: "25px",

                color: "white",

                textAlign: "center"
              }}
            >

              {/* SMALL OM */}

              <div
                style={{
                  fontSize: "30px",
                  marginBottom: "5px"
                }}
              >
                
              </div>


              {/* YEAR */}

              <h2
                style={{
                  fontSize: "45px",

                  margin: "0 0 8px",

                  fontWeight: "900",

                  color: "white",

                  textShadow:
                    "0 3px 10px rgba(0,0,0,0.7)"
                }}
              >
                {festival.year}
              </h2>


              {/* TITLE */}

              <p
                style={{
                  margin: "0 0 8px",

                  fontSize: "16px",

                  fontWeight: "bold",

                  textShadow:
                    "0 2px 5px rgba(0,0,0,0.7)"
                }}
              >
                DSB Vinayaka Mahotsav
              </p>


              {/* LOCATION */}

              <p
                style={{
                  margin: "0 0 18px",

                  fontSize: "14px",

                  textShadow:
                    "0 2px 5px rgba(0,0,0,0.7)"
                }}
              >
                📍 {festival.location}
              </p>


              {/* VIEW BUTTON */}

              <div
                style={{
                  padding: "11px 25px",

                  borderRadius: "25px",

                  background:
                    "rgba(139,37,0,0.95)",

                  color: "white",

                  fontWeight: "bold",

                  fontSize: "14px",

                  boxShadow:
                    "0 5px 15px rgba(0,0,0,0.25)"
                }}
              >
                View Festival →
              </div>

            </div>

          </button>

        ))}

      </div>


      {/* ADMIN LOGIN */}

      <div
        style={{
          textAlign: "center",
          marginTop: "60px"
        }}
      >

        <button
          onClick={() =>
            navigate("/admin")
          }

          style={{
            border: "none",

            background:
              "rgba(255,255,255,0.75)",

            padding: "12px 25px",

            borderRadius: "25px",

            color: "#8b2500",

            fontWeight: "bold",

            cursor: "pointer",

            boxShadow:
              "0 5px 15px rgba(0,0,0,0.1)"
          }}
        >
          🔐 Admin Login
        </button>

      </div>

    </div>
  );
}

export default YearSelection;