export const absoluteUrl = (path: string): string =>
  new URL(path, process.env.NEXT_PUBLIC_APP_URL).href;
