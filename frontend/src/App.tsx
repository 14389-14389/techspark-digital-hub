import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServiceDetail from "./pages/ServiceDetail";

// Admin Imports
import { AdminProvider } from "./contexts/AdminContext";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import GalleryUpload from "./pages/admin/GalleryUpload";
import GalleryManagement from "./pages/admin/GalleryManagement";
import ContactsManagement from "./pages/admin/ContactsManagement";
import ServicesManagement from "./pages/admin/ServicesManagement";
import QuotesManagement from "./pages/admin/QuotesManagement";
import Settings from "./pages/admin/Settings";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

// ✅ ScrollToTop component for hash links
const ScrollToTop = () => {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <Toaster />
        <Sonner />
        {/* ✅ ADDED FUTURE FLAGS TO FIX WARNINGS */}
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          {/* ✅ ADDED ScrollToTop COMPONENT */}
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/service/:serviceName" element={<ServiceDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/gallery/upload" 
              element={
                <ProtectedRoute>
                  <GalleryUpload />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/gallery" 
              element={
                <ProtectedRoute>
                  <GalleryManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/contacts"
              element={
                <ProtectedRoute>
                  <ContactsManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/services"
              element={
                <ProtectedRoute>
                  <ServicesManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/quotes"
              element={
                <ProtectedRoute>
                  <QuotesManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;