import React from 'react';
import 'claymorphism-css/dist/clay.css';
import './ClayCard.css';

/**
 * A claymorphic card component using clay.css
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.description - Card description
 * @param {string} props.color - Background color in hex or rgb format
 * @param {string} props.onClick - Click handler
 */
const ClayCard = ({ title, icon, description, color, onClick }) => {
  return (
    <div 
      className="clay-card clay" 
      style={{
        '--clay-background': color || '#f9eadb',
        '--clay-border-radius': '24px'
      }}
      onClick={onClick}
    >
      <div className="clay-card-header">
        <div className="clay-card-icon">
          {icon}
        </div>
        <h3 className="clay-card-title">{title}</h3>
      </div>
      <p className="clay-card-description">{description}</p>
    </div>
  );
};

export default ClayCard; 