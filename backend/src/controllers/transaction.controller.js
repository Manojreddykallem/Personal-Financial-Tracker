import mongoose from "mongoose";
import { Transaction } from "../models/Transaction.js";

const isValidObjectId = (id) => mongoose.isValidObjectId(id);
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};
const toDate = (v) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

// GET /api/transactions
export async function listTransactions(req, res, next) {
  try {
    const items = await Transaction.find().sort({ date: -1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
}


// GET /api/transactions/:id
export async function getTransaction(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const item = await Transaction.findById(id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

// POST /api/transactions
export async function createTransaction(req, res, next) {
  try {
    let { title, amount, type, date, category } = req.body;

    // presence checks (category required)
    if (!title || amount === undefined || !type || !date || !category) {
      return res.status(400).json({
        message: "title, amount, type, date, category are required",
      });
    }

    title = String(title).trim();
    category = String(category).trim();
    if (!category) {
      return res.status(400).json({ message: "category cannot be empty" });
    }

    const numAmount = toNumber(amount);
    if (Number.isNaN(numAmount)) {
      return res.status(400).json({ message: "amount must be a valid number" });
    }

    const d = toDate(date);
    if (!d) {
      return res.status(400).json({ message: "date must be a valid date" });
    }

    const tx = await Transaction.create({
      title,
      amount: numAmount,
      type,
      date: d,
      category,
    });

    res.status(201).json(tx);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
}

// PUT /api/transactions/:id
export async function updateTransaction(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const { title, amount, type, date, category } = req.body;
    const patch = {};

    if (title !== undefined) patch.title = String(title).trim();

    if (amount !== undefined) {
      const numAmount = toNumber(amount);
      if (Number.isNaN(numAmount)) {
        return res.status(400).json({ message: "amount must be a valid number" });
      }
      patch.amount = numAmount;
    }

    if (type !== undefined) patch.type = type;

    if (date !== undefined) {
      const d = toDate(date);
      if (!d) return res.status(400).json({ message: "date must be a valid date" });
      patch.date = d;
    }

    if (category !== undefined) {
      const cat = String(category).trim();
      if (!cat) return res.status(400).json({ message: "category cannot be empty" });
      patch.category = cat;
    }

    const updated = await Transaction.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
}

// DELETE /api/transactions/:id
export async function deleteTransaction(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const deleted = await Transaction.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted", id });
  } catch (err) {
    next(err);
  }
}
