import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    priceMonthly: number;
    priceAnnually: number;
    features: string[];
    popular?: boolean;
  };
  isAnnual: boolean;
  onSelect: (planId: string) => void;
}

export function PricingCard({ plan, isAnnual, onSelect }: PricingCardProps) {
  const price = isAnnual ? plan.priceAnnually : plan.priceMonthly;
  
  return (
    <div
      className={cn(
        "relative rounded-2xl p-8 transition-all duration-300 hover:scale-105",
        plan.popular ? "border-2 border-primary" : "border border-border",
        plan.popular && "shadow-lg shadow-primary/20"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-primary px-3 py-2 text-center text-sm font-medium text-white">
          Most Popular
        </div>
      )}

      <div className="relative z-10">
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

        <div className="mt-6">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/{isAnnual ? 'year' : 'month'}</span>
          {isAnnual && (
            <span className="ml-2 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Save 20%
            </span>
          )}
        </div>

        <Button
          className="mt-8 w-full"
          variant={plan.popular ? 'default' : 'outline'}
          onClick={() => onSelect(plan.id)}
        >
          Get Started
        </Button>

        <ul className="mt-8 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <Check className="mr-3 h-5 w-5 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Gradient Background */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
    </div>
  );
} 