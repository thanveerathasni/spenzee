import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import {
  Download,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { bankStatementApi } from "../../api/bankStatement.api";
import type {
  FinancialCategory,
  TransactionFilters,
  TransactionList,
} from "../../types/financial";
import {
  formatCurrency,
  formatDate,
} from "./format";

const categories: FinancialCategory[] = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "EMI",
  "Rent",
  "Fuel",
  "Investment",
  "Salary",
  "ATM",
  "Transfer",
  "Insurance",
  "Education",
  "Subscription",
  "Others",
];

export default function TransactionExplorer() {
  const [filters, setFilters] =
    useState<TransactionFilters>({
      page: 1,
      limit: 20,
    });
  const [data, setData] =
    useState<TransactionList | null>(null);
  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setData(
          await bankStatementApi.getTransactions(
            filters,
          ),
        );
      } catch {
        toast.error(
          "Failed to load transactions",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [filters]);

  const updateSearch = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setFilters((current) => ({
      ...current,
      page: 1,
      search: event.target.value,
    }));
  };

  const updateCategory = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    setFilters((current) => ({
      ...current,
      page: 1,
      category:
        event.target.value === ""
          ? undefined
          : (event.target.value as FinancialCategory),
    }));
  };

  const updateFilter = (
    key: keyof TransactionFilters,
    value: string,
  ) => {
    setFilters((current) => ({
      ...current,
      page: 1,
      [key]:
        value === ""
          ? undefined
          : key === "minAmount" ||
              key === "maxAmount"
            ? Number(value)
            : value,
    }));
  };

  const exportCsv = () => {
    const rows =
      data?.transactions ?? [];

    const csv = [
      [
        "Date",
        "Merchant",
        "Description",
        "Category",
        "Type",
        "Amount",
        "Balance",
      ].join(","),
      ...rows.map((row) =>
        [
          formatDate(
            row.transactionDate,
          ),
          row.merchant,
          row.description,
          row.category,
          row.type,
          String(row.amount),
          String(row.balance ?? ""),
        ]
          .map((value) =>
            `"${value.replace(/"/g, "'")}"`,
          )
          .join(","),
      ),
    ].join("\n");

    const blob =
      new Blob([csv], {
        type: "text/csv;charset=utf-8",
      });
    const url =
      URL.createObjectURL(blob);
    const link =
      document.createElement("a");
    link.href = url;
    link.download =
      "spenzee-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-black tracking-tight text-black">
          Transaction Explorer
        </h2>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2">
          <Search
            size={16}
            className="text-black/35"
          />
          <input
            value={filters.search ?? ""}
            onChange={updateSearch}
            placeholder="Search merchant or description"
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
        <select
          value={filters.category ?? ""}
          onChange={updateCategory}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filters.startDate ?? ""}
          onChange={(event) =>
            updateFilter(
              "startDate",
              event.target.value,
            )
          }
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
        />
        <input
          type="date"
          value={filters.endDate ?? ""}
          onChange={(event) =>
            updateFilter(
              "endDate",
              event.target.value,
            )
          }
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            value={filters.minAmount ?? ""}
            onChange={(event) =>
              updateFilter(
                "minAmount",
                event.target.value,
              )
            }
            placeholder="Min"
            className="min-w-0 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
          />
          <input
            type="number"
            min={0}
            value={filters.maxAmount ?? ""}
            onChange={(event) =>
              updateFilter(
                "maxAmount",
                event.target.value,
              )
            }
            placeholder="Max"
            className="min-w-0 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[860px] text-left">
          <thead>
            <tr className="border-b border-black/[0.06] text-[9px] font-black uppercase tracking-[0.24em] text-black/30">
              <th className="py-3">Date</th>
              <th>Merchant</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.05]">
            {(data?.transactions ?? []).map(
              (transaction) => (
                <tr
                  key={transaction.id}
                  className="text-xs text-black/65"
                >
                  <td className="py-4">
                    {formatDate(
                      transaction.transactionDate,
                    )}
                  </td>
                  <td className="font-bold text-black">
                    {transaction.merchant}
                  </td>
                  <td className="max-w-[260px] truncate">
                    {transaction.description}
                  </td>
                  <td>{transaction.category}</td>
                  <td className="capitalize">
                    {transaction.type}
                  </td>
                  <td className="font-bold text-black">
                    {formatCurrency(
                      transaction.amount,
                    )}
                  </td>
                  <td>
                    {transaction.balance
                      ? formatCurrency(
                        transaction.balance,
                      )
                      : "—"}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      {loading && (
        <p className="mt-4 text-xs font-bold text-black/35">
          Loading transactions...
        </p>
      )}
    </section>
  );
}
