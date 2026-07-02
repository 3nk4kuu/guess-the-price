import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function StorePage() {
  const [game, setGame] = useState(null);
  const [gameList, setGameList] = useState([]);

  const getRandomGame = () => {
    const randomPage = Math.floor(Math.random() * 50);

    fetch(
      `https://www.cheapshark.com/api/1.0/deals?storeID=1&pageNumber=${randomPage}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setGameList(data);

        const popularGames = data.filter(
          (item) => parseInt(item.steamRatingCount) >= 5000,
        );

        if (popularGames.length > 0) {
          const randomIndex = Math.floor(Math.random() * popularGames.length);
          const selectedGame = popularGames[randomIndex];

          console.log("Found a popular game:", selectedGame);
          setGame(selectedGame);
        } else {
          console.log(
            "No games with 5000+ reviews on page",
            randomPage,
            "- rerolling!",
          );
          getRandomGame();
        }
      })
      .catch((error) => console.error(error));
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
        Start Guessing
      </Button>

      {game && (
        <Card sx={{ minWidth: 275, maxWidth: 500, mx: "auto" }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              {game.title}
            </Typography>

            {/* <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Original Price:</strong> ${game.normalPrice}
            </Typography> */}

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Release Date:</strong>{" "}
              {new Date(game.releaseDate * 1000).toLocaleDateString()}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Steam Rating:</strong> {game.steamRatingText} (
              {game.steamRatingPercent}%)
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Steam Review Count:</strong> {game.steamRatingCount}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default StorePage;
