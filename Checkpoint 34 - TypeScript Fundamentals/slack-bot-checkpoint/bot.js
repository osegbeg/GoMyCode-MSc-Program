require('dotenv').config();
const { App } = require('@slack/bolt');

// 1. Initialize the Bolt app using Socket Mode
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// 2. Listen and respond to the /hello slash command
app.command('/hello', async ({ command, ack, say }) => {
  // Acknowledge the command request immediately (required by Slack within 3 seconds)
  await ack();

  // Reply in the channel
  await say(`Hey there <@${command.user_id}>! Your Slack bot is live and running!`);
});

// 3. Listen to and log all messages in channels the bot is added to
app.message(async ({ message, logger }) => {
  // Ignore bot's own messages or system subtypes so logs stay clean
  if (!message.subtype) {
    console.log(`[Channel: ${message.channel}] User ${message.user}: ${message.text}`);
  }
});

// 4. Start the bot
(async () => {
  await app.start();
  console.log('⚡ Bolt Slack bot is running!');
})();