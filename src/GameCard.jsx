import { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import { getMetascoreColor, getSteamRatingColor } from './ratingColors';
import GameDescription from './GameDescription';

export default function GameCard({ game, extraData, guess, onGuessChange, onKeyDown, onSubmitGuess, isCorrect, attemptsCount, inputRef }) {
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const [displayedScreenshotIndex, setDisplayedScreenshotIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const screenshotRefs = useRef([]);
  const screenshotContainerRef = useRef(null);
  const activeThumbRef = useRef(null);
  const screenshots = extraData.screenshots.length ? extraData.screenshots : game.thumb ? [game.thumb] : [];
  const activeIndex = Math.min(screenshotIndex, Math.max(0, screenshots.length - 1));
  const disabled = isCorrect || attemptsCount >= 3;
  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled, inputRef]);
  useEffect(() => {
    if (!viewerOpen) activeThumbRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeIndex, viewerOpen]);
  const selectScreenshot = index => {
    setScreenshotIndex(index);
    const image = screenshotRefs.current[index];
    if (image?.complete && image.naturalWidth > 0) {
      setDisplayedScreenshotIndex(index);
    }
  };
  const cycleShot = direction => selectScreenshot((activeIndex + direction + screenshots.length) % screenshots.length);
  return (
    <section className="game-card panel screen-enter" aria-labelledby="game-title">
      <div className="card-topbar"><span className="eyebrow">Guess the price</span><span className="guesses-badge">{3 - attemptsCount} guesses left</span></div>
      <div className="game-grid">
        <h2 id="game-title" className="game-title">{game.title}</h2>
        <div className="game-media">
          <div className="main-screenshot" ref={screenshotContainerRef} tabIndex={-1}>
            {screenshots.length ? screenshots.map((url, index) => <img
              key={`${url}-${index}`}
              ref={element => { screenshotRefs.current[index] = element; }}
              src={url}
              className={`screenshot-layer ${index === displayedScreenshotIndex ? 'visible' : ''}`}
              alt={`${game.title} screenshot ${index + 1}`}
              aria-hidden={index !== displayedScreenshotIndex}
              onLoad={() => {
                if (index === activeIndex) {
                  setDisplayedScreenshotIndex(index);
                }
              }}
            />) : <p>Loading media…</p>}
            {screenshots.length > 0 && <Tooltip title="Enlarge screenshot" enterDelay={0} enterNextDelay={0} placement="top" disableInteractive
              slotProps={{
                popper: {
                  popperOptions: { modifiers: [{ name: 'offset', options: { offset: [0, -4] } }] },
                  sx: { '&[data-popper-placement*="top"] .MuiTooltip-tooltip': { marginBottom: 0 } },
                },
                tooltip: { sx: { backgroundColor: '#132331', color: '#d6e5ef', border: '1px solid #3b5b70' } },
              }}>
              <button className="enlarge-screenshot" aria-label="Enlarge screenshot" onClick={() => setViewerOpen(true)}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path d="M9 3H3v6m12-6h6v6M3 15v6h6m6 0h6v-6" /></svg>
              </button>
            </Tooltip>}
          </div>
          {screenshots.length > 0 && <div className="screenshot-controls">
            <button className="arrow-button" aria-label="Previous screenshot" disabled={screenshots.length <= 1} onClick={() => cycleShot(-1)}>‹</button>
            <div className="thumbnail-rail">{screenshots.map((url, index) => <button key={`${url}-${index}`} ref={index === activeIndex ? activeThumbRef : null} className={`thumbnail ${index === activeIndex ? 'selected' : ''}`} aria-label={`Show screenshot ${index + 1}`} aria-pressed={index === activeIndex} onClick={() => selectScreenshot(index)}><img src={url} alt="" /></button>)}</div>
            <button className="arrow-button" aria-label="Next screenshot" disabled={screenshots.length <= 1} onClick={() => cycleShot(1)}>›</button>
          </div>}
        </div>
        <div className="game-details">
          <div><p className="eyebrow">About this game</p><GameDescription key={extraData.description} description={extraData.description || 'Loading game details…'} />
            <p className="eyebrow release-label">Released</p><p className="release-date">{new Date(game.releaseDate * 1000).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <div className="rating-row"><div className="steam-rating"><p className="eyebrow">Steam reviews</p><p className="review-score" style={{ color: getSteamRatingColor(game.steamRatingText) }}>{game.steamRatingText} ({game.steamRatingPercent}%)</p><p className="review-count">{Number(game.steamRatingCount).toLocaleString()} reviews</p></div>
            <div className="metascore" style={{ backgroundColor: game.metacriticScore > 0 ? getMetascoreColor(game.metacriticScore) : '#d6d7d8' }}><span className="eyebrow">Metascore</span><strong>{game.metacriticScore > 0 ? game.metacriticScore : 'N/A'}</strong></div>
          </div>
          <div className="guess-form"><label className="eyebrow" htmlFor="price-guess">Enter your guess</label><div className="guess-controls"><div className="price-input"><span aria-hidden="true">$</span><input id="price-guess" ref={inputRef} value={guess} onChange={onGuessChange} onKeyDown={onKeyDown} disabled={disabled} autoComplete="off" inputMode="numeric" placeholder="0" /></div><button className="primary-button" onClick={onSubmitGuess} disabled={disabled}>Add to cart</button></div></div>
        </div>
      </div>
      <Dialog open={viewerOpen} onClose={() => setViewerOpen(false)} aria-label="Screenshot viewer" maxWidth={false} disableRestoreFocus
        slotProps={{ transition: { onExited: () => screenshotContainerRef.current?.focus({ preventScroll: true }) }, paper: { className: 'screenshot-viewer', 'aria-label': 'Screenshot viewer', sx: { width: 'min(1260px, calc(90vw - 32px), calc(70.2dvh * 16 / 9))', maxWidth: 'calc(100% - 128px)', margin: '16px', overflow: 'visible', background: '#0b1720', backgroundImage: 'none', borderRadius: '6px' } } }}
        onKeyDown={event => {
          if (screenshots.length > 1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
            event.preventDefault();
            cycleShot(event.key === 'ArrowLeft' ? -1 : 1);
          }
        }}>
        <div className="screenshot-viewer-stage">
          {screenshots.map((url, index) => <img key={`${url}-${index}`} src={url} className={`screenshot-layer ${index === displayedScreenshotIndex ? 'visible' : ''}`} alt={`${game.title} screenshot ${index + 1}`} aria-hidden={index !== displayedScreenshotIndex} />)}
        </div>
        <button className="viewer-close" aria-label="Close screenshot viewer" onClick={() => setViewerOpen(false)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <path d="m5 5 14 14M19 5 5 19" />
          </svg>
        </button>
        <div className="screenshot-viewer-count">
          {screenshots.length > 1 && <button className="viewer-arrow previous" aria-label="Previous enlarged screenshot" onClick={() => cycleShot(-1)}>‹</button>}
          <span aria-live="polite">{displayedScreenshotIndex + 1} of {screenshots.length}</span>
          {screenshots.length > 1 && <button className="viewer-arrow next" aria-label="Next enlarged screenshot" onClick={() => cycleShot(1)}>›</button>}
        </div>
      </Dialog>
    </section>
  );
}
