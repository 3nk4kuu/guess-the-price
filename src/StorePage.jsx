import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function StorePage() {
  const [game, setGame] = useState(null);
  const [gameList, setGameList] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");

  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const getRandomGame = () => {
    if (game && !isCorrect) {
      setMessage("Must guess the price of current game before moving on.");
      return;
    }

    setGuess("");
    setMessage("");
    setIsCorrect(false);

    console.log("getting game data");

    // set dfualts - medium
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
    // easy 50k+, medium 5k+, hard 500+
    
   fetch(`https://www.cheapshark.com/api/1.0/deals?storeID=1&pageNumber=${randomPage}&minimumReviewCount=${minReviews}${sortParams}`)
      .then((response) => {
        if (response.status === 429) {
          throw new Error("RATE_LIMIT");
        }
        return response.json();
      })
      .then((data) => {
        setGameList(data);

        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          const selectedGame = data[randomIndex];
          console.log("got game data successfully", selectedGame);

          setGame(selectedGame);
        } else {
          console.log(`no games with ${minReviews}+ reviews on page`, randomPage);
          setTimeout(getRandomGame, 1000);
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
  //   TODO: add loading / mui skeleton when getting data?

  const handleGuess = () => {
    if (!game) return;

    const guessInt = parseInt(guess, 10);
    const actualPrice = parseFloat(game.normalPrice);

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
    } else if (guessInt < actualPrice) {
      console.log(guessInt, actualPrice);
      setMessage("Too low! Try again.");
      setGuess("");
    } else {
      console.log(guessInt, actualPrice);
      setMessage("Too high! Try again.");
      setGuess("");
    }
    // TODO: change to hot/cold colors to later !!!
  };

  const handleKeyDown = (enter) => {
    if (enter.key === "Enter") {
      handleGuess();
    }
  };

  const handleGuessChange = (event) => {
    setGuess(event.target.value);
  };

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

      <FormControl sx={{width: "25%", mx: "auto"}}>
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
        onClick={getRandomGame}
      >
        {game ? "Get Next Game" : "Start Guessing"}
      </Button>

      {/* GAME CARD */}
      {/* TODO: make game card into component and put in carousel of 10 - inspo discovery queue */}
      {game && (
        <Card sx={{ minWidth: 275, maxWidth: "50%", mx: "auto" }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              {game.title}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Release Date:</strong>{" "}
              {new Date(game.releaseDate * 1000).toLocaleDateString()}
            </Typography>

            {/* TODO: get images/store scs later */}
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
              <strong>Description:</strong>{" "}
            </Typography>

            {/* TODO: change to have color like steam */}
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Steam Rating:</strong> {game.steamRatingText} (
              {game.steamRatingPercent}%)
            </Typography>

            {/* TODO: change to number with color bkg later */}
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Metascore: </strong>
              {game.metacriticScore}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Steam Review Count:</strong> {game.steamRatingCount}
            </Typography>

            <Box
              sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* TODO: have text field already have the $ in front of what player types */}
              <TextField
                label="Guess the original price"
                variant="filled"
                // type="number"
                value={guess}
                onChange={handleGuessChange}
                onKeyDown={handleKeyDown}
                disabled={isCorrect}
                fullWidth
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* MESSAGE CARD */}
      {message && (
        <Card sx={{ minWidth: 275, maxWidth: 500, mx: "auto", mt: 3 }}>
          <CardContent sx={{ textAlign: "center", py: 2 }}>
            <Typography
              variant="body1"
              color={
                message.startsWith("Correct") ? "success.main" : "error.main"
              }
              sx={{ fontWeight: "bold" }}
            >
              {message}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default StorePage;
