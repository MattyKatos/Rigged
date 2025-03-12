# Rigged

Rigged is a Twitch bot that spawns Electron windows with random images from the `assets` folder when a specific command is received in the Twitch chat.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/mattykatos/rigged.git
    cd rigged
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `config.yaml` file based on the `config.template.yaml` file:

4. Edit the `config.yaml` file to include your Twitch credentials and desired configuration:

## Usage

1. Run the setup script to create the `assets` folder if it doesn't exist:

    ```sh
    npm run setup
    ```

2. Start the bot:

    ```sh
    npm start
    ```

## Commands

- `!popup`: Spawns a random number of Electron windows with random images from the `assets` folder.
Each window will close itself after a random time.

## License

This project is licensed under the MIT License.