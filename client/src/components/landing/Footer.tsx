import { MapPin, Github, Twitter, Linkedin, Mail, Phone, MapIcon, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { name: 'Documentation', href: '#', isExternal: false },
    { name: 'API Reference', href: '#', isExternal: true },
    { name: 'SDKs & Libraries', href: '#', isExternal: true },
    { name: 'Pricing', href: '#pricing', isExternal: false },
    { name: 'Status Page', href: '#', isExternal: true },
    { name: 'Changelog', href: '#', isExternal: true }
  ];

  const companyLinks = [
    { name: 'About Us', href: '#', isExternal: false },
    { name: 'Blog', href: '#', isExternal: true },
    { name: 'Careers', href: '#', isExternal: false },
    { name: 'Press Kit', href: '#', isExternal: false },
    { name: 'Partners', href: '#', isExternal: false }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '#', isExternal: true },
    { name: 'Contact Support', href: '#contact', isExternal: false },
    { name: 'Community Forum', href: '#', isExternal: true },
    { name: 'Feature Requests', href: '#', isExternal: true },
    { name: 'Bug Reports', href: '#', isExternal: true }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#', isExternal: false },
    { name: 'Terms of Service', href: '#', isExternal: false },
    { name: 'Cookie Policy', href: '#', isExternal: false },
    { name: 'Data Processing', href: '#', isExternal: false },
    { name: 'Compliance', href: '#', isExternal: false }
  ];

  const socialLinks = [
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin }
  ];

  return (
    <footer id="contact" className="bg-surface border-t border-border">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <MapPin className="text-white text-xl" />
                </div>
                <span className="text-heading-2 font-bold text-text-primary">
                  LankaLocate
                </span>
              </div>
              
              <p className="text-body-sm text-text-secondary mb-6 max-w-md leading-relaxed">
                LankaLocate is the most accurate and comprehensive Sri Lankan GN division data API. 
                Powering location-based applications for developers and businesses worldwide with 
                reliable, up-to-date geographic data.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-body-sm text-text-secondary">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a href="mailto:support@lankalocate.lk" className="hover:text-text-primary transition-colors">
                    support@lankalocate.lk
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-body-sm text-text-secondary">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a href="tel:+94112345678" className="hover:text-text-primary transition-colors">
                    +94 11 234 5678
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-body-sm text-text-secondary">
                  <MapIcon className="w-4 h-4 flex-shrink-0" />
                  <span>Colombo, Sri Lanka</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 bg-surface-variant hover:bg-indigo-600 rounded-lg flex items-center justify-center text-text-secondary hover:text-white transition-all duration-300 group"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-heading-3 font-semibold text-text-primary mb-6">
                Product
              </h4>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-body-sm text-text-secondary hover:text-text-primary transition-colors flex items-center group"
                    >
                      {link.name}
                      {link.isExternal && (
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-heading-3 font-semibold text-text-primary mb-6">
                Company
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-body-sm text-text-secondary hover:text-text-primary transition-colors flex items-center group"
                    >
                      {link.name}
                      {link.isExternal && (
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-heading-3 font-semibold text-text-primary mb-6">
                Support
              </h4>
              <ul className="space-y-3 mb-8">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-body-sm text-text-secondary hover:text-text-primary transition-colors flex items-center group"
                    >
                      {link.name}
                      {link.isExternal && (
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Legal Links */}
              <h4 className="text-heading-3 font-semibold text-text-primary mb-6">
                Legal
              </h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-body-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-heading-3 font-semibold text-text-primary mb-2">
                Stay updated
              </h4>
              <p className="text-body-sm text-text-secondary">
                Get the latest updates, feature announcements, and developer tips.
              </p>
            </div>
            <div className="flex space-x-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-surface border border-border rounded-lg text-body-sm text-text-primary placeholder-text-secondary focus:border-indigo-600 focus:outline-none transition-colors"
              />
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-body-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-body-sm text-text-secondary mb-4 md:mb-0">
              © {currentYear} LankaLocate. All rights reserved. Made with ❤️ in Sri Lanka.
            </p>
            <div className="flex items-center space-x-6 text-body-sm text-text-secondary">
              <span>🇱🇰 Proudly Sri Lankan</span>
              <span>•</span>
              <span>99.9% Uptime</span>
              <span>•</span>
              <span>10M+ API Calls</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
