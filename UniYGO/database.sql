-- Progettazione Web 
DROP DATABASE if exists dimauro_635831; 
CREATE DATABASE dimauro_635831; 
USE dimauro_635831; 
-- MySQL dump 10.13  Distrib 5.7.28, for Win64 (x86_64)
--
-- Host: localhost    Database: dimauro_635831
-- ------------------------------------------------------
-- Server version	5.7.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carta`
--

DROP TABLE IF EXISTS `carta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carta` (
  `cod` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `is_mostro` tinyint(1) NOT NULL,
  `effetto` text,
  `extradeck` tinyint(1) NOT NULL DEFAULT '0',
  `atk` int(11) DEFAULT NULL,
  `def` int(11) DEFAULT NULL,
  `img` varchar(255) NOT NULL,
  PRIMARY KEY (`cod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carta`
--

LOCK TABLES `carta` WRITE;
/*!40000 ALTER TABLE `carta` DISABLE KEYS */;
INSERT INTO `carta` VALUES (213326,'E - Emergency Call',0,'Add 1 \"Elemental HERO\" monster from your Deck to your hand.',0,NULL,NULL,'./img/213326'),(2295440,'One for One',0,'Send 1 monster from your hand to the GY; Special Summon 1 Level 1 monster from your hand or Deck.',0,NULL,NULL,'./img/2295440'),(4206964,'Trap Hole',0,'When your opponent Normal or Flip Summons 1 monster with 1000 or more ATK: Target that monster; destroy that target.',0,NULL,NULL,'./img/4206964'),(5318639,'Mystical Space Typhoon',0,'Target 1 Spell/Trap on the field; destroy that target.',0,NULL,NULL,'./img/5318639'),(7391448,'Goyo Guardian',1,'1 EARTH Tuner + 1 or more non-Tuner monsters\r\nWhen this card destroys an opponent\'s monster by battle and sends it to the Graveyard: You can Special Summon that monster to your field in Defense Position.',1,2800,2000,'./img/7391448'),(7572887,'D.D. Warrior Lady',1,'After damage calculation, when this card battles an opponent\'s monster: You can banish that monster, also banish this card.',0,1500,1600,'./img/7572887'),(9126351,'Swap Frog',1,'You can Special Summon this card (from your hand) by discarding 1 other WATER monster. When this card is Summoned: You can send 1 Level 2 or lower WATER Aqua monster from your Deck or face-up field to the GY. Once per turn: You can return 1 monster you control to the hand; you can Normal Summon 1 \"Frog\" monster during your Main Phase this turn, except \"Swap Frog\", in addition to your Normal Summon/Set. (You can only gain this effect once per turn.)',0,1000,500,'./img/9126351'),(12538374,'Treeborn Frog',1,'Once per turn, during your Standby Phase, if this card is in your Graveyard and you do not control \"Treeborn Frog\": You can Special Summon this card. You must control no Spell/Trap Cards to activate and to resolve this effect.',0,100,100,'./img/12538374'),(15341821,'Dandylion',1,'If this card is sent to the Graveyard: Special Summon 2 \"Fluff Tokens\" (Plant-Type/WIND/Level 1/ATK 0/DEF 0) in Defense Position. These Tokens cannot be Tributed for a Tribute Summon during the turn they are Special Summoned.',0,300,300,'./img/15341821'),(16304628,'Elemental HERO Gaia',1,'1 \"Elemental HERO\" monster + 1 EARTH monster\r\nMust be Fusion Summoned and cannot be Special Summoned by other ways. When this card is Fusion Summoned: Target 1 face-up monster your opponent controls; until the End Phase, its ATK is halved and this card gains the same amount of ATK.',1,2200,2600,'./img/16304628'),(19613556,'Heavy Storm',0,'Destroy all Spell and Trap Cards on the field.',0,NULL,NULL,'./img/19613556'),(20663556,'Substitoad',1,'You can Tribute 1 monster to Special Summon 1 \"Frog\" monster from your Deck, except \"Frog the Jam\". \"Frog\" monsters, except \"Frog the Jam\", cannot be destroyed by battle.',0,100,2000,'./img/20663556'),(22123627,'Moray of Greed',0,'Shuffle 2 WATER monsters from your hand into the Deck, then draw 3 cards.',0,NULL,NULL,'./img/22123627'),(23693634,'Colossal Fighter',1,'1 Tuner + 1 or more non-Tuner monsters\r\nThis card gains 100 ATK for every Warrior-Type monster in any Graveyard. When this card is destroyed by battle and sent to the Graveyard: You can target 1 Warrior-Type monster in either Graveyard; Special Summon that target.\r\n',1,2800,1000,'./img/23693634'),(26593852,'Ally of Justice Catastor',1,'1 Tuner + 1+ non-Tuner monsters\r\nAt the start of the Damage Step, if this card battles a face-up non-DARK monster: Destroy that monster.',1,2200,1200,'./img/26593852'),(29071332,'Armory Arm',1,'1 Tuner + 1 or more non-Tuner monsters\r\nOnce per turn, you can either: Target 1 monster on the field; equip this card to that target, OR: Unequip this card and Special Summon it in Attack Position. While equipped by this effect, that target gains 1000 ATK. If that target destroys a monster by battle and sends it to the Graveyard: Inflict damage to your opponent equal to the ATK of the destroyed monster in the Graveyard.',1,1800,1200,'./img/29071332'),(29401950,'Bottomless Trap Hole',0,'When your opponent Summons a monster(s) with 1500 or more ATK: Destroy that monster(s) with 1500 or more ATK, and if you do, banish it.\r\n',0,NULL,NULL,'./img/29401950'),(32807846,'Reinforcement of the Army',0,'Add 1 Level 4 or lower Warrior monster from your Deck to your hand.',0,NULL,NULL,'./img/32807846'),(33846209,'Gemini Spark',0,'Tribute 1 face-up Level 4 Gemini monster, then target 1 card on the field; destroy it, and if you do, draw 1 card.',0,NULL,NULL,'./img/33846209'),(37195861,'Elemental HERO Ocean',1,'Once per turn, during your Standby Phase: You can target 1 \"HERO\" monster you control or in your Graveyard; return that target to the hand.\r\n',0,1500,1200,'./img/37195861'),(37576645,'Reckless Greed',0,'Draw 2 cards and skip your next 2 Draw Phases.',0,NULL,NULL,'./img/37576645'),(37742478,'Honest',1,'During your Main Phase: You can return this face-up card from the field to the hand. During the Damage Step, when a LIGHT monster you control battles (Quick Effect): You can send this card from your hand to the GY; that monster gains ATK equal to the ATK of the opponent\'s monster it is battling, until the end of this turn.',0,1100,1900,'./img/37742478'),(40044918,'Elemental HERO Stratos',1,'When this card is Normal or Special Summoned: You can activate 1 of these effects.\r\n● Destroy Spells/Traps on the field, up to the number of \"HERO\" monsters you control, except this card.\r\n● Add 1 \"HERO\" monster from your Deck to your hand.',0,1800,300,'./img/40044918'),(40854197,'Elemental HERO Absolute Zero',1,'1 \"HERO\" monster + 1 WATER monster\r\nMust be Fusion Summoned. Gains 500 ATK for each WATER monster on the field, except \"Elemental HERO Absolute Zero\". If this card leaves the field: Destroy all monsters your opponent controls.',1,2500,2000,'./img/40854197'),(42703248,'Giant Trunade',0,'Return all Spell and Trap Cards on the field to the hand.',0,NULL,NULL,'./img/42703248'),(43385557,'Magical Android',1,'1 Tuner + 1 or more non-Tuner monsters\r\nDuring each of your End Phases: Gain 600 LP for each Psychic-Type monster you currently control.',1,2400,1700,'./img/43385557'),(44330098,'Gorz the Emissary of Darkness',1,'When you take damage from a card in your opponent\'s possession: You can Special Summon this card from your hand. You must control no cards to activate and to resolve this effect. If Summoned this way, activate the appropriate effect, based on the type of damage:\r\n● Battle damage: Special Summon 1 \"Emissary of Darkness Token\" (Fairy-Type/LIGHT/Level 7/ATK ?/DEF ?). Its ATK and DEF are each equal to the amount of battle damage you took.\r\n● Effect damage: Inflict damage to your opponent equal to the amount of damage you took.\r\n',0,2700,2500,'./img/44330098'),(44508094,'Stardust Dragon',1,'1 Tuner + 1+ non-Tuner monsters\r\nWhen a card or effect is activated that would destroy a card(s) on the field (Quick Effect): You can Tribute this card; negate the activation, and if you do, destroy it. During the End Phase, if this effect was activated this turn (and was not negated): You can Special Summon this card from your GY.',1,2500,2000,'./img/44508094'),(45906428,'Miracle Fusion',0,'Fusion Summon 1 \"Elemental HERO\" Fusion Monster from your Extra Deck, by banishing Fusion Materials listed on it from your field or your GY.',0,NULL,NULL,'./img/45906428'),(46239604,'Dupe Frog',1,'This card\'s name becomes \"Des Frog\" while it is on the field. Monsters your opponent controls cannot target monsters for attacks, except this one. When this card is sent from the field to the Graveyard: You can add 1 \"Frog\" monster from your Deck or Graveyard to your hand, except \"Dupe Frog\".',0,100,2000,'./img/46239604'),(49522489,'Beelze Frog',0,'This card gains 300 ATK for each \"T.A.D.P.O.L.E.\" in your Graveyard.',0,NULL,NULL,'./img/49522489'),(50321796,'Brionac, Dragon of the Ice Barrier',1,'1 Tuner + 1+ non-Tuner monsters\r\nYou can discard any number of cards to the GY, then target the same number of cards your opponent controls; return those cards to the hand. You can only use this effect of \"Brionac, Dragon of the Ice Barrier\" once per turn.',1,2300,1400,'./img/50321796'),(56052205,'Unifrog',1,'This card can attack your opponent directly. When this card successfully attacks directly, if you control a \"Frog\" monster other than \"Frog the Jam\" or \"Unifrog\", you can destroy 1 Spell or Trap your opponent controls.',0,400,400,'./img/56052205'),(64463828,'Superalloy Beast Raptinus',1,'1 Gemini Monster + 1 Gemini Monster\r\nAll Gemini Monsters on the field are treated as Effect Monsters, and gain their effects.\r\n',1,2200,2200,'./img/64463828'),(67169062,'Pot of Avarice',0,'Target 5 monsters in your GY; shuffle all 5 into the Deck, then draw 2 cards.',0,NULL,NULL,'./img/67169062'),(69884162,'Elemental HERO Neos Alius',1,'This card is treated as a Normal Monster while face-up on the field or in the GY. While this card is a Normal Monster on the field, you can Normal Summon it to have it become an Effect Monster with this effect.\r\n● This card\'s name becomes \"Elemental HERO Neos\" while on the field.',0,1900,1300,'./img/69884162'),(70095154,'Cyber Dragon',1,'If only your opponent controls a monster, you can Special Summon this card (from your hand).',0,2100,1600,'./img/70095154'),(70902743,'Red Dragon Archfiend',1,'1 Tuner + 1 or more non-Tuner monsters\r\nAfter damage calculation, if this card attacks a Defense Position monster your opponent controls: Destroy all Defense Position monsters your opponent controls. During your End Phase: Destroy all other monsters you control that did not declare an attack this turn. This card must be face-up on the field to activate and to resolve this effect.',1,3000,2000,'./img/70902743'),(71564252,'Thunder King Rai-Oh',1,'Neither player can add cards from their Deck to their hand except by drawing them. During either player\'s turn, when your opponent would Special Summon exactly 1 monster: You can send this face-up card to the Graveyard; negate the Special Summon, and if you do, destroy it.',0,1900,800,'./img/71564252'),(73580471,'Black Rose Dragon',1,'1 Tuner + 1+ non-Tuner monsters\r\nWhen this card is Synchro Summoned: You can destroy all cards on the field. Once per turn: You can banish 1 Plant monster from your GY, then target 1 Defense Position monster your opponent controls; change that target to face-up Attack Position, and if you do, its ATK becomes 0 until the end of this turn.',1,2400,1800,'./img/73580471'),(74157028,'Cyber Twin Dragon',1,'\"Cyber Dragon\" + \"Cyber Dragon\"\r\nA Fusion Summon of this card can only be done with the above Fusion Materials. This card can make a second attack during each Battle Phase.',1,2800,2100,'./img/74157028'),(77565204,'Future Fusion',0,'During your 1st Standby Phase after this card\'s activation: Show 1 Fusion Monster in your Extra Deck and send the Fusion Materials listed on it from your Main Deck to the GY. During your 2nd Standby Phase after this card\'s activation: Fusion Summon 1 Fusion Monster from your Extra Deck with the same name as the monster you showed, and target it with this card. When this card leaves the field, destroy that target. When that target is destroyed, destroy this card.\r\n',0,NULL,NULL,'./img/77565204'),(79229522,'Chimeratech Fortress Dragon',1,'\"Cyber Dragon\" + 1+ Machine monsters\r\nCannot be used as Fusion Material. Must first be Special Summoned (from your Extra Deck) by sending the above cards from either field to the GY. (You do not use \"Polymerization\".) The original ATK of this card becomes 1000 x the number of Fusion Materials used for its Special Summon.',1,0,0,'./img/79229522'),(80344569,'Neo-Spacian Grand Mole',1,'At the start of the Damage Step, if this card battles an opponent\'s monster: You can return both the opponent\'s monster and this card to the hand.\r\n',0,900,300,'./img/80344569'),(81278754,'Flip Flop Frog',1,'Once per turn, you can flip this card into face-down Defense Position. When this card is flipped face-up, you can return monsters your opponent controls to their owners\' hand up to the number of face-up \"Frog\" monsters you control, except \"Frog the Jam\".',0,500,200,'./img/81278754'),(81439173,'Foolish Burial',0,'Send 1 monster from your Deck to the GY.',0,NULL,NULL,'./img/81439173'),(84451804,'Des Frog',1,'When this card is Tribute Summoned, you can Special Summon \"Des Frog\"(s) from your hand or Deck up to the number of \"T.A.D.P.O.L.E.\"(s) in your Graveyard.',0,1900,0,'./img/84451804'),(91133740,'Snowman Eater',1,'If this card is flipped face-up: Target 1 face-up monster on the field; destroy that target.',0,0,1900,'./img/91133740'),(93369354,'Fishborg Blaster',1,'If you control a face-up Level 3 or lower WATER monster: You can discard 1 card; Special Summon this card from your Graveyard. If this card is used as a Synchro Material Monster, all other Synchro Material Monsters must be WATER.',0,100,200,'./img/93369354'),(96947648,'Salvage',0,'Target 2 WATER monsters with 1500 or less ATK in your Graveyard; add those targets to your hand.',0,NULL,NULL,'./img/96947648'),(97169186,'Smashing Ground',0,'Destroy the 1 face-up monster your opponent controls that has the highest DEF (your choice, if tied).',0,NULL,NULL,'./img/97169186'),(97204936,'Gaia Knight, the Force of Earth',1,'1 Tuner + 1 or more non-Tuner monsters',1,2600,800,'./img/97204936');
/*!40000 ALTER TABLE `carta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `composizionedeck`
--

