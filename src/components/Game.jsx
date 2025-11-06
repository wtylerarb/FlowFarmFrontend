// src/components/Game.jsx
import React, { useState, useEffect } from 'react';
import gameAPI from '../services/gameAPI';
import Renderer from './Renderer';
import './Game.css';

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
        {/* Fish Tank Section */}
        <section className="fish-section">
          <h2>🐟 Fish Tank</h2>
          <div className="tank-info">
            {G.fish && G.fish.length > 0 ? (
              <div className="fish-list">
                {G.fish.map((fishGroup, index) => (
                  <div key={index} className="fish-item">
                    <span className="fish-type">{fishGroup.type}</span>
                    <span className="fish-count">x{fishGroup.count}</span>
                    <span className="fish-health">❤️ {fishGroup.health}/10</span>
                    <span className="fish-age">Age: {fishGroup.age} days</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No fish yet. Add some to get started!</p>
            )}
          </div>
          
          <div className="action-buttons">
            <button 
              onClick={() => handleAddFish('tilapia', 5)} 
              disabled={loading}
              className="btn-primary"
            >
              Add 5 Tilapia 🐟
            </button>
            <button 
              onClick={() => handleAddFish('goldfish', 3)} 
              disabled={loading}
              className="btn-primary"
            >
              Add 3 Goldfish 🐠
            </button>
            <button 
              onClick={handleFeedFish} 
              disabled={loading || !G.fish || G.fish.length === 0}
              className="btn-secondary"
            >
              Feed Fish 🍞
            </button>
          </div>
        </section>

        {/* Plants Section */}
        <section className="plants-section">
          <h2>🌱 Grow Beds</h2>
          <div className="plants-info">
            {G.plants && G.plants.length > 0 ? (
              <div className="plants-list">
                {G.plants.map((plant) => (
                  <div key={plant.id} className="plant-item">
                    <span className="plant-type">{plant.cropType}</span>
                    <span className="plant-growth">📊 {plant.growthStage}</span>
                    <span className="plant-health">❤️ {plant.health}/10</span>
                    {plant.growthStage === 'mature' && (
                      <button 
                        onClick={() => handleHarvestPlant(plant.id)}
                        className="btn-harvest"
                        disabled={loading}
                      >
                        Harvest 🌾
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No plants yet. Plant some seeds!</p>
            )}
          </div>
          
          <div className="action-buttons">
            <button 
              onClick={() => handlePlantSeed('Lettuce')} 
              disabled={loading}
              className="btn-primary"
            >
              Plant Lettuce 🥬
            </button>
            <button 
              onClick={() => handlePlantSeed('Tomato')} 
              disabled={loading}
              className="btn-primary"
            >
              Plant Tomato 🍅
            </button>
            <button 
              onClick={() => handlePlantSeed('Basil')} 
              disabled={loading}
              className="btn-primary"
            >
              Plant Basil 🌿
            </button>
          </div>
        </section>

        {/* Water Quality Section */}
        <section className="water-section">
          <h2>💧 Water Quality</h2>
          {G.aquaponicsSystem && G.aquaponicsSystem.tank && (
            <div className="water-stats">
              <div className="stat-item">
                <label>Ammonia:</label>
                <span className={G.aquaponicsSystem.tank.water.ammonia > 1 ? 'danger' : ''}>
                  {G.aquaponicsSystem.tank.water.ammonia.toFixed(2)} ppm
                </span>
              </div>
              <div className="stat-item">
                <label>Nitrite:</label>
                <span className={G.aquaponicsSystem.tank.water.nitrite > 0.5 ? 'warning' : ''}>
                  {G.aquaponicsSystem.tank.water.nitrite.toFixed(2)} ppm
                </span>
              </div>
              <div className="stat-item">
                <label>Nitrate:</label>
                <span className="good">
                  {G.aquaponicsSystem.tank.water.nitrate.toFixed(2)} ppm
                </span>
              </div>
              <div className="stat-item">
                <label>pH:</label>
                <span>{G.aquaponicsSystem.tank.water.pH.toFixed(1)}</span>
              </div>
              <div className="stat-item">
                <label>Temperature:</label>
                <span>{G.aquaponicsSystem.tank.water.temperature}°C</span>
              </div>
              <div className="stat-item">
                <label>Dissolved O₂:</label>
                <span>{G.aquaponicsSystem.tank.water.dissolvedOxygen} mg/L</span>
              </div>
            </div>
          )}
        </section>

        {/* Control Panel */}
        <section className="control-section">
          <h2>🎮 Game Controls</h2>
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

        <section className="renderer-section">
          <Renderer />
        </section>
      </div>
      

      {loading && <div className="loading-overlay">Processing...</div>}
    </div>
  );
}

export default Game;