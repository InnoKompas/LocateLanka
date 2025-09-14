import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Shield, Clock, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export const CTASection = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      text: 'Start in 30 seconds'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: 'No credit card required'
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: '1,000 free requests/month'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      text: 'Cancel anytime'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <motion.h2 
            className="text-display-2 font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Start building with LankaLocate today
          </motion.h2>
          
          <motion.p 
            className="text-body-xl text-indigo-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of developers who trust LankaLocate for accurate Sri Lankan location data. 
            Get started with our free plan and scale as you grow. No hidden fees, no surprises.
          </motion.p>

          {/* Benefits */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-indigo-100">
                <div className="flex-shrink-0 text-white">
                  {benefit.icon}
                </div>
                <span className="text-sm font-medium">{benefit.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {!isLoading && (
              user ? (
                // Authenticated user - show dashboard button
                <Button 
                  size="lg" 
                  variant="secondary" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-white text-indigo-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                </Button>
              ) : (
                // Unauthenticated user - show sign up button
                <Link to="/signup">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="bg-white text-indigo-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>Sign Up Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              )
            )}
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              View Live Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-indigo-200 text-sm mb-4">
              Already trusted by 500+ companies across Sri Lanka
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-70">
              <div className="text-xs text-indigo-200">DeliveryLK</div>
              <div className="w-1 h-1 bg-indigo-300 rounded-full"></div>
              <div className="text-xs text-indigo-200">GovTech</div>
              <div className="w-1 h-1 bg-indigo-300 rounded-full"></div>
              <div className="text-xs text-indigo-200">FormBuilder</div>
              <div className="w-1 h-1 bg-indigo-300 rounded-full"></div>
              <div className="text-xs text-indigo-200">Lanka Express</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
