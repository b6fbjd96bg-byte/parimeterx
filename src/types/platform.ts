// Platform Types for Cybersecurity Management System

export type AppRole = 'admin' | 'pentester' | 'client';

export type ProgramStatus = 'draft' | 'active' | 'paused' | 'completed';

export type VulnerabilitySeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export type VulnerabilityStatus = 'new' | 'triaged' | 'accepted' | 'in_progress' | 'resolved' | 'rejected' | 'duplicate';

export type AssetType = 'domain' | 'subdomain' | 'ip_address' | 'ip_range' | 'api' | 'mobile_app' | 'other';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: AppRole;
  token: string;
  invited_by: string;
  accepted_at: string | null;
  expires_at: string;
  created_at: string;
}

export interface Program {
  id: string;
  name: string;
  description: string | null;
  client_id: string;
  status: ProgramStatus;
  start_date: string | null;
  end_date: string | null;
  rules_of_engagement: string | null;
  testing_guidelines: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined data
  client?: UserProfile;
  assets?: ProgramAsset[];
  pentesters?: ProgramPentester[];
  slas?: SeveritySLA[];
  vulnerability_count?: number;
}

export interface ProgramAsset {
  id: string;
  program_id: string;
  asset_type: AssetType;
  asset_value: string;
  is_in_scope: boolean;
  notes: string | null;
  created_at: string;
}

export interface SeveritySLA {
  id: string;
  program_id: string;
  severity: VulnerabilitySeverity;
  response_hours: number;
  resolution_days: number;
  created_at: string;
}

export interface ProgramPentester {
  id: string;
  program_id: string;
  pentester_id: string;
  assigned_by: string;
  assigned_at: string;
  // Joined data
  pentester?: UserProfile;
}

export interface VulnerabilityReport {
  id: string;
  program_id: string;
  submitted_by: string;
  title: string;
  severity: VulnerabilitySeverity;
  status: VulnerabilityStatus;
  cwe_id: string | null;
  owasp_category: string | null;
  affected_endpoint: string | null;
  steps_to_reproduce: string | null;
  proof_of_concept: string | null;
  impact: string | null;
  remediation: string | null;
  cvss_score: number | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  submitter?: UserProfile;
  program?: Program;
  attachments?: ReportAttachment[];
  comments?: ReportComment[];
}

export interface ReportAttachment {
  id: string;
  report_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
}

export interface ReportComment {
  id: string;
  report_id: string;
  user_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: UserProfile;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  // Joined data
  user?: UserProfile;
}

// Statistics types
export interface DashboardStats {
  totalPrograms: number;
  activePrograms: number;
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  resolvedVulnerabilities: number;
  pendingVulnerabilities: number;
}

export interface ProgramStats {
  total_vulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  informational: number;
  resolved: number;
  pending: number;
}

// CWE Categories for vulnerability classification
export const CWE_CATEGORIES = [
  { id: 'CWE-79', name: 'Cross-site Scripting (XSS)' },
  { id: 'CWE-89', name: 'SQL Injection' },
  { id: 'CWE-22', name: 'Path Traversal' },
  { id: 'CWE-352', name: 'Cross-Site Request Forgery (CSRF)' },
  { id: 'CWE-287', name: 'Improper Authentication' },
  { id: 'CWE-862', name: 'Missing Authorization' },
  { id: 'CWE-918', name: 'Server-Side Request Forgery (SSRF)' },
  { id: 'CWE-502', name: 'Deserialization of Untrusted Data' },
  { id: 'CWE-611', name: 'XXE (XML External Entity)' },
  { id: 'CWE-94', name: 'Code Injection' },
  { id: 'CWE-78', name: 'OS Command Injection' },
  { id: 'CWE-434', name: 'Unrestricted File Upload' },
  { id: 'CWE-200', name: 'Information Disclosure' },
  { id: 'CWE-306', name: 'Missing Authentication' },
  { id: 'CWE-639', name: 'IDOR (Insecure Direct Object Reference)' },
];

export const OWASP_CATEGORIES = [
  { id: 'A01', name: 'Broken Access Control' },
  { id: 'A02', name: 'Cryptographic Failures' },
  { id: 'A03', name: 'Injection' },
  { id: 'A04', name: 'Insecure Design' },
  { id: 'A05', name: 'Security Misconfiguration' },
  { id: 'A06', name: 'Vulnerable and Outdated Components' },
  { id: 'A07', name: 'Identification and Authentication Failures' },
  { id: 'A08', name: 'Software and Data Integrity Failures' },
  { id: 'A09', name: 'Security Logging and Monitoring Failures' },
  { id: 'A10', name: 'Server-Side Request Forgery (SSRF)' },
];

export const SEVERITY_COLORS: Record<VulnerabilitySeverity, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  informational: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export const STATUS_COLORS: Record<VulnerabilityStatus, string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  triaged: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  accepted: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  in_progress: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  duplicate: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};
