import { motion } from "framer-motion";

const LeadGeneration = () => {
  return (
    <section id="leadGeneration" className="bg-neutral-900 py-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Lead Generation & Sales Automation
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transform prospects into customers with AI-powered sales automation
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-neutral-800 rounded-xl p-6 h-full">
              <h3 className="text-2xl font-semibold mb-6">Conversion Funnel</h3>
              <Funnel />
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <Metric title="Conversion Rate" value="+40%" color="green-400" desc="Increased conversion rates through automated lead nurturing" />
              <Metric title="Lead Response Time" value="-80%" color="blue-400" desc="Faster response times to qualify and engage leads" />
              <FeatureList />
              <Analytics />
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <a href="#callToAction" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-neutral-900 bg-white hover:bg-gray-100 transition-colors">
            Start Generating Leads
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const Funnel = () => (
  <div className="space-y-6">
    {[
      { label: "Awareness", width: "100%", color: "bg-blue-500/20" },
      { label: "Interest", width: "80%", color: "bg-blue-500/40" },
      { label: "Consideration", width: "60%", color: "bg-blue-500/60" },
      { label: "Action", width: "40%", color: "bg-blue-500/80" },
      { label: "Conversion", width: "20%", color: "bg-blue-500" },
    ].map(({ label, width, color }, index) => (
      <div key={index} className={`mx-auto h-16 ${color} flex items-center justify-center rounded-lg`} style={{ width }}>
        <span className="font-semibold">{label}</span>
      </div>
    ))}
  </div>
);

interface MetricProps {
  title: string;
  value: string;
  color: string;
  desc: string;
}

const Metric = ({ title, value, color, desc }: MetricProps) => (
  <div className="bg-neutral-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <span className={`text-${color} text-2xl font-bold`}>{value}</span>
    </div>
    <p className="text-gray-400">{desc}</p>
  </div>
);

const FeatureList = () => (
  <div className="bg-neutral-800 rounded-xl p-6">
    <h3 className="text-xl font-semibold mb-4">Automated Features</h3>
    <ul className="space-y-3">
      {["Lead Qualification", "Payment Processing", "Follow-up Sequences"].map((feature, index) => (
        <li key={index} className="flex items-center">
          ✅ {feature}
        </li>
      ))}
    </ul>
  </div>
);

const Analytics = () => (
  <div className="bg-neutral-800 rounded-xl p-6">
    <h3 className="text-xl font-semibold mb-4">Real-time Analytics</h3>
    {[
      { label: "Lead Quality Score", value: "85%", color: "text-blue-400" },
      { label: "Engagement Rate", value: "92%", color: "text-green-400" },
      { label: "Sales Velocity", value: "+65%", color: "text-purple-400" },
    ].map(({ label, value, color }, index) => (
      <div key={index} className="flex justify-between items-center">
        <span>{label}</span>
        <span className={color}>{value}</span>
      </div>
    ))}
  </div>
);

export default LeadGeneration;
