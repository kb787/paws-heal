import React from 'react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: "Starter",
    price: "₹14,999",
    features: [
      "Up to 1000 queries/month",
      "Basic analytics",
      "Email support",
      "Standard API access"
    ]
  },
  {
    name: "Professional",
    price: "₹49,999",
    features: [
      "Up to 10,000 queries/month",
      "Advanced analytics",
      "Priority support",
      "Full API access",
      "Custom integrations"
    ]
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited queries",
      "Custom solutions",
      "24/7 dedicated support",
      "Advanced security features",
      "On-premise deployment"
    ]
  }
];

export default function Pricing() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto py-10">
      {plans.map((plan, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="bg-gradient-to-br from-purple-900/30 to-gray-900/30 rounded-lg p-6 hover:shadow-lg hover:shadow-neon-purple/20 transition-all duration-300 min-h-[380px]"
        >
          <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
          <div className="text-4xl font-bold text-neon-purple mb-6">{plan.price}</div>
          <ul className="space-y-4 mb-8">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-gray-300">
                <span className="text-neon-purple mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <button className="w-full py-3 px-6 rounded-lg bg-neon-purple text-white hover:bg-purple-700 transition-colors">
            Get Started
          </button>
        </motion.div>
      ))}
    </div>
  );
}
