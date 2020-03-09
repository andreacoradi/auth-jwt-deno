import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { addUser, getUser } from "./db.ts";
import { hash } from "./hash.ts";
import { create, validate } from "./jwt.ts";

const router = new Router();
router
  .get("/", ctx => {
    ctx.response.body = "It works!";
  })
  .get("/test", async ctx => {
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
    ctx.response.body = "Easy 🔓";
  })
  .post("/users", async ctx => {
    const { username, password } = (await ctx.request.body()).value;
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
    const password = (await ctx.request.body()).value.password;
    if (!username || !password) {
      ctx.response.status = 400;
      ctx.response.body = {
        msg: "You need to provide username and password"
      };
      return;
    }
    const user = await getUser(username);
    if (!user) {
      ctx.response.status = 400;
      ctx.response.body = {
        msg: `No user found with username: ${username}`
      };
      return;
    }
    const authenticated = hash(password) === user["hashedPassword"];
    const jwt = await create(username);
    ctx.response.body = {
      authenticated,
      jwt
    };
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.log("Listening on http://localhost:8080");
await app.listen({ port: 8080 });
