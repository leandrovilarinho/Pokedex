import serverlessMysql from "serverless-mysql";

const db = serverlessMysql({
  config: {
    host: "localhost",
    user: "root",
    password: "",
    database: "pokemon_favoritos",
    port: 3306,
  },
});

export async function query(query, values = []) {
  try {
    const results = await db.query(query, values);
    await db.end(); 
    return results;
  } catch (error) {
    console.error("Erro ao executar consulta:", error);
    throw error;
  }
}
