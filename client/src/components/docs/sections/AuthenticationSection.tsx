import { Link } from 'react-router-dom';
import { Key, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { DocsSection } from '../shared/DocsSection';
import { CodeBlock } from '../shared/CodeBlock';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

export const AuthenticationSection = () => {
  const curlExample = `curl -X GET "https://api.lankalocate.lk/v1/provinces" \\
  -H "Authorization: Bearer lk_live_1234567890abcdef1234567890abcdef"`;

  const jsExample = `const response = await fetch('https://api.lankalocate.lk/v1/provinces', {
  headers: {
    'Authorization': 'Bearer lk_live_1234567890abcdef1234567890abcdef',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();`;

  const pythonExample = `import requests

headers = {
    'Authorization': 'Bearer lk_live_1234567890abcdef1234567890abcdef',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.lankalocate.lk/v1/provinces', headers=headers)
data = response.json()`;

  const errorResponse = `{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key",
    "details": "Please provide a valid API key in the Authorization header"
  }
}`;

  return (
    <DocsSection 
      title="Authentication"
      description="LankaLocate API uses API keys to authenticate requests. Your API keys carry many privileges, so be sure to keep them secure!"
    >
      {/* API Key Overview */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Key className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">API Key Authentication</h3>
            <p className="text-sm text-text-secondary">Secure your API requests with Bearer tokens</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-text-secondary">
            All API requests must be authenticated using an API key. Include your API key in the 
            <code className="mx-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">Authorization</code> 
            header as a Bearer token.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Free Tier Available</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Get started with 1,000 free API calls per month. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Your API Key */}
      <div>
        <h2 className="text-heading-2 font-semibold text-text-primary mb-4">Getting Your API Key</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1">1</div>
            <div className="flex-1">
              <h4 className="font-medium text-text-primary mb-1">Create an Account</h4>
              <p className="text-sm text-text-secondary mb-3">
                Sign up for a free LankaLocate account to access the API dashboard.
              </p>
              <Link to="/signup">
                <Button size="sm">Sign Up Free</Button>
              </Link>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1">2</div>
            <div>
              <h4 className="font-medium text-text-primary mb-1">Generate API Key</h4>
              <p className="text-sm text-text-secondary">
                Navigate to the API Keys section in your dashboard and create a new key.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1">3</div>
            <div>
              <h4 className="font-medium text-text-primary mb-1">Start Making Requests</h4>
              <p className="text-sm text-text-secondary">
                Use your API key in the Authorization header to authenticate your requests.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Format */}
      <div>
        <h2 className="text-heading-2 font-semibold text-text-primary mb-4">API Key Format</h2>
        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-text-secondary mb-4">
            LankaLocate API keys follow a specific format to help you identify their environment and purpose:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Badge variant="success">Live</Badge>
              <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                lk_live_1234567890abcdef1234567890abcdef
              </code>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="warning">Test</Badge>
              <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                lk_test_1234567890abcdef1234567890abcdef
              </code>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">Keep Your Keys Secure</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Never expose your API keys in client-side code, public repositories, or logs. 
                  Use environment variables or secure key management systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Examples */}
      <div>
        <h2 className="text-heading-2 font-semibold text-text-primary mb-4">Authentication Examples</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-3">cURL</h3>
            <CodeBlock code={curlExample} language="bash" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-text-primary mb-3">JavaScript (Fetch)</h3>
            <CodeBlock code={jsExample} language="javascript" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-text-primary mb-3">Python (Requests)</h3>
            <CodeBlock code={pythonExample} language="python" />
          </div>
        </div>
      </div>

      {/* Error Handling */}
      <div>
        <h2 className="text-heading-2 font-semibold text-text-primary mb-4">Authentication Errors</h2>
        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-text-secondary mb-4">
            If authentication fails, the API will return a <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">401 Unauthorized</code> status code with details about the error:
          </p>
          
          <CodeBlock code={errorResponse} language="json" title="Error Response" />

          <div className="mt-4">
            <h4 className="font-medium text-text-primary mb-2">Common Authentication Errors</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Missing Authorization header</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Invalid API key format</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Expired or deactivated API key</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>API key without sufficient permissions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-heading-2 font-semibold text-text-primary">Security Best Practices</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-text-primary mb-1">Use Environment Variables</h4>
              <p className="text-sm text-text-secondary">
                Store API keys in environment variables, never in your source code.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-text-primary mb-1">Rotate Keys Regularly</h4>
              <p className="text-sm text-text-secondary">
                Generate new API keys periodically and deactivate old ones.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-text-primary mb-1">Use HTTPS Only</h4>
              <p className="text-sm text-text-secondary">
                Always make API requests over HTTPS to protect your API key in transit.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-text-primary mb-1">Monitor Usage</h4>
              <p className="text-sm text-text-secondary">
                Regularly check your API usage in the dashboard to detect any unusual activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DocsSection>
  );
};
