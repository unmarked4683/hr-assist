import type { LeaveBalance, LeaveProgress } from "@/lib/types/leave";

export function computeLeavePercentage(balance: LeaveBalance): number {
  if (balance.pool === null || balance.pool === 0) return 0;
  return (balance.used / balance.pool) * 100;
}

export function formatLeavePercentage(value: number): string {
  return `${value.toFixed(2).replace(".", ",")}%`;
}

export function formatLeaveBalanceText(
  label: string,
  balance: LeaveBalance,
): string {
  if (balance.pool === null) {
    return `${label}: - / - dni`;
  }
  return `${label}: ${balance.used} / ${balance.pool} dni`;
}

export function buildLeaveProgress(
  label: string,
  balance: LeaveBalance,
): LeaveProgress {
  const percentage = computeLeavePercentage(balance);
  return {
    label,
    displayText: formatLeaveBalanceText(label, balance),
    percentage,
    percentageLabel: formatLeavePercentage(percentage),
  };
}
