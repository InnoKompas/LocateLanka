import { useState, useCallback, useEffect } from 'react';
import { DocsSection } from '../shared/DocsSection';
import { CodeBlock } from '../shared/CodeBlock';
import { demoService } from '../../../services/demo.service';
import type { Province, District } from '../../../services/location.service';

interface LocationStats {
  totalProvinces: number;
  totalDistricts: number;
  largestProvince: string;
  smallestProvince: string;
}

export const DataVisualizationGuide = () => {
  const [locationStats, setLocationStats] = useState<LocationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Load demo data for visualization
  const loadVisualizationData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get provinces for the demo
      const provincesData = await demoService.getProvinces();
      setProvinces(provincesData);

      // Calculate basic stats
      const stats: LocationStats = {
        totalProvinces: provincesData.length,
        totalDistricts: 0,
        largestProvince: '',
        smallestProvince: ''
      };

      // Find largest and smallest provinces by area
      if (provincesData.length > 0) {
        const sortedByArea = [...provincesData].sort((a, b) => b.area - a.area);
        stats.largestProvince = sortedByArea[0].name;
        stats.smallestProvince = sortedByArea[sortedByArea.length - 1].name;
      }

      // Get districts for first province as example
      if (provincesData.length > 0) {
        const firstProvince = provincesData[0];
        const districtsData = await demoService.getDistrictsByProvince(firstProvince.code);
        setDistricts(districtsData);
        stats.totalDistricts = districtsData.length;
      }

      setLocationStats(stats);

      // Prepare chart data
      const chartData = provincesData.map(province => ({
        name: province.name,
        area: province.area,
        population: province.population,
        density: Math.round(province.population / province.area)
      }));
      setChartData(chartData);

    } catch (error) {
      console.error('Failed to load visualization data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle province selection for detailed view
  const handleProvinceChange = async (provinceCode: string) => {
    setSelectedProvince(provinceCode);
    if (provinceCode) {
      try {
        const districtsData = await demoService.getDistrictsByProvince(provinceCode);
        setDistricts(districtsData);
      } catch (error) {
        console.error('Failed to load districts:', error);
      }
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadVisualizationData();
  }, [loadVisualizationData]);

  return (
    <DocsSection 
      title="Data Visualization"
      description="Integrate the LankaLocate API with maps, charts, and visualization libraries to create compelling data experiences"
    >
      <div className="space-y-8">
        {/* Interactive Demo */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-heading-3 mb-4">📊 Interactive Visualization Demo</h3>
          <p className="text-text-secondary mb-6">
            Explore Sri Lankan location data with interactive visualizations powered by the LankaLocate API.
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner w-8 h-8"></div>
              <span className="ml-3 text-text-secondary">Loading visualization data...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Overview */}
              {locationStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-primary-10 border border-primary-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary-800">{locationStats.totalProvinces}</div>
                    <div className="text-sm text-primary-600">Provinces</div>
                  </div>
                  <div className="bg-green-10 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-800">{districts.length}</div>
                    <div className="text-sm text-green-600">Districts</div>
                  </div>
                  <div className="bg-purple-10 border border-purple-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-800">25</div>
                    <div className="text-sm text-purple-600">Districts Total</div>
                  </div>
                  <div className="bg-orange-10 border border-orange-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-800">14K+</div>
                    <div className="text-sm text-orange-600">GN Divisions</div>
                  </div>
                </div>
              )}

              {/* Province Selector */}
              <div className="max-w-md">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Select Province for Detailed View
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="form-input w-full"
                >
                  <option value="">Choose a province...</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name} ({province.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Simple Bar Chart Visualization */}
              {chartData.length > 0 && (
                <div className="bg-surface-variant rounded-lg p-4">
                  <h4 className="font-medium text-text-primary mb-4">Population by Province</h4>
                  <div className="space-y-2">
                    {chartData.slice(0, 5).map((item, index) => {
                      const maxPopulation = Math.max(...chartData.map(d => d.population));
                      const widthPercentage = (item.population / maxPopulation) * 100;
                      
                      return (
                        <div key={item.name} className="flex items-center space-x-3">
                          <div className="w-24 text-sm text-text-secondary truncate">
                            {item.name}
                          </div>
                          <div className="flex-1 bg-border rounded-full h-6 relative">
                            <div 
                              className="bg-primary-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${widthPercentage}%` }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs text-white font-medium">
                                {(item.population / 1000000).toFixed(1)}M
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Districts Table */}
              {selectedProvince && districts.length > 0 && (
                <div className="bg-surface-variant rounded-lg p-4">
                  <h4 className="font-medium text-text-primary mb-4">
                    Districts in {provinces.find(p => p.code === selectedProvince)?.name}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 font-medium text-text-primary">District</th>
                          <th className="text-left py-2 font-medium text-text-primary">Capital</th>
                          <th className="text-right py-2 font-medium text-text-primary">Area (km²)</th>
                          <th className="text-right py-2 font-medium text-text-primary">Population</th>
                        </tr>
                      </thead>
                      <tbody>
                        {districts.map((district) => (
                          <tr key={district.id} className="border-b border-border">
                            <td className="py-2 text-text-primary">{district.name}</td>
                            <td className="py-2 text-text-secondary">{district.capital}</td>
                            <td className="py-2 text-right text-text-secondary">
                              {district.area.toLocaleString()}
                            </td>
                            <td className="py-2 text-right text-text-secondary">
                              {district.population.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Implementation Guide */}
        <div className="space-y-6">
          <h3 className="text-heading-2">Implementation Guide</h3>

          {/* Leaflet Map Integration */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="text-heading-3 mb-4">1. Leaflet Map Integration</h4>
            <p className="text-text-secondary mb-4">
              Create interactive maps with location markers and boundaries using Leaflet and the LankaLocate API:
            </p>
            <CodeBlock
              language="tsx"
              code={`import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { locationService } from './services/location.service';
import L from 'leaflet';

export const LocationMap: React.FC = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);

  useEffect(() => {
    const loadDivisions = async () => {
      try {
        const data = await locationService.getDivisions({ limit: 100 });
        setDivisions(data);
      } catch (error) {
        console.error('Failed to load divisions:', error);
      }
    };
    loadDivisions();
  }, []);

  const customIcon = new L.Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer 
      center={[7.8731, 80.7718]} 
      zoom={8} 
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      {divisions.map((division) => (
        <Marker 
          key={division.id}
          position={[7.8731, 80.7718]} // Use actual coordinates
          icon={customIcon}
        >
          <Popup>
            <div>
              <h3>{division.nameEn}</h3>
              <p>{division.districtName}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

// npm install react-leaflet leaflet`}
            />
          </div>

          {/* Chart.js Integration */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="text-heading-3 mb-4">2. Chart.js Data Visualization</h4>
            <p className="text-text-secondary mb-4">
              Create interactive charts and graphs with Chart.js and location data:
            </p>
            <CodeBlock
              language="tsx"
              code={`import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { locationService } from './services/location.service';

ChartJS.register(CategoryScale, LinearScale, BarElement);

export const LocationCharts: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const loadChartData = async () => {
      const provinces = await locationService.getProvinces();
      
      const data = {
        labels: provinces.map(p => p.name),
        datasets: [{
          label: 'Population',
          data: provinces.map(p => p.population),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
        }]
      };
      setChartData(data);
    };
    loadChartData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Population by Province',
      },
    },
  };

  return chartData ? (
    <Bar data={chartData} options={options} />
  ) : (
    <div>Loading...</div>
  );
};

// npm install react-chartjs-2 chart.js`}
            />
          </div>

          {/* Best Practices */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="text-heading-3 mb-4">💡 Visualization Best Practices</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Performance:</strong> Implement data pagination and lazy loading for large datasets.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Responsive Design:</strong> Ensure charts and maps adapt to different screen sizes.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Accessibility:</strong> Include alt text, ARIA labels, and keyboard navigation.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Data Caching:</strong> Cache frequently accessed location data to reduce API calls.
                </div>
              </div>
            </div>
          </div>

          {/* Popular Libraries */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="text-heading-3 mb-4">📚 Recommended Libraries</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-text-primary mb-3">Mapping Libraries</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="badge badge-primary">React</span>
                    <span className="text-sm">react-leaflet - Lightweight, open-source</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="badge badge-primary">React</span>
                    <span className="text-sm">@react-google-maps/api - Google Maps</span>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-text-primary mb-3">Chart Libraries</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="badge badge-success">Chart</span>
                    <span className="text-sm">react-chartjs-2 - Feature-rich charts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="badge badge-success">Chart</span>
                    <span className="text-sm">recharts - Composable charts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="badge badge-success">Chart</span>
                    <span className="text-sm">d3 - Custom visualizations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocsSection>
  );
};
