import { query } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id, nome } = req.body;

    if (!id || isNaN(id) || !nome) {
      return res.status(400).json({ erro: true, msg: "Dados inválidos fornecidos." });
    }

    try {
      const resultados = await query("SELECT * FROM favoritos WHERE pokemon_id = ?", [id]);

      if (resultados.length > 0) {
        await query("DELETE FROM favoritos WHERE pokemon_id = ?", [id]);
        return res.status(200).json({ favoritado: false });
      } else {
        await query("INSERT INTO favoritos (pokemon_id, nome) VALUES (?, ?)", [id, nome]);
        return res.status(200).json({ favoritado: true });
      }
    } catch (erro) {
      console.error("Erro ao atualizar favorito:", erro.message);
      return res
        .status(500)
        .json({ erro: true, msg: "Erro ao atualizar favorito.", detalhe: erro.message });
    }
  } else if (req.method === "GET") {
    try {
      const favoritos = await query("SELECT * FROM favoritos");

      const favoritosComImagem = favoritos.map((pokemon) => ({
        ...pokemon,
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon_id}.png`,
      }));

      return res.status(200).json({ favoritos: favoritosComImagem });
    } catch (erro) {
      console.error("Erro ao acessar favoritos:", erro.message);
      return res
        .status(500)
        .json({ erro: true, msg: "Erro ao acessar favoritos.", detalhe: erro.message });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).json({ erro: true, msg: `Método ${req.method} não permitido.` });
  }
}
