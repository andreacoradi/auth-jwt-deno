import makeJwt, {
  setExpiration,
  Jose,
  Payload } from "https://deno.land/x/djwt/create.ts";
import validateJwt from "https://deno.land/x/djwt/validate.ts";

const env = Deno.env();

export const create = async (username: string) => {
  const claims: Payload = {
    iss: username,
    exp: setExpiration(new Date().getTime() + 60 * 60 * 1000)
  };
  const header: Jose = {
    alg: "HS512",
    typ: "JWT"
  };
  return makeJwt({header: header, payload: claims}, env.SALT);
};

export const validate = async (token: string) => {
  return await validateJwt(
    token,
    env.SALT,
    false
  );
};
