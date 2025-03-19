import React, { useState, useEffect, useCallback } from 'react';
import './WisdomPets.css';
import { petsService } from '../../services/api';
import { wisdomPetsData } from '../../services/mockData';

const WisdomPets = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [interactionOptions, setInteractionOptions] = useState([]);
  const [petStatus, setPetStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [wisdom, setWisdom] = useState('');
  const [showWisdomModal, setShowWisdomModal] = useState(false);
  const [useMockData, setUseMockData] = useState(true); // Toggle between mock and real API
  
  // Using useCallback to memoize the fetchPets function
  const fetchPets = useCallback(async () => {
    setLoading(true);
    
    try {
      let petsData;
      
      if (useMockData) {
        // Using mock data
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        petsData = wisdomPetsData;
      } else {
        // Using real API
        petsData = await petsService.getPets();
      }
      
      setPets(petsData);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  }, [useMockData]); // Add useMockData as a dependency
  
  useEffect(() => {
    // Fetch available pets when component mounts or useMockData changes
    fetchPets();
  }, [fetchPets]); // fetchPets is now a dependency
  
  const selectPet = async (petId) => {
    setLoading(true);
    
    try {
      let pet, interactions;
      
      if (useMockData) {
        // Using mock data
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay
        pet = wisdomPetsData.find(p => p.id === petId);
        interactions = pet.interactions;
      } else {
        // Using real API
        pet = await petsService.getPet(petId);
        interactions = await petsService.getInteractions ? 
          await petsService.getInteractions(petId) : 
          pet.interactions || [];
      }
      
      setSelectedPet(pet);
      setPetStatus(pet.status);
      setInteractionOptions(interactions);
    } catch (error) {
      console.error('Error selecting pet:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const interact = async (interactionId) => {
    setLoading(true);
    
    try {
      let interactionResponse, newStatus;
      
      if (useMockData) {
        // Using mock data
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        const interaction = interactionOptions.find(i => i.id === interactionId);
        
        // Update pet status with small random changes
        newStatus = {
          happiness: Math.min(100, Math.max(0, petStatus.happiness + Math.floor(Math.random() * 15) - 5)),
          energy: Math.min(100, Math.max(0, petStatus.energy + Math.floor(Math.random() * 15) - 7)),
          wisdom: Math.min(100, Math.max(0, petStatus.wisdom + Math.floor(Math.random() * 5)))
        };
        
        interactionResponse = { wisdom: interaction.wisdom };
      } else {
        // Using real API
        interactionResponse = await petsService.interactWithPet(selectedPet.id, interactionId);
        newStatus = interactionResponse.status;
      }
      
      setPetStatus(newStatus);
      setWisdom(interactionResponse.wisdom);
      setShowWisdomModal(true);
    } catch (error) {
      console.error('Error interacting with pet:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !pets.length) {
    return <div className="loading">Loading wisdom companions...</div>;
  }
  
  return (
    <div className="wisdom-pets">
      <div className="api-toggle">
        <label>
          <input 
            type="checkbox" 
            checked={!useMockData} 
            onChange={() => setUseMockData(!useMockData)} 
          />
          Use Real API
        </label>
      </div>
      
      {showWisdomModal && (
        <div className="wisdom-modal">
          <div className="wisdom-content">
            <h3>{selectedPet.name} shares wisdom:</h3>
            <p className="wisdom-text">{wisdom}</p>
            <button onClick={() => setShowWisdomModal(false)}>Close</button>
          </div>
        </div>
      )}
      
      {!selectedPet ? (
        <div className="pet-selection">
          <h2>Choose Your Wisdom Companion</h2>
          <div className="pet-list">
            {pets.map(pet => (
              <div 
                key={pet.id} 
                className="pet-item"
                onClick={() => selectPet(pet.id)}
              >
                <div className="pet-image">
                  <div className="pet-avatar">{pet.name.charAt(0)}</div>
                </div>
                <h3>{pet.name}</h3>
                <p className="pet-type">{pet.type}</p>
                <p className="pet-description">{pet.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="pet-container">
          <div className="pet-details">
            <div className="pet-avatar-large">{selectedPet.name.charAt(0)}</div>
            <h2>{selectedPet.name}</h2>
            <p className="pet-type-badge">{selectedPet.type}</p>
            
            <div className="pet-status">
              <div className="status-bar happiness" style={{ '--bar-width': `${petStatus.happiness}%` }}>
                <label>Happiness:</label>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                  ></div>
                </div>
                <span className="status-value">{petStatus.happiness}%</span>
              </div>
              <div className="status-bar energy" style={{ '--bar-width': `${petStatus.energy}%` }}>
                <label>Energy:</label>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                  ></div>
                </div>
                <span className="status-value">{petStatus.energy}%</span>
              </div>
              <div className="status-bar wisdom" style={{ '--bar-width': `${petStatus.wisdom}%` }}>
                <label>Wisdom:</label>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                  ></div>
                </div>
                <span className="status-value">{petStatus.wisdom}%</span>
              </div>
            </div>
          </div>
          
          <div className="interaction-options">
            <h3>Interact with {selectedPet.name}</h3>
            <div className="options-list">
              {interactionOptions.map(option => (
                <button 
                  key={option.id}
                  className="interaction-button"
                  onClick={() => interact(option.id)}
                  disabled={loading}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            className="back-button" 
            onClick={() => setSelectedPet(null)}
            disabled={loading}
          >
            Back to Companions
          </button>
        </div>
      )}
    </div>
  );
};

export default WisdomPets; 