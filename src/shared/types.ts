export type SearchEngine = {
  name: string;
  icon: string;
  action: string;
  displayUrl: string;
  queryName: string;
};

export type Bookmark = {
  name: string;
  url: string;
  displayUrl: string;
  iconUrl: string;
};

export type ThemeMode = "light" | "dark" | "system";

export type AppSettings = {
  openInNewWindow: boolean;
  isSearchHistoryEnabled: boolean;
  isBookmarkEnabled: boolean;
  themeMode: ThemeMode;
};
