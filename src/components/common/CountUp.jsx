import React, { useState, useEffect, useRef } from 'react';

const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / duration, 1);
      
      // Easing function (easeOutQuad)
      const easedProgress = progressRatio * (2 - progressRatio);
      
      setCount(Math.floor(easedProgress * end));

      if (progress < duration) {
        window.requestAnimationFrame(animateCount);
      }
    };

    window.requestAnimationFrame(animateCount);
  }, [isVisible, end, duration]);

  return (
    <span ref={elementRef}>
      {count}{suffix}
    </span>
  );
};

export default CountUp;
