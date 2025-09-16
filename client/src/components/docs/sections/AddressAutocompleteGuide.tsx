import { useState, useCallback, useEffect, useRef } from 'react';
import { DocsSection } from "../shared/DocsSection";
import { CodeBlock } from "../shared/CodeBlock";
import { demoService } from '../../../services/demo.service';
import type { District, DSD } from '../../../services/location.service';

interface AutocompleteResult {
  id: string;
  name: string;
  nameEn: string;
  type: 'division' | 'district' | 'dsd';
  district?: string;
  province?: string;
  dsd?: string;
}

export const AddressAutocompleteGuide = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AutocompleteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<AutocompleteResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Search GN divisions first (most specific) using demo service
      const divisions = await demoService.searchDivisions(searchQuery, 5);
      
      // For demo purposes, we'll focus on divisions only to keep it simple
      // In production, you would implement similar search for districts and DSDs
      let districts: District[] = [];
      let dsds: DSD[] = [];
      
      // Note: Demo endpoints are limited, so we only search divisions
      // Production implementation would search all location types

      // Transform results into unified format
      const autocompleteResults: AutocompleteResult[] = [
        ...divisions.map(div => ({
          id: div.id,
          name: div.name,
          nameEn: div.nameEn || div.name,
          type: 'division' as const,
          district: div.districtName,
          province: div.provinceName,
          dsd: div.dsdName
        })),
        ...districts.map(dist => ({
          id: dist.id.toString(),
          name: dist.name,
          nameEn: dist.name,
          type: 'district' as const,
          province: dist.province
        })),
        ...dsds.map(dsd => ({
          id: dsd.id,
          name: dsd.name,
          nameEn: dsd.nameEn || dsd.name,
          type: 'dsd' as const,
          district: dsd.districtName,
          province: dsd.provinceName
        }))
      ];

      setResults(autocompleteResults);
      setShowDropdown(autocompleteResults.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedResult(null);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle result selection
  const handleResultSelect = (result: AutocompleteResult) => {
    setSelectedResult(result);
    setQuery(result.nameEn);
    setShowDropdown(false);
    setResults([]);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'division': return 'GN Division';
      case 'district': return 'District';
      case 'dsd': return 'DSD';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'division': return 'bg-blue-100 text-blue-800';
      case 'district': return 'bg-green-100 text-green-800';
      case 'dsd': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DocsSection 
      title="Address Autocomplete" 
      description="Build intelligent address autocomplete functionality with the LankaLocate API"
    >
      <div className="space-y-8">
        {/* Interactive Demo */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-heading-3 mb-4">🎯 Interactive Demo</h3>
          <p className="text-text-secondary mb-6">
            Try searching for any location in Sri Lanka. This demo searches GN divisions using our secure demo endpoints.
          </p>

          <div className="relative max-w-md" ref={dropdownRef}>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search for a location (e.g., Colombo, Kandy, Galle)"
                className="form-input w-full pr-10"
                autoComplete="off"
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="loading-spinner w-4 h-4"></div>
                </div>
              )}
            </div>

            {/* Dropdown Results */}
            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {results.length > 0 ? (
                  results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultSelect(result)}
                      className="w-full px-4 py-3 text-left hover:bg-surface-variant border-b border-border last:border-b-0 focus:bg-surface-variant focus:outline-none"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-text-primary truncate">
                            {result.nameEn}
                          </div>
                          {result.name !== result.nameEn && (
                            <div className="text-sm text-text-secondary truncate">
                              {result.name}
                            </div>
                          )}
                          <div className="text-xs text-text-secondary mt-1">
                            {result.type === 'division' && result.dsd && (
                              <span>{result.dsd} • </span>
                            )}
                            {result.district && <span>{result.district} • </span>}
                            {result.province}
                          </div>
                        </div>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getTypeColor(result.type)}`}>
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-text-secondary text-center">
                    No results found for "{query}"
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-error-50 border border-red-200 rounded-lg">
              <p className="text-error-600 text-sm">{error}</p>
            </div>
          )}

          {selectedResult && (
            <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <h4 className="font-medium text-primary-800 mb-2">Selected Location:</h4>
              <div className="text-sm text-primary-700">
                <div><strong>Name:</strong> {selectedResult.nameEn}</div>
                {selectedResult.name !== selectedResult.nameEn && (
                  <div><strong>Local Name:</strong> {selectedResult.name}</div>
                )}
                <div><strong>Type:</strong> {getTypeLabel(selectedResult.type)}</div>
                <div><strong>ID:</strong> {selectedResult.id}</div>
                {selectedResult.dsd && <div><strong>DSD:</strong> {selectedResult.dsd}</div>}
                {selectedResult.district && <div><strong>District:</strong> {selectedResult.district}</div>}
                {selectedResult.province && <div><strong>Province:</strong> {selectedResult.province}</div>}
              </div>
            </div>
          )}
        </div>

        {/* Implementation Guide */}
        <div className="space-y-6">
          <h3 className="text-heading-2">Implementation Guide</h3>

          {/* Step 1: Basic Setup */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="text-heading-3 mb-4">1. Basic Autocomplete Component</h4>
            <p className="text-text-secondary mb-4">
              Start with a basic React component that handles user input and displays results:
            </p>
            <CodeBlock
              language="tsx"
              code={`import React, { useState, useCallback, useRef, useEffect } from 'react';
import { locationService } from './services/location.service';

interface AutocompleteResult {
  id: string;
  name: string;
  nameEn: string;
  type: 'division' | 'district' | 'dsd';
  district?: string;
  province?: string;
  dsd?: string;
}

export const AddressAutocomplete: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AutocompleteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      // Search across multiple location types
      const divisions = await locationService.searchDivisions(searchQuery, 5);
      
      // Transform to unified format
      const autocompleteResults = divisions.map(div => ({
        id: div.id,
        name: div.name,
        nameEn: div.nameEn || div.name,
        type: 'division' as const,
        district: div.districtName,
        province: div.provinceName,
        dsd: div.dsdName
      }));

      setResults(autocompleteResults);
      setShowDropdown(autocompleteResults.length > 0);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced input handler
  const handleInputChange = (value: string) => {
    setQuery(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300); // 300ms debounce
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Search for a location..."
        className="w-full px-4 py-2 border rounded-lg"
      />
      
      {isLoading && <div className="loading-indicator">Searching...</div>}
      
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {results.map((result) => (
            <button
              key={\`\${result.type}-\${result.id}\`}
              onClick={() => {
                setQuery(result.nameEn);
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50"
            >
              <div className="font-medium">{result.nameEn}</div>
              <div className="text-sm text-gray-500">
                {result.district} • {result.province}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};`}
            />
          </div>

          {/* Best Practices */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="text-heading-3 mb-4">💡 Best Practices</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Debounce Input:</strong> Use 300ms debouncing to avoid excessive API calls while typing.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Cache Results:</strong> Cache search results for 5 minutes to improve performance.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Minimum Query Length:</strong> Only search when query is at least 2 characters long.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Multi-language Support:</strong> Search both English and Sinhala/Tamil names.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Keyboard Navigation:</strong> Support arrow keys, Enter, and Escape for accessibility.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Loading States:</strong> Show clear loading indicators during search.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Error Handling:</strong> Gracefully handle API errors and network issues.
                </div>
              </div>
            </div>
          </div>

          {/* API Endpoints Used */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="text-heading-3 mb-4">📡 Production API Endpoints</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="badge badge-primary">GET</span>
                <code className="text-sm">/api/v1/divisions/search?q=&#123;query&#125;&limit=&#123;limit&#125;</code>
              </div>
              <div className="flex items-center space-x-3">
                <span className="badge badge-primary">GET</span>
                <code className="text-sm">/api/v1/districts</code>
              </div>
              <div className="flex items-center space-x-3">
                <span className="badge badge-primary">GET</span>
                <code className="text-sm">/api/v1/dsds</code>
              </div>
            </div>
            <p className="text-text-secondary text-sm mt-4">
              <strong>Production:</strong> Include your API key in the Authorization header: <code>Bearer YOUR_API_KEY</code>
            </p>
            
            <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <h4 className="font-medium text-primary-800 mb-2">Demo Endpoints (This Demo Only)</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="badge badge-success text-xs">DEMO</span>
                  <code className="text-xs text-primary-700">/api/v1/demo/divisions/search?q=&#123;query&#125;</code>
                </div>
              </div>
              <p className="text-primary-700 text-xs mt-2">
                Demo endpoints use JWT tokens and are domain-restricted for security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DocsSection>
  );
};
