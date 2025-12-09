import React, { useEffect, useState } from 'react';
import './App.css';
import POS from './pages/POS';
import OrderHistory from './pages/OrderHistory';

function App() {
  const [menu, setMenu] = useState([]);
  const [order, setOrder] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState("POS"); // "POS" or "OrderHistory"

  const taxRate = 0.07;

  // Fetch menu once at App load
  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(res => res.json())
      .then(data => setMenu(data))
      .catch(err => console.error('Error fetching menu:', err));
  }, []);

  // Calculate totals whenever order changes
  useEffect(() => {
    const subtotalCalc = order.reduce((acc, item) => acc + Number(item.price) * (item.quantity || 1), 0);
    const taxCalc = subtotalCalc * taxRate;
    setSubtotal(subtotalCalc);
    setTaxAmount(taxCalc);
    setGrandTotal(subtotalCalc + taxCalc);
  }, [order]);

  return (
    <div className="App">
      <header>
        <h1>Toast POS System</h1>
        <nav>
          <button onClick={() => setCurrentPage("POS")}>POS</button>
          <button onClick={() => setCurrentPage("OrderHistory")}>Order History</button>
        </nav>
      </header>

      {currentPage === "POS" && (
        <POS
          menu={menu}
          order={order}
          setOrder={setOrder}
          subtotal={subtotal}
          taxAmount={taxAmount}
          grandTotal={grandTotal}
        />
      )}

      {currentPage === "OrderHistory" && <OrderHistory />}
    </div>
  );
}

export default App;
