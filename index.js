// Importation des modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialisation de l'application Express
const app = express();

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/movies', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Définition du schéma du film
const movieSchema = new mongoose.Schema({
  title: String,
  synopsis: String,
  year: Number
});

// Création du modèle Movie à partir du schéma
const Movie = mongoose.model('Movie', movieSchema);

// Utilisation de body-parser pour parser les données JSON des requêtes
app.use(bodyParser.json());

// Route pour obtenir la liste des films
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour ajouter un nouveau film
app.post('/movies', async (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    synopsis: req.body.synopsis,
    year: req.body.year
  });
  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Port d'écoute du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
