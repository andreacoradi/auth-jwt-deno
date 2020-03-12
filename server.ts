import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { addUser, getUser, getUsername, setToken } from "./db.ts";
import { hash } from "./hash.ts";
import { create, validate } from "./jwt.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

const router = new Router();
router
  .get("/", ctx => {
    ctx.response.body = "It works!";
  })
  .get("/auth", async ctx => {
    const token = ctx.request.headers.get("x-access-token");

    if (!token) {
      ctx.response.status = 403;
      ctx.response.body = {
        msg: "Unauthorized"
      };
      return;
    }
    const valid = await validate(token);
    if (!valid) {
      ctx.response.status = 403;
      ctx.response.body = {
        msg: "Unauthorized"
      };
      return;
    }
    const username = await getUsername(token);
    if (username === "") {
      ctx.response.status = 403;
      ctx.response.body = {
        msg: "Unauthorized"
      };
      return;
    }

    ctx.response.body = {
      username: username
    };
  })
  .post("/users", async ctx => {
    let body;
    try {
      body = (await ctx.request.body());
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        msg: "Invalid body format"
      };
      return;
    }

    let username;
    let password;
    try {
      const v = JSON.parse(body.value);
      username = v.username;
      password = v.password;
    } catch (error) {
      console.log(error);
    }

    if (!username || !password) {
      ctx.response.status = 400;
      ctx.response.body = {
        msg: "You need to provide username and password"
      };
      return;
    }

    if (await getUser(username) !== null) {
      ctx.response.status = 400;
      ctx.response.body = {
        msg: "User already exists"
      };
      return;
    }

    const hashedPassword = hash(password);

    const user = {
      username,
      hashedPassword
    };

    addUser(user);
    ctx.response.body = user;
  })
  .post("/users/:username", async ctx => {
    const username = ctx.params.username;

    let body;
    try {
      body = (await ctx.request.body());
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        msg: "Invalid body format"
      };
      return;
    }

    let password;
    try {
      const v = body.value;
      password = v.password;
    } catch (error) {
      console.log(error);
    }
    if (!password) {
      password = (JSON.parse(body.value)).password;
    }

    if (!password) {
      ctx.response.status = 400;
      ctx.response.body = {
        msg: "You need to provide a password"
      };
      return;
    }

    const user = await getUser(username!);
    if (!user) {
      ctx.response.status = 400;
      ctx.response.body = {
        msg: `No user found with username: '${username}'`
      };
      return;
    }

    const authenticated = hash(password) === user["hashedPassword"];

    let jwt;
    if (authenticated) {
      jwt = await create(username!);
      setToken(username!, jwt);
    }
    ctx.response.body = {
      authenticated,
      jwt
    };
  });

const app = new Application();
app.use(async (ctx, next) => {
  ctx.response.headers.append("access-control-allow-origin", "*");
  ctx.response.headers.append(
    "access-control-allow-headers",
    "Origin, X-Requested-With, Content-Type, Accept, Range"
  );
  await next();
});
app.use(router.routes());
app.use(router.allowedMethods());

const DEFAULT_PORT = 8080;

const argPort = parse(Deno.args).port;

const port = argPort ? Number(argPort) : DEFAULT_PORT;

console.log("Listening on http://localhost:" + port);
await app.listen({ port: port });
