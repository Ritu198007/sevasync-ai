import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: "Medical", icon: "🏥", path: "medical" },
  { name: "Food", icon: "🍛", path: "food" },
  { name: "Shelter", icon: "🏠", path: "shelter" },
  { name: "Women Support", icon: "👩", path: "women" }
];

const NGOHelp = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Select Help Category</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
        maxWidth: '400px',
        margin: '20px auto'
      }}>
        {categories.map((cat, i) => (
          <div
            key={i}
            onClick={() => navigate(`/help/${cat.path}`)}
            style={{
              background: '#1e3a5f',
              color: 'white',
              padding: '25px',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '28px' }}>{cat.icon}</div>
            <h3>{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NGOHelp;