const express = require('express');
const morgan = require('morgan');
const path = require('path');
const pokemonRoutes = require('./routes/pokemonRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(morgan('dev'));
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pokemon', pokemonRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use((req, res) => res.status(404).json({ error: 'Endpoint findes ikke' }));
app.use(errorHandler);

if (require.main === module) {
  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => console.log(`PokéArena: http://localhost:${port}`));
}
module.exports = app;
