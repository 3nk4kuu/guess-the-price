import { getSteamRatingColor } from './ratingColors';

export default function ResultsPage({ games, guesses, results }) {
  const estimatedTotal = guesses.reduce((sum, guess) => sum + (guess ?? 0), 0);
  const actualTotal = games.reduce((sum, game) => sum + parseFloat(game.normalPrice), 0);
  const correctCount = results.filter(result => result === true).length;
  return <section className="results-page screen-enter">
    <div className="results-heading"><p className="eyebrow accent-blue">Checkout complete</p><h2>Your Cart</h2><p>{games.length} items · {correctCount} guessed correctly</p></div>
    <div className="results-grid"><div className="cart-items">{games.map((game, index) => <article className="cart-item panel" key={`${game.title}-${index}`}>
      <img src={game.thumb} alt={game.title} /><div className="cart-game-info"><h3>{game.title}</h3><p style={{ color: getSteamRatingColor(game.steamRatingText) }}>{game.steamRatingText} ({game.steamRatingPercent}%)</p><p className="review-count">{Number(game.steamRatingCount).toLocaleString()} reviews</p></div>
      <div className="cart-price"><span className={results[index] ? 'correct-price' : 'incorrect-price'} aria-label={`Your guess: ${guesses[index] ?? 'none'}, ${results[index] ? 'correct' : 'missed'}`}>{guesses[index] != null ? `$${guesses[index].toFixed(2)}` : '—'}</span><strong aria-label={`Actual price: $${Number(game.normalPrice).toFixed(2)}`}>${Number(game.normalPrice).toFixed(2)}</strong></div>
    </article>)}</div><aside className="cart-summary panel"><p className="eyebrow">Game summary</p><h2>{correctCount} / {games.length}</h2><p className="accent-green">Games guessed correctly</p><hr /><div><span>Estimated price</span><del>${estimatedTotal.toFixed(2)}</del></div><div><span>Actual price</span><strong>${actualTotal.toFixed(2)}</strong></div></aside></div>
  </section>;
}
