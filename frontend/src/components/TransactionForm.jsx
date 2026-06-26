import { useState, useMemo } from "react";
import { addTransaction } from "../services/firestore";

const incomeCategories = [
  { id: "salary", name: "Salary", icon: "💰" },
  { id: "business", name: "Business Income", icon: "🏢" },
  { id: "freelance", name: "Freelance", icon: "💻" },
  { id: "gift", name: "Gift", icon: "🎁" },
  { id: "interest", name: "Interest", icon: "📈" },
  { id: "other_income", name: "Other Income", icon: "➕" }
];

export default function TransactionForm({ user, categories }) {
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    categoryId: "",
    note: ""
  });

  const availableCategories = useMemo(() => {
    if (form.type === "income") {
      return incomeCategories;
    }

    if (form.type === "savings") {
      return categories.filter(c =>
        c.name.toLowerCase().includes("saving") ||
        c.name.toLowerCase().includes("fund")
      );
    }

    return categories.filter(c =>
      !c.name.toLowerCase().includes("saving") &&
      !c.name.toLowerCase().includes("fund")
    );
  }, [form.type, categories]);

  async function submit(e) {
    e.preventDefault();

    if (!form.amount) return;

    await addTransaction(user.uid, {
      ...form,
      categoryId:
        form.categoryId ||
        availableCategories[0]?.id ||
        ""
    });

    setForm({
      amount: "",
      type: "expense",
      categoryId: "",
      note: ""
    });
  }

  return (
    <form onSubmit={submit} className="stack">
      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={e =>
          setForm({ ...form, amount: e.target.value })
        }
      />

      <select
        value={form.type}
        onChange={e =>
          setForm({
            ...form,
            type: e.target.value,
            categoryId: ""
          })
        }
      >
        <option value="expense">💸 Expense</option>
        <option value="income">💰 Income</option>
        <option value="savings">🏦 Savings</option>
      </select>

      <select
        value={form.categoryId}
        onChange={e =>
          setForm({
            ...form,
            categoryId: e.target.value
          })
        }
      >
        {availableCategories.map(c => (
          <option key={c.id} value={c.id}>
            {c.icon} {c.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Description"
        value={form.note}
        onChange={e =>
          setForm({ ...form, note: e.target.value })
        }
      />

      <button>Add Transaction</button>
    </form>
  );
}