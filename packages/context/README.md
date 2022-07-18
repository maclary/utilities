<div align="center">
    <img alt="hairy maclary" src="../../.github/assets/maclary.png" width="30%"/>
    <h1>@maclary/context</h1><br/>
    <h3>Convert Discord messages and chat input into a single common object</h3><br/>
    <code>npm install @maclary/context discord.js@dev</code><br/>
    <code>yarn add @maclary/context discord.js@dev</code/><br/>
    <code>pnpm add @maclary/context discord.js@dev</code><br/>
</div>

<div align="center">
    <a href="https://github.com/maclary/utilities/blob/main/LICENSE">
        <img alt="license" src="https://img.shields.io/npm/l/maclary">
    </a>
    <a href="https://github.com/maclary/utilities/">
        <img alt="github commit activity" src="https://img.shields.io/github/commit-activity/m/maclary/utilities">
    </a><br/>
    <h2>Packages</h2>
    <a href="https://npmjs.com/@maclary/context">
        <img alt="@maclary/context version" src="https://img.shields.io/npm/v/@maclary/context?color=black&style=flat-square&label=@maclary/context"/>
    </a><br/>
</div>

# Description

Context is a library that can convert Discord.js Messages or ChatInputs into a single, common, object that can be used to easily create slash and message commands without having to write code for each separately. Requires Discord.js >=14.0.0

@maclary/context is still in its early stages, please report any bugs or suggestions you may have.

<div align="center">
    <p>Documentation and guides coming soon!</p>
</div>

# Example

```js
const { Context } = require('@maclary/context');

client.on('messageCreate', async (message) => {
    if (message.content !== '!hello') return;
    const context = new Context(message);
    return sharedRun(context);
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.commandName !== 'hello') return;
    const context = new Context(interaction);
    return sharedRun(context);
});

async function sharedRun(context) {
    await context.deferReply();
    // interaction: `interaction.deferReply()`
    // message: `message.channel.sendTyping()`

    await context.editReply(`Hello ${context.user.username}`);
    // interaction: `interaction.editReply()`
    // message: `reply = message.reply()`

    await context.followUp(`How are you?`);
    // interaction: `interaction.followUp()`
    // message: `message.reply()`

    await context.editReply(`Bye ${context.author.username}`);
    // interaction: `interaction.editReply()`
    // message: `reply.edit()`

    await context.deleteReply();
    // interaction: `interaction.deleteReply()`
    // message: `reply.delete()`
}
```
