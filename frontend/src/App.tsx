import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Role } from "@/types/api";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import VetDashboard from "./pages/vet/Dashboard";
import VetHistory from "./pages/vet/History";
import VetConsultationNew from "./pages/vet/ConsultationNew";
import VetConsultationDetails from "./pages/vet/ConsultationDetails";
import VetProtocols from "./pages/vet/Protocols";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminVeterinarians from "./pages/admin/Veterinarians";
import AdminVeterinarianNew from "./pages/admin/VeterinarianNew";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const vetRoles = [Role.VETERINARIAN, Role.ADMIN];
const adminRoles = [Role.ADMIN];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/change-password" element={
              <ProtectedRoute allowedRoles={vetRoles}><ChangePassword /></ProtectedRoute>
            } />

            {/* Veterinarian routes */}
            <Route path="/vet/dashboard" element={
              <ProtectedRoute allowedRoles={vetRoles}><VetDashboard /></ProtectedRoute>
            } />
            <Route path="/vet/history" element={
              <ProtectedRoute allowedRoles={vetRoles}><VetHistory /></ProtectedRoute>
            } />
            <Route path="/vet/consultation/new" element={
              <ProtectedRoute allowedRoles={vetRoles}><VetConsultationNew /></ProtectedRoute>
            } />
            <Route path="/vet/consultation/:id" element={
              <ProtectedRoute allowedRoles={vetRoles}><VetConsultationDetails /></ProtectedRoute>
            } />
            {/* ✅ NOVA ROTA: Meus Protocolos */}
            <Route path="/vet/protocols" element={
              <ProtectedRoute allowedRoles={vetRoles}><VetProtocols /></ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={adminRoles}><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/veterinarians" element={
              <ProtectedRoute allowedRoles={adminRoles}><AdminVeterinarians /></ProtectedRoute>
            } />
            <Route path="/admin/veterinarians/new" element={
              <ProtectedRoute allowedRoles={adminRoles}><AdminVeterinarianNew /></ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute allowedRoles={adminRoles}><AdminAnalytics /></ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRoles={adminRoles}><AdminSettings /></ProtectedRoute>
            } />

            {/* Redirects */}
            <Route path="/dashboard" element={<Navigate to="/vet/dashboard" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;