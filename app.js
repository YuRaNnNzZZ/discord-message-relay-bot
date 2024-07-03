/*
 * Copyright (c) 2024, YuRaNnNzZZ
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

var fs = require("fs");
var Discord = require("discord.js");

var channelsListFileName = "bot-channels.txt";
var channelsListMatcher = /^(\d+)\?https:\/\/[\w\.]*discord.com\/api\/webhooks\/(\d+)\/([\w-]+)$/;

if (!fs.existsSync(channelsListFileName)) {
    console.log(`No channels list file detected. Please create a file named ${channelsListFileName} and add webhooks in there.`);
    process.exit(1);
}

var channelsList = fs.readFileSync(channelsListFileName, "utf-8");

if (!channelsList || channelsList === "") {
    console.log(`Empty channels list file detected. Please add some webhooks into ${channelsListFileName} file.`);
    process.exit(1);
}

var webhooks = {};

channelsList.match(/[^\r\n]+/g).forEach((line, num) => {
    var channelHookLine = line.match(channelsListMatcher);

    if (channelHookLine && channelHookLine.length >= 4) {
        var webhookClient = new Discord.WebhookClient(channelHookLine[2], channelHookLine[3]);

        webhooks[channelHookLine[1]] = webhookClient;
    }
});

if (webhooks.length <= 0) {
    console.log("No valid webhooks have been added. Aborting.");
    process.exit(1);
}

var client = new Discord.Client();

client.on('message', (message) => {
    if (message.webhookID || !webhooks[message.channel.id]) {
        return;
    }

    var targetWebhook = webhooks[message.channel.id];

    var files = [];

    // Handle files because fuck you discord.js
    message.attachments.forEach((attIn) => {
        var file = {
            attachment: attIn.attachment,
            name: attIn.name
        };

        files.push(file);
    });

    // Send the webhook
    targetWebhook.send(message.content, {
        disableMentions: true,
        username: message.author.username,
        avatarURL: message.author.avatarURL(),
        embeds: message.embeds,
        files: files
    }).then((msgOut) => {
        console.log(`[#${message.channel.name}] Redirected message ${message.id} from ${message.author.username} (${message.author.id}): ${message.content}`);
    }).catch(console.error);
});

client.once("ready", () => {
    console.log(`Bot client ready with ${Object.keys(webhooks).length} webhook relays.`);
});

var botTokenFileName = "bot-token.txt";

if (!fs.existsSync(botTokenFileName)) {
    console.log(`No bot token file detected. Please create a file named ${botTokenFileName} and paste the bot token into it.`);
    process.exit(1);
}

var authToken = fs.readFileSync(botTokenFileName, "utf-8");

if (!authToken || authToken === "") {
    console.log(`Empty bot token file detected. Please paste the bot token into ${botTokenFileName} file.`);
    process.exit(1);
}

client.login(authToken);