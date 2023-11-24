import { SlashCommandBuilder, EmbedBuilder, CacheType, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('lookup')
    .setDescription('Get information about your culture.')
    .addNumberOption(option =>
        option.setName("code")
            .setDescription("6-digit code that links to wholesome culture.")
            .setRequired(true)
    )

    export async function execute(interaction:ChatInputCommandInteraction<CacheType>) {
        const id = interaction.options.getNumber('code')!

        const request = await fetch('https://wholesomelist.com/api/check?code='+id.toString())
        const culture = await request.json()
	    const item:entry = culture.entry
        console.log(culture)

        const embed = new EmbedBuilder()
            .setColor(0xED2553)
            if (culture.result === false) {
                embed.setTitle("Not found ):")
                    .setDescription('Try /unwholesome lookup')
            } else {
                embed.setTitle(item.title)
                    .setURL(item.link)
                    .setDescription(item.nh === null ? "Not on NHentai." : /\d+/.exec(item.nh)!.toString())
                    .setThumbnail(item.image)
                    .addFields(
                        {name: 'Pages', value: culture.entry.pages.toString()},
                        {name: 'Author', value: culture.entry.author.toString(), inline: true},
                        {name: 'Tags', value: culture.entry.tags === null ? "none" : culture.entry.tags.toString()},
                    )
                    if (culture.entry.note !== null) embed.addFields({name: 'Note', value: culture.entry.note, inline:true})
                }

        return interaction.editReply({embeds: [embed]})
    }