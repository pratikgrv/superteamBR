"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { TestCase } from "@/services/models/types";

interface LessonCodeEditorProps {
  initialCode?: string;
  language?: string;
  testCases?: TestCase[];
}

export function LessonCodeEditor({ initialCode = "// Write your Solana program here", language = "rust", testCases = [] }: LessonCodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [testResults, setTestResults] = useState<{id: string, description: string, passed: boolean}[] | null>(null);

  const handleRun = async () => {
    console.log("Run & Verify clicked! Starting execution...");
    setIsVerifying(true);
    setOutput("Compiling and verifying...");
    setTestResults(null);
    
    try {
      const response = await fetch("/api/lesson/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, testCases }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Execution failed");
      }
      
      setOutput(data.output);
      setTestResults(data.results);
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClear = () => {
    console.log("Clear clicked! Resetting output...");
    setOutput("");
    setTestResults(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#252526] relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="text-xs text-muted-foreground font-mono ml-2">
            main.{language === "rust" ? "rs" : "ts"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={isVerifying || (!output && !testResults)}
            className="text-muted-foreground hover:text-white h-8"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Clear
          </Button>
          <Button 
            type="button"
            onClick={handleRun} 
            disabled={isVerifying}
            size="sm"
            className="h-8 shadow-md relative z-20"
          >
            {isVerifying ? (
              "Running..."
            ) : (
              <>
                <PlayCircle className="w-4 h-4 mr-1.5" />
                Run & Verify
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 w-full relative">
        <Editor
          height="100%"
          defaultLanguage={language}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 24, bottom: 24 },
            scrollBeyondLastLine: false,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
          loading={
            <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse font-mono text-sm">
              Loading editor...
            </div>
          }
        />
      </div>

      {output && (
        <div className="h-56 border-t border-white/5 bg-[#1e1e1e] p-4 overflow-y-auto font-mono text-xs flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-white/90 mb-2 pb-2 border-b border-white/5 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Terminal Output
            </div>
            <div className={`leading-relaxed whitespace-pre-wrap ${testResults?.every(r => r.passed) === false ? "text-red-400" : "text-green-400"} opacity-90`}>
              {output}
            </div>
          </div>
          
          {testResults && testResults.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-white/90 mb-2 pb-2 border-b border-white/5 font-semibold text-sm">
                Test Cases
              </div>
              <div className="flex flex-col gap-2">
                {testResults.map((result) => (
                  <div key={result.id} className="flex items-start gap-2 text-sm">
                    {result.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    )}
                    <span className={result.passed ? "text-green-400/90" : "text-red-400/90"}>
                      {result.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
