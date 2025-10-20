import React from 'react';
import { PricingCard } from '../components/PricingCard';
import { STRIPE_PRODUCTS } from '../stripe-config';

export const PricingPage: React.FC = () => {
  const monthlyPlans = STRIPE_PRODUCTS.filter(p => p.name.includes('Monthly'));
  const yearlyPlans = STRIPE_PRODUCTS.filter(p => p.name.includes('Yearly'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Choose Your Learning Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Unlock your potential with ADA Education. Choose from our flexible plans 
            designed to fit your learning journey and budget.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Annual Plans - Best Value
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {yearlyPlans.map((product, index) => (
              <PricingCard
                key={product.priceId}
                product={product}
                isPopular={index === 1}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Monthly Plans
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {monthlyPlans.map((product) => (
              <PricingCard
                key={product.priceId}
                product={product}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Not sure which plan is right for you?
            </h3>
            <p className="text-gray-600 mb-6">
              Start with our Personal plan and upgrade anytime. All plans include 
              our core learning tools and progress tracking.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span>✓ Cancel anytime</span>
              <span>✓ Secure payments</span>
              <span>✓ Instant access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};