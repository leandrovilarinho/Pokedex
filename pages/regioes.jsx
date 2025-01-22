'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/router"; 
import PokemonCard from "../components/PokemonCard";
import axios from "axios";

const Regioes = () => {
  const [regioes, setRegioes] = useState([]);
  const [pokemon, setPokemon] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [regiaoSelecionada, setRegiaoSelecionada] = useState("");
  const [pagina, setPagina] = useState(1);
  const [temMaisPokemon, setTemMaisPokemon] = useState(true);

  const router = useRouter(); 

  const handleClick = (id) => {
    router.push(`/pokemon/${id}`); 
  };

  const carregarFavoritos = async () => {
    try {
      const resposta = await axios.get("http://localhost:3000/api/favoritar");
      if (!resposta.data.erro) {
        setFavoritos(resposta.data.favoritos.map((f) => f.pokemon_id));
      }
    } catch (erro) {
      console.error("Erro ao carregar favoritos:", erro);
    }
  };

  const carregarRegioes = async () => {
    try {
      const resposta = await axios.get("https://pokemon.danielpimentel.com.br/v1/regioes");
      if (!resposta.data.erro) {
        setRegioes(resposta.data.regioes);

        const regiaoPadrao = resposta.data.regioes.find((regiao) => regiao.nome.toLowerCase() === "kanto");
        if (regiaoPadrao) {
          carregarPokemonPorRegiao(regiaoPadrao.nome);
        }
      } else {
        console.error(resposta.data.msg);
      }
    } catch (erro) {
      console.error("Erro ao carregar regiões:", erro);
    }
  };

  const carregarPokemonPorRegiao = async (nomeDaRegiao, paginaAtual = 1) => {
    setCarregando(true);
    setPokemon([]);
    setRegiaoSelecionada(nomeDaRegiao);
    setPagina(paginaAtual);

    try {
      const resposta = await axios.get(
        `https://pokemon.danielpimentel.com.br/v1/pokemon/regiao/${nomeDaRegiao}/20/${paginaAtual}`
      );
      if (!resposta.data.erro) {
        setPokemon(resposta.data.pokemon);

        if (resposta.data.pokemon.length < 20) {
          setTemMaisPokemon(false);
        } else {
          setTemMaisPokemon(true);
        }
      } else {
        console.error(resposta.data.msg);
        setTemMaisPokemon(false);
      }
    } catch (erro) {
      console.error("Erro ao carregar Pokémon da região:", erro);
      setTemMaisPokemon(false);
    }
    setCarregando(false);
  };

  useEffect(() => {
    carregarFavoritos();
    carregarRegioes();
  }, []);

  const mudarPagina = (direcao) => {
    const novaPagina = pagina + direcao;

    if (novaPagina < 1) return;

    carregarPokemonPorRegiao(regiaoSelecionada, novaPagina);
  };

  return (
    <div>
      <h1>Regiões Pokémon</h1>
      {carregando && <p>Carregando...</p>}
      {!carregando && (
        <div>
          <div className="regioes">
            {regioes.map((regiao) => (
              <button
                key={regiao.id}
                onClick={() => carregarPokemonPorRegiao(regiao.nome)}
                className={regiaoSelecionada === regiao.nome ? "selecionado" : ""}
              >
                {regiao.nome}
              </button>
            ))}
          </div>

          <div className="pokemon-list">
            {pokemon.length > 0 ? (
              pokemon.map((poke) => (
                <div
                  key={poke.numero}
                  className="pokemon-card"
                  onClick={() => handleClick(poke.numero)} 
                >
                  <PokemonCard
                    numero={poke.numero}
                    nome={poke.nome}
                    img={poke.img}
                    favoritado={favoritos.includes(poke.numero)}
                  />
                </div>
              ))
            ) : (
              regiaoSelecionada && !carregando && <p>Nenhum Pokémon encontrado.</p>
            )}
          </div>

          {regiaoSelecionada && (
            <div className="pagination">
              <button onClick={() => mudarPagina(-1)} disabled={pagina === 1}>
                Anterior
              </button>
              <span>Página {pagina}</span>
              <button onClick={() => mudarPagina(1)} disabled={!temMaisPokemon}>
                Próximo
              </button>
            </div>
          )}
        </div>
      )}
      <style jsx>{`
        .regioes {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        .regioes button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          background-color: #0070f3;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .regioes button.selecionado {
          background-color: #005bb5;
        }
        .regioes button:hover {
          background-color: #005bb5;
        }
        .pokemon-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
        }
        .pokemon-card {
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 10px;
          background-color: #f9f9f9;
          cursor: pointer; /* Adicionado para indicar que é clicável */
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
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-top: 20px;
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

export default Regioes;
