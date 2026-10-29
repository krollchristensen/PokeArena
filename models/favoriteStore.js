// Datalag i hukommelsen. Favoritter nulstilles ved servergenstart.
let favorites = [];
let nextId = 1;
const findAll = () => favorites.map(f => ({ ...f }));
const findById = id => favorites.find(f => f.id === id);
const findByName = name => favorites.find(f => f.name === name.toLowerCase());
const create = ({ name, note = '', pokemonId = null }) => {
  const favorite = { id: nextId++, name: name.trim().toLowerCase(), note: note.trim(), pokemonId };
  favorites.push(favorite);
  return favorite;
};
const replace = (id, { name, note = '', pokemonId }) => {
  const index = favorites.findIndex(f => f.id === id);
  if (index < 0) return null;
  favorites[index] = { id, name: name.trim().toLowerCase(), note: note.trim(), pokemonId };
  return favorites[index];
};
const remove = id => {
  const index = favorites.findIndex(f => f.id === id);
  if (index < 0) return false;
  favorites.splice(index, 1);
  return true;
};
module.exports = { findAll, findById, findByName, create, replace, remove,
  resetForTests: () => { favorites = []; nextId = 1; } };
