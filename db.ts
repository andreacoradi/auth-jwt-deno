const getData = async () => {
  const data = await Deno.readFile("./db.json");
  const decoder = new TextDecoder();
  const decodedData = decoder.decode(data);
  return JSON.parse(decodedData);
};

const writeData = async (data: any): Promise<void> => {
  const encoder = new TextEncoder();
  await Deno.writeFile("./db.json", encoder.encode(JSON.stringify(data)));
};

export const addUser = async (user: any) => {
  const db = await getData();
  db["users"].push(user);
  writeData(db);
};

export const getUser = async (username: string) => {
  const db = await getData();
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
  const db = await getData();
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
  const db = await getData();
  db["users"].forEach((u: any) => {
    if (u.username === username) {
      u["token"] = token
      return;
    }
  });
  writeData(db)
}
