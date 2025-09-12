import { motion } from 'framer-motion';
import { UserPlus, Key, Code, Rocket, ArrowRight, Copy, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useState } from 'react';

export const HowItWorksSection = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const steps = [
    {
      step: '01',
      icon: <UserPlus className="w-8 h-8" />,
      title: 'Sign up & get your API key',
      description: 'Create your account and receive your unique API key instantly. No credit card required for the free tier.',
      details: [
        'Instant account creation',
        'No credit card required',
        'Free 1,000 requests/month',
        'Access to all endpoints'
      ],
      time: '30 seconds'
    },
    {
      step: '02',
      icon: <Code className="w-8 h-8" />,
      title: 'Integrate the API',
      description: 'Use our simple REST API with your favorite programming language. Full documentation and examples provided.',
      details: [
        'RESTful JSON API',
        'Multiple programming languages',
        'Comprehensive documentation',
        'Live code examples'
      ],
      time: '5 minutes'
    },
    {
      step: '03',
      icon: <Rocket className="w-8 h-8" />,
      title: 'Deploy & scale',
      description: 'Launch your application with confidence. Our infrastructure scales automatically with your needs.',
      details: [
        'Auto-scaling infrastructure',
        'Global CDN distribution',
        'Real-time monitoring',
        'Enterprise support available'
      ],
      time: 'Instant'
    }
  ];

  const codeExamples = [
    {
      language: 'JavaScript',
      title: 'Get GN Division by City',
      code: `// Get GN division for a specific city
const response = await fetch('https://api.lankalocate.lk/v1/divisions?city=Kandy', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);

// Response:
// {
//   "gnDivision": "Ampitiya South",
//   "city": "Kandy",
//   "district": "Kandy", 
//   "province": "Central"
// }`
    },
    {
      language: 'Python',
      title: 'Search Districts by Province',
      code: `import requests

# Get all districts in Central Province
url = "https://api.lankalocate.lk/v1/districts"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
params = {"province": "Central"}

response = requests.get(url, headers=headers, params=params)
districts = response.json()

for district in districts:
    print(f"{district['name']} - {district['gnDivisions']} divisions")`
    },
    {
      language: 'cURL',
      title: 'Validate Address',
      code: `# Validate if a GN division exists
curl -X GET "https://api.lankalocate.lk/v1/validate" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "gnDivision": "Colombo 01",
    "district": "Colombo",
    "province": "Western"
  }'

# Response:
# {
#   "valid": true,
#   "confidence": 100,
#   "suggestions": []
# }`
    }
  ];

  const [activeExample, setActiveExample] = useState(0);

  const copyToClipboard = (code: string, language: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(language);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-display-2 font-bold text-text-primary mb-4">
            Get started in minutes
          </h2>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            Our simple three-step process gets you from signup to production in minutes, not hours. 
            No complex setup, no lengthy approval process.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-20 w-0.5 h-16 bg-gradient-to-b from-indigo-600 to-purple-600 opacity-30"></div>
                )}
                
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold mb-4">
                          {step.step}
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-600">
                          {step.icon}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-heading-3 font-semibold text-text-primary">
                            {step.title}
                          </h3>
                          <span className="text-caption text-text-secondary bg-surface-variant px-3 py-1 rounded-full">
                            {step.time}
                          </span>
                        </div>
                        
                        <p className="text-body-sm text-text-secondary mb-4">
                          {step.description}
                        </p>
                        
                        <ul className="grid grid-cols-2 gap-2">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center space-x-2 text-caption text-text-secondary">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Interactive Code Examples */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="sticky top-8"
          >
            <Card className="overflow-hidden shadow-2xl">
              <div className="bg-gray-900 text-white">
                {/* Code Example Tabs */}
                <div className="flex border-b border-gray-700">
                  {codeExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveExample(index)}
                      className={`px-6 py-3 text-sm font-medium transition-colors ${
                        index === activeExample
                          ? 'bg-gray-800 text-white border-b-2 border-indigo-500'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      {example.language}
                    </button>
                  ))}
                </div>

                {/* Code Content */}
                <div className="relative">
                  <div className="flex items-center justify-between px-6 py-3 bg-gray-800 border-b border-gray-700">
                    <span className="text-sm text-gray-300">
                      {codeExamples[activeExample].title}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(
                        codeExamples[activeExample].code,
                        codeExamples[activeExample].language
                      )}
                      className="text-gray-400 hover:text-white p-2"
                    >
                      {copiedCode === codeExamples[activeExample].language ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="p-6 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                      <code>{codeExamples[activeExample].code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Start CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8 text-center"
            >
              <Button size="lg" className="flex items-center space-x-2 mx-auto">
                <span>Try It Now - Free</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-caption text-text-secondary mt-2">
                No credit card required • 1,000 free requests/month
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Integration Examples */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-heading-1 font-bold text-text-primary mb-8">
            Popular integration patterns
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-4">
                <Code className="w-6 h-6" />
              </div>
              <h4 className="text-heading-3 font-semibold text-text-primary mb-2">
                Form Validation
              </h4>
              <p className="text-body-sm text-text-secondary">
                Validate addresses in real-time as users type with autocomplete suggestions.
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center text-green-600 mx-auto mb-4">
                <Key className="w-6 h-6" />
              </div>
              <h4 className="text-heading-3 font-semibold text-text-primary mb-2">
                Data Enrichment
              </h4>
              <p className="text-body-sm text-text-secondary">
                Enrich existing data with complete location hierarchy and administrative details.
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-600 mx-auto mb-4">
                <Rocket className="w-6 h-6" />
              </div>
              <h4 className="text-heading-3 font-semibold text-text-primary mb-2">
                Analytics & Reporting
              </h4>
              <p className="text-body-sm text-text-secondary">
                Generate location-based reports and analytics with accurate regional data.
              </p>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
