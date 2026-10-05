export default function HowToPlay({ gamesPerRound, onClose }) {
  return (
    <section className="how-to-play panel">
      <div className="help-heading"><div><p className="eyebrow accent-green">Welcome to Checkout Champion</p><h2 id="how-to-play-title">How to Play</h2></div>
        {onClose && <button className="close-button" onClick={onClose} aria-label="Close how to play">×</button>}
      </div>
      <p>You’ll be shown {gamesPerRound} real games from the Steam store with their screenshots, description, release date, and review scores. Your job is to guess the original price of each game.</p>
      <ol>
        <li>Enter a whole dollar guess — no cents needed — then press Enter or select <strong>Add to Cart</strong>.</li>
        <li>You get 3 tries per game. A game at $9.99 accepts either $9 or $10. The hints tell you if your guess is too high or too low.
          <ul><li>Watch the hint color: warmer colors mean your guess is closer to the correct price.</li></ul>
        </li>
        <li>After {gamesPerRound} games, compare your cart total with the real total on the results screen.</li>
        <li>Easy features familiar hits. Hard dives into more obscure titles.</li>
      </ol>
      {onClose && <button className="primary-button help-dismiss" onClick={onClose}>Got it — let’s play</button>}
    </section>
  );
}
