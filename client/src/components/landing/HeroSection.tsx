import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Code, Play, CheckCircle, Globe, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import Prism from 'prismjs';

export const HeroSection = () => {
  const [activeExample, setActiveExample] = useState(0);

  const codeExamples = [
    {
      title: "Get GN Divisions by District",
      code: `fetch("https://api.lankalocate.lk/v1/divisions?district=Colombo", {
  headers: { Authorization: "Bearer YOUR_API_KEY" }
})
.then(res => res.json())
.then(data => console.log(data));`
    },
    {
      title: "Search by City",
      code: `fetch("https://api.lankalocate.lk/v1/divisions?city=Kandy", {
  headers: { Authorization: "Bearer YOUR_API_KEY" }
})
.then(res => res.json())
.then(data => {
  // Returns: { gnDivision: "Ampitiya South", city: "Kandy", ... }
  console.log(data);
});`
    },
    {
      title: "Get All Provinces",
      code: `fetch("https://api.lankalocate.lk/v1/provinces", {
  headers: { Authorization: "Bearer YOUR_API_KEY" }
})
.then(res => res.json())
.then(provinces => {
  // Returns array of all 9 provinces
  console.log(provinces);
});`
    }
  ];

  const trustedBy = [
    { name: "DeliveryLK", users: "50K+" },
    { name: "GovTech", users: "100K+" },
    { name: "FormBuilder", users: "25K+" },
    { name: "LogiSoft", users: "75K+" }
  ];

  useEffect(() => {
    Prism.highlightAll();
  }, [activeExample]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExample((prev) => (prev + 1) % codeExamples.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-900/20"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge variant="primary" className="inline-flex items-center space-x-2 mb-6">
                  <Zap className="w-4 h-4" />
                  <span>Now Available - Free Tier Included</span>
                </Badge>
              </motion.div>

              <motion.h1 
                className="text-display-1 font-bold text-text-primary leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                The most accurate{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  GN division data API
                </span>{' '}
                for Sri Lanka
              </motion.h1>

              <motion.p 
                className="text-body-xl text-text-secondary max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Easily integrate GN divisions, cities, districts, and provinces into your applications. 
                Built for developers, trusted by businesses. Get accurate, up-to-date Sri Lankan location data with lightning-fast API responses.
              </motion.p>

              {/* Key Benefits */}
              <motion.div 
                className="grid grid-cols-2 gap-4 py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-body-sm text-text-secondary">10,000+ verified records</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-body-sm text-text-secondary">99.9% uptime guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-body-sm text-text-secondary">RESTful JSON API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-body-sm text-text-secondary">Free tier available</span>
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button size="lg" className="flex items-center space-x-2 shadow-lg">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>View Live Demo</span>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex space-x-8 pt-8 border-t border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-center">
                <div className="text-heading-2 font-bold text-text-primary">10,000+</div>
                <div className="text-body-sm text-text-secondary">Records</div>
              </div>
              <div className="text-center">
                <div className="text-heading-2 font-bold text-text-primary">99.9%</div>
                <div className="text-body-sm text-text-secondary">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-heading-2 font-bold text-text-primary">&lt;100ms</div>
                <div className="text-body-sm text-text-secondary">Response</div>
              </div>
              <div className="text-center">
                <div className="text-heading-2 font-bold text-text-primary">1M+</div>
                <div className="text-body-sm text-text-secondary">API Calls</div>
              </div>
            </motion.div>

            {/* Trusted By */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-6"
            >
              <p className="text-body-sm text-text-secondary mb-4">Trusted by leading companies:</p>
              <div className="flex flex-wrap gap-6">
                {trustedBy.map((company, index) => (
                  <div key={index} className="flex items-center space-x-2 text-body-sm text-text-secondary">
                    <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded"></div>
                    </div>
                    <span className="font-medium">{company.name}</span>
                    <span className="text-caption">({company.users} users)</span>
                  </div>
                ))}
              </div>
            </motion.div> */}
          </motion.div>

          {/* Right Content - Interactive Code Examples */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm font-mono">
                  {codeExamples[activeExample].title}
                </span>
                <div className="flex space-x-1">
                  {codeExamples.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveExample(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === activeExample ? 'bg-indigo-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Code Content */}
              <div className="p-6">
                <pre className="text-sm overflow-x-auto">
                  <code className="language-javascript">
                    {codeExamples[activeExample].code}
                  </code>
                </pre>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-indigo-600 text-white p-3 rounded-lg shadow-lg"
            >
              <Code className="w-6 h-6" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-purple-600 text-white p-3 rounded-lg shadow-lg"
            >
              <Globe className="w-6 h-6" />
            </motion.div>

            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 2 }}
              className="absolute top-1/2 -left-6 bg-green-600 text-white p-2 rounded-lg shadow-lg"
            >
              <Shield className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Custom styles for blob animation */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};
