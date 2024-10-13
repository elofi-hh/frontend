// ELOValue.tsx
import React, { useEffect, useState, useRef } from 'react';

interface ELOValueProps {
  value: number;
}

function ELOValue({ value }: ELOValueProps) {
  const prevValueRef = useRef(value);
  const [changeType, setChangeType] = useState<
    'increase' | 'decrease' | 'same'
  >('same');

  useEffect(() => {
    if (prevValueRef.current !== value) {
      const prevValue = prevValueRef.current;

      if (value > prevValue) {
        setChangeType('increase');
      } else if (value < prevValue) {
        setChangeType('decrease');
      }

      prevValueRef.current = value;

      const timeout = setTimeout(() => {
        setChangeType('same');
      }, 1000); // Reset after 1 second

      return () => clearTimeout(timeout);
    }
  }, [value]);

  return (
    <p
      className="text-sm"
      style={{
        color:
          changeType === 'increase'
            ? 'green'
            : changeType === 'decrease'
            ? 'red'
            : 'inherit',
        transition: 'color 0.5s ease'
      }}
    >
      ELO: {value}
    </p>
  );
}

export default ELOValue;
