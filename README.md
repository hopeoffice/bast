# Telegram Login Flow Demo

A minimal, ethical demo of a Telegram-like phone-number login flow with verification code countdown and password step.

## Features

- 📱 Phone number input with country codes
- 🔢 Verification code with 60-second countdown timer
- 🔐 Password setup
- 💾 Local data storage (browser localStorage)
- 📊 Account tracking and statistics
- 🎯 Progress indicator

## Demo Rules

- **Phone**: Any 10-digit number
- **Verification Code**: Any 6-digit code  
- **Password**: Any 4+ characters

## How to Use

1. Open `index.html` in a web browser
2. Follow the login flow steps
3. View stored data using the "View Stored Data" button
4. Clear data with "Clear All Data" if needed

## Data Tracking

The demo stores:
- Completed accounts (phone, code, password)
- All login attempts with timestamps
- Success/failure status for each step

## Privacy

- All data is stored locally in your browser
- No data is sent to any server
- You can clear all data at any time

## Files

- `index.html` - Main application
- `style.css` - Styling
- `script.js` - Main JavaScript logic
- `database.js` - Browser storage simulation
- `README.md` - This file

## GitHub Pages

To deploy on GitHub Pages:
1. Push these files to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Access via `https://hopeoffice.github.io/bast/`
