'use client';

import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: [
      'Create 1 chatbot',
      'Up to 100 messages/month',
      'Basic customization',
      'Community support',
    ],
    buttonText: 'Get Started',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$29',
    period: '/month',
    features: [
      'Unlimited chatbots',
      'Unlimited messages',
      'Advanced customization',
      'Priority support',
      'Custom branding',
      'API access',
      'Analytics dashboard',
    ],
    buttonText: 'Upgrade Now',
    popular: true,
  },
];

export default function SubscriptionPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Scale your AI chatbots with our flexible pricing options
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${
              plan.popular ? 'border-2 border-indigo-500' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-6 transform -translate-y-1/2">
                <div className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Popular
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="flex items-center justify-center">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-gray-600 dark:text-gray-300 ml-1">{plan.period}</span>
                )}
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-indigo-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full ${
                plan.popular ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}