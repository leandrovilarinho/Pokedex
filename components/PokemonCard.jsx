import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa"; // Ícones para favoritado/não favoritado

const PokemonCard = ({ numero, nome, img, favoritado }) => {
  return (
    <div className="pokemon-card">
      <img src={img} alt={nome} className="pokemon-image" />
      <div className="pokemon-info">
        <p>
          <strong>#{numero}</strong>
        </p>
        <p>
          {nome}{" "}
          {favoritado ? (
            <FaStar className="favoritado" title="Favoritado" />
          ) : (
            <FaRegStar className="nao-favoritado" title="Não Favoritado" />
          )}
        </p>
      </div>
      <style jsx>{`
        .pokemon-card {
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 10px;
          background-color: #f9f9f9;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }
        .pokemon-image {
          width: 100px;
          height: auto;
        }
        .pokemon-info {
          margin-top: 10px;
        }
        .pokemon-info p {
          margin: 0;
          font-size: 14px;
          font-weight: bold;
          text-transform: capitalize;
        }
        .favoritado {
          color: gold;
          margin-left: 5px;
          font-size: 16px;
        }
        .nao-favoritado {
          color: #ccc;
          margin-left: 5px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default PokemonCard;
