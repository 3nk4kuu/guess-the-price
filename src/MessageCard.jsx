import { getTemperatureColor } from './ratingColors';

const confettiColors = ['#67c1f5', '#a4e45f', '#ffd65a', '#ff8eaa', '#efffe8'];

export default function MessageCard({ message, guessDiff }) {
  const isCorrect = message.startsWith('Correct!');
  const isIncorrect = message === 'Too low! Try again.' || message === 'Too high! Try again.' || message.startsWith('Out of tries!') || message === 'Please enter a valid price.' || message.startsWith('Already guessed $');
  const showTemperature = (message === 'Too low! Try again.' || message === 'Too high! Try again.') && guessDiff != null;
  const temperatureStyle = showTemperature ? {
    '--indicator-color': getTemperatureColor(guessDiff),
    color: guessDiff <= 3 || guessDiff > 20 ? '#fff' : '#07121c',
  } : undefined;
  return <div className={`message-card ${message ? 'visible' : ''} ${showTemperature ? 'temperature-message' : ''} ${isCorrect ? 'correct-message' : ''} ${isIncorrect ? 'incorrect-message' : ''}`} role="status" aria-live="polite" style={temperatureStyle}>
    <span>{message}</span>
    {isCorrect && <span className="feedback-confetti" aria-hidden="true">
      {Array.from({ length: 24 }, (_, index) => <i key={index} className="confetti-piece" style={{
        left: `${5 + (index * 37 % 90)}%`,
        backgroundColor: confettiColors[index % confettiColors.length],
        '--drift': `${(index % 2 ? 1 : -1) * (8 + index % 5 * 4)}px`,
        '--rise': `${-35 - index % 6 * 7}px`,
        '--rotation': `${(index % 2 ? 1 : -1) * (140 + index * 23)}deg`,
        animationDelay: `${index % 4 * 35}ms`,
      }} />)}
    </span>}
  </div>;
}
