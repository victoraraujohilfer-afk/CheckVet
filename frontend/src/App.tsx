import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import VetDashboard from "./pages/vet/Dashboard";
import VetHistory from "./pages/vet/History";
import VetConsultationNew from "./pages/vet/ConsultationNew";
import VetConsultationDetails from "./pages/vet/ConsultationDetails";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminVeterinarians from "./pages/admin/Veterinarians";
import AdminVeterinarianNew from "./pages/admin/VeterinarianNew";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />

          {/* Veterinarian routes */}
          <Route path="/vet/dashboard" element={<VetDashboard />} />
          <Route path="/vet/history" element={<VetHistory />} />
          <Route path="/vet/consultation/new" element={<VetConsultationNew />} />
          <Route path="/vet/consultation/:id" element={<VetConsultationDetails />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/veterinarians" element={<AdminVeterinarians />} />
          <Route path="/admin/veterinarians/new" element={<AdminVeterinarianNew />} />
          <Route path="/admin/veterinarians/:id" element={<ComingSoon />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* Redirects */}
          <Route path="/dashboard" element={<Navigate to="/vet/dashboard" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;