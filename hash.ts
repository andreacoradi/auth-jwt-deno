import { hmac } from "https://denopkg.com/chiefbiiko/hmac@v1.0.2/mod.ts";
export const hash = (string: any) => {
  return hmac(
    "sha256",
    Deno.env.get("SALT")!,
    string,
    "utf8",
    "hex",
  );
};
