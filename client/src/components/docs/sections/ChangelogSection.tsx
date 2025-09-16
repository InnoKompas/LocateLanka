import { useState } from 'react';
import { DocsSection } from '../shared/DocsSection';
import { CodeBlock } from '../shared/CodeBlock';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Card, CardHeader, CardContent } from '../../ui/Card';

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  changes: {
    type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
    items: string[];
  }[];
  breaking?: boolean;
  migration?: {
    title: string;
    description: string;
    code?: string;
  };
}

export const ChangelogSection = () => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const changelog: ChangelogEntry[] = [
    {
      version: '1.3.0',
      date: '2024-01-15',
      type: 'minor',
      changes: [
        {
          type: 'added',
          items: [
            'New search endpoint for GN divisions with fuzzy matching',
            'Support for Tamil and Sinhala text in search queries',
            'Pagination support for all list endpoints',
            'New field `coordinates` in division responses',
            'Rate limiting headers in API responses'
          ]
        },
        {
          type: 'changed',
          items: [
            'Improved search algorithm for better relevance',
            'Updated response times - now 30% faster on average',
            'Enhanced error messages with more context'
          ]
        },
        {
          type: 'fixed',
          items: [
            'Fixed inconsistent district codes in some responses',
            'Resolved timeout issues with large dataset queries',
            'Fixed special character handling in search queries'
          ]
        }
      ]
    },
    {
      version: '1.2.1',
      date: '2024-01-08',
      type: 'patch',
      changes: [
        {
          type: 'fixed',
          items: [
            'Fixed authentication error with certain API key formats',
            'Resolved CORS issues for subdomain requests',
            'Fixed missing data in some DSD responses'
          ]
        },
        {
          type: 'security',
          items: [
            'Enhanced API key validation',
            'Improved rate limiting accuracy',
            'Updated security headers'
          ]
        }
      ]
    },
    {
      version: '1.2.0',
      date: '2023-12-20',
      type: 'minor',
      changes: [
        {
          type: 'added',
          items: [
            'New endpoint for retrieving divisions by DSD',
            'Support for filtering districts by province',
            'Added population and area data to responses',
            'New health check endpoint for monitoring'
          ]
        },
        {
          type: 'changed',
          items: [
            'Improved API documentation with more examples',
            'Updated data accuracy with latest government sources',
            'Enhanced response caching for better performance'
          ]
        }
      ]
    },
    {
      version: '1.1.0',
      date: '2023-11-15',
      type: 'minor',
      breaking: true,
      changes: [
        {
          type: 'added',
          items: [
            'Authentication system with API keys',
            'Rate limiting per API key',
            'Usage analytics and monitoring'
          ]
        },
        {
          type: 'changed',
          items: [
            'All endpoints now require authentication',
            'Response format standardized across all endpoints',
            'Error codes updated to follow HTTP standards'
          ]
        },
        {
          type: 'removed',
          items: [
            'Deprecated public endpoints (now require API keys)'
          ]
        }
      ],
      migration: {
        title: 'Migration to v1.1.0',
        description: 'This version introduces breaking changes. All requests now require API key authentication.',
        code: `// Before v1.1.0
fetch('https://api.lankalocate.com/v1/provinces')

// After v1.1.0
fetch('https://api.lankalocate.com/v1/provinces', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})`
      }
    },
    {
      version: '1.0.0',
      date: '2023-10-01',
      type: 'major',
      changes: [
        {
          type: 'added',
          items: [
            'Initial stable release',
            'Provinces endpoint with full data',
            'Districts endpoint with province relationships',
            'DSDs (Divisional Secretariat Divisions) endpoint',
            'GN Divisions endpoint with hierarchical data',
            'Comprehensive API documentation',
            'JSON response format with consistent structure'
          ]
        }
      ]
    }
  ];

  const upcomingFeatures = [
    {
      feature: 'GraphQL API',
      description: 'Flexible data fetching with GraphQL support',
      eta: 'Q2 2024',
      status: 'In Development'
    },
    {
      feature: 'Webhook Support',
      description: 'Real-time notifications for data updates',
      eta: 'Q1 2024',
      status: 'Planning'
    },
    {
      feature: 'Bulk Operations',
      description: 'Batch requests for improved performance',
      eta: 'Q2 2024',
      status: 'Research'
    },
    {
      feature: 'Advanced Analytics',
      description: 'Detailed usage analytics and insights',
      eta: 'Q3 2024',
      status: 'Planning'
    }
  ];

  const getVersionTypeVariant = (type: string, breaking?: boolean): 'error' | 'primary' | 'success' | 'warning' | 'gray' => {
    if (breaking) return 'error';
    switch (type) {
      case 'major': return 'primary';
      case 'minor': return 'primary';
      case 'patch': return 'success';
      default: return 'gray';
    }
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'added': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      );
      case 'changed': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
      case 'deprecated': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
      case 'removed': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      );
      case 'fixed': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      case 'security': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
      default: return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'added': return 'text-green-700';
      case 'changed': return 'text-blue-700';
      case 'deprecated': return 'text-yellow-700';
      case 'removed': return 'text-red-700';
      case 'fixed': return 'text-purple-700';
      case 'security': return 'text-orange-700';
      default: return 'text-gray-700';
    }
  };

  const getStatusVariant = (status: string): 'primary' | 'warning' | 'gray' => {
    switch (status) {
      case 'In Development': return 'primary';
      case 'Planning': return 'warning';
      case 'Research': return 'primary';
      default: return 'gray';
    }
  };

  return (
    <DocsSection 
      title="Changelog"
      description="Track API updates, new features, bug fixes, and breaking changes across all versions"
    >
      <div className="space-y-8">
        {/* Version Summary */}
        <Card>
          <CardHeader title="Version Overview" />
          <CardContent>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {changelog[0]?.version}
              </div>
              <div className="text-sm text-text-secondary">Latest Version</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {changelog.filter(v => v.type === 'major').length}
              </div>
              <div className="text-sm text-text-secondary">Major Releases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {changelog.filter(v => v.type === 'minor').length}
              </div>
              <div className="text-sm text-text-secondary">Minor Updates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {changelog.filter(v => v.type === 'patch').length}
              </div>
              <div className="text-sm text-text-secondary">Patches</div>
            </div>
          </div>

          <div className="alert alert-info">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span className="font-medium text-primary-800">Stay Updated</span>
            </div>
            <p className="text-sm text-primary-700">
              Subscribe to our changelog RSS feed or follow us on social media to get notified about new releases and important updates.
            </p>
          </div>
          </CardContent>
        </Card>

        {/* Changelog Entries */}
        <Card>
          <CardHeader title="Release History" />
          <CardContent>
          
          <div className="space-y-8">
            {changelog.map((entry) => (
              <div key={entry.version} className="border-l-4 border-primary-200 pl-6">
                <div className="flex items-center space-x-4 mb-4">
                  <h4 className="text-xl font-bold text-text-primary">
                    v{entry.version}
                  </h4>
                  <Badge variant={getVersionTypeVariant(entry.type, entry.breaking)} size="sm">
                    {entry.breaking ? 'BREAKING' : entry.type.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-text-secondary">
                    {new Date(entry.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>

                {entry.breaking && (
                  <div className="alert alert-error mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-5 h-5 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="font-medium text-error-800">Breaking Changes</span>
                    </div>
                    <p className="text-sm text-error-700">
                      This version contains breaking changes. Please review the migration guide below.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {entry.changes.map((changeGroup, index) => (
                    <div key={index}>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={getChangeTypeColor(changeGroup.type)}>{getChangeTypeIcon(changeGroup.type)}</div>
                        <span className={`font-medium text-sm uppercase tracking-wide ${getChangeTypeColor(changeGroup.type)}`}>
                          {changeGroup.type}
                        </span>
                      </div>
                      <ul className="ml-6 space-y-1">
                        {changeGroup.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-text-secondary">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {entry.migration && (
                  <div className="mt-6">
                    <Button
                      onClick={() => setSelectedVersion(selectedVersion === entry.version ? null : entry.version)}
                      variant="ghost"
                      className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium p-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <span>{entry.migration.title}</span>
                      {selectedVersion === entry.version ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </Button>
                    
                    {selectedVersion === entry.version && (
                      <Card className="mt-4">
                        <p className="text-sm text-text-secondary mb-4">
                          {entry.migration.description}
                        </p>
                        {entry.migration.code && (
                          <CodeBlock
                            language="javascript"
                            code={entry.migration.code}
                          />
                        )}
                      </Card>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          </CardContent>
        </Card>

        {/* Upcoming Features */}
        <Card>
          <CardHeader title="Roadmap & Upcoming Features" />
          <CardContent>
          
          <div className="space-y-4">
            {upcomingFeatures.map((feature, index) => (
              <Card key={index}>
                <div className="flex items-center justify-between mb-2 px-4 py-2">
                  <h4 className="font-medium text-text-primary">{feature.feature}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusVariant(feature.status)} size="sm">
                      {feature.status}
                    </Badge>
                    <span className="text-sm text-text-secondary">{feature.eta}</span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary px-4 py-1">{feature.description}</p>
              </Card>
            ))}
          </div>

          <div className="mt-6 alert alert-info">
            <div className="flex items-center space-x-2 mb-2 px-4">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="font-medium text-primary-800">Have a Feature Request?</span>
            </div>
            <p className="text-sm text-primary-700 mb-3">
              We'd love to hear your ideas! Submit feature requests through our community forum or contact our team directly.
            </p>
            <Button className="btn btn-primary btn-sm">Submit Feature Request</Button>
          </div>
          </CardContent>
        </Card>

        {/* Versioning Policy */}
        <Card>
          <CardHeader title="Versioning Policy" />
          <CardContent>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-medium text-text-primary mb-2">Major (X.0.0)</h4>
              <p className="text-sm text-text-secondary">
                Breaking changes, new major features, significant API redesigns
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h4 className="font-medium text-text-primary mb-2">Minor (1.X.0)</h4>
              <p className="text-sm text-text-secondary">
                New features, enhancements, backward-compatible changes
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-text-primary mb-2">Patch (1.0.X)</h4>
              <p className="text-sm text-text-secondary">
                Bug fixes, security updates, minor improvements
              </p>
            </div>
          </div>

          <Card className="mt-6">
            <h4 className="font-medium text-text-primary mb-2 p-4">Deprecation Policy</h4>
            <ul className="text-sm text-text-secondary space-y-1 p-4">
              <li>• Features are marked as deprecated at least 6 months before removal</li>
              <li>• Breaking changes are introduced only in major versions</li>
              <li>• We maintain backward compatibility within major versions</li>
              <li>• Migration guides are provided for all breaking changes</li>
            </ul>
          </Card>
          </CardContent>
        </Card>

        {/* Subscribe to Updates */}
        <Card variant="elevated" className="text-center text-white" style={{background: 'linear-gradient(to right, var(--color-primary-500), var(--color-primary-600))'}}>
          <CardContent>
            <h3 className="text-display-2 mb-2 p-4">Stay Updated</h3>
            <p className="text-primary-100 mb-6 p-4">
              Get notified about new releases, security updates, and important changes
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="btn bg-white text-primary-600 hover:bg-primary-50 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email Notifications</span>
              </Button>
              <Button className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                <span>RSS Feed</span>
              </Button>
              <Button className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.07 7.07 0 01-1-3.73A5.002 5.002 0 0112 2c1.654 0 3.154.8 4.07 2.13A7.09 7.09 0 0115 8v9z" />
                </svg>
                <span>Webhook</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DocsSection>
  );
};