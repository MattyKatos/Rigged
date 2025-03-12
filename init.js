// Initialize the project by creating the assets folder if it doesn't exist

const fs = require('fs');
const path = require('path');

// Create the assets folder if it doesn't exist
const assetsPath = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath);
    console.log('Assets folder created.');
} else {
    console.log('Assets folder already exists.');
}