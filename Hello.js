const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;
const db = require('./db');


app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:8080',
}));

app.get('/jardins', async (req, res) => {
    try {
        const apiJardins = 'https://www.karudata.com/api/explore/v2.1/catalog/datasets/liste-des-jardins-remarquables/records?limit=100';
        const response = await axios.get(apiJardins);
        const jardins = response.data.results.map(jardin => ({
            nom_du_jardin: jardin.nom_du_jardin,
            code_postal: jardin.code_postal,
            adresse_complete: jardin.adresse_complete,
            commune: jardin.commune,
            type: 'jardins',
            latitude: jardin.latitude,
            longitude: jardin.longitude
        }));

        for (const jardin of jardins) {
            if (coordonnes_correct(jardin.latitude, jardin.longitude)) {
                const jardins_existant = await queryDatabase(`SELECT id FROM Jardins WHERE nom_du_jardin = ?`, [jardin.nom_du_jardin]);
                if (!jardins_existant || jardins_existant.length === 0) {
                    const sql = 'INSERT INTO Jardins SET ?';
                    db.query(sql, jardin, (err, result) => {
                        if (err) throw err;
                        console.log(`ajouté a la base : ${result.insertId}`);
                    });
                }
            }
        }
        res.json(jardins);
    } catch (error) {
        console.error("Erreur appel de l'API :", error);
    }
});

function coordonnes_correct(latitude, longitude) {
    // Assurez-vous que latitude et longitude sont dans les plages valides
    return (
        latitude !== null && longitude !== null &&
        !isNaN(latitude) && !isNaN(longitude) &&
        latitude >= -90 && latitude <= 90 &&
        longitude >= -180 && longitude <= 180
    );
}

app.get('/monuments', async (req, res) => {
    try {
        const apiMonuments = 'https://www.karudata.com/api/explore/v2.1/catalog/datasets/les-lieux-remarquables-de-la-guadeloupe/records?limit=100';
        const response = await axios.get(apiMonuments);
        const monuments = response.data.results.map(monument => {
            // Conversion des valeurs de latitude et longitude en nombres flottants
            let latitude = parseFloat(monument.latitude);
            let longitude = parseFloat(monument.longitude);

            // Correction des valeurs illogiques de latitude et longitude
            if (isNaN(latitude) || latitude < -90 || latitude > 90) latitude = null;
            if (isNaN(longitude) || longitude < -180 || longitude > 180) longitude = null;

            return {
                nom_du_monument: monument.nom_produit,
                nom_du_type: monument.nom_du_type,
                cp: monument.cp,
                commune: monument.commune,
                type: 'SitesEtMonuments',
                latitude: latitude,
                longitude: longitude,
                accessible_aux_personnes_a_mobilite_reduite: monument.accessible_aux_personnes_a_mobilite_reduite ? 1 : 0,
                pratique_de_l_activite_situation_interieur: monument.pratique_de_l_activite_situation_interieur,
                pratique_de_l_activite_situation_exterieur: monument.pratique_de_l_activite_situation_exterieur,
                situation_bord_de_mer: monument.situation_bord_de_mer,
                situation_vue_sur_mer: monument.situation_vue_sur_mer,
                situation_centre_ville: monument.situation_centre_ville,
                situation_agglomeration: monument.situation_agglomeration,
                situation_calme: monument.situation_calme,
                situation_campagne: monument.situation_campagne,
                coordonnees_geographiques: latitude !== null && longitude !== null ? JSON.stringify({ lat: latitude, lon: longitude }) : null
            };
        });

        for (const monument of monuments) {
            if (monument.latitude !== null && monument.longitude !== null) {
                const Monuments_existant = await queryDatabase(`SELECT id FROM SitesEtMonuments WHERE nom_du_monument = ?`, [monument.nom_du_monument]);
                if (!Monuments_existant || Monuments_existant.length === 0) {
                    const sql = 'INSERT INTO SitesEtMonuments SET ?';
                    db.query(sql, monument, (err, result) => {
                        if (err) throw err;
                        console.log(`ajouté à la base: ${result.insertId}`);
                    });
                }
            } else {
                console.log(`Coordonnées non valides pour ${monument.nom_du_monument}, non ajouté à la base.`);
            }
        }
        res.json(monuments);
    } catch (error) {
        console.error("Erreur appel de l'API :", error);
        res.status(500).send("Erreur lors de la récupération des monuments");
    }
});


app.get('/marqueurs', async (req, res) => {
    try {
        const jardins = await queryDatabase('SELECT latitude, longitude, commune, code_postal, nom_du_jardin AS nom FROM Jardins WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND latitude != 999.9999999 AND longitude != 999.9999999');
        const monuments = await queryDatabase('SELECT latitude, longitude, commune, cp, nom_du_monument AS nom FROM SitesEtMonuments WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND latitude != 999.9999999 AND longitude != 999.9999999');
        const marqueurs = [...jardins, ...monuments];
        res.json(marqueurs);
    } catch (error) {
        console.error("Erreur récupération des marqueurs :", error);
    }
});


app.put('/marqueurs/:nom', async (req, res) => {
    const { nom } = req.params;
    const { new_name, latitude, longitude, new_code_postal, new_commune } = req.body;

    try {
        console.log('marqueur à modifier:', nom);
        console.log('infos:',  new_name, latitude, longitude, new_code_postal, new_commune);
        let result = await queryDatabase('UPDATE Jardins SET nom_du_jardin = ?, latitude = ?, longitude = ?, code_postal = ?, commune = ? WHERE nom_du_jardin = ?', [new_name, latitude, longitude, new_code_postal, new_commune, nom]);
        if (result.affectedRows === 0) {
            result = await queryDatabase('UPDATE SitesEtMonuments SET nom_du_monument = ?, latitude = ?, longitude = ?, cp = ?, commune = ? WHERE nom_du_monument = ?', [new_name, latitude, longitude, new_code_postal, new_commune, nom]);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Marqueur non trouvé' });
        }
        res.status(200).json({ message: 'Marqueur mis à jour' });
    } catch (error) {
        console.error("Mise a jour KO :", error);
    }
});



app.delete('/marqueurs/:nom', async (req, res) => {
    const { nom } = req.params;
    try {
        console.log('Nom du marqueur à supprimer :', nom);
        let result = await queryDatabase('DELETE FROM Jardins WHERE nom_du_jardin = ?', [nom]);
        if (result.affectedRows === 0) {
            result = await queryDatabase('DELETE FROM SitesEtMonuments WHERE nom_du_monument = ?', [nom]);
        }
        if (result.affectedRows === 0) {
            console.log('Marqueur non trouvé');
            return res.status(404).json({ message: 'Marqueur non trouvé' });
        }
        console.log('Marqueur supprimé');
        res.status(200).json({ message: 'Marqueur supprimé' });
    } catch (error) {
        console.error("suppression KO:", error);
        res.status(500).json({ message: "suppression KO"});
    }
});


async function queryDatabase(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

app.post('/marqueurs', async (req, res) => {
    const { type, nom, latitude, longitude, code_postal, commune } = req.body;
    console.log('infos reçu:', req.body)
    try {
        if (type === 'jardins') {
            const sql = 'INSERT INTO Jardins (nom_du_jardin, latitude, longitude, code_postal, commune) VALUES (?, ?, ?, ?, ?)';
            await queryDatabase(sql, [nom, latitude, longitude, code_postal, commune]);
            console.log('Jardin ajouté a la base');
        } else if (type === 'SitesEtMonuments') {
            const sql = 'INSERT INTO SitesEtMonuments (nom_du_monument, latitude, longitude, cp, commune) VALUES (?, ?, ?, ?, ?)';
            await queryDatabase(sql, [nom, latitude, longitude, code_postal, commune]);
            console.log('Monument ajouté a la base');
        } else {
            console.log('Type de marqueur non valide :', type);
            res.status(400).json({ message: 'Type de marqueur non valide' });
            return;
        }
        res.status(201).json({ message: 'Marqueur créé' });
    } catch (error) {
        console.error("Creation marqueur KO:", error);
        res.status(500).json({ message: "Creation marqueur KO"});
    }
});

function coordonnes_correct(latitude, longitude) {
    return (
        latitude !== null && longitude !== null &&
        latitude !== 0 && longitude !== 0 &&
        latitude !== 999.9999999 && longitude !== 999.9999999
    );
}

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
