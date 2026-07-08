import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getMetascoreColor, getSteamRatingColor } from "./ratingColors";
import { arrowDarkGrey, cardDarkGrey, titleGrey } from "./theme";

function GameCard({
  game,
  extraData,
  guess,
  onGuessChange,
  onKeyDown,
  onSubmitGuess,
  isCorrect,
  attemptsCount,
  inputRef,
}) {
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const activeThumbRef = useRef(null);

  // RESET SCREENSHOTS CAROUSEL WHEN NEW GAME LOADED
  useEffect(() => {
    setScreenshotIndex(0);
  }, [extraData.screenshots]);

  // scroll active sc into view when changed
  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [screenshotIndex]);

  const handlePrevImage = () => {
    setScreenshotIndex(
      (prev) =>
        (prev - 1 + extraData.screenshots.length) %
        extraData.screenshots.length,
    );
  };
  const handleNextImage = () => {
    setScreenshotIndex((prev) => (prev + 1) % extraData.screenshots.length);
  };

  return (
    <Card
      sx={{
        minWidth: 275,
        maxWidth: "65%",
        mx: "auto",
        bgcolor: cardDarkGrey,
      }}
    >
      <CardContent sx={{ py: 3, px: 4 }}>
        {/* TITLE */}
        <Typography
          variant="h3"
          component="div"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          {game.title}
        </Typography>

        {/* SCREENSHOT & INFO */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* SCREENSHOT CAROUSEL/LOADING BLOCK */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {extraData.screenshots.length > 0 ? (
              <Box sx={{ width: "100%" }}>
                <Box
                  component="img"
                  src={extraData.screenshots[screenshotIndex]}
                  alt={`Screenshot ${screenshotIndex + 1}`}
                  sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    objectFit: "contain",
                    bgcolor: "grey.900",
                    borderRadius: 1,
                    display: "block",
                  }}
                />

                {/* SCREENSHOT THUMBNAILS W/ PREV/NEXT ARROWS */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 1,
                  }}
                >
                  <IconButton
                    onClick={handlePrevImage}
                    disabled={extraData.screenshots.length <= 1}
                    sx={{
                      borderRadius: 1,
                      flexShrink: 0,
                      bgcolor: arrowDarkGrey,
                      color: titleGrey,
                      height: 45,
                      minHeight: 45,
                      maxHeight: 45,
                      py: 0,
                      px: 1,
                      boxSizing: "border-box",
                    }}
                  >
                    <ChevronLeftIcon />
                  </IconButton>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      overflowX: "auto",
                      pb: 0.5,
                      flexGrow: 1,
                    }}
                  >
                    {extraData.screenshots.map((url, index) => (
                      <Box
                        key={index}
                        ref={index === screenshotIndex ? activeThumbRef : null}
                        component="img"
                        src={url}
                        alt={`Screenshot thumbnail ${index + 1}`}
                        onClick={() => setScreenshotIndex(index)}
                        sx={{
                          width: 80,
                          height: 45,
                          objectFit: "cover",
                          borderRadius: 1,
                          flexShrink: 0,
                          cursor: "pointer",
                          opacity: index === screenshotIndex ? 1 : 0.5,
                          border: 2,
                          borderColor:
                            index === screenshotIndex
                              ? "primary.main"
                              : "transparent",
                        }}
                      />
                    ))}
                  </Box>

                  <IconButton
                    onClick={handleNextImage}
                    disabled={extraData.screenshots.length <= 1}
                    sx={{
                      borderRadius: 1,
                      flexShrink: 0,
                      bgcolor: arrowDarkGrey,
                      color: titleGrey,
                      height: 45,
                      minHeight: 45,
                      maxHeight: 45,
                      py: 0,
                      px: 1,
                      boxSizing: "border-box",
                    }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </Box>
              </Box>
            ) : game.thumb ? (
              <Box
                component="img"
                src={game.thumb}
                alt={game.title}
                sx={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "contain",
                  bgcolor: "grey.900",
                  borderRadius: 1,
                  display: "block",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "16/9",
                  bgcolor: "grey.300",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                }}
              >
                <Typography color="text.secondary">
                  {extraData.description
                    ? "Image Unavailable"
                    : "Loading Media..."}
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* DESCRIPTION */}
            <Box
              sx={{
                flexGrow: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
                Description
              </Typography>
              {extraData.description ? (
                <Typography
                  color="text.secondary"
                  sx={{
                    flexGrow: 1,
                    minHeight: 0,
                    maxHeight: "20vh",
                    overflowY: "auto",
                    pr: 1,
                  }}
                >
                  {extraData.description}
                </Typography>
              ) : (
                <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                  No description available.
                </Typography>
              )}
            </Box>

            {/* RELEASE DATE */}
            <Typography variant="body2" color="text.secondary">
              <Box component="span" sx={{ fontWeight: "bold" }}>
                Release Date:
              </Box>{" "}
              {new Date(game.releaseDate * 1000).toLocaleDateString()}
            </Typography>

            {/* RATING BADGES */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "stretch" }}>
              <Box
                sx={{
                  flex: 1,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Steam Reviews
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: getSteamRatingColor(game.steamRatingPercent),
                    fontWeight: "bold",
                  }}
                >
                  {game.steamRatingText} ({game.steamRatingPercent}%)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {game.steamRatingCount} reviews
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 64,
                  borderRadius: 1,
                  p: 1,
                  bgcolor:
                    game.metacriticScore > 0
                      ? getMetascoreColor(game.metacriticScore)
                      : "grey.300",
                }}
              >
                <Typography variant="body2" sx={{ color: "white" }}>
                  Metascore
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  {game.metacriticScore > 0 ? game.metacriticScore : "N/A"}
                </Typography>
              </Box>
            </Box>

            {/* GUESS INPUT */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mt: "auto",
              }}
            >
              <TextField
                variant="filled"
                hiddenLabel
                value={guess}
                onChange={onGuessChange}
                onKeyDown={onKeyDown}
                disabled={isCorrect || attemptsCount >= 3}
                fullWidth
                inputRef={inputRef}
                autoComplete="off"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                }}
              />
              {/* SUBMIT GUESS */}
              <Button
                variant="contained"
                color="success"
                size="large"
                fullWidth
                onClick={onSubmitGuess}
                disabled={isCorrect || attemptsCount >= 3}
                sx={{ height: 56 }}
              >
                Add To Cart
              </Button>
            </Box>

            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              sx={{ fontWeight: "bold" }}
            >
              {3 - attemptsCount} tries remaining
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default GameCard;