import React from 'react';

const Mascot = () => {
  return (
    <div className="fixed bottom-4 right-4 z-10 pointer-events-none">
      <div className="relative">
        {/* Mascote simples e leve */}
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg animate-pulse">
          {/* Olhos simples */}
          <div className="absolute top-3 left-2 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-3 right-2 w-2 h-2 bg-white rounded-full"></div>
          {/* Antena */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-cyan-300"></div>
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-300 rounded-full"></div>
        </div>
        
        {/* Texto de crédito */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <p className="text-xs text-gray-400 font-mono">
            feito com 💙 e nostalgia - diversão garantida
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mascot;