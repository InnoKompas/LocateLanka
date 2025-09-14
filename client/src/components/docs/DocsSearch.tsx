import { useState, useRef, useEffect } from 'react';
import { Search, Command } from 'lucide-react';

interface DocsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const DocsSearch = ({ searchQuery, onSearchChange }: DocsSearchProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="mb-8">
      <div className="max-w-2xl mx-auto">
        <div className={`relative transition-all duration-200 ${
          isFocused ? 'transform scale-105' : ''
        }`}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-text-secondary" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full pl-12 pr-16 py-4 
              bg-surface border-2 border-border 
              rounded-xl text-text-primary placeholder-text-secondary
              focus:border-border-focus focus:outline-none focus:ring-4 focus:ring-primary-100
              transition-all duration-200
              ${isFocused ? 'shadow-lg' : 'shadow-sm'}
            `}
          />
          
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <div className="flex items-center space-x-1 text-xs text-text-secondary bg-surface-variant px-2 py-1 rounded border">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </div>
        </div>

        {searchQuery && (
          <div className="mt-4 p-4 bg-surface border border-border rounded-lg shadow-sm">
            <p className="text-sm text-text-secondary">
              Searching for: <span className="font-medium text-text-primary">"{searchQuery}"</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
