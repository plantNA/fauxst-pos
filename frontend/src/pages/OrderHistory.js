import React, { useEffect, useState } from 'react';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => {
        // Backend already parses items, so no need to parse again.
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Order history fetch error:", err);
        setError("Failed to fetch orders.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="order-history" style={{ padding: "20px" }}>
      <h2>Order History</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {orders.map(order => (
            <li
              key={order.id}
              className="order-card"
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                background: "#fafafa"
              }}
            >
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Timestamp:</strong> {new Date(order.timestamp).toLocaleString()}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Subtotal:</strong> ${Number(order.subtotal).toFixed(2)}</p>
              <p><strong>Tax:</strong> ${Number(order.taxAmount).toFixed(2)}</p>
              <p><strong>Total:</strong> ${Number(order.grandTotal).toFixed(2)}</p>

              <p><strong>Items:</strong></p>
              <ul style={{ paddingLeft: "20px" }}>
                {order.items?.map((item, i) => (
                  <li key={i}>
                    {item.name} x {item.quantity || 1} — $
                    {(item.price * (item.quantity || 1)).toFixed(2)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
