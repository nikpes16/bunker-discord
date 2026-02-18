import React, { useState } from 'react';

export default function PlayerCard({ type, label, icon, value, isRevealed, isMe, onReveal }) {
    const [animating, setAnimating] = useState(false);

    const handleClick = () => {
        if (!isMe || isRevealed || animating) return;

        setAnimating(true);
        onReveal();

        setTimeout(() => setAnimating(false), 600);
    };

    return (
        <div
            className={`card ${isRevealed ? 'card--revealed' : 'card--hidden'} ${animating ? 'card--animating' : ''
                } ${isMe && !isRevealed ? 'card--clickable' : ''} card--${type}`}
            onClick={handleClick}
            role={isMe && !isRevealed ? 'button' : undefined}
            tabIndex={isMe && !isRevealed ? 0 : undefined}
        >
            <div className="card-inner">
                {/* Card back */}
                <div className="card-back">
                    <div className="card-back-pattern">
                        <div className="card-back-icon">☢</div>
                        <div className="card-back-label">{label}</div>
                        {isMe && !isRevealed && (
                            <div className="card-back-hint">Нажми, чтобы вскрыть</div>
                        )}
                    </div>
                </div>

                {/* Card front */}
                <div className="card-front">
                    <div className="card-front-header">
                        <span className="card-front-icon">{icon}</span>
                        <span className="card-front-type">{label}</span>
                    </div>
                    <div className="card-front-value">{value}</div>
                    <div className="card-front-decoration">
                        <div className="corner-deco corner-deco--tl"></div>
                        <div className="corner-deco corner-deco--tr"></div>
                        <div className="corner-deco corner-deco--bl"></div>
                        <div className="corner-deco corner-deco--br"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
