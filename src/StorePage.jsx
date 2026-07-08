import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import GameCard from "./GameCard";
import MessageCard from "./MessageCard";
import ResultsPage from "./ResultsPage";
import Header from "./Header";
import HowToPlay from "./HowToPlay";
import { surfaceGrey } from "./theme";

const nextRoundTimer = 1500;
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
  const [score, setScore] = useState(0);

  // PLAYER FEEDBACK
  const [message, setMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [guessDiff, setGuessDiff] = useState(null);

  // CURRENTLY DISPLAYED GAME
  const currentGame = games.length > 0 ? games[gameIndex] : null;
  const [extraData, setExtraData] = useState({
    description: "",
    screenshots: [],
  });

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
    const fetchRawgData = (gameToFetch) => {
      if (!gameToFetch || nextGameData.current[gameToFetch.title]) return;

      const RAWG_KEY = import.meta.env.VITE_RAWG_KEY;

      fetch(
        `https://api.rawg.io/api/games?search=${encodeURIComponent(gameToFetch.title)}&key=${RAWG_KEY}`,
      )
        .then((response) => response.json())
        .then((data) => {
          const rawgGame = data.results[0];

          if (rawgGame) {
            const screenshots =
              rawgGame.short_screenshots?.map((s) => s.image) || [];

            fetch(
              `https://api.rawg.io/api/games/${rawgGame.id}?key=${RAWG_KEY}`,
            )
              .then((response) => response.json())
              .then((detailData) => {
                const gameData = {
                  description:
                    detailData.description_raw || "No description available.",
                  screenshots: screenshots,
                };

                nextGameData.current[gameToFetch.title] = gameData;
                screenshots.forEach((url) => {
                  const img = new Image();
                  img.src = url;
                });
                if (currentGame && gameToFetch.title === currentGame.title) {
                  setExtraData(gameData);
                }
              });
          } else {
            // RAWG HAS NOTHING FOR THIS TITLE - FALL BACK TO CHEAPSHARK'S THUMBNAIL
            const gameData = {
              description: "No description available.",
              screenshots: gameToFetch.thumb ? [gameToFetch.thumb] : [],
            };
            nextGameData.current[gameToFetch.title] = gameData;
            if (currentGame && gameToFetch.title === currentGame.title) {
              setExtraData(gameData);
            }
          }
        })
        .catch((error) => {
          console.error("RAWG API failed", error);
        });
    };

    if (games.length > 0) {
      const current = games[gameIndex];
      const next = games[gameIndex + 1];

      if (current && nextGameData.current[current.title]) {
        setExtraData(nextGameData.current[current.title]);
      } else {
        fetchRawgData(current);
      }
      if (next) {
        fetchRawgData(next);
      }
    }
  }, [gameIndex, games, currentGame]);

  // GAME LOGIC
  const startGame = () => {
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

    const randomPage = Math.floor(Math.random() * maxPages);

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
            const randomIndex = Math.floor(Math.random() * gamePool.length);
            const drawnGame = gamePool.splice(randomIndex, 1)[0];
            selectedGames.push(drawnGame);
          }

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
    if (games.length === 0 || isCorrect || attempts.length >= 3) return;

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

      setTimeout(handleNextGame, nextRoundTimer);
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

  // BUTTON TEXT
  const getButtonText = () => {
    if (roundComplete) {
      return "Play Again";
    }

    if (games.length === 0) {
      return "Start Guessing";
    }

    if (isCorrect || attempts.length >= 3) {
      return "Getting next game...";
    }
    return `Next Game (${gameIndex + 1}/${gamesPerRound})`;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: 3, gap: 4 }}>
      <Header
        difficulty={difficulty}
        onDifficultyChange={(value) => setDifficulty(value)}
        gamesPerRound={gamesPerRound}
        disabled={games.length > 0 && !roundComplete}
      />

      <Button
        sx={{
          width: "25%",
          mx: "auto",
          minWidth: "200px",
          height: 56,
        }}
        variant="contained"
        size="large"
        onClick={games.length > 0 && !roundComplete ? handleNextGame : startGame}
        disabled={games.length > 0 && !roundComplete}
      >
        {getButtonText()}
      </Button>

      {/* PROGRESS INDICATORS */}
      {!roundComplete && games.length > 0 && (
        <Box
          sx={{ display: "flex", justifyContent: "center", gap: 1.5 }}
        >
          {gameResults.map((result, index) => {
            let bgColor = surfaceGrey;
            if (result === true) bgColor = "success.main";
            if (result === false) bgColor = "error.main";

            return (
              <Box
                key={index}
                sx={{
                  width: 18,
                  height: 18,
                  bgcolor: bgColor,
                  borderRadius: 1,
                }}
              />
            );
          })}
        </Box>
      )}

      {/* HOW TO PLAY */}
      {!roundComplete && games.length === 0 && (
        <HowToPlay gamesPerRound={gamesPerRound} />
      )}

      {/* GAME CARD */}
      {!roundComplete && currentGame && (
        <GameCard
          game={currentGame}
          extraData={extraData}
          guess={guess}
          onGuessChange={handleGuessChange}
          onKeyDown={handleKeyDown}
          onSubmitGuess={handleGuess}
          isCorrect={isCorrect}
          attemptsCount={attempts.length}
          inputRef={inputRef}
        />
      )}

      {/* MESSAGE CARD */}
      {!roundComplete && <MessageCard message={message} guessDiff={guessDiff} />}

      {/* RESULTS PAGE */}
      {roundComplete && (
        <ResultsPage games={games} guesses={finalGuesses} results={gameResults} />
      )}
    </Box>
  );
}

export default StorePage;