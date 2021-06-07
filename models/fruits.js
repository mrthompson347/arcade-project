const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    developer: { type: String, required: true },
    year: { type: Number, required: true },
    iPlayed: Boolean,
});

// This is the line that actually creates the collection in mongo
// The collection is the first parameter lowercased and pluralized.
const Game = mongoose.model('game', gameSchema);

module.exports = Game;