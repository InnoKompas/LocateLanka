import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Shield, 
  Bell, 
  Database, 
  Globe, 
  AlertTriangle,
  Save,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { getSystemSettings, updateSystemSettings, type SystemSettings } from '../../services/admin.service';
import toast from 'react-hot-toast';

export const AdminSettingsPage = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: systemSettings, isLoading } = useQuery(
    'systemSettings',
    getSystemSettings,
    {
      onSuccess: (data) => {
        setSettings(data);
      }
    }
  );

  const updateSettingsMutation = useMutation(
    (updates: Partial<SystemSettings>) => updateSystemSettings(updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('systemSettings');
        setHasChanges(false);
        toast.success('Settings updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update settings');
      }
    }
  );

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleRateLimitChange = (plan: 'free' | 'pro' | 'enterprise', limit: string, value: number) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      rateLimits: {
        ...prev!.rateLimits,
        [plan]: {
          ...prev!.rateLimits[plan],
          [limit]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    if (settings) {
      updateSettingsMutation.mutate(settings);
    }
  };

  const handleResetSettings = () => {
    if (systemSettings) {
      setSettings(systemSettings);
      setHasChanges(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-variant rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-surface-variant rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">System Settings</h1>
            <p className="text-text-secondary mt-2">
              Configure system-wide settings and policies
            </p>
          </div>
          
          {hasChanges && (
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleResetSettings}
                disabled={updateSettingsMutation.isLoading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleSaveSettings}
                disabled={updateSettingsMutation.isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {updateSettingsMutation.isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        {/* Rate Limits Configuration */}
        <Card>
          <CardHeader 
            title="API Rate Limits"
            description="Configure rate limits for different subscription plans"
          />
          <CardContent>
            <div className="space-y-6">
              {Object.entries(settings.rateLimits).map(([plan, limits]) => (
                <div key={plan} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-text-primary capitalize">
                      {plan} Plan
                    </h4>
                    <Badge variant={plan === 'free' ? 'gray' : plan === 'pro' ? 'primary' : 'success'}>
                      {plan.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Requests per Hour
                      </label>
                      <input
                        type="number"
                        value={limits.requestsPerHour}
                        onChange={(e) => handleRateLimitChange(
                          plan as 'free' | 'pro' | 'enterprise',
                          'requestsPerHour',
                          parseInt(e.target.value) || 0
                        )}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Requests per Day
                      </label>
                      <input
                        type="number"
                        value={limits.requestsPerDay}
                        onChange={(e) => handleRateLimitChange(
                          plan as 'free' | 'pro' | 'enterprise',
                          'requestsPerDay',
                          parseInt(e.target.value) || 0
                        )}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Requests per Month
                      </label>
                      <input
                        type="number"
                        value={limits.requestsPerMonth}
                        onChange={(e) => handleRateLimitChange(
                          plan as 'free' | 'pro' | 'enterprise',
                          'requestsPerMonth',
                          parseInt(e.target.value) || 0
                        )}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader 
            title="System Status"
            description="Monitor and control system-wide settings"
          />
          <CardContent>
            <div className="space-y-6">
              {/* Maintenance Mode */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    settings.maintenanceMode 
                      ? 'bg-orange-100 dark:bg-orange-900/20' 
                      : 'bg-green-100 dark:bg-green-900/20'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      settings.maintenanceMode ? 'text-orange-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">Maintenance Mode</h4>
                    <p className="text-sm text-text-secondary">
                      {settings.maintenanceMode 
                        ? 'System is currently in maintenance mode'
                        : 'System is operational'
                      }
                    </p>
                  </div>
                </div>
                <Button
                  variant={settings.maintenanceMode ? "primary" : "outline"}
                  onClick={() => handleSettingChange('maintenanceMode', !settings.maintenanceMode)}
                  className={settings.maintenanceMode ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  {settings.maintenanceMode ? 'Disable' : 'Enable'}
                </Button>
              </div>

              {/* Global Announcement */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-text-secondary">
                  Global Announcement
                </label>
                <textarea
                  value={settings.globalAnnouncement || ''}
                  onChange={(e) => handleSettingChange('globalAnnouncement', e.target.value || null)}
                  placeholder="Enter a global announcement message (optional)"
                  rows={3}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-100 resize-none"
                />
                <p className="text-xs text-text-secondary">
                  This message will be displayed to all users across the platform
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader 
            title="System Information"
            description="Current system status and information"
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <Database className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">Database</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Connected and healthy</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <Globe className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">API Status</p>
                    <p className="text-sm text-green-700 dark:text-green-300">All endpoints operational</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">Security</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">All security checks passed</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <Bell className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900 dark:text-purple-100">Monitoring</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">All systems monitored</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader 
            title="Data Management"
            description="Backup and restore system data"
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="flex items-center justify-center space-x-2 h-20">
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Export Data</p>
                  <p className="text-sm text-text-secondary">Download system backup</p>
                </div>
              </Button>
              
              <Button variant="outline" className="flex items-center justify-center space-x-2 h-20">
                <Upload className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Import Data</p>
                  <p className="text-sm text-text-secondary">Restore from backup</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};
