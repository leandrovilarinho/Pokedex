'use client';
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const PokemonDetalhes = () => {
  const router = useRouter();
  const { id } = router.query;

  const [pokemon, setPokemon] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [favoritado, setFavoritado] = useState(false);

  useEffect(() => {
    if (id) {
      carregarPokemon(id);
    }
  }, [id]);

  const carregarPokemon = async (pokemonId) => {
    try {
      const resposta = await axios.get(`https://pokemon.danielpimentel.com.br/v1/pokemon/numero/${pokemonId}`);
      if (!resposta.data.erro) {
        setPokemon(resposta.data.pokemon);

        // Verifica se o Pokémon está favoritado no backend
        const favoritoResposta = await axios.get(`/api/pokemon/${pokemonId}`);
        setFavoritado(favoritoResposta.data.favoritado);
      } else {
        console.error("Erro ao carregar Pokémon:", resposta.data.mensagem);
      }
    } catch (error) {
      console.error("Erro ao carregar Pokémon:", error);
    } finally {
      setCarregando(false);
    }
  };

  const alternarFavorito = async () => {
    try {
      const resposta = await axios.post("/api/favoritar", {
        id: pokemon.numero,
        nome: pokemon.nome,
      });
      setFavoritado(resposta.data.favoritado);
    } catch (erro) {
      console.error("Erro ao atualizar favorito:", erro);
    }
  };  

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (!pokemon) {
    return <p>Pokémon não encontrado.</p>;
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
