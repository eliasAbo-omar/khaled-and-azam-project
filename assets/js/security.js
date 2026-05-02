export function sanitizeInput(text) {
  if (!text) return "";
  const tempDiv = document.createElement("div");

  tempDiv.textContent = text;
  return tempDiv.innerHTML;
}
