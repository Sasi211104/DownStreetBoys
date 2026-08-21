import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const AdminYearContext = createContext();

export function AdminYearProvider({ children }) {
  const [years, setYears] = useState([]);
  const [activeYear, setActiveYear] = useState(() => {
    return Number(localStorage.getItem("admin_active_year")) || 2026;
  });
  const [activeYearId, setActiveYearId] = useState(null);
  const [loadingYears, setLoadingYears] = useState(true);

  useEffect(() => {
    fetchYears();
  }, []);

  async function fetchYears() {
    setLoadingYears(true);
    const { data, error } = await supabase
      .from("festival_years")
      .select("*")
      .order("year", { ascending: false });

    if (!error && data && data.length > 0) {
      setYears(data);
      const savedYear = Number(localStorage.getItem("admin_active_year"));
      const match = data.find((y) => y.year === savedYear) || data[0];
      setActiveYear(match.year);
      setActiveYearId(match.id);
      localStorage.setItem("admin_active_year", String(match.year));
    }
    setLoadingYears(false);
  }

  function changeYear(yearNum) {
    const num = Number(yearNum);
    setActiveYear(num);
    localStorage.setItem("admin_active_year", String(num));
    const match = years.find((y) => y.year === num);
    if (match) {
      setActiveYearId(match.id);
    }
  }

  return (
    <AdminYearContext.Provider
      value={{
        years,
        activeYear,
        activeYearId,
        changeYear,
        fetchYears,
        loadingYears,
      }}
    >
      {children}
    </AdminYearContext.Provider>
  );
}

export function useAdminYear() {
  const context = useContext(AdminYearContext);
  if (!context) {
    throw new Error("useAdminYear must be used within an AdminYearProvider");
  }
  return context;
}