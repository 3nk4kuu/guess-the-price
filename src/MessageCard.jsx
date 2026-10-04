import { useEffect, useId, useRef } from 'react';
import { getTemperatureColor } from './ratingColors';

const confettiColors = ['#67c1f5', '#a4e45f', '#ffd65a', '#ff8eaa', '#efffe8'];

export default function MessageCard({ message, guessDiff }) {
  const isCorrect = message.startsWith('Correct!');
  const messageRef = useRef(null);
  const confettiId = useId();
  useEffect(() => {
    if (!isCorrect || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let active = true;
    let container;
    const celebrate = async () => {
      const { confetti } = await import('@tsparticles/confetti');
      await confetti.init();
      if (!active) return;
      const box = messageRef.current.getBoundingClientRect();
      // Spread the origins across the feedback box, matching the original burst.
      for (let index = 0; index < 12; index++) {
        container = await confetti(`correct-answer-${confettiId}`, {
          count: 3,
          position: {
            x: (box.left + box.width * (5 + index * 37 % 90) / 100) / window.innerWidth * 100,
            y: (box.top + box.height / 2) / window.innerHeight * 100,
          },
          angle: 90,
          spread: 60,
          startVelocity: 12,
          gravity: 0.8,
          ticks: 120,
          scalar: 1,
          colors: confettiColors,
          shapes: ['square'],
          zIndex: 10,
          disableForReducedMotion: true,
        });
        if (!active) {
          container?.destroy();
          return;
        }
      }
    };
    celebrate().catch(error => console.error('Could not launch confetti:', error));
    return () => {
      active = false;
      container?.destroy();
    };
  }, [isCorrect, confettiId]);
  const isIncorrect = message === 'Too low! Try again.' || message === 'Too high! Try again.' || message.startsWith('Out of tries!') || message === 'Please enter a valid price.' || message.startsWith('Already guessed $');
  const showTemperature = (message === 'Too low! Try again.' || message === 'Too high! Try again.') && guessDiff != null;
  const temperatureStyle = showTemperature ? {
    '--indicator-color': getTemperatureColor(guessDiff),
    color: guessDiff <= 3 || guessDiff > 20 ? '#fff' : '#07121c',
  } : undefined;
  return <div ref={messageRef} className={`message-card ${message ? 'visible' : ''} ${showTemperature ? 'temperature-message' : ''} ${isCorrect ? 'correct-message' : ''} ${isIncorrect ? 'incorrect-message' : ''}`} role="status" aria-live="polite" style={temperatureStyle}>
    <span>{message}</span>
  </div>;
}
