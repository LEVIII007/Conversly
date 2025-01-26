import Navbar from "@/components/landing/navbar"
import Hero from "@/components/landing/hero"
import FeaturesSection from "@/components/landing/features"
import HowItWorks from "@/components/landing/how-it-works"
import PricingSection from "@/components/landing/pricing"
import QuestionsSection from "@/components/landing/questions"
import Footer from "@/components/landing/footer"
import { TestimonialsSection }from "@/components/landing/testimonials"

export default function landingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <QuestionsSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}




// "use client";
// import { Bot, Upload, Code, Settings, ArrowRight, MessageSquare, Zap, Shield, Globe } from 'lucide-react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useEffect } from 'react';
// import { BackgroundLines } from "@/components/ui/background-lines";
// import { Button } from "@/components/ui/button";
// import { BackgroundGradient } from "@/components/ui/background-grad";
// import Header from '@/components/Header';
// import { useRouter } from 'next/navigation';


// const features = [
//   {
//     title: 'Website Chatbots',
//     description: 'Train your chatbot on your website\'s content for instant, accurate responses.',
//     icon: Globe,
//   },
//   {
//     title: 'Document-Based Chatbots',
//     description: 'Upload PDFs and files to create knowledgeable AI assistants.',
//     icon: Upload,
//   },
//   {
//     title: 'Customizable AI',
//     description: 'Set tone, personality, and system prompts to match your brand.',
//     icon: Settings,
//   },
//   {
//     title: 'Easy Embedding',
//     description: 'Integrate chatbots on your website with just a few lines of code.',
//     icon: Code,
//   },
// ];

// const steps = [
//   {
//     title: 'Input Data',
//     description: 'Add your website URL or upload documents to train your chatbot.',
//     icon: Upload,
//   },
//   {
//     title: 'Customize',
//     description: 'Adjust settings, tone, and behavior to match your needs.',
//     icon: Settings,
//   },
//   {
//     title: 'Deploy',
//     description: 'Embed your chatbot with a simple code snippet.',
//     icon: Zap,
//   },
// ];

// const testimonials = [
//   {
//     quote: "The chatbot has transformed our customer support. It handles 80% of queries automatically!",
//     author: "Sarah Chen",
//     role: "Head of Support, TechCorp",
//     image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
//   },
//   {
//     quote: "Setup was incredibly easy. Our documentation is now interactive and accessible 24/7.",
//     author: "Michael Rodriguez",
//     role: "CTO, DevFlow",
//     image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
//   },
// ];

// const plans = [
//   {
//     name: 'Free',
//     price: '$0',
//     period: '/month',
//     features: [
//       '1 Chatbot',
//       '1,000 messages/month',
//       'Basic customization',
//       'Community support',
//       'limited Data Sources',
//       'Limited Embedding',
//     ],
//     cta: 'Get Started',
//     popular: false,
//   },
//   {
//     name: 'Pro',
//     price: '$29',
//     period: '/month',
//     features: [
//       'Unlimited chatbots',
//       'Unlimited messages',
//       'Advanced customization',
//       'Priority support',
//       'Custom branding',
//       'Analytics dashboard',
//     ],
//     cta: 'Start Free Trial',
//     popular: true,
//   },
//   {
//     name: 'Enterprise',
//     price: 'Custom',
//     features: [
//       'Everything in Pro',
//       'Custom integrations',
//       'Dedicated support',
//       'SLA guarantee',
//       'Custom AI training',
//       'Unlimited Data Sources',
//     ],
//     cta: 'Contact Sales',
//     popular: false,
//   },
// ];

// const faqs = [
//   {
//     question: 'How do I integrate my chatbot on my website?',
//     answer: 'Simply copy the embed code from your dashboard and paste it into your website\'s HTML. The chatbot will appear automatically!',
//   },
//   {
//     question: 'What types of documents can I use for training?',
//     answer: 'We support PDFs, Word documents, text files, and more. You can also train your chatbot directly on your website content.',
//   },
//   {
//     question: 'How accurate are the responses?',
//     answer: 'Our AI is trained on your specific content, ensuring highly accurate and relevant responses. You can also customize the behavior and tone.',
//   },
//   {
//     question: 'Is my data secure?',
//     answer: 'Yes! We use enterprise-grade encryption and never share your data. Your content is used exclusively for training your chatbot.',
//   },
//   {
//     question: 'Can I customize the chatbot\'s appearance?',
//     answer: 'Absolutely! You can customize colors, fonts, and the overall design to match your brand identity.',
//   },
// ];

