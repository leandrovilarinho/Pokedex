import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Ícones para favorito
import db from "../../lib/db"; // Simulação do banco de dados

const PokemonDetalhes = () => {
  const router = useRouter();
  const { id } = router.query;

  const [pokemon, setPokemon] = useState(null);
  const [favoritado, setFavoritado] = useState(false);

  // Função para buscar informações do Pokémon
  const buscarPokemon = async (pokemonId) => {
    try {
      const resposta = await axios.get(
        `https://pokemon.danielpimentel.com.br/v1/pokemon/numero/${pokemonId}`
      );
      if (!resposta.data.erro) {
        setPokemon(resposta.data.pokemon);

        // Verifica no banco de dados se o Pokémon está favoritado
        const favoritos = db.get("favoritos") || [];
        setFavoritado(favoritos.includes(pokemonId));
      } else {
        console.error(resposta.data.msg);
      }
    } catch (erro) {
      console.error("Erro ao buscar informações do Pokémon:", erro);
    }
  };

  // Função para alternar o status de favorito
  const alternarFavorito = () => {
    const favoritos = db.get("favoritos") || [];
    if (favoritado) {
      // Remove dos favoritos
      db.set("favoritos", favoritos.filter((fav) => fav !== id));
      setFavoritado(false);
    } else {
      // Adiciona aos favoritos
      db.set("favoritos", [...favoritos, id]);
      setFavoritado(true);
    }
  };

  useEffect(() => {
    if (id) {
      buscarPokemon(id);
    }
  }, [id]);

  if (!pokemon) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="pokemon-detalhes">
      <h1>{pokemon.nome}</h1>
      <div className="detalhes-container">
        <img src={pokemon.img} alt={pokemon.nome} />
        <div className="informacoes">
          <p><strong>Número:</strong> {pokemon.numero}</p>
          <p><strong>Altura:</strong> {pokemon.altura} cm</p>
          <p><strong>Peso:</strong> {pokemon.peso / 1000} kg</p>
          <p><strong>Velocidade:</strong> {pokemon.speed}</p>
          <p><strong>HP:</strong> {pokemon.hp}</p>
          <p><strong>Tipos:</strong></p>
          <div className="tipos">
            {pokemon.tipo.split(",").map((tipo) => (
              <img
                key={tipo}
                src={`/Imagens/${tipo.trim().toLowerCase()}.png`}
                alt={tipo}
                title={tipo}
              />
            ))}
          </div>
          <button onClick={alternarFavorito} className="favorito">
            {favoritado ? <FaHeart color="red" /> : <FaRegHeart />}
          </button>
        </div>
      </div>

      <style jsx>{`
        .pokemon-detalhes {
          padding: 20px;
          text-align: center;
        }
        .detalhes-container {
          display: flex;
          gap: 20px;
          justify-content: center;
          align-items: center;
        }
        img {
          max-width: 150px;
          height: auto;
        }
        .informacoes {
          text-align: left;
        }
        .tipos img {
          width: 50px;
          margin-right: 10px;
        }
        .favorito {
          margin-top: 20px;
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default PokemonDetalhes;
