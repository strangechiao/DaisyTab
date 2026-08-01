export function getNormalizedUrl(value: string) {
  return value.includes("://") ? value : `https://${value}`;
}

export function getDisplayUrl(value: string) {
  return new URL(getNormalizedUrl(value)).hostname.replace(/^www\./, "");
}

export function getFaviconUrl(displayUrl: string) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(displayUrl)}&sz=64`;
}

export function getNameFromUrl(displayUrl: string) {
  return (
    displayUrl
      .split(".")
      .filter(Boolean)
      .at(0)
      ?.replace(/^\w/, (letter) => letter.toUpperCase()) ?? displayUrl
  );
}

