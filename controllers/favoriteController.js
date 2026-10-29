const store = require('../models/favoriteStore');
exports.getAll = (req, res) => res.json(store.findAll());
exports.getOne = (req, res) => {
  const favorite = store.findById(req.favoriteId);
  if (!favorite) return res.status(404).json({ error: 'Favorit findes ikke' });
  res.json(favorite);
};
exports.create = (req, res) => {
  const name = req.body.name.trim().toLowerCase();
  if (store.findByName(name)) return res.status(409).json({ error: 'Denne Pokémon er allerede på holdet' });
  if (store.findAll().length >= 6) return res.status(409).json({ error: 'Holdet er fyldt: maksimalt 6 Pokémon' });
  const favorite = store.create(req.body);
  res.status(201).location(`/favorites/${favorite.id}`).json(favorite);
};
exports.replace = (req, res) => {
  if (!store.findById(req.favoriteId)) return res.status(404).json({ error: 'Favorit findes ikke' });
  const duplicate = store.findByName(req.body.name.trim().toLowerCase());
  if (duplicate && duplicate.id !== req.favoriteId) return res.status(409).json({ error: 'Denne Pokémon er allerede på holdet' });
  const favorite = store.replace(req.favoriteId, req.body);
  res.json(favorite);
};
exports.remove = (req, res) => {
  if (!store.remove(req.favoriteId)) return res.status(404).json({ error: 'Favorit findes ikke' });
  res.status(204).end();
};
