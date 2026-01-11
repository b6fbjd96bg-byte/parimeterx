import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import PenetrationTesting from "./pages/PenetrationTesting";
import VulnerabilityAssessment from "./pages/VulnerabilityAssessment";
import RedTeamOperations from "./pages/RedTeamOperations";
import WebApplicationSecurity from "./pages/WebApplicationSecurity";
import CloudSecurityAssessment from "./pages/CloudSecurityAssessment";
import ComplianceAuditing from "./pages/ComplianceAuditing";
import BlockchainSecurity from "./pages/BlockchainSecurity";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services/penetration-testing" element={<PenetrationTesting />} />
          <Route path="/services/vulnerability-assessment" element={<VulnerabilityAssessment />} />
          <Route path="/services/red-team-operations" element={<RedTeamOperations />} />
          <Route path="/services/web-application-security" element={<WebApplicationSecurity />} />
          <Route path="/services/cloud-security-assessment" element={<CloudSecurityAssessment />} />
          <Route path="/services/compliance-auditing" element={<ComplianceAuditing />} />
          <Route path="/services/blockchain-security" element={<BlockchainSecurity />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
