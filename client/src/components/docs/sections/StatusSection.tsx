import { useState, useEffect } from 'react';
import { DocsSection } from '../shared/DocsSection';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardContent } from '../../ui/Card';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  responseTime: number;
  uptime: number;
  lastChecked: string;
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  startTime: string;
  resolvedTime?: string;
  description: string;
  updates: Array<{
    time: string;
    message: string;
    status: string;
  }>;
}

export const StatusSection = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'API Gateway',
      status: 'operational',
      responseTime: 145,
      uptime: 99.98,
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Location Services',
      status: 'operational',
      responseTime: 180,
      uptime: 99.95,
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Search Engine',
      status: 'operational',
      responseTime: 220,
      uptime: 99.92,
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Authentication',
      status: 'operational',
      responseTime: 95,
      uptime: 99.99,
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Database',
      status: 'operational',
      responseTime: 50,
      uptime: 99.97,
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Demo Endpoints',
      status: 'operational',
      responseTime: 120,
      uptime: 99.85,
      lastChecked: new Date().toISOString()
    }
  ]);

  const [incidents] = useState<Incident[]>([
    {
      id: '1',
      title: 'Scheduled Maintenance - Database Optimization',
      status: 'resolved',
      severity: 'low',
      startTime: '2024-01-15T02:00:00Z',
      resolvedTime: '2024-01-15T04:30:00Z',
      description: 'Routine database maintenance and optimization to improve performance.',
      updates: [
        {
          time: '2024-01-15T04:30:00Z',
          message: 'Maintenance completed successfully. All services are fully operational.',
          status: 'resolved'
        },
        {
          time: '2024-01-15T03:15:00Z',
          message: 'Database optimization in progress. API response times may be slightly elevated.',
          status: 'monitoring'
        },
        {
          time: '2024-01-15T02:00:00Z',
          message: 'Scheduled maintenance has begun. Expected completion by 04:30 UTC.',
          status: 'identified'
        }
      ]
    }
  ]);

  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'outage'>('operational');

  useEffect(() => {
    // Calculate overall status based on individual services
    const hasOutage = services.some(s => s.status === 'outage');
    const hasDegraded = services.some(s => s.status === 'degraded');
    
    if (hasOutage) {
      setOverallStatus('outage');
    } else if (hasDegraded) {
      setOverallStatus('degraded');
    } else {
      setOverallStatus('operational');
    }

    // Simulate periodic status updates
    const interval = setInterval(() => {
      setServices(prev => prev.map(service => ({
        ...service,
        responseTime: service.responseTime + Math.floor(Math.random() * 20 - 10), // ±10ms variation
        lastChecked: new Date().toISOString()
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [services]);

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'gray' => {
    switch (status) {
      case 'operational': return 'success';
      case 'degraded': return 'warning';
      case 'outage': return 'error';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
      case 'degraded': return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
      case 'outage': return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
      default: return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  const getSeverityVariant = (severity: string): 'error' | 'warning' | 'primary' | 'gray' => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'warning';
      case 'low': return 'primary';
      default: return 'gray';
    }
  };

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(2)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getOverallStatusMessage = () => {
    switch (overallStatus) {
      case 'operational': return 'All systems operational';
      case 'degraded': return 'Some systems experiencing issues';
      case 'outage': return 'Service disruption detected';
      default: return 'Status unknown';
    }
  };

  return (
    <DocsSection 
      title="API Status"
      description="Real-time service status, uptime information, and incident reports for the LankaLocate API"
    >
      <div className="space-y-8">
        {/* Overall Status */}
        <Card>
          <CardHeader 
            title="Current Status"
            action={
              <div className="text-body-sm text-text-secondary">
                Last updated: {formatDate(new Date().toISOString())}
              </div>
            }
          />
          <CardContent>
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center space-x-2">
                {getStatusIcon(overallStatus)}
                <Badge variant={getStatusVariant(overallStatus)} size="md">
                  {getOverallStatusMessage()}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-body">
                <div className="text-body-sm text-text-secondary mb-1">Average Response Time</div>
                <div className="text-display-2 text-text-primary">
                  {Math.round(services.reduce((acc, s) => acc + s.responseTime, 0) / services.length)}ms
                </div>
              </div>
              <div className="card-body">
                <div className="text-body-sm text-text-secondary mb-1">Overall Uptime (30 days)</div>
                <div className="text-display-2 text-text-primary">
                  {formatUptime(services.reduce((acc, s) => acc + s.uptime, 0) / services.length)}
                </div>
              </div>
              <div className="card-body">
                <div className="text-body-sm text-text-secondary mb-1">Active Incidents</div>
                <div className="text-display-2 text-text-primary">
                  {incidents.filter(i => i.status !== 'resolved').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Status */}
        <Card>
          <CardHeader title="Service Status" />
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <Card key={service.name} className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getStatusIcon(service.status)}
                    </div>
                    <div>
                      <div className="text-body font-medium text-text-primary">{service.name}</div>
                      <div className="text-body-sm text-text-secondary">
                        Last checked: {formatDate(service.lastChecked)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-body-sm text-text-secondary">Response Time</div>
                      <div className="text-body font-medium text-text-primary">{service.responseTime}ms</div>
                    </div>
                    <div className="text-right">
                      <div className="text-body-sm text-text-secondary">Uptime (30d)</div>
                      <div className="text-body font-medium text-text-primary">{formatUptime(service.uptime)}</div>
                    </div>
                    <Badge variant={getStatusVariant(service.status)}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card>
          <CardHeader title="Recent Incidents" />
          <CardContent>
          
          {incidents.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-body font-medium text-text-primary">No recent incidents</div>
              <div className="text-body-sm text-text-secondary">All systems have been running smoothly</div>
            </div>
          ) : (
            <div className="space-y-6">
              {incidents.map((incident) => (
                <Card key={incident.id}>
                  <div className="flex items-start justify-between mb-4 px-4 py-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-body font-medium text-text-primary">{incident.title}</h4>
                        <Badge variant={getSeverityVariant(incident.severity)} size="sm">
                          {incident.severity.toUpperCase()}
                        </Badge>
                        <Badge variant={getStatusVariant(
                          incident.status === 'resolved' ? 'operational' : 
                          incident.status === 'monitoring' ? 'degraded' : 'outage'
                        )} size="sm">
                          {incident.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-text-secondary text-sm mb-3 px-4 py-1">{incident.description}</p>
                      <div className="text-xs text-text-secondary">
                        Started: {formatDate(incident.startTime)}
                        {incident.resolvedTime && (
                          <span> • Resolved: {formatDate(incident.resolvedTime)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium text-text-primary text-sm px-4 py-1">Updates</h5>
                    {incident.updates.map((update, index) => (
                      <div key={index} className="flex space-x-3 text-sm px-4 py-1 text-text-secondary">
                        <div className="text-text-secondary whitespace-nowrap">
                          {formatDate(update.time)}
                        </div>
                        <div className="text-text-primary">{update.message}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
          </CardContent>
        </Card>

        {/* Status Page Links */}
        <Card>
          <CardHeader title="Status Resources" />
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-text-primary">Subscribe to Updates</h4>
              <p className="text-sm text-text-secondary">Get notified about service status changes</p>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="flex-1"
                />
                <Button variant="primary" size="sm">Subscribe</Button>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-text-primary">Status Channels</h4>
              <div className="space-y-2">
                <a href="#" className="flex items-center space-x-2 text-body-sm text-primary-600 hover:text-primary-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>Email Notifications</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-body-sm text-primary-600 hover:text-primary-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>SMS Alerts</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-body-sm text-primary-600 hover:text-primary-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  <span>Webhook Notifications</span>
                </a>
              </div>
            </div>
          </div>
          </CardContent>
        </Card>

        {/* SLA Information */}
        <Card>
          <CardHeader title="Service Level Agreement" />
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
              <div className="text-sm text-text-secondary">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">&lt; 500ms</div>
              <div className="text-sm text-text-secondary">Response Time Target</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
              <div className="text-sm text-text-secondary">Monitoring Coverage</div>
            </div>
          </div>
          <p className="text-sm text-text-secondary mt-4 text-center">
            We monitor our services 24/7 and maintain detailed performance metrics. 
            View our full SLA terms and conditions in your dashboard.
          </p>
          </CardContent>
        </Card>
      </div>
    </DocsSection>
  );
};