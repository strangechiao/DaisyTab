import type { SearchEngine } from "../../../shared/types";

export const defaultSearchEngines: SearchEngine[] = [
  {
    name: "Google",
    icon: "fe:google",
    action: "https://www.google.com/search",
    displayUrl: "google.com",
    queryName: "q",
    urlTemplate: "https://www.google.com/search?q=%s",
  },
];

export const enginePresets: Record<string, Omit<SearchEngine, "displayUrl">> = {
  "google.com": {
    name: "Google",
    icon: "fe:google",
    action: "https://www.google.com/search",
    queryName: "q",
    urlTemplate: "https://www.google.com/search?q=%s",
  },
  "bing.com": {
    name: "Bing",
    icon: "simple-icons:microsoftbing",
    action: "https://www.bing.com/search",
    queryName: "q",
    urlTemplate: "https://www.bing.com/search?q=%s",
  },
  "baidu.com": {
    name: "Baidu",
    icon: "simple-icons:baidu",
    action: "https://www.baidu.com/s",
    queryName: "wd",
    urlTemplate: "https://www.baidu.com/s?wd=%s",
  },
  "bilibili.com": {
    name: "Bilibili",
    icon: "simple-icons:bilibili",
    action: "https://search.bilibili.com/all",
    queryName: "keyword",
    urlTemplate: "https://search.bilibili.com/all?keyword=%s",
  },
  "search.bilibili.com": {
    name: "Bilibili",
    icon: "simple-icons:bilibili",
    action: "https://search.bilibili.com/all",
    queryName: "keyword",
    urlTemplate: "https://search.bilibili.com/all?keyword=%s",
  },
  "duckduckgo.com": {
    name: "DuckDuckGo",
    icon: "simple-icons:duckduckgo",
    action: "https://duckduckgo.com/",
    queryName: "q",
    urlTemplate: "https://duckduckgo.com/?q=%s",
  },
  "search.brave.com": {
    name: "Brave",
    icon: "simple-icons:brave",
    action: "https://search.brave.com/search",
    queryName: "q",
    urlTemplate: "https://search.brave.com/search?q=%s",
  },
  "search.yahoo.com": {
    name: "Yahoo",
    icon: "simple-icons:yahoo",
    action: "https://search.yahoo.com/search",
    queryName: "p",
    urlTemplate: "https://search.yahoo.com/search?p=%s",
  },
  "yandex.com": {
    name: "Yandex",
    icon: "simple-icons:yandexcloud",
    action: "https://yandex.com/search/",
    queryName: "text",
    urlTemplate: "https://yandex.com/search/?text=%s",
  },
  "github.com": {
    name: "GitHub",
    icon: "simple-icons:github",
    action: "https://github.com/search",
    queryName: "q",
    urlTemplate: "https://github.com/search?q=%s",
  },
  "developer.mozilla.org": {
    name: "MDN",
    icon: "simple-icons:mdnwebdocs",
    action: "https://developer.mozilla.org/search",
    queryName: "q",
    urlTemplate: "https://developer.mozilla.org/search?q=%s",
  },
};
