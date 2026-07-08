import * as WebBrowser from "expo-web-browser";
import { supabase } from "./supabase";

const REDIRECT_TO = "crewclock://auth/callback";

// Standard Expo + Supabase OAuth recipe: open the provider's consent screen in
// an in-app browser session, then manually complete the session from the
// redirect URL's token fragment (Supabase doesn't hand this back via routing
// the way the web PKCE flow does).
export async function signInWithOAuthProvider(provider: "google" | "apple" | "azure") {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: REDIRECT_TO, skipBrowserRedirect: true },
  });
  if (error || !data.url) throw error ?? new Error("Could not start sign-in");

  const result = await WebBrowser.openAuthSessionAsync(data.url, REDIRECT_TO);
  if (result.type !== "success" || !result.url) {
    throw new Error("Sign-in was cancelled");
  }

  const fragment = result.url.split("#")[1] ?? "";
  const params = new URLSearchParams(fragment);
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  if (!access_token || !refresh_token) throw new Error("Sign-in didn't complete");

  const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token });
  if (sessionError) throw sessionError;
}
