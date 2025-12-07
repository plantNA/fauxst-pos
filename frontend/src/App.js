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
  const [paymentMessage, setPaymentMessage] = useState("");


  // Fetch menu from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(response => response.json())
      .then(data => setMenu(data))
      .catch(error => console.error('Error fetching menu:', error));
  }, []);

  const addToOrder = (item) => {
    const existingItem = order.find(orderItem => orderItem.id === item.id);

    if (existingItem) {
      const updatedOrder = order.map(orderItem =>
        orderItem.id === item.id
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      );
      setOrder(updatedOrder);
    } else {
      setOrder([...order, { ...item, quantity: 1 }]);
    }
  };

  const removeFromOrder = (index) => {
    const updatedOrder = [...order];
    const itemToRemove = updatedOrder[index];

    if (itemToRemove.quantity > 1) {
      updatedOrder[index] = { ...itemToRemove, quantity: itemToRemove.quantity - 1 };
      setOrder(updatedOrder);
    } else {
      setOrder(updatedOrder.filter((_, i) => i !== index));
    }
  };

  const clearOrder = () => {
    setOrder([]);
    setTotal(0);
    setSubtotal(0);
    setTaxAmount(0);
    setGrandTotal(0);
  };

  const startCheckout = () => {
    setIsCheckingOut(true);
  };

  const calculateTotals = (orderItems) => {
    const subtotal = orderItems.reduce(
      (acc, item) => acc + Number(item.price) * (item.quantity || 1),
      0
    );
    const taxAmount = subtotal * taxRate;
    const grandTotal = subtotal + taxAmount;
    return { subtotal, taxAmount, grandTotal };
  };

  useEffect(() => {
    const totals = calculateTotals(order);
    setSubtotal(totals.subtotal);
    setTaxAmount(totals.taxAmount);
    setGrandTotal(totals.grandTotal);
  }, [order]);

  function completePayment() {
  // 1. If no paymentMethod is selected, stop the function
  if(paymentMethod === null)
    return;

  // 2. Create an "orderData" object
  //    It should include:
  //    - items (the order array)
  //    - subtotal
  //    - taxAmount
  //    - grandTotal
  //    - paymentMethod
  //    - timestamp (use new Date().toISOString())
  const orderData = {
    items: order,
    subtotal:subtotal,
    taxAmount:taxAmount,
    grandTotal:grandTotal,
    paymentMethod: paymentMethod,
    timestamp:new Date().toISOString()
  }

  // 3. Send the orderData to backend using fetch()
  //    URL: http://localhost:5000/api/orders
  //    Method: POST
  //    Headers: JSON
  //    Body: orderData
  fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Server responded with:", data);
      // 5. Reset the current order and totals
      //    - setOrder([])
      //    - setSubtotal(0)
      //    - setTaxAmount(0)
      //    - setGrandTotal(0)
      //    - setTotal(0)
      setOrder([]);
      setSubtotal(0);
      setTaxAmount(0);
      setGrandTotal(0);
      setTotal(0);
      setPaymentMessage("Payment Successful! Thank you for your order.");
    })
    .catch(error => {
      console.error('Error placing order:', error);
      throw error; // Re-throw the error for further handling
    });
   

  // 4. After sending (inside .then()):
  //    - log the response (console.log)


  // 6. Reset paymentMethod to null
  setPaymentMethod(null);

  // 7. Close checkout panel
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
          <button 
            onClick={() => addToOrder(item)} 
            disabled={isCheckingOut}
          >
            Add to Order
          </button>
        </li>
      ))}
    </ul>

    <h2>Current Order</h2>
    <ul>
      {order.map((item, index) => (
        <li key={index}>
          {item.name} - ${Number(item.price).toFixed(2)} x {item.quantity}
          <button 
            onClick={() => removeFromOrder(index)} 
            disabled={isCheckingOut}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>

    <button onClick={clearOrder} disabled={isCheckingOut}>
      Clear Order
    </button>

    <div className="summary-panel">
      <h2>Order Summary</h2>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      <p>Tax: ${taxAmount.toFixed(2)}</p>
      <p>Total: ${grandTotal.toFixed(2)}</p>
    </div>

    <button 
      onClick={startCheckout} 
      disabled={order.length === 0 || isCheckingOut}
    >
      Checkout
    </button>

    {/* Payment success message */}
    {paymentMessage && <p className="payment-success">{paymentMessage}</p>}

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
};

export default App;
