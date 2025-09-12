import { motion } from 'framer-motion';
import { MapPin, Truck, Building, Star, Quote, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const UseCasesSection = () => {
  const useCases = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Form Builders & Validation',
      description: 'Ensure correct GN data in address forms with real-time validation and autocomplete suggestions.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/50',
      examples: [
        'E-commerce checkout forms',
        'Registration systems',
        'Delivery address validation',
        'Government form applications'
      ],
      metrics: {
        accuracy: '99.8%',
        improvement: '45% faster completion'
      }
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Logistics & Delivery',
      description: 'Optimize delivery routes and ensure accurate address data for logistics applications.',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/50',
      examples: [
        'Last-mile delivery optimization',
        'Route planning systems',
        'Warehouse management',
        'Supply chain tracking'
      ],
      metrics: {
        accuracy: '95% delivery success',
        improvement: '30% cost reduction'
      }
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: 'Government & NGOs',
      description: 'Handle Sri Lankan regional data efficiently for government portals and NGO applications.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/50',
      examples: [
        'Census data management',
        'Public service delivery',
        'Electoral systems',
        'Development project tracking'
      ],
      metrics: {
        accuracy: '100% compliance',
        improvement: '60% faster processing'
      }
    }
  ];

  const testimonials = [
    {
      name: 'Saman Perera',
      role: 'CTO',
      company: 'DeliveryLK',
      avatar: 'SP',
      rating: 5,
      content: 'LankaLocate helped us improve our delivery accuracy by 95%. The API is incredibly fast and reliable. Our customers love the accurate address suggestions, and it has significantly reduced failed deliveries.',
      metrics: {
        improvement: '95% accuracy improvement',
        savings: '$50K annual savings'
      },
      companySize: '50-200 employees',
      useCase: 'Logistics'
    },
    {
      name: 'Priya Fernando',
      role: 'Lead Developer',
      company: 'GovTech Solutions',
      avatar: 'PF',
      rating: 5,
      content: 'Perfect for our government portal integration. The data accuracy is exceptional and the developer experience is outstanding. We integrated it in just 2 days and it works flawlessly.',
      metrics: {
        improvement: '100% data compliance',
        savings: '60% faster development'
      },
      companySize: '200+ employees',
      useCase: 'Government'
    },
    {
      name: 'Kasun Silva',
      role: 'Founder & CEO',
      company: 'FormBuilder Pro',
      avatar: 'KS',
      rating: 5,
      content: 'Integration was seamless and our users love the accurate address suggestions. The autocomplete feature has improved our form completion rates by 40%. Best investment we made this year.',
      metrics: {
        improvement: '40% completion rate increase',
        savings: '25% support ticket reduction'
      },
      companySize: '10-50 employees',
      useCase: 'SaaS'
    },
    {
      name: 'Dinesh Rajapakse',
      role: 'Technical Lead',
      company: 'Lanka Express',
      avatar: 'DR',
      rating: 5,
      content: 'Outstanding API performance and reliability. We process thousands of addresses daily and LankaLocate handles our scale perfectly. The support team is incredibly responsive.',
      metrics: {
        improvement: '99.9% uptime achieved',
        savings: '35% operational efficiency'
      },
      companySize: '100-500 employees',
      useCase: 'Logistics'
    },
    {
      name: 'Chaminda Wickramasinghe',
      role: 'Senior Developer',
      company: 'Digital Lanka',
      avatar: 'CW',
      rating: 5,
      content: 'The most comprehensive Sri Lankan location data API available. Documentation is excellent and the free tier was perfect for our MVP. Highly recommended for any Sri Lankan project.',
      metrics: {
        improvement: '100% data coverage',
        savings: '3 months development time saved'
      },
      companySize: '20-100 employees',
      useCase: 'Startup'
    },
    {
      name: 'Nimal Gunawardena',
      role: 'IT Director',
      company: 'Ceylon Bank',
      avatar: 'NG',
      rating: 5,
      content: 'Enterprise-grade security and reliability. Perfect for our banking applications where data accuracy is critical. The SLA guarantee gives us complete confidence.',
      metrics: {
        improvement: '100% regulatory compliance',
        savings: 'Zero data incidents'
      },
      companySize: '1000+ employees',
      useCase: 'Banking'
    }
  ];

  const industries = [
    { name: 'E-commerce', count: '150+', growth: '+45%' },
    { name: 'Logistics', count: '80+', growth: '+60%' },
    { name: 'Government', count: '25+', growth: '+30%' },
    { name: 'Banking', count: '15+', growth: '+25%' },
    { name: 'Healthcare', count: '40+', growth: '+55%' },
    { name: 'Real Estate', count: '60+', growth: '+40%' }
  ];

  return (
    <section id="use-cases" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-display-2 font-bold text-text-primary mb-4">
            Who uses LankaLocate?
          </h2>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            From startups to enterprises, developers across industries trust LankaLocate for accurate Sri Lankan location data. 
            Join thousands of successful implementations.
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${useCase.bgColor} mb-6 ${useCase.color} group-hover:scale-110 transition-transform duration-300`}>
                    {useCase.icon}
                  </div>
                  
                  <h3 className="text-heading-3 font-semibold text-text-primary mb-3">
                    {useCase.title}
                  </h3>
                  
                  <p className="text-body-sm text-text-secondary mb-6">
                    {useCase.description}
                  </p>

                  {/* Examples */}
                  <div className="mb-6">
                    <h4 className="text-body-sm font-medium text-text-primary mb-3">Common use cases:</h4>
                    <ul className="space-y-2">
                      {useCase.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="text-caption text-text-secondary flex items-center">
                          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></div>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metrics */}
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center text-caption">
                      <span className="text-text-secondary">Accuracy:</span>
                      <span className="font-medium text-green-600">{useCase.metrics.accuracy}</span>
                    </div>
                    <div className="flex justify-between items-center text-caption mt-1">
                      <span className="text-text-secondary">Improvement:</span>
                      <span className="font-medium text-blue-600">{useCase.metrics.improvement}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Industries Using LankaLocate */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-heading-1 font-bold text-text-primary text-center mb-8">
            Trusted across industries
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 bg-surface rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-heading-2 font-bold text-text-primary mb-1">
                  {industry.count}
                </div>
                <div className="text-body-sm text-text-secondary mb-2">
                  {industry.name}
                </div>
                <Badge variant="success" className="text-xs">
                  {industry.growth} growth
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Customer Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-heading-1 font-bold text-text-primary mb-4">
              What our customers say
            </h3>
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
              Don't just take our word for it. Here's what real customers are saying about LankaLocate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: (index % 3) * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>

                    {/* Quote */}
                    <div className="relative mb-6">
                      <Quote className="w-8 h-8 text-indigo-200 absolute -top-2 -left-2" />
                      <p className="text-body-sm text-text-secondary italic pl-6">
                        "{testimonial.content}"
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="bg-surface-variant rounded-lg p-4 mb-6 space-y-2">
                      <div className="flex justify-between items-center text-caption">
                        <span className="text-text-secondary">Impact:</span>
                        <span className="font-medium text-green-600">{testimonial.metrics.improvement}</span>
                      </div>
                      <div className="flex justify-between items-center text-caption">
                        <span className="text-text-secondary">Savings:</span>
                        <span className="font-medium text-blue-600">{testimonial.metrics.savings}</span>
                      </div>
                    </div>

                    {/* Author */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="text-body-sm font-semibold text-text-primary">
                            {testimonial.name}
                          </div>
                          <div className="text-caption text-text-secondary">
                            {testimonial.role}, {testimonial.company}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="primary" className="text-xs mb-1">
                          {testimonial.useCase}
                        </Badge>
                        <div className="text-caption text-text-secondary">
                          {testimonial.companySize}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white text-center"
        >
          <h3 className="text-heading-1 font-bold mb-8">
            Join thousands of satisfied customers
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-indigo-100">Active Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10M+</div>
              <div className="text-indigo-100">API Calls/Month</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-indigo-100">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-indigo-100">Support Available</div>
            </div>
          </div>

          <Button 
            size="lg" 
            variant="secondary" 
            className="bg-white text-indigo-600 hover:bg-gray-100 flex items-center space-x-2 mx-auto"
          >
            <span>Start Your Success Story</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