// export default function Home() {
//   const router = useRouter();
//   useEffect(() => {
//     // Initialize chat widget
//     const script = document.createElement('script');
//     script.src = '/widget/chat.js'; // We'll need to build and serve this
//     script.async = true;
//     script.onload = () => {
//       // @ts-ignore
//       if (window.DocsBotAI) {
//         // @ts-ignore
//         window.DocsBotAI.init({
//           botId: 'test-bot-id',
//           color: '#569CCE', 
//           title: 'Conversly AI',
//           welcomeMessage: 'Hi! How can I help you today? 👋',
//           buttonAlign: 'right',
//           buttonText: 'Chat with AI'
//         });
//       }
//     };
//     document.head.appendChild(script);

//     return () => {
//       document.head.removeChild(script);
//     };
//   }, []);

//   return (
//     <div>
//       <Header />
//     <div className="space-y-32 pb-20">
//       {/* Hero Section */}
//       <BackgroundLines className="flex items-center justify-center min-h-[90vh] relative">
//         <div className="flex flex-col items-center justify-center space-y-12 px-4">
//           <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 text-4xl md:text-6xl lg:text-8xl font-sans relative z-20 font-bold tracking-tight">
//             Conversly AI <br />
//             <span className="text-3xl md:text-5xl lg:text-7xl">
//               Smart Conversations at Scale
//             </span>
//           </h1>
          
//           <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-700 dark:text-neutral-300 text-center leading-relaxed">
//             Transform your website into an intelligent assistant. Train AI on your content 
//             and let it handle customer queries with precision and personality.
//           </p>

//           <div className="flex gap-6 items-center">
//             <Button 
//               asChild
//               size="lg" 
//               className="h-16 px-8 text-lg font-semibold rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               <Link href="/create">
//                 Get Started Free
//                 <ArrowRight className="ml-2 h-5 w-5" />
//               </Link>
//             </Button>

//             <Button 
//               variant="outline" 
//               size="lg"
//               className="h-16 px-8 text-lg font-semibold rounded-full border-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
//             >
//               View Demo
//             </Button>
//           </div>

//           {/* Optional: Add social proof */}
//           <div className="flex flex-col items-center space-y-4 mt-12">
//             <p className="text-sm text-neutral-600 dark:text-neutral-400">
//               Trusted by innovative teams worldwide
//             </p>
//             <div className="flex gap-8 opacity-50">
//               {/* Add some company logos here */}
//             </div>
//           </div>
//         </div>
//       </BackgroundLines>

