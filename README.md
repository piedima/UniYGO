# UniYGO - TCG Multiplayer Simulator

UniYGO is a web-based multiplayer Trading Card Game (TCG) simulator inspired by Yu-Gi-Oh! mechanics.
The project was developed as a full-stack application to manage real-time matches, deckbuilding and state synchronization between players.

## Technologies
* **Frontend**: HTML5, Vanilla Javascript (asynchronous DOM manipulation).
* **Backend**: PHP with sessione-based architecture.
* **Database**: MySQL (managed via PDO).
* **Networking**: HTTP polling architecture for game state synchronization.
* **Security**: BCrypt password hashing, Prepared Statements (PDO) for SQL Injection prevention and input sanitization (XSS protection)

## Main Features
* **Multiplayer System**: Real-Time room management with synchronized game state ('playroom_multiplayer.js').
* **Deckbuilder**: Dynamic management of Main and Extra Decks.
* **Authentication**: Secure registration and login system.
* **Game Logic**: Full support for graveyard, banishment, field zone, and an ingame chat that works also as a log.

## Local Installation
To run UniYGO on your local machine:
1. **Requirements**: Ensure you have XAMPP (or a similar environment) installed.
2. **Clone the repo**: using 'git clone https://github.com/piedima/UniYgo.git'.
3. **Database**: Import the 'database.sql' file located in the root directory via phpMyAdmin.
4. **Configuration**:
   * Rename 'php/config.example.php' to 'php/config.php'.
   * Set your local database credentials.
5. **Launch**: Move the project folder to 'htdocs' and navigate to 'http://localhost/UniYGO' in your browser.
  
