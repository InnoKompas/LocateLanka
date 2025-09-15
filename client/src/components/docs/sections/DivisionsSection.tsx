import { useState } from 'react';
import { ChevronDown, ChevronUp, Code } from 'lucide-react';
import { DocsSection } from '../shared/DocsSection';
import { ApiEndpoint } from '../shared/ApiEndpoint';
import { CodeBlock } from '../shared/CodeBlock';

export const DivisionsSection = () => {
  // Code visibility state
  const [showExampleCode, setShowExampleCode] = useState(false);

  const getAllDivisionsExample = `curl -X GET "https://api.lankalocate.lk/v1/divisions" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getAllDivisionsResponse = `{
  "success": true,
  "data": [
    {
      "id": "68c6a6f8d29c0c509d8a1613",
      "name": "Fort",
      "nameEn": "Fort",
      "nameSi": "කොටුව",
      "gnNumber": "428A",
      "dsdId": "COLOMBO",
      "dsdName": "COLOMBO",
      "districtId": "COL",
      "districtName": "Colombo",
      "provinceId": "WP",
      "provinceName": "Western Province",
      "area": 0.85,
      "population": 2145
    },
    {
      "id": "68c6a6f8d29c0c509d8a1614",
      "name": "Slave Island",
      "nameEn": "Slave Island",
      "nameSi": "වහල් දිවයින",
      "gnNumber": "428B",
      "dsdId": "COLOMBO",
      "dsdName": "COLOMBO",
      "districtId": "COL",
      "districtName": "Colombo",
      "provinceId": "WP",
      "provinceName": "Western Province",
      "area": 0.42,
      "population": 1876
    }
  ],
  "meta": {
    "total": 14022,
    "page": 1,
    "limit": 50,
    "hasNext": true,
    "hasPrev": false
  }
}`;

  const getDivisionsWithFiltersExample = `curl -X GET "https://api.lankalocate.lk/v1/divisions?district=Ampara&limit=10&offset=0" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getDivisionsWithFiltersResponse = `{
  "success": true,
  "data": [
    {
      "id": "68c6a6f8d29c0c509d8a1615",
      "name": "Miriswatta",
      "nameEn": "Miriswatta",
      "nameSi": "මිරිස්වත්ත",
      "gnNumber": "138A",
      "dsdId": "PADIYATHALAWA",
      "dsdName": "PADIYATHALAWA",
      "districtId": "AMP",
      "districtName": "Ampara",
      "provinceId": "EP",
      "provinceName": "Eastern Province",
      "area": 15.89215527,
      "population": 938
    }
  ],
  "meta": {
    "total": 504,
    "page": 1,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}`;

  const getDivisionByIdExample = `curl -X GET "https://api.lankalocate.lk/v1/divisions/68c6a6f8d29c0c509d8a1613" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getDivisionByIdResponse = `{
  "success": true,
  "data": {
    "id": "68c6a6f8d29c0c509d8a1613",
    "name": "Fort",
    "nameEn": "Fort",
    "nameSi": "කොටුව",
    "gnNumber": "428A",
    "dsdId": "COLOMBO",
    "dsdName": "COLOMBO",
    "districtId": "COL",
    "districtName": "Colombo",
    "provinceId": "WP",
    "provinceName": "Western Province",
    "area": 0.85,
    "population": 2145
  }
}`;

  const getDivisionByIdWithGeometryExample = `curl -X GET "https://api.lankalocate.lk/v1/divisions/68c6a6f8d29c0c509d8a1613?includeGeometry=true" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getDivisionByIdWithGeometryResponse = `{
  "success": true,
  "data": {
    "id": "68c6a6f8d29c0c509d8a1613",
    "name": "Fort",
    "nameEn": "Fort",
    "nameSi": "කොටුව",
    "gnNumber": "428A",
    "dsdId": "COLOMBO",
    "dsdName": "COLOMBO",
    "districtId": "COL",
    "districtName": "Colombo",
    "provinceId": "WP",
    "provinceName": "Western Province",
    "area": 0.85,
    "population": 2145,
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[79.8456, 6.9344], [79.8467, 6.9355], [79.8456, 6.9344]]]
    }
  }
}`;

  const searchDivisionsExample = `curl -X GET "https://api.lankalocate.lk/v1/divisions/search?q=Miriswatta&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const searchDivisionsResponse = `{
  "success": true,
  "data": [
    {
      "id": "68c6a6f8d29c0c509d8a1613",
      "name": "Miriswatta",
      "nameEn": "Miriswatta",
      "nameSi": "මිරිස්වත්ත",
      "gnNumber": "138A",
      "dsdId": "PADIYATHALAWA",
      "dsdName": "PADIYATHALAWA",
      "districtId": "AMP",
      "districtName": "Ampara",
      "provinceId": "EP",
      "provinceName": "Eastern Province",
      "area": 15.89215527,
      "population": 938
    },
    {
      "id": "68c6a6f8d29c0c509d8a1614",
      "name": "Miriswatta2",
      "nameEn": "Miriswatta2",
      "nameSi": "මිරිස්වත්ත",
      "gnNumber": "14A",
      "dsdId": "GALLE",
      "dsdName": "GALLE",
      "districtId": "GAL",
      "districtName": "Galle",
      "provinceId": "SP",
      "provinceName": "Southern Province",
      "area": 1.6344453,
      "population": 1714
    }
  ]
}`;

  return (
    <DocsSection 
      title="GN Divisions API"
      description="Access information about all 14,000+ Grama Niladhari (GN) divisions in Sri Lanka, including their geographic boundaries and demographic data."
    >
      <div className="space-y-8">
        {/* Get All Divisions */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/divisions"
          description="Retrieve GN divisions with optional filters and pagination."
          parameters={[
            {
              name: "province",
              type: "string",
              required: false,
              description: "Filter by province name",
              example: "Western"
            },
            {
              name: "district",
              type: "string",
              required: false,
              description: "Filter by district name",
              example: "Ampara"
            },
            {
              name: "dsd",
              type: "string",
              required: false,
              description: "Filter by DSD name",
              example: "PADIYATHALAWA"
            },
            {
              name: "minPopulation",
              type: "number",
              required: false,
              description: "Minimum population filter",
              example: "1000"
            },
            {
              name: "maxPopulation",
              type: "number",
              required: false,
              description: "Maximum population filter",
              example: "5000"
            },
            {
              name: "minArea",
              type: "number",
              required: false,
              description: "Minimum area filter (km²)",
              example: "5.0"
            },
            {
              name: "maxArea",
              type: "number",
              required: false,
              description: "Maximum area filter (km²)",
              example: "50.0"
            },
            {
              name: "includeGeometry",
              type: "boolean",
              required: false,
              description: "Include GeoJSON geometry data",
              example: "false"
            },
            {
              name: "limit",
              type: "number",
              required: false,
              description: "Number of results per page (max 100)",
              example: "50"
            },
            {
              name: "offset",
              type: "number",
              required: false,
              description: "Number of results to skip",
              example: "0"
            }
          ]}
          example={getAllDivisionsExample}
          exampleResponse={getAllDivisionsResponse}
        />

        {/* Get Divisions with Filters */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/divisions?district={district}&limit={limit}"
          description="Get GN divisions with specific filters applied."
          parameters={[
            {
              name: "district",
              type: "string",
              required: true,
              description: "The name of the district to filter by",
              example: "Ampara"
            },
            {
              name: "limit",
              type: "number",
              required: false,
              description: "Number of results to return",
              example: "10"
            },
            {
              name: "offset",
              type: "number",
              required: false,
              description: "Number of results to skip",
              example: "0"
            }
          ]}
          example={getDivisionsWithFiltersExample}
          exampleResponse={getDivisionsWithFiltersResponse}
        />

        {/* Get Division by ID */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/divisions/{id}"
          description="Get detailed information about a specific GN division."
          parameters={[
            {
              name: "id",
              type: "string",
              required: true,
              description: "The unique MongoDB ObjectId of the division",
              example: "68c6a6f8d29c0c509d8a1613"
            }
          ]}
          example={getDivisionByIdExample}
          exampleResponse={getDivisionByIdResponse}
        />

        {/* Get Division by ID with Geometry */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/divisions/{id}?includeGeometry=true"
          description="Get detailed information about a specific GN division including its geographic boundaries."
          parameters={[
            {
              name: "id",
              type: "string",
              required: true,
              description: "The unique MongoDB ObjectId of the division",
              example: "68c6a6f8d29c0c509d8a1613"
            },
            {
              name: "includeGeometry",
              type: "boolean",
              required: true,
              description: "Include GeoJSON geometry data",
              example: "true"
            }
          ]}
          example={getDivisionByIdWithGeometryExample}
          exampleResponse={getDivisionByIdWithGeometryResponse}
        />

        {/* Search Divisions */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/divisions/search"
          description="Search GN divisions by name, GN number, or other identifiers."
          parameters={[
            {
              name: "q",
              type: "string",
              required: true,
              description: "Search query (name, GN number, etc.)",
              example: "Miriswatta"
            },
            {
              name: "limit",
              type: "number",
              required: false,
              description: "Number of results to return (max 100)",
              example: "10"
            },
            {
              name: "includeGeometry",
              type: "boolean",
              required: false,
              description: "Include GeoJSON geometry data",
              example: "false"
            }
          ]}
          example={searchDivisionsExample}
          exampleResponse={searchDivisionsResponse}
        />

        {/* Division Data Structure */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">GN Division Object Structure</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium text-text-primary">Field</th>
                  <th className="text-left py-2 px-3 font-medium text-text-primary">Type</th>
                  <th className="text-left py-2 px-3 font-medium text-text-primary">Description</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">id</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Unique MongoDB ObjectId for the division</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">name</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Division name in English</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">nameEn</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Division name in English</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">nameSi</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Division name in Sinhala</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">gnNumber</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Grama Niladhari number/code</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">dsdId</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Parent DSD identifier</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">dsdName</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Parent DSD name</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">districtId</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Parent district code</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">districtName</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Parent district name</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">provinceId</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Parent province code</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">provinceName</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Parent province name</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">area</td>
                  <td className="py-2 px-3">number</td>
                  <td className="py-2 px-3">Area in square kilometers</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">population</td>
                  <td className="py-2 px-3">number</td>
                  <td className="py-2 px-3">Population count (2020 census)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">geometry</td>
                  <td className="py-2 px-3">object</td>
                  <td className="py-2 px-3">GeoJSON geometry (when includeGeometry=true)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Usage Tips</h3>
          <div className="space-y-3 text-text-secondary">
            <p>
              <strong className="text-text-primary">Pagination:</strong> Use <code className="bg-surface-darker px-2 py-1 rounded">limit</code> and <code className="bg-surface-darker px-2 py-1 rounded">offset</code> parameters to paginate through large result sets. Maximum limit is 100.
            </p>
            <p>
              <strong className="text-text-primary">Geometry Data:</strong> Including geometry significantly increases response size. Only request it when you need to display boundaries on maps.
            </p>
            <p>
              <strong className="text-text-primary">Filtering:</strong> Combine multiple filters to narrow down results. For example, find divisions in a specific district with population above 2000.
            </p>
            <p>
              <strong className="text-text-primary">Search:</strong> The search endpoint supports partial matches and is case-insensitive. It searches across names and GN numbers.
            </p>
          </div>
        </div>

        {/* Implementation Examples */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Implementation Examples</h3>
              <p className="text-text-secondary mt-1">Complete code examples for integrating the GN Divisions API</p>
            </div>
            <button
              onClick={() => setShowExampleCode(!showExampleCode)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-700"
            >
              <Code className="w-4 h-4" />
              <span>{showExampleCode ? 'Hide' : 'Show'} Examples</span>
              {showExampleCode ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
          
          {showExampleCode && (
            <div className="animate-in slide-in-from-top-2 duration-300 space-y-6">
              {/* JavaScript Example */}
              <div>
                <h4 className="text-md font-semibold text-text-primary mb-3">JavaScript Implementation</h4>
                <CodeBlock 
                  code={`// GN Divisions API Client
class DivisionsAPI {
  constructor(apiKey, baseUrl = 'https://api.lankalocate.lk/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async request(endpoint) {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
    
    return await response.json();
  }

  // Get divisions with filters and pagination
  async getDivisions(filters = {}) {
    const params = new URLSearchParams();
    
    // Add filters
    if (filters.province) params.append('province', filters.province);
    if (filters.district) params.append('district', filters.district);
    if (filters.dsd) params.append('dsd', filters.dsd);
    if (filters.minPopulation) params.append('minPopulation', filters.minPopulation);
    if (filters.maxPopulation) params.append('maxPopulation', filters.maxPopulation);
    if (filters.minArea) params.append('minArea', filters.minArea);
    if (filters.maxArea) params.append('maxArea', filters.maxArea);
    if (filters.includeGeometry) params.append('includeGeometry', filters.includeGeometry);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    
    const query = params.toString() ? \`?\${params.toString()}\` : '';
    return await this.request(\`/divisions\${query}\`);
  }

  // Get division by ID
  async getDivisionById(id, includeGeometry = false) {
    const query = includeGeometry ? '?includeGeometry=true' : '';
    return await this.request(\`/divisions/\${id}\${query}\`);
  }

  // Search divisions
  async searchDivisions(query, limit = 10, includeGeometry = false) {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString()
    });
    
    if (includeGeometry) params.append('includeGeometry', 'true');
    
    return await this.request(\`/divisions/search?\${params.toString()}\`);
  }

  // Get divisions by district (helper method)
  async getDivisionsByDistrict(district, limit = 50) {
    return await this.getDivisions({ district, limit });
  }

  // Get divisions by DSD (helper method)
  async getDivisionsByDSD(dsd, limit = 50) {
    return await this.getDivisions({ dsd, limit });
  }

  // Advanced search with multiple criteria
  async advancedSearch(criteria) {
    const {
      searchText,
      province,
      district,
      dsd,
      populationRange,
      areaRange,
      includeGeometry = false,
      limit = 20
    } = criteria;

    let results = [];

    // If search text is provided, start with text search
    if (searchText) {
      const searchResults = await this.searchDivisions(searchText, limit * 2, includeGeometry);
      results = searchResults.data || [];
    } else {
      // Otherwise, get divisions with filters
      const divisionResults = await this.getDivisions({
        province,
        district,
        dsd,
        minPopulation: populationRange?.min,
        maxPopulation: populationRange?.max,
        minArea: areaRange?.min,
        maxArea: areaRange?.max,
        includeGeometry,
        limit
      });
      results = divisionResults.data || [];
    }

    // Apply additional client-side filtering if needed
    return results.slice(0, limit);
  }
}

// Usage Examples
const api = new DivisionsAPI('your-api-key');

// Get first 10 divisions
api.getDivisions({ limit: 10 })
  .then(data => {
    console.log(\`Found \${data.data.length} divisions\`);
    data.data.forEach(division => {
      console.log(\`\${division.name} (\${division.nameSi}) - GN: \${division.gnNumber}\`);
    });
  });

// Search for divisions containing "Fort"
api.searchDivisions('Fort', 5)
  .then(data => {
    console.log('Search results:');
    data.data.forEach(division => {
      console.log(\`\${division.name} in \${division.districtName}, \${division.provinceName}\`);
    });
  });

// Get divisions in Colombo district with population > 2000
api.getDivisions({
  district: 'Colombo',
  minPopulation: 2000,
  limit: 20
}).then(data => {
  console.log(\`High-population divisions in Colombo: \${data.data.length}\`);
});

// Advanced search example
api.advancedSearch({
  searchText: 'Miri',
  province: 'Eastern',
  populationRange: { min: 500, max: 5000 },
  areaRange: { min: 1, max: 50 },
  includeGeometry: false,
  limit: 10
}).then(results => {
  console.log('Advanced search results:', results);
});`}
                  language="javascript"
                  title="divisions-api.js"
                />
              </div>

              {/* React Component Example */}
              <div>
                <h4 className="text-md font-semibold text-text-primary mb-3">React Component with Search</h4>
                <CodeBlock 
                  code={`import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Users, BarChart3, Filter } from 'lucide-react';

const DivisionsExplorer = ({ apiKey }) => {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    district: '',
    province: '',
    minPopulation: '',
    maxPopulation: '',
    includeGeometry: false
  });
  const [showFilters, setShowFilters] = useState(false);

  const baseUrl = 'https://api.lankalocate.lk/v1';

  const fetchDivisions = useCallback(async () => {
    if (!apiKey) return;
    
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      // Add filters
      if (filters.district) params.append('district', filters.district);
      if (filters.province) params.append('province', filters.province);
      if (filters.minPopulation) params.append('minPopulation', filters.minPopulation);
      if (filters.maxPopulation) params.append('maxPopulation', filters.maxPopulation);
      if (filters.includeGeometry) params.append('includeGeometry', 'true');
      params.append('limit', '50');

      let endpoint = '/divisions';
      if (searchQuery.trim()) {
        endpoint = '/divisions/search';
        params.set('q', searchQuery.trim());
        params.set('limit', '20');
      }

      const response = await fetch(\`\${baseUrl}\${endpoint}?\${params.toString()}\`, {
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }

      const data = await response.json();
      setDivisions(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiKey, searchQuery, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDivisions();
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [fetchDivisions]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      district: '',
      province: '',
      minPopulation: '',
      maxPopulation: '',
      includeGeometry: false
    });
    setSearchQuery('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">🏠 GN Divisions Explorer</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search divisions by name, GN number..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        {/* Filters Toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown className={\`w-4 h-4 transform transition-transform \${showFilters ? 'rotate-180' : ''}\`} />
          </button>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Found: {divisions.length} divisions</span>
            {(searchQuery || Object.values(filters).some(v => v)) && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Province</label>
              <input
                type="text"
                value={filters.province}
                onChange={(e) => handleFilterChange('province', e.target.value)}
                placeholder="e.g., Western"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">District</label>
              <input
                type="text"
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                placeholder="e.g., Colombo"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Population</label>
              <input
                type="number"
                value={filters.minPopulation}
                onChange={(e) => handleFilterChange('minPopulation', e.target.value)}
                placeholder="1000"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Population</label>
              <input
                type="number"
                value={filters.maxPopulation}
                onChange={(e) => handleFilterChange('maxPopulation', e.target.value)}
                placeholder="10000"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="ml-2">Loading divisions...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results Grid */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {divisions.map(division => (
            <div key={division.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 truncate flex-1">
                  {division.name}
                </h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                  {division.gnNumber}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{division.nameSi}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{division.districtName}, {division.provinceName}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  <span>DSD: {division.dsdName}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{division.population?.toLocaleString() || 'N/A'} people</span>
                  </div>
                  
                  {division.area && (
                    <span className="text-xs text-gray-500">
                      {division.area.toFixed(2)} km²
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && divisions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No divisions found matching your criteria.</p>
          <p className="text-sm mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default DivisionsExplorer;`}
                  language="typescript"
                  title="DivisionsExplorer.tsx"
                />
              </div>

              {/* Python Example */}
              <div>
                <h4 className="text-md font-semibold text-text-primary mb-3">Python Data Analysis</h4>
                <CodeBlock 
                  code={`import requests
import pandas as pd
import matplotlib.pyplot as plt
from typing import Optional, List, Dict
import json

class DivisionsAnalyzer:
    def __init__(self, api_key: str, base_url: str = "https://api.lankalocate.lk/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def _make_request(self, endpoint: str) -> Dict:
        """Make HTTP request to API endpoint"""
        url = f"{self.base_url}{endpoint}"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()

    def get_divisions(self, **filters) -> List[Dict]:
        """Get divisions with various filters"""
        params = []
        
        for key, value in filters.items():
            if value is not None:
                params.append(f"{key}={value}")
        
        query = "&".join(params)
        endpoint = f"/divisions?{query}" if query else "/divisions"
        
        result = self._make_request(endpoint)
        return result.get("data", [])

    def search_divisions(self, query: str, limit: int = 50) -> List[Dict]:
        """Search divisions by text"""
        result = self._make_request(f"/divisions/search?q={query}&limit={limit}")
        return result.get("data", [])

    def get_division_by_id(self, division_id: str, include_geometry: bool = False) -> Dict:
        """Get specific division details"""
        endpoint = f"/divisions/{division_id}"
        if include_geometry:
            endpoint += "?includeGeometry=true"
        
        result = self._make_request(endpoint)
        return result.get("data", {})

    def analyze_population_distribution(self, province: Optional[str] = None) -> pd.DataFrame:
        """Analyze population distribution across divisions"""
        filters = {"limit": 1000}
        if province:
            filters["province"] = province
            
        divisions = self.get_divisions(**filters)
        
        df = pd.DataFrame(divisions)
        
        if df.empty:
            return df
            
        # Clean and prepare data
        df['population'] = pd.to_numeric(df['population'], errors='coerce')
        df['area'] = pd.to_numeric(df['area'], errors='coerce')
        df['density'] = df['population'] / df['area']
        
        return df

    def get_district_summary(self, district: str) -> Dict:
        """Get summary statistics for a district"""
        divisions = self.get_divisions(district=district, limit=1000)
        
        if not divisions:
            return {}
            
        df = pd.DataFrame(divisions)
        df['population'] = pd.to_numeric(df['population'], errors='coerce')
        df['area'] = pd.to_numeric(df['area'], errors='coerce')
        
        summary = {
            'total_divisions': len(df),
            'total_population': df['population'].sum(),
            'total_area': df['area'].sum(),
            'avg_population': df['population'].mean(),
            'avg_area': df['area'].mean(),
            'population_density': df['population'].sum() / df['area'].sum(),
            'largest_division': df.loc[df['population'].idxmax()]['name'] if not df.empty else None,
            'smallest_division': df.loc[df['population'].idxmin()]['name'] if not df.empty else None
        }
        
        return summary

    def export_to_csv(self, filename: str, **filters):
        """Export divisions data to CSV"""
        divisions = self.get_divisions(**filters)
        df = pd.DataFrame(divisions)
        df.to_csv(filename, index=False)
        print(f"Exported {len(divisions)} divisions to {filename}")

    def create_population_chart(self, district: str, save_path: Optional[str] = None):
        """Create population distribution chart for a district"""
        divisions = self.get_divisions(district=district, limit=500)
        
        if not divisions:
            print(f"No divisions found for district: {district}")
            return
            
        df = pd.DataFrame(divisions)
        df['population'] = pd.to_numeric(df['population'], errors='coerce')
        
        # Create histogram
        plt.figure(figsize=(10, 6))
        plt.hist(df['population'].dropna(), bins=30, alpha=0.7, color='skyblue', edgecolor='black')
        plt.title(f'Population Distribution - {district} District')
        plt.xlabel('Population')
        plt.ylabel('Number of Divisions')
        plt.grid(True, alpha=0.3)
        
        # Add statistics
        mean_pop = df['population'].mean()
        median_pop = df['population'].median()
        plt.axvline(mean_pop, color='red', linestyle='--', label=f'Mean: {mean_pop:.0f}')
        plt.axvline(median_pop, color='green', linestyle='--', label=f'Median: {median_pop:.0f}')
        plt.legend()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.show()

# Usage Examples
if __name__ == "__main__":
    # Initialize analyzer
    analyzer = DivisionsAnalyzer("your-api-key-here")
    
    try:
        # Get summary for Colombo district
        colombo_summary = analyzer.get_district_summary("Colombo")
        print("Colombo District Summary:")
        for key, value in colombo_summary.items():
            print(f"  {key}: {value}")
        
        # Analyze population distribution in Western Province
        western_df = analyzer.analyze_population_distribution("Western")
        print(f"\\nWestern Province Analysis:")
        print(f"Total divisions: {len(western_df)}")
        print(f"Average population: {western_df['population'].mean():.0f}")
        print(f"Population range: {western_df['population'].min():.0f} - {western_df['population'].max():.0f}")
        
        # Search for divisions with "Fort" in the name
        fort_divisions = analyzer.search_divisions("Fort")
        print(f"\\nDivisions containing 'Fort': {len(fort_divisions)}")
        for division in fort_divisions[:5]:  # Show first 5
            print(f"  {division['name']} - {division['districtName']}, {division['provinceName']}")
        
        # Export all divisions in Gampaha to CSV
        analyzer.export_to_csv("gampaha_divisions.csv", district="Gampaha")
        
        # Create population chart for Colombo
        analyzer.create_population_chart("Colombo", "colombo_population.png")
        
    except requests.exceptions.RequestException as e:
        print(f"API Error: {e}")
    except Exception as e:
        print(f"Error: {e}")`}
                  language="python"
                  title="divisions_analyzer.py"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DocsSection>
  );
};