// Validerer navnet før controlleren. Brug fx /pokemon/pikachu!
function validatePokemon(req, res, next) {
  const { name } = req.params;
  if (!/^[a-z0-9-]+$/i.test(name)) {
    return res.status(400).json({ error: 'Ugyldigt Pokémon-navn' });
  }
  next();
}
module.exports = validatePokemon;
