// METACRITIC COLORS
export function getMetascoreColor(score) {
  if (score >= 75) return "#6c3";
  if (score >= 50) return "#fc3";
  return "#f00";
}

// STEAM REVIEW COLORS
export function getSteamRatingColor(percent) {
  if (percent >= 70) return "#8bc53f";
  if (percent >= 40) return "#a1882c";
  return "#a34c25";
}

// HOT/COLD GUESS COLORS
export function getTemperatureColor(diff) {
  if (diff <= 1) return "#d32f2f"; // scorching - within $1
  if (diff <= 5) return "#f57c00"; // hot - within $5
  if (diff <= 10) return "#fbc02d"; // warm - within $10
  if (diff <= 20) return "#64b5f6"; // cool - within $20
  return "#1565c0"; // cold - $20+
}