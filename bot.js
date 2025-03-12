//Require
const tmi = require('tmi.js');
const { app, BrowserWindow, screen } = require('electron');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Load configuration from config.yaml
const configPath = path.join(__dirname, 'config.yaml');
const config = yaml.load(fs.readFileSync(configPath, 'utf8'));

// Popup Configuration
const {
    MaxPopups,
    MinPopups,
    MaxDuration,
    MinDuration,
    WindowWidth,
    WindowHeight,
    SpawnDelay,
    RespondToUser
} = config.PopupConfiguration;

// Twitch Configuration
const {
    Username: twitchUsername,
    Token: twitchToken,
    Channel: twitchChannel
} = config.TwitchConfiguration;

// Create a Twitch client
const twitchClient = new tmi.Client({
    identity: {
        username: twitchUsername,
        password: twitchToken
    },
    channels: [twitchChannel]
});

// Connect to Twitch
twitchClient.connect().then(() => {
    console.log(`* Connected to Twitch chat`);
}).catch(console.error);

// Function to create an Electron window
function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const randomX = Math.floor(Math.random() * (width - WindowWidth));
    const randomY = Math.floor(Math.random() * (height - WindowHeight));

    let win = new BrowserWindow({
        x: randomX,
        y: randomY,
        width: WindowWidth,
        height: WindowHeight,
        webPreferences: {
            nodeIntegration: true
        },
        alwaysOnTop: true, // Ensure the window is always on top
        frame: false, // Hide the title bar
        titleBarStyle: 'hidden' // Hide the title bar but keep the close button
    });

    // Get a random image from the ./assets folder
    const assetsPath = path.join(__dirname, 'assets');
    const files = fs.readdirSync(assetsPath);
    const images = files.filter(file => /\.(jpg|jpeg|png|gif|mp4)$/i.test(file));
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imagePath = path.join(assetsPath, randomImage);

    win.loadURL(`file://${imagePath}`); // Load the random image

    // Handle window close event
    win.on('closed', () => {
        // Dereference the window object
        win = null;
    });

    // Close the window after a random time between 5 and 10 seconds
    const closeTime = Math.floor(Math.random() * (MaxDuration-MinDuration)) + MinDuration; // Random time between 5000 and 10000 milliseconds
    setTimeout(() => {
        if (win) {
            win.close();
        }
    }, closeTime);
}

// Function to create multiple Electron windows with a delay
function createMultipleWindows(username) {
    const numWindows = Math.floor(Math.random() * MaxPopups) + MinPopups; // Random number of popups
    
    //Respond to the user in Twitch chat
    if(respondtouser == 1){
        twitchClient.say(twitchChannel, `@${username} spawned ${numWindows} popup(s)`);
    }

    for (let i = 0; i < numWindows; i++) {
        setTimeout(() => {
            createWindow();
        }, i * SpawnDelay);
    }
}

// Log Twitch chat messages to console and respond to commands
twitchClient.on('message', (channel, tags, message, self) => {
    if (self) return; // Ignore messages from the bot

    console.log(`[${tags['display-name']}] ${message}`);

    // Open multiple Electron windows on !popup command
    if (message.trim() === '!popup') {
        app.whenReady().then(() => createMultipleWindows(tags['display-name']));
    }
});

// Log connection status
twitchClient.on('connected', (address, port) => {
    console.log(`* Connected to ${address}:${port}`);
});

twitchClient.on('disconnected', (reason) => {
    console.log(`* Disconnected: ${reason}`);
});

// Handle Electron app lifecycle events
app.on('window-all-closed', () => {
    // Do not quit the app when all windows are closed
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});