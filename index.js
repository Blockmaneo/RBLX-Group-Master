require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const noblox = require('noblox.js');

// Discord client setup with properly configured intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

// Rest of the code remains the same
const config = {
    groupId: process.env.ROBLOX_GROUP_ID,
    allowedRoles: process.env.ALLOWED_DISCORD_ROLES?.split(',') || []
};

async function initializeBot() {
    try {
        await noblox.setCookie(process.env.ROBLOX_COOKIE);
        console.log('Successfully logged into Roblox!');
        
        const commands = [
            new SlashCommandBuilder()
                .setName('promote')
                .setDescription('Promote a user in the Roblox group')
                .addStringOption(option =>
                    option.setName('username')
                        .setDescription('Roblox username of the player')
                        .setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
            
            new SlashCommandBuilder()
                .setName('groupinfo')
                .setDescription('Get information about the Roblox group')
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
            
            new SlashCommandBuilder()
                .setName('ranks')
                .setDescription('View all available ranks in the group')
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
            
            new SlashCommandBuilder()
                .setName('groupshout')
                .setDescription('Send a group shout')
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Message to shout')
                        .setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        ];

        await client.application?.commands.set(commands);
    } catch (error) {
        console.error('Failed to initialize bot:', error);
    }
}

function hasPermission(member) {
    return member.permissions.has(PermissionFlagsBits.ManageRoles) || 
           config.allowedRoles.some(role => member.roles.cache.has(role));
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    
    if (!hasPermission(interaction.member)) {
        return interaction.reply({
            content: 'You need the "Manage Roles" permission or an allowed role to use this command.',
            ephemeral: true
        });
    }

    try {
        switch (interaction.commandName) {
            case 'promote':
                await handlePromote(interaction);
                break;
            case 'groupinfo':
                await handleGroupInfo(interaction);
                break;
            case 'ranks':
                await handleRanks(interaction);
                break;
            case 'groupshout':
                await handleGroupShout(interaction);
                break;
        }
    } catch (error) {
        console.error('Error handling command:', error);
        await interaction.reply({
            content: 'An error occurred while processing the command.',
            ephemeral: true
        });
    }
});

async function handlePromote(interaction) {
    const username = interaction.options.getString('username');
    
    try {
        const userId = await noblox.getIdFromUsername(username);
        const currentRank = await noblox.getRankInGroup(config.groupId, userId);
        await noblox.promote(config.groupId, userId);
        const newRank = await noblox.getRankInGroup(config.groupId, userId);
        
        const embed = new EmbedBuilder()
            .setTitle('User Promoted')
            .setColor('#00ff00')
            .addFields(
                { name: 'User', value: username },
                { name: 'Old Rank', value: currentRank.toString() },
                { name: 'New Rank', value: newRank.toString() }
            );
            
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({
            content: `Failed to promote user: ${error.message}`,
            ephemeral: true
        });
    }
}

async function handleGroupInfo(interaction) {
    try {
        const group = await noblox.getGroup(config.groupId);
        
        const embed = new EmbedBuilder()
            .setTitle(group.name)
            .setDescription(group.description || 'No description')
            .setColor('#0099ff')
            .addFields(
                { name: 'Member Count', value: group.memberCount.toString() },
                { name: 'Owner', value: group.owner?.username || 'No owner' },
                { name: 'Group ID', value: config.groupId }
            );
            
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({
            content: `Failed to fetch group info: ${error.message}`,
            ephemeral: true
        });
    }
}

async function handleRanks(interaction) {
    try {
        const roles = await noblox.getRoles(config.groupId);
        
        const embed = new EmbedBuilder()
            .setTitle('Group Ranks')
            .setColor('#0099ff');
            
        roles.forEach(role => {
            embed.addFields({
                name: role.name,
                value: `Rank: ${role.rank}`
            });
        });
        
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({
            content: `Failed to fetch ranks: ${error.message}`,
            ephemeral: true
        });
    }
}

async function handleGroupShout(interaction) {
    const message = interaction.options.getString('message');
    
    try {
        await noblox.shout(config.groupId, message);
        
        const embed = new EmbedBuilder()
            .setTitle('Group Shout Sent')
            .setDescription(message)
            .setColor('#00ff00');
            
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({
            content: `Failed to send group shout: ${error.message}`,
            ephemeral: true
        });
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    initializeBot();
});

client.login(process.env.DISCORD_TOKEN);