export function capitalize(text: string) {
  return `${text.substring(0, 1).toUpperCase()}${text.substring(1).toLowerCase()}`;
}

export function lowercase(text: string) {
  return text.toLowerCase();
}
