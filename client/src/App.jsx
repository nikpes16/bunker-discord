import React, { useState, useEffect, useCallback } from 'react';
import { setupDiscord } from './discordSdk';
import { setupPlayroom } from './playroomSetup';
import {
    useMultiplayerState,
    usePlayersList,
    useIsHost,
    myPlayer,
} from 'playroomkit';
import { dealCards, getRandomDisaster, getRandomBunker, CARD_TYPES } from './gameData';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';

// Game phases
const PHASE = {
    LOBBY: 'lobby',
    PLAYING: 'playing',
};

// Inner game component — only renders AFTER PlayroomKit is initialized
function Game({ discordUser }) {
    const [gamePhase, setGamePhase] = useMultiplayerState('gamePhase', PHASE.LOBBY);
    const [disaster, setDisaster] = useMultiplayerState('disaster', null);
    const [bunker, setBunker] = useMultiplayerState('bunker', null);

    const players = usePlayersList(true);
    const isHost = useIsHost();
    const me = myPlayer();

    // Deal roles handler (host only)
    const handleDealRoles = useCallback(() => {
        if (!isHost || !players.length) return;

        const hands = dealCards(players.length);
        const disasterText = getRandomDisaster();
        const bunkerText = getRandomBunker();

        setDisaster(disasterText, true);
        setBunker(bunkerText, true);

        players.forEach((player, index) => {
            player.setState('cards', hands[index], true);
            player.setState('revealed', {
                [CARD_TYPES.PROFESSION]: false,
                [CARD_TYPES.HEALTH]: false,
                [CARD_TYPES.BAGGAGE]: false,
                [CARD_TYPES.HOBBY]: false,
                [CARD_TYPES.FACT]: false,
                [CARD_TYPES.SPECIAL]: false,
            }, true);
        });

        setGamePhase(PHASE.PLAYING, true);
    }, [isHost, players, setDisaster, setBunker, setGamePhase]);

    // Reset game handler
    const handleResetGame = useCallback(() => {
        if (!isHost) return;

        setDisaster(null, true);
        setBunker(null, true);

        players.forEach((player) => {
            player.setState('cards', null, true);
            player.setState('revealed', {
                [CARD_TYPES.PROFESSION]: false,
                [CARD_TYPES.HEALTH]: false,
                [CARD_TYPES.BAGGAGE]: false,
                [CARD_TYPES.HOBBY]: false,
                [CARD_TYPES.FACT]: false,
                [CARD_TYPES.SPECIAL]: false,
            }, true);
        });

        setGamePhase(PHASE.LOBBY, true);
    }, [isHost, players, setDisaster, setBunker, setGamePhase]);

    return (
        <div className="app-container">
            {gamePhase === PHASE.LOBBY || gamePhase === 'lobby' ? (
                <Lobby
                    players={players}
                    isHost={isHost}
                    onDealRoles={handleDealRoles}
                    disaster={disaster}
                    bunker={bunker}
                    me={me}
                />
            ) : (
                <GameBoard
                    players={players}
                    me={me}
                    isHost={isHost}
                    disaster={disaster}
                    bunker={bunker}
                    onResetGame={handleResetGame}
                />
            )}
        </div>
    );
}

// Root app — handles initialization, shows loading/error screens
export default function App() {
    const [loading, setLoading] = useState(true);
    const [loadingText, setLoadingText] = useState('Инициализация...');
    const [error, setError] = useState(null);
    const [discordUser, setDiscordUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let done = false;

        // Emergency timeout — force-show game after 20s no matter what
        const emergency = setTimeout(() => {
            if (!done) {
                console.warn('[App] Аварийный таймаут 20с — принудительный запуск');
                done = true;
                setLoading(false);
                setReady(true);
            }
        }, 20000);

        async function init() {
            try {
                // Try Discord auth
                setLoadingText('Подключение к Discord...');
                let user = null;
                try {
                    user = await setupDiscord();
                    setDiscordUser(user);
                } catch (e) {
                    console.warn('Discord SDK unavailable:', e.message);
                    user = {
                        id: 'test_' + Math.random().toString(36).substr(2, 9),
                        username: 'Выживший_' + Math.floor(Math.random() * 999),
                        global_name: 'Выживший #' + Math.floor(Math.random() * 999),
                        avatar: null,
                    };
                    setDiscordUser(user);
                }

                // Initialize Playroom
                setLoadingText('Подключение к комнате...');
                await setupPlayroom(user);

                if (!done) {
                    done = true;
                    clearTimeout(emergency);
                    setLoadingText('Готово!');
                    setTimeout(() => {
                        setLoading(false);
                        setReady(true);
                    }, 600);
                }
            } catch (err) {
                console.error('Initialization error:', err);
                if (!done) {
                    done = true;
                    clearTimeout(emergency);
                    setError(err.message);
                }
            }
        }

        init();
        return () => clearTimeout(emergency);
    }, []);

    if (error) {
        return (
            <div className="app-container">
                <div className="error-screen">
                    <div className="error-icon">☢️</div>
                    <h1>СИСТЕМНАЯ ОШИБКА</h1>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary">
                        ПЕРЕЗАПУСК
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="app-container">
                <div className="loading-screen">
                    <div className="loading-icon">
                        <div className="radiation-symbol">☢</div>
                    </div>
                    <h1 className="loading-title">БУНКЕР</h1>
                    <p className="loading-subtitle">{loadingText}</p>
                    <div className="loading-bar">
                        <div className="loading-bar-fill"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Only render Game after PlayroomKit is initialized
    if (ready) {
        return <Game discordUser={discordUser} />;
    }

    return null;
}
