import { useState } from 'react';
import { ChevronDown, ChevronUp, Code } from 'lucide-react';
import { DocsSection } from '../shared/DocsSection';
import { ApiEndpoint } from '../shared/ApiEndpoint';
import { CodeBlock } from '../shared/CodeBlock';

export const ProvincesSection = () => {
  // Code visibility state
  const [showExampleCode, setShowExampleCode] = useState(false);

  const getAllProvincesExample = `curl -X GET "https://api.lankalocate.lk/v1/provinces" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getAllProvincesResponse = `{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Western Province",
      "nameSi": "බස්නාහිර පළාත",
      "nameTa": "மேல் மாகாணம்",
      "code": "WP",
      "capital": "Colombo",
      "area": 3684,
      "population": 6113698,
      "districts": ["Colombo", "Gampaha", "Kalutara"],
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Central Province",
      "nameSi": "මධ්‍යම පළාත",
      "nameTa": "மத்திய மாகாணம்",
      "code": "CP",
      "capital": "Kandy",
      "area": 5674,
      "population": 2571557,
      "districts": ["Kandy", "Matale", "Nuwara Eliya"],
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 9,
    "page": 1,
    "limit": 10,
    "hasNext": false,
    "hasPrev": false
  }
}`;

  const getProvinceByIdExample = `curl -X GET "https://api.lankalocate.lk/v1/provinces/1" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getProvinceByIdResponse = `{
  "success": true,
  "data": {
    "id": 1,
    "name": "Western Province",
    "nameSi": "බස්නාහිර පළාත",
    "nameTa": "மேல் மாகாணம්",
    "code": "WP",
    "capital": "Colombo",
    "area": 3684,
    "population": 6113698,
    "districts": [
      {
        "id": 1,
        "name": "Colombo",
        "nameSi": "කොළඹ",
        "nameTa": "கொழும்பு",
        "code": "COL",
        "capital": "Colombo",
        "area": 699,
        "population": 2324349
      },
      {
        "id": 2,
        "name": "Gampaha",
        "nameSi": "ගම්පහ",
        "nameTa": "கம்பஹா",
        "code": "GAM",
        "capital": "Gampaha",
        "area": 1387,
        "population": 2304833
      },
      {
        "id": 3,
        "name": "Kalutara",
        "nameSi": "කළුතර",
        "nameTa": "களுத்துறை",
        "code": "KAL",
        "capital": "Kalutara",
        "area": 1598,
        "population": 1305552
      }
    ],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}`;

  const getDistrictsByProvinceExample = `curl -X GET "https://api.lankalocate.lk/v1/provinces/1/districts" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getDistrictsByProvinceResponse = `{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Colombo",
      "nameSi": "කොළඹ",
      "nameTa": "கொழும்பு",
      "code": "COL",
      "capital": "Colombo",
      "area": 699,
      "population": 2324349,
      "province": "Western Province",
      "provinceId": 1,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Gampaha",
      "nameSi": "ගම්පහ",
      "nameTa": "கம்பஹா",
      "code": "GAM",
      "capital": "Gampaha",
      "area": 1387,
      "population": 2304833,
      "province": "Western Province",
      "provinceId": 1,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Kalutara",
      "nameSi": "කළුතර",
      "nameTa": "களுத்துறை",
      "code": "KAL",
      "capital": "Kalutara",
      "area": 1598,
      "population": 1305552,
      "province": "Western Province",
      "provinceId": 1,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "hasNext": false,
    "hasPrev": false
  }
}`;

  return (
    <DocsSection 
      title="Provinces API"
      description="Access information about all 9 provinces in Sri Lanka, including their districts, population, and administrative details."
    >
      <div className="space-y-8">
        {/* Get All Provinces */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/provinces"
          description="Retrieve a list of all provinces in Sri Lanka with basic information."
          example={getAllProvincesExample}
          exampleResponse={getAllProvincesResponse}
        />

        {/* Get Province by ID */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/provinces/{id}"
          description="Get detailed information about a specific province, including its districts."
          parameters={[
            {
              name: "id",
              type: "integer",
              required: true,
              description: "The unique identifier of the province",
              example: "1"
            }
          ]}
          example={getProvinceByIdExample}
          exampleResponse={getProvinceByIdResponse}
        />

        {/* Get Districts by Province */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/provinces/{id}/districts"
          description="Get all districts within a specific province."
          parameters={[
            {
              name: "id",
              type: "integer",
              required: true,
              description: "The unique identifier of the province",
              example: "1"
            }
          ]}
          example={getDistrictsByProvinceExample}
          exampleResponse={getDistrictsByProvinceResponse}
        />

        {/* Province Data Structure */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Province Object Structure</h3>
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
                  <td className="py-2 px-3">integer</td>
                  <td className="py-2 px-3">Unique identifier for the province</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">name</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Province name in English</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">nameSi</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Province name in Sinhala</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">nameTa</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Province name in Tamil</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">code</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Two-letter province code</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">capital</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Provincial capital city</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">area</td>
                  <td className="py-2 px-3">number</td>
                  <td className="py-2 px-3">Area in square kilometers</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">population</td>
                  <td className="py-2 px-3">number</td>
                  <td className="py-2 px-3">Population count (latest census)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">districts</td>
                  <td className="py-2 px-3">array</td>
                  <td className="py-2 px-3">List of districts in the province</td>
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
              <p className="text-text-secondary mt-1">Complete code examples for integrating the Provinces API</p>
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
                  code={`// Provinces API Client
