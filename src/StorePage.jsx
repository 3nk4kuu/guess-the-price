import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const nextRoundTimer = 2000; 

function StorePage() {
  const inputRef = useRef(null);

  // GAME DATA
  const [games, setGames] = useState([]);
  const [gameIndex, setGameIndex] = useState(0);
  const [gameResults, setGameResults] = useState(Array(10).fill(null));
  const [difficulty, setDifficulty] = useState("medium");

  // USER PROGRESS
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [score, setScore] = useState(0);

  // PLAYER FEEDBACK
  const [message, setMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  // CURRENTLY DISPLAYED GAME
  const currentGame = games.length > 0 ? games[gameIndex] : null;

  // AUTOFOCUS INPUT FIELD
  useEffect(() => {
    if (games.length > 0 && !isCorrect && attempts.length < 3 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameIndex, games.length, isCorrect, attempts.length]);

  // GAME LOGIC
  const startGame = () => {
    setGuess("");
    setMessage("");
    setIsCorrect(false);
    setAttempts([]);
    setGameResults(Array(10).fill(null));

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

    fetch(`https://www.cheapshark.com/api/1.0/deals?storeID=1&pageNumber=${randomPage}&minimumReviewCount=${minReviews}${sortParams}`)
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
          
          while (selectedGames.length < 10 && gamePool.length > 0) {
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
    if (gameIndex < games.length - 1) {
      setGameIndex(gameIndex + 1);
      setAttempts([]);
      setGuess("");
      setMessage("");
      setIsCorrect(false);
    } else {
      setMessage("10 Games Completed! Start a new round?");
      setGames([]);
    }
  };

  const handleGuess = () => {
    if (games.length === 0 || isCorrect || attempts.length >= 3) return;

    const guessInt = parseInt(guess, 10);
    const actualPrice = parseFloat(currentGame.normalPrice);

    if (isNaN(guessInt)) {
      setMessage("Please enter a valid price.");
      return;
    }

    if (
      guessInt === Math.floor(actualPrice) ||
      guessInt === Math.ceil(actualPrice)
    ) {
      setMessage(`Correct! The original price is $${actualPrice}`);
      setIsCorrect(true);
      setAttempts([...attempts, true]);

      const newResults = [...gameResults];
      newResults[gameIndex] = true;
      setGameResults(newResults);
      
      setTimeout(handleNextGame, nextRoundTimer);
    } else {
      const newAttempts = [...attempts, false];
      setAttempts(newAttempts);
      setGuess("");

      if (newAttempts.length >= 3) {
        setMessage(`Out of tries! The original price was $${actualPrice}`);

        const newResults = [...gameResults];
        newResults[gameIndex] = false;
        setGameResults(newResults);
        
        setTimeout(handleNextGame, nextRoundTimer);
      } else if (guessInt < actualPrice) {
        console.log(currentGame.title, guessInt, actualPrice);
        setMessage("Too low! Try again.");
      } else {
        console.log(currentGame.title, guessInt, actualPrice);
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
    if (games.length === 0) {
      return "Start Guessing";
    }
    
    if (isCorrect || attempts.length >= 3) {
      return "Getting next game...";
    }
    return `Next Game (${gameIndex + 1}/10)`;
  };

export default StorePage;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
      <Typography
        variant="h2"
        component="div"
        sx={{
          mx: "auto",
          mt: 5,
          textAlign: "center",
        }}
      >
        Guess The Price
      </Typography>

      <FormControl sx={{ width: "25%", mx: "auto" }}>
        <InputLabel id="game-difficulty">Difficulty</InputLabel>
        <Select
          labelId="game-difficulty"
          id="difficulty-select"
          value={difficulty}
          label="Difficulty"
          onChange={(diff) => setDifficulty(diff.target.value)}
        >
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>
      </FormControl>

      <Button
        sx={{
          width: "25%",
          mx: "auto",
          my: 5,
          minWidth: "200px",
        }}
        variant="contained"
        onClick={games.length > 0 ? handleNextGame : startGame}
        disabled={games.length > 0} 
      >
        {getButtonText()}
      </Button>

      {/* PROGRESS INDICATORS */}
      {(games.length > 0 || message.includes("Start a new round?")) && (
        <Box
          sx={{ display: "flex", justifyContent: "center", gap: 1.5, mb: 3 }}
        >
          {gameResults.map((result, index) => {
            let bgColor = "grey.300";
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

      {/* GAME CARD */}
      {currentGame && (
        <Card sx={{ minWidth: 275, maxWidth: "75%", mx: "auto" }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              {currentGame.title}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Release Date:</strong>{" "}
              {new Date(currentGame.releaseDate * 1000).toLocaleDateString()}
            </Typography>

            <Box
              sx={{
                width: "100%",
                height: 200,
                bgcolor: "grey.300",
                borderRadius: 1,
                my: 2,
              }}
            />

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Steam Rating:</strong> {currentGame.steamRatingText} (
              {currentGame.steamRatingPercent}%)
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Metascore: </strong>
              {currentGame.metacriticScore}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Steam Review Count:</strong>{" "}
              {currentGame.steamRatingCount}
            </Typography>

            <Box
              sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* TODO: have text field already have the $ in front of what player types */}
              <TextField
                label="Guess the original price"
                variant="filled"
                value={guess}
                onChange={handleGuessChange}
                onKeyDown={handleKeyDown}
                disabled={isCorrect || attempts.length >= 3}
                fullWidth
                inputRef={inputRef} 
              />
            </Box>

            <Typography 
                variant="body2" 
                align="center" 
                color="text.secondary" 
                sx={{ mt: 1 }}
              >
                {3 - attempts.length} tries remaining
              </Typography>
            
          </CardContent>
        </Card>
      )}

      {/* MESSAGE CARD */}
      <Card
        sx={{
          minWidth: 275,
          maxWidth: 500,
          mx: "auto",
          my: 3,
          visibility: message ? "visible" : "hidden", 
        }}
      >
        <CardContent sx={{ textAlign: "center", py: 2 }}>
          <Typography
            variant="body1"
            color={
              message.startsWith("Correct") ? "success.main" : "error.main"
            }
            sx={{ fontWeight: "bold" }}
          >
            {message || " "} 
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default StorePage;
