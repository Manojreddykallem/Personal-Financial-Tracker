import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DeleteTransaction.css";

export default function DeleteTransaction({ transactionsList = [], onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the transaction by id from props
  const tx = useMemo(
    () => transactionsList.find(t => String(t.id) === String(id)),
    [transactionsList, id]
  );

  const handleDelete = () => {
    if (!tx) return;
    onDelete(tx.id);  // remove from App.js state
    navigate("/");    // go back to dashboard; cards will recompute
  };

  if (!tx) {
    return (
      <div className="transaction-form">
        <h1 className="transaction-header">Delete Transaction</h1>
        <p>Transaction not found.</p>
        <button className="button" onClick={() => navigate("/")}>Back</button>
      </div>
    );
  }

  const formattedDate = tx.date ? String(tx.date).split("T")[0] : "";

  return (
    <div className="transaction-form">
      <h1 className="transaction-header">Delete Transaction</h1>

      <p className="confirm-message">
        Are you sure you want to delete this transaction?
      </p>

      {/* Read-only summary using your label/input styles for familiarity */}
      <label className="input-label">TITLE</label>
      <div className="input readonly">{tx.title}</div>

      <label className="input-label">AMOUNT</label>
      <div className="input readonly">Rs {tx.amount}</div>

      <label className="input-label">DATE</label>
      <div className="input readonly">{formattedDate}</div>

      <label className="input-label">TYPE</label>
      <div className="input readonly">{tx.type}</div>

      <label className="input-label">CATEGORY</label>
<div className="input readonly">{tx.category}</div>

      <div className="delete-actions">
        <button className="button danger" onClick={handleDelete}>Delete</button>
        <button className="button secondary" onClick={() => navigate("/")}>
          Cancel
        </button>
      </div>
    </div>
  );
}
