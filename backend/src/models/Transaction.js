import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true }, // positive for Income, positive (but type=Expenses) for expense
    type: { type: String, enum: ["Income", "Expenses"], required: true },
    date: { type: Date, required: true },
    category: { type: String, required:true, trim:true, minlength: 1 }
  },
  { timestamps: true }
);

// Make responses frontend-friendly: include `id`, hide `_id` and `__v`
TransactionSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Transaction = mongoose.model("Transaction", TransactionSchema);
