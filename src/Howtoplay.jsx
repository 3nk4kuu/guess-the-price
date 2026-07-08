import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

function HowToPlay({ gamesPerRound }) {
  return (
    <Card sx={{ maxWidth: 600, mx: "auto" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          How to Play
        </Typography>
        <Typography sx={{ mb: 2, lineHeight: 1.6 }}>
          You'll be shown {gamesPerRound} real games from the Steam store with
          their screenshots, description, release date, and review scores.
          Your job is to guess the current price of the game.
        </Typography>
        <List sx={{ pl: 1 }}>
          <ListItem disableGutters sx={{ display: "list-item", pl: 1, mb: 1.5 }}>
            <ListItemText
              slotProps={{ primary: { sx: { lineHeight: 1.6 } } }}
              primary="Enter a whole dollar guess (no cents needed) and press Enter or click 'Add to Cart'."
            />
          </ListItem>
          <ListItem disableGutters sx={{ display: "list-item", pl: 1, mb: 1.5 }}>
            <ListItemText
              slotProps={{ primary: { sx: { lineHeight: 1.6 } } }}
              primary="You get 3 tries per game. You're marked correct if your guess rounds to the actual price (e.g. if a game is 9.99, guessing 10 or 9 will count as correct)."
            />
          </ListItem>
          <ListItem disableGutters sx={{ display: "list-item", pl: 1, mb: 1.5 }}>
            <ListItemText
              slotProps={{ primary: { sx: { lineHeight: 1.6 } } }}
              primary={`After ${gamesPerRound} games, see how your guesses stacked up against the real total on the results screen.`}
            />
          </ListItem>
          <ListItem disableGutters sx={{ display: "list-item", pl: 1 }}>
            <ListItemText
              slotProps={{ primary: { sx: { lineHeight: 1.6 } } }}
              primary="Difficulty changes which games you'll see: Easy will have some well-known hits, Hard dives into more obscure titles."
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}

export default HowToPlay;