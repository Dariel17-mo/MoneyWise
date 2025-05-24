
import React, { useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { FinancialSummary } from "@/components/dashboard/FinancialSummary";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { ExpenseBreakdown } from "@/components/dashboard/ExpenseBreakdown";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { FinancialInsights } from "@/components/dashboard/FinancialInsights";
import { updateAllBudgetsSpent } from "@/services/budgetService";

const Index = () => {
  
  useEffect(() => {
    updateAllBudgetsSpent();
  }, []);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <WelcomeBanner />
        
        <FinancialSummary />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncomeExpenseChart />
          <ExpenseBreakdown />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentTransactions />
          </div>
          <div className="space-y-6">
            <BudgetProgress />
            <FinancialInsights />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
