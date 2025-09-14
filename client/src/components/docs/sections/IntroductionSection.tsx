import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe, Zap, Shield, Code } from 'lucide-react';
import { DocsSection } from '../shared/DocsSection';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { CodeBlock } from '../shared/CodeBlock';

export const IntroductionSection = () => {
  const quickExample = `curl -X GET "https://api.lankalocate.lk/v1/provinces" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const exampleResponse = `{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Western Province",
      "sinhala": "බස්නාහිර පළාත",
      "tamil": "மேல் மாகாணம்",
      "districts": ["Colombo", "Gampaha", "Kalutara"]
    }
  ],
  "meta": {
    "total": 9,
    "page": 1,
    "limit": 10
  }
}`;

  return (
    <DocsSection 
      title="LankaLocate API Documentation"
      description="The most comprehensive and accurate API for Sri Lankan administrative divisions. Access provinces, districts, DSDs, and GN divisions with lightning-fast responses and 99.9% uptime."
    >
      {/* Quick Start Card */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Get Started in Minutes</h3>
            <p className="text-sm text-text-secondary">Try your first API call right now</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-text-primary mb-3">Quick Example</h4>
            <CodeBlock code={quickExample} language="bash" />
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-3">Response</h4>
            <CodeBlock code={exampleResponse} language="json" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link to="/signup">
            <Button className="flex items-center space-x-2">
              <span>Get Your API Key</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.open('#quick-start', '_self')}>
            View Quick Start Guide
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-heading-1 font-semibold text-text-primary mb-6">Why Choose LankaLocate API?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">99.9% Accuracy</h3>
            <p className="text-text-secondary text-sm">
              Verified and continuously updated administrative division data sourced from official government records.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Lightning Fast</h3>
            <p className="text-text-secondary text-sm">
              Sub-100ms response times with global CDN distribution and optimized database queries.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Complete Coverage</h3>
            <p className="text-text-secondary text-sm">
              All 9 provinces, 25 districts, 331+ DSDs, and 14,000+ GN divisions in a single API.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Enterprise Ready</h3>
            <p className="text-text-secondary text-sm">
              SOC 2 compliant with 99.9% uptime SLA, comprehensive monitoring, and 24/7 support.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Developer Friendly</h3>
            <p className="text-text-secondary text-sm">
              RESTful design, comprehensive docs, SDKs, and interactive examples for all major languages.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Free Tier</h3>
            <p className="text-text-secondary text-sm">
              Get started with 1,000 free API calls per month. No credit card required.
            </p>
          </div>
        </div>
      </div>

      {/* API Overview */}
      <div>
        <h2 className="text-heading-1 font-semibold text-text-primary mb-6">API Overview</h2>
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-text-primary mb-4">Base URL</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono">
                https://api.lankalocate.lk/v1
              </code>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-4">Authentication</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="primary">Bearer Token</Badge>
                <span className="text-sm text-text-secondary">API Key required</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-text-primary mb-4">Available Endpoints</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-surface-variant rounded-lg">
                <Badge variant="success">GET</Badge>
                <code className="text-sm">/provinces</code>
                <span className="text-xs text-text-secondary">All provinces</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-surface-variant rounded-lg">
                <Badge variant="success">GET</Badge>
                <code className="text-sm">/districts</code>
                <span className="text-xs text-text-secondary">All districts</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-surface-variant rounded-lg">
                <Badge variant="success">GET</Badge>
                <code className="text-sm">/dsds</code>
                <span className="text-xs text-text-secondary">All DSDs</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-surface-variant rounded-lg">
                <Badge variant="success">GET</Badge>
                <code className="text-sm">/divisions</code>
                <span className="text-xs text-text-secondary">GN divisions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-heading-2 font-semibold text-text-primary mb-4">Next Steps</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1">1</div>
            <div>
              <h4 className="font-medium text-text-primary">Get Your API Key</h4>
              <p className="text-sm text-text-secondary">Sign up for a free account and generate your first API key.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1">2</div>
            <div>
              <h4 className="font-medium text-text-primary">Make Your First Call</h4>
              <p className="text-sm text-text-secondary">Follow our quick start guide to make your first API request.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1">3</div>
            <div>
              <h4 className="font-medium text-text-primary">Explore Examples</h4>
              <p className="text-sm text-text-secondary">Check out our code examples and integration guides.</p>
            </div>
          </div>
        </div>
      </div>
    </DocsSection>
  );
};
