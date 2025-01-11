import axios from 'axios';

const API_URL = 'https://pokeapi.co/api/v2';

export const fetchRegions = async () => axios.get(`${API_URL}/region`);
export const fetchTypes = async () => axios.get(`${API_URL}/type`);
export const fetchPokemonByRegion = async (regionUrl) => axios.get(regionUrl);
export const fetchPokemonByType = async (typeUrl) => axios.get(typeUrl);
export const fetchPokemonDetails = async (id) => axios.get(`${API_URL}/pokemon/${id}`);