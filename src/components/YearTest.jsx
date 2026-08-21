import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function YearTest() {
  const [years, setYears] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadYears();
  }, []);

  async function loadYears() {
    const { data, error } = await supabase
      .from("festival_years")
      .select("*")
      .order("year", { ascending: true });

    if (error) {
      console.error(error);
      setError(error.message);
      return;
    }

    setYears(data || []);
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>🕉️ DSB Vinayaka Mahotsav</h1>

      <h2>Festival Years</h2>

      {error && (
        <p style={{ color: "red" }}>
          Error: {error}
        </p>
      )}

      {years.map((festival) => (
        <div key={festival.id}>
          <h3>{festival.year}</h3>
          <p>{festival.title}</p>
        </div>
      ))}
    </div>
  );
}

export default YearTest;