import { Link } from 'react-router-dom';
import { DocsSection } from '../shared/DocsSection';
import { CodeBlock } from '../shared/CodeBlock';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

export const QuickStartSection = () => {
  const step1Code = `curl -X GET "https://api.lankalocate.lk/v1/provinces" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const step1Response = `{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Western Province",
      "sinhala": "බස්නාහිර පළාත",
      "tamil": "மேல் மாகாணம்",
      "code": "WP"
    }
  ]
}`;

  const jsExample = `// Using fetch API
const response = await fetch('https://api.lankalocate.lk/v1/provinces', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const data = await response.json();
console.log(data);`;

  const pythonExample = `import requests

headers = {'Authorization': 'Bearer YOUR_API_KEY'}
response = requests.get('https://api.lankalocate.lk/v1/provinces', headers=headers)
data = response.json()
print(data)`;

  return (
    <DocsSection 
      title="Quick Start Guide"
      description="Get up and running with the LankaLocate API in just a few minutes. This guide will walk you through making your first API call."
    >
      <div className="space-y-8">
        {/* Step 1: Get API Key */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
            <h3 className="text-lg font-semibold text-text-primary">Get Your API Key</h3>
          </div>
          
          <p className="text-text-secondary mb-4">
            First, you'll need to create an account and generate an API key. This takes less than a minute.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/signup">
              <Button>Sign Up Free</Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline">Already have an account?</Button>
            </Link>
          </div>
        </div>

        {/* Step 2: Make Your First Request */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
            <h3 className="text-lg font-semibold text-text-primary">Make Your First Request</h3>
          </div>
          
          <p className="text-text-secondary mb-4">
            Let's start with a simple request to get all provinces in Sri Lanka:
          </p>
          
          <CodeBlock code={step1Code} language="bash" title="Your First API Call" />
          
          <div className="mt-4">
            <h4 className="font-medium text-text-primary mb-2">Response:</h4>
            <CodeBlock code={step1Response} language="json" />
          </div>
        </div>

        {/* Step 3: Explore More Endpoints */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
            <h3 className="text-lg font-semibold text-text-primary">Explore More Endpoints</h3>
          </div>
          
          <p className="text-text-secondary mb-4">
            Now try these other endpoints to get familiar with the API:
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-surface-variant rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="success">GET</Badge>
                <code className="text-sm">/districts</code>
              </div>
              <p className="text-xs text-text-secondary">Get all districts</p>
            </div>
            
            <div className="bg-surface-variant rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="success">GET</Badge>
                <code className="text-sm">/dsds</code>
              </div>
              <p className="text-xs text-text-secondary">Get all DSDs</p>
            </div>
            
            <div className="bg-surface-variant rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="success">GET</Badge>
                <code className="text-sm">/divisions</code>
              </div>
              <p className="text-xs text-text-secondary">Get GN divisions</p>
            </div>
            
            <div className="bg-surface-variant rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="success">GET</Badge>
                <code className="text-sm">/provinces/1</code>
              </div>
              <p className="text-xs text-text-secondary">Get specific province</p>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div>
          <h2 className="text-heading-2 font-semibold text-text-primary mb-4">Code Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-3">JavaScript</h3>
              <CodeBlock code={jsExample} language="javascript" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-3">Python</h3>
              <CodeBlock code={pythonExample} language="python" />
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-4">What's Next?</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-1">1</div>
              <div>
                <h4 className="font-medium text-primary-900 dark:text-primary-100">Explore the API Reference</h4>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  Learn about all available endpoints, parameters, and response formats.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-1">2</div>
              <div>
                <h4 className="font-medium text-primary-900 dark:text-primary-100">Check Out Code Examples</h4>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  See practical examples in JavaScript, Python, cURL, and more.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-1">3</div>
              <div>
                <h4 className="font-medium text-primary-900 dark:text-primary-100">Build Something Cool</h4>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  Follow our guides to build location finders, address forms, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocsSection>
  );
};
