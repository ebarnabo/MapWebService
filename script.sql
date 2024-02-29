-- Création de la base de données
CREATE DATABASE IF NOT EXISTS WBS;
USE WBS;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Création de la table 'Jardins'
CREATE TABLE IF NOT EXISTS Jardins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_du_jardin VARCHAR(255),
    code_postal VARCHAR(10),
    adresse_complete VARCHAR(255),
    commune VARCHAR(100),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    Type VARCHAR(255) NOT NULL DEFAULT 'jardins'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Création de la table 'SitesEtMonuments'
CREATE TABLE IF NOT EXISTS SitesEtMonuments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_du_monument VARCHAR(255),
    nom_du_type VARCHAR(255),
    cp VARCHAR(10),
    commune VARCHAR(100),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    accessible_aux_personnes_a_mobilite_reduite TINYINT(1),
    pratique_de_l_activite_situation_interieur VARCHAR(3),
    pratique_de_l_activite_situation_exterieur VARCHAR(3),
    situation_bord_de_mer VARCHAR(3),
    situation_vue_sur_mer VARCHAR(3),
    situation_centre_ville VARCHAR(3),
    situation_agglomeration VARCHAR(3),
    situation_calme VARCHAR(3),
    situation_campagne VARCHAR(3),
    coordonnees_geographiques TEXT,
    type VARCHAR(255) NOT NULL DEFAULT 'SitesEtMonuments'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
