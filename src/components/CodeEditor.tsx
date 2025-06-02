
import React, { useState, useEffect, useRef } from 'react';
import { Play, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeEditorProps {
  initialCode: string;
  expectedOutput?: string;
  onRun?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, expectedOutput, onRun }) => {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('Ready to run Python code...');
  const [isRunning, setIsRunning] = useState(false);
  const executionIdRef = useRef(0);

  const executeCode = () => {
    if (!code.trim()) {
      setOutput('Please enter some Python code to execute.');
      return;
    }

    setIsRunning(true);
    setOutput('Running...');
    const executionId = ++executionIdRef.current;

    try {
      // Create output div for this execution
      const outputDiv = document.createElement('div');
      outputDiv.id = `py-output-${executionId}`;
      outputDiv.style.display = 'none';
      document.body.appendChild(outputDiv);

      // Create script element to execute Python
      const scriptElement = document.createElement('script');
      scriptElement.type = 'py';
      
      // Simple Python execution with output capture
      const pythonCode = `
import sys
import io
from contextlib import redirect_stdout
from pyscript import document

output_buffer = io.StringIO()
try:
    with redirect_stdout(output_buffer):
${code.split('\n').map(line => '        ' + line).join('\n')}
    
    result = output_buffer.getvalue()
    output_div = document.querySelector("#py-output-${executionId}")
    if output_div:
        if result.strip():
            output_div.innerText = result.strip()
        else:
            output_div.innerText = "Code executed successfully"
except Exception as e:
    output_div = document.querySelector("#py-output-${executionId}")
    if output_div:
        output_div.innerText = f"Error: {str(e)}"
`;

      scriptElement.textContent = pythonCode;
      document.body.appendChild(scriptElement);

      // Check for results
      setTimeout(() => {
        const resultDiv = document.getElementById(`py-output-${executionId}`);
        if (resultDiv) {
          setOutput(resultDiv.innerText || 'No output');
          resultDiv.remove();
        } else {
          setOutput('Execution completed');
        }
        scriptElement.remove();
        setIsRunning(false);
      }, 1000);

      onRun?.(code);
    } catch (error) {
      setOutput(`Error: ${error}`);
      setIsRunning(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeCode();
    }
    
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden border border-cyan-500/30 shadow-lg">
      <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 px-4 py-2 border-b border-cyan-500/30">
        <span className="text-cyan-400 font-mono text-sm">Python Editor</span>
        <div className="flex gap-2">
          <Button
            onClick={copyCode}
            variant="ghost"
            size="sm"
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            onClick={executeCode}
            variant="ghost"
            size="sm"
            className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
            disabled={isRunning}
          >
            <Play className="h-4 w-4 mr-1" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-32 bg-transparent text-white font-mono text-sm resize-none outline-none leading-relaxed"
          spellCheck={false}
          placeholder="Write your Python code here... (Ctrl+Enter to run)"
          style={{ tabSize: 4 }}
        />
      </div>
      
      <div className="border-t border-cyan-500/30 bg-gray-800 dark:bg-gray-900">
        <div className="px-4 py-2 text-green-400 font-mono text-sm flex items-center justify-between">
          <span>Output:</span>
          {expectedOutput && (
            <span className="text-xs text-gray-400">
              Expected: <code className="bg-gray-700 px-1 rounded">{expectedOutput}</code>
            </span>
          )}
        </div>
        <div className="px-4 pb-4 min-h-[2rem]">
          <div className={`font-mono text-sm whitespace-pre-wrap ${
            output.includes('Error:') ? 'text-red-400' : 
            output.includes('Running') ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {output}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
