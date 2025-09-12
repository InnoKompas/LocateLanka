import { motion } from 'framer-motion';
import { 
  Code, 
  Database, 
  Zap, 
  CreditCard, 
  Shield, 
  Clock, 
  Users, 
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

export const FeaturesSection = () => {
  const mainFeatures = [
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Easy API Integration',
      description: 'Simple REST API with JSON responses. Get started in minutes with comprehensive documentation and SDKs.',
      color: 'text-blue-600',
      details: [
        'RESTful JSON API',
        'Comprehensive documentation',
        'SDKs for popular languages',
        'Postman collection included'
      ]
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: '10,000+ Verified Records',
      description: 'Up-to-date GN data with complete city, district, and province mapping across all 25 districts of Sri Lanka.',
      color: 'text-green-600',
      details: [
        'All 25 districts covered',
        'Monthly data updates',
        'Verified by government sources',
        'Hierarchical data structure'
      ]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Optimized API with low latency, 99.9% uptime, and global CDN for lightning-fast responses worldwide.',
      color: 'text-yellow-600',
      details: [
        'Sub-100ms response times',
        'Global CDN network',
        '99.9% uptime SLA',
        'Auto-scaling infrastructure'
      ]
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Flexible Pricing',
      description: 'Free tier for development, scalable paid options for production with transparent pricing and no hidden fees.',
      color: 'text-purple-600',
      details: [
        'Free tier: 1,000 requests/month',
        'Pay-as-you-scale pricing',
        'No setup or hidden fees',
        'Cancel anytime'
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Enterprise Security',
      description: 'SSL encryption, API key authentication, and rate limiting for secure access.'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Real-time Updates',
      description: 'Get notified of data updates and changes through webhooks and notifications.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Developer Support',
      description: 'Dedicated support team with average response time under 2 hours.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Access',
      description: 'Access from anywhere with our globally distributed API infrastructure.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-surface-variant">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-display-2 font-bold text-text-primary mb-4">
            Why choose LankaLocate?
          </h2>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            Built by developers, for developers. Everything you need to integrate accurate Sri Lankan location data 
            with enterprise-grade reliability and developer-friendly tools.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full text-center hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardContent className="p-8">
                  <motion.div 
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-heading-3 font-semibold text-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-body-sm text-text-secondary mb-4">
                    {feature.description}
                  </p>
                  <ul className="text-left space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-2 text-caption text-text-secondary">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-heading-1 font-bold text-text-primary text-center mb-8">
            Everything you need for production
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4 p-6 bg-surface rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-600">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-heading-3 font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-body-sm text-text-secondary">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white"
        >
          <h3 className="text-heading-1 font-bold mb-4">
            Ready to get started?
          </h3>
          <p className="text-body-lg mb-8 opacity-90">
            Join thousands of developers building amazing applications with accurate Sri Lankan location data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-indigo-600 hover:bg-gray-100 flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-indigo-600"
            >
              View Documentation
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
