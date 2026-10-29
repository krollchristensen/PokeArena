module.exports = (err, req, res, next) => {
  console.error('API-fejl:', err.message);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Ugyldig JSON' });
  const status = [400, 404, 409, 502].includes(err.status) ? err.status : 500;
  const messages = { 404: 'Pokémon findes ikke', 502: 'PokeAPI svarer ikke korrekt', 500: 'Uventet serverfejl' };
  res.status(status).json({ error: messages[status] || 'Request kunne ikke behandles' });
};
