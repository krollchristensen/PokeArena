function validateFavorite(req, res, next) {
  const { name, note, pokemonId } = req.body || {};
  if (typeof name !== 'string' || !/^[a-z0-9-]{1,45}$/i.test(name.trim())) {
    return res.status(400).json({ error: 'Pokémon-navn skal være 1–45 bogstaver, tal eller bindestreger' });
  }
  if (note !== undefined && (typeof note !== 'string' || note.length > 140)) {
    return res.status(400).json({ error: 'Noten må højst være 140 tegn' });
  }
  if (pokemonId !== undefined && (!Number.isSafeInteger(pokemonId) || pokemonId < 1)) {
    return res.status(400).json({ error: 'pokemonId skal være et positivt heltal' });
  }
  next();
}
module.exports = validateFavorite;
