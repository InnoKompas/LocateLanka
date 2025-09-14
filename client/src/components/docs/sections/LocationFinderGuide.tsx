import { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { DocsSection } from '../shared/DocsSection';
import { CodeBlock } from '../shared/CodeBlock';

export const LocationFinderGuide = () => {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedDSD, setSelectedDSD] = useState('');

  const htmlStructure = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sri Lanka Location Finder</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-8">
    <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Location Finder</h1>
        
        <div class="bg-white rounded-lg shadow-md p-6 space-y-6">
            <!-- Province Selection -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Province
                </label>
                <select id="province-select" class="w-full p-3 border border-gray-300 rounded-lg">
                    <option value="">Select a province...</option>
                </select>
            </div>

            <!-- District Selection -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    District
                </label>
                <select id="district-select" class="w-full p-3 border border-gray-300 rounded-lg" disabled>
                    <option value="">Select a district...</option>
                </select>
            </div>

            <!-- DSD Selection -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Divisional Secretariat
                </label>
                <select id="dsd-select" class="w-full p-3 border border-gray-300 rounded-lg" disabled>
                    <option value="">Select a DSD...</option>
                </select>
            </div>

            <!-- GN Division Selection -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    GN Division
                </label>
                <select id="division-select" class="w-full p-3 border border-gray-300 rounded-lg" disabled>
                    <option value="">Select a GN division...</option>
                </select>
            </div>

            <!-- Results -->
            <div id="results" class="hidden bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 class="font-medium text-blue-900 mb-2">Selected Location:</h3>
                <div id="location-details" class="text-sm text-blue-700"></div>
            </div>
        </div>
    </div>

    <script src="location-finder.js"></script>
</body>
</html>`;

  const jsImplementation = `class LocationFinder {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.lankalocate.lk/v1';
        this.init();
    }

    async init() {
        await this.loadProvinces();
        this.setupEventListeners();
    }

    async makeRequest(endpoint) {
        try {
            const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
                headers: {
                    'Authorization': \`Bearer \${this.apiKey}\`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(\`HTTP error! status: \${response.status}\`);
            }

            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('API request failed:', error);
            return [];
        }
    }

    async loadProvinces() {
        const provinces = await this.makeRequest('/provinces');
        const select = document.getElementById('province-select');
        
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province.id;
            option.textContent = province.name;
            select.appendChild(option);
        });
    }

    async loadDistricts(provinceId) {
        const districts = await this.makeRequest(\`/provinces/\${provinceId}/districts\`);
        const select = document.getElementById('district-select');
        
        // Clear previous options
        select.innerHTML = '<option value="">Select a district...</option>';
        
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district.id;
            option.textContent = district.name;
            select.appendChild(option);
        });
        
        select.disabled = false;
        this.resetSelects(['dsd-select', 'division-select']);
    }

    async loadDSDs(districtId) {
        const dsds = await this.makeRequest(\`/districts/\${districtId}/dsds\`);
        const select = document.getElementById('dsd-select');
        
        select.innerHTML = '<option value="">Select a DSD...</option>';
        
        dsds.forEach(dsd => {
            const option = document.createElement('option');
            option.value = dsd.id;
            option.textContent = dsd.name;
            select.appendChild(option);
        });
        
        select.disabled = false;
        this.resetSelects(['division-select']);
    }

    async loadDivisions(dsdId) {
        const divisions = await this.makeRequest(\`/dsds/\${dsdId}/divisions\`);
        const select = document.getElementById('division-select');
        
        select.innerHTML = '<option value="">Select a GN division...</option>';
        
        divisions.forEach(division => {
            const option = document.createElement('option');
            option.value = division.id;
            option.textContent = division.name;
            select.appendChild(option);
        });
        
        select.disabled = false;
    }

    resetSelects(selectIds) {
        selectIds.forEach(id => {
            const select = document.getElementById(id);
            select.innerHTML = '<option value="">Select...</option>';
            select.disabled = true;
        });
        this.hideResults();
    }

    showResults(data) {
        const resultsDiv = document.getElementById('results');
        const detailsDiv = document.getElementById('location-details');
        
        detailsDiv.innerHTML = \`
            <div class="space-y-2">
                <div><strong>Province:</strong> \${data.province}</div>
                <div><strong>District:</strong> \${data.district}</div>
                <div><strong>DSD:</strong> \${data.dsd}</div>
                <div><strong>GN Division:</strong> \${data.division}</div>
            </div>
        \`;
        
        resultsDiv.classList.remove('hidden');
    }

    hideResults() {
        document.getElementById('results').classList.add('hidden');
    }

    setupEventListeners() {
        document.getElementById('province-select').addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadDistricts(e.target.value);
            } else {
                this.resetSelects(['district-select', 'dsd-select', 'division-select']);
            }
        });

        document.getElementById('district-select').addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadDSDs(e.target.value);
            } else {
                this.resetSelects(['dsd-select', 'division-select']);
            }
        });

        document.getElementById('dsd-select').addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadDivisions(e.target.value);
            } else {
                this.resetSelects(['division-select']);
            }
        });

        document.getElementById('division-select').addEventListener('change', (e) => {
            if (e.target.value) {
                // Get selected text from all dropdowns
                const province = document.getElementById('province-select').selectedOptions[0].text;
                const district = document.getElementById('district-select').selectedOptions[0].text;
                const dsd = document.getElementById('dsd-select').selectedOptions[0].text;
                const division = e.target.selectedOptions[0].text;
                
                this.showResults({ province, district, dsd, division });
            }
        });
    }
}

// Initialize the location finder
document.addEventListener('DOMContentLoaded', () => {
    const finder = new LocationFinder('YOUR_API_KEY_HERE');
});`;

  const reactImplementation = `import React, { useState, useEffect } from 'react';

const LocationFinder = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [dsds, setDsds] = useState([]);
    const [divisions, setDivisions] = useState([]);
    
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedDSD, setSelectedDSD] = useState('');
    const [selectedDivision, setSelectedDivision] = useState('');
    
    const [loading, setLoading] = useState(false);

    const API_KEY = process.env.REACT_APP_LANKALOCATE_API_KEY;
    const BASE_URL = 'https://api.lankalocate.lk/v1';

    const makeRequest = async (endpoint) => {
        try {
            const response = await fetch(\`\${BASE_URL}\${endpoint}\`, {
                headers: {
                    'Authorization': \`Bearer \${API_KEY}\`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Request failed');
            
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    };

    useEffect(() => {
        loadProvinces();
    }, []);

    const loadProvinces = async () => {
        setLoading(true);
        const data = await makeRequest('/provinces');
        setProvinces(data);
        setLoading(false);
    };

    const handleProvinceChange = async (provinceId) => {
        setSelectedProvince(provinceId);
        setSelectedDistrict('');
        setSelectedDSD('');
        setSelectedDivision('');
        setDistricts([]);
        setDsds([]);
        setDivisions([]);

        if (provinceId) {
            setLoading(true);
            const data = await makeRequest(\`/provinces/\${provinceId}/districts\`);
            setDistricts(data);
            setLoading(false);
        }
    };

    const handleDistrictChange = async (districtId) => {
        setSelectedDistrict(districtId);
        setSelectedDSD('');
        setSelectedDivision('');
        setDsds([]);
        setDivisions([]);

        if (districtId) {
            setLoading(true);
            const data = await makeRequest(\`/districts/\${districtId}/dsds\`);
            setDsds(data);
            setLoading(false);
        }
    };

    const handleDSDChange = async (dsdId) => {
        setSelectedDSD(dsdId);
        setSelectedDivision('');
        setDivisions([]);

        if (dsdId) {
            setLoading(true);
            const data = await makeRequest(\`/dsds/\${dsdId}/divisions\`);
            setDivisions(data);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Location Finder</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Province Select */}
                <div>
                    <label className="block text-sm font-medium mb-2">Province</label>
                    <select 
                        value={selectedProvince}
                        onChange={(e) => handleProvinceChange(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        disabled={loading}
                    >
                        <option value="">Select a province...</option>
                        {provinces.map(province => (
                            <option key={province.id} value={province.id}>
                                {province.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* District Select */}
                <div>
                    <label className="block text-sm font-medium mb-2">District</label>
                    <select 
                        value={selectedDistrict}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        disabled={!selectedProvince || loading}
                    >
                        <option value="">Select a district...</option>
                        {districts.map(district => (
                            <option key={district.id} value={district.id}>
                                {district.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Results */}
                {selectedDivision && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-medium text-blue-900 mb-2">Selected Location:</h3>
                        <div className="text-sm text-blue-700 space-y-1">
                            <div><strong>Province:</strong> {provinces.find(p => p.id == selectedProvince)?.name}</div>
                            <div><strong>District:</strong> {districts.find(d => d.id == selectedDistrict)?.name}</div>
                            <div><strong>DSD:</strong> {dsds.find(d => d.id == selectedDSD)?.name}</div>
                            <div><strong>GN Division:</strong> {divisions.find(d => d.id == selectedDivision)?.name}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationFinder;`;

  return (
    <DocsSection 
      title="Building a Location Finder"
      description="Learn how to create a cascading dropdown location finder using the LankaLocate API. This guide shows you how to build an interactive form that allows users to select their location from province down to GN division level."
    >
      <div className="space-y-8">
        {/* Interactive Demo */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary-600" />
            <span>Interactive Demo</span>
          </h3>
          
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Province</label>
              <div className="relative">
                <select 
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedDistrict('');
                    setSelectedDSD('');
                  }}
                  className="w-full p-3 border border-border rounded-lg bg-surface text-text-primary appearance-none"
                >
                  <option value="">Select a province...</option>
                  <option value="western">Western Province</option>
                  <option value="central">Central Province</option>
                  <option value="southern">Southern Province</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">District</label>
              <div className="relative">
                <select 
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedDSD('');
                  }}
                  disabled={!selectedProvince}
                  className="w-full p-3 border border-border rounded-lg bg-surface text-text-primary appearance-none disabled:opacity-50"
                >
                  <option value="">Select a district...</option>
                  {selectedProvince === 'western' && (
                    <>
                      <option value="colombo">Colombo</option>
                      <option value="gampaha">Gampaha</option>
                      <option value="kalutara">Kalutara</option>
                    </>
                  )}
                  {selectedProvince === 'central' && (
                    <>
                      <option value="kandy">Kandy</option>
                      <option value="matale">Matale</option>
                      <option value="nuwara-eliya">Nuwara Eliya</option>
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Divisional Secretariat</label>
              <div className="relative">
                <select 
                  value={selectedDSD}
                  onChange={(e) => setSelectedDSD(e.target.value)}
                  disabled={!selectedDistrict}
                  className="w-full p-3 border border-border rounded-lg bg-surface text-text-primary appearance-none disabled:opacity-50"
                >
                  <option value="">Select a DSD...</option>
                  {selectedDistrict === 'colombo' && (
                    <>
                      <option value="colombo">Colombo</option>
                      <option value="thimbirigasyaya">Thimbirigasyaya</option>
                      <option value="dehiwala">Dehiwala-Mount Lavinia</option>
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              </div>
            </div>

            {selectedDSD && (
              <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                <h4 className="font-medium text-primary-900 dark:text-primary-100 mb-2">Selected Location:</h4>
                <div className="text-sm text-primary-700 dark:text-primary-300 space-y-1">
                  <div><strong>Province:</strong> {selectedProvince === 'western' ? 'Western Province' : 'Central Province'}</div>
                  <div><strong>District:</strong> {selectedDistrict.charAt(0).toUpperCase() + selectedDistrict.slice(1)}</div>
                  <div><strong>DSD:</strong> {selectedDSD.charAt(0).toUpperCase() + selectedDSD.slice(1)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* HTML Structure */}
        <div>
          <h2 className="text-heading-2 font-semibold text-text-primary mb-4">HTML Structure</h2>
          <p className="text-text-secondary mb-4">
            Start with a clean HTML structure that includes dropdowns for each administrative level:
          </p>
          <CodeBlock code={htmlStructure} language="html" title="index.html" />
        </div>

        {/* JavaScript Implementation */}
        <div>
          <h2 className="text-heading-2 font-semibold text-text-primary mb-4">JavaScript Implementation</h2>
          <p className="text-text-secondary mb-4">
            Create a LocationFinder class that handles the cascading dropdown logic and API calls:
          </p>
          <CodeBlock code={jsImplementation} language="javascript" title="location-finder.js" />
        </div>

        {/* React Implementation */}
        <div>
          <h2 className="text-heading-2 font-semibold text-text-primary mb-4">React Implementation</h2>
          <p className="text-text-secondary mb-4">
            For React applications, here's a complete component implementation:
          </p>
          <CodeBlock code={reactImplementation} language="javascript" title="LocationFinder.jsx" />
        </div>

        {/* Key Features */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-text-primary">Cascading Dropdowns</h4>
                  <p className="text-sm text-text-secondary">Each selection filters the next level options</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-text-primary">Error Handling</h4>
                  <p className="text-sm text-text-secondary">Graceful handling of API failures</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-text-primary">Loading States</h4>
                  <p className="text-sm text-text-secondary">Visual feedback during API calls</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-text-primary">Responsive Design</h4>
                  <p className="text-sm text-text-secondary">Works on all device sizes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-text-primary">Accessibility</h4>
                  <p className="text-sm text-text-secondary">Proper labels and keyboard navigation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-text-primary">Customizable</h4>
                  <p className="text-sm text-text-secondary">Easy to style and extend</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-4">Next Steps</h3>
          <div className="space-y-3">
            <p className="text-primary-700 dark:text-primary-300 text-sm">
              Now that you have a working location finder, consider these enhancements:
            </p>
            <ul className="space-y-2 text-sm text-primary-700 dark:text-primary-300">
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Add search functionality within dropdowns</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Implement autocomplete for faster selection</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Add map integration to visualize selections</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Cache API responses for better performance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DocsSection>
  );
};
