import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export default function TypedHeading() {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        'Transform Your Enterprise with SiVA.ai',
        'Revolutionize Your Workflow with SiVA.ai',
        'Accelerate Innovation with SiVA.ai'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true,
      backDelay: 2000
    });

    return () => typed.destroy();
  }, []);

  return (
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
      <span ref={el}></span>
    </h1>
  );
}