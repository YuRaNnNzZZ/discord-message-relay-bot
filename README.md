# Discord One-Sided Channel Relay Bot
### A simple bot that relays messages from one channel to another using webhooks.

## Setup and usage
1. Clone or download this repo.
1. Install [Node.js](https://nodejs.org/en/).
1. Add a webhook to the output channel.
1. Create a file named `bot-channels.txt` and add the webhook URL in it. Format is `inputchannelid?webhookURL`, multiple webhooks could be ran simultaneously.
1. Create a file named `bot-token.txt` and paste the bot token in there. ([Create a bot user](https://discordapp.com/developers/applications) if you haven't done so already)
1. Execute `npm install` to install discord.js packages
1. Execute `npm run start` to start the bot