
import React, {useState} from 'react';
import FishTankSection from './FishTankSection';
import PlantsSection from './PlantsSection';
import WaterSection from './WaterSection';


const StatsSection = ({gameState, loading, handleAddFish, handleFeedFish, handleHarvestPlant, handlePlantSeed}) => {

    const [page, setPage] = useState("");

    if (!gameState) {
        return;
    }

    const { G, ctx } = gameState;
    
    return (
        <div>

            <button
                onClick={() => setPage("water")}    
            >💧 Water</button>
            <button
             onClick={() => setPage("plants")}>
                🌱 Plants</button>
            <button
                onClick={() => setPage("fish")}
            >🐟 Fish</button>
            {page == "fish" && <FishTankSection gameState={gameState} loading={loading} handleAddFish={handleAddFish} handleFeedFish={handleFeedFish} /> } 
            {page == "plants" && <PlantsSection gameState={gameState} loading={loading} handleHarvestPlant={handleHarvestPlant} handlePlantSeed={handlePlantSeed} /> }
            {page == "water" && <WaterSection gameState={gameState} loading={loading} /> }
                
            
            
        </div>
    )
}



export default StatsSection;