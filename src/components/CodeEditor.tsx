import React, { useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Copy, Download, Play, Code2 } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onPreview: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, onPreview }) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure HTML language features
    monaco.languages.html.htmlDefaults.setOptions({
      format: {
        tabSize: 2,
        insertSpaces: true,
        wrapLineLength: 120,
        unformatted: 'default"',
        contentUnformatted: 'pre,code,textarea',
        indentInnerHtml: false,
        preserveNewLines: true,
        maxPreserveNewLines: undefined,
        indentHandlebars: false,
        endWithNewline: false,
        extraLiners: 'head, body, /html',
        wrapAttributes: 'auto'
      },
      suggest: {
        html5: true,
        angular1: false,
        ionic: false
      }
    });

    // Auto-format on paste and type
    editor.addAction({
      id: 'format-document',
      label: 'Format Document',
      keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
      run: () => {
        editor.getAction('editor.action.formatDocument').run();
      }
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-medium text-gray-300">HTML Code</h3>
          <div className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
            {code.split('\n').length} lines
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleFormat}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Format code (Shift+Alt+F)"
          >
            <Code2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Copy code"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Download HTML file"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onPreview}
            className="p-1.5 text-purple-400 hover:text-purple-300 hover:bg-gray-700 rounded transition-colors"
            title="Refresh preview"
          >
            <Play className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="html"
          value={code}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: true, scale: 0.5 },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
            lineNumbers: 'on',
            wordWrap: 'on',
            folding: true,
            foldingStrategy: 'indentation',
            bracketPairColorization: { enabled: true },
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: false,
            trimAutoWhitespace: true,
            renderWhitespace: 'selection',
            renderControlCharacters: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            mouseWheelZoom: true,
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true
            },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            snippetSuggestions: 'top',
            emptySelectionClipboard: false,
            copyWithSyntaxHighlighting: true,
            multiCursorModifier: 'ctrlCmd',
            accessibilitySupport: 'auto',
            find: {
              addExtraSpaceOnTop: false,
              autoFindInSelection: 'never',
              seedSearchStringFromSelection: 'always'
            }
          }}
        />
        
        {/* Code stats overlay */}
        <div className="absolute bottom-2 right-2 bg-gray-800/90 text-xs text-gray-400 px-2 py-1 rounded backdrop-blur-sm">
          {code.length} chars
        </div>
      </div>
    </div>
  );
};