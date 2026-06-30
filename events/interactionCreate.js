const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

const embedDrafts = new Map();

module.exports = async (interaction) => {
    const uid = interaction.user.id;

    // OBSŁUGA PRZYCISKÓW
    if (interaction.isButton()) {
        if (interaction.customId === 'btn_download') {
            return interaction.reply({ content: `\`\`\`json\n${JSON.stringify(embedDrafts.get(uid) || {}, null, 2)}\n\`\`\``, ephemeral: true });
        }
        
        // Mapowanie przycisków na modale
        const modals = {
            btn_title: { title: 'Tytuł', label: 'Wpisz tytuł', style: TextInputStyle.Short },
            btn_desc: { title: 'Treść', label: 'Wpisz treść', style: TextInputStyle.Paragraph },
            btn_color: { title: 'Kolor', label: 'Wpisz HEX (np. 4974FF)', style: TextInputStyle.Short },
            btn_image: { title: 'Zdjęcia', label: 'Wpisz URL lub "server"', style: TextInputStyle.Short },
            btn_footer: { title: 'Stopka', label: 'Wpisz treść stopki', style: TextInputStyle.Short }
        };

        if (modals[interaction.customId]) {
            const m = modals[interaction.customId];
            const modal = new ModalBuilder().setCustomId(`modal_${interaction.customId}`).setTitle(m.title);
            const input = new TextInputBuilder().setCustomId('val').setLabel(m.label).setStyle(m.style).setRequired(true);
            modal.addComponents(new ActionRowBuilder().addComponents(input));
            return interaction.showModal(modal);
        }

        if (interaction.customId === 'btn_time') {
            const draft = embedDrafts.get(uid) || {};
            draft.timestamp = !draft.timestamp;
            embedDrafts.set(uid, draft);
            return interaction.reply({ content: `Timestamp zmieniony na: ${draft.timestamp}`, ephemeral: true, fetchReply: true }).then(m => setTimeout(() => m.delete(), 2000));
        }
    }

    // OBSŁUGA MODALI
    if (interaction.isModalSubmit()) {
        const val = interaction.fields.getTextInputValue('val');
        const draft = embedDrafts.get(uid) || {};

        if (interaction.customId === 'modal_btn_title') draft.title = val;
        if (interaction.customId === 'modal_btn_desc') draft.description = val;
        if (interaction.customId === 'modal_btn_color') draft.color = parseInt(val.replace('#', ''), 16);
        if (interaction.customId === 'modal_btn_image') draft.image = val;
        if (interaction.customId === 'modal_btn_footer') draft.footer = val;

        embedDrafts.set(uid, draft);

        const finalEmbed = new EmbedBuilder()
            .setTitle(draft.title || 'Brak tytułu')
            .setDescription(draft.description || 'Brak treści')
            .setColor(draft.color || 0x4974FF);
        
        if (draft.footer) finalEmbed.setFooter({ text: draft.footer });
        if (draft.timestamp) finalEmbed.setTimestamp();
        if (draft.image) {
            const url = draft.image === 'server' ? interaction.guild.iconURL() : draft.image;
            finalEmbed.setThumbnail(url);
        }

        await interaction.update({ embeds: [finalEmbed] });
    }
};
