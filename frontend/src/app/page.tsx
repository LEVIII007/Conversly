import Navbar from "@/components/landing/navbar"
import Hero from "@/components/landing/hero"
import FeaturesSection from "@/components/landing/features"
import HowItWorks from "@/components/landing/how-it-works"
import PricingSection from "@/components/landing/pricing"
import QuestionsSection from "@/components/landing/questions"
import Footer from "@/components/landing/footer"
// import { TestimonialsSection }from "@/components/landing/testimonials"

import RelatedArticles from "@/components/landing/blogs"
import ScalabilitySection from "@/components/landing/scalability"

export default async function landingPage() {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <ScalabilitySection />
      <HowItWorks />
      <PricingSection />
      <RelatedArticles />
      <QuestionsSection />
      {/* <TestimonialsSection /> */}
      <Footer />
    </main>
  )
}