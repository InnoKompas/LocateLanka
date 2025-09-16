import { useState } from 'react';
import { DocsSection } from '../shared/DocsSection';
import { CodeBlock } from '../shared/CodeBlock';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardHeader, CardContent } from '../../ui/Card';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'authentication' | 'billing' | 'technical' | 'limits';
}

interface SupportTicket {
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  email: string;
}

export const SupportSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [ticketForm, setTicketForm] = useState<SupportTicket>({
    subject: '',
    category: 'technical',
    priority: 'medium',
    description: '',
    email: ''
  });

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I get started with the LankaLocate API?',
      answer: 'Getting started is easy! First, sign up for an account and obtain your API key. Then follow our Quick Start guide to make your first API call. We recommend starting with the provinces endpoint to familiarize yourself with the response format.',
      category: 'general'
    },
    {
      id: '2',
      question: 'What authentication methods are supported?',
      answer: 'We use Bearer token authentication. Include your API key in the Authorization header: "Authorization: Bearer YOUR_API_KEY". All requests must be made over HTTPS.',
      category: 'authentication'
    },
    {
      id: '3',
      question: 'What are the API rate limits?',
      answer: 'Rate limits depend on your subscription plan. Free tier allows 1,000 requests per month, while paid plans offer higher limits. Rate limiting is applied per API key with a sliding window approach.',
      category: 'limits'
    },
    {
      id: '4',
      question: 'How is billing calculated?',
      answer: 'Billing is based on successful API requests per month. Failed requests (4xx/5xx errors) are not counted. You can monitor your usage in the dashboard and set up alerts to avoid overages.',
      category: 'billing'
    },
    {
      id: '5',
      question: 'What data formats are supported?',
      answer: 'All API responses are in JSON format. We support UTF-8 encoding for Sinhala and Tamil text. Coordinates are provided in WGS84 decimal degrees format.',
      category: 'technical'
    },
    {
      id: '6',
      question: 'How often is the location data updated?',
      answer: 'Our core location data (provinces, districts, DSDs) is updated quarterly or as needed when administrative changes occur. GN division data is updated monthly to ensure accuracy.',
      category: 'general'
    },
    {
      id: '7',
      question: 'Can I use the API for commercial projects?',
      answer: 'Yes! Our paid plans are designed for commercial use. Please review our terms of service for specific usage guidelines and attribution requirements.',
      category: 'billing'
    },
    {
      id: '8',
      question: 'What should I do if I get a 429 error?',
      answer: 'A 429 error indicates you\'ve hit the rate limit. Implement exponential backoff in your retry logic and consider upgrading your plan if you consistently hit limits.',
      category: 'technical'
    }
  ];

  const categories = [
    { 
      id: 'general', 
      name: 'General', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'authentication', 
      name: 'Authentication', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'technical', 
      name: 'Technical', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'billing', 
      name: 'Billing', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'limits', 
      name: 'Rate Limits', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  const supportChannels = [
    {
      name: 'Documentation',
      description: 'Comprehensive guides and API reference',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      ),
      link: '#',
      availability: 'Available 24/7'
    },
    {
      name: 'Community Forum',
      description: 'Ask questions and share knowledge with other developers',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      ),
      link: '#',
      availability: 'Community-driven'
    },
    {
      name: 'Email Support',
      description: 'Direct support from our technical team',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      link: 'mailto:support@lankalocate.dev',
      availability: 'Response within 24 hours'
    },
    {
      name: 'Live Chat',
      description: 'Real-time assistance during business hours',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
        </svg>
      ),
      link: '#',
      availability: 'Mon-Fri, 9 AM - 6 PM (UTC+5:30)'
    }
  ];

  const filteredFAQs = faqs.filter(faq => faq.category === activeCategory);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the ticket to your support system
    console.log('Support ticket submitted:', ticketForm);
    alert('Support ticket submitted successfully! We\'ll get back to you soon.');
    // Reset form
    setTicketForm({
      subject: '',
      category: 'technical',
      priority: 'medium',
      description: '',
      email: ''
    });
  };

  return (
    <DocsSection 
      title="Support"
      description="Get help, find answers to common questions, and connect with our support team"
    >
      <div className="space-y-8">
        {/* Support Channels */}
        <Card>
          <CardHeader title="How can we help you?" />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {supportChannels.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.link}
                  className="block p-4 bg-surface-variant hover:bg-primary-50 border border-border hover:border-primary-200 rounded-lg transition-all duration-200"
                >
                  <div className="flex justify-center mb-3 text-primary-600">{channel.icon}</div>
                  <h4 className="text-body font-medium text-text-primary mb-2 text-center">{channel.name}</h4>
                  <p className="text-body-sm text-text-secondary mb-3 text-center">{channel.description}</p>
                  <div className="text-caption text-primary-600 font-medium text-center">{channel.availability}</div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-heading-3 mb-6">Frequently Asked Questions</h3>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-100 text-primary-800 border border-primary-200'
                    : 'bg-surface-variant text-text-secondary hover:bg-primary-50'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="border border-border rounded-lg">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-surface-variant"
                >
                  <span className="font-medium text-text-primary">{faq.question}</span>
                  <span className="text-text-secondary">
                    {expandedFAQ === faq.id ? '−' : '+'}
                  </span>
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-4 pb-4 text-text-secondary">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-heading-3 mb-6">Submit a Support Ticket</h3>
          
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  required
                  value={ticketForm.email}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Category *
                </label>
                <select
                  required
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                  className="form-input w-full"
                >
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="account">Account Management</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Subject *
                </label>
                <Input
                  type="text"
                  required
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of your issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Priority
                </label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="form-input w-full"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Description *
              </label>
              <textarea
                required
                rows={6}
                value={ticketForm.description}
                onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                className="form-input w-full"
                placeholder="Please provide detailed information about your issue, including any error messages, code samples, or steps to reproduce the problem."
              />
            </div>

            <Button
              type="submit"
              variant="primary"
            >
              Submit Support Ticket
            </Button>
          </form>
        </div>

        {/* Troubleshooting Guide */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-heading-3 mb-6">Quick Troubleshooting</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-text-primary mb-3">Common API Errors</h4>
              <div className="space-y-4">
                <div className="bg-surface-variant rounded-lg p-4">
                  <div className="font-medium text-red-700 mb-2">401 Unauthorized</div>
                  <p className="text-sm text-text-secondary mb-3">
                    Your API key is invalid or missing from the request.
                  </p>
                  <CodeBlock
                    language="bash"
                    code={`# Correct way to include API key
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.lankalocate.com/v1/provinces`}
                  />
                </div>

                <div className="bg-surface-variant rounded-lg p-4">
                  <div className="font-medium text-yellow-700 mb-2">429 Too Many Requests</div>
                  <p className="text-sm text-text-secondary mb-3">
                    You've exceeded your rate limit. Implement exponential backoff.
                  </p>
                  <CodeBlock
                    language="javascript"
                    code={`// Retry with exponential backoff
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function apiCallWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
      });
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || Math.pow(2, i);
        await delay(retryAfter * 1000);
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(Math.pow(2, i) * 1000);
    }
  }
}`}
                  />
                </div>

                <div className="bg-surface-variant rounded-lg p-4">
                  <div className="font-medium text-blue-700 mb-2">500 Internal Server Error</div>
                  <p className="text-sm text-text-secondary">
                    Temporary server issue. Wait a moment and retry your request. If the problem persists, contact support.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-text-primary mb-3">Performance Tips</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• Cache frequently accessed data like provinces and districts</li>
                <li>• Use appropriate pagination for large datasets</li>
                <li>• Implement request debouncing for search functionality</li>
                <li>• Monitor your API usage to stay within rate limits</li>
                <li>• Use compression (gzip) for large responses</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-heading-3 mb-6">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-text-primary mb-3">Technical Support</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg></span>
                  <a href="mailto:support@lankalocate.dev" className="text-primary-600 hover:text-primary-700">
                    support@lankalocate.dev
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg></span>
                  <span className="text-text-secondary">Response within 24 hours</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-text-primary mb-3">Business Inquiries</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg></span>
                  <a href="mailto:business@lankalocate.dev" className="text-primary-600 hover:text-primary-700">
                    business@lankalocate.dev
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9 2.5 2.5 0 000-5z" />
                  </svg></span>
                  <span className="text-text-secondary">Enterprise solutions & partnerships</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="text-sm text-text-secondary">
              <strong>Emergency Support:</strong> For critical production issues affecting your service, 
              mark your ticket as "Urgent" priority and include "PRODUCTION" in the subject line.
            </div>
          </div>
        </div>
      </div>
    </DocsSection>
  );
};