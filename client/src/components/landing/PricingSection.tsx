import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Crown, Building2, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useState } from 'react';

export const PricingSection = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free',
      icon: <Zap className="w-6 h-6" />,
      price: { monthly: 0, yearly: 0 },
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      description: 'Perfect for testing and small projects',
      popular: false,
      features: [
        '1,000 requests/month',
        'All API endpoints',
        'Community support',
        'Standard rate limits',
        'Basic documentation',
        'Email support'
      ],
      limitations: [
        'No SLA guarantee',
        'Standard support only',
        'Rate limited to 10 req/min'
      ],
      cta: 'Get Started Free',
      highlight: false
    },
    {
      name: 'Pro',
      icon: <Crown className="w-6 h-6" />,
      price: { monthly: 29, yearly: 290 },
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      description: 'Best for growing applications and businesses',
      popular: true,
      features: [
        '100,000 requests/month',
        'All API endpoints',
        'Priority email support',
        'Higher rate limits (100 req/min)',
        'Advanced analytics dashboard',
        'Webhook notifications',
        'Custom integrations',
        '99.9% uptime SLA',
        'Advanced documentation'
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      highlight: true,
      savings: billingPeriod === 'yearly' ? 'Save $58/year' : null
    },
    {
      name: 'Enterprise',
      icon: <Building2 className="w-6 h-6" />,
      price: { monthly: 'Custom', yearly: 'Custom' },
      period: '',
      description: 'For large-scale applications and enterprises',
      popular: false,
      features: [
        'Unlimited requests',
        'All API endpoints',
        'Dedicated support manager',
        'Custom rate limits',
        'Advanced analytics & reporting',
        'Custom webhooks',
        'On-premise deployment option',
        '99.95% uptime SLA',
        'White-label options',
        'Custom integrations',
        'Training & onboarding',
        'Priority feature requests'
      ],
      limitations: [],
      cta: 'Contact Sales',
      highlight: false
    }
  ];

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.'
    },
    {
      question: 'What happens if I exceed my monthly quota?',
      answer: 'Your requests will be temporarily rate-limited until the next billing cycle. You can upgrade your plan to increase your quota immediately.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.'
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No, there are no setup fees or hidden costs. You only pay for your chosen plan.'
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <section id="pricing" className="py-20 bg-surface-variant">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-display-2 font-bold text-text-primary mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto mb-8">
            Choose the plan that fits your needs. Start free, scale as you grow. 
            No hidden fees, no surprises. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-body-sm ${billingPeriod === 'monthly' ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingPeriod === 'yearly' ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-body-sm ${billingPeriod === 'yearly' ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
              Yearly
            </span>
            {billingPeriod === 'yearly' && (
              <Badge variant="success" className="ml-2">
                Save 20%
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge variant="primary" className="px-4 py-1 shadow-lg">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card className={`h-full relative overflow-hidden ${
                plan.highlight ? 'ring-2 ring-indigo-600 shadow-2xl scale-105' : 'shadow-lg'
              }`}>
                {plan.highlight && (
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
                    <div className="absolute top-4 right-[-32px] bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold py-1 px-8 rotate-45 shadow-sm">
                      POPULAR
                    </div>
                  </div>
                )}
                
                <CardContent className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div className={`p-2 rounded-lg ${
                        plan.highlight ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                      }`}>
                        {plan.icon}
                      </div>
                      <h3 className="text-heading-2 font-bold text-text-primary">
                        {plan.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-5xl font-bold text-text-primary">
                        {typeof plan.price[billingPeriod] === 'number' ? '$' : ''}
                        {plan.price[billingPeriod]}
                      </span>
                      <span className="text-text-secondary ml-1">
                        {plan.period}
                      </span>
                    </div>
                    
                    {plan.savings && (
                      <div className="text-green-600 text-sm font-medium mb-2">
                        {plan.savings}
                      </div>
                    )}
                    
                    <p className="text-body-sm text-text-secondary">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-body-sm text-text-secondary">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button 
                    className="w-full mb-4" 
                    variant={plan.highlight ? 'primary' : 'outline'}
                    size="lg"
                  >
                    {plan.cta}
                    {plan.name !== 'Enterprise' && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>

                  {/* Additional Info */}
                  <div className="text-center">
                    <p className="text-caption text-text-secondary">
                      {plan.name === 'Free' && 'No credit card required'}
                      {plan.name === 'Pro' && '14-day free trial'}
                      {plan.name === 'Enterprise' && 'Custom pricing available'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-heading-1 font-bold text-text-primary text-center mb-8">
            Compare all features
          </h3>
          
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-variant">
                  <tr>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-text-primary">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-body-sm font-semibold text-text-primary">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center text-body-sm font-semibold text-text-primary">
                      Pro
                    </th>
                    <th className="px-6 py-4 text-center text-body-sm font-semibold text-text-primary">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { feature: 'Monthly API Requests', free: '1,000', pro: '100,000', enterprise: 'Unlimited' },
                    { feature: 'Rate Limits (req/min)', free: '10', pro: '100', enterprise: 'Custom' },
                    { feature: 'Uptime SLA', free: 'Best effort', pro: '99.9%', enterprise: '99.95%' },
                    { feature: 'Support', free: 'Community', pro: 'Priority email', enterprise: 'Dedicated manager' },
                    { feature: 'Analytics Dashboard', free: '✗', pro: '✓', enterprise: '✓ Advanced' },
                    { feature: 'Webhook Notifications', free: '✗', pro: '✓', enterprise: '✓ Custom' },
                    { feature: 'On-premise Deployment', free: '✗', pro: '✗', enterprise: '✓' },
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-surface-variant/50">
                      <td className="px-6 py-4 text-body-sm text-text-primary font-medium">
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-center text-body-sm text-text-secondary">
                        {row.free}
                      </td>
                      <td className="px-6 py-4 text-center text-body-sm text-text-secondary">
                        {row.pro}
                      </td>
                      <td className="px-6 py-4 text-center text-body-sm text-text-secondary">
                        {row.enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-heading-1 font-bold text-text-primary text-center mb-8">
            Frequently asked questions
          </h3>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-surface-variant/50 transition-colors"
                >
                  <span className="text-body font-medium text-text-primary">
                    {faq.question}
                  </span>
                  <HelpCircle className={`w-5 h-5 text-text-secondary transition-transform ${
                    expandedFaq === index ? 'rotate-180' : ''
                  }`} />
                </button>
                
                <motion.div
                  initial={false}
                  animate={{ height: expandedFaq === index ? 'auto' : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 text-body-sm text-text-secondary">
                    {faq.answer}
                  </div>
                </motion.div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
