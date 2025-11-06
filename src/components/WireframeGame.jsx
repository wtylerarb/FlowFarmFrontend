// src/components/Game.jsx
import React, { useState, useEffect } from 'react';
import gameAPI from '../services/gameAPI';
import Renderer from './Renderer';
import StatsSection from './StatsSection';
import './WireframeGame.css';

function Game() {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchID, setMatchID] = useState(null);

  // Initialize game on component mount
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    setLoading(true);
    setError(null);
    try {
      const id = await gameAPI.createMatch();
      setMatchID(id);
      await refreshGameState();
    } catch (err) {
      setError('Failed to create game: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshGameState = async () => {
    try {
      const state = await gameAPI.getGameState();
      setGameState(state);
    } catch (err) {
      setError('Failed to fetch game state: ' + err.message);
    }
  };

  const handleAddFish = async (fishType, count) => {
    setLoading(true);
    try {
      await gameAPI.addFish(fishType, count);
      await refreshGameState();
    } catch (err) {
      setError('Failed to add fish: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlantSeed = async (plantType) => {
    setLoading(true);
    try {
      // For now, using a simple bed location system
      const bedLocation = `bed_${Date.now()}`;
      await gameAPI.plantSeed(plantType, bedLocation);
      await refreshGameState();
    } catch (err) {
      setError('Failed to plant seed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedFish = async () => {
    setLoading(true);
    try {
      await gameAPI.feedFish(0, 10); // Feed 10 units to tank 0
      await refreshGameState();
    } catch (err) {
      setError('Failed to feed fish: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressTurn = async () => {
    setLoading(true);
    try {
      await gameAPI.progressTurn();
      await refreshGameState();
    } catch (err) {
      setError('Failed to progress turn: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHarvestPlant = async (plantId) => {
    setLoading(true);
    try {
      await gameAPI.harvestPlant(plantId);
      await refreshGameState();
    } catch (err) {
      setError('Failed to harvest plant: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatsButton = async () => {

  }

  if (!gameState) {
    return <div className="loading">Initializing game...</div>;
  }

  const { G, ctx } = gameState;

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>🐟 Grow-n-Flow Aquaponics 🌱</h1>
        <div className="game-stats">
          <span>Match ID: {matchID}</span>
          <span>Turn: {ctx.turn}</span>
          <span>💰 Money: ${G.money}</span>
          <span>⏰ Game Time: Day {Math.floor(G.gameTime / 24)}</span>
        </div>
      </header>

      {error && (
        <div className="error-message">
          ❌ {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="game-grid">

        <section className="renderer-section">
          <Renderer />
        </section>
        
        {/* Control Panel */}
        <section className="control-section">
          <h2>🎮 Game Controls</h2>
          <button
            onClick={handleStatsButton}
          >
            📊 Stats 
          </button>
          <button>
            🎒 Inventory
          </button>
          <button>
            📋 Community
          </button>
          <button>
            🛒 Shop
          </button>
          <button>
            🏪 Market
          </button>
          <br />
          <button 
            onClick={handleProgressTurn} 
            disabled={loading}
            className="btn-turn"
          >
            Progress Turn ⏭️
          </button>
          <button 
            onClick={refreshGameState} 
            disabled={loading}
            className="btn-secondary"
          >
            Refresh State 🔄
          </button>
          <button 
            onClick={startNewGame} 
            disabled={loading}
            className="btn-danger"
          >
            New Game 🆕
          </button>
        </section>

        <section className="popup-section">
          <StatsSection gameState={gameState} loading={loading} handleAddFish={handleAddFish} handleFeedFish={handleFeedFish}/>
        </section>

      </div>
      

      {loading && <div className="loading-overlay">Processing...</div>}
    </div>
  );
}

export default Game;