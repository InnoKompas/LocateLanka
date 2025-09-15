import { useState } from 'react';
import { ChevronDown, ChevronUp, Code } from 'lucide-react';
import { DocsSection } from '../shared/DocsSection';
import { ApiEndpoint } from '../shared/ApiEndpoint';
import { CodeBlock } from '../shared/CodeBlock';

export const DistrictsSection = () => {
  // Code visibility state
  const [showExampleCode, setShowExampleCode] = useState(false);

  const getAllDistrictsExample = `curl -X GET "https://api.lankalocate.lk/v1/districts" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getAllDistrictsResponse = `{
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
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}`;

  const getDistrictsByProvinceExample = `curl -X GET "https://api.lankalocate.lk/v1/districts?province=Western" \\
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
      "provinceId": 1
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
      "provinceId": 1
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
      "provinceId": 1
    }
  ]
}`;

  const getDistrictByIdExample = `curl -X GET "https://api.lankalocate.lk/v1/districts/1" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getDistrictByIdResponse = `{
  "success": true,
  "data": {
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
  }
}`;

  const getDivisionsByDistrictExample = `curl -X GET "https://api.lankalocate.lk/v1/districts/1/divisions" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getDivisionsByDistrictResponse = `{
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
    "total": 557,
    "page": 1,
    "limit": 50,
    "hasNext": true,
    "hasPrev": false
  }
}`;

  return (
    <DocsSection 
      title="Districts API"
      description="Access information about all 25 districts in Sri Lanka, including their GN divisions, population, and administrative details."
    >
      <div className="space-y-8">
        {/* Get All Districts */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/districts"
          description="Retrieve a list of all districts in Sri Lanka with basic information."
          parameters={[
            {
              name: "province",
              type: "string",
              required: false,
              description: "Filter districts by province name",
              example: "Western"
            }
          ]}
          example={getAllDistrictsExample}
          exampleResponse={getAllDistrictsResponse}
        />

        {/* Get Districts by Province */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/districts?province={province}"
          description="Get all districts within a specific province."
          parameters={[
            {
              name: "province",
              type: "string",
              required: true,
              description: "The name of the province",
              example: "Western"
            }
          ]}
          example={getDistrictsByProvinceExample}
          exampleResponse={getDistrictsByProvinceResponse}
        />

        {/* Get District by ID */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/districts/{id}"
          description="Get detailed information about a specific district."
          parameters={[
            {
              name: "id",
              type: "integer",
              required: true,
              description: "The unique identifier of the district",
              example: "1"
            }
          ]}
          example={getDistrictByIdExample}
          exampleResponse={getDistrictByIdResponse}
        />

        {/* Get GN Divisions by District */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/districts/{id}/divisions"
          description="Get all GN divisions within a specific district."
          parameters={[
            {
              name: "id",
              type: "integer",
              required: true,
              description: "The unique identifier of the district",
              example: "1"
            }
          ]}
          example={getDivisionsByDistrictExample}
          exampleResponse={getDivisionsByDistrictResponse}
        />

        {/* District Data Structure */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">District Object Structure</h3>
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
                  <td className="py-2 px-3">Unique identifier for the district</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">name</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">District name in English</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">nameSi</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">District name in Sinhala</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">nameTa</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">District name in Tamil</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">code</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Three-letter district code</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">capital</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">District capital city</td>
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
                  <td className="py-2 px-3 font-mono">province</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Name of the parent province</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">provinceId</td>
                  <td className="py-2 px-3">integer</td>
                  <td className="py-2 px-3">ID of the parent province</td>
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
              <p className="text-text-secondary mt-1">Complete code examples for integrating the Districts API</p>
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
                  code={`// Districts API Client
class DistrictsAPI {
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

  // Get all districts
  async getAllDistricts(province = null) {
    const query = province ? \`?province=\${encodeURIComponent(province)}\` : '';
    return await this.request(\`/districts\${query}\`);
  }

  // Get district by ID
  async getDistrictById(id) {
    return await this.request(\`/districts/\${id}\`);
  }

  // Get divisions by district
  async getDivisionsByDistrict(id, limit = 50) {
    return await this.request(\`/districts/\${id}/divisions?limit=\${limit}\`);
  }
}

// Usage Example
const api = new DistrictsAPI('your-api-key');

// Get all districts in Western Province
api.getAllDistricts('Western')
  .then(data => {
    console.log('Districts:', data.data);
    data.data.forEach(district => {
      console.log(\`\${district.name} (\${district.nameSi}) - Pop: \${district.population.toLocaleString()}\`);
    });
  })
  .catch(error => console.error('Error:', error));

// Get specific district details
api.getDistrictById(1)
  .then(data => {
    const district = data.data;
    console.log(\`District: \${district.name}\`);
    console.log(\`Capital: \${district.capital}\`);
    console.log(\`Population: \${district.population.toLocaleString()}\`);
    console.log(\`Area: \${district.area} km²\`);
  });`}
                  language="javascript"
                  title="districts-api.js"
                />
              </div>

