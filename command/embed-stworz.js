const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed-stworz')
        .setDescription('Otwiera kreator embedów'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Kreator Embedów')
            .setDescription('Użyj przycisków, aby skonfigurować swój embed.')
            .setColor(0x4974FF);

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_title').setLabel('Tytuł').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('btn_desc').setLabel('Treść').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('btn_color').setLabel('Kolor (HEX)').setStyle(ButtonStyle.Primary),
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_footer').setLabel('Stopka/Autor').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('btn_image').setLabel('Zdjęcia').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('btn_time').setLabel('Timestamp').setStyle(ButtonStyle.Secondary),
        );

        const row3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_save').setLabel('Gotowe').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('btn_download').setLabel('Pobierz JSON').setStyle(ButtonStyle.Secondary),
        );

        await interaction.reply({ embeds: [embed], components: [row1, row2, row3] });
    },
};
