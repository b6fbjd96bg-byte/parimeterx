import { useEffect, useState } from "react";

const SourceCodeAuditAnimation = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [vulnerabilities, setVulnerabilities] = useState<{ line: number; type: string; fixed: boolean }[]>([
    { line: 3, type: "SQLi", fixed: false },
    { line: 7, type: "XSS", fixed: false },
    { line: 12, type: "Auth", fixed: false },
    { line: 16, type: "IDOR", fixed: false },
  ]);

  const codeLines = [
    { num: 1, code: "function getUserData(userId) {", type: "normal" },
    { num: 2, code: "  const conn = db.connect();", type: "normal" },
    { num: 3, code: '  const query = "SELECT * FROM users WHERE id=" + userId;', type: "vulnerable" },
    { num: 4, code: "  const result = conn.execute(query);", type: "normal" },
    { num: 5, code: "  return result;", type: "normal" },
    { num: 6, code: "}", type: "normal" },
    { num: 7, code: "  element.innerHTML = userInput;", type: "vulnerable" },
    { num: 8, code: "  document.body.appendChild(element);", type: "normal" },
    { num: 9, code: "}", type: "normal" },
    { num: 10, code: "", type: "normal" },
    { num: 11, code: "function authenticate(user, pass) {", type: "normal" },
    { num: 12, code: '  if (pass === "admin123") return true;', type: "vulnerable" },
    { num: 13, code: "  return validateCredentials(user, pass);", type: "normal" },
    { num: 14, code: "}", type: "normal" },
    { num: 15, code: "", type: "normal" },
    { num: 16, code: "  const doc = getDocument(req.params.id);", type: "vulnerable" },
    { num: 17, code: "  return doc;", type: "normal" },
    { num: 18, code: "}", type: "normal" },
  ];

  useEffect(() => {
    const scanInterval = setInterval(() => {
      setCurrentLine((prev) => {
        const next = prev + 1;
        if (next >= codeLines.length) {
          // Reset and start fixing vulnerabilities
          setVulnerabilities((vulns) =>
            vulns.map((v, i) => ({ ...v, fixed: true }))
          );
          return 0;
        }
        
        // Check if we hit a vulnerability line
        const vuln = vulnerabilities.find((v) => v.line === next && !v.fixed);
        if (vuln) {
          setTimeout(() => {
            setVulnerabilities((vulns) =>
              vulns.map((v) => (v.line === next ? { ...v, fixed: true } : v))
            );
          }, 1000);
        }
        
        return next;
      });
    }, 300);

    // Reset vulnerabilities periodically
    const resetInterval = setInterval(() => {
      setVulnerabilities([
        { line: 3, type: "SQLi", fixed: false },
        { line: 7, type: "XSS", fixed: false },
        { line: 12, type: "Auth", fixed: false },
        { line: 16, type: "IDOR", fixed: false },
      ]);
    }, 10000);

    return () => {
      clearInterval(scanInterval);
      clearInterval(resetInterval);
    };
  }, [vulnerabilities]);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
      {/* Code editor frame */}
      <div className="absolute inset-4 rounded-xl border-2 border-[hsl(var(--color-purple-blockchain)/0.3)] bg-black/80 overflow-hidden">
        {/* Editor header */}
        <div className="h-8 bg-[hsl(var(--color-purple-blockchain)/0.1)] border-b border-[hsl(var(--color-purple-blockchain)/0.2)] flex items-center px-3 gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--color-red-team))]" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--color-green-secure))]" />
          <span className="text-xs text-[hsl(var(--color-purple-blockchain))] ml-2 font-mono">security-audit.js</span>
        </div>

        {/* Code content */}
        <div className="relative h-[calc(100%-2rem)] overflow-hidden p-2">
          {/* Scanning line indicator */}
          <div
            className="absolute left-0 right-0 h-5 bg-[hsl(var(--color-purple-blockchain)/0.2)] transition-all duration-200 pointer-events-none"
            style={{ top: `${currentLine * 18 + 8}px` }}
          />

          {/* Code lines */}
          <div className="font-mono text-xs leading-[18px] relative z-10">
            {codeLines.map((line) => {
              const vuln = vulnerabilities.find((v) => v.line === line.num);
              const isVulnerable = vuln && !vuln.fixed;
              const isFixed = vuln?.fixed;
              const isCurrentLine = currentLine === line.num - 1;

              return (
                <div
                  key={line.num}
                  className={`flex items-center transition-all duration-300 ${
                    isCurrentLine ? "bg-[hsl(var(--color-purple-blockchain)/0.1)]" : ""
                  }`}
                >
                  {/* Line number */}
                  <span className="w-8 text-muted-foreground/50 text-right pr-3 select-none">
                    {line.num}
                  </span>
                  
                  {/* Code */}
                  <span
                    className={`flex-1 transition-colors duration-300 ${
                      isVulnerable
                        ? "text-[hsl(var(--color-red-team))] bg-[hsl(var(--color-red-team)/0.1)]"
                        : isFixed
                        ? "text-[hsl(var(--color-green-secure))]"
                        : "text-gray-300"
                    }`}
                  >
                    {line.code}
                  </span>

                  {/* Vulnerability indicator */}
                  {vuln && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold transition-all duration-500 ${
                        isFixed
                          ? "bg-[hsl(var(--color-green-secure))] text-white"
                          : "bg-[hsl(var(--color-red-team))] text-white animate-pulse"
                      }`}
                    >
                      {isFixed ? "FIXED" : vuln.type}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Analysis panel */}
      <div className="absolute bottom-8 right-8 w-40 bg-black/80 rounded-lg border border-[hsl(var(--color-purple-blockchain)/0.3)] p-3">
        <div className="text-[10px] font-mono text-[hsl(var(--color-purple-blockchain))] mb-2">Analysis</div>
        <div className="space-y-1.5">
          {vulnerabilities.map((vuln, i) => (
            <div key={i} className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">Line {vuln.line}:</span>
              <span
                className={`font-bold ${
                  vuln.fixed ? "text-[hsl(var(--color-green-secure))]" : "text-[hsl(var(--color-red-team))]"
                }`}
              >
                {vuln.fixed ? "✓ Fixed" : vuln.type}
              </span>
            </div>
          ))}
        </div>
        
        {/* Progress */}
        <div className="mt-3 pt-2 border-t border-[hsl(var(--color-purple-blockchain)/0.2)]">
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--color-purple-blockchain))] transition-all duration-200"
              style={{ width: `${(currentLine / codeLines.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Magnifying glass */}
      <div className="absolute top-8 right-8 w-12 h-12 animate-bounce">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[hsl(var(--color-purple-blockchain))]">
          <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="4" />
          <line x1="58" y1="58" x2="85" y2="85" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          <circle cx="40" cy="40" r="15" fill="currentColor" opacity="0.2" className="animate-pulse" />
        </svg>
      </div>
    </div>
  );
};

export default SourceCodeAuditAnimation;
