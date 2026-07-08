import { createTheme } from "@mui/material/styles";

const pixelFont = "'Geist Pixel', 'Geist', system-ui, sans-serif";

// SHARED SURFACE COLOR - USED FOR CARD BACKGROUNDS (MESSAGE CARD, RESULTS CARDS,
// HOW TO PLAY), AND PROGRESS DOTS SO THEY READ AS THE SAME "SURFACE" LAYER ON
// TOP OF THE DARKER PAGE BACKGROUND
export const surfaceGrey = "#545b69";

// DARKER GREY - A LITTLE DARKER THAN THE BOTTOM OF THE PAGE GRADIENT (#14161c) -
// USED FOR THE GAME CARD AND THE DIFFICULTY SELECTOR SO THEY MATCH EXACTLY
export const cardDarkGrey = "#12141a";

// DARKER STILL THAN cardDarkGrey - USED FOR THE SCREENSHOT PREV/NEXT ARROW BUTTONS
// SO THEY READ AS A DISTINCT, RECESSED CONTROL ON TOP OF THE GAME CARD
export const arrowDarkGrey = "#08090b";

// LIGHT GREY USED FOR THE SITE TITLE, ALL BUTTON TEXT, AND ARROW ICONS SO
// EVERYTHING READS CONSISTENTLY ON THE DARK BACKGROUND
export const titleGrey = "#e4e6ea";

// SHARED OUTLINE STYLE - SAME COLOR/THICKNESS ON THE GAME CARD, EVERY BUTTON,
// THE DIFFICULTY SELECTOR, AND THE HELP BUTTON SO ALL OUTLINES MATCH SITE-WIDE
export const outlineColor = "rgba(228, 230, 234, 0.3)";
export const outlineWidth = "2px";

// SITE-WIDE DARK THEME - MATCHES THE MAIN GAME PANEL COLOR EVERYWHERE ON THE SITE
// BACKGROUND IS TRANSPARENT SO THE DITHERED GRADIENT IN index.css SHOWS THROUGH
export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4caf50" },
    success: { main: "#4caf50", dark: "#388e3c" },
    background: { default: "transparent", paper: surfaceGrey },
  },
  typography: {
    // PIXEL FONT ON EVERYTHING, NOT JUST HEADINGS
    fontFamily: pixelFont,
  },
  components: {
    // SAME BORDER ON EVERY CARD (GAME CARD, MESSAGE CARD, RESULTS CARDS, HOW TO PLAY)
    MuiCard: {
      styleOverrides: {
        root: {
          border: `${outlineWidth} solid ${outlineColor}`,
        },
      },
    },
    // SAME BORDER ON EVERY BUTTON, PLUS BOLD LIGHT-GREY TEXT ON ALL OF THEM
    MuiButton: {
      styleOverrides: {
        root: {
          border: `${outlineWidth} solid ${outlineColor}`,
          color: titleGrey,
          fontWeight: "bold",
        },
      },
    },
    // SAME BORDER ON THE DIFFICULTY SELECTOR'S OUTLINE (COVERS ANY OUTLINED
    // TEXT FIELD/SELECT SITE-WIDE) - KEPT CONSISTENT ACROSS DEFAULT/HOVER/FOCUS
    // SO IT DOESN'T SWITCH TO MUI'S DEFAULT BLUE FOCUS COLOR
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderWidth: outlineWidth,
          borderColor: outlineColor,
        },
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: outlineColor,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: outlineColor,
            borderWidth: outlineWidth,
          },
        },
      },
    },
  },
});