# RBLX-Group-Master
# RBLX Group Master Discord Bot

A Discord bot for managing Roblox groups through slash commands. Easily promote members, view group information, and send group shouts.

## Features

- `/promote` - Promote users in your Roblox group
- `/groupinfo` - View detailed information about your group
- `/ranks` - List all available ranks in your group
- `/groupshout` - Send announcements to your group

## Setup

1. Install dependencies:
```bash
npm install discord.js noblox.js dotenv
```

2. Create a `.env` file in your project root with the following:
```env
DISCORD_TOKEN=your_discord_bot_token
ROBLOX_COOKIE=your_roblox_cookie
ROBLOX_GROUP_ID=your_group_id
ALLOWED_DISCORD_ROLES=role1Id,role2Id
```

3. Configure your Discord bot:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Add a bot to your application
   - Copy the bot token to your `.env` file
   - Enable necessary bot permissions

4. Get your Roblox cookie and group ID:
   - Log into Roblox
   - Open DevTools (F12)
   - Go to Application > Cookies > .ROBLOSECURITY
   - Copy the cookie value to your `.env` file
   - Get your group ID from your group's URL

5. Run the bot:
```bash
node index.js
```

## Permission Requirements

Users need either:
- Discord "Manage Roles" permission
- One of the allowed roles specified in ALLOWED_DISCORD_ROLES

## Security Notice

Keep your .env file secure and never share your Roblox cookie or Discord token.

## Support

If you need help or want to report issues:
1. Check the existing issues
2. Create a new issue with detailed information
3. Join our Discord server [coming soon]

## License

MIT License - feel free to use and modify as needed.