//       {/* Features Section */}
//       <section id="features" className="scroll-mt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold">Features</h2>
//             <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
//               Everything you need to create intelligent chatbots
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {features.map((feature, index) => (
//               <div
//                 key={index}
//                 className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
//               >
//                 <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
//                   <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
//                 <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-bold mb-4">How It Works</h2>
//           <p className="text-xl text-gray-600 dark:text-gray-300">
//             Create your chatbot in three simple steps
//           </p>
//         </div>
//         <div className="grid md:grid-cols-3 gap-8">
//           {steps.map((step, index) => (
//             <div key={index} className="relative">
//               {index < steps.length - 1 && (
//                 <ArrowRight className="absolute top-1/2 -right-4 w-8 h-8 text-gray-300 dark:text-gray-600 hidden md:block" />
//               )}
//               <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
//                 <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <step.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
//                 <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
//           <p className="text-xl text-gray-600 dark:text-gray-300">
//             Join thousands of satisfied customers
//           </p>
//         </div>
//         <div className="grid md:grid-cols-2 gap-8">
//           {testimonials.map((testimonial, index) => (
//             <div
//               key={index}
//               className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
//             >
//               <div className="flex items-center mb-6">
//                 <Image
//                   src={testimonial.image}
//                   alt={testimonial.author}
//                   width={48}
//                   height={48}
//                   className="rounded-full"
//                 />
//                 <div className="ml-4">
//                   <h4 className="font-semibold">{testimonial.author}</h4>
//                   <p className="text-gray-600 dark:text-gray-300">{testimonial.role}</p>
//                 </div>
//               </div>
//               <p className="text-lg italic">"{testimonial.quote}"</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Pricing Section */}
//       <section id="pricing" className="scroll-mt-20 py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Pricing</h2>
//           <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
//             Choose the perfect plan for your needs
//           </p>
//         </div>
//         <div className="grid md:grid-cols-3 gap-8">
//           {plans.map((plan, index) => (
//             <BackgroundGradient
//               key={index}
//               className={`rounded-[22px] p-8 bg-white dark:bg-zinc-900 ${
//                 plan.popular ? 'ring-2 ring-indigo-500' : ''
//               }`}
//               containerClassName="h-full"
//             >
//               {plan.popular && (
//                 <div className="absolute top-0 right-6 transform -translate-y-1/2">
//                   <div className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                     Popular
//                   </div>
//                 </div>
//               )}
//               <div className="text-center mb-8">
//                 <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
//                 <div className="flex items-center justify-center">
//                   <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
//                   {plan.period && (
//                     <span className="text-gray-600 dark:text-gray-300 ml-1">{plan.period}</span>
//                   )}
//                 </div>
//               </div>
//               <ul className="space-y-4 mb-8">
//                 {plan.features.map((feature, featureIndex) => (
//                   <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
//                     <Shield className="h-5 w-5 text-indigo-500 mr-2" />
//                     <span>{feature}</span>
//                   </li>
//                 ))}
//               </ul>
//                 <button
//                   onClick={() => router.push('/pricing')}
//                   className={`w-full rounded-full pl-4 pr-1 py-3 text-white flex items-center justify-center space-x-1 ${
//                     plan.popular ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-800 hover:bg-gray-900'
//                   } transition-colors duration-200 text-sm font-bold`}
//                 >
//                   <span>{plan.cta}</span>
//                 </button>
//             </BackgroundGradient>
//           ))}
//         </div>
//       </div>
//     </section>

//       {/* FAQ Section */}
//       <section id="faq" className="scroll-mt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
//             <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
//               Find answers to common questions
//             </p>
//           </div>
//           <div className="space-y-4">
//             {faqs.map((faq, index) => (
//               <details
//                 key={index}
//                 className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg"
//               >
//                 <summary className="flex justify-between items-center cursor-pointer p-6">
//                   <h3 className="text-lg font-semibold">{faq.question}</h3>
//                   <MessageSquare className="h-5 w-5 text-indigo-500 transform group-open:rotate-180 transition-transform" />
//                 </summary>
//                 <div className="px-6 pb-6">
//                   <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
//                 </div>
//               </details>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="relative">
//         <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-indigo-900" />
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//           <div className="text-center space-y-8">
//             <h2 className="text-4xl font-bold">Start Building Your Chatbot Today!</h2>
//             <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//               Join thousands of businesses using our AI chatbots to improve customer experience
//             </p>
//             <Link href="/create" className="btn-primary text-lg px-8 py-4 inline-block">
//               Get Started for Free
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-gray-200 dark:border-gray-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid md:grid-cols-4 gap-8">
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Conversly AI</h3>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Building the future of customer interaction with AI
//               </p>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4">Product</h4>
//               <ul className="space-y-2">
//                 <li><Link href="/features" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500">Features</Link></li>
//                 <li><Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500">Pricing</Link></li>
//                 <li><Link href="/docs" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500">Documentation</Link></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4">Company</h4>
//               <ul className="space-y-2">
//                 <li><Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500">About</Link></li>
//                 <li><Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500">Blog</Link></li>
//                 <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500">Contact</Link></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4">Legal</h4>
//               <ul className="space-y-2">
//                 <li><Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500">Privacy Policy</Link></li>
//                 <li><Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500">Terms of Service</Link></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-600 dark:text-gray-300">
//             <p>© 2024 Conversly AI. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//     </div>
//   );
// }