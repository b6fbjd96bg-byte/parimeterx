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
}

interface ScanResult {
  vulnerabilities: VulnerabilityResult[];
  scanInfo: {
    url: string;
    startTime: string;
    endTime: string;
    totalChecks: number;
  };
}

async function checkSecurityHeaders(url: string): Promise<VulnerabilityResult[]> {
  const vulnerabilities: VulnerabilityResult[] = [];
  
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'BreachAware Security Scanner/1.0' },
    });
    
    const headers = response.headers;
    
    // Check X-Frame-Options
    if (!headers.get('x-frame-options')) {
      vulnerabilities.push({
        title: 'Missing X-Frame-Options Header',
        severity: 'medium',
        description: 'The X-Frame-Options header is not set. This could allow clickjacking attacks where malicious sites embed your content in iframes.',
        location: 'HTTP Response Headers',
        recommendation: 'Set X-Frame-Options header to DENY or SAMEORIGIN',
        cvss_score: 4.3,
      });
    }
    
    // Check X-Content-Type-Options
    if (!headers.get('x-content-type-options')) {
      vulnerabilities.push({
        title: 'Missing X-Content-Type-Options Header',
        severity: 'low',
        description: 'The X-Content-Type-Options header is not set. This could allow MIME type sniffing attacks.',
        location: 'HTTP Response Headers',
        recommendation: 'Set X-Content-Type-Options header to nosniff',
        cvss_score: 3.1,
      });
    }
    
    // Check Strict-Transport-Security
    if (!headers.get('strict-transport-security')) {
      vulnerabilities.push({
        title: 'Missing HSTS Header',
        severity: 'high',
        description: 'HTTP Strict Transport Security (HSTS) is not enabled. This could allow downgrade attacks and cookie hijacking.',
        location: 'HTTP Response Headers',
        recommendation: 'Enable HSTS with a max-age of at least 31536000 (1 year)',
        cvss_score: 6.1,
      });
    }
    
    // Check Content-Security-Policy
    if (!headers.get('content-security-policy')) {
      vulnerabilities.push({
        title: 'Missing Content-Security-Policy Header',
        severity: 'medium',
        description: 'Content Security Policy is not configured. This makes the site more vulnerable to XSS attacks.',
        location: 'HTTP Response Headers',
        recommendation: 'Implement a strict Content-Security-Policy to prevent XSS and data injection attacks',
        cvss_score: 5.0,
      });
    }
    
    // Check X-XSS-Protection
    if (!headers.get('x-xss-protection')) {
      vulnerabilities.push({
        title: 'Missing X-XSS-Protection Header',
        severity: 'low',
        description: 'The X-XSS-Protection header is not set. While deprecated, it still provides defense in depth for older browsers.',
        location: 'HTTP Response Headers',
        recommendation: 'Set X-XSS-Protection header to 1; mode=block',
        cvss_score: 2.5,
      });
    }
    
    // Check Referrer-Policy
    if (!headers.get('referrer-policy')) {
      vulnerabilities.push({
        title: 'Missing Referrer-Policy Header',
        severity: 'low',
        description: 'Referrer-Policy is not set. This could leak sensitive URL information to third parties.',
        location: 'HTTP Response Headers',
        recommendation: 'Set Referrer-Policy to strict-origin-when-cross-origin or no-referrer',
        cvss_score: 2.0,
      });
    }
    
    // Check Permissions-Policy
    if (!headers.get('permissions-policy') && !headers.get('feature-policy')) {
      vulnerabilities.push({
        title: 'Missing Permissions-Policy Header',
        severity: 'info',
        description: 'Permissions-Policy is not set. This allows all browser features to be used.',
        location: 'HTTP Response Headers',
        recommendation: 'Set Permissions-Policy to restrict unnecessary browser features',
        cvss_score: 1.5,
      });
    }
    
    // Check Server header disclosure
    const serverHeader = headers.get('server');
    if (serverHeader && (serverHeader.includes('/') || /\d/.test(serverHeader))) {
      vulnerabilities.push({
        title: 'Server Version Disclosure',
        severity: 'info',
        description: `The server header reveals: "${serverHeader}". This information can help attackers target known vulnerabilities.`,
        location: 'Server Header',
        recommendation: 'Configure your server to hide version information',
        cvss_score: 2.0,
      });
    }
    
    // Check X-Powered-By header
    const poweredBy = headers.get('x-powered-by');
    if (poweredBy) {
      vulnerabilities.push({
        title: 'Technology Stack Disclosure',
        severity: 'info',
        description: `The X-Powered-By header reveals: "${poweredBy}". This information can be used to target specific vulnerabilities.`,
        location: 'X-Powered-By Header',
        recommendation: 'Remove or mask the X-Powered-By header',
        cvss_score: 2.0,
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
    
    // Check if using HTTPS
    if (urlObj.protocol === 'http:') {
      vulnerabilities.push({
        title: 'Insecure HTTP Connection',
        severity: 'critical',
        description: 'The website is accessible over unencrypted HTTP. All data transmitted is vulnerable to interception.',
        location: urlObj.origin,
        recommendation: 'Enforce HTTPS for all connections and redirect HTTP to HTTPS',
        cvss_score: 9.1,
        cve_id: 'CWE-319',
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
    // Check for common sensitive files
    const sensitiveFiles = [
      { path: '/.git/config', name: 'Git Configuration Exposed' },
      { path: '/.env', name: 'Environment File Exposed' },
      { path: '/wp-config.php.bak', name: 'WordPress Config Backup Exposed' },
      { path: '/.htaccess', name: 'Apache Configuration Accessible' },
      { path: '/robots.txt', name: 'Robots.txt Analysis' },
      { path: '/sitemap.xml', name: 'Sitemap Analysis' },
    ];
    
    for (const file of sensitiveFiles) {
      try {
        const response = await fetch(`${url}${file.path}`, {
          method: 'GET',
          headers: { 'User-Agent': 'BreachAware Security Scanner/1.0' },
        });
        
        if (response.ok && file.path !== '/robots.txt' && file.path !== '/sitemap.xml') {
          vulnerabilities.push({
            title: file.name,
            severity: file.path.includes('.git') || file.path.includes('.env') ? 'critical' : 'high',
            description: `Sensitive file ${file.path} is publicly accessible. This may expose configuration details, credentials, or source code.`,
            location: `${url}${file.path}`,
            recommendation: 'Block access to sensitive files via server configuration',
            cvss_score: file.path.includes('.git') || file.path.includes('.env') ? 9.0 : 7.0,
            cve_id: 'CWE-538',
          });
        }
        
        // Analyze robots.txt for interesting paths
        if (file.path === '/robots.txt' && response.ok) {
          const text = await response.text();
          const disallowedPaths = text.match(/Disallow:\s*(.+)/gi);
          if (disallowedPaths && disallowedPaths.length > 5) {
            vulnerabilities.push({
              title: 'Excessive Robots.txt Disclosure',
              severity: 'info',
              description: `Robots.txt reveals ${disallowedPaths.length} hidden paths. Attackers can use this to discover sensitive areas.`,
              location: `${url}/robots.txt`,
              recommendation: 'Review robots.txt and consider removing sensitive path disclosures',
              cvss_score: 1.5,
            });
          }
        }
      } catch {
        // File not accessible, which is good
      }
    }
    
    // Check for directory listing
    const testDirs = ['/', '/images/', '/assets/', '/uploads/'];
    for (const dir of testDirs) {
      try {
        const response = await fetch(`${url}${dir}`, {
          headers: { 'User-Agent': 'BreachAware Security Scanner/1.0' },
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
      headers: { 'User-Agent': 'BreachAware Security Scanner/1.0' },
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
          });
        }
      }
    }
    
  } catch (error) {
    console.error('Error checking cookies:', error);
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
  
  console.log('Starting vulnerability scan for:', normalizedUrl);
  
  // Run all checks
  const [headers, ssl, common, cookies] = await Promise.all([
    checkSecurityHeaders(normalizedUrl),
    checkSSLConfiguration(normalizedUrl),
    checkCommonVulnerabilities(normalizedUrl),
    checkCookieSecurity(normalizedUrl),
  ]);
  
  allVulnerabilities.push(...headers, ...ssl, ...common, ...cookies);
  
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
      totalChecks: 25,
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
    
    // Get auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify user
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
    
    console.log(`Starting scan ${scanId} for ${targetUrl}`);
    
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
