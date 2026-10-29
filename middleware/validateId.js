function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: 'ID skal være et positivt heltal' });
  }
  req.favoriteId = id;
  next();
}
module.exports = validateId;
