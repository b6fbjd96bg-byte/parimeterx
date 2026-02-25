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
import AdminLogin from "./pages/AdminLogin";
import ProtectorsLogin from "./pages/ProtectorsLogin";
import Dashboard from "./pages/Dashboard";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/platform/RoleGuard";
import LoadingScreen from "./components/LoadingScreen";

import ScrollToTop from "./components/ScrollToTop";

// Dashboard Sub-pages
import ScansPage from "./pages/dashboard/ScansPage";
import DashboardVulnerabilitiesPage from "./pages/dashboard/VulnerabilitiesPage";
import DashboardReportsPage from "./pages/dashboard/ReportsPage";
import TargetsPage from "./pages/dashboard/TargetsPage";
import ActivityPage from "./pages/dashboard/ActivityPage";

// Platform Pages
import PlatformDashboard from "./pages/platform/PlatformDashboard";
import ProgramsPage from "./pages/platform/ProgramsPage";
import PlatformVulnerabilitiesPage from "./pages/platform/VulnerabilitiesPage";
import SubmitVulnerabilityPage from "./pages/platform/SubmitVulnerabilityPage";
import VulnerabilityDetailPage from "./pages/platform/VulnerabilityDetailPage";
import UsersPage from "./pages/platform/UsersPage";
import InvitationsPage from "./pages/platform/InvitationsPage";
import PlatformReportsPage from "./pages/platform/ReportsPage";
import AuditLogsPage from "./pages/platform/AuditLogsPage";
import ProgramDetailPage from "./pages/platform/ProgramDetailPage";
import PentesterProgramDetailPage from "./pages/platform/PentesterProgramDetailPage";
import ClientProgramDetailPage from "./pages/platform/ClientProgramDetailPage";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <LoadingScreen />
        
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/AdMiN_loggin" element={<AdminLogin />} />
            <Route path="/prOtectors" element={<ProtectorsLogin />} />
            
            {/* Dashboard Routes - Admin only */}
            <Route path="/dashboard" element={<RoleGuard allowedRoles={['admin']}><Dashboard /></RoleGuard>} />
            <Route path="/dashboard/scans" element={<RoleGuard allowedRoles={['admin']}><ScansPage /></RoleGuard>} />
            <Route path="/dashboard/vulnerabilities" element={<RoleGuard allowedRoles={['admin']}><DashboardVulnerabilitiesPage /></RoleGuard>} />
            <Route path="/dashboard/reports" element={<RoleGuard allowedRoles={['admin']}><DashboardReportsPage /></RoleGuard>} />
            <Route path="/dashboard/targets" element={<RoleGuard allowedRoles={['admin']}><TargetsPage /></RoleGuard>} />
            <Route path="/dashboard/activity" element={<RoleGuard allowedRoles={['admin']}><ActivityPage /></RoleGuard>} />
            
            {/* Platform Routes - Role-based */}
            <Route path="/platform" element={<RoleGuard allowedRoles={['admin', 'pentester', 'client']}><PlatformDashboard /></RoleGuard>} />
            <Route path="/platform/programs" element={<RoleGuard allowedRoles={['admin', 'pentester', 'client']}><ProgramsPage /></RoleGuard>} />
            <Route path="/platform/programs/:id" element={<RoleGuard allowedRoles={['admin', 'pentester', 'client']}><ProgramDetailPage /></RoleGuard>} />
            <Route path="/platform/programs/:id/pentest" element={<RoleGuard allowedRoles={['admin', 'pentester', 'client']}><PentesterProgramDetailPage /></RoleGuard>} />
            <Route path="/platform/programs/:id/client" element={<RoleGuard allowedRoles={['admin', 'pentester', 'client']}><ClientProgramDetailPage /></RoleGuard>} />
            <Route path="/platform/vulnerabilities" element={<RoleGuard allowedRoles={['admin', 'pentester', 'client']}><PlatformVulnerabilitiesPage /></RoleGuard>} />
            <Route path="/platform/vulnerabilities/new" element={<RoleGuard allowedRoles={['admin', 'pentester']}><SubmitVulnerabilityPage /></RoleGuard>} />
            <Route path="/platform/vulnerabilities/:id" element={<RoleGuard allowedRoles={['admin', 'pentester', 'client']}><VulnerabilityDetailPage /></RoleGuard>} />
            <Route path="/platform/users" element={<RoleGuard allowedRoles={['admin']}><UsersPage /></RoleGuard>} />
            <Route path="/platform/invitations" element={<RoleGuard allowedRoles={['admin']}><InvitationsPage /></RoleGuard>} />
            <Route path="/platform/reports" element={<RoleGuard allowedRoles={['admin', 'pentester', 'client']}><PlatformReportsPage /></RoleGuard>} />
            <Route path="/platform/audit-logs" element={<RoleGuard allowedRoles={['admin']}><AuditLogsPage /></RoleGuard>} />
            
            {/* Service Pages */}
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
