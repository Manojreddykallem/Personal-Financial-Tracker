import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditTransaction.css";

const transactionTypeOptions = [
  { optionId: "INCOME", displayText: "Income" },
  { optionId: "EXPENSES", displayText: "Expenses" },
];

export default function EditTransaction({ transactionsList = [], onEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const tx = useMemo(
    () => transactionsList.find((t) => String(t.id ?? t._id) === String(id)),
    [transactionsList, id]
  );

  const [titleInput, setTitleInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [optionId, setOptionId] = useState("INCOME");
  const [dateInput, setDateInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!tx) return;
    setTitleInput(tx.title || "");
    setAmountInput(typeof tx.amount === "number" ? String(tx.amount) : (tx.amount || ""));
    const selected = transactionTypeOptions.find((o) => o.displayText === tx.type)?.optionId || "INCOME";
    setOptionId(selected);
    setDateInput((tx.date || "").split("T")[0] || "");
    setCategoryInput(tx.category || "");
  }, [tx]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!tx) return;
    if (!titleInput || !amountInput || !dateInput || !categoryInput) {
        setErrorMessage("ALL FIELDS ARE REQUIRED")
      return;
    }
    setErrorMessage("");

    const parsedAmount = Number(amountInput);
    if (Number.isNaN(parsedAmount)) return;

    const type = transactionTypeOptions.find((o) => o.optionId === optionId)?.displayText || "Income";
    const isoDate = new Date(dateInput + "T00:00:00").toISOString();

    onEdit(tx.id ?? tx._id, {
      title: titleInput.trim(),
      amount: parsedAmount,
      type,
      date: isoDate,
      category: categoryInput.trim(),
    });

    navigate("/");
  };

  if (!tx) {
    return (
      <div className="transaction-form">
        <h1 className="transaction-header">Edit Transaction</h1>
        <p>Transaction not found.</p>
        <button className="button" onClick={() => navigate("/")}>Back</button>
      </div>
    );
  }

  return (
    <form className="transaction-form" onSubmit={onSubmit}>
      <h1 className="transaction-header">Edit Transaction</h1>

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

      {errorMessage && <p className="error-text">{errorMessage}</p>}

      <div className="edit-actions">
        <button type="submit" className="button">Save</button>
        <button type="button" className="button secondary" onClick={() => navigate("/")}>
          Cancel
        </button>
      </div>
    </form>
  );
}




