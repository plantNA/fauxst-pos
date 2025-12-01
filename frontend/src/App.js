import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [menu, setMenu] = useState([]);
  const [order, setOrder] = useState([]); // Stores items added to order
  const [total, setTotal] = useState(0);  // Stores total price

  // Fetch menu from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(response => response.json())
      .then(data => setMenu(data))
      .catch(error => console.error('Error fetching menu:', error));
  }, []);

  // Add item to order
  const addToOrder = (item) => {
    // ✅ Your task: add the item to the `order` array
    setOrder([...order, item]);
    // ✅ Your task: update the total price
    setTotal(total + Number(item.price));
  };

  return (
    <div className="App">
      <h1>Toast POS System</h1>
      <p>Manage orders and menu items here.</p>

      <h2>Menu</h2>
      <ul>
        {menu.map(item => (
          <li key={item.id}>
            {item.name} - ${Number(item.price).toFixed(2)}
            <button onClick={() => addToOrder(item)}>Add to Order</button>
          </li>
        ))}
      </ul>

      <h2>Current Order</h2>
      <ul>
        {order.map((item, index) => (
          <li key={index}>
            {item.name} - ${Number(item.price).toFixed(2)}
            {/* Optional challenge: add a "Remove" button here */}
          </li>
        ))}
      </ul>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}

export default App;
