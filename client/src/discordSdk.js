import { DiscordSDK } from '@discord/embedded-app-sdk';

let discordSdk = null;
let auth = null;
let currentUser = null;

function isInsideDiscord() {
    const params = new URLSearchParams(window.location.search);
    return params.has('frame_id') || params.has('instance_id');
}

export async function setupDiscord() {
    if (!isInsideDiscord()) {
        throw new Error('Not inside Discord iframe');
    }

    // Lazy-init SDK only inside Discord
    discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

    await discordSdk.ready();

    // Authorize
    const { code } = await discordSdk.commands.authorize({
        client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
        response_type: 'code',
        state: '',
        prompt: 'none',
        scope: ['identify', 'guilds'],
    });

    // Exchange code for access_token
    const response = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
    });

    const { access_token } = await response.json();

    // Authenticate with Discord
    auth = await discordSdk.commands.authenticate({ access_token });

    if (!auth) {
        throw new Error('Authentication failed');
    }

    // Fetch user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    currentUser = await userResponse.json();
    return currentUser;
}

export function getUser() {
    return currentUser;
}

export function getAuth() {
    return auth;
}

export function getDiscordSdk() {
    return discordSdk;
}
