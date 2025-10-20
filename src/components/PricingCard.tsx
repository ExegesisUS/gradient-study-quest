import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { StripeProduct } from '../stripe-config';
import { createCheckoutSession } from '../lib/stripe';

interface PricingCardProps {
  product: StripeProduct;
  isPopular?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({ product, isPopular }) => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      await createCheckoutSession(product.priceId);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isYearly = product.name.includes('Yearly');
  const isPersonalPlus = product.name.includes('Personal+');

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
      isPopular ? 'border-indigo-500 scale-105' : 'border-gray-200 hover:border-indigo-300'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {isPersonalPlus ? 'Personal+' : 'Personal'}
          </h3>
          <div className="flex items-baseline justify-center mb-2">
            <span className="text-5xl font-bold text-gray-900">${product.price}</span>
            <span className="text-gray-500 ml-1">/{isYearly ? 'year' : 'month'}</span>
          </div>
          {isYearly && (
            <div className="text-green-600 font-medium text-sm">
              Save {isPersonalPlus ? '$20' : '$12'} annually
            </div>
          )}
        </div>

        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          {product.description}
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700">Core learning tools</span>
          </div>
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700">Flashcards & study materials</span>
          </div>
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700">Progress tracking</span>
          </div>
          {isPersonalPlus && (
            <>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Advanced features</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Extra mini-games</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Premium study tools</span>
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
            isPopular
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Get Started'
          )}
        </button>
      </div>
    </div>
  );
};