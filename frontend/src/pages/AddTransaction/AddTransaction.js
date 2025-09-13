import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTransaction.css";

const transactionTypeOptions = [
  { optionId: "INCOME", displayText: "Income" },
  { optionId: "EXPENSES", displayText: "Expenses" },
];

export default function AddTransaction({ onAdd }) {
  const navigate = useNavigate();

  const [titleInput, setTitleInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [optionId, setOptionId] = useState("INCOME");
  const [dateInput, setDateInput] = useState("");
  
  const [categoryInput, setCategoryInput] = useState("");
  const onAddTransaction = (e) => {
    e.preventDefault();
    if (!titleInput || !amountInput || !dateInput || !categoryInput) {
      return;
    }

    const parsedAmount = Number(amountInput);
    if (Number.isNaN(parsedAmount)) return;

    const selected = transactionTypeOptions.find((o) => o.optionId === optionId);
    const type = selected ? selected.displayText : "Income";

    const isoDate = new Date(dateInput + "T00:00:00").toISOString();
    const id = (crypto.randomUUID && crypto.randomUUID()) || String(Date.now());

    onAdd({
      id,
      title: titleInput.trim(),
      amount: parsedAmount,
      type,
      date: isoDate,
      category: categoryInput.trim(),
    });

    navigate("/");
  };

  return (
    <form className="transaction-form" onSubmit={onAddTransaction}>
      <h1 className="transaction-header">Add Transaction</h1>

      <label className="input-label" htmlFor="title">TITLE</label>
      <input
        id="title"
        className="input"
        type="text"
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
        placeholder="TITLE"
      />

      <label className="input-label" htmlFor="amount">AMOUNT</label>
      <input
        id="amount"
        className="input"
        type="text"
        value={amountInput}
        onChange={(e) => setAmountInput(e.target.value)}
        placeholder="AMOUNT"
      />

      <label className="input-label" htmlFor="date">DATE</label>
      <input
        id="date"
        className="input"
        type="date"
        value={dateInput}
        onChange={(e) => setDateInput(e.target.value)}
      />

      <label className="input-label" htmlFor="category">CATEGORY</label>
      <input
        id="category"
        className="input"
        type="text"
        value={categoryInput}
        onChange={(e) => setCategoryInput(e.target.value)}
        placeholder="e.g. Salary, Rent, Groceries"
      />

      <label className="input-label" htmlFor="select">TYPE</label>
      <select
        id="select"
        className="input"
        value={optionId}
        onChange={(e) => setOptionId(e.target.value)}
      >
        {transactionTypeOptions.map((eachOption) => (
          <option key={eachOption.optionId} value={eachOption.optionId}>
            {eachOption.displayText}
          </option>
        ))}
      </select>

      <button type="submit" className="button">Add</button>
    </form>
  );
}




