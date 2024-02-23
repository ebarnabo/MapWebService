// db.js
const mysql = require('mysql');
const connection = mysql.createPool({
    host     : 'localhost',  // Votre hôte
    user     : 'map',       // Votre utilisateur de base de données
    password : 'map',   // Votre mot de passe
    database : 'WBS'         // Le nom de la base de données
});
module.exports = connection;
