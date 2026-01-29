import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import WebApplicationSecurity from "./pages/WebApplicationSecurity";
import GetSecurityAudit from "./pages/GetSecurityAudit";
import ApplicationPentest from "./pages/ApplicationPentest";
import EnterprisePentest from "./pages/EnterprisePentest";
import RedTeamAssessment from "./pages/RedTeamAssessment";
import CloudPentest from "./pages/CloudPentest";
import NetworkPentest from "./pages/NetworkPentest";
import SourceCodeAudit from "./pages/SourceCodeAudit";
import IoTPentest from "./pages/IoTPentest";
import AISecurityAssessment from "./pages/AISecurityAssessment";
import BlockchainSecurity from "./pages/BlockchainSecurity";
import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LoadingScreen />
      <CustomCursor />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/get-security-audit" element={<GetSecurityAudit />} />
          <Route path="/services/application-pentest" element={<ApplicationPentest />} />
          <Route path="/services/enterprise-pentest" element={<EnterprisePentest />} />
          <Route path="/services/red-team-assessment" element={<RedTeamAssessment />} />
          <Route path="/services/cloud-pentest" element={<CloudPentest />} />
          <Route path="/services/network-pentest" element={<NetworkPentest />} />
          <Route path="/services/source-code-audit" element={<SourceCodeAudit />} />
          <Route path="/services/iot-pentest" element={<IoTPentest />} />
          <Route path="/services/ai-security-assessment" element={<AISecurityAssessment />} />
          <Route path="/services/blockchain-security" element={<BlockchainSecurity />} />
          <Route path="/services/web-application-security" element={<WebApplicationSecurity />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
