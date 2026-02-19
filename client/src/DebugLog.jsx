import React, { useState, useEffect } from 'react';

// Global log array
const logs = [];
let listeners = [];

export function addLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry); // Keep console log
    logs.push(logEntry);

    // Notify listeners
    listeners.forEach(listener => listener([...logs]));
}

export function DebugLog() {
    const [messages, setMessages] = useState(logs);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handler = (newLogs) => setMessages(newLogs);
        listeners.push(handler);
        return () => {
            listeners = listeners.filter(l => l !== handler);
        };
    }, []);

    if (!visible) {
        return (
            <button
                onClick={() => setVisible(true)}
                style={{
                    position: 'fixed',
                    bottom: '10px',
                    left: '10px',
                    zIndex: 9999,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#0f0',
                    border: '1px solid #0f0',
                    padding: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    cursor: 'pointer'
                }}
            >
                🐞 DEBUG
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            width: '400px',
            height: '300px',
            background: 'rgba(0,0,0,0.9)',
            border: '1px solid #0f0',
            color: '#0f0',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'monospace',
            fontSize: '11px',
        }}>
            <div style={{
                padding: '8px',
                borderBottom: '1px solid #0f0',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 'bold'
            }}>
                <span>DEBUG LOG</span>
                <button
                    onClick={() => setVisible(false)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#0f0',
                        cursor: 'pointer'
                    }}
                >
                    ✕
                </button>
            </div>
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ marginBottom: '4px' }}>{msg}</div>
                ))}
            </div>
        </div>
    );
}
