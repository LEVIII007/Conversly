// "use client";

// import { useTheme } from "next-themes";

// const trustSignals = [
//   {
//     title: "Bank-Level Security",
//     description: "Enterprise-grade encryption and data protection",
//     iconColor: "text-blue-600 dark:text-blue-400",
//     bgColor: "bg-blue-100 dark:bg-blue-900",
//     iconPath:
//       "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
//   },
//   {
//     title: "99.9% Uptime",
//     description: "Reliable service you can count on 24/7",
//     iconColor: "text-green-600 dark:text-green-400",
//     bgColor: "bg-green-100 dark:bg-green-900",
//     iconPath:
//       "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
//   },
//   {
//     title: "5,000+ Businesses",
//     description: "Trust us with their customer support",
//     iconColor: "text-purple-600 dark:text-purple-400",
//     bgColor: "bg-purple-100 dark:bg-purple-900",
//     iconPath:
//       "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5",
//   },
// ];

// const benefits = [
//   "24/7 AI-Powered Support – Never miss a customer inquiry again!",
//   "Instant Setup – No Coding Needed! Get up and running in minutes.",
//   "Risk-Free Trial – Try for free, upgrade when you're ready.",
// ];

// export default function TrustSignals() {
//   const { theme } = useTheme();

//   return (
//     <section
//       id="trustSignals"
//       className="
//         py-20 relative overflow-hidden font-sans 
//         bg-background
//       "
//     >
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-10">
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
//             backgroundSize: "32px 32px",
//           }}
//         />
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         <div className="text-center mb-16 animate__animated animate__fadeIn">
//           <h2
//             className="
//               text-3xl font-bold text-foreground 
//               font-heading
//             "
//           >
//             Why Trust Conversly.ai?
//           </h2>
//           <p className="mt-4 text-xl text-muted-foreground font-sans">
//             Join thousands of businesses that trust us with their customer
//             interactions
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           {trustSignals.map((signal, index) => (
//             <div
//               key={index}
//               className="
//                 text-center p-6 bg-card rounded-xl 
//                 shadow-sm animate__animated animate__fadeInUp
//               "
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <div className={`inline-block p-4 ${signal.bgColor} rounded-full mb-4`}>
//                 <svg
//                   className={`w-8 h-8 ${signal.iconColor}`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d={signal.iconPath}
//                   />
//                 </svg>
//               </div>
//               <h3
//                 className="
//                   text-xl font-bold mb-2 text-foreground 
//                   font-heading
//                 "
//               >
//                 {signal.title}
//               </h3>
//               <p className="text-muted-foreground">{signal.description}</p>
//             </div>
//           ))}
//         </div>

//         <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 animate__animated animate__fadeIn">
//           <div className="text-center mb-8">
//             <h3
//               className="
//                 text-2xl font-bold mb-4 
//                 font-heading
//               "
//             >
//               Still Thinking? Here's Why You Should Join Conversly.ai Today!
//             </h3>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {benefits.map((benefit, index) => (
//               <div key={index} className="flex items-start">
//                 <svg
//                   className="w-6 h-6 text-green-400 mt-1 flex-shrink-0"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//                 <p className="ml-3 text-primary-foreground">{benefit}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Abstract shapes */}
//       <div className="absolute top-1/2 -left-16 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//       <div className="absolute top-1/2 -right-16 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//     </section>
//   );
// }



// for future when i have real things to write in it
