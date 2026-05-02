const tempDiv = document.createElement("div");

export function sanitizeInput(text) {
  if (!text) return "";
  tempDiv.textContent = text;
  const sanitized = tempDiv.innerHTML;
  tempDiv.textContent = "";
  return sanitized;
}
