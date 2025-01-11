import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Importação do roteador
import axios from "axios";
import PokemonCard from "../components/PokemonCard";

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const QUANTIDADE_POR_PAGINA = 20;

  const router = useRouter(); // Instância do roteador

  const handleClick = (id) => {
    router.push(`/pokemon/${id}`); // Redireciona para a rota de detalhes do Pokémon
  };

  // Função para carregar os Pokémon favoritados do banco de dados
  const carregarFavoritos = async () => {
    setCarregando(true);
    try {
      const resposta = await axios.get(
        `http://localhost:3000/api/favoritos?pagina=${pagina}&quantidade=${QUANTIDADE_POR_PAGINA}`
      );
      if (!resposta.data.erro) {
        setFavoritos(resposta.data.pokemon);
      } else {
        console.error(resposta.data.msg);
      }
    } catch (erro) {
      console.error("Erro ao carregar favoritos:", erro);
    }
    setCarregando(false);
  };

  useEffect(() => {
    carregarFavoritos();
  }, [pagina]);

  const irParaPaginaAnterior = () => {
    if (pagina > 1) setPagina(pagina - 1);
  };

  const irParaProximaPagina = () => {
    setPagina(pagina + 1);
  };

  return (
    <div>
      <h1>Pokémon Favoritos</h1>
      {carregando ? (
        <p>Carregando...</p>
      ) : favoritos.length > 0 ? (
        <div>
          <div className="pokemon-list">
            {favoritos.map((pokemon) => (
              <div
                key={pokemon.numero}
                className="pokemon-card"
                onClick={() => handleClick(pokemon.numero)} // Adicionado redirecionamento
              >
                <PokemonCard pokemon={pokemon} />
              </div>
            ))}
          </div>
          <div className="paginacao">
            <button onClick={irParaPaginaAnterior} disabled={pagina === 1}>
              Anterior
            </button>
            <span>Página {pagina}</span>
            <button onClick={irParaProximaPagina}>Próximo</button>
          </div>
        </div>
      ) : (
        <p>Nenhum Pokémon favoritado encontrado.</p>
      )}
      <style jsx>{`
        .pokemon-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
        }
        .pokemon-card {
          cursor: pointer; /* Adicionado para indicar que é clicável */
        }
        .paginacao {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default Favoritos;
