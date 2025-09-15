import { DocsSection } from '../shared/DocsSection';
import { ApiEndpoint } from '../shared/ApiEndpoint';

export const RateLimitsSection = () => {
  const rateLimitHeadersExample = `HTTP/1.1 200 OK
Content-Type: application/json
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 49
X-RateLimit-Reset: 1694678400
X-RateLimit-Window: 3600

{
  "success": true,
  "data": { ... }
}`;

  const rateLimitExceededExample = `HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1694678400
X-RateLimit-Window: 3600
Retry-After: 3600

{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 3600 seconds.",
    "details": {
      "limit": 50,
      "window": "1 hour",
      "resetTime": "2023-09-14T12:00:00Z"
    }
  }
}`;

  const upgradeExample = `curl -X POST "https://api.lankalocate.lk/v1/billing/upgrade" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "plan": "pro"
  }'`;

  return (
    <DocsSection 
      title="Rate Limits & Quotas"
      description="Understanding API rate limits, quotas, and how to manage your usage across different subscription tiers."
    >
      <div className="space-y-8">
        {/* Rate Limit Overview */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Rate Limit Overview</h3>
          <p className="text-text-secondary mb-4">
            Our API implements rate limiting to ensure fair usage and maintain service quality for all users. 
            Limits are enforced per API key and reset at regular intervals.
          </p>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5">
                <span className="text-amber-600 text-sm font-bold">!</span>
              </div>
              <div>
                <h4 className="font-medium text-amber-700 mb-1">Rate Limit Headers</h4>
                <p className="text-amber-600 text-sm">
                  Every API response includes rate limit information in the headers. Monitor these to avoid hitting limits.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Subscription Tiers & Limits</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Tier */}
            <div className="border border-border rounded-lg p-4 bg-surface-darker">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-text-primary">Free Tier</h4>
                <span className="bg-gray-500/20 text-gray-600 px-2 py-1 rounded text-xs font-medium">FREE</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Per Hour</span>
                  <span className="font-mono font-medium text-text-primary">50 requests</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Per Day</span>
                  <span className="font-mono font-medium text-text-primary">100 requests</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Per Month</span>
                  <span className="font-mono font-medium text-text-primary">1,000 requests</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-text-secondary text-sm">API Keys</span>
                  <span className="font-mono font-medium text-text-primary">2 keys</span>
                </div>
              </div>
              
              <p className="text-xs text-text-secondary mt-3">
                Perfect for testing and small projects
              </p>
            </div>

            {/* Pro Tier */}
            <div className="border border-blue-500/30 rounded-lg p-4 bg-blue-500/5 relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">POPULAR</span>
              </div>
              
              <div className="flex items-center justify-between mb-3 mt-2">
                <h4 className="font-semibold text-text-primary">Pro Tier</h4>
                <span className="bg-blue-500/20 text-blue-600 px-2 py-1 rounded text-xs font-medium">PRO</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Per Hour</span>
                  <span className="font-mono font-medium text-text-primary">1,000 requests</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Per Day</span>
                  <span className="font-mono font-medium text-text-primary">10,000 requests</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Per Month</span>
                  <span className="font-mono font-medium text-text-primary">100,000 requests</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-text-secondary text-sm">API Keys</span>
                  <span className="font-mono font-medium text-text-primary">10 keys</span>
                </div>
              </div>
              
              <p className="text-xs text-text-secondary mt-3">
                Ideal for production applications and businesses
              </p>
            </div>

            {/* Enterprise Tier */}
            <div className="border border-purple-500/30 rounded-lg p-4 bg-purple-500/5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-text-primary">Enterprise</h4>
                <span className="bg-purple-500/20 text-purple-600 px-2 py-1 rounded text-xs font-medium">ENTERPRISE</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Per Hour</span>
                  <span className="font-mono font-medium text-text-primary">10,000 requests</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Per Day</span>
                  <span className="font-mono font-medium text-text-primary">100,000 requests</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Per Month</span>
                  <span className="font-mono font-medium text-text-primary">1,000,000 requests</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-text-secondary text-sm">API Keys</span>
                  <span className="font-mono font-medium text-text-primary">Unlimited</span>
                </div>
              </div>
              
              <p className="text-xs text-text-secondary mt-3">
                For large-scale applications and organizations
              </p>
            </div>
          </div>
        </div>

        {/* Rate Limit Headers */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/any-endpoint"
          description="Every API response includes rate limit information in the headers to help you monitor your usage."
          example="curl -X GET https://api.lankalocate.lk/v1/provinces -H 'Authorization: Bearer YOUR_API_KEY'"
          exampleResponse={rateLimitHeadersExample}
        />

        {/* Rate Limit Exceeded Response */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/any-endpoint"
          description="When you exceed your rate limit, the API returns a 429 status code with details about when you can retry."
          example="curl -X GET https://api.lankalocate.lk/v1/provinces -H 'Authorization: Bearer YOUR_API_KEY'"
          exampleResponse={rateLimitExceededExample}
        />

        {/* Headers Reference */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Rate Limit Headers Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium text-text-primary">Header</th>
                  <th className="text-left py-2 px-3 font-medium text-text-primary">Description</th>
                  <th className="text-left py-2 px-3 font-medium text-text-primary">Example</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">X-RateLimit-Limit</td>
                  <td className="py-2 px-3">The maximum number of requests allowed in the current window</td>
                  <td className="py-2 px-3 font-mono">50</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">X-RateLimit-Remaining</td>
                  <td className="py-2 px-3">The number of requests remaining in the current window</td>
                  <td className="py-2 px-3 font-mono">49</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">X-RateLimit-Reset</td>
                  <td className="py-2 px-3">Unix timestamp when the current window resets</td>
                  <td className="py-2 px-3 font-mono">1694678400</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">X-RateLimit-Window</td>
                  <td className="py-2 px-3">The duration of the rate limit window in seconds</td>
                  <td className="py-2 px-3 font-mono">3600</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">Retry-After</td>
                  <td className="py-2 px-3">Seconds to wait before making another request (429 responses only)</td>
                  <td className="py-2 px-3 font-mono">3600</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Best Practices</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Monitor Rate Limit Headers</h4>
                <p className="text-text-secondary text-sm">
                  Always check the <code className="bg-surface-darker px-2 py-1 rounded">X-RateLimit-Remaining</code> header to avoid hitting limits unexpectedly.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Implement Exponential Backoff</h4>
                <p className="text-text-secondary text-sm">
                  When you receive a 429 response, wait for the time specified in the <code className="bg-surface-darker px-2 py-1 rounded">Retry-After</code> header before retrying.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Cache Responses</h4>
                <p className="text-text-secondary text-sm">
                  Cache API responses when possible to reduce the number of requests and stay within your limits.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Use Appropriate Pagination</h4>
                <p className="text-text-secondary text-sm">
                  Use pagination parameters (<code className="bg-surface-darker px-2 py-1 rounded">limit</code>, <code className="bg-surface-darker px-2 py-1 rounded">offset</code>) to fetch data in smaller chunks rather than large bulk requests.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                <span className="text-blue-600 text-sm">i</span>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Upgrade When Needed</h4>
                <p className="text-text-secondary text-sm">
                  If you consistently hit rate limits, consider upgrading to a higher tier for increased quotas and better performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Information */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Upgrading Your Plan</h3>
          <p className="text-text-secondary mb-4">
            Need higher rate limits? Upgrade your subscription tier to get increased quotas and additional API keys.
          </p>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-700 mb-2">Upgrade via API</h4>
            <p className="text-blue-600 text-sm mb-3">
              You can programmatically upgrade your subscription using our billing API:
            </p>
            <pre className="bg-surface-darker border border-border rounded p-3 text-xs overflow-x-auto">
              <code>{upgradeExample}</code>
            </pre>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-text-secondary text-sm">
              <strong className="text-text-primary">Contact Sales:</strong> For enterprise plans or custom rate limits, 
              contact our sales team at <a href="mailto:sales@lankalocate.lk" className="text-blue-600 hover:text-blue-500">sales@lankalocate.lk</a>
            </p>
          </div>
        </div>
      </div>
    </DocsSection>
  );
};