              {/* React Hook Example */}
              <div>
                <h4 className="text-md font-semibold text-text-primary mb-3">React Hook Implementation</h4>
                <CodeBlock 
                  code={`import { useState, useEffect } from 'react';

// Custom hook for Districts API
const useDistricts = (apiKey) => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = 'https://api.lankalocate.lk/v1';

  const fetchDistricts = async (province = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const query = province ? \`?province=\${encodeURIComponent(province)}\` : '';
      const response = await fetch(\`\${baseUrl}/districts\${query}\`, {
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }

      const data = await response.json();
      setDistricts(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { districts, loading, error, fetchDistricts };
};

// React Component Example
const DistrictsSelector = ({ apiKey, onDistrictSelect }) => {
  const { districts, loading, error, fetchDistricts } = useDistricts(apiKey);
  const [selectedProvince, setSelectedProvince] = useState('');

  useEffect(() => {
    fetchDistricts();
  }, []);

  const handleProvinceChange = (province) => {
    setSelectedProvince(province);
    fetchDistricts(province || null);
  };

  if (loading) return <div className="flex items-center space-x-2">
    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
    <span>Loading districts...</span>
  </div>;

  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Filter by Province</label>
        <select 
          value={selectedProvince}
          onChange={(e) => handleProvinceChange(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">All Provinces</option>
          <option value="Western">Western Province</option>
          <option value="Central">Central Province</option>
          <option value="Southern">Southern Province</option>
          {/* Add other provinces */}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Select District</label>
        <select 
          onChange={(e) => onDistrictSelect(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Choose a district...</option>
          {districts.map(district => (
            <option key={district.id} value={district.id}>
              {district.name} ({district.nameSi}) - {district.population.toLocaleString()} people
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DistrictsSelector;`}
                  language="typescript"
                  title="DistrictsSelector.tsx"
                />
              </div>

              {/* Python Example */}
              <div>
                <h4 className="text-md font-semibold text-text-primary mb-3">Python Implementation</h4>
                <CodeBlock 
                  code={`import requests
import json
from typing import Optional, List, Dict

class DistrictsAPI:
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

    def get_all_districts(self, province: Optional[str] = None) -> List[Dict]:
        """Get all districts, optionally filtered by province"""
        endpoint = "/districts"
        if province:
            endpoint += f"?province={province}"
        
        result = self._make_request(endpoint)
        return result.get("data", [])

    def get_district_by_id(self, district_id: int) -> Dict:
        """Get district details by ID"""
        result = self._make_request(f"/districts/{district_id}")
        return result.get("data", {})

    def get_divisions_by_district(self, district_id: int, limit: int = 50) -> List[Dict]:
        """Get GN divisions within a district"""
        result = self._make_request(f"/districts/{district_id}/divisions?limit={limit}")
        return result.get("data", [])

    def search_districts(self, **filters) -> List[Dict]:
        """Search districts with various filters"""
        districts = self.get_all_districts()
        
        # Apply filters
        filtered = districts
        
        if filters.get('min_population'):
            filtered = [d for d in filtered if d['population'] >= filters['min_population']]
        
        if filters.get('max_population'):
            filtered = [d for d in filtered if d['population'] <= filters['max_population']]
            
        if filters.get('province'):
            filtered = [d for d in filtered if filters['province'].lower() in d['province'].lower()]
        
        return filtered

# Usage Examples
if __name__ == "__main__":
    # Initialize API client
    api = DistrictsAPI("your-api-key-here")
    
    try:
        # Get all districts
        all_districts = api.get_all_districts()
        print(f"Total districts: {len(all_districts)}")
        
        # Get districts in Western Province
        western_districts = api.get_all_districts("Western")
        print(f"\\nDistricts in Western Province:")
        for district in western_districts:
            print(f"  {district['name']} ({district['nameSi']}) - {district['population']:,} people")
        
        # Get specific district
        colombo = api.get_district_by_id(1)
        print(f"\\nColombo District:")
        print(f"  Capital: {colombo['capital']}")
        print(f"  Area: {colombo['area']} km²")
        print(f"  Population: {colombo['population']:,}")
        
        # Get divisions in Colombo
        divisions = api.get_divisions_by_district(1, limit=10)
        print(f"\\nFirst 10 GN Divisions in Colombo:")
        for division in divisions:
            print(f"  {division['name']} ({division['gnNumber']}) - {division['population']:,} people")
            
        # Search districts with filters
        large_districts = api.search_districts(min_population=2000000)
        print(f"\\nDistricts with population > 2M:")
        for district in large_districts:
            print(f"  {district['name']}: {district['population']:,}")
            
    except requests.exceptions.RequestException as e:
        print(f"API Error: {e}")
    except Exception as e:
        print(f"Error: {e}")`}
                  language="python"
                  title="districts_api.py"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DocsSection>
  );
};
