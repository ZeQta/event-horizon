import React, { useRef, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, RotateCcw } from 'lucide-react';

interface PreviewPanelProps {
  code: string;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewMode, setViewMode] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    if (iframeRef.current && code) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
      }
    }
  }, [code]);

  const getViewportStyle = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <h3 className="text-sm font-medium text-gray-300">Live Preview</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'desktop'
                ? 'text-purple-400 bg-gray-700'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Desktop view"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'tablet'
                ? 'text-purple-400 bg-gray-700'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Tablet view"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'mobile'
                ? 'text-purple-400 bg-gray-700'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-600 mx-1" />
          <button
            onClick={handleRefresh}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Refresh preview"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 p-4 bg-gray-800 overflow-auto">
        <div className="flex items-center justify-center h-full">
          <div
            className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300"
            style={getViewportStyle()}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>
      </div>
    </div>
  );
};