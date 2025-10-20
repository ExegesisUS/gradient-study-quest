import React, { useEffect, useState } from 'react';
import { CircleCheck as CheckCircle, ArrowRight, Crown } from 'lucide-react';
import { getUserSubscription } from '../lib/stripe';
import { STRIPE_PRODUCTS } from '../stripe-config';

export const SuccessPage: React.FC = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        // Wait a moment for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
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

  const product = subscription ? STRIPE_PRODUCTS.find(p => p.priceId === subscription.price_id) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to ADA Education!
            </h1>
            <p className="text-xl text-gray-600">
              Your payment was successful and your subscription is now active.
            </p>
          </div>

          {loading ? (
            <div className="bg-gray-100 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          ) : subscription && product ? (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center mb-2">
                <Crown className="w-6 h-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-indigo-900">
                  {product.name}
                </h2>
              </div>
              <p className="text-indigo-700">
                You now have access to all the features included in your plan.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <p className="text-blue-800">
                Your subscription is being activated. You'll receive a confirmation email shortly.
              </p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span>Access to all learning tools</span>
            </div>
            <div className="flex items-center justify-center text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span>Progress tracking enabled</span>
            </div>
            <div className="flex items-center justify-center text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span>Flashcards and study materials</span>
            </div>
            {product?.name.includes('Personal+') && (
              <>
                <div className="flex items-center justify-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Advanced premium features</span>
                </div>
                <div className="flex items-center justify-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Extra mini-games unlocked</span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => window.location.href = '/'}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-200 flex items-center justify-center mx-auto"
          >
            Start Learning
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>

          <div className="mt-8 text-sm text-gray-500">
            <p>
              Questions? Contact our support team at{' '}
              <a href="mailto:support@adaeducation.com" className="text-indigo-600 hover:text-indigo-700">
                support@adaeducation.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};