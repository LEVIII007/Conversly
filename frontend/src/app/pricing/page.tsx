import { pricingPlans } from "@/lib/pricing-constants";
import UpperHeader from "@/components/upperHeader";
import HeroSection from "@/components/payment/payment-hero";
import PricingToggle from "@/components/payment/pricing-toggle";
import PricingCardsSection from "@/components/payment/card-section";
import Footer from "@/components/payment/footer";
import { Suspense } from "react";

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Pricing = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // Default to "monthly" if no plan is specified
  const { plan } = await searchParams ?? "monthly";
  const isAnnual = plan === "annual";

  return (
    <div className="font-sans bg-black relative">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-background to-transparent opacity-30" />
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(black,transparent_70%)]" />
      </div>

      <UpperHeader />

      {/* Hero / Heading Section */}
      <section id="pricingPlans" className="py-20 relative overflow-hidden">
        <HeroSection />

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="text-center mb-16 animate__animated animate__fadeIn">
            <h2 className="text-4xl font-bold mb-4 font-display">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400">
              Select the perfect plan for your business needs
            </p>

            <Suspense fallback={<div>Loading...</div>}>
              <PricingToggle isAnnual={isAnnual} />
            </Suspense>
          </div>

          {/* Pricing Cards Section */}
          <PricingCardsSection isAnnual={isAnnual} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
