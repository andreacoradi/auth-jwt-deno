# JWT Authentication with Deno
## JWT
JSON Web Tokens ([jwt](https://jwt.io/)) are an open, industry standard method for representing claims securely between two parties.

This was accomplished with the library [djwt](https://github.com/timonson/djwt).

## REST API
Instead of [express](https://expressjs.com/it/) used with node, I chose the [oak](https://github.com/oakserver/oak) web framework.

## Deno
This was an experiment to port an existing node project to [deno](https://deno.land/).

I'm quite happy with how it came out, and I hope you can enjoy it as well :^).

## Running
Deno is secure by default, so it's required to add some flags:

	deno --allow-net --allow-read --allow-write --allow-env server.ts
