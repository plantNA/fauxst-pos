import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [menu, setMenu] = useState([]);

  // Fetch data from the backend server
  useEffect(() => {
    fetch('http://localhost:5000/api/menu')  // Your backend URL
      .then(response => response.json())
      .then(data => setMenu(data))
      .catch(error => console.error('Error fetching menu:', error));
  }, []);

  return (
    <div className="App">
      <h1>Toast POS System</h1>
      <p>Manage orders and menu items here.</p>

      <h2>Menu</h2>
      <ul>
        {menu.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
