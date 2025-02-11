// import React from "react";

// const Scalability = () => {
//     const colorMap: { [key: string]: string } = {
//         green: "text-green-400 bg-green-400",
//         blue: "text-blue-400 bg-blue-400",
//         purple: "text-purple-400 bg-purple-400",
//       };
//   return (
//     <section id="scalability" className="bg-neutral-900 py-20 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16 animate__animated animate__fadeIn">
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">
//             Scalability for Growing Businesses
//           </h2>
//           <p className="text-xl text-gray-400 max-w-3xl mx-auto">
//             Handle unlimited conversations without compromising quality
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-12 gap-8">
//           {/* Scalability Metrics */}
//           <div className="lg:col-span-7 animate__animated animate__fadeInLeft">
//             <div className="bg-neutral-800 rounded-xl p-8">
//               <h3 className="text-2xl font-semibold mb-6">Concurrent Chat Handling</h3>
//               <div className="space-y-6">
//                 {[
//                   { label: "100 Chats", color: "green", width: "100%" },
//                   { label: "10,000 Chats", color: "blue", width: "100%" },
//                   { label: "100,000 Chats", color: "purple", width: "100%" },
//                 ].map(({ label, color, width }) => (
//                   <div key={label}>
//                     <div className="flex justify-between mb-2">
//                       <span>{label}</span>
//                       <span className={`text-${color}-400`}>100% Performance</span>
//                     </div>
//                     <div className="h-3 bg-neutral-700 rounded-full">
//                     <div className={`h-3 rounded-full ${colorMap[color]}`} style={{ width }}></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Performance Metrics */}
//               <div className="grid grid-cols-3 gap-4 text-center mt-8">
//                 {[
//                   { value: "0.1s", label: "Response Time", color: "green" },
//                   { value: "99.9%", label: "Uptime", color: "blue" },
//                   { value: "∞", label: "Scalability", color: "purple" },
//                 ].map(({ value, label, color }) => (
//                   <div key={label} className="bg-neutral-700 p-4 rounded-lg">
//                     <div className={`text-3xl font-bold text-${color}-400 mb-2`}>{value}</div>
//                     <div className="text-sm text-gray-400">{label}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Features */}
//           <div className="lg:col-span-5 space-y-6 animate__animated animate__fadeInRight">
//             {[
//               { icon: "⚡", title: "Elastic Infrastructure", text: "Automatically scales resources based on demand", color: "blue" },
//               { icon: "🔄", title: "Load Balancing", text: "Intelligent distribution of chat traffic", color: "green" },
//               { icon: "📊", title: "Real-time Monitoring", text: "Advanced analytics and performance tracking", color: "purple" },
//               { icon: "🛡️", title: "Enterprise Security", text: "Advanced encryption and data protection", color: "yellow" },
//             ].map(({ icon, title, text, color }) => (
//               <div key={title} className="bg-neutral-800 p-6 rounded-xl flex items-start gap-4">
//                 <div className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
//                   <span className="text-2xl">{icon}</span>
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">{title}</h3>
//                   <p className="text-gray-400">{text}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Call to Action */}
//         <div className="mt-16 text-center animate__animated animate__fadeIn">
//           <a
//             href="#callToAction"
//             className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-neutral-900 bg-white hover:bg-gray-100 transition-colors"
//           >
//             Scale Your Business Today
//             <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//             </svg>
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Scalability;
