import React, { useState } from 'react';
import PlayerHand from './PlayerHand';
import OtherPlayer from './OtherPlayer';

export default function GameBoard({ players, me, isHost, disaster, bunker, onResetGame }) {
    const [showScenario, setShowScenario] = useState(true);

    return (
        <div className="game-board">
            {/* Scenario panel */}
            <div className={`scenario-panel ${showScenario ? 'scenario-panel--open' : ''}`}>
                <button
                    className="scenario-toggle"
                    onClick={() => setShowScenario(!showScenario)}
                >
                    {showScenario ? '▼ Скрыть сценарий' : '▲ Показать сценарий'}
                </button>

                {showScenario && (
                    <div className="scenario-content">
                        <div className="scenario-disaster">
                            <div className="scenario-label">
                                <span className="scenario-icon">☢️</span> КАТАСТРОФА
                            </div>
                            <p className="scenario-text">{disaster}</p>
                        </div>
                        <div className="scenario-bunker">
                            <div className="scenario-label">
                                <span className="scenario-icon">🏠</span> БУНКЕР
                            </div>
                            <p className="scenario-text">{bunker}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* My hand */}
            {me && (
                <div className="my-hand-section">
                    <div className="section-header">
                        <span className="section-icon">🃏</span>
                        <h2>ТВОИ КАРТЫ</h2>
                    </div>
                    <PlayerHand player={me} isMe={true} />
                </div>
            )}

            {/* Other players */}
            <div className="other-players-section">
                <div className="section-header">
                    <span className="section-icon">👥</span>
                    <h2>ДРУГИЕ ВЫЖИВШИЕ</h2>
                </div>
                <div className="other-players-grid">
                    {players
                        .filter((p) => !me || p.id !== me.id)
                        .map((player) => (
                            <OtherPlayer key={player.id} player={player} />
                        ))}
                </div>
            </div>

            {/* Host controls */}
            {isHost && (
                <div className="host-controls">
                    <button className="btn btn-reset" onClick={onResetGame}>
                        <span className="btn-icon">🔄</span>
                        НОВАЯ ИГРА
                    </button>
                </div>
            )}
        </div>
    );
}
