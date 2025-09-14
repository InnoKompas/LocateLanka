import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '../../ui/Button';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  filename?: string;
}

export const CodeBlock = ({ code, language, title, filename }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative group">
      {(title || filename) && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 rounded-t-lg">
          <div className="flex items-center space-x-2">
            {filename && (
              <span className="text-gray-400 text-sm font-mono">{filename}</span>
            )}
            {title && (
              <span className="text-gray-300 text-sm font-medium">{title}</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      )}
      
      <div className="relative">
        <pre className={`
          bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm font-mono leading-relaxed
          ${title || filename ? 'rounded-t-none rounded-b-lg' : 'rounded-lg'}
        `}>
          <code className={`language-${language}`}>
            {code}
          </code>
        </pre>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className={`
            absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
            bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600
          `}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
