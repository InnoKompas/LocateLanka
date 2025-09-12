import { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  CreditCard, 
  Calendar, 
  Check, 
  Star, 
  Zap, 
  Shield,
  ArrowRight,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal, ModalFooter } from '../../components/ui/Modal';
import { getBillingInfo, getAvailablePlans, upgradePlan } from '../../services/dashboard.service';

interface PlanCardProps {
  plan: any;
  isCurrentPlan: boolean;
  onUpgrade: (planId: string) => void;
  isUpgrading: boolean;
}

function PlanCard({ plan, isCurrentPlan, onUpgrade, isUpgrading }: PlanCardProps) {
  const isPopular = plan.name === 'Pro';

  return (
    <Card 
      variant={isCurrentPlan ? 'elevated' : 'default'}
      className={`relative ${isPopular ? 'ring-2 ring-indigo-500' : ''}`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <Star size={12} className="mr-1" />
            Most Popular
          </span>
        </div>
      )}
      
      <CardContent className="pt-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {plan.name}
          </h3>
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${plan.price}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              /{plan.currency === 'USD' ? 'month' : plan.currency}
            </span>
          </div>
          
          {isCurrentPlan ? (
            <Button variant="outline" disabled className="w-full">
              Current Plan
            </Button>
          ) : plan.price === 0 ? (
            <Button variant="outline" disabled className="w-full">
              Downgrade Available
            </Button>
          ) : (
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => onUpgrade(plan.name.toLowerCase())}
              isLoading={isUpgrading}
            >
              Upgrade to {plan.name}
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">API Calls</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {plan.limits.apiCalls === -1 ? 'Unlimited' : plan.limits.apiCalls.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">API Keys</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {plan.limits.apiKeys}
            </span>
          </div>

          {plan.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-start space-x-2">
              <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function BillingPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const { data: billingInfo, isLoading: billingLoading } = useQuery(
    'billingInfo',
    getBillingInfo
  );

  const { data: availablePlans, isLoading: plansLoading } = useQuery(
    'availablePlans',
    getAvailablePlans
  );

  const handleUpgrade = async (planId: string) => {
    setSelectedPlan(planId);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const result = await upgradePlan(selectedPlan);
      // Redirect to checkout
      window.location.href = result.checkoutUrl;
    } catch (error) {
      console.error('Upgrade failed:', error);
      setIsUpgrading(false);
    }
  };

  if (billingLoading || plansLoading) {
    return (
      <div className="p-6 pt-4 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Billing & Subscription
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your subscription and billing information
          </p>
        </div>
        
        <Button variant="outline" leftIcon={<Download size={20} />}>
          Download Invoice
        </Button>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader 
          title="Current Subscription" 
          description="Your active plan and billing details"
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <CreditCard className="text-indigo-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Plan</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {billingInfo?.currentPlan || 'Free'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Calendar className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Next Billing</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {billingInfo?.nextBillingDate ? 
                    new Date(billingInfo.nextBillingDate).toLocaleDateString() : 
                    'N/A'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Zap className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${billingInfo?.amount || 0}/{billingInfo?.currency || 'month'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Shield className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {billingInfo?.paymentMethod || 'None'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Available Plans
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {availablePlans?.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              isCurrentPlan={plan.name === billingInfo?.currentPlan}
              onUpgrade={handleUpgrade}
              isUpgrading={isUpgrading && selectedPlan === plan.name.toLowerCase()}
            />
          ))}
        </div>
      </div>

      {/* Usage Comparison */}
      <Card>
        <CardHeader 
          title="Plan Comparison" 
          description="Compare features across different plans"
        />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Feature
                  </th>
                  {availablePlans?.map((plan) => (
                    <th key={plan.name} className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Monthly API Calls
                  </td>
                  {availablePlans?.map((plan) => (
                    <td key={plan.name} className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">
                      {plan.limits.apiCalls === -1 ? 'Unlimited' : plan.limits.apiCalls.toLocaleString()}
                    </td>
                  ))}
                </tr>
                
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    API Keys
                  </td>
                  {availablePlans?.map((plan) => (
                    <td key={plan.name} className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">
                      {plan.limits.apiKeys}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Support
                  </td>
                  {availablePlans?.map((plan) => (
                    <td key={plan.name} className="text-center py-3 px-4">
                      <Check className="text-green-500 mx-auto" size={16} />
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Analytics Dashboard
                  </td>
                  {availablePlans?.map((plan) => (
                    <td key={plan.name} className="text-center py-3 px-4">
                      <Check className="text-green-500 mx-auto" size={16} />
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Priority Support
                  </td>
                  {availablePlans?.map((plan, index) => (
                    <td key={plan.name} className="text-center py-3 px-4">
                      {index > 0 ? (
                        <Check className="text-green-500 mx-auto" size={16} />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Confirmation Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Confirm Plan Upgrade"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            You're about to upgrade to the <strong>{selectedPlan}</strong> plan. 
            You'll be redirected to our secure payment processor to complete the upgrade.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ArrowRight className="text-blue-600 mt-0.5" size={16} />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">What happens next:</p>
                <ul className="space-y-1">
                  <li>• Secure payment processing via Stripe</li>
                  <li>• Immediate access to new plan features</li>
                  <li>• Pro-rated billing for remaining period</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <ModalFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowUpgradeModal(false)}
            disabled={isUpgrading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={confirmUpgrade}
            isLoading={isUpgrading}
          >
            Continue to Payment
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
