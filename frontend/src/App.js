import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [taxRate] = useState(0.07);
  const [grandTotal, setGrandTotal] = useState(0);
  const [menu, setMenu] = useState([]);
  const [order, setOrder] = useState([]); // Stores items added to order
  const [total, setTotal] = useState(0);  // Stores total price
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // Cash or card
  const [paymentComplete, setPaymentComplete] = useState(false);

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

  const removeFromOrder = (index) => {
    const itemToRemove = order[index];

  // 1. Create a new array without that item
    const updatedOrder = order.filter((_, i) => i !== index);

  // 2. Update state
    setOrder(updatedOrder);

  // 3. Update total
    setTotal(total - Number(itemToRemove.price));
};

const clearOrder = () => {
  // Order array emptied
  setOrder([]);
  // Total reset to 0
  setTotal(0);

}

const startCheckout = () => {
  setIsCheckingOut(true);
};


function calculateTotals(orderItems) {
  // your job: compute subtotal
  const subtotal = orderItems.reduce((accumulator,item) => {
    return accumulator + Number(item.price);
  }, 0);
  // your job: compute taxAmount using taxRate
  const taxAmount = subtotal * taxRate;
  // your job: compute grandTotal
  const grandTotal = subtotal + taxAmount;
  // return an object with all 3 values
  return { subtotal, taxAmount, grandTotal };
}

useEffect(() => {
  // 1. Call your calculateTotals function with the current order
  const totals = calculateTotals(order);

  // 2. Update the three state variables
  // setSubtotal(...)
  setSubtotal(totals.subtotal);
  // setTaxAmount(...)
  setTaxAmount(totals.taxAmount);
  // setGrandTotal(...)
  setGrandTotal(totals.grandTotal);
}, [order]); // <- dependency array ensures this runs whenever order changes

function completePayment() {
  // if no paymentMethod selected, do nothing
  if (paymentMethod === null) {
    return;
  }
  // set paymentComplete to true
  setPaymentComplete(true);

  // clear the order
  setOrder([]);
  setSubtotal(0);
  setTaxAmount(0);
  setGrandTotal(0);
  setTotal(0);

  // reset paymentMethod to null
  setPaymentComplete(null);

  // close checkout panel
  setIsCheckingOut(false);
}


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
            <button onClick={() => removeFromOrder(index)}>Remove</button>
          </li>
        ))}
      </ul>

      <button onClick={clearOrder}>Clear Order</button>
      <p>Total: ${total.toFixed(2)}</p>

      <div className="summary-panel">
        <h2>Order Summary</h2>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax: ${taxAmount.toFixed(2)}</p>
        <p>Total: ${grandTotal.toFixed(2)}</p>
      </div>

      <button onClick={startCheckout}>Checkout</button>
      {isCheckingOut && (
        <div className="payment-panel">
        <h2>Payment</h2>
        <p>Total: ${grandTotal.toFixed(2)}</p>

        <button onClick={() => setPaymentMethod("cash")}>Cash</button>
        <button onClick={() => setPaymentMethod("card")}>Card</button>
        <button onClick={() => setIsCheckingOut(false)}>Cancel</button>

        <button onClick={completePayment}>Complete Payment</button>
  </div>
)}

    </div>
    
  );
}

export default App;
