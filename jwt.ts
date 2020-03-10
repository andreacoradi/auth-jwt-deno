import makeJwt, { setExpiration } from "https://deno.land/x/djwt/create.ts";
import validateJwt from "https://deno.land/x/djwt/validate.ts";

const env = Deno.env();

export const create = async (username: string) => {
  const claims = {
    iss: username,
    exp: setExpiration(new Date().getTime() + 60 * 60 * 1000)
  };
  const header = {
    alg: "HS512",
    typ: "JWT"
  };
  return makeJwt(header, claims, env.SALT);
};

export const validate = async (token: string) => {
  return await validateJwt(
    token,
    env.SALT,
    false
  );
};
