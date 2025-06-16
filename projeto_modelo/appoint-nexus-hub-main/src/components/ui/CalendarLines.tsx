
import React from 'react';
import { motion } from 'framer-motion';

interface CalendarLinesProps {
  className?: string;
  animated?: boolean;
  variant?: 'grid' | 'flowing' | 'minimal';
}

export const CalendarLines: React.FC<CalendarLinesProps> = ({ 
  className = '', 
  animated = true,
  variant = 'grid'
}) => {
  if (variant === 'grid') {
    return (
      <div className={`relative ${className}`}>
        <svg 
          className="w-full h-full pointer-events-none opacity-30" 
          viewBox="0 0 400 200"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="calendarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.6"/>
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Linhas horizontais do calendário */}
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <motion.line
              key={`h-${row}`}
              x1="50"
              y1={30 + row * 25}
              x2="350"
              y2={30 + row * 25}
              stroke="url(#calendarGradient)"
              strokeWidth="1"
              filter="url(#glow)"
              initial={animated ? { pathLength: 0, opacity: 0 } : {}}
              animate={animated ? { pathLength: 1, opacity: 0.7 } : {}}
              transition={{ duration: 1.5, delay: row * 0.2 }}
            />
          ))}
          
          {/* Linhas verticais do calendário */}
          {[0, 1, 2, 3, 4, 5, 6].map((col) => (
            <motion.line
              key={`v-${col}`}
              x1={50 + col * 50}
              y1="30"
              x2={50 + col * 50}
              y2="155"
              stroke="url(#calendarGradient)"
              strokeWidth="1"
              filter="url(#glow)"
              initial={animated ? { pathLength: 0, opacity: 0 } : {}}
              animate={animated ? { pathLength: 1, opacity: 0.5 } : {}}
              transition={{ duration: 1.5, delay: 0.5 + col * 0.1 }}
            />
          ))}
          
          {/* Pontos de destaque em algumas intersecções */}
          {[
            { x: 100, y: 55 }, { x: 150, y: 80 }, { x: 200, y: 105 },
            { x: 250, y: 80 }, { x: 300, y: 130 }
          ].map((point, index) => (
            <motion.circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r="2"
              fill="hsl(var(--accent))"
              filter="url(#glow)"
              initial={animated ? { scale: 0, opacity: 0 } : {}}
              animate={animated ? { scale: 1, opacity: 0.8 } : {}}
              transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
            />
          ))}
        </svg>
      </div>
    );
  }

  if (variant === 'flowing') {
    return (
      <div className={`relative ${className}`}>
        <svg 
          className="w-full h-full pointer-events-none opacity-40" 
          viewBox="0 0 400 150"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="flowingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="30%" stopColor="hsl(var(--accent))" stopOpacity="0.6"/>
              <stop offset="70%" stopColor="hsl(var(--primary))" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          
          {/* Linhas fluidas que remetem a agendamentos */}
          <motion.path
            d="M50,30 Q150,20 250,40 T350,30"
            stroke="url(#flowingGradient)"
            strokeWidth="2"
            fill="none"
            initial={animated ? { pathLength: 0, opacity: 0 } : {}}
            animate={animated ? { pathLength: 1, opacity: 0.8 } : {}}
            transition={{ duration: 2, delay: 0.5 }}
          />
          <motion.path
            d="M50,60 Q150,70 250,50 T350,60"
            stroke="url(#flowingGradient)"
            strokeWidth="1.5"
            fill="none"
            initial={animated ? { pathLength: 0, opacity: 0 } : {}}
            animate={animated ? { pathLength: 1, opacity: 0.6 } : {}}
            transition={{ duration: 2, delay: 0.8 }}
          />
          <motion.path
            d="M50,90 Q150,80 250,100 T350,90"
            stroke="url(#flowingGradient)"
            strokeWidth="1"
            fill="none"
            initial={animated ? { pathLength: 0, opacity: 0 } : {}}
            animate={animated ? { pathLength: 1, opacity: 0.4 } : {}}
            transition={{ duration: 2, delay: 1.1 }}
          />
          <motion.path
            d="M50,120 Q150,130 250,110 T350,120"
            stroke="url(#flowingGradient)"
            strokeWidth="1"
            fill="none"
            initial={animated ? { pathLength: 0, opacity: 0 } : {}}
            animate={animated ? { pathLength: 1, opacity: 0.3 } : {}}
            transition={{ duration: 2, delay: 1.4 }}
          />
        </svg>
      </div>
    );
  }

  // variant === 'minimal'
  return (
    <div className={`relative ${className}`}>
      <svg 
        className="w-full h-full pointer-events-none opacity-25" 
        viewBox="0 0 300 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent"/>
            <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
        </defs>
        
        {/* Linhas horizontais minimalistas */}
        {[0, 1, 2, 3].map((index) => (
          <motion.line
            key={index}
            x1="50"
            y1={20 + index * 20}
            x2="250"
            y2={20 + index * 20}
            stroke="url(#minimalGradient)"
            strokeWidth="1"
            initial={animated ? { scaleX: 0, opacity: 0 } : {}}
            animate={animated ? { scaleX: 1, opacity: 0.6 } : {}}
            transition={{ duration: 1, delay: index * 0.3 }}
            style={{ transformOrigin: 'center' }}
          />
        ))}
        
        {/* Pequenos indicadores */}
        {[75, 125, 175, 225].map((x, index) => (
          <motion.circle
            key={index}
            cx={x}
            cy="50"
            r="1.5"
            fill="hsl(var(--accent))"
            initial={animated ? { scale: 0, opacity: 0 } : {}}
            animate={animated ? { scale: 1, opacity: 0.7 } : {}}
            transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
          />
        ))}
      </svg>
    </div>
  );
};
