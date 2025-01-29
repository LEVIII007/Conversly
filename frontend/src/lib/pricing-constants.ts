// pricing-constant.ts

export const pricingPlans = [
    {
      id: '4', // Plan ID
      name: 'Basic Plan',
      description: 'Ideal for small teams just getting started.',
      priceMonthly: 149.99,
      priceAnnually: 1499.99,
      features: [
        '3 Chatbots',
        'Basic Analytics',
        'Email Support',
        '100k Messages/month',
        'Standard Integrations'
      ],
      popular: false,
    },
    {
      id: '5', // Plan ID
      name: 'Pro Plan',
      description: 'Perfect for growing teams with more advanced needs.',
      priceMonthly: 499.99,
      priceAnnually: 4999.99,
      features: [
        '10 Chatbots',
        'Advanced Analytics',
        'Priority Support',
        '500k Messages/month',
        'All Integrations',
        'Custom Branding'
      ],
      popular: true, // This plan will be highlighted on the page
    },
    {
      id: '6', // Plan ID
      name: 'Premium Plan',
      description: 'Best for large teams and enterprises with complex needs.',
      priceMonthly: 999.99,
      priceAnnually: 9999.99,
      features: [
        'Unlimited Chatbots',
        'Enterprise Analytics',
        '24/7 Support',
        'Unlimited Messages',
        'Custom Integrations',
        'Dedicated Account Manager'
      ],
      popular: false,
    },
  ];
  