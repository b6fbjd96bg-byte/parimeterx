import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.93.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface VulnerabilityResult {
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  description: string;
  location: string;
  recommendation: string;
  cvss_score: number;
  cve_id?: string;
  category: string;
}

interface ScanResult {
  vulnerabilities: VulnerabilityResult[];
  scanInfo: {
    url: string;
    startTime: string;
    endTime: string;
    totalChecks: number;
    technologies: string[];
    subdomains: string[];
    openPorts: { port: number; service: string; state: string }[];
  };
}

// Technology fingerprinting patterns
const techPatterns: Record<string, { pattern: RegExp | string; header?: string }[]> = {
  'WordPress': [
    { pattern: /wp-content|wp-includes/i },
    { pattern: 'X-Powered-By', header: 'X-Powered-By' },
  ],
  'React': [
    { pattern: /__REACT_|react-root|data-reactroot/i },
  ],
  'Angular': [
    { pattern: /ng-version|ng-app|angular/i },
  ],
  'Vue.js': [
    { pattern: /vue-|data-v-|__vue__/i },
  ],
  'Next.js': [
    { pattern: /__NEXT_DATA__|_next\/static/i },
  ],
  'jQuery': [
    { pattern: /jquery[.-]?\d|jquery\.min\.js/i },
  ],
  'Bootstrap': [
    { pattern: /bootstrap[.-]?\d|bootstrap\.min/i },
  ],
  'Nginx': [
    { pattern: /nginx/i, header: 'Server' },
  ],
  'Apache': [
    { pattern: /Apache/i, header: 'Server' },
  ],
  'Express': [
    { pattern: /Express/i, header: 'X-Powered-By' },
  ],
  'PHP': [
    { pattern: /PHP\/\d/i, header: 'X-Powered-By' },
  ],
  'ASP.NET': [
    { pattern: /ASP\.NET/i, header: 'X-Powered-By' },
  ],
  'Cloudflare': [
    { pattern: /cloudflare/i, header: 'Server' },
  ],
  'AWS': [
    { pattern: /AmazonS3|awselb|CloudFront/i, header: 'Server' },
  ],
  'Google Cloud': [
    { pattern: /Google Frontend|GFE/i, header: 'Server' },
  ],
  'Vercel': [
    { pattern: /Vercel/i, header: 'Server' },
  ],
  'Netlify': [
    { pattern: /Netlify/i, header: 'Server' },
  ],
};

// Common ports to check
const commonPorts = [
  { port: 21, service: 'FTP' },
  { port: 22, service: 'SSH' },
  { port: 23, service: 'Telnet' },
  { port: 25, service: 'SMTP' },
  { port: 80, service: 'HTTP' },
  { port: 443, service: 'HTTPS' },
  { port: 3306, service: 'MySQL' },
  { port: 5432, service: 'PostgreSQL' },
  { port: 6379, service: 'Redis' },
  { port: 8080, service: 'HTTP-Proxy' },
  { port: 8443, service: 'HTTPS-Alt' },
  { port: 27017, service: 'MongoDB' },
];

