import { useState } from 'react';
import { ChevronDown, ChevronUp, Code } from 'lucide-react';
import { DocsSection } from '../shared/DocsSection';
import { ApiEndpoint } from '../shared/ApiEndpoint';
import { CodeBlock } from '../shared/CodeBlock';

export const DSDsSection = () => {
  // Code visibility state
  const [showExampleCode, setShowExampleCode] = useState(false);

  const getAllDSDsExample = `curl -X GET "https://api.lankalocate.lk/v1/dsds" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getAllDSDsResponse = `{
  "success": true,
  "data": [
    {
      "id": "COLOMBO",
      "name": "COLOMBO",
      "nameEn": "COLOMBO",
      "code": "COLOMBO",
      "districtId": "COL",
      "districtName": "Colombo",
      "provinceId": "WP",
      "provinceName": "Western Province",
      "divisionCount": 47
    },
    {
      "id": "DEHIWALA-MOUNT LAVINIA",
      "name": "DEHIWALA-MOUNT LAVINIA",
      "nameEn": "DEHIWALA-MOUNT LAVINIA",
      "code": "DEHIWALA-MOUNT LAVINIA",
      "districtId": "COL",
      "districtName": "Colombo",
      "provinceId": "WP",
      "provinceName": "Western Province",
      "divisionCount": 32
    }
  ],
  "meta": {
    "total": 338,
    "page": 1,
    "limit": 50,
    "hasNext": true,
    "hasPrev": false
  }
}`;

  const getDSDsByDistrictExample = `curl -X GET "https://api.lankalocate.lk/v1/dsds?district=Ampara" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getDSDsByDistrictResponse = `{
  "success": true,
  "data": [
    {
      "id": "ADDALAICHENAI",
      "name": "ADDALAICHENAI",
      "nameEn": "ADDALAICHENAI",
      "code": "ADDALAICHENAI",
      "districtId": "AMP",
      "districtName": "Ampara",
      "provinceId": "EP",
      "provinceName": "Eastern Province",
      "divisionCount": 32
    },
    {
      "id": "AKKARAIPATTU",
      "name": "AKKARAIPATTU",
      "nameEn": "AKKARAIPATTU",
      "code": "AKKARAIPATTU",
      "districtId": "AMP",
      "districtName": "Ampara",
      "provinceId": "EP",
      "provinceName": "Eastern Province",
      "divisionCount": 28
    }
  ]
}`;

  const getDSDsByProvinceExample = `curl -X GET "https://api.lankalocate.lk/v1/dsds?province=Eastern" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getDSDsByProvinceResponse = `{
  "success": true,
  "data": [
    {
      "id": "ADDALAICHENAI",
      "name": "ADDALAICHENAI",
      "nameEn": "ADDALAICHENAI",
      "code": "ADDALAICHENAI",
      "districtId": "AMP",
      "districtName": "Ampara",
      "provinceId": "EP",
      "provinceName": "Eastern Province",
      "divisionCount": 32
    }
  ]
}`;

  const getDSDByIdExample = `curl -X GET "https://api.lankalocate.lk/v1/dsds/PADIYATHALAWA" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getDSDByIdResponse = `{
  "success": true,
  "data": {
    "id": "PADIYATHALAWA",
    "name": "PADIYATHALAWA",
    "nameEn": "PADIYATHALAWA",
    "code": "PADIYATHALAWA",
    "districtId": "AMP",
    "districtName": "Ampara",
    "provinceId": "EP",
    "provinceName": "Eastern Province",
    "divisionCount": 20
  }
}`;

  const getDivisionsByDSDExample = `curl -X GET "https://api.lankalocate.lk/v1/dsds/PADIYATHALAWA/divisions" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getDivisionsByDSDResponse = `{
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
      "name": "Serankada",
      "nameEn": "Serankada",
      "nameSi": "සේරන්කඩ",
      "gnNumber": "137A",
      "dsdId": "PADIYATHALAWA",
      "dsdName": "PADIYATHALAWA",
      "districtId": "AMP",
      "districtName": "Ampara",
      "provinceId": "EP",
      "provinceName": "Eastern Province",
      "area": 8.83705211,
      "population": 1209
    }
  ],
  "meta": {
    "total": 20,
    "page": 1,
    "limit": 50,
    "hasNext": false,
    "hasPrev": false
  }
}`;

  const getDivisionsByDSDWithGeometryExample = `curl -X GET "https://api.lankalocate.lk/v1/dsds/PADIYATHALAWA/divisions?includeGeometry=true" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getDivisionsByDSDWithGeometryResponse = `{
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
      "population": 938,
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[81.123, 7.456], [81.124, 7.457], [81.123, 7.456]]]
      }
    }
  ]
}`;

  return (
    <DocsSection 
      title="DSDs API"
      description="Access information about all 338 Divisional Secretariat Divisions (DSDs) in Sri Lanka, including their GN divisions and administrative details."
    >
      <div className="space-y-8">
        {/* Get All DSDs */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/dsds"
          description="Retrieve a list of all DSDs in Sri Lanka with basic information."
          parameters={[
            {
              name: "district",
              type: "string",
              required: false,
              description: "Filter DSDs by district name or code",
              example: "Ampara"
            },
            {
              name: "province",
              type: "string",
              required: false,
              description: "Filter DSDs by province name",
              example: "Eastern"
            }
          ]}
          example={getAllDSDsExample}
          exampleResponse={getAllDSDsResponse}
        />

        {/* Get DSDs by District */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/dsds?district={district}"
          description="Get all DSDs within a specific district."
          parameters={[
            {
              name: "district",
              type: "string",
              required: true,
              description: "The name or code of the district",
              example: "Ampara"
            }
          ]}
          example={getDSDsByDistrictExample}
          exampleResponse={getDSDsByDistrictResponse}
        />

        {/* Get DSDs by Province */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/dsds?province={province}"
          description="Get all DSDs within a specific province."
          parameters={[
            {
              name: "province",
              type: "string",
              required: true,
              description: "The name of the province",
              example: "Eastern"
            }
          ]}
          example={getDSDsByProvinceExample}
          exampleResponse={getDSDsByProvinceResponse}
        />

        {/* Get DSD by ID */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/dsds/{id}"
          description="Get detailed information about a specific DSD."
          parameters={[
            {
              name: "id",
              type: "string",
              required: true,
              description: "The name/identifier of the DSD",
              example: "PADIYATHALAWA"
            }
          ]}
          example={getDSDByIdExample}
          exampleResponse={getDSDByIdResponse}
        />

        {/* Get GN Divisions by DSD */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/dsds/{id}/divisions"
          description="Get all GN divisions within a specific DSD."
          parameters={[
            {
              name: "id",
              type: "string",
              required: true,
              description: "The name/identifier of the DSD",
              example: "PADIYATHALAWA"
            },
            {
              name: "includeGeometry",
              type: "boolean",
              required: false,
              description: "Include GeoJSON geometry data",
              example: "true"
            }
          ]}
          example={getDivisionsByDSDExample}
          exampleResponse={getDivisionsByDSDResponse}
        />

        {/* Get GN Divisions by DSD with Geometry */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/dsds/{id}/divisions?includeGeometry=true"
          description="Get all GN divisions within a specific DSD including their geographic boundaries."
          parameters={[
            {
              name: "id",
              type: "string",
              required: true,
              description: "The name/identifier of the DSD",
              example: "PADIYATHALAWA"
            },
            {
              name: "includeGeometry",
              type: "boolean",
              required: true,
              description: "Include GeoJSON geometry data",
              example: "true"
            }
          ]}
          example={getDivisionsByDSDWithGeometryExample}
          exampleResponse={getDivisionsByDSDWithGeometryResponse}
        />

        {/* DSD Data Structure */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">DSD Object Structure</h3>
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
                  <td className="py-2 px-3">Unique identifier for the DSD</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">name</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">DSD name</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">nameEn</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">DSD name in English</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">code</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">DSD code (same as name)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">districtId</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Code of the parent district</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">districtName</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Name of the parent district</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">provinceId</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Code of the parent province</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">provinceName</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Name of the parent province</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">divisionCount</td>
                  <td className="py-2 px-3">number</td>
                  <td className="py-2 px-3">Number of GN divisions in this DSD</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Implementation Examples */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Implementation Examples</h3>
              <p className="text-text-secondary mt-1">Complete code examples for integrating the DSDs API</p>
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
                  code={`// DSDs API Client
class DSDsAPI {
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

  // Get all DSDs with optional filters
  async getAllDSDs(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.district) params.append('district', filters.district);
    if (filters.province) params.append('province', filters.province);
    
    const query = params.toString() ? \`?\${params.toString()}\` : '';
    return await this.request(\`/dsds\${query}\`);
  }

  // Get DSDs by district
  async getDSDsByDistrict(district) {
    return await this.getAllDSDs({ district });
  }

  // Get DSDs by province
  async getDSDsByProvince(province) {
    return await this.getAllDSDs({ province });
  }

  // Get DSD by ID
  async getDSDById(id) {
    return await this.request(\`/dsds/\${encodeURIComponent(id)}\`);
  }

  // Get divisions within a DSD
  async getDivisionsByDSD(dsdId, includeGeometry = false) {
    const params = includeGeometry ? '?includeGeometry=true' : '';
    return await this.request(\`/dsds/\${encodeURIComponent(dsdId)}/divisions\${params}\`);
  }

  // Get DSD hierarchy (province -> district -> dsds)
  async getDSDHierarchy() {
    const allDSDs = await this.getAllDSDs();
    const hierarchy = {};
    
    allDSDs.data.forEach(dsd => {
      const province = dsd.provinceName;
      const district = dsd.districtName;
      
      if (!hierarchy[province]) {
        hierarchy[province] = {};
      }
      
      if (!hierarchy[province][district]) {
        hierarchy[province][district] = [];
      }
      
      hierarchy[province][district].push({
        id: dsd.id,
        name: dsd.name,
        code: dsd.code,
        divisionCount: dsd.divisionCount
      });
    });
    
    return hierarchy;
  }

  // Search DSDs by name
  async searchDSDs(searchTerm) {
    const allDSDs = await this.getAllDSDs();
    const searchLower = searchTerm.toLowerCase();
    
    return allDSDs.data.filter(dsd => 
      dsd.name.toLowerCase().includes(searchLower) ||
      dsd.code.toLowerCase().includes(searchLower)
    );
  }

  // Get statistics for DSDs
  async getDSDStatistics(province = null, district = null) {
    const filters = {};
    if (province) filters.province = province;
    if (district) filters.district = district;
    
    const dsds = await this.getAllDSDs(filters);
    const data = dsds.data;
    
    if (data.length === 0) return null;
    
    const totalDivisions = data.reduce((sum, dsd) => sum + dsd.divisionCount, 0);
    const avgDivisions = totalDivisions / data.length;
    const maxDivisions = Math.max(...data.map(dsd => dsd.divisionCount));
    const minDivisions = Math.min(...data.map(dsd => dsd.divisionCount));
    
    return {
      totalDSDs: data.length,
      totalDivisions,
      avgDivisions: Math.round(avgDivisions * 100) / 100,
      maxDivisions,
      minDivisions,
      largestDSD: data.find(dsd => dsd.divisionCount === maxDivisions)?.name,
      smallestDSD: data.find(dsd => dsd.divisionCount === minDivisions)?.name
    };
  }
}

// Usage Examples
const api = new DSDsAPI('your-api-key');

// Get all DSDs
api.getAllDSDs()
  .then(data => {
    console.log(\`Found \${data.data.length} DSDs\`);
    data.data.forEach(dsd => {
      console.log(\`\${dsd.name} - \${dsd.divisionCount} divisions (\${dsd.districtName}, \${dsd.provinceName})\`);
    });
  });

// Get DSDs in Western Province
api.getDSDsByProvince('Western')
  .then(data => {
    console.log('DSDs in Western Province:');
    data.data.forEach(dsd => {
      console.log(\`  \${dsd.name} (\${dsd.districtName}) - \${dsd.divisionCount} divisions\`);
    });
  });

// Get DSD hierarchy
api.getDSDHierarchy()
  .then(hierarchy => {
    console.log('DSD Hierarchy:');
    Object.keys(hierarchy).forEach(province => {
      console.log(\`\${province}:\`);
      Object.keys(hierarchy[province]).forEach(district => {
        console.log(\`  \${district}: \${hierarchy[province][district].length} DSDs\`);
      });
    });
  });

// Get statistics for Colombo district
api.getDSDStatistics(null, 'Colombo')
  .then(stats => {
    console.log('Colombo District DSD Statistics:', stats);
  });

// Get divisions in a specific DSD
api.getDivisionsByDSD('COLOMBO')
  .then(data => {
    console.log(\`Divisions in COLOMBO DSD: \${data.data.length}\`);
    data.data.slice(0, 5).forEach(division => {
      console.log(\`  \${division.name} (\${division.gnNumber}) - \${division.population} people\`);
    });
  });`}
                  language="javascript"
                  title="dsds-api.js"
                />
              </div>

              {/* React Component Example */}
              <div>
                <h4 className="text-md font-semibold text-text-primary mb-3">React DSD Browser</h4>
                <CodeBlock 
                  code={`import React, { useState, useEffect } from 'react';
import { MapPin, BarChart3, Users, Search, Filter, ChevronRight } from 'lucide-react';

const DSDsBrowser = ({ apiKey }) => {
  const [dsds, setDsds] = useState([]);
  const [hierarchy, setHierarchy] = useState({});
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedDSD, setSelectedDSD] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statistics, setStatistics] = useState(null);

  const baseUrl = 'https://api.lankalocate.lk/v1';

  // Fetch DSDs and build hierarchy
  useEffect(() => {
    if (!apiKey) return;
    fetchDSDs();
  }, [apiKey]);

  const fetchDSDs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(\`\${baseUrl}/dsds\`, {
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }

      const data = await response.json();
      setDsds(data.data || []);
      buildHierarchy(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const buildHierarchy = (dsdsData) => {
    const h = {};
    dsdsData.forEach(dsd => {
      const province = dsd.provinceName;
      const district = dsd.districtName;
      
      if (!h[province]) h[province] = {};
      if (!h[province][district]) h[province][district] = [];
      
      h[province][district].push(dsd);
    });
    setHierarchy(h);
  };

  const fetchStatistics = async (province, district) => {
    try {
      const params = new URLSearchParams();
      if (province) params.append('province', province);
      if (district) params.append('district', district);
      
      const response = await fetch(\`\${baseUrl}/dsds?\${params.toString()}\`, {
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      const dsdsData = data.data || [];
      
      if (dsdsData.length === 0) {
        setStatistics(null);
        return;
      }
      
      const totalDivisions = dsdsData.reduce((sum, dsd) => sum + dsd.divisionCount, 0);
      const avgDivisions = totalDivisions / dsdsData.length;
      
      setStatistics({
        totalDSDs: dsdsData.length,
        totalDivisions,
        avgDivisions: Math.round(avgDivisions * 100) / 100,
        maxDivisions: Math.max(...dsdsData.map(dsd => dsd.divisionCount)),
        minDivisions: Math.min(...dsdsData.map(dsd => dsd.divisionCount))
      });
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };

  const fetchDivisions = async (dsdId) => {
    try {
      const response = await fetch(\`\${baseUrl}/dsds/\${encodeURIComponent(dsdId)}/divisions\`, {
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setDivisions(data.data || []);
    } catch (err) {
      console.error('Failed to fetch divisions:', err);
      setDivisions([]);
    }
  };

  const handleProvinceChange = (province) => {
    setSelectedProvince(province);
    setSelectedDistrict('');
    setSelectedDSD(null);
    setDivisions([]);
    if (province) {
      fetchStatistics(province, null);
    } else {
      setStatistics(null);
    }
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setSelectedDSD(null);
    setDivisions([]);
    if (district) {
      fetchStatistics(selectedProvince, district);
    } else if (selectedProvince) {
      fetchStatistics(selectedProvince, null);
    }
  };

  const handleDSDClick = (dsd) => {
    setSelectedDSD(dsd);
    fetchDivisions(dsd.id);
  };

  const filteredDSDs = dsds.filter(dsd => 
    dsd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dsd.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableDistricts = selectedProvince && hierarchy[selectedProvince] 
    ? Object.keys(hierarchy[selectedProvince]) 
    : [];

  const visibleDSDs = selectedDistrict && hierarchy[selectedProvince]?.[selectedDistrict]
    ? hierarchy[selectedProvince][selectedDistrict]
    : selectedProvince && !selectedDistrict
    ? Object.values(hierarchy[selectedProvince] || {}).flat()
    : searchTerm
    ? filteredDSDs
    : dsds;

  if (loading) return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      <span className="ml-2">Loading DSDs...</span>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      <strong>Error:</strong> {error}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">📍 Divisional Secretariats Browser</h1>
        
        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Province</label>
            <select 
              value={selectedProvince}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="">All Provinces</option>
              {Object.keys(hierarchy).map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">District</label>
            <select 
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={!selectedProvince}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:opacity-50"
            >
              <option value="">All Districts</option>
              {availableDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Search DSDs</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or code..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Statistics</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total DSDs:</span>
                <span className="font-semibold ml-2">{statistics.totalDSDs}</span>
              </div>
              <div>
                <span className="text-blue-700">Total Divisions:</span>
                <span className="font-semibold ml-2">{statistics.totalDivisions}</span>
              </div>
              <div>
                <span className="text-blue-700">Avg per DSD:</span>
                <span className="font-semibold ml-2">{statistics.avgDivisions}</span>
              </div>
              <div>
                <span className="text-blue-700">Range:</span>
                <span className="font-semibold ml-2">{statistics.minDivisions} - {statistics.maxDivisions}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* DSDs List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">DSDs ({visibleDSDs.length})</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {visibleDSDs.map(dsd => (
                <div 
                  key={dsd.id}
                  onClick={() => handleDSDClick(dsd)}
                  className={\`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors \${selectedDSD?.id === dsd.id ? 'bg-blue-50 border-blue-200' : ''}\`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{dsd.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{dsd.districtName}, {dsd.provinceName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>{dsd.divisionCount} divisions</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected DSD Details */}
        <div>
          {selectedDSD ? (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">{selectedDSD.name}</h2>
                <p className="text-sm text-gray-600">{selectedDSD.districtName}, {selectedDSD.provinceName}</p>
              </div>
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Code:</span>
                    <span className="text-sm font-medium">{selectedDSD.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">GN Divisions:</span>
                    <span className="text-sm font-medium">{selectedDSD.divisionCount}</span>
                  </div>
                </div>
                
                {divisions.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">GN Divisions ({divisions.length})</h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {divisions.map(division => (
                        <div key={division.id} className="text-sm p-2 bg-gray-50 rounded">
                          <div className="font-medium">{division.name}</div>
                          <div className="text-gray-600">
                            GN: {division.gnNumber} • Pop: {division.population?.toLocaleString() || 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Select a DSD to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DSDsBrowser;`}
                  language="typescript"
                  title="DSDsBrowser.tsx"
                />
              </div>

              {/* Python Analysis Example */}
              <div>
                <h4 className="text-md font-semibold text-text-primary mb-3">Python DSD Analysis</h4>
                <CodeBlock 
                  code={`import requests
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from collections import defaultdict

class DSDAnalyzer:
    def __init__(self, api_key, base_url="https://api.lankalocate.lk/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def _make_request(self, endpoint):
        """Make HTTP request to API endpoint"""
        url = f"{self.base_url}{endpoint}"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()

    def get_all_dsds(self, province=None, district=None):
        """Get all DSDs with optional filters"""
        params = []
        if province:
            params.append(f"province={province}")
        if district:
            params.append(f"district={district}")
        
        query = "&".join(params)
        endpoint = f"/dsds?{query}" if query else "/dsds"
        
        result = self._make_request(endpoint)
        return result.get("data", [])

    def get_dsd_by_id(self, dsd_id):
        """Get specific DSD details"""
        result = self._make_request(f"/dsds/{dsd_id}")
        return result.get("data", {})

    def get_divisions_by_dsd(self, dsd_id, include_geometry=False):
        """Get GN divisions within a DSD"""
        endpoint = f"/dsds/{dsd_id}/divisions"
        if include_geometry:
            endpoint += "?includeGeometry=true"
        
        result = self._make_request(endpoint)
        return result.get("data", [])

    def analyze_dsd_distribution(self):
        """Analyze distribution of DSDs across provinces and districts"""
        all_dsds = self.get_all_dsds()
        df = pd.DataFrame(all_dsds)
        
        # Province distribution
        province_counts = df.groupby('provinceName').agg({
            'id': 'count',
            'divisionCount': 'sum'
        }).rename(columns={'id': 'dsd_count', 'divisionCount': 'total_divisions'})
        
        # District distribution
        district_counts = df.groupby(['provinceName', 'districtName']).agg({
            'id': 'count',
            'divisionCount': 'sum'
        }).rename(columns={'id': 'dsd_count', 'divisionCount': 'total_divisions'})
        
        return {
            'total_dsds': len(df),
            'province_distribution': province_counts,
            'district_distribution': district_counts,
            'division_stats': {
                'total_divisions': df['divisionCount'].sum(),
                'avg_divisions_per_dsd': df['divisionCount'].mean(),
                'median_divisions_per_dsd': df['divisionCount'].median(),
                'max_divisions': df['divisionCount'].max(),
                'min_divisions': df['divisionCount'].min()
            }
        }

    def compare_provinces(self):
        """Compare provinces by DSD and division counts"""
        all_dsds = self.get_all_dsds()
        df = pd.DataFrame(all_dsds)
        
        comparison = df.groupby('provinceName').agg({
            'id': 'count',
            'divisionCount': ['sum', 'mean', 'std']
        }).round(2)
        
        comparison.columns = ['DSDs', 'Total_Divisions', 'Avg_Divisions_per_DSD', 'Std_Divisions']
        return comparison.sort_values('Total_Divisions', ascending=False)

    def find_largest_smallest_dsds(self, n=5):
        """Find DSDs with most and least GN divisions"""
        all_dsds = self.get_all_dsds()
        df = pd.DataFrame(all_dsds)
        
        largest = df.nlargest(n, 'divisionCount')[['name', 'districtName', 'provinceName', 'divisionCount']]
        smallest = df.nsmallest(n, 'divisionCount')[['name', 'districtName', 'provinceName', 'divisionCount']]
        
        return {'largest': largest, 'smallest': smallest}

    def create_distribution_charts(self, save_path=None):
        """Create visualization charts for DSD distribution"""
        all_dsds = self.get_all_dsds()
        df = pd.DataFrame(all_dsds)
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        
        # 1. DSDs per province
        province_counts = df['provinceName'].value_counts()
        axes[0, 0].bar(range(len(province_counts)), province_counts.values)
        axes[0, 0].set_title('Number of DSDs per Province')
        axes[0, 0].set_xlabel('Province')
        axes[0, 0].set_ylabel('Number of DSDs')
        axes[0, 0].set_xticks(range(len(province_counts)))
        axes[0, 0].set_xticklabels(province_counts.index, rotation=45, ha='right')
        
        # 2. Distribution of divisions per DSD
        axes[0, 1].hist(df['divisionCount'], bins=20, alpha=0.7, color='skyblue', edgecolor='black')
        axes[0, 1].set_title('Distribution of GN Divisions per DSD')
        axes[0, 1].set_xlabel('Number of GN Divisions')
        axes[0, 1].set_ylabel('Number of DSDs')
        axes[0, 1].axvline(df['divisionCount'].mean(), color='red', linestyle='--', 
                          label=f'Mean: {df["divisionCount"].mean():.1f}')
        axes[0, 1].legend()
        
        # 3. Total divisions per province
        province_divisions = df.groupby('provinceName')['divisionCount'].sum().sort_values(ascending=False)
        axes[1, 0].bar(range(len(province_divisions)), province_divisions.values)
        axes[1, 0].set_title('Total GN Divisions per Province')
        axes[1, 0].set_xlabel('Province')
        axes[1, 0].set_ylabel('Total GN Divisions')
        axes[1, 0].set_xticks(range(len(province_divisions)))
        axes[1, 0].set_xticklabels(province_divisions.index, rotation=45, ha='right')
        
        # 4. Box plot of divisions per DSD by province
        df.boxplot(column='divisionCount', by='provinceName', ax=axes[1, 1])
        axes[1, 1].set_title('GN Divisions per DSD by Province')
        axes[1, 1].set_xlabel('Province')
        axes[1, 1].set_ylabel('GN Divisions per DSD')
        plt.setp(axes[1, 1].get_xticklabels(), rotation=45, ha='right')
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.show()

    def export_detailed_report(self, filename="dsd_analysis_report.csv"):
        """Export detailed DSD analysis to CSV"""
        all_dsds = self.get_all_dsds()
        df = pd.DataFrame(all_dsds)
        
        # Add calculated fields
        df['divisions_per_dsd_rank'] = df['divisionCount'].rank(ascending=False)
        df['province_avg_divisions'] = df.groupby('provinceName')['divisionCount'].transform('mean')
        df['above_province_avg'] = df['divisionCount'] > df['province_avg_divisions']
        
        # Reorder columns for better readability
        columns = ['name', 'code', 'districtName', 'provinceName', 'divisionCount', 
                  'divisions_per_dsd_rank', 'province_avg_divisions', 'above_province_avg']
        
        df[columns].to_csv(filename, index=False)
        print(f"Detailed DSD report exported to {filename}")

# Usage Examples
if __name__ == "__main__":
    analyzer = DSDAnalyzer("your-api-key-here")
    
    try:
        # Basic analysis
        print("=== DSD Distribution Analysis ===")
        distribution = analyzer.analyze_dsd_distribution()
        print(f"Total DSDs: {distribution['total_dsds']}")
        print(f"Total GN Divisions: {distribution['division_stats']['total_divisions']}")
        print(f"Average divisions per DSD: {distribution['division_stats']['avg_divisions_per_dsd']:.2f}")
        
        print("\\n=== Top 5 Provinces by DSDs ===")
        print(distribution['province_distribution'].head())
        
        # Compare provinces
        print("\\n=== Province Comparison ===")
        comparison = analyzer.compare_provinces()
        print(comparison)
        
        # Find extremes
        print("\\n=== Largest and Smallest DSDs ===")
        extremes = analyzer.find_largest_smallest_dsds(3)
        print("Largest DSDs:")
        print(extremes['largest'])
        print("\\nSmallest DSDs:")
        print(extremes['smallest'])
        
        # Create visualizations
        analyzer.create_distribution_charts("dsd_distribution_charts.png")
        
        # Export detailed report
        analyzer.export_detailed_report()
        
        # Get detailed info for a specific DSD
        colombo_dsd = analyzer.get_dsd_by_id("COLOMBO")
        print(f"\\n=== COLOMBO DSD Details ===")
        print(f"Name: {colombo_dsd['name']}")
        print(f"District: {colombo_dsd['districtName']}")
        print(f"Province: {colombo_dsd['provinceName']}")
        print(f"GN Divisions: {colombo_dsd['divisionCount']}")
        
        # Get divisions in COLOMBO DSD
        divisions = analyzer.get_divisions_by_dsd("COLOMBO")
        print(f"\\nFirst 5 divisions in COLOMBO DSD:")
        for division in divisions[:5]:
            print(f"  {division['name']} ({division['gnNumber']}) - {division['population']} people")
        
    except requests.exceptions.RequestException as e:
        print(f"API Error: {e}")
    except Exception as e:
        print(f"Error: {e}")`}
                  language="python"
                  title="dsd_analyzer.py"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DocsSection>
  );
};
