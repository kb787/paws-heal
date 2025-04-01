import React, { useEffect, useRef } from 'react';

const code = `// SiVA.ai Context-Aware Response System
class ContextAwareSystem {
  constructor() {
    this.ragEngine = new RAGEngine();
    this.graphRAG = new GraphRAGProcessor();
  }

  async processQuery(query, context) {
    const relevantDocs = await this.ragEngine.retrieve(query);
    const graphContext = await this.graphRAG.analyze(relevantDocs);
    
    return this.synthesizeResponse(query, graphContext);
  }
}

// Predictive Analytics Engine
class PredictiveAnalytics {
  async forecast(historicalData) {
    const trends = await this.analyzeTrends(historicalData);
    return this.generateInsights(trends);
  }
}`;

function CodeTyping() {
  const codeRef = useRef(null);

  useEffect(() => {
    let currentText = '';
    let currentIndex = 0;

    const typeCode = () => {
      if (currentIndex < code.length) {
        currentText += code[currentIndex];
        if (codeRef.current) {
          codeRef.current.textContent = currentText;
        }
        currentIndex++;
        setTimeout(typeCode, Math.random() * 50 + 20); // Typing delay
      } else {
        setTimeout(() => {
          // Reset the typing effect
          currentText = '';
          currentIndex = 0;
          typeCode();
        }, 1000); // Pause before restarting
      }
    };

    typeCode();
  }, []);

  return (
    <div
      className="bg-[#1e1e1e] rounded-lg p-6 font-mono text-sm overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url('https://4kwallpapers.com/images/wallpapers/dark-background-abstract-background-network-3d-background-4480x2520-8324.png')`,
        minHeight: '300px',  // Fixed height to avoid layout shifts
      }}
    >
      {/* Header with buttons */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      {/* Typing Effect with Scrollable Code */}
      <div className="overflow-x-auto">
        <pre className="text-gray-300 whitespace-pre-wrap md:whitespace-pre">
          <code ref={codeRef}></code>
        </pre>
      </div>
    </div>
  );
}

export default function DemoSection() {
  return (
    <section id="demo" className="py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          See SiVA.ai in Action
        </h2>
        <CodeTyping />
      </div>
    </section>
  );
}