async function checkSecurityHeaders(url: string): Promise<VulnerabilityResult[]> {
  const vulnerabilities: VulnerabilityResult[] = [];
  
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'BreachAware Security Scanner/2.0' },
    });
    
    const headers = response.headers;
    
    if (!headers.get('x-frame-options')) {
      vulnerabilities.push({
        title: 'Missing X-Frame-Options Header',
        severity: 'medium',
        description: 'The X-Frame-Options header is not set. This could allow clickjacking attacks where malicious sites embed your content in iframes.',
        location: 'HTTP Response Headers',
        recommendation: 'Set X-Frame-Options header to DENY or SAMEORIGIN',
        cvss_score: 4.3,
        category: 'Security Headers',
      });
    }
    
    if (!headers.get('x-content-type-options')) {
      vulnerabilities.push({
        title: 'Missing X-Content-Type-Options Header',
        severity: 'low',
        description: 'The X-Content-Type-Options header is not set. This could allow MIME type sniffing attacks.',
        location: 'HTTP Response Headers',
        recommendation: 'Set X-Content-Type-Options header to nosniff',
        cvss_score: 3.1,
        category: 'Security Headers',
      });
    }
    
    if (!headers.get('strict-transport-security')) {
      vulnerabilities.push({
        title: 'Missing HSTS Header',
        severity: 'high',
        description: 'HTTP Strict Transport Security (HSTS) is not enabled. This could allow downgrade attacks and cookie hijacking.',
        location: 'HTTP Response Headers',
        recommendation: 'Enable HSTS with a max-age of at least 31536000 (1 year)',
        cvss_score: 6.1,
        category: 'Security Headers',
      });
    }
    
    if (!headers.get('content-security-policy')) {
      vulnerabilities.push({
        title: 'Missing Content-Security-Policy Header',
        severity: 'medium',
        description: 'Content Security Policy is not configured. This makes the site more vulnerable to XSS attacks.',
        location: 'HTTP Response Headers',
        recommendation: 'Implement a strict Content-Security-Policy to prevent XSS and data injection attacks',
        cvss_score: 5.0,
        category: 'Security Headers',
      });
    }
    
    if (!headers.get('x-xss-protection')) {
      vulnerabilities.push({
        title: 'Missing X-XSS-Protection Header',
        severity: 'low',
        description: 'The X-XSS-Protection header is not set. While deprecated, it still provides defense in depth for older browsers.',
        location: 'HTTP Response Headers',
        recommendation: 'Set X-XSS-Protection header to 1; mode=block',
        cvss_score: 2.5,
        category: 'Security Headers',
      });
    }
    
    if (!headers.get('referrer-policy')) {
      vulnerabilities.push({
        title: 'Missing Referrer-Policy Header',
        severity: 'low',
        description: 'Referrer-Policy is not set. This could leak sensitive URL information to third parties.',
        location: 'HTTP Response Headers',
        recommendation: 'Set Referrer-Policy to strict-origin-when-cross-origin or no-referrer',
        cvss_score: 2.0,
        category: 'Security Headers',
      });
    }
    
    if (!headers.get('permissions-policy') && !headers.get('feature-policy')) {
      vulnerabilities.push({
        title: 'Missing Permissions-Policy Header',
        severity: 'info',
        description: 'Permissions-Policy is not set. This allows all browser features to be used.',
        location: 'HTTP Response Headers',
        recommendation: 'Set Permissions-Policy to restrict unnecessary browser features',
        cvss_score: 1.5,
        category: 'Security Headers',
      });
    }
    
    const serverHeader = headers.get('server');
    if (serverHeader && (serverHeader.includes('/') || /\d/.test(serverHeader))) {
      vulnerabilities.push({
        title: 'Server Version Disclosure',
        severity: 'info',
        description: `The server header reveals: "${serverHeader}". This information can help attackers target known vulnerabilities.`,
        location: 'Server Header',
        recommendation: 'Configure your server to hide version information',
        cvss_score: 2.0,
        category: 'Information Disclosure',
      });
    }
    
    const poweredBy = headers.get('x-powered-by');
    if (poweredBy) {
      vulnerabilities.push({
        title: 'Technology Stack Disclosure',
        severity: 'info',
        description: `The X-Powered-By header reveals: "${poweredBy}". This information can be used to target specific vulnerabilities.`,
        location: 'X-Powered-By Header',
        recommendation: 'Remove or mask the X-Powered-By header',
        cvss_score: 2.0,
        category: 'Information Disclosure',
      });
    }
    
  } catch (error) {
    console.error('Error checking security headers:', error);
  }
  
  return vulnerabilities;
}

async function checkSSLConfiguration(url: string): Promise<VulnerabilityResult[]> {
  const vulnerabilities: VulnerabilityResult[] = [];
  
  try {
    const urlObj = new URL(url);
    
    if (urlObj.protocol === 'http:') {
      vulnerabilities.push({
        title: 'Insecure HTTP Connection',
        severity: 'critical',
        description: 'The website is accessible over unencrypted HTTP. All data transmitted is vulnerable to interception.',
        location: urlObj.origin,
        recommendation: 'Enforce HTTPS for all connections and redirect HTTP to HTTPS',
        cvss_score: 9.1,
        cve_id: 'CWE-319',
        category: 'SSL/TLS',
      });
    }
    
  } catch (error) {
    console.error('Error checking SSL:', error);
  }
  
  return vulnerabilities;
}

async function checkCommonVulnerabilities(url: string): Promise<VulnerabilityResult[]> {
  const vulnerabilities: VulnerabilityResult[] = [];
  
  try {
    const sensitiveFiles = [
      { path: '/.git/config', name: 'Git Configuration Exposed', severity: 'critical' as const },
      { path: '/.env', name: 'Environment File Exposed', severity: 'critical' as const },
      { path: '/.svn/entries', name: 'SVN Configuration Exposed', severity: 'high' as const },
      { path: '/wp-config.php.bak', name: 'WordPress Config Backup Exposed', severity: 'critical' as const },
      { path: '/.htaccess', name: 'Apache Configuration Accessible', severity: 'medium' as const },
      { path: '/phpinfo.php', name: 'PHP Info Page Exposed', severity: 'high' as const },
      { path: '/server-status', name: 'Server Status Page Exposed', severity: 'medium' as const },
      { path: '/elmah.axd', name: 'ELMAH Error Log Exposed', severity: 'high' as const },
      { path: '/trace.axd', name: 'ASP.NET Trace Exposed', severity: 'high' as const },
      { path: '/.DS_Store', name: 'macOS DS_Store Exposed', severity: 'low' as const },
      { path: '/backup.sql', name: 'SQL Backup File Exposed', severity: 'critical' as const },
      { path: '/database.sql', name: 'Database Dump Exposed', severity: 'critical' as const },
      { path: '/debug.log', name: 'Debug Log File Exposed', severity: 'medium' as const },
      { path: '/error.log', name: 'Error Log File Exposed', severity: 'medium' as const },
      { path: '/composer.json', name: 'Composer Configuration Exposed', severity: 'low' as const },
      { path: '/package.json', name: 'NPM Package Config Exposed', severity: 'low' as const },
      { path: '/config.php', name: 'PHP Config File Exposed', severity: 'high' as const },
      { path: '/web.config', name: 'IIS Web.config Exposed', severity: 'high' as const },
      { path: '/crossdomain.xml', name: 'Flash Crossdomain Policy', severity: 'low' as const },
      { path: '/clientaccesspolicy.xml', name: 'Silverlight Access Policy', severity: 'low' as const },
    ];
    
    const checkPromises = sensitiveFiles.map(async (file) => {
      try {
        const response = await fetch(`${url}${file.path}`, {
          method: 'GET',
          headers: { 'User-Agent': 'BreachAware Security Scanner/2.0' },
        });
        
        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          // Skip if it returns HTML (likely an error page)
          if (!contentType.includes('text/html') || file.path.endsWith('.html')) {
            return {
              title: file.name,
              severity: file.severity,
              description: `Sensitive file ${file.path} is publicly accessible. This may expose configuration details, credentials, or source code.`,
              location: `${url}${file.path}`,
              recommendation: 'Block access to sensitive files via server configuration',
              cvss_score: file.severity === 'critical' ? 9.0 : file.severity === 'high' ? 7.0 : 4.0,
              cve_id: 'CWE-538',
              category: 'Sensitive File Exposure',
            };
          }
        }
      } catch {
        // File not accessible
      }
      return null;
    });
    
    const results = await Promise.all(checkPromises);
    vulnerabilities.push(...results.filter((v): v is VulnerabilityResult => v !== null));
    
    // Check for directory listing
    const testDirs = ['/', '/images/', '/assets/', '/uploads/', '/backup/', '/admin/', '/api/'];
    for (const dir of testDirs) {
      try {
        const response = await fetch(`${url}${dir}`, {
          headers: { 'User-Agent': 'BreachAware Security Scanner/2.0' },
        });
        const text = await response.text();
        
        if (text.includes('Index of') || text.includes('Directory listing') || text.includes('[To Parent Directory]')) {
          vulnerabilities.push({
            title: 'Directory Listing Enabled',
            severity: 'medium',
            description: `Directory listing is enabled at ${dir}. Attackers can browse and discover files.`,
            location: `${url}${dir}`,
            recommendation: 'Disable directory listing in server configuration',
            cvss_score: 4.3,
            cve_id: 'CWE-548',
            category: 'Misconfiguration',
          });
          break;
        }
      } catch {
        // Skip on error
      }
    }
    
  } catch (error) {
    console.error('Error checking common vulnerabilities:', error);
  }
  
  return vulnerabilities;
}

