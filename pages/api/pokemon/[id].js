import { query } from "../../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query; 

  if (req.method === "GET") {
    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ erro: true, msg: "ID do Pokémon inválido ou não fornecido" });
    }

    try {
      const resultados = await query("SELECT * FROM favoritos WHERE pokemon_id = ?", [id]);

      if (resultados.length > 0) {
        res.status(200).json({ favoritado: true });
      } else {
        res.status(200).json({ favoritado: false });
      }
    } catch (erro) {
      console.error("Erro ao acessar o banco de dados:", erro.message);
      res
        .status(500)
        .json({
          erro: true,
          msg: "Erro ao acessar o banco de dados",
          detalhe: erro.message,
        });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ erro: true, msg: `Método ${req.method} não permitido` });
  }
}
