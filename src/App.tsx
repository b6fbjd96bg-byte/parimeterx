import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
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
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";

// Dashboard Sub-pages
import ScansPage from "./pages/dashboard/ScansPage";
import VulnerabilitiesPage from "./pages/dashboard/VulnerabilitiesPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import TargetsPage from "./pages/dashboard/TargetsPage";
import ActivityPage from "./pages/dashboard/ActivityPage";

// Platform Pages
import PlatformDashboard from "./pages/platform/PlatformDashboard";
import ProgramsPage from "./pages/platform/ProgramsPage";
import VulnerabilitiesPage as PlatformVulnerabilitiesPage from "./pages/platform/VulnerabilitiesPage";
import SubmitVulnerabilityPage from "./pages/platform/SubmitVulnerabilityPage";
import VulnerabilityDetailPage from "./pages/platform/VulnerabilityDetailPage";
import UsersPage from "./pages/platform/UsersPage";
import InvitationsPage from "./pages/platform/InvitationsPage";
import ReportsPage as PlatformReportsPage from "./pages/platform/ReportsPage";
import AuditLogsPage from "./pages/platform/AuditLogsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <LoadingScreen />
        <CustomCursor />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Platform Routes */}
            <Route path="/platform" element={<ProtectedRoute><PlatformDashboard /></ProtectedRoute>} />
            <Route path="/platform/programs" element={<ProtectedRoute><ProgramsPage /></ProtectedRoute>} />
            <Route path="/platform/vulnerabilities" element={<ProtectedRoute><VulnerabilitiesPage /></ProtectedRoute>} />
            <Route path="/platform/vulnerabilities/new" element={<ProtectedRoute><SubmitVulnerabilityPage /></ProtectedRoute>} />
            <Route path="/platform/vulnerabilities/:id" element={<ProtectedRoute><VulnerabilityDetailPage /></ProtectedRoute>} />
            <Route path="/platform/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
            <Route path="/platform/invitations" element={<ProtectedRoute><InvitationsPage /></ProtectedRoute>} />
            <Route path="/platform/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
            <Route path="/platform/audit-logs" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
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
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
