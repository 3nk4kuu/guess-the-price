import { useState, useEffect, useRef } from "react";
import GameCard from "./GameCard";
import MessageCard from "./MessageCard";
import ResultsPage from "./Resultspage";
import Header from "./Header";
import HowToPlay from "./Howtoplay";

const nextRoundTimer = 1500;
const correctAnswerTimer = nextRoundTimer;
const gamesPerRound = 5;

function StorePage() {
  const inputRef = useRef(null);

  // GET NEXT GAME DATA WHILE ON CURRENT GAME
  const nextGameData = useRef({});

  // GAME DATA
  const [games, setGames] = useState([]);
  const [gameIndex, setGameIndex] = useState(0);
  const [gameResults, setGameResults] = useState(
    Array(gamesPerRound).fill(null),
  );
  const [finalGuesses, setFinalGuesses] = useState(
    Array(gamesPerRound).fill(null),
  );
  const [roundComplete, setRoundComplete] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");

  // USER PROGRESS
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // PLAYER FEEDBACK
  const [message, setMessage] = useState("");
  const [feedbackSequence, setFeedbackSequence] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [guessDiff, setGuessDiff] = useState(null);

  // CURRENTLY DISPLAYED GAME
  const currentGame = games.length > 0 ? games[gameIndex] : null;
  const [extraData, setExtraData] = useState({
    description: "",
    screenshots: [],
  });
  const detailsLoading = currentGame && !roundComplete && extraData.gameTitle !== currentGame.title;
  const showingLoading = loading || detailsLoading;

  // AUTOFOCUS INPUT FIELD
  useEffect(() => {
    if (
      games.length > 0 &&
      !isCorrect &&
      attempts.length < 3 &&
      inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [gameIndex, games.length, isCorrect, attempts.length]);

  // FETCHING RAWG API DATA FOR NEXT GAME
  useEffect(() => {
    if (loading || !currentGame || roundComplete) return;
    let active = true;
    const cache = nextGameData.current;
    const fetchRawgData = (gameToFetch) => {
      if (!cache[gameToFetch.title]) {
        cache[gameToFetch.title] = (async () => {
          const fallback = {
            gameTitle: gameToFetch.title,
            description: "No description available.",
            screenshots: gameToFetch.thumb ? [gameToFetch.thumb] : [],
          };
          try {
            const RAWG_KEY = import.meta.env.VITE_RAWG_KEY;
            const response = await fetch(
              `https://api.rawg.io/api/games?search=${encodeURIComponent(gameToFetch.title)}&key=${RAWG_KEY}`,
            );
            if (!response.ok) throw new Error(`RAWG search failed: ${response.status}`);
            const data = await response.json();
            const rawgGame = data.results?.[0];
            if (!rawgGame) return fallback;
            const detailResponse = await fetch(
              `https://api.rawg.io/api/games/${rawgGame.id}?key=${RAWG_KEY}`,
            );
            if (!detailResponse.ok) throw new Error(`RAWG details failed: ${detailResponse.status}`);
            const detailData = await detailResponse.json();
            const screenshots = rawgGame.short_screenshots?.map(s => s.image) || [];
            screenshots.forEach(url => {
              const img = new Image();
              img.src = url;
            });
            return {
              gameTitle: gameToFetch.title,
              description: detailData.description_raw || fallback.description,
              screenshots,
            };
          } catch (error) {
            console.error("RAWG API failed", error);
            return fallback;
          }
        })();
      }
      return cache[gameToFetch.title];
    };
    fetchRawgData(currentGame).then(gameData => {
      if (active) setExtraData(gameData);
    });
    const next = games[gameIndex + 1];
    if (next) fetchRawgData(next);
    return () => { active = false; };
  }, [gameIndex, games, currentGame, loading, roundComplete]);

  // GAME LOGIC
  const startGame = () => {
    setLoading(true);
    setGames([]);
    setLoadError(false);
    setGuess("");
    setMessage("");
    setIsCorrect(false);
    setGuessDiff(null);
    setAttempts([]);
    setGameResults(Array(gamesPerRound).fill(null));
    setFinalGuesses(Array(gamesPerRound).fill(null));
    setRoundComplete(false);

    setExtraData({ description: "", screenshots: [] });
    nextGameData.current = {};

    console.log("getting game data");

    // DEFAULT DIFF - MED
    let minReviews = 5000;
    let sortParams = "";
    let maxPages = 20;

    if (difficulty === "easy") {
      minReviews = 50000;
      sortParams = "&sortBy=ReviewCount&desc=1";
      maxPages = 3;
    } else if (difficulty === "hard") {
      minReviews = 500;
      sortParams = "&sortBy=ReviewCount&desc=0";
      maxPages = 50;
    }

    // Random selection runs only when the player starts a round.
    const pickRandomIndex = (length) => Math.floor(Math.random() * length);
    const randomPage = pickRandomIndex(maxPages);

    fetch(
      `https://www.cheapshark.com/api/1.0/deals?storeID=1&pageNumber=${randomPage}&minimumReviewCount=${minReviews}${sortParams}`,
    )
      .then((response) => {
        if (response.status === 429) {
          throw new Error("RATE_LIMIT");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          const selectedGames = [];
          const gamePool = [...data];

          while (selectedGames.length < gamesPerRound && gamePool.length > 0) {
            const randomIndex = pickRandomIndex(gamePool.length);
            const drawnGame = gamePool.splice(randomIndex, 1)[0];
            selectedGames.push(drawnGame);
          }

          setLoading(false);
          setGames(selectedGames);
          setGameIndex(0);
          console.log("got game data successfully", selectedGames);
        } else {
          console.log(
            `no games with ${minReviews}+ reviews on page`,
            randomPage,
          );
          setTimeout(startGame, 1000);
        }
      })
      .catch((error) => {
        setLoading(false);
        setLoadError(true);
        if (error.message === "RATE_LIMIT") {
          console.log("api rate limit reached");
          setMessage("Try again in a few seconds.");
        } else {
          console.error(error);
          setMessage("Something went wrong getting the game info.");
        }
      });
  };

  const handleNextGame = () => {
    if (gameIndex < gamesPerRound - 1) {
      setGameIndex(gameIndex + 1);
      setAttempts([]);
      setGuess("");
      setMessage("");
      setIsCorrect(false);
      setGuessDiff(null);
    } else {
      setRoundComplete(true);
    }
  };

  const handleGuess = () => {
    if (showingLoading || games.length === 0 || isCorrect || attempts.length >= 3) return;
    setFeedbackSequence(sequence => sequence + 1);

    const guessInt = parseInt(guess, 10);
    const actualPrice = parseFloat(currentGame.normalPrice);
    console.log(guessInt, actualPrice);

    if (isNaN(guessInt)) {
      setMessage("Please enter a valid price.");
      setGuessDiff(null);
      return;
    }

    if (attempts.includes(guessInt)) {
      setMessage(`Already guessed $${guessInt}! Try a different number.`);
      setGuess("");
      setGuessDiff(null);
      return;
    }

    if (
      guessInt === Math.floor(actualPrice) ||
      guessInt === Math.ceil(actualPrice)
    ) {
      setMessage(`Correct! The original price is $${actualPrice}`);
      setIsCorrect(true);
      setGuessDiff(0);
      setAttempts([...attempts, true]);

      const newResults = [...gameResults];
      newResults[gameIndex] = true;
      setGameResults(newResults);

      const newGuesses = [...finalGuesses];
      newGuesses[gameIndex] = guessInt;
      setFinalGuesses(newGuesses);

      setTimeout(handleNextGame, correctAnswerTimer);
    } else {
      const newAttempts = [...attempts, guessInt];
      setAttempts(newAttempts);
      setGuess("");
      setGuessDiff(Math.abs(guessInt - actualPrice));

      if (newAttempts.length >= 3) {
        setMessage(`Out of tries! The original price was $${actualPrice}`);

        const newResults = [...gameResults];
        newResults[gameIndex] = false;
        setGameResults(newResults);

        const newGuesses = [...finalGuesses];
        newGuesses[gameIndex] = guessInt;
        setFinalGuesses(newGuesses);

        setTimeout(handleNextGame, nextRoundTimer);
      } else if (guessInt < actualPrice) {
        setMessage("Too low! Try again.");
      } else {
        setMessage("Too high! Try again.");
      }
    }
  };

  // EVENT HANDLERS
  const handleGuessChange = (event) => {
    setGuess(event.target.value);
  };

  const handleKeyDown = (enter) => {
    if (enter.key === "Enter") {
      handleGuess();
    }
  };

  return (
    <div className="app-shell">
      <Header difficulty={difficulty} onDifficultyChange={setDifficulty} gamesPerRound={gamesPerRound} disabled={loading || (games.length > 0 && !roundComplete)} />
      <main className={`main-content ${showingLoading || loadError ? 'state-main' : !roundComplete && !currentGame ? 'welcome-main' : ''}`}>
        {showingLoading || loadError ? (
          <section className="state-card panel screen-enter" aria-live="polite">
            <div className={`state-icon ${showingLoading ? 'loading' : 'error'}`}>{showingLoading ? <span className="spinner" /> : '!'}</div>
            <p className="eyebrow accent-blue">{showingLoading ? 'Finding your next game' : 'Connection lost'}</p>
            <h2>{showingLoading ? 'Curating your cart…' : 'Well, that’s inconvenient.'}</h2>
            <p>{showingLoading ? 'We’re looking for a game with a price worth guessing. Your next round will be ready in a moment.' : message}</p>
            {!showingLoading && <button className="primary-button" onClick={startGame}>Try again</button>}
          </section>
        ) : roundComplete ? (
          <><ResultsPage games={games} guesses={finalGuesses} results={gameResults} /><div className="start-action"><button className="primary-button replay-button" onClick={startGame}>Continue shopping</button></div></>
        ) : currentGame ? (
          <>
            <div className="round-progress"><span className="eyebrow">Round {String(gameIndex + 1).padStart(2, '0')} / {String(gamesPerRound).padStart(2, '0')}</span><div className="progress-rail" aria-label={`Round ${gameIndex + 1} of ${gamesPerRound}`}>
              {gameResults.map((result, index) => <span key={index} className={`progress-step ${index === gameIndex ? 'active' : ''} ${result === true ? 'correct' : result === false ? 'incorrect' : ''}`} aria-label={`Game ${index + 1}: ${result === true ? 'correct' : result === false ? 'incorrect' : index === gameIndex ? 'current' : 'upcoming'}`} />)}
            </div></div>
            <GameCard key={`${currentGame.gameID || currentGame.title}-${extraData.screenshots[0] || 'preview'}`} game={currentGame} extraData={extraData} guess={guess} onGuessChange={handleGuessChange} onKeyDown={handleKeyDown} onSubmitGuess={handleGuess} isCorrect={isCorrect} attemptsCount={attempts.length} inputRef={inputRef} />
            <MessageCard key={`${gameIndex}-${feedbackSequence}`} message={message} guessDiff={guessDiff} />
          </>
        ) : (
          <div className="welcome-screen"><HowToPlay gamesPerRound={gamesPerRound} /><div className="start-action"><button className="primary-button" onClick={startGame}>Start guessing</button></div>{message && <MessageCard message={message} guessDiff={guessDiff} />}</div>
        )}
      </main>
      <footer>© {new Date().getFullYear()} · built by @3nk4kuu with {'<3'}</footer>
    </div>
  );
}

export default StorePage;
