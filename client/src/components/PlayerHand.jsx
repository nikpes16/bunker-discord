import React from 'react';
import { usePlayerState } from 'playroomkit';
import PlayerCard from './PlayerCard';
import { CARD_TYPES, CARD_LABELS, CARD_ICONS } from '../gameData';

const CARD_ORDER = [
    CARD_TYPES.PROFESSION,
    CARD_TYPES.HEALTH,
    CARD_TYPES.BAGGAGE,
    CARD_TYPES.HOBBY,
    CARD_TYPES.FACT,
    CARD_TYPES.SPECIAL,
];

export default function PlayerHand({ player, isMe }) {
    const [cards] = usePlayerState(player, 'cards', null);
    const [revealed, setRevealed] = usePlayerState(player, 'revealed', {});

    if (!cards) {
        return (
            <div className="player-hand player-hand--empty">
                <p>Карты ещё не розданы...</p>
            </div>
        );
    }

    const handleReveal = (cardType) => {
        if (!isMe) return;
        if (revealed[cardType]) return; // Already revealed

        const newRevealed = { ...revealed, [cardType]: true };
        setRevealed(newRevealed, true);
    };

    return (
        <div className="player-hand">
            <div className="cards-grid">
                {CARD_ORDER.map((type) => (
                    <PlayerCard
                        key={type}
                        type={type}
                        label={CARD_LABELS[type]}
                        icon={CARD_ICONS[type]}
                        value={cards[type]}
                        isRevealed={!!revealed[type]}
                        isMe={isMe}
                        onReveal={() => handleReveal(type)}
                    />
                ))}
            </div>
        </div>
    );
}
