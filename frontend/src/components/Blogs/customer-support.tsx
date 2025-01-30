// import { motion } from "framer-motion";

// const CustomerSupport = () => {
//   return (
//     <section id="customerSupport" className="bg-neutral-900 py-20 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid md:grid-cols-2 gap-12 items-center">
//           <motion.div 
//             className="animate__animated animate__fadeInLeft"
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <h2 className="text-3xl md:text-4xl font-bold mb-6">
//               24/7 Customer Support
//               <span className="block text-blue-400 mt-2">Always Online, Always Ready</span>
//             </h2>
            
//             <div className="space-y-6">
//               <SupportFeature icon="⚡" title="Instant Response Time" desc="No more waiting. Get immediate responses to customer queries at any time of day or night." color="bg-blue-500" />
//               <SupportFeature icon="🤖" title="Automated Query Resolution" desc="Handle common customer queries automatically, reducing the load on your human support team." color="bg-green-500" />
//               <SupportFeature icon="🎯" title="Consistent Service Quality" desc="Maintain high service standards with AI-powered responses that are always accurate and on-brand." color="bg-purple-500" />
//             </div>

//             <div className="mt-8">
//               <div className="inline-flex items-center p-1 bg-neutral-800 rounded-full">
//                 <div className="px-4 py-2">
//                   <span className="text-blue-400 font-medium">Reduce Response Time by 90%</span>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div 
//             className="animate__animated animate__fadeInRight"
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <ChatInterface />
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// const SupportFeature = ({ icon, title, desc, color }) => (
//   <div className="flex items-start space-x-4">
//     <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
//       <span className="text-xl">{icon}</span>
//     </div>
//     <div>
//       <h3 className="text-xl font-semibold mb-2">{title}</h3>
//       <p className="text-gray-400">{desc}</p>
//     </div>
//   </div>
// );

// const ChatInterface = () => (
//   <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 shadow-lg">
//     <div className="space-y-4">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
//           <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
//           <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//         </div>
//         <div className="text-sm text-gray-400">Live Chat</div>
//       </div>

//       <div className="chat-messages space-y-4">
//         <ChatMessage sender="🤖" message="Hello! How can I help you today?" isUser={false} />
//         <ChatMessage sender="👤" message="I need help tracking my order #12345" isUser={true} />
//         <ChatMessage sender="🤖" message="I've found your order. It's currently out for delivery and will arrive today between 2-4 PM." isUser={false} />
//       </div>

//       <div className="mt-4 flex gap-2">
//         <input type="text" placeholder="Type your message..." className="flex-1 bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
//         <button className="bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2 transition-colors">
//           Send
//         </button>
//       </div>
//     </div>
//   </div>
// );

// const ChatMessage = ({ sender, message, isUser }) => (
//   <div className={`flex gap-4 ${isUser ? 'justify-end' : ''}`}>
//     {!isUser && <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"><span className="text-sm">{sender}</span></div>}
//     <div className={`flex-1 ${isUser ? 'bg-blue-500' : 'bg-neutral-700'} p-4 rounded-lg`}>
//       <p className="text-sm">{message}</p>
//     </div>
//     {isUser && <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center"><span className="text-sm">{sender}</span></div>}
//   </div>
// );

// export default CustomerSupport;
