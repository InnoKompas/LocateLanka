import { useState } from 'react';
import { DocsSection } from '../shared/DocsSection';
import { CodeBlock } from '../shared/CodeBlock';

interface PerformanceMetric {
  name: string;
  good: string;
  warning: string;
  poor: string;
  current: number;
  unit: string;
}

export const BestPracticesSection = () => {
  const [performanceMetrics] = useState<PerformanceMetric[]>([
    {
      name: 'API Response Time',
      good: '< 200ms',
      warning: '200-500ms',
      poor: '> 500ms',
      current: 180,
      unit: 'ms'
    },
    {
      name: 'Cache Hit Rate',
      good: '> 80%',
      warning: '60-80%',
      poor: '< 60%',
      current: 85,
      unit: '%'
    },
    {
      name: 'Daily API Calls',
      good: 'Within limits',
      warning: '80-95% of limit',
      poor: '> 95% of limit',
      current: 65,
      unit: '%'
    }
  ]);

  const getMetricStatus = (metric: PerformanceMetric) => {
    if (metric.name === 'API Response Time') {
      if (metric.current < 200) return 'good';
      if (metric.current <= 500) return 'warning';
      return 'poor';
    }
    if (metric.name === 'Cache Hit Rate' || metric.name === 'Daily API Calls') {
      if (metric.current >= 80) return 'good';
      if (metric.current >= 60) return 'warning';
      return 'poor';
    }
    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-800 bg-green-100 border-green-200';
      case 'warning': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      case 'poor': return 'text-red-800 bg-red-100 border-red-200';
      default: return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  return (
    <DocsSection 
      title="Best Practices"
      description="Optimization tips, security guidelines, and best practices for building production-ready applications with the LankaLocate API"
    >
      <div className="space-y-8">
        {/* Performance Monitoring Dashboard */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-heading-3 mb-4">⚡ Performance Monitoring</h3>
          <p className="text-text-secondary mb-6">
            Monitor your API usage and performance metrics to ensure optimal application performance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {performanceMetrics.map((metric) => {
              const status = getMetricStatus(metric);
              return (
                <div key={metric.name} className={`border rounded-lg p-4 ${getStatusColor(status)}`}>
                  <div className="text-sm font-medium mb-1">{metric.name}</div>
                  <div className="text-2xl font-bold mb-2">
                    {metric.current}{metric.unit}
                  </div>
                  <div className="text-xs">
                    Good: {metric.good} | Warning: {metric.warning} | Poor: {metric.poor}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <h4 className="font-medium text-primary-800 mb-2">💡 Performance Tips</h4>
            <ul className="text-sm text-primary-700 space-y-1">
              <li>• Implement request caching to reduce API calls</li>
              <li>• Use pagination for large datasets</li>
              <li>• Monitor your rate limits and implement backoff strategies</li>
              <li>• Cache static data like provinces and districts locally</li>
            </ul>
          </div>
        </div>

        {/* API Optimization */}
        <div className="space-y-6">
          <h3 className="text-heading-2">API Optimization</h3>

          {/* Caching Strategy */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="text-heading-3 mb-4">1. Implement Smart Caching</h4>
            <p className="text-text-secondary mb-4">
              Reduce API calls and improve performance with intelligent caching strategies:
            </p>
            <CodeBlock
              language="tsx"
              code={`// Advanced caching service with TTL and invalidation
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  // Different TTL for different data types
  private defaultTTLs = {
    provinces: 24 * 60 * 60 * 1000,    // 24 hours (rarely changes)
    districts: 12 * 60 * 60 * 1000,    // 12 hours (stable data)
    dsds: 6 * 60 * 60 * 1000,          // 6 hours (semi-static)
    divisions: 1 * 60 * 60 * 1000,     // 1 hour (more dynamic)
    search: 5 * 60 * 1000              // 5 minutes (user-specific)
  };

  set(key: string, data: any, customTTL?: number): void {
    const dataType = this.getDataType(key);
    const ttl = customTTL || this.defaultTTLs[dataType] || this.defaultTTLs.divisions;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  private getDataType(key: string): keyof typeof this.defaultTTLs {
    if (key.includes('provinces')) return 'provinces';
    if (key.includes('districts')) return 'districts';
    if (key.includes('dsds')) return 'dsds';
    if (key.includes('search')) return 'search';
    return 'divisions';
  }
}

// Usage in your service
const apiCache = new ApiCache();

class OptimizedLocationService {
  async getProvinces(): Promise<Province[]> {
    const cacheKey = 'provinces_all';
    
    // Try cache first
    const cached = apiCache.get(cacheKey);
    if (cached) {
      console.log('Cache hit: provinces');
      return cached;
    }

    // Fetch from API
    const data = await this.fetchFromAPI('/provinces');
    
    // Cache the result
    apiCache.set(cacheKey, data);
    
    return data;
  }
}`}
            />
          </div>

          {/* Error Handling */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="text-heading-3 mb-4">2. Robust Error Handling</h4>
            <p className="text-text-secondary mb-4">
              Implement comprehensive error handling with retry logic and user-friendly messages:
            </p>
            <CodeBlock
              language="tsx"
              code={`// Custom error types for different scenarios
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Retry utility with exponential backoff
class RetryHandler {
  async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof ApiError && !error.retryable) {
          throw error;
        }

        if (attempt === maxRetries) {
          throw lastError;
        }

        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }
}

// Enhanced service with error handling
class RobustLocationService {
  private retryHandler = new RetryHandler();

  private async makeRequest<T>(endpoint: string): Promise<T> {
    return this.retryHandler.withRetry(async () => {
      const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new ApiError('Invalid API key', 401, 'INVALID_API_KEY');
          case 429:
            throw new ApiError('Rate limit exceeded', 429, 'RATE_LIMITED', true);
          case 500:
            throw new ApiError('Server error', 500, 'SERVER_ERROR', true);
          default:
            throw new ApiError('Request failed', response.status, 'REQUEST_FAILED');
        }
      }

      return response.json();
    });
  }
}`}
            />
          </div>

          {/* Rate Limiting */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="text-heading-3 mb-4">3. Rate Limiting & Throttling</h4>
            <p className="text-text-secondary mb-4">
              Respect API rate limits and implement client-side throttling:
            </p>
            <CodeBlock
              language="tsx"
              code={`// Request queue with rate limiting
class RateLimitedQueue {
  private queue: Array<{ request: () => Promise<any>; resolve: Function; reject: Function }> = [];
  private processing = false;
  private requestCount = 0;
  private windowStart = Date.now();
  
  // Rate limit: 100 requests per minute
  private readonly maxRequests = 100;
  private readonly windowMs = 60 * 1000;

  async enqueue<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;

    while (this.queue.length > 0) {
      // Check rate limit window
      const now = Date.now();
      if (now - this.windowStart >= this.windowMs) {
        this.requestCount = 0;
        this.windowStart = now;
      }

      // Check if we're at rate limit
      if (this.requestCount >= this.maxRequests) {
        const waitTime = this.windowMs - (now - this.windowStart);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      const { request, resolve, reject } = this.queue.shift()!;
      
      try {
        this.requestCount++;
        const result = await request();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }
}`}
            />
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="space-y-6">
          <h3 className="text-heading-2">Security Best Practices</h3>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="text-heading-3 mb-4">🔐 API Key Management</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Never expose API keys in client-side code:</strong> Store keys securely on your server
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Use environment variables:</strong> Store API keys in <code>.env</code> files, never in source code
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Implement key rotation:</strong> Regularly rotate API keys and update applications
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Monitor usage:</strong> Set up alerts for unusual API key usage patterns
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="text-heading-3 mb-4">🛡️ Data Protection</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Sanitize user inputs:</strong> Always validate and sanitize user-provided data
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Use HTTPS only:</strong> Ensure all API communications use SSL/TLS encryption
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Implement CORS properly:</strong> Configure Cross-Origin Resource Sharing correctly
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Log security events:</strong> Monitor and log authentication failures and suspicious activity
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Optimization */}
        <div className="space-y-6">
          <h3 className="text-heading-2">Performance Optimization</h3>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="text-heading-3 mb-4">⚡ Frontend Optimization</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-text-primary mb-3">React Optimization</h5>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Use <code>React.memo()</code> for expensive components</li>
                  <li>• Implement <code>useMemo()</code> for heavy calculations</li>
                  <li>• Use <code>useCallback()</code> for event handlers</li>
                  <li>• Implement virtual scrolling for large lists</li>
                  <li>• Lazy load components with <code>React.Suspense</code></li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-text-primary mb-3">Data Management</h5>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Implement client-side caching (React Query, SWR)</li>
                  <li>• Use pagination for large datasets</li>
                  <li>• Debounce search inputs (300-500ms)</li>
                  <li>• Preload frequently accessed data</li>
                  <li>• Implement optimistic updates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Testing & Monitoring */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-heading-3 mb-4">🧪 Testing & Monitoring</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-text-primary mb-3">Testing Strategy</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface-variant rounded-lg p-4">
                  <h5 className="font-medium mb-2">Unit Tests</h5>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• API service functions</li>
                    <li>• Data transformation logic</li>
                    <li>• Validation functions</li>
                    <li>• Cache implementations</li>
                  </ul>
                </div>
                <div className="bg-surface-variant rounded-lg p-4">
                  <h5 className="font-medium mb-2">Integration Tests</h5>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• API endpoint responses</li>
                    <li>• Error handling flows</li>
                    <li>• Authentication workflows</li>
                    <li>• Rate limiting behavior</li>
                  </ul>
                </div>
                <div className="bg-surface-variant rounded-lg p-4">
                  <h5 className="font-medium mb-2">E2E Tests</h5>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• User workflows</li>
                    <li>• Search functionality</li>
                    <li>• Form submissions</li>
                    <li>• Error scenarios</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-text-primary mb-3">Key Metrics to Monitor</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• API response times</li>
                    <li>• Error rates</li>
                    <li>• Cache hit ratios</li>
                    <li>• Rate limit usage</li>
                  </ul>
                </div>
                <div>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• User engagement metrics</li>
                    <li>• Search success rates</li>
                    <li>• Application performance</li>
                    <li>• Security events</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deployment Checklist */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-heading-3 mb-4">✅ Production Deployment Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-text-primary mb-3">Security & Configuration</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" readOnly />
                  <span className="text-sm">API keys stored securely in environment variables</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" readOnly />
                  <span className="text-sm">HTTPS configured for all environments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" readOnly />
                  <span className="text-sm">Rate limiting implemented and tested</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" readOnly />
                  <span className="text-sm">Error handling covers all edge cases</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-3">Performance & Monitoring</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" readOnly />
                  <span className="text-sm">Caching strategy implemented</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" readOnly />
                  <span className="text-sm">Performance testing completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" readOnly />
                  <span className="text-sm">Monitoring and alerting configured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" readOnly />
                  <span className="text-sm">Documentation updated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocsSection>
  );
};
