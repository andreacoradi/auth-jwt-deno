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
