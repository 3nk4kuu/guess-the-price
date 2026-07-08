import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { getSteamRatingColor } from "./ratingColors";

// ONE ROW IN THE CART - THUMBNAIL, REVIEW INFO, GUESSED VS ACTUAL PRICE
function CartItem({ game, guess, isCorrect }) {
  const actualPrice = parseFloat(game.normalPrice);

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 1.5,
        mb: 1.5,
      }}
    >
      {/* THUMBNAIL */}
      <Box
        component="img"
        src={game.thumb}
        alt={game.title}
        sx={{
          width: 90,
          height: 45,
          objectFit: "contain",
          bgcolor: "grey.900",
          borderRadius: 1,
          flexShrink: 0,
        }}
      />

      {/* TITLE + REVIEW INFO */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" noWrap>
          {game.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Box
            component="span"
            sx={{
              color: getSteamRatingColor(game.steamRatingPercent),
              fontWeight: "bold",
            }}
          >
            {game.steamRatingText} ({game.steamRatingPercent}%)
          </Box>{" "}
          &middot; {game.steamRatingCount} reviews
        </Typography>
      </Box>

      {/* GUESSED PRICE VS ACTUAL PRICE */}
      <Box sx={{ textAlign: "right", flexShrink: 0, minWidth: 90 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textDecoration: "line-through" }}
        >
          {guess !== null ? `$${guess.toFixed(2)}` : "—"}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            color: isCorrect ? "success.main" : "error.main",
          }}
        >
          ${actualPrice}
        </Typography>
      </Box>
    </Card>
  );
}

function ResultsPage({ games, guesses, results }) {
  const estimatedTotal = guesses.reduce((sum, g) => sum + (g ?? 0), 0);
  const actualTotal = games.reduce(
    (sum, game) => sum + parseFloat(game.normalPrice),
    0,
  );
  const correctCount = results.filter((result) => result === true).length;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 260px",
        columnGap: 3,
        rowGap: 2,
        maxWidth: "60%",
        mx: "auto",
        width: "100%",
      }}
    >
      {/* HEADER ROW */}
      <Box>
        <Typography variant="h4">Your Cart</Typography>
        <Typography variant="body2" color="text.secondary">
          {games.length} items
        </Typography>
      </Box>
      <Typography variant="h5">Game Summary</Typography>

      {/* CART ITEMS */}
      <Box>
        {games.map((game, index) => (
          <CartItem
            key={game.title}
            game={game}
            guess={guesses[index]}
            isCorrect={results[index]}
          />
        ))}
      </Box>

      {/* GAME SUMMARY */}
      <Card sx={{ position: "sticky", top: 16, alignSelf: "start" }}>
        <CardContent>
          <Typography
            variant="body1"
            color="success.main"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            You guessed {correctCount}/{games.length} correctly!
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography color="text.secondary">Estimated Price</Typography>
            <Typography sx={{ textDecoration: "line-through" }}>
              ${estimatedTotal.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary">Actual Price</Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              ${actualTotal.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ResultsPage;