async function checkCookieSecurity(url: string): Promise<VulnerabilityResult[]> {
  const vulnerabilities: VulnerabilityResult[] = [];
  
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'BreachAware Security Scanner/2.0' },
    });
    
    const setCookieHeaders = response.headers.get('set-cookie');
    
    if (setCookieHeaders) {
      const cookies = setCookieHeaders.split(',');
      
      for (const cookie of cookies) {
        const cookieName = cookie.split('=')[0].trim();
        
        if (!cookie.toLowerCase().includes('httponly')) {
          vulnerabilities.push({
            title: 'Cookie Missing HttpOnly Flag',
            severity: 'medium',
            description: `Cookie "${cookieName}" is accessible via JavaScript, making it vulnerable to XSS attacks.`,
            location: 'Set-Cookie Header',
            recommendation: 'Add the HttpOnly flag to sensitive cookies',
            cvss_score: 4.0,
            cve_id: 'CWE-1004',
            category: 'Cookie Security',
          });
        }
        
        if (!cookie.toLowerCase().includes('secure')) {
          vulnerabilities.push({
            title: 'Cookie Missing Secure Flag',
            severity: 'medium',
            description: `Cookie "${cookieName}" can be transmitted over unencrypted HTTP connections.`,
            location: 'Set-Cookie Header',
            recommendation: 'Add the Secure flag to all cookies',
            cvss_score: 4.0,
            cve_id: 'CWE-614',
            category: 'Cookie Security',
          });
        }
        
        if (!cookie.toLowerCase().includes('samesite')) {
          vulnerabilities.push({
            title: 'Cookie Missing SameSite Attribute',
            severity: 'low',
            description: `Cookie "${cookieName}" lacks SameSite attribute, potentially vulnerable to CSRF.`,
            location: 'Set-Cookie Header',
            recommendation: 'Add SameSite=Strict or SameSite=Lax to cookies',
            cvss_score: 3.0,
            cve_id: 'CWE-1275',
            category: 'Cookie Security',
          });
        }
      }
    }
    
  } catch (error) {
    console.error('Error checking cookies:', error);
  }
  
  return vulnerabilities;
}

async function detectTechnologies(url: string, headers: Headers, bodyContent: string): Promise<string[]> {
  const detectedTechnologies: Set<string> = new Set();
  
  for (const [tech, patterns] of Object.entries(techPatterns)) {
    for (const { pattern, header } of patterns) {
      if (header) {
        const headerValue = headers.get(header);
        if (headerValue && typeof pattern !== 'string' && pattern.test(headerValue)) {
          detectedTechnologies.add(tech);
        } else if (headerValue && typeof pattern === 'string' && headerValue.toLowerCase().includes(pattern.toLowerCase())) {
          detectedTechnologies.add(tech);
        }
      } else if (typeof pattern !== 'string' && pattern.test(bodyContent)) {
        detectedTechnologies.add(tech);
      }
    }
  }
  
  // Additional detection from meta tags
  const generatorMatch = bodyContent.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)["']/i);
  if (generatorMatch) {
    detectedTechnologies.add(generatorMatch[1]);
  }
  
  return Array.from(detectedTechnologies);
}

// Helper function for fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function discoverSubdomains(domain: string): Promise<string[]> {
  const subdomains: string[] = [];
  // Reduced list for faster scanning - prioritize most common/critical subdomains
  const commonSubdomains = [
    'www', 'mail', 'api', 'dev', 'staging', 'test', 'beta', 'app', 'admin',
    'cdn', 'static', 'auth', 'login', 'dashboard', 'm', 'docs', 'support',
  ];
  
  const checkPromises = commonSubdomains.map(async (sub) => {
    try {
      const subdomain = `${sub}.${domain}`;
      const response = await fetchWithTimeout(`https://${subdomain}`, {
        method: 'HEAD',
        headers: { 'User-Agent': 'BreachAware Security Scanner/2.0' },
      }, 3000);
      if (response.ok || response.status < 500) {
        return subdomain;
      }
    } catch {
      // Subdomain doesn't exist, timeout, or not accessible
    }
    return null;
  });
  
  const results = await Promise.all(checkPromises);
  subdomains.push(...results.filter((s): s is string => s !== null));
  
  return subdomains;
}

