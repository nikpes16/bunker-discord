import { insertCoin, isStreamScreen, onPlayerJoin, myPlayer } from 'playroomkit';

let initialized = false;

function isInsideDiscord() {
    const params = new URLSearchParams(window.location.search);
    return params.has('frame_id') || params.has('instance_id');
}

export async function setupPlayroom(discordUser) {
    if (initialized) return;

    await insertCoin({
        discord: isInsideDiscord(),
        maxPlayersPerRoom: 12,
        defaultPlayerState: {
            cards: null,
            revealed: {
                profession: false,
                health: false,
                baggage: false,
                hobby: false,
                fact: false,
                special: false,
            },
            name: discordUser?.global_name || discordUser?.username || 'Игрок',
            avatar: discordUser?.avatar
                ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
                : null,
        },
    });

    // Set player name from Discord
    const me = myPlayer();
    if (me && discordUser) {
        me.setState('name', discordUser.global_name || discordUser.username || 'Игрок');
        if (discordUser.avatar) {
            me.setState(
                'avatar',
                `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            );
        }
    }

    initialized = true;
}

export { isStreamScreen, onPlayerJoin, myPlayer };
