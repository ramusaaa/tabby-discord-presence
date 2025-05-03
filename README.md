# Tabby Discord Rich Presence

A Tabby terminal addon that shows your current activity in Discord.

## Features

- Shows when you're using Tabby Terminal
- Displays your current activity
- Updates presence every 15 seconds
- Customizable presence details

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
4. Get your application's Client ID
5. Replace `YOUR_DISCORD_CLIENT_ID` in `src/index.ts` with your actual Client ID
6. Build the addon:
   ```bash
   npm run build
   ```

## Usage

1. Install the addon in your Tabby terminal
2. Make sure Discord is running
3. The presence will automatically update when you're using Tabby

## Configuration

You can customize the presence details by modifying the `updatePresence` method in `src/index.ts`.

## License

MIT 