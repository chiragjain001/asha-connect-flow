import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./pages/WelcomeScreen";
import ASHADashboard from "./pages/ASHADashboard";
import PatientRegistration from "./pages/PatientRegistration";
import PatientDetails from "./pages/PatientDetails";
import SyncScreen from "./pages/SyncScreen";
import PHCDashboard from "./pages/PHCDashboard";
import AIAlerts from "./pages/AIAlerts";
import P2PSync from "./pages/P2PSync";
import FormsDemo from "./pages/FormsDemo";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/asha-dashboard" element={<ASHADashboard />} />
          <Route path="/patient-registration" element={<PatientRegistration />} />
          <Route path="/patient/:id" element={<PatientDetails />} />
          <Route path="/sync" element={<SyncScreen />} />
          <Route path="/phc-dashboard" element={<PHCDashboard />} />
          <Route path="/ai-alerts" element={<AIAlerts />} />
        <Route path="/p2p-sync" element={<P2PSync />} />
        <Route path="/forms-demo" element={<FormsDemo />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;