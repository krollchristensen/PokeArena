const axios = require('axios');

exports.fetchPokemon = async (name) => {
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`,
      { timeout: 6000 }
    );
    const data = response.data;
    return {
      id: data.id,
      name: data.name,
      types: data.types.map(t => t.type.name),
      image: data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default || null,
      sprite: data.sprites?.front_default || null,
      stats: Object.fromEntries(data.stats.map(s => [s.stat.name, s.base_stat])),
      height: data.height,
      weight: data.weight
    };
  } catch (err) {
    const error = new Error('PokeAPI-opslag mislykkedes');
    error.status = err.response?.status === 404 ? 404 : 502;
    throw error;
  }
};