DROP TABLE IF EXISTS `composizionedeck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `composizionedeck` (
  `id_composizione` int(11) NOT NULL AUTO_INCREMENT,
  `deck` int(11) NOT NULL,
  `carta` int(11) NOT NULL,
  PRIMARY KEY (`id_composizione`),
  KEY `fk_deck_comp` (`deck`),
  KEY `fk_carta_comp` (`carta`),
  CONSTRAINT `fk_carta_comp` FOREIGN KEY (`carta`) REFERENCES `carta` (`cod`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_deck_comp` FOREIGN KEY (`deck`) REFERENCES `deck` (`id_deck`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1513 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `composizionedeck`
--

LOCK TABLES `composizionedeck` WRITE;
/*!40000 ALTER TABLE `composizionedeck` DISABLE KEYS */;
INSERT INTO `composizionedeck` VALUES (1403,17,29401950),(1404,17,29401950),(1405,17,70095154),(1406,17,70095154),(1407,17,7572887),(1408,17,7572887),(1409,17,15341821),(1410,17,15341821),(1411,17,213326),(1412,17,213326),(1413,17,213326),(1414,17,69884162),(1415,17,69884162),(1416,17,69884162),(1417,17,37195861),(1418,17,40044918),(1419,17,81439173),(1420,17,77565204),(1421,17,33846209),(1422,17,33846209),(1423,17,33846209),(1424,17,42703248),(1425,17,44330098),(1426,17,19613556),(1427,17,37742478),(1428,17,37742478),(1429,17,45906428),(1430,17,45906428),(1431,17,45906428),(1432,17,5318639),(1433,17,80344569),(1434,17,67169062),(1435,17,67169062),(1436,17,67169062),(1437,17,32807846),(1438,17,97169186),(1439,17,91133740),(1440,17,91133740),(1441,17,71564252),(1442,17,4206964),(1443,17,26593852),(1444,17,29071332),(1445,17,79229522),(1446,17,23693634),(1447,17,74157028),(1448,17,40854197),(1449,17,40854197),(1450,17,40854197),(1451,17,16304628),(1452,17,16304628),(1453,17,7391448),(1454,17,43385557),(1455,17,70902743),(1456,17,44508094),(1457,17,64463828),(1458,18,12538374),(1459,18,9126351),(1460,18,9126351),(1461,18,9126351),(1462,18,20663556),(1463,18,20663556),(1464,18,20663556),(1465,18,46239604),(1466,18,46239604),(1467,18,46239604),(1468,18,49522489),(1469,18,56052205),(1470,18,84451804),(1471,18,84451804),(1472,18,84451804),(1473,18,81278754),(1474,18,93369354),(1475,18,93369354),(1476,18,93369354),(1477,18,15341821),(1478,18,15341821),(1479,18,22123627),(1480,18,22123627),(1481,18,22123627),(1482,18,96947648),(1483,18,96947648),(1484,18,96947648),(1485,18,67169062),(1486,18,67169062),(1487,18,67169062),(1488,18,2295440),(1489,18,5318639),(1490,18,19613556),(1491,18,42703248),(1492,18,81439173),(1493,18,77565204),(1494,18,37195861),(1495,18,37576645),(1496,18,37576645),(1497,18,37576645),(1498,18,7391448),(1499,18,23693634),(1500,18,23693634),(1501,18,26593852),(1502,18,29071332),(1503,18,29071332),(1504,18,29071332),(1505,18,43385557),(1506,18,44508094),(1507,18,50321796),(1508,18,73580471),(1509,18,70902743),(1510,18,97204936),(1511,18,79229522),(1512,18,40854197);
/*!40000 ALTER TABLE `composizionedeck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deck`
--

DROP TABLE IF EXISTS `deck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deck` (
  `id_deck` int(11) NOT NULL AUTO_INCREMENT,
  `nome_deck` varchar(15) NOT NULL,
  `player` int(11) NOT NULL,
  `is_legal` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_deck`),
  UNIQUE KEY `nome_deck` (`nome_deck`,`player`),
  KEY `fk_player_deck` (`player`),
  CONSTRAINT `fk_player_deck` FOREIGN KEY (`player`) REFERENCES `utente` (`id_utente`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deck`
--

LOCK TABLES `deck` WRITE;
/*!40000 ALTER TABLE `deck` DISABLE KEYS */;
INSERT INTO `deck` VALUES (17,'Hero Beat',18,0),(18,'Frogs OTK',17,0);
/*!40000 ALTER TABLE `deck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partita`
--

DROP TABLE IF EXISTS `partita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partita` (
  `id_partita` int(11) NOT NULL AUTO_INCREMENT,
  `player1` int(11) DEFAULT NULL,
  `player2` int(11) NOT NULL,
  `deck1` int(11) DEFAULT NULL,
  `deck2` int(11) NOT NULL,
  `winner` int(11) DEFAULT NULL,
  `finita` tinyint(1) DEFAULT '0',
  `stato_gioco` json DEFAULT NULL,
  `ultima_modifica` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_partita`),
  KEY `fk_player1_partita` (`player1`),
  KEY `fk_player2_partita` (`player2`),
  KEY `fk_deck1_partita` (`deck1`),
  KEY `fk_deck2_partita` (`deck2`),
  CONSTRAINT `fk_deck1_partita` FOREIGN KEY (`deck1`) REFERENCES `deck` (`id_deck`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_deck2_partita` FOREIGN KEY (`deck2`) REFERENCES `deck` (`id_deck`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_player1_partita` FOREIGN KEY (`player1`) REFERENCES `utente` (`id_utente`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_player2_partita` FOREIGN KEY (`player2`) REFERENCES `utente` (`id_utente`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partita`
--

LOCK TABLES `partita` WRITE;
/*!40000 ALTER TABLE `partita` DISABLE KEYS */;
/*!40000 ALTER TABLE `partita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utente`
--

DROP TABLE IF EXISTS `utente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utente` (
  `id_utente` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_utente`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utente`
--

LOCK TABLES `utente` WRITE;
/*!40000 ALTER TABLE `utente` DISABLE KEYS */;
INSERT INTO `utente` VALUES (17,'Utente1','$2y$10$LGmBb8ahV56kR5OEq4sKremubA4ORsWK8huYeAG9QFoL/9B5BRK9i',0),(18,'Utente2','$2y$10$m5k0/zOs03pf.rjp4G2pmuCOGhVqy0SVEVuOOQ.F.47BIZ2PlEG3q',0);
/*!40000 ALTER TABLE `utente` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-06 19:45:30
