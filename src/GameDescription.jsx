import { useEffect, useRef, useState } from 'react';

export default function GameDescription({ description }) {
  const descriptionRef = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const element = descriptionRef.current;
    let active = true;
    const measure = () => {
      if (active) setHasOverflow(element.scrollHeight > element.clientHeight + 1);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    document.fonts.ready.then(measure);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, []);

  return (
    <div className="description-container">
      <p ref={descriptionRef} className="game-description" tabIndex={0} aria-label="Game description" onScroll={event => {
        setHasScrolled(event.currentTarget.scrollTop > 0);
      }}>{description}</p>
      {hasOverflow && <div className={`description-scroll-hint ${hasScrolled ? 'dismissed' : ''}`} aria-hidden="true">
        <span>Scroll to read more</span>
      </div>}
    </div>
  );
}
