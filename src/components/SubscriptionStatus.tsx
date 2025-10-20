import React, { useEffect, useState } from 'react';
import { Crown, User } from 'lucide-react';
import { getUserSubscription } from '../lib/stripe';
import { STRIPE_PRODUCTS } from '../stripe-config';

export const SubscriptionStatus: React.FC = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const sub = await getUserSubscription();
        setSubscription(sub);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 flex items-center">
        <User className="w-5 h-5 text-gray-500 mr-2" />
        <span className="text-gray-700">Free Plan</span>
      </div>
    );
  }

  const product = STRIPE_PRODUCTS.find(p => p.priceId === subscription.price_id);
  const planName = product?.name || 'Active Subscription';
  const isPersonalPlus = planName.includes('Personal+');

  return (
    <div className={`rounded-lg p-4 flex items-center ${
      isPersonalPlus ? 'bg-gradient-to-r from-purple-100 to-indigo-100' : 'bg-blue-50'
    }`}>
      <Crown className={`w-5 h-5 mr-2 ${
        isPersonalPlus ? 'text-purple-600' : 'text-blue-600'
      }`} />
      <span className={`font-medium ${
        isPersonalPlus ? 'text-purple-800' : 'text-blue-800'
      }`}>
        {planName}
      </span>
    </div>
  );
};