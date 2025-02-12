// pricing-constant.ts

export const pricingPlans = [
    {
      id: '4', // Plan ID
      name: 'Basic Plan',
      description: 'Ideal for small teams just getting started.',
      priceMonthly: 4.9,
      priceAnnually: 49.99,
      popular: false,
      features: [
        "Up to 500 messages per month",
        "Basic AI customization",
        "Standard support",
        "Community access",
      ],
    },
    {
      id: '5', // Plan ID
      name: 'Pro Plan',
      description: 'Perfect for growing teams with more advanced needs.',
      priceMonthly: 49.99,
      priceAnnually: 499.99,
      features: [
        "Up to 10,000 messages per month",
        "Advanced AI customization",
        "Priority support",
        "API access",
        "Custom branding",
        "Analytics dashboard",
      ],
      popular: true, // This plan will be highlighted on the page
    },
    {
      id: '6', // Plan ID
      name: 'Enterprise Plan',
      description: 'Best for large teams and enterprises with complex needs.',
      priceMonthly: 'Custom',
      priceAnnually: 'Custom',
      features: [
        "Unlimited messages",
        "Full AI customization",
        "24/7 dedicated support",
        "Custom integrations",
        "Advanced analytics",
        "SLA guarantee",
        "Custom training",
      ],
      popular: false,
    },
  ];
  