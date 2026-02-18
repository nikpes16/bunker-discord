import React from 'react';
import { usePlayerState } from 'playroomkit';
import { CARD_TYPES, CARD_LABELS, CARD_ICONS } from '../gameData';

const CARD_ORDER = [
    CARD_TYPES.PROFESSION,
    CARD_TYPES.HEALTH,
    CARD_TYPES.BAGGAGE,
    CARD_TYPES.HOBBY,
    CARD_TYPES.FACT,
    CARD_TYPES.SPECIAL,
];

export default function OtherPlayer({ player }) {
    const [cards] = usePlayerState(player, 'cards', null);
    const [revealed] = usePlayerState(player, 'revealed', {});
    const [name] = usePlayerState(player, 'name', 'Неизвестный');
    const [avatar] = usePlayerState(player, 'avatar', null);

    if (!cards) return null;

    const revealedCount = Object.values(revealed).filter(Boolean).length;

    return (
        <div className="other-player">
            <div className="other-player-header">
                <div className="other-player-avatar">
                    {avatar ? (
                        <img src={avatar} alt={name} />
                    ) : (
                        <div className="avatar-placeholder avatar-placeholder--sm">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="other-player-info">
                    <span className="other-player-name">{name}</span>
                    <span className="other-player-stats">
                        Вскрыто: {revealedCount}/6
                    </span>
                </div>
            </div>

            <div className="other-player-cards">
                {CARD_ORDER.map((type) => {
                    const isRevealed = !!revealed[type];
                    return (
                        <div
                            key={type}
                            className={`mini-card ${isRevealed ? 'mini-card--revealed' : 'mini-card--hidden'} mini-card--${type}`}
                        >
                            <div className="mini-card-icon">
                                {isRevealed ? CARD_ICONS[type] : '?'}
                            </div>
                            <div className="mini-card-label">{CARD_LABELS[type]}</div>
                            {isRevealed && (
                                <div className="mini-card-value">{cards[type]}</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
