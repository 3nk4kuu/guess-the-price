import { useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import HowToPlay from "./HowToPlay";
import { surfaceGrey, titleGrey, cardDarkGrey, outlineColor, outlineWidth } from "./theme";

function Header({ difficulty, onDifficultyChange, gamesPerRound }) {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 4,
        mx: "auto",
        width: "100%",
      }}
    >
      <Typography
        variant="h2"
        component="div"
        className="site-title"
        sx={{ color: titleGrey, fontWeight: "bold" }}
      >
        Checkout Champion
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <FormControl sx={{ width: 200, bgcolor: cardDarkGrey }}>
          <InputLabel id="game-difficulty">Difficulty</InputLabel>
          <Select
            labelId="game-difficulty"
            id="difficulty-select"
            value={difficulty}
            label="Difficulty"
            onChange={(diff) => onDifficultyChange(diff.target.value)}
            sx={{ bgcolor: cardDarkGrey, height: 56 }}
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <IconButton
          aria-label="How to play"
          onClick={() => setHowToPlayOpen(true)}
          sx={{
            height: 56,
            width: 56,
            borderRadius: 1,
            border: `${outlineWidth} solid ${outlineColor}`,
            bgcolor: surfaceGrey,
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>?</Typography>
        </IconButton>
      </Box>

      <Dialog open={howToPlayOpen} onClose={() => setHowToPlayOpen(false)}>
        <HowToPlay gamesPerRound={gamesPerRound} />
      </Dialog>
    </Box>
  );
}

export default Header;