import React, { useState } from 'react';

export default function POS({ menu, order, setOrder, subtotal, taxAmount, grandTotal }) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");

  // Add an item to the order
  const addToOrder = (item) => {
    const existingItem = order.find(o => o.id === item.id);
    if (existingItem) {
      setOrder(order.map(o => o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o));
    } else {
      setOrder([...order, { ...item, quantity: 1 }]);
    }
  };

  // Remove or decrement item
  const removeFromOrder = (index) => {
    const updatedOrder = [...order];
    if (updatedOrder[index].quantity > 1) {
      updatedOrder[index].quantity -= 1;
    } else {
      updatedOrder.splice(index, 1);
    }
    setOrder(updatedOrder);
  };

  // Clear the order
  const clearOrder = () => {
    setOrder([]);
    setPaymentMessage("");
    setPaymentMethod(null);
    setIsCheckingOut(false);
  };

  // Complete payment function
  const completePayment = () => {
    console.log("Payment method selected:", paymentMethod);
    if (!paymentMethod) {
      alert("Please select a payment method before completing payment.");
      return;
    }

    const orderData = {
      items: order,
      subtotal,
      taxAmount,
      grandTotal,
      paymentMethod,
      timestamp: new Date().toISOString()
    };

    fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    })
      .then(res => {
        console.log("Fetch response status:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("Order saved:", data);
        clearOrder();
        setPaymentMessage("Payment Successful!");
      })
      .catch(err => {
        console.error("Error saving order:", err);
        alert("There was an error processing your payment.");
      });
  };

  return (
<div className="pos-container">
    <div className="pos-menu-panel">
      <h2>Menu</h2>
      <ul>
        {menu.map(item => (
          <li key={item.id}>
            {item.name} - ${Number(item.price).toFixed(2)}
            <button onClick={() => addToOrder(item)} disabled={isCheckingOut}>Add</button>
          </li>
        ))}
      </ul>
</div>
    <div className="pos-order-panel">
      <h2>Current Order</h2>
      <ul>
        {order.map((item, i) => (
          <li key={i}>
            {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
            <button onClick={() => removeFromOrder(i)} disabled={isCheckingOut}>Remove</button>
          </li>
        ))}
      </ul>

      <div className="summary">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax: ${taxAmount.toFixed(2)}</p>
        <p>Total: ${grandTotal.toFixed(2)}</p>
      </div>

      <button onClick={() => setIsCheckingOut(true)} disabled={order.length === 0 || isCheckingOut}>Checkout</button>

      {isCheckingOut && (
        <div className="payment-panel">
          <h3>Select Payment Method</h3>
          <button
            onClick={() => setPaymentMethod("cash")}
            style={{ fontWeight: paymentMethod === "cash" ? "bold" : "normal" }}
          >
            Cash
          </button>
          <button
            onClick={() => setPaymentMethod("card")}
            style={{ fontWeight: paymentMethod === "card" ? "bold" : "normal" }}
          >
            Card
          </button>
          <div style={{ marginTop: "10px" }}>
            <button onClick={completePayment} disabled={!paymentMethod}>Complete Payment</button>
            <button onClick={clearOrder} style={{ marginLeft: "10px" }}>Cancel</button>
          </div>
        </div>
      )}

      {paymentMessage && <p className="success">{paymentMessage}</p>}
    </div>
    </div>
  );
}
