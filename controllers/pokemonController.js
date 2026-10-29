const pokemonModel = require('../models/pokemonModel');

// Controlleren håndterer HTTP, men ikke selve kaldet til PokeAPI.
exports.getPokemon = async (req, res, next) => {
  try {
    const pokemon = await pokemonModel.fetchPokemon(req.params.name.toLowerCase());
    res.json(pokemon);
  } catch (error) {
    next(error); // Central error-handler vælger 404/502
  }
};
