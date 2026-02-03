// Severity levels used across dashboard
export const SEVERITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
};

// KPI stat card data
export interface StatItem {
  label: string;
  value: string;
  trend: number;
  trendDirection: "up" | "down";
  description: string;
}

// Needs-attention list item
export interface AttentionItem {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  timestamp: string;
}

// Activity feed item
export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  amount?: string;
  timestamp: string;
  status: "success" | "pending" | "failed";
}
export type Severity = typeof SEVERITY[keyof typeof SEVERITY];