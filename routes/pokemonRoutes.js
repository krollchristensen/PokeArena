const express = require('express');
const router = express.Router();
const validatePokemon = require('../middleware/validatePokemon');
const pokemonController = require('../controllers/pokemonController');
router.get('/:name', validatePokemon, pokemonController.getPokemon);
module.exports = router;
