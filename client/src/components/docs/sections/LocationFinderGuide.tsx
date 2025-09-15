import { useState, useEffect } from 'react';
import { MapPin, ChevronDown, ChevronUp, Loader2, Search, Globe, Users, BarChart3, Zap, Target, Key, AlertTriangle, Code } from 'lucide-react';
import { DocsSection } from '../shared/DocsSection';
import { CodeBlock } from '../shared/CodeBlock';
import locationService, { type Province, type District, type DSD, type Division } from '../../../services/location.service';

export const LocationFinderGuide = () => {
  // State for real data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [dsds, setDsds] = useState<DSD[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);

  // Selection state
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedDSD, setSelectedDSD] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');

  // UI state
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  // Code section visibility state
  const [codeVisibility, setCodeVisibility] = useState({
    html: false,
    javascript: false,
    react: false
  });

  // Check for existing API key on mount
  useEffect(() => {
    const status = locationService.getConnectionStatus();
    setIsApiKeySet(status.hasApiKey);
    if (!status.hasApiKey) {
      setShowApiKeyInput(true);
    }
  }, []);

  const handleApiKeySubmit = async () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }

    setLoading(prev => ({ ...prev, apiKey: true }));
    setError('');

    try {
      locationService.setApiKey(apiKey.trim());
      const isValid = await locationService.validateApiKey();
      
      if (isValid) {
        setIsApiKeySet(true);
        setShowApiKeyInput(false);
        setApiKey('');
        // Load provinces after successful API key validation
        await loadProvinces();
      } else {
        locationService.clearApiKey();
        setError('Invalid API key. Please check your credentials.');
      }
    } catch (err) {
      locationService.clearApiKey();
      setError(`API key validation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(prev => ({ ...prev, apiKey: false }));
    }
  };

  const handleClearApiKey = () => {
    locationService.clearApiKey();
    setIsApiKeySet(false);
    setShowApiKeyInput(true);
    setProvinces([]);
    setDistricts([]);
    setDsds([]);
    setDivisions([]);
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedDSD('');
    setSelectedDivision('');
    setError('');
  };

  const toggleCodeVisibility = (section: keyof typeof codeVisibility) => {
    setCodeVisibility(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Load provinces on component mount if API key exists
  useEffect(() => {
    if (isApiKeySet) {
      loadProvinces();
    }
  }, [isApiKeySet]);

  const loadProvinces = async () => {
    if (!isApiKeySet) return;
    
    setLoading(prev => ({ ...prev, provinces: true }));
    setError('');
    try {
      const data = await locationService.getProvinces();
      setProvinces(data);
    } catch (err) {
      setError(`Failed to load provinces: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  const handleProvinceChange = async (provinceId: string) => {
    setSelectedProvince(provinceId);
    setSelectedDistrict('');
    setSelectedDSD('');
    setSelectedDivision('');
    setDistricts([]);
    setDsds([]);
    setDivisions([]);

    if (provinceId && isApiKeySet) {
      setLoading(prev => ({ ...prev, districts: true }));
      try {
        const data = await locationService.getDistrictsByProvince(parseInt(provinceId));
        setDistricts(data);
      } catch (err) {
        setError(`Failed to load districts: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(prev => ({ ...prev, districts: false }));
      }
    }
  };

  const handleDistrictChange = async (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedDSD('');
    setSelectedDivision('');
    setDsds([]);
    setDivisions([]);

    if (districtId && isApiKeySet) {
      setLoading(prev => ({ ...prev, dsds: true }));
      try {
        // Find the selected district to get its name for the API call
        const selectedDistrictData = districts.find(d => d.id.toString() === districtId);
        if (selectedDistrictData) {
          const data = await locationService.getDSDs({ district: selectedDistrictData.name });
          setDsds(data);
        }
      } catch (err) {
        setError(`Failed to load DSDs: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(prev => ({ ...prev, dsds: false }));
      }
    }
  };

  const handleDSDChange = async (dsdId: string) => {
    setSelectedDSD(dsdId);
    setSelectedDivision('');
    setDivisions([]);

    if (dsdId && isApiKeySet) {
      setLoading(prev => ({ ...prev, divisions: true }));
      try {
        const data = await locationService.getDivisionsByDSD(dsdId);
        setDivisions(data);
      } catch (err) {
        setError(`Failed to load divisions: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(prev => ({ ...prev, divisions: false }));
      }
    }
  };

  const selectedProvinceData = provinces.find(p => p.id.toString() === selectedProvince);
  const selectedDistrictData = districts.find(d => d.id.toString() === selectedDistrict);
  const selectedDSDData = dsds.find(d => d.id === selectedDSD);
  const selectedDivisionData = divisions.find(d => d.id === selectedDivision);

  // Collapsible Code Section Component
  const CollapsibleCodeSection = ({ 
    title, 
    description, 
    code, 
    language, 
    filename, 
    isVisible, 
    onToggle, 
    icon 
  }: {
    title: string;
    description: string;
    code: string;
    language: string;
    filename: string;
    isVisible: boolean;
    onToggle: () => void;
    icon: React.ReactNode;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
            <p className="text-text-secondary mt-1">{description}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-700"
        >
          <Code className="w-4 h-4" />
          {isVisible ? (
            <>
              <span>Hide Code</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Show Code</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
      
      {isVisible && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <CodeBlock code={code} language={language} title={filename} />
        </div>
      )}
    </div>
  );

  const htmlStructure = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sri Lanka Location Finder</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">🇱🇰 Location Finder</h1>
            <p class="text-gray-600">Discover Sri Lanka's administrative divisions</p>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <!-- Province Selection -->
            <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">
                    🏛️ Province
                </label>
                <select id="province-select" class="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                    <option value="">Select a province...</option>
                </select>
            </div>

            <!-- District Selection -->
            <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">
                    🏘️ District
                </label>
                <select id="district-select" class="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" disabled>
                    <option value="">Select a district...</option>
                </select>
            </div>

            <!-- DSD Selection -->
            <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">
                    📍 Divisional Secretariat
                </label>
                <select id="dsd-select" class="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" disabled>
                    <option value="">Select a DSD...</option>
                </select>
            </div>

            <!-- GN Division Selection -->
            <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">
                    🏠 GN Division
                </label>
                <select id="division-select" class="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" disabled>
                    <option value="">Select a GN division...</option>
                </select>
            </div>

            <!-- Results -->
            <div id="results" class="hidden bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                <h3 class="font-bold text-blue-900 mb-4 text-lg">📋 Selected Location Details</h3>
                <div id="location-details" class="grid md:grid-cols-2 gap-4"></div>
            </div>
        </div>
    </div>

    <script src="location-finder.js"></script>
</body>
</html>`;

  const jsImplementation = `class LocationFinder {
     constructor(apiKey, baseUrl = 'http://localhost:3000/api/v1') {
        this.apiKey = apiKey;
         this.baseUrl = baseUrl;
         this.cache = new Map(); // Simple caching
        this.init();
    }

    async init() {
        await this.loadProvinces();
        this.setupEventListeners();
        this.setupLoadingStates();
    }

    async makeRequest(endpoint, useCache = true) {
        // Check cache first
        if (useCache && this.cache.has(endpoint)) {
            return this.cache.get(endpoint);
        }

        try {
            this.showLoading(endpoint);
            
            const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
                headers: {
                    'Authorization': \`Bearer \${this.apiKey}\`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
            }

            const data = await response.json();
            const result = data.success ? data.data : [];
            
            // Cache the result
            if (useCache) {
                this.cache.set(endpoint, result);
            }
            
            return result;
        } catch (error) {
            this.showError(\`Failed to load data: \${error.message}\`);
            return [];
        } finally {
            this.hideLoading(endpoint);
        }
    }

    showLoading(endpoint) {
        // Add loading spinner to relevant select
        const selectMap = {
            '/provinces': 'province-select',
            '/districts': 'district-select',
            '/dsds': 'dsd-select',
            '/divisions': 'division-select'
        };
        
        const selectId = Object.keys(selectMap).find(key => endpoint.includes(key));
        if (selectId) {
            const select = document.getElementById(selectMap[selectId]);
            select.style.opacity = '0.6';
        }
    }

    hideLoading(endpoint) {
        const selectMap = {
            '/provinces': 'province-select',
            '/districts': 'district-select', 
            '/dsds': 'dsd-select',
            '/divisions': 'division-select'
        };
        
        const selectId = Object.keys(selectMap).find(key => endpoint.includes(key));
        if (selectId) {
            const select = document.getElementById(selectMap[selectId]);
            select.style.opacity = '1';
        }
    }

    showError(message) {
        // Create or update error message
        let errorDiv = document.getElementById('error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'error-message';
            errorDiv.className = 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4';
            document.querySelector('.space-y-6').prepend(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => errorDiv.classList.add('hidden'), 5000);
    }

    async loadProvinces() {
        const provinces = await this.makeRequest('/provinces');
        const select = document.getElementById('province-select');
        
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province.id;
            option.textContent = \`\${province.name} (\${province.nameSi})\`;
            option.dataset.province = JSON.stringify(province);
            select.appendChild(option);
        });
    }

    async loadDistricts(provinceId) {
        const districts = await this.makeRequest(\`/provinces/\${provinceId}/districts\`);
        const select = document.getElementById('district-select');
        
        select.innerHTML = '<option value="">Select a district...</option>';
        
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district.id;
            option.textContent = \`\${district.name} (\${district.nameSi})\`;
            option.dataset.district = JSON.stringify(district);
            select.appendChild(option);
        });
        
        select.disabled = false;
        this.resetSelects(['dsd-select', 'division-select']);
    }

     async loadDSDs(districtName) {
         const dsds = await this.makeRequest(\`/dsds?district=\${encodeURIComponent(districtName)}\`);
        const select = document.getElementById('dsd-select');
        
        select.innerHTML = '<option value="">Select a DSD...</option>';
        
        dsds.forEach(dsd => {
            const option = document.createElement('option');
            option.value = dsd.id;
            option.textContent = \`\${dsd.name} (\${dsd.divisionCount} divisions)\`;
            option.dataset.dsd = JSON.stringify(dsd);
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
            option.textContent = \`\${division.name} (\${division.gnNumber})\`;
            option.dataset.division = JSON.stringify(division);
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

    showResults() {
        const provinceSelect = document.getElementById('province-select');
        const districtSelect = document.getElementById('district-select');
        const dsdSelect = document.getElementById('dsd-select');
        const divisionSelect = document.getElementById('division-select');
        
        const province = JSON.parse(provinceSelect.selectedOptions[0]?.dataset.province || '{}');
        const district = JSON.parse(districtSelect.selectedOptions[0]?.dataset.district || '{}');
        const dsd = JSON.parse(dsdSelect.selectedOptions[0]?.dataset.dsd || '{}');
        const division = JSON.parse(divisionSelect.selectedOptions[0]?.dataset.division || '{}');
        
        const resultsDiv = document.getElementById('results');
        const detailsDiv = document.getElementById('location-details');
        
        detailsDiv.innerHTML = \`
            <div class="space-y-3">
                <div class="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <h4 class="font-semibold text-gray-900">🏛️ Province</h4>
                    <p class="text-gray-700">\${province.name}</p>
                    <p class="text-sm text-gray-500">Capital: \${province.capital} | Population: \${province.population?.toLocaleString()}</p>
                </div>
                <div class="bg-white rounded-lg p-4 border-l-4 border-green-500">
                    <h4 class="font-semibold text-gray-900">🏘️ District</h4>
                    <p class="text-gray-700">\${district.name}</p>
                    <p class="text-sm text-gray-500">Capital: \${district.capital} | Population: \${district.population?.toLocaleString()}</p>
                </div>
            </div>
            <div class="space-y-3">
                <div class="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                    <h4 class="font-semibold text-gray-900">📍 DSD</h4>
                    <p class="text-gray-700">\${dsd.name}</p>
                    <p class="text-sm text-gray-500">Divisions: \${dsd.divisionCount}</p>
                </div>
                <div class="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 class="font-semibold text-gray-900">🏠 GN Division</h4>
                    <p class="text-gray-700">\${division.name}</p>
                    <p class="text-sm text-gray-500">GN: \${division.gnNumber} | Population: \${division.population?.toLocaleString()}</p>
                </div>
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
                 // Get district name from the selected option text
                 const selectedOption = e.target.selectedOptions[0];
                 const districtName = selectedOption.textContent.split(' (')[0]; // Extract name before parentheses
                 this.loadDSDs(districtName);
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
                this.showResults();
            } else {
                this.hideResults();
            }
        });
    }

    setupLoadingStates() {
        // Add smooth transitions
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            select.style.transition = 'all 0.3s ease';
        });
    }
}

// Initialize with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
        const finder = new LocationFinder(apiKey);
    } catch (error) {
        console.error('Failed to initialize LocationFinder:', error);
    }
});`;

  const reactImplementation = `import React, { useState, useEffect } from 'react';
import { Loader2, MapPin, Users, BarChart3, Globe } from 'lucide-react';

interface LocationData {
    provinces: Province[];
    districts: District[];
    dsds: DSD[];
    divisions: Division[];
}

const LocationFinder: React.FC = () => {
    // State management
    const [data, setData] = useState<LocationData>({
        provinces: [],
        districts: [],
        dsds: [],
        divisions: []
    });
    
    const [selections, setSelections] = useState({
        province: '',
        district: '',
        dsd: '',
        division: ''
    });
    
    const [loading, setLoading] = useState({
        provinces: false,
        districts: false,
        dsds: false,
        divisions: false
    });
    
    const [error, setError] = useState<string>('');

     // API Configuration
     const API_KEY = import.meta.env.VITE_API_KEY || 'your_api_key_here';
     const BASE_URL = import.meta.env.VITE_API_URL ? \`\${import.meta.env.VITE_API_URL}/api/v1\` : 'http://localhost:3000/api/v1';

    // Enhanced API request function with caching and error handling
    const makeRequest = async (endpoint: string): Promise<any[]> => {
        try {
            const response = await fetch(\`\${BASE_URL}\${endpoint}\`, {
                headers: {
                    'Authorization': \`Bearer \${API_KEY}\`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
            }
            
            const result = await response.json();
            return result.success ? result.data : [];
        } catch (error) {
            console.error('API Error:', error);
            setError(\`Failed to load data: \${error instanceof Error ? error.message : 'Unknown error'}\`);
            return [];
        }
    };

    // Load provinces on component mount
    useEffect(() => {
        loadProvinces();
    }, []);

    const loadProvinces = async () => {
        setLoading(prev => ({ ...prev, provinces: true }));
        setError('');
        
        try {
            const provinces = await makeRequest('/provinces');
            setData(prev => ({ ...prev, provinces }));
        } finally {
            setLoading(prev => ({ ...prev, provinces: false }));
        }
    };

    const handleProvinceChange = async (provinceId: string) => {
        setSelections(prev => ({ ...prev, province: provinceId, district: '', dsd: '', division: '' }));
        setData(prev => ({ ...prev, districts: [], dsds: [], divisions: [] }));

        if (provinceId) {
            setLoading(prev => ({ ...prev, districts: true }));
            try {
                const districts = await makeRequest(\`/provinces/\${provinceId}/districts\`);
                setData(prev => ({ ...prev, districts }));
            } finally {
                setLoading(prev => ({ ...prev, districts: false }));
            }
        }
    };

    const handleDistrictChange = async (districtId: string) => {
        setSelections(prev => ({ ...prev, district: districtId, dsd: '', division: '' }));
        setData(prev => ({ ...prev, dsds: [], divisions: [] }));

        if (districtId) {
            setLoading(prev => ({ ...prev, dsds: true }));
             try {
                 const dsds = await makeRequest(\`/dsds?district=\${districtId}\`);
                 setData(prev => ({ ...prev, dsds }));
             } finally {
                setLoading(prev => ({ ...prev, dsds: false }));
            }
        }
    };

    const handleDSDChange = async (dsdId: string) => {
        setSelections(prev => ({ ...prev, dsd: dsdId, division: '' }));
        setData(prev => ({ ...prev, divisions: [] }));

        if (dsdId) {
            setLoading(prev => ({ ...prev, divisions: true }));
            try {
                const divisions = await makeRequest(\`/dsds/\${dsdId}/divisions\`);
                setData(prev => ({ ...prev, divisions }));
            } finally {
                setLoading(prev => ({ ...prev, divisions: false }));
            }
        }
    };

    // Get selected data objects
    const selectedProvince = data.provinces.find(p => p.id.toString() === selections.province);
    const selectedDistrict = data.districts.find(d => d.id.toString() === selections.district);
    const selectedDSD = data.dsds.find(d => d.id === selections.dsd);
    const selectedDivision = data.divisions.find(d => d.id === selections.division);

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    🇱🇰 Sri Lanka Location Finder
                </h1>
                <p className="text-gray-600 text-lg">Explore administrative divisions with real-time data</p>
            </div>
            
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    <strong>Error:</strong> {error}
                </div>
            )}
            
            <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                {/* Province Select */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span>Province</span>
                    </label>
                    <div className="relative">
                    <select 
                            value={selections.province}
                        onChange={(e) => handleProvinceChange(e.target.value)}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none bg-white"
                            disabled={loading.provinces}
                    >
                        <option value="">Select a province...</option>
                            {data.provinces.map(province => (
                            <option key={province.id} value={province.id}>
                                    {province.name} ({province.nameSi})
                            </option>
                        ))}
                    </select>
                        {loading.provinces && (
                            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-blue-600" />
                        )}
                    </div>
                </div>

                {/* District Select */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span>District</span>
                    </label>
                    <div className="relative">
                    <select 
                            value={selections.district}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all appearance-none bg-white disabled:opacity-50"
                            disabled={!selections.province || loading.districts}
                    >
                        <option value="">Select a district...</option>
                            {data.districts.map(district => (
                            <option key={district.id} value={district.id}>
                                    {district.name} ({district.nameSi})
                            </option>
                        ))}
                    </select>
                        {loading.districts && (
                            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-green-600" />
                        )}
                    </div>
                </div>

                {/* DSD Select */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                        <BarChart3 className="w-4 h-4 text-purple-600" />
                        <span>Divisional Secretariat</span>
                    </label>
                    <div className="relative">
                        <select 
                            value={selections.dsd}
                            onChange={(e) => handleDSDChange(e.target.value)}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all appearance-none bg-white disabled:opacity-50"
                            disabled={!selections.district || loading.dsds}
                        >
                            <option value="">Select a DSD...</option>
                            {data.dsds.map(dsd => (
                                <option key={dsd.id} value={dsd.id}>
                                    {dsd.name} ({dsd.divisionCount} divisions)
                                </option>
                            ))}
                        </select>
                        {loading.dsds && (
                            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-purple-600" />
                        )}
                    </div>
                </div>

                {/* Division Select */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                        <Users className="w-4 h-4 text-orange-600" />
                        <span>GN Division</span>
                    </label>
                    <div className="relative">
                        <select 
                            value={selections.division}
                            onChange={(e) => setSelections(prev => ({ ...prev, division: e.target.value }))}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all appearance-none bg-white disabled:opacity-50"
                            disabled={!selections.dsd || loading.divisions}
                        >
                            <option value="">Select a GN division...</option>
                            {data.divisions.map(division => (
                                <option key={division.id} value={division.id}>
                                    {division.name} ({division.gnNumber})
                                </option>
                            ))}
                        </select>
                        {loading.divisions && (
                            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-orange-600" />
                        )}
                    </div>
                </div>

                {/* Results Display */}
                {selections.division && selectedDivision && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mt-8">
                        <h3 className="font-bold text-blue-900 mb-6 text-xl flex items-center space-x-2">
                            <Target className="w-6 h-6" />
                            <span>📋 Selected Location Details</span>
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {/* Province Card */}
                                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Globe className="w-5 h-5 text-blue-600" />
                                        <h4 className="font-semibold text-gray-900">Province</h4>
                                    </div>
                                    <p className="text-lg font-medium text-gray-800">{selectedProvince?.name}</p>
                                    <p className="text-sm text-gray-600">{selectedProvince?.nameSi}</p>
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>Capital: {selectedProvince?.capital}</span>
                                        <span>Pop: {selectedProvince?.population.toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                {/* District Card */}
                                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <MapPin className="w-5 h-5 text-green-600" />
                                        <h4 className="font-semibold text-gray-900">District</h4>
                                    </div>
                                    <p className="text-lg font-medium text-gray-800">{selectedDistrict?.name}</p>
                                    <p className="text-sm text-gray-600">{selectedDistrict?.nameSi}</p>
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>Capital: {selectedDistrict?.capital}</span>
                                        <span>Pop: {selectedDistrict?.population.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {/* DSD Card */}
                                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <BarChart3 className="w-5 h-5 text-purple-600" />
                                        <h4 className="font-semibold text-gray-900">Divisional Secretariat</h4>
                                    </div>
                                    <p className="text-lg font-medium text-gray-800">{selectedDSD?.name}</p>
                                    <div className="text-xs text-gray-500 mt-2">
                                        <span>{selectedDSD?.divisionCount} GN Divisions</span>
                                    </div>
                                </div>
                                
                                {/* Division Card */}
                                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Users className="w-5 h-5 text-orange-600" />
                                        <h4 className="font-semibold text-gray-900">GN Division</h4>
                                    </div>
                                    <p className="text-lg font-medium text-gray-800">{selectedDivision?.name}</p>
                                    <p className="text-sm text-gray-600">{selectedDivision?.nameSi}</p>
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>GN: {selectedDivision?.gnNumber}</span>
                                        <span>Pop: {selectedDivision?.population.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
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
      title="Building an Interactive Location Finder"
      description="Create a modern, interactive location finder using the LankaLocate API with real-time data, smooth animations, and comprehensive error handling."
    >
      <div className="space-y-8">
        {/* Interactive Demo */}
         <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
           <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-3">
             <div className="p-2 bg-blue-600 rounded-lg">
               <Zap className="w-6 h-6 text-white" />
             </div>
             <span>🇱🇰 Live Production Demo</span>
          </h3>
          
           {/* API Key Management */}
           {showApiKeyInput && (
             <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
               <div className="flex items-center space-x-2 mb-3">
                 <Key className="w-5 h-5 text-blue-600" />
                 <h4 className="font-semibold text-gray-900 dark:text-white">API Key Required</h4>
               </div>
               <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                 Enter your LankaLocate API key to access live data from your backend.
               </p>
               <div className="flex space-x-3">
                 <input
                   type="password"
                   value={apiKey}
                   onChange={(e) => setApiKey(e.target.value)}
                   placeholder="Enter your API key..."
                   className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                   onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
                 />
                 <button
                   onClick={handleApiKeySubmit}
                   disabled={loading.apiKey || !apiKey.trim()}
                   className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                 >
                   {loading.apiKey ? (
                     <Loader2 className="w-4 h-4 animate-spin" />
                   ) : (
                     <Key className="w-4 h-4" />
                   )}
                   <span>{loading.apiKey ? 'Validating...' : 'Connect'}</span>
                 </button>
               </div>
             </div>
           )}

           {/* API Status */}
           <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
             <div className="flex items-center justify-between">
               <div className="flex items-center space-x-2">
                 <div className={`w-3 h-3 rounded-full ${isApiKeySet ? 'bg-green-500' : 'bg-red-500'}`}></div>
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   API Status: {isApiKeySet ? 'Connected' : 'Disconnected'}
                 </span>
               </div>
               {isApiKeySet && (
                 <button
                   onClick={handleClearApiKey}
                   className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                 >
                   Disconnect
                 </button>
               )}
             </div>
             {!isApiKeySet && (
               <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                 Please enter your API key to use the live demo
               </p>
             )}
             {isApiKeySet && (
               <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                 Connected to your LankaLocate API
               </p>
             )}
           </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Selection Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Province Select */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Province</span>
                </label>
              <div className="relative">
                <select 
                  value={selectedProvince}
                     onChange={(e) => handleProvinceChange(e.target.value)}
                     className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                     disabled={!isApiKeySet || loading.provinces}
                >
                  <option value="">Select a province...</option>
                    {provinces.map(province => (
                      <option key={province.id} value={province.id}>
                        {province.name} ({province.nameSi})
                      </option>
                    ))}
                </select>
                  {loading.provinces ? (
                    <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-blue-600" />
                  ) : (
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  )}
              </div>
            </div>

              {/* District Select */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span>District</span>
                </label>
              <div className="relative">
                <select 
                  value={selectedDistrict}
                     onChange={(e) => handleDistrictChange(e.target.value)}
                     disabled={!isApiKeySet || !selectedProvince || loading.districts}
                     className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                >
                  <option value="">Select a district...</option>
                    {districts.map(district => (
                      <option key={district.id} value={district.id}>
                        {district.name} ({district.nameSi})
                      </option>
                    ))}
                </select>
                  {loading.districts ? (
                    <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-green-600" />
                  ) : (
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  )}
              </div>
            </div>

              {/* DSD Select */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  <span>Divisional Secretariat</span>
                </label>
              <div className="relative">
                <select 
                  value={selectedDSD}
                     onChange={(e) => handleDSDChange(e.target.value)}
                     disabled={!isApiKeySet || !selectedDistrict || loading.dsds}
                     className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                >
                  <option value="">Select a DSD...</option>
                    {dsds.map(dsd => (
                      <option key={dsd.id} value={dsd.id}>
                        {dsd.name} ({dsd.divisionCount} divisions)
                      </option>
                    ))}
                  </select>
                  {loading.dsds ? (
                    <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-purple-600" />
                  ) : (
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  )}
                </div>
              </div>

              {/* Division Select */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span>GN Division</span>
                </label>
                <div className="relative">
                   <select 
                     value={selectedDivision}
                     onChange={(e) => setSelectedDivision(e.target.value)}
                     disabled={!isApiKeySet || !selectedDSD || loading.divisions}
                     className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                   >
                    <option value="">Select a GN division...</option>
                    {divisions.map(division => (
                      <option key={division.id} value={division.id}>
                        {division.name} ({division.gnNumber})
                      </option>
                    ))}
                </select>
                  {loading.divisions ? (
                    <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-orange-600" />
                  ) : (
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  )}
                </div>
              </div>
            </div>

            {/* Live Stats */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Live Statistics</span>
              </h4>
              
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Provinces</span>
                    <span className="font-bold text-blue-600">{provinces.length}</span>
                </div>
              </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Districts</span>
                    <span className="font-bold text-green-600">{districts.length}</span>
          </div>
        </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">DSDs</span>
                    <span className="font-bold text-purple-600">{dsds.length}</span>
                  </div>
        </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">GN Divisions</span>
                    <span className="font-bold text-orange-600">{divisions.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

           {/* Error Display */}
           {error && (
             <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
               <div className="flex items-start space-x-2">
                 <AlertTriangle className="w-5 h-5 mt-0.5" />
        <div>
                   <strong>Error:</strong> {error}
                   {!isApiKeySet && (
                     <div className="mt-2 text-sm">
                       Make sure to enter a valid API key above to access the live demo.
        </div>
            )}
          </div>
               </div>
             </div>
           )}

          {/* Results Display */}
          {selectedDivision && selectedDivisionData && (
            <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-xl flex items-center space-x-2">
                <Target className="w-6 h-6 text-blue-600" />
                <span>📋 Selected Location Details</span>
              </h4>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Province Card */}
                  {selectedProvinceData && (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <h5 className="font-semibold text-gray-900 dark:text-white">Province</h5>
                      </div>
                      <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{selectedProvinceData.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedProvinceData.nameSi}</p>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2">
                        <span>Capital: {selectedProvinceData.capital}</span>
                        <span>Pop: {selectedProvinceData.population.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* District Card */}
                  {selectedDistrictData && (
                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border-l-4 border-green-500">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <h5 className="font-semibold text-gray-900 dark:text-white">District</h5>
                      </div>
                      <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{selectedDistrictData.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDistrictData.nameSi}</p>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2">
                        <span>Capital: {selectedDistrictData.capital}</span>
                        <span>Pop: {selectedDistrictData.population.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {/* DSD Card */}
                  {selectedDSDData && (
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border-l-4 border-purple-500">
                      <div className="flex items-center space-x-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        <h5 className="font-semibold text-gray-900 dark:text-white">Divisional Secretariat</h5>
                      </div>
                      <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{selectedDSDData.name}</p>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        <span>{selectedDSDData.divisionCount} GN Divisions</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Division Card */}
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border-l-4 border-orange-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-orange-600" />
                      <h5 className="font-semibold text-gray-900 dark:text-white">GN Division</h5>
                    </div>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{selectedDivisionData.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDivisionData.nameSi}</p>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2">
                      <span>GN: {selectedDivisionData.gnNumber}</span>
                      <span>Pop: {selectedDivisionData.population.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

         {/* HTML Structure */}
         <CollapsibleCodeSection
           title="Enhanced HTML Structure"
           description="Modern HTML structure with enhanced styling, loading states, and accessibility features."
           code={htmlStructure}
           language="html"
           filename="index.html"
           isVisible={codeVisibility.html}
           onToggle={() => toggleCodeVisibility('html')}
           icon={<Search className="w-6 h-6 text-blue-600" />}
         />

         {/* JavaScript Implementation */}
         <CollapsibleCodeSection
           title="Advanced JavaScript Implementation"
           description="Enhanced LocationFinder class with caching, error handling, loading states, and smooth animations."
           code={jsImplementation}
           language="javascript"
           filename="location-finder.js"
           isVisible={codeVisibility.javascript}
           onToggle={() => toggleCodeVisibility('javascript')}
           icon={<Zap className="w-6 h-6 text-yellow-600" />}
         />

         {/* React Implementation */}
         <CollapsibleCodeSection
           title="Modern React Implementation"
           description="Complete React component with TypeScript, state management, and modern UI patterns."
           code={reactImplementation}
           language="typescript"
           filename="LocationFinder.tsx"
           isVisible={codeVisibility.react}
           onToggle={() => toggleCodeVisibility('react')}
           icon={<Globe className="w-6 h-6 text-blue-600" />}
         />

        {/* Key Features */}
        <div className="bg-surface border border-border rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-text-primary mb-6 flex items-center space-x-2">
            <Target className="w-6 h-6 text-purple-600" />
            <span>Advanced Features</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-text-primary">Real-time API Integration</h4>
                  <p className="text-sm text-text-secondary">Live data from LankaLocate API with proper authentication</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-text-primary">Smart Caching</h4>
                  <p className="text-sm text-text-secondary">Reduces API calls and improves performance</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-text-primary">Loading States</h4>
                  <p className="text-sm text-text-secondary">Smooth loading animations and visual feedback</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-orange-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-text-primary">Error Handling</h4>
                  <p className="text-sm text-text-secondary">Comprehensive error handling with user-friendly messages</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-red-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-text-primary">TypeScript Support</h4>
                  <p className="text-sm text-text-secondary">Full type safety and better developer experience</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-indigo-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-text-primary">Responsive Design</h4>
                  <p className="text-sm text-text-secondary">Works perfectly on all device sizes</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-pink-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-text-primary">Multilingual Display</h4>
                  <p className="text-sm text-text-secondary">Shows names in English, Sinhala, and Tamil</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-teal-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-text-primary">Rich Data Display</h4>
                  <p className="text-sm text-text-secondary">Population, area, and administrative details</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-yellow-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-text-primary">Modern UI/UX</h4>
                  <p className="text-sm text-text-secondary">Beautiful gradients, icons, and smooth transitions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-6 flex items-center space-x-2">
            <Zap className="w-6 h-6" />
            <span>🚀 Next Level Enhancements</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Advanced Features</h4>
              <ul className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
              <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">🔍</span>
                  <span>Add autocomplete search within dropdowns</span>
              </li>
              <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">🗺️</span>
                  <span>Integrate interactive maps with boundary visualization</span>
              </li>
              <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">📊</span>
                  <span>Add demographic charts and statistics</span>
              </li>
              <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">💾</span>
                  <span>Implement persistent state with localStorage</span>
              </li>
            </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Performance & UX</h4>
              <ul className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">⚡</span>
                  <span>Add service worker for offline functionality</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">🔄</span>
                  <span>Implement progressive loading and skeleton screens</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">📱</span>
                  <span>Add mobile-optimized gestures and interactions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">🎨</span>
                  <span>Implement theme switching and customization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DocsSection>
  );
};
