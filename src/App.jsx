import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import FestivalPage from "./pages/FestivalPage";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageSchedule from "./pages/admin/ManageSchedule";
import ManageDonations from "./pages/admin/ManageDonations";
import ProtectedRoute from "./pages/admin/ProtectedRoute";
import { AdminYearProvider } from "./pages/admin/AdminYearContext";
import ManageGallery from "./pages/admin/ManageGallery";
import ManageIdol from "./pages/admin/ManageIdol";

function App() {
  return (
    <AdminYearProvider>
      <BrowserRouter>
        <Routes>
          {/* Visitor Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/festival/:year" element={<FestivalPage />} />

          {/* Admin Login */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute>
                <ManageEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schedule"
            element={
              <ProtectedRoute>
                <ManageSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/donations"
            element={
              <ProtectedRoute>
                <ManageDonations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <ProtectedRoute>
                <ManageGallery />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/idol" element={<ManageIdol />} />
            <Route path="/admin/idols" element={<ManageIdol />} />
            <Route path="/admin/idol-sponsor" element={<ManageIdol />} 
          />
        </Routes>
      </BrowserRouter>
    </AdminYearProvider>
  );
}

export default App;