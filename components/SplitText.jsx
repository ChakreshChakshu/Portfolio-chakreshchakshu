import React from 'react';

export default function SplitText({ text, className = '', charClassName = '', wordClassName = '' }) {
  const words = text.split(' ');
  return (
    <span className={`split-text inline-block ${className}`}>
      {words.map((word, wIdx) => (
        <span 
          key={wIdx} 
          className={`word inline-block whitespace-nowrap ${wordClassName}`} 
          style={{ perspective: '1000px' }}
        >
          {word.split('').map((char, cIdx) => (
            <span
              key={cIdx}
              className={`char inline-block will-change-[transform,filter,opacity] ${charClassName}`}
              style={{ display: 'inline-block' }}
            >
              {char}
            </span>
          ))}
          {wIdx < words.length - 1 && (
            <span className="space inline-block" style={{ display: 'inline-block' }}>
              &nbsp;
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
