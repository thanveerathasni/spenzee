import {
  Landmark,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { motion } from "framer-motion";
import type {
  FinancialInsight,
} from "../../types/financial";
import {
  formatCurrency,
} from "./format";

interface AnalyticsCardsProps {
  analytics: FinancialInsight | null;
}

export default function AnalyticsCards({
  analytics,
}: AnalyticsCardsProps) {
  const cards = [
    {
      label: "Total Income",
      value: formatCurrency(
        analytics?.totalIncome ?? 0,
      ),
      icon: TrendingUp,
    },
    {
      label: "Total Expense",
      value: formatCurrency(
        analytics?.totalExpense ?? 0,
      ),
      icon: TrendingDown,
    },
    {
      label: "Savings",
      value: formatCurrency(
        analytics?.savings ?? 0,
      ),
      icon: PiggyBank,
    },
    {
      label: "Avg Monthly Spend",
      value: formatCurrency(
        analytics?.avgMonthlySpend ?? 0,
      ),
      icon: WalletCards,
    },
    {
      label: "Financial Score",
      value: String(
        analytics?.financialHealthScore ??
          0,
      ),
      icon: Landmark,
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.label}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.04,
            }}
            className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
              <Icon size={18} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.28em] text-black/35">
              {card.label}
            </p>
            <p className="mt-2 text-xl font-black tracking-tight text-black">
              {card.value}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
