import { DiscordSDK } from '@discord/embedded-app-sdk';

let discordSdk = null;
let auth = null;
let currentUser = null;

function isInsideDiscord() {
    const params = new URLSearchParams(window.location.search);
    return params.has('frame_id') || params.has('instance_id');
}

function withTimeout(promise, ms, label) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Таймаут: ${label} (${ms / 1000}с)`)), ms)
        ),
    ]);
}

export async function setupDiscord() {
    if (!isInsideDiscord()) {
        throw new Error('Not inside Discord iframe');
    }

    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    console.log('[Discord] Client ID:', clientId ? '✓ задан' : '✗ ОТСУТСТВУЕТ');

    if (!clientId) {
        throw new Error('VITE_DISCORD_CLIENT_ID не задан');
    }

    discordSdk = new DiscordSDK(clientId);

    console.log('[Discord] Ожидание ready()...');
    await withTimeout(discordSdk.ready(), 10000, 'discordSdk.ready()');
    console.log('[Discord] ready() ✓');

    // Authorize
    console.log('[Discord] Авторизация...');
    const { code } = await withTimeout(
        discordSdk.commands.authorize({
            client_id: clientId,
            response_type: 'code',
            state: '',
            prompt: 'none',
            scope: ['identify', 'guilds'],
        }),
        15000,
        'authorize'
    );
    console.log('[Discord] authorize() ✓');

    // Exchange code for access_token
    console.log('[Discord] Обмен токена...');
    const response = await withTimeout(
        fetch('/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        }),
        10000,
        'fetch /api/token'
    );

    const { access_token } = await response.json();
    console.log('[Discord] Токен получен:', access_token ? '✓' : '✗ ПУСТО');

    if (!access_token) {
        throw new Error('access_token не получен от /api/token');
    }

    // Authenticate with Discord
    console.log('[Discord] Аутентификация...');
    auth = await withTimeout(
        discordSdk.commands.authenticate({ access_token }),
        10000,
        'authenticate'
    );

    if (!auth) {
        throw new Error('Authentication failed');
    }
    console.log('[Discord] authenticate() ✓');

    // Fetch user info
    console.log('[Discord] Загрузка профиля...');
    const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    currentUser = await userResponse.json();
    console.log('[Discord] Пользователь:', currentUser.username, '✓');
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