async function scanPorts(host: string): Promise<{ port: number; service: string; state: string }[]> {
  const openPorts: { port: number; service: string; state: string }[] = [];
  
  // Note: In edge functions we can't do raw TCP connections, so we check HTTP-based ports
  const httpPorts = [80, 443, 8080, 8443, 3000, 5000, 8000];
  
  const checkPromises = httpPorts.map(async (port) => {
    try {
      const protocol = port === 443 || port === 8443 ? 'https' : 'http';
      const response = await fetchWithTimeout(`${protocol}://${host}:${port}`, {
        method: 'HEAD',
        headers: { 'User-Agent': 'BreachAware Security Scanner/2.0' },
      }, 3000);
      
      const service = commonPorts.find(p => p.port === port)?.service || 'Unknown';
      return { port, service, state: 'open' };
    } catch {
      return null;
    }
  });
  
  const results = await Promise.all(checkPromises);
  openPorts.push(...results.filter((p): p is { port: number; service: string; state: string } => p !== null));
  
  return openPorts;
}

async function checkForVulnerableVersions(technologies: string[], bodyContent: string): Promise<VulnerabilityResult[]> {
  const vulnerabilities: VulnerabilityResult[] = [];
  
  // Check for jQuery versions with known vulnerabilities
  const jqueryMatch = bodyContent.match(/jquery[.-](\d+\.\d+\.\d+)/i);
  if (jqueryMatch) {
    const version = jqueryMatch[1];
    const [major, minor] = version.split('.').map(Number);
    if (major < 3 || (major === 3 && minor < 5)) {
      vulnerabilities.push({
        title: 'Outdated jQuery Version',
        severity: 'medium',
        description: `jQuery version ${version} detected. This version may contain known security vulnerabilities.`,
        location: 'JavaScript Libraries',
        recommendation: 'Upgrade to jQuery 3.5.0 or later to address XSS vulnerabilities',
        cvss_score: 6.1,
        cve_id: 'CVE-2020-11022',
        category: 'Outdated Software',
      });
    }
  }
  
  // Check for WordPress with visible version
  const wpVersionMatch = bodyContent.match(/WordPress\s+(\d+\.\d+(?:\.\d+)?)/i);
  if (wpVersionMatch) {
    vulnerabilities.push({
      title: 'WordPress Version Disclosure',
      severity: 'low',
      description: `WordPress version ${wpVersionMatch[1]} is visible in page source. This helps attackers target known vulnerabilities.`,
      location: 'Page Source',
      recommendation: 'Remove WordPress version from HTML source and update to latest version',
      cvss_score: 2.0,
      category: 'Information Disclosure',
    });
  }
  
  // Check for Angular with visible version
  const angularMatch = bodyContent.match(/ng-version="(\d+\.\d+\.\d+)"/);
  if (angularMatch) {
    const version = angularMatch[1];
    const [major] = version.split('.').map(Number);
    if (major < 12) {
      vulnerabilities.push({
        title: 'Outdated Angular Version',
        severity: 'medium',
        description: `Angular version ${version} detected. Older versions may have security vulnerabilities.`,
        location: 'JavaScript Framework',
        recommendation: 'Upgrade to Angular 12 or later for security patches',
        cvss_score: 5.0,
        category: 'Outdated Software',
      });
    }
  }
  
  return vulnerabilities;
}

async function performScan(targetUrl: string): Promise<ScanResult> {
  const startTime = new Date().toISOString();
  const allVulnerabilities: VulnerabilityResult[] = [];
  
  // Ensure URL has protocol
  let normalizedUrl = targetUrl.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`;
  }
  
  console.log('Starting comprehensive vulnerability scan for:', normalizedUrl);
  
  // Extract domain for subdomain discovery and port scanning
  const urlObj = new URL(normalizedUrl);
  const domain = urlObj.hostname;
  
  // Fetch the main page for technology detection
  let bodyContent = '';
  let responseHeaders: Headers | null = null;
  try {
    const response = await fetch(normalizedUrl, {
      headers: { 'User-Agent': 'BreachAware Security Scanner/2.0' },
    });
    bodyContent = await response.text();
    responseHeaders = response.headers;
  } catch (error) {
    console.error('Error fetching main page:', error);
  }
  
  // Run all checks in parallel
  const [headers, ssl, common, cookies, subdomains, ports] = await Promise.all([
    checkSecurityHeaders(normalizedUrl),
    checkSSLConfiguration(normalizedUrl),
    checkCommonVulnerabilities(normalizedUrl),
    checkCookieSecurity(normalizedUrl),
    discoverSubdomains(domain),
    scanPorts(domain),
  ]);
  
  // Detect technologies
  const technologies = responseHeaders ? await detectTechnologies(normalizedUrl, responseHeaders, bodyContent) : [];
  
  // Check for vulnerable versions
  const versionVulns = await checkForVulnerableVersions(technologies, bodyContent);
  
  allVulnerabilities.push(...headers, ...ssl, ...common, ...cookies, ...versionVulns);
  
  // Add info about discovered subdomains
  if (subdomains.length > 3) {
    allVulnerabilities.push({
      title: 'Multiple Subdomains Discovered',
      severity: 'info',
      description: `Found ${subdomains.length} active subdomains. Review for potential attack surface: ${subdomains.slice(0, 5).join(', ')}${subdomains.length > 5 ? '...' : ''}`,
      location: domain,
      recommendation: 'Ensure all subdomains are properly secured and monitored',
      cvss_score: 1.0,
      category: 'Reconnaissance',
    });
  }
  
  // Add info about open ports
  const nonStandardPorts = ports.filter(p => ![80, 443].includes(p.port));
  if (nonStandardPorts.length > 0) {
    allVulnerabilities.push({
      title: 'Non-Standard Ports Open',
      severity: 'low',
      description: `Found ${nonStandardPorts.length} non-standard HTTP ports open: ${nonStandardPorts.map(p => `${p.port} (${p.service})`).join(', ')}`,
      location: domain,
      recommendation: 'Review open ports and close unnecessary services',
      cvss_score: 2.0,
      category: 'Network',
    });
  }
  
  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  allVulnerabilities.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  
  const endTime = new Date().toISOString();
  
  return {
    vulnerabilities: allVulnerabilities,
    scanInfo: {
      url: normalizedUrl,
      startTime,
      endTime,
      totalChecks: 50,
      technologies,
      subdomains,
      openPorts: ports,
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { scanId, targetUrl } = await req.json();
    
    if (!scanId || !targetUrl) {
      return new Response(
        JSON.stringify({ error: 'scanId and targetUrl are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Starting comprehensive scan ${scanId} for ${targetUrl}`);
    
    // Update scan status to running
    await supabaseClient
      .from('scans')
      .update({ status: 'running', started_at: new Date().toISOString(), progress: 10 })
      .eq('id', scanId);
    
    // Perform the actual scan
    const scanResult = await performScan(targetUrl);
    
    // Update progress
    await supabaseClient
      .from('scans')
      .update({ progress: 80 })
      .eq('id', scanId);
    
    // Save vulnerabilities to database
    if (scanResult.vulnerabilities.length > 0) {
      const vulnerabilitiesToInsert = scanResult.vulnerabilities.map(v => ({
        scan_id: scanId,
        title: v.title,
        severity: v.severity,
        description: v.description,
        location: v.location,
        recommendation: v.recommendation,
        cvss_score: v.cvss_score,
        cve_id: v.cve_id || null,
        status: 'open',
      }));
      
      const { error: insertError } = await supabaseClient
        .from('vulnerabilities')
        .insert(vulnerabilitiesToInsert);
      
      if (insertError) {
        console.error('Error inserting vulnerabilities:', insertError);
      }
    }
    
    // Mark scan as completed
    await supabaseClient
      .from('scans')
      .update({ 
        status: 'completed', 
        progress: 100, 
        completed_at: new Date().toISOString() 
      })
      .eq('id', scanId);
    
    console.log(`Scan ${scanId} completed with ${scanResult.vulnerabilities.length} findings`);
    console.log(`Technologies detected: ${scanResult.scanInfo.technologies.join(', ')}`);
    console.log(`Subdomains found: ${scanResult.scanInfo.subdomains.length}`);
    console.log(`Open ports: ${scanResult.scanInfo.openPorts.map(p => p.port).join(', ')}`);
    
    return new Response(
      JSON.stringify({
        success: true,
        vulnerabilities: scanResult.vulnerabilities.length,
        scanInfo: scanResult.scanInfo,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Scan error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Scan failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