class ProvincesAPI {
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

  // Get all provinces
  async getAllProvinces() {
    return await this.request('/provinces');
  }

  // Get province by ID
  async getProvinceById(id) {
    return await this.request(\`/provinces/\${id}\`);
  }

  // Get districts within a province
  async getDistrictsByProvince(provinceId) {
    return await this.request(\`/provinces/\${provinceId}/districts\`);
  }

  // Get province by name (helper method)
  async getProvinceByName(name) {
    const provinces = await this.getAllProvinces();
    return provinces.data.find(province => 
      province.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Get province statistics
  async getProvinceStatistics() {
    const provinces = await this.getAllProvinces();
    const data = provinces.data;
    
    if (!data || data.length === 0) return null;
    
    const totalPopulation = data.reduce((sum, p) => sum + p.population, 0);
    const totalArea = data.reduce((sum, p) => sum + p.area, 0);
    const avgPopulation = totalPopulation / data.length;
    const avgArea = totalArea / data.length;
    
    const largestByPopulation = data.reduce((max, p) => p.population > max.population ? p : max);
    const smallestByPopulation = data.reduce((min, p) => p.population < min.population ? p : min);
    const largestByArea = data.reduce((max, p) => p.area > max.area ? p : max);
    const smallestByArea = data.reduce((min, p) => p.area < min.area ? p : min);
    
    return {
      totalProvinces: data.length,
      totalPopulation,
      totalArea,
      avgPopulation: Math.round(avgPopulation),
      avgArea: Math.round(avgArea * 100) / 100,
      populationDensity: Math.round(totalPopulation / totalArea * 100) / 100,
      largestByPopulation: {
        name: largestByPopulation.name,
        population: largestByPopulation.population
      },
      smallestByPopulation: {
        name: smallestByPopulation.name,
        population: smallestByPopulation.population
      },
      largestByArea: {
        name: largestByArea.name,
        area: largestByArea.area
      },
      smallestByArea: {
        name: smallestByArea.name,
        area: smallestByArea.area
      }
    };
  }

  // Get comprehensive province data with districts
  async getProvinceWithDistricts(provinceId) {
    const [provinceData, districtsData] = await Promise.all([
      this.getProvinceById(provinceId),
      this.getDistrictsByProvince(provinceId)
    ]);
    
    return {
      province: provinceData.data,
      districts: districtsData.data,
      summary: {
        districtCount: districtsData.data.length,
        totalDistrictPopulation: districtsData.data.reduce((sum, d) => sum + d.population, 0),
        totalDistrictArea: districtsData.data.reduce((sum, d) => sum + d.area, 0),
        largestDistrict: districtsData.data.reduce((max, d) => d.population > max.population ? d : max),
        smallestDistrict: districtsData.data.reduce((min, d) => d.population < min.population ? d : min)
      }
    };
  }

  // Search provinces and districts
  async searchLocations(searchTerm) {
    const provinces = await this.getAllProvinces();
    const searchLower = searchTerm.toLowerCase();
    
    const results = {
      provinces: [],
      districts: []
    };
    
    for (const province of provinces.data) {
      // Check if province matches
      if (province.name.toLowerCase().includes(searchLower) ||
          province.nameSi.toLowerCase().includes(searchLower) ||
          province.capital.toLowerCase().includes(searchLower)) {
        results.provinces.push(province);
      }
      
      // Get districts and check if any match
      try {
        const districts = await this.getDistrictsByProvince(province.id);
        const matchingDistricts = districts.data.filter(district =>
          district.name.toLowerCase().includes(searchLower) ||
          district.nameSi.toLowerCase().includes(searchLower) ||
          district.capital.toLowerCase().includes(searchLower)
        );
        results.districts.push(...matchingDistricts);
      } catch (error) {
        console.warn(\`Failed to fetch districts for province \${province.name}:\`, error);
      }
    }
    
    return results;
  }
}

// Usage Examples
const api = new ProvincesAPI('your-api-key');

// Get all provinces with basic info
api.getAllProvinces()
  .then(data => {
    console.log(\`Found \${data.data.length} provinces:\`);
    data.data.forEach(province => {
      console.log(\`\${province.name} (\${province.nameSi}) - Capital: \${province.capital}\`);
      console.log(\`  Population: \${province.population.toLocaleString()}, Area: \${province.area} km²\`);
    });
  });

// Get detailed info for Western Province
api.getProvinceWithDistricts(1)
  .then(data => {
    const { province, districts, summary } = data;
    console.log(\`\\n\${province.name} Province Details:\`);
    console.log(\`Capital: \${province.capital}\`);
    console.log(\`Population: \${province.population.toLocaleString()}\`);
    console.log(\`Area: \${province.area} km²\`);
    console.log(\`Districts: \${summary.districtCount}\`);
    console.log(\`Largest District: \${summary.largestDistrict.name} (\${summary.largestDistrict.population.toLocaleString()} people)\`);
    
    console.log('\\nDistricts in this province:');
    districts.forEach(district => {
      console.log(\`  \${district.name} - \${district.population.toLocaleString()} people, \${district.area} km²\`);
    });
  });

// Get province statistics
api.getProvinceStatistics()
  .then(stats => {
    console.log('\\nSri Lanka Province Statistics:');
    console.log(\`Total Population: \${stats.totalPopulation.toLocaleString()}\`);
    console.log(\`Total Area: \${stats.totalArea.toLocaleString()} km²\`);
    console.log(\`Population Density: \${stats.populationDensity} people/km²\`);
    console.log(\`Largest by Population: \${stats.largestByPopulation.name} (\${stats.largestByPopulation.population.toLocaleString()})\`);
    console.log(\`Largest by Area: \${stats.largestByArea.name} (\${stats.largestByArea.area} km²)\`);
  });

// Search for locations
api.searchLocations('Western')
  .then(results => {
    console.log('\\nSearch Results for "Western":');
    console.log(\`Provinces found: \${results.provinces.length}\`);
    console.log(\`Districts found: \${results.districts.length}\`);
    
    results.provinces.forEach(province => {
      console.log(\`Province: \${province.name}\`);
    });
    
    results.districts.forEach(district => {
      console.log(\`District: \${district.name} (in \${district.province})\`);
    });
  });`}
                  language="javascript"
                  title="provinces-api.js"
                />
              </div>

              {/* React Component Example */}
              <div>
                <h4 className="text-md font-semibold text-text-primary mb-3">React Province Explorer</h4>
                <CodeBlock 
                  code={`import React, { useState, useEffect } from 'react';
import { MapPin, Users, BarChart3, Globe, Search, TrendingUp } from 'lucide-react';

const ProvinceExplorer = ({ apiKey }) => {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const baseUrl = 'https://api.lankalocate.lk/v1';

  // Fetch all provinces on component mount
  useEffect(() => {
    if (!apiKey) return;
    fetchProvinces();
  }, [apiKey]);

  const fetchProvinces = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(\`\${baseUrl}/provinces\`, {
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }

      const data = await response.json();
      setProvinces(data.data || []);
      calculateStatistics(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (provincesData) => {
    if (provincesData.length === 0) return;
    
    const totalPopulation = provincesData.reduce((sum, p) => sum + p.population, 0);
    const totalArea = provincesData.reduce((sum, p) => sum + p.area, 0);
    const largestByPop = provincesData.reduce((max, p) => p.population > max.population ? p : max);
    const smallestByPop = provincesData.reduce((min, p) => p.population < min.population ? p : min);
    
    setStatistics({
      totalProvinces: provincesData.length,
      totalPopulation,
      totalArea,
      averagePopulation: Math.round(totalPopulation / provincesData.length),
      populationDensity: Math.round(totalPopulation / totalArea * 100) / 100,
      largestByPopulation: largestByPop,
      smallestByPopulation: smallestByPop
    });
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await fetch(\`\${baseUrl}/provinces/\${provinceId}/districts\`, {
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setDistricts(data.data || []);
    } catch (err) {
      console.error('Failed to fetch districts:', err);
      setDistricts([]);
    }
  };

  const handleProvinceClick = (province) => {
    setSelectedProvince(province);
    fetchDistricts(province.id);
  };

  const filteredProvinces = provinces.filter(province =>
    province.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    province.nameSi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    province.capital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      <span className="ml-2">Loading provinces...</span>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      <strong>Error:</strong> {error}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">🏛️ Sri Lanka Provinces Explorer</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search provinces by name, Sinhala name, or capital..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Total Provinces</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-2">{statistics.totalProvinces}</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Total Population</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2">{statistics.totalPopulation.toLocaleString()}</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Total Area</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-2">{statistics.totalArea.toLocaleString()} km²</p>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Density</span>
              </div>
              <p className="text-2xl font-bold text-orange-900 mt-2">{statistics.populationDensity} /km²</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Provinces List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Provinces ({filteredProvinces.length})</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 p-4">
              {filteredProvinces.map(province => (
                <div
                  key={province.id}
                  onClick={() => handleProvinceClick(province)}
                  className={\`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md \${
                    selectedProvince?.id === province.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }\`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{province.name}</h3>
                      <p className="text-sm text-gray-600">{province.nameSi}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {province.code}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>Capital: {province.capital}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>Population: {province.population.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-gray-400" />
                      <span>Area: {province.area.toLocaleString()} km²</span>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      Density: {Math.round(province.population / province.area)} people/km²
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Province Details */}
        <div>
          {selectedProvince ? (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">{selectedProvince.name}</h2>
                <p className="text-sm text-gray-600">{selectedProvince.nameSi}</p>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Capital:</span>
                    <p className="font-medium">{selectedProvince.capital}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Code:</span>
                    <p className="font-medium">{selectedProvince.code}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Population:</span>
                    <p className="font-medium">{selectedProvince.population.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Area:</span>
                    <p className="font-medium">{selectedProvince.area.toLocaleString()} km²</p>
                  </div>
                </div>
                
                {districts.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Districts ({districts.length})</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {districts.map(district => (
                        <div key={district.id} className="text-sm p-3 bg-gray-50 rounded border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{district.name}</span>
                            <span className="text-xs text-gray-500">{district.code}</span>
                          </div>
                          <div className="text-gray-600">
                            <p>{district.nameSi}</p>
                            <p>Capital: {district.capital}</p>
                            <div className="flex justify-between mt-1">
                              <span>Pop: {district.population.toLocaleString()}</span>
                              <span>Area: {district.area} km²</span>
                            </div>
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
              <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Select a province to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProvinceExplorer;`}
                  language="typescript"
                  title="ProvinceExplorer.tsx"
                />
              </div>

              {/* Python Analysis Example */}
              <div>
                <h4 className="text-md font-semibold text-text-primary mb-3">Python Province Analysis</h4>
                <CodeBlock 
                  code={`import requests
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, List

class ProvinceAnalyzer:
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

    def get_all_provinces(self) -> List[Dict]:
        """Get all provinces"""
        result = self._make_request("/provinces")
        return result.get("data", [])

    def get_province_by_id(self, province_id: int) -> Dict:
        """Get specific province details"""
        result = self._make_request(f"/provinces/{province_id}")
        return result.get("data", {})

    def get_districts_by_province(self, province_id: int) -> List[Dict]:
        """Get districts within a province"""
        result = self._make_request(f"/provinces/{province_id}/districts")
        return result.get("data", [])

    def analyze_population_distribution(self) -> Dict:
        """Analyze population distribution across provinces"""
        provinces = self.get_all_provinces()
        df = pd.DataFrame(provinces)
        
        total_population = df['population'].sum()
        total_area = df['area'].sum()
        
        # Add calculated fields
        df['population_percentage'] = (df['population'] / total_population * 100).round(2)
        df['area_percentage'] = (df['area'] / total_area * 100).round(2)
        df['population_density'] = (df['population'] / df['area']).round(2)
        
        return {
            'total_population': total_population,
            'total_area': total_area,
            'average_population': df['population'].mean(),
            'average_area': df['area'].mean(),
            'population_std': df['population'].std(),
            'area_std': df['area'].std(),
            'provinces_data': df.to_dict('records'),
            'population_ranking': df.nlargest(9, 'population')[['name', 'population', 'population_percentage']].to_dict('records'),
            'area_ranking': df.nlargest(9, 'area')[['name', 'area', 'area_percentage']].to_dict('records'),
            'density_ranking': df.nlargest(9, 'population_density')[['name', 'population_density']].to_dict('records')
        }

    def compare_provinces_with_districts(self):
        """Compare provinces including their district data"""
        provinces = self.get_all_provinces()
        comparison_data = []
        
        for province in provinces:
            try:
                districts = self.get_districts_by_province(province['id'])
                
                district_stats = {
                    'total_districts': len(districts),
                    'total_district_population': sum(d['population'] for d in districts),
                    'total_district_area': sum(d['area'] for d in districts),
                    'avg_district_population': sum(d['population'] for d in districts) / len(districts) if districts else 0,
                    'avg_district_area': sum(d['area'] for d in districts) / len(districts) if districts else 0,
                    'largest_district': max(districts, key=lambda x: x['population'])['name'] if districts else None,
                    'smallest_district': min(districts, key=lambda x: x['population'])['name'] if districts else None
                }
                
                comparison_data.append({
                    'province_name': province['name'],
                    'province_population': province['population'],
                    'province_area': province['area'],
                    'province_density': province['population'] / province['area'],
                    **district_stats
                })
                
            except Exception as e:
                print(f"Error processing province {province['name']}: {e}")
                
        return pd.DataFrame(comparison_data)

    def create_visualization_dashboard(self, save_path: str = None):
        """Create comprehensive visualization dashboard"""
        analysis = self.analyze_population_distribution()
        df = pd.DataFrame(analysis['provinces_data'])
        
        fig, axes = plt.subplots(2, 3, figsize=(18, 12))
        fig.suptitle('Sri Lanka Provinces Analysis Dashboard', fontsize=16, fontweight='bold')
        
        # 1. Population by Province (Bar Chart)
        df_sorted = df.sort_values('population', ascending=True)
        axes[0, 0].barh(df_sorted['name'], df_sorted['population'])
        axes[0, 0].set_title('Population by Province')
        axes[0, 0].set_xlabel('Population')
        axes[0, 0].tick_params(axis='y', labelsize=8)
        
        # 2. Area by Province (Bar Chart)
        df_sorted_area = df.sort_values('area', ascending=True)
        axes[0, 1].barh(df_sorted_area['name'], df_sorted_area['area'])
        axes[0, 1].set_title('Area by Province (km²)')
        axes[0, 1].set_xlabel('Area (km²)')
        axes[0, 1].tick_params(axis='y', labelsize=8)
        
        # 3. Population Density (Bar Chart)
        df_sorted_density = df.sort_values('population_density', ascending=True)
        axes[0, 2].barh(df_sorted_density['name'], df_sorted_density['population_density'])
        axes[0, 2].set_title('Population Density (people/km²)')
        axes[0, 2].set_xlabel('Density (people/km²)')
        axes[0, 2].tick_params(axis='y', labelsize=8)
        
        # 4. Population vs Area Scatter Plot
        axes[1, 0].scatter(df['area'], df['population'], s=100, alpha=0.7, c='blue')
        for i, row in df.iterrows():
            axes[1, 0].annotate(row['name'], (row['area'], row['population']), 
                              xytext=(5, 5), textcoords='offset points', fontsize=8)
        axes[1, 0].set_title('Population vs Area')
        axes[1, 0].set_xlabel('Area (km²)')
        axes[1, 0].set_ylabel('Population')
        
        # 5. Population Distribution (Pie Chart)
        axes[1, 1].pie(df['population'], labels=df['name'], autopct='%1.1f%%', startangle=90)
        axes[1, 1].set_title('Population Distribution')
        
        # 6. Area Distribution (Pie Chart)
        axes[1, 2].pie(df['area'], labels=df['name'], autopct='%1.1f%%', startangle=90)
        axes[1, 2].set_title('Area Distribution')
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.show()

    def generate_detailed_report(self, filename: str = "provinces_detailed_report.csv"):
        """Generate detailed province and district report"""
        comparison_df = self.compare_provinces_with_districts()
        
        # Add rankings
        comparison_df['population_rank'] = comparison_df['province_population'].rank(ascending=False)
        comparison_df['area_rank'] = comparison_df['province_area'].rank(ascending=False)
        comparison_df['density_rank'] = comparison_df['province_density'].rank(ascending=False)
        comparison_df['districts_count_rank'] = comparison_df['total_districts'].rank(ascending=False)
        
        # Reorder columns for better readability
        columns = [
            'province_name', 'province_population', 'population_rank',
            'province_area', 'area_rank', 'province_density', 'density_rank',
            'total_districts', 'districts_count_rank', 'total_district_population',
            'total_district_area', 'avg_district_population', 'avg_district_area',
            'largest_district', 'smallest_district'
        ]
        
        comparison_df[columns].to_csv(filename, index=False)
        print(f"Detailed province report exported to {filename}")
        
        return comparison_df

    def find_interesting_insights(self):
        """Find and report interesting insights about provinces"""
        analysis = self.analyze_population_distribution()
        comparison_df = self.compare_provinces_with_districts()
        
        insights = {
            'most_populated_province': analysis['population_ranking'][0],
            'least_populated_province': analysis['population_ranking'][-1],
            'largest_province_by_area': analysis['area_ranking'][0],
            'smallest_province_by_area': analysis['area_ranking'][-1],
            'highest_density_province': analysis['density_ranking'][0],
            'lowest_density_province': analysis['density_ranking'][-1],
            'most_districts': comparison_df.loc[comparison_df['total_districts'].idxmax()],
            'fewest_districts': comparison_df.loc[comparison_df['total_districts'].idxmin()],
            'population_inequality': {
                'coefficient_of_variation': (analysis['population_std'] / analysis['average_population']) * 100,
                'population_range': {
                    'max': analysis['population_ranking'][0]['population'],
                    'min': analysis['population_ranking'][-1]['population'],
                    'ratio': analysis['population_ranking'][0]['population'] / analysis['population_ranking'][-1]['population']
                }
            }
        }
        
        return insights

# Usage Examples
if __name__ == "__main__":
    analyzer = ProvinceAnalyzer("your-api-key-here")
    
    try:
        print("=== Sri Lanka Provinces Analysis ===")
        
        # Basic population analysis
        analysis = analyzer.analyze_population_distribution()
        print(f"Total Population: {analysis['total_population']:,}")
        print(f"Total Area: {analysis['total_area']:,} km²")
        print(f"Average Population per Province: {analysis['average_population']:,.0f}")
        
        print("\\n=== Top 3 Provinces by Population ===")
        for i, province in enumerate(analysis['population_ranking'][:3], 1):
            print(f"{i}. {province['name']}: {province['population']:,} ({province['population_percentage']}%)")
        
        print("\\n=== Top 3 Provinces by Area ===")
        for i, province in enumerate(analysis['area_ranking'][:3], 1):
            print(f"{i}. {province['name']}: {province['area']:,} km² ({province['area_percentage']}%)")
        
        print("\\n=== Top 3 Provinces by Density ===")
        for i, province in enumerate(analysis['density_ranking'][:3], 1):
            print(f"{i}. {province['name']}: {province['population_density']:,.1f} people/km²")
        
        # Detailed comparison with districts
        print("\\n=== Province-District Comparison ===")
        comparison_df = analyzer.compare_provinces_with_districts()
        print(comparison_df[['province_name', 'total_districts', 'province_population', 'province_density']].to_string(index=False))
        
        # Generate insights
        print("\\n=== Interesting Insights ===")
        insights = analyzer.find_interesting_insights()
        print(f"Most populated: {insights['most_populated_province']['name']} ({insights['most_populated_province']['population']:,})")
        print(f"Least populated: {insights['least_populated_province']['name']} ({insights['least_populated_province']['population']:,})")
        print(f"Population ratio (largest/smallest): {insights['population_inequality']['population_range']['ratio']:.1f}x")
        print(f"Population inequality (CV): {insights['population_inequality']['coefficient_of_variation']:.1f}%")
        
        # Generate visualizations and reports
        analyzer.create_visualization_dashboard("provinces_dashboard.png")
        analyzer.generate_detailed_report()
        
    except requests.exceptions.RequestException as e:
        print(f"API Error: {e}")
    except Exception as e:
        print(f"Error: {e}")`}
                  language="python"
                  title="province_analyzer.py"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DocsSection>
  );
};
