import React, { useState } from "react";
import "./Payment.css";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState("Credit/Debit Card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [paymentHistory, setPaymentHistory] = useState([
    { id: 1, date: "2025-03-01", amount: "₹10,000", status: "Paid" },
    { id: 2, date: "2025-02-01", amount: "₹10,000", status: "Failed" },
    { id: 3, date: "2025-01-01", amount: "₹10,000", status: "Paid" },
  ]);

  const handlePayment = () => {
    alert(`Payment of ₹10,000 via ${selectedMethod} is being processed.`);
    setPaymentHistory([
      ...paymentHistory,
      { id: paymentHistory.length + 1, date: new Date().toISOString().split("T")[0], amount: "₹10,000", status: "Paid" },
    ]);
  };

  return (
    <div className="payment-container">
      <h2>Fee Payment</h2>

      {/* Fee Summary Section */}
      <div className="fee-summary">
        <h3>Invoice Summary</h3>
        <p><strong>Course Name:</strong> Advanced Cybersecurity</p>
        <p><strong>Total Amount:</strong> ₹10,000</p>
        <p><strong>Due Date:</strong> 2025-03-25</p>
      </div>

      {/* Payment Method Selection */}
      <div className="payment-methods">
        <h3>Select Payment Method</h3>
        <div className="method-options">
          <button className={selectedMethod === "Credit/Debit Card" ? "active" : ""} onClick={() => setSelectedMethod("Credit/Debit Card")}>
            <CreditCard size={20} /> Credit/Debit Card
          </button>
          <button className={selectedMethod === "UPI" ? "active" : ""} onClick={() => setSelectedMethod("UPI")}>
            💳 UPI
          </button>
          <button className={selectedMethod === "Net Banking" ? "active" : ""} onClick={() => setSelectedMethod("Net Banking")}>
            size={20} Net Banking
          </button>
          <button className={selectedMethod === "PayPal" ? "active" : ""} onClick={() => setSelectedMethod("PayPal")}>
            🅿 PayPal
          </button>
        </div>
      </div>

      {/* Payment Details Form */}
      {selectedMethod === "Credit/Debit Card" && (
        <div className="card-details">
          <h3>Enter Card Details</h3>
          <input
            type="text"
            placeholder="Card Number"
            value={cardDetails.cardNumber}
            onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
          />
          <div className="card-inputs">
            <input
              type="text"
              placeholder="Expiry (MM/YY)"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
            />
            <input
              type="password"
              placeholder="CVV"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Pay Button */}
      <button className="pay-btn" onClick={handlePayment}>Proceed to Pay ₹10,000</button>

      {/* Payment History */}
      <div className="payment-history">
        <h3>Payment History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.date}</td>
                <td>{payment.amount}</td>
                <td className={payment.status === "Paid" ? "paid" : "failed"}>
                  {payment.status === "Paid" ? <CheckCircle size={16} color="green" /> : <XCircle size={16} color="red" />}
                  {payment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;
