// METACRITIC COLOR SCALE - CUSTOM HEX MATCHING THEIR ACTUAL SCORE BADGE COLORS
// GREEN 75+, YELLOW 50-74, RED BELOW 50
export function getMetascoreColor(score) {
  if (score >= 75) return "#6c3";
  if (score >= 50) return "#fc3";
  return "#f00";
}

// STEAM REVIEW COLOR SCALE - MATCHES ON STEAM'S ACTUAL TIER NAMES RATHER THAN
// A PERCENT CUTOFF, SINCE STEAM ITSELF CATEGORIZES BY THESE NAMED TIERS.
// "MOSTLY POSITIVE" IS CONFIRMED LIGHT BLUE; OTHER TIERS FOLLOW STEAM'S GENERAL
// GREEN (POSITIVE) -> TAN (MIXED) -> RED (NEGATIVE) PROGRESSION.
export function getSteamRatingColor(ratingText) {
  switch (ratingText) {
    case "Overwhelmingly Positive":
    case "Very Positive":
    case "Positive":
      return "#66bb6a"; // green
    case "Mostly Positive":
      return "#64b5f6"; // light blue
    case "Mixed":
      return "#ffca28"; // yellow/tan
    case "Mostly Negative":
      return "#ff8a65"; // orange
    case "Negative":
    case "Overwhelmingly Negative":
      return "#e57373"; // red
    default:
      return "#a1882c"; // fallback tan for any unrecognized tier text
  }
}

// HOT/COLD GUESS COLOR SCALE - CUSTOM HEX, NOT MUI THEME COLORS
// CLOSER TO THE ACTUAL PRICE = HOTTER (RED). FARTHER = COLDER (BLUE).
// BLUE INSTEAD OF GREEN FOR COLD SO IT DOESN'T READ AS "GOOD" LIKE THE RATING COLORS ABOVE.
export function getTemperatureColor(diff) {
  if (diff <= 3) return "#d32f2f"; // red - within $1-3
  if (diff <= 5) return "#f57c00"; // orange - within $5
  if (diff <= 10) return "#fbc02d"; // yellow - within $10
  if (diff <= 20) return "#64b5f6"; // blue - within $20
  return "#1565c0"; // colder blue - $30+
}