import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Importação do roteador
import PokemonCard from "../components/PokemonCard";
import axios from "axios";

const Regioes = () => {
  const [regioes, setRegioes] = useState([]);
  const [pokemon, setPokemon] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [regiaoSelecionada, setRegiaoSelecionada] = useState("");
  const [pagina, setPagina] = useState(1);
  const [temMaisPokemon, setTemMaisPokemon] = useState(true);

  const router = useRouter(); // Instância do roteador

  const handleClick = (id) => {
    router.push(`/pokemon/${id}`); // Redireciona para a rota de detalhes do Pokémon
  };

  const carregarRegioes = async () => {
    try {
      const resposta = await axios.get("https://pokemon.danielpimentel.com.br/v1/regioes");
      if (!resposta.data.erro) {
        setRegioes(resposta.data.regioes);

        // Define a região "Kanto" como padrão, se disponível
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

        // Verifica se ainda há mais Pokémon para listar
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
    carregarRegioes();
  }, []);

  const mudarPagina = (direcao) => {
    const novaPagina = pagina + direcao;

    // Não permite voltar para uma página antes da primeira
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
                  onClick={() => handleClick(poke.numero)} // Adicionado redirecionamento
                >
                  <PokemonCard
                    numero={poke.numero}
                    nome={poke.nome}
                    img={poke.img}
                    favoritado={poke.favoritado} // Supondo que a API retorne essa informação
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
