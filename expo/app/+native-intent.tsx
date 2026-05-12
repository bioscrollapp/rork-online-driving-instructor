type RedirectArgs = {
  path: string;
  initial: boolean;
};

export function redirectSystemPath({ path, initial }: RedirectArgs): string {
  console.log("[native-intent] driving app redirect", { path, initial });
  return "/";
}
