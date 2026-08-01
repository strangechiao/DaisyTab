import type { SearchEngine } from "../../../shared/types";

export const defaultSearchEngines: SearchEngine[] = [
  {
    name: "Google",
    icon: "fe:google",
    action: "https://www.google.com/search",
    displayUrl: "google.com",
    queryName: "q",
  },
];

export const enginePresets: Record<string, Omit<SearchEngine, "displayUrl">> = {
  "google.com": {
    name: "Google",
    icon: "fe:google",
    action: "https://www.google.com/search",
    queryName: "q",
  },
  "bing.com": {
    name: "Bing",
    icon: "simple-icons:microsoftbing",
    action: "https://www.bing.com/search",
    queryName: "q",
  },
  "baidu.com": {
    name: "Baidu",
    icon: "simple-icons:baidu",
    action: "https://www.baidu.com/s",
    queryName: "wd",
  },
  "duckduckgo.com": {
    name: "DuckDuckGo",
    icon: "simple-icons:duckduckgo",
    action: "https://duckduckgo.com/",
    queryName: "q",
  },
  "search.brave.com": {
    name: "Brave",
    icon: "simple-icons:brave",
    action: "https://search.brave.com/search",
    queryName: "q",
  },
  "search.yahoo.com": {
    name: "Yahoo",
    icon: "simple-icons:yahoo",
    action: "https://search.yahoo.com/search",
    queryName: "p",
  },
  "yandex.com": {
    name: "Yandex",
    icon: "simple-icons:yandexcloud",
    action: "https://yandex.com/search/",
    queryName: "text",
  },
  "github.com": {
    name: "GitHub",
    icon: "simple-icons:github",
    action: "https://github.com/search",
    queryName: "q",
  },
  "developer.mozilla.org": {
    name: "MDN",
    icon: "simple-icons:mdnwebdocs",
    action: "https://developer.mozilla.org/search",
    queryName: "q",
  },
};
