'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import PokemonCard from "../components/PokemonCard";

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [temMaisFavoritos, setTemMaisFavoritos] = useState(true);
  const QUANTIDADE_POR_PAGINA = 20;

  const carregarFavoritos = async () => {
    setCarregando(true);
    try {
      const resposta = await axios.get(
        `/api/favoritar?pagina=${pagina}&quantidade=${QUANTIDADE_POR_PAGINA}`
      );

      if (resposta.data?.favoritos && Array.isArray(resposta.data.favoritos)) {
        setFavoritos(resposta.data.favoritos);

        if (resposta.data.favoritos.length < QUANTIDADE_POR_PAGINA) {
          setTemMaisFavoritos(false);
        } else {
          setTemMaisFavoritos(true);
        }
      } else {
        setFavoritos([]);
        console.error("Resposta inesperada:", resposta.data);
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      setFavoritos([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarFavoritos();
  }, [pagina]);

  const mudarPagina = (direcao) => {
    const novaPagina = pagina + direcao;
    if (novaPagina < 1) return;
    setPagina(novaPagina);
  };

  return (
    <div>
      <h1>Pokémon Favoritos</h1>
      {carregando ? (
        <p>Carregando...</p>
      ) : favoritos.length > 0 ? (
        <div className="pokemon-list">
          {favoritos.map((pokemon) => (
            <div key={pokemon.pokemon_id} className="pokemon-card">
              <PokemonCard
                numero={pokemon.pokemon_id}
                nome={pokemon.nome}
                img={pokemon.img}
                favoritado={true}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhum Pokémon favoritado encontrado.</p>
      )}

      {favoritos.length > 0 && (
        <div className="pagination">
          <button onClick={() => mudarPagina(-1)} disabled={pagina === 1}>
            Anterior
          </button>
          <span>Página {pagina}</span>
          <button onClick={() => mudarPagina(1)} disabled={!temMaisFavoritos}>
            Próximo
          </button>
        </div>
      )}

      <style jsx>{`
        .pokemon-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
        }
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-top: 20px;
        }
        .pokemon-card img {
          width: 100px;
          height: auto;
        }
        .pokemon-card p {
          margin: 10px 0 0;
          font-size: 14px;
          font-weight: bold;
          text-transform: capitalize;
        }
        .pagination button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          background-color: #0070f3;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .pagination button[disabled] {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Favoritos;
