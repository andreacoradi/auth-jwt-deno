FROM hayd/deno:0.38.0

WORKDIR /app

USER deno

ADD . /app

CMD ["-A", "server.ts"]