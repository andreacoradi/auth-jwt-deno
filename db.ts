import { readJson, writeJson, readFileStr, exists } from "https://deno.land/std@v0.38.0/fs/mod.ts";

const DB_URL = "./db.json"

const initialize_db = async () => {
  await writeJson(DB_URL, { users: [] })
}

const getData = async (): Promise<any> => {
  if(!await exists(DB_URL) || (await readFileStr(DB_URL) == "")) {
    await initialize_db()
  }
  return  await readJson(DB_URL) as any
};

const writeData = async (data: any): Promise<void> => {
  await writeJson(DB_URL, data)
};

export const addUser = async (user: any) => {
  const db: any = await getData();
  db["users"].push(user);
  writeData(db);
};

export const getUser = async (username: string): Promise<any> => {
  const db: any = await getData();
  let user = null;
  db["users"].forEach((u: any) => {
    if (u.username === username) {
      user = u;
      return;
    }
  });
  return user;
};

export const getUsername = async (token: string) => {
  const db: any = await getData();
  let username = "";
  db["users"].forEach((u: any) => {
    if (u.token === token) {
      username = u.username;
      return;
    }
  });
  return username;
};

export const setToken = async (username: string, token: string) => {
  const db: any = await getData();
  db["users"].forEach((u: any) => {
    if (u.username === username) {
      u["token"] = token
      return;
    }
  });
  writeData(db)
}