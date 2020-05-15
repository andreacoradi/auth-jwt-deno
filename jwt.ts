import {
  makeJwt,
  setExpiration,
  Jose,
  Payload,
} from "https://deno.land/x/djwt@v0.9.0/create.ts";
import { validateJwt } from "https://deno.land/x/djwt@v0.9.0/validate.ts";

const SALT = Deno.env.get("SALT");

if (SALT === "") {
  console.error("No Salt provided!");
  Deno.exit(1);
}

export const create = async (username: string) => {
  const claims: Payload = {
    iss: username,
    exp: setExpiration(new Date().getTime() + 60 * 60 * 1000),
  };
  const header: Jose = {
    alg: "HS512",
    typ: "JWT",
  };
  return makeJwt({ key: SALT!, header: header, payload: claims });
};

export const validate = async (token: string) => {
  return await validateJwt(
    token,
    SALT!,
    { isThrowing: false },
  );
};
