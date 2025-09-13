// src/App.js
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MoneyManager from "./components/MoneyManager";  // your class component with the 3 methods
import AddTransaction from "./pages/AddTransaction/AddTransaction";    // new page below
import EditTransaction from "./pages/EditTransaction/EditTransaction";
import DeleteTransaction from "./pages/DeleteTransaction/DeleteTransaction";
import { TransactionsAPI} from "./api";

export default function App() {
  // Keep transactions here so the Add page can push into it
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await TransactionsAPI.list();
        setTransactions(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const addTransaction = async (tx) => {
    const created = await TransactionsAPI.create(tx);
    setTransactions(prev => [created, ...prev]);
  };

  const editTransaction = async (id, patch) => {
    const updated = await TransactionsAPI.update(id, patch);
    setTransactions(prev => prev.map(t => (t.id === id ? updated : t)));
  };

  const deleteTransaction = async (id) => {
    await TransactionsAPI.remove(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MoneyManager
              transactionsList={transactions}     // MoneyManager computes totals itself via methods
              onEdit={editTransaction}            // optional: for later edit wiring
              onDelete={deleteTransaction}        // optional: for later delete wiring
            />
          }
        />
        <Route
          path="/add"
          element={<AddTransaction onAdd={addTransaction} />}
        />
        <Route
          path="/:id/edit"
          element={<EditTransaction transactionsList={transactions} onEdit={editTransaction} />}
        />
        <Route
        path="/:id/delete"
        element={<DeleteTransaction transactionsList={transactions} onDelete={deleteTransaction} />}
/>
      </Routes>
    </BrowserRouter>
  );
}

