client.on('interactionCreate', async interaction => {
    // Jeśli to slash command - ładuj z folderu commands
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) await command.execute(interaction);
    } 
    // Jeśli to przycisk lub modal - wywołaj logikę z InteractionCreate.js
    else {
        require('./events/interactionCreate')(interaction);
    }
});
