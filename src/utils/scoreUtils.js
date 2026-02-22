export function getScoreColor(score) {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#eab308";
  if (score >= 30) return "#f97316";
  return "#ef4444";
}

export function getScoreLabel(score) {
  if (score >= 75) return "Saludable";
  if (score >= 50) return "Moderado";
  if (score >= 30) return "Poco saludable";
  return "Evitar";
}

export function getScoreEmoji(score) {
  if (score >= 75) return "🟢";
  if (score >= 50) return "🟡";
  if (score >= 30) return "🟠";
  return "🔴";
}
