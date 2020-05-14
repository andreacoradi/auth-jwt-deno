import { hmac } from "https://denopkg.com/chiefbiiko/hmac/mod.ts";
export const hash = (string: any) => {
  return hmac(
    "sha256",
    Deno.env().SALT,
    string,
    "utf8",
    "hex"
  );
};