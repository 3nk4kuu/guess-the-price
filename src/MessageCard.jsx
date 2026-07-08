import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { getTemperatureColor } from "./ratingColors";

function MessageCard({ message, guessDiff }) {
  const isOngoingGuess =
    message === "Too low! Try again." || message === "Too high! Try again.";
  const showTemperature = isOngoingGuess && guessDiff !== null && guessDiff !== undefined;
  const temperatureColor = showTemperature
    ? getTemperatureColor(guessDiff)
    : null;

  return (
    <Card
      sx={{
        minWidth: 275,
        maxWidth: 500,
        mx: "auto",
        my: 3,
        visibility: message ? "visible" : "hidden",
        bgcolor: temperatureColor || "background.paper",
        transition: "background-color 0.3s ease",
      }}
    >
      <CardContent sx={{ textAlign: "center", py: 2 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            color: showTemperature ? "white" : "text.primary",
          }}
        >
          {message || " "}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MessageCard;