import type { SearchEngine } from "../../../shared/types";
import { getDisplayUrl, getFaviconUrl, getNameFromUrl, getNormalizedUrl } from "../../../shared/url";

type DiscoveredSearchEngine = SearchEngine & {
  discoveryMethod: "opensearch" | "form" | "preset" | "fallback";
};

type BrowserPermissions = {
  contains: (permissions: { origins: string[] }, callback: (result: boolean) => void) => void;
  request: (permissions: { origins: string[] }, callback: (granted: boolean) => void) => void;
};

const searchInputNames = ["q", "query", "keyword", "wd", "text", "search", "s", "p"];

export async function discoverSearchEngineFromUrl(inputUrl: string, preset?: Omit<SearchEngine, "displayUrl">): Promise<DiscoveredSearchEngine> {
  const normalizedUrl = getNormalizedUrl(inputUrl);
  const siteUrl = new URL(normalizedUrl);
  const displayUrl = getDisplayUrl(normalizedUrl);

  await requestHostPermission(siteUrl);

  const pageHtml = await fetchText(siteUrl.href);
  const document = new DOMParser().parseFromString(pageHtml, "text/html");
  const pageTitle = getPageTitle(document, displayUrl);

  const openSearchEngine = await discoverFromOpenSearch(document, siteUrl, pageTitle, displayUrl);

  if (openSearchEngine) {
    return openSearchEngine;
  }

  const formEngine = discoverFromSearchForm(document, siteUrl, pageTitle, displayUrl);

  if (formEngine) {
    return formEngine;
  }

  if (preset) {
    return {
      ...preset,
      displayUrl,
      discoveryMethod: "preset",
    };
  }

  return {
    name: pageTitle,
    icon: getEngineIcon(displayUrl),
    action: `${siteUrl.origin}/search`,
    displayUrl,
    queryName: "q",
    urlTemplate: `${siteUrl.origin}/search?q=%s`,
    discoveryMethod: "fallback",
  };
}

export function createPresetSearchEngine(inputUrl: string, preset: Omit<SearchEngine, "displayUrl">): DiscoveredSearchEngine {
  const displayUrl = getDisplayUrl(inputUrl);

  return {
    ...preset,
    displayUrl,
    discoveryMethod: "preset",
  };
}

export function createFallbackSearchEngine(inputUrl: string): DiscoveredSearchEngine {
  const normalizedUrl = getNormalizedUrl(inputUrl);
  const siteUrl = new URL(normalizedUrl);
  const displayUrl = getDisplayUrl(normalizedUrl);

  return {
    name: getNameFromUrl(displayUrl),
    icon: getEngineIcon(displayUrl),
    action: `${siteUrl.origin}/search`,
    displayUrl,
    queryName: "q",
    urlTemplate: `${siteUrl.origin}/search?q=%s`,
    discoveryMethod: "fallback",
  };
}

function discoverFromSearchForm(document: Document, siteUrl: URL, pageTitle: string, displayUrl: string): DiscoveredSearchEngine | null {
  const forms = [...document.querySelectorAll("form")];

  for (const form of forms) {
    const input = findSearchInput(form);

    if (!input?.name) {
      continue;
    }

    const actionUrl = new URL(form.getAttribute("action") || siteUrl.href, siteUrl.href);
    actionUrl.searchParams.set(input.name, "%s");

    return {
      ...createSearchEngineFromTemplate(actionUrl.href, pageTitle, displayUrl),
      discoveryMethod: "form",
    };
  }

  return null;
}

async function discoverFromOpenSearch(document: Document, siteUrl: URL, pageTitle: string, displayUrl: string): Promise<DiscoveredSearchEngine | null> {
  const openSearchLink = [...document.querySelectorAll<HTMLLinkElement>("link[rel~='search']")].find((link) =>
    link.type.toLowerCase().includes("opensearchdescription+xml"),
  );

  if (!openSearchLink?.href) {
    return null;
  }

  const openSearchUrl = new URL(openSearchLink.getAttribute("href") || openSearchLink.href, siteUrl.href);
  const xmlText = await fetchText(openSearchUrl.href);
  const xml = new DOMParser().parseFromString(xmlText, "application/xml");
  const template = [...xml.querySelectorAll("Url")]
    .find((url) => (url.getAttribute("type") || "text/html").includes("text/html"))
    ?.getAttribute("template");

  if (!template?.includes("{searchTerms}")) {
    return null;
  }

  const name = xml.querySelector("ShortName")?.textContent?.trim() || pageTitle;

  return {
    ...createSearchEngineFromTemplate(template.replaceAll("{searchTerms}", "%s"), name, displayUrl),
    discoveryMethod: "opensearch",
  };
}

function createSearchEngineFromTemplate(template: string, name: string, displayUrl: string): SearchEngine {
  const normalizedTemplate = normalizeSearchTemplate(template);
  const token = "__DAISYTAB_SEARCH_TERMS__";
  const templateUrl = new URL(normalizedTemplate.replace("%s", token));
  const queryName = findSearchParamName(templateUrl, token) ?? "q";

  return {
    name,
    icon: getEngineIcon(displayUrl),
    action: `${templateUrl.origin}${templateUrl.pathname}`,
    displayUrl,
    queryName,
    urlTemplate: normalizedTemplate,
  };
}

function findSearchInput(form: HTMLFormElement) {
  const inputs = [...form.querySelectorAll<HTMLInputElement>("input[name]")];
  const typedSearchInput = inputs.find((input) => input.type === "search");

  if (typedSearchInput) {
    return typedSearchInput;
  }

  return inputs.find((input) => searchInputNames.includes(input.name.toLowerCase())) ?? null;
}

function findSearchParamName(url: URL, token: string) {
  for (const [name, value] of url.searchParams) {
    if (value.includes(token)) {
      return name;
    }
  }

  return null;
}

function getEngineIcon(displayUrl: string) {
  const simpleIconName = displayUrl.split(".").at(-2);

  return simpleIconName ? `simple-icons:${simpleIconName}` : "ph:globe";
}

function getPageTitle(document: Document, displayUrl: string) {
  return document.querySelector("title")?.textContent?.trim() || getNameFromUrl(displayUrl);
}

function normalizeSearchTemplate(template: string) {
  return template.replace(/\{searchTerms\??\}/g, "%s").replace("%7BsearchTerms%7D", "%s");
}

async function fetchText(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.text();
}

async function requestHostPermission(url: URL) {
  const chromeWithPermissions = (globalThis as { chrome?: { permissions?: BrowserPermissions } }).chrome;
  const permissions = chromeWithPermissions?.permissions;

  if (!permissions) {
    return;
  }

  const originPattern = `${url.origin}/*`;
  const hasPermission = await new Promise<boolean>((resolve) => {
    permissions.contains({ origins: [originPattern] }, resolve);
  });

  if (hasPermission) {
    return;
  }

  const granted = await new Promise<boolean>((resolve) => {
    permissions.request({ origins: [originPattern] }, resolve);
  });

  if (!granted) {
    throw new Error("Host permission denied");
  }
}
