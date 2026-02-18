import React from 'react';

export default function Lobby({ players, isHost, onDealRoles, me }) {
    return (
        <div className="lobby">
            {/* Header */}
            <div className="lobby-header">
                <div className="logo-glow">
                    <h1 className="game-title">
                        <span className="title-icon">☢</span>
                        БУНКЕР
                    </h1>
                </div>
                <p className="game-subtitle">ИГРА НА ВЫЖИВАНИЕ</p>
            </div>

            {/* Players list */}
            <div className="lobby-section">
                <div className="section-header">
                    <span className="section-icon">👥</span>
                    <h2>ВЫЖИВШИЕ В КОМНАТЕ</h2>
                    <span className="player-count">{players.length}</span>
                </div>

                <div className="players-grid">
                    {players.map((player) => {
                        const name = player.getState('name') || 'Неизвестный';
                        const avatar = player.getState('avatar');
                        const isMe = me && player.id === me.id;
                        const isPlayerHost = player.id === players[0]?.id;

                        return (
                            <div
                                key={player.id}
                                className={`player-badge ${isMe ? 'player-badge--me' : ''}`}
                            >
                                <div className="player-badge-avatar">
                                    {avatar ? (
                                        <img src={avatar} alt={name} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    {isPlayerHost && <span className="host-crown">👑</span>}
                                </div>
                                <span className="player-badge-name">
                                    {name}
                                    {isMe && <span className="you-tag"> (ты)</span>}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Game info */}
            <div className="lobby-section">
                <div className="info-box">
                    <div className="info-box-icon">📋</div>
                    <div className="info-box-content">
                        <h3>ПРАВИЛА</h3>
                        <p>
                            Произошла катастрофа. Вы — группа выживших. Каждый получит набор карт с характеристиками.
                            Вскрывайте карты по одной, обсуждайте и голосуйте — кто останется в бункере, а кто нет.
                        </p>
                    </div>
                </div>
            </div>

            {/* Deal button */}
            <div className="lobby-actions">
                {isHost ? (
                    <button
                        className="btn btn-deal"
                        onClick={onDealRoles}
                        disabled={players.length < 2}
                    >
                        <span className="btn-icon">🎴</span>
                        <span className="btn-text">РАЗДАТЬ РОЛИ</span>
                        <span className="btn-glow"></span>
                    </button>
                ) : (
                    <div className="waiting-host">
                        <div className="pulse-dot"></div>
                        <span>Ожидание ведущего...</span>
                    </div>
                )}

                {isHost && players.length < 2 && (
                    <p className="min-players-hint">Минимум 2 игрока для начала</p>
                )}
            </div>
        </div>
    );
}
