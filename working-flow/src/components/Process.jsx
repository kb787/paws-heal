import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const steps = [
  {
    title: "Query Reception",
    description: "Your question is received and analyzed for intent and context",
    icon: "🔍"
  },
  {
    title: "Data Retrieval",
    description: "Relevant information is gathered from multiple sources using RAG technology",
    icon: "📊"
  },
  {
    title: "Context Analysis",
    description: "Graph-RAG processes relationships between data points",
    icon: "🧠"
  },
  {
    title: "Response Generation",
    description: "AI synthesizes information into a coherent, contextual response",
    icon: "💡"
  }
];

export default function ProcessFlow() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div ref={ref} className="max-w-4xl mx-auto">
      <div className="space-y-12">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.2 }}
            className="flex items-start gap-6 group"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neon-purple flex items-center justify-center text-2xl">
              {step.icon}
            </div>
            <div className="flex-1 bg-gray-900/50 p-6 rounded-lg transform transition-all duration-300 group-hover:scale-105 group-hover:bg-neon-purple/10">
              <h3 className="text-xl font-bold text-neon-purple mb-2">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}