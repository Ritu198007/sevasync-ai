import React from 'react';
import { useParams } from 'react-router-dom';

const NGOList = () => {
  const { category } = useParams();

  const ngosData = {
    medical: [
      {
        name: "Red Cross Society",
        phone: "9876543210",
        distance: "1.2 km",
        location: "Bhubaneswar",
        rating: 4.5
      }
    ],

    fire: [
      {
        name: "City Fire Department",
        phone: "101",
        distance: "2 km",
        location: "Fire Station Road",
        rating: 4.3
      }
    ],

    disaster: [
      {
        name: "Disaster Relief NGO",
        phone: "9123456780",
        distance: "3 km",
        location: "Relief Camp Zone",
        rating: 4.6
      }
    ],

    accident: [
      {
        name: "Road Safety NGO",
        phone: "9988776655",
        distance: "1.5 km",
        location: "NH Highway",
        rating: 4.2
      }
    ],

    // 🟢 FOOD NGOs (NEW - IMPROVED)
    food: [
      {
        name: "Akshaya Patra Foundation",
        phone: "1800-425-8622",
        distance: "2.1 km",
        location: "Patia, Bhubaneswar",
        rating: 4.8
      },
      {
        name: "Robin Hood Army",
        phone: "9000001111",
        distance: "1.8 km",
        location: "KIIT Area",
        rating: 4.7
      },
      {
        name: "Feeding India NGO",
        phone: "8888888888",
        distance: "3.4 km",
        location: "Saheed Nagar",
        rating: 4.6
      }
    ],

    // 🟣 WOMEN NGOs (NEW - IMPROVED)
    women: [
      {
        name: "Women Helpline NGO",
        phone: "1091",
        distance: "1 km",
        location: "City Center",
        rating: 4.9
      },
      {
        name: "Sakhi Support Center",
        phone: "9876500000",
        distance: "2.3 km",
        location: "Khandagiri",
        rating: 4.7
      },
      {
        name: "Mahila Suraksha NGO",
        phone: "9090909090",
        distance: "2.8 km",
        location: "Old Town",
        rating: 4.6
      }
    ]
  };

  const ngos = ngosData[category] || [];

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ textTransform: 'capitalize' }}>
        {category} Support NGOs
      </h2>

      {ngos.length === 0 ? (
        <p>No NGOs available for this category.</p>
      ) : (
        ngos.map((ngo, index) => (
          <div key={index} style={{
            background: '#0f172a',
            color: 'white',
            padding: '20px',
            marginTop: '15px',
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            <h3>{ngo.name}</h3>

            <p>📍 {ngo.location}</p>
            <p>📏 Distance: {ngo.distance}</p>
            <p>📞 {ngo.phone}</p>
            <p>⭐ {ngo.rating} / 5</p>

            <button
              onClick={() => window.open(`tel:${ngo.phone}`)}
              style={{
                marginTop: '10px',
                padding: '10px 15px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Call Now
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default NGOList;