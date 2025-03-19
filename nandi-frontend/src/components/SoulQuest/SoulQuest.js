import React, { useState, useEffect, useCallback } from 'react';
import './SoulQuest.css';
import { questService } from '../../services/api';
import { soulQuestData } from '../../services/mockData';

const SoulQuest = () => {
  const [quests, setQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true); // Toggle between mock and real API
  
  // Using useCallback to memoize the fetchQuests function
  const fetchQuests = useCallback(async () => {
    setLoading(true);
    
    try {
      let questsData;
      
      if (useMockData) {
        // Using mock data
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        questsData = soulQuestData;
      } else {
        // Using real API
        questsData = await questService.getQuests();
      }
      
      setQuests(questsData);
    } catch (error) {
      console.error('Error fetching quests:', error);
    } finally {
      setLoading(false);
    }
  }, [useMockData]); // Add useMockData as a dependency
  
  useEffect(() => {
    // Fetch available quests when component mounts or useMockData changes
    fetchQuests();
  }, [fetchQuests]); // fetchQuests is now a dependency
  
  const selectQuest = async (questId) => {
    setLoading(true);
    
    try {
      let quest, questProgress;
      
      if (useMockData) {
        // Using mock data
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay
        quest = soulQuestData.find(q => q.id === questId);
        
        // Initialize progress
        questProgress = {
          questId: quest.id,
          completedQuestions: [],
          status: 'IN_PROGRESS'
        };
      } else {
        // Using real API
        quest = await questService.getQuest(questId);
        questProgress = await questService.getProgress(questId);
      }
      
      setSelectedQuest(quest);
      setCurrentQuestion(quest.questions[0]);
      setProgress(questProgress);
    } catch (error) {
      console.error('Error selecting quest:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const submitAnswer = async () => {
    if (!answer.trim() || loading) return;
    
    setLoading(true);
    
    try {
      let updatedProgress;
      
      if (useMockData) {
        // Using mock data
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        // Update progress
        updatedProgress = { 
          ...progress,
          completedQuestions: [...progress.completedQuestions, currentQuestion.id]
        };
      } else {
        // Using real API
        updatedProgress = await questService.submitAnswer(
          selectedQuest.id,
          currentQuestion.id,
          answer
        );
      }
      
      setProgress(updatedProgress);
      setAnswer('');
      
      // Move to next question if available
      const currentIndex = selectedQuest.questions.findIndex(q => q.id === currentQuestion.id);
      if (currentIndex < selectedQuest.questions.length - 1) {
        setCurrentQuestion(selectedQuest.questions[currentIndex + 1]);
      } else {
        // Quest completed
        if (useMockData) {
          updatedProgress.status = 'COMPLETED';
          setProgress(updatedProgress);
        }
        alert('Quest completed! Your spiritual journey continues...');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !quests.length) {
    return <div className="loading">Loading quests...</div>;
  }
  
  return (
    <div className="soul-quest">
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
      
      {!selectedQuest ? (
        <div className="quest-selection">
          <h2>Choose Your Quest</h2>
          <div className="quest-list">
            {quests.map(quest => (
              <div 
                key={quest.id} 
                className="quest-item"
                onClick={() => selectQuest(quest.id)}
              >
                <h3>{quest.title}</h3>
                <p>{quest.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="quest-container">
          <h2>{selectedQuest.title}</h2>
          
          {currentQuestion && (
            <div className="question-container">
              <h3>{currentQuestion.text}</h3>
              {currentQuestion.guidance && (
                <div className="guidance">
                  <p><em>{currentQuestion.guidance}</em></p>
                </div>
              )}
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your reflective answer..."
                disabled={loading}
              />
              <button onClick={submitAnswer} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          )}
          
          <button 
            className="back-button" 
            onClick={() => setSelectedQuest(null)}
            disabled={loading}
          >
            Back to Quests
          </button>
        </div>
      )}
    </div>
  );
};

export default SoulQuest; 