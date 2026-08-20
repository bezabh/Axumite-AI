import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, Calculator, TrendingUp, PieChart, 
  HelpCircle, CheckCircle2, ArrowUpRight, Scale 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const FinancialBudgetingTool: React.FC = () => {
  const { language } = useLanguage();
  const [startupCapital, setStartupCapital] = useState(25000);
  const [monthlyFixedCosts, setMonthlyFixedCosts] = useState(2200);
  const [unitCost, setUnitCost] = useState(18);
  const [unitPrice, setUnitPrice] = useState(65);
  const [expectedMonthlySales, setExpectedMonthlySales] = useState(120);

  // Financial calculations
  const grossMarginPerUnit = unitPrice - unitCost;
  const grossMarginPercent = unitPrice > 0 ? Math.round((grossMarginPerUnit / unitPrice) * 100) : 0;
  const breakEvenUnits = grossMarginPerUnit > 0 ? Math.ceil(monthlyFixedCosts / grossMarginPerUnit) : 0;
  const breakEvenRevenue = breakEvenUnits * unitPrice;
  const monthlyRevenue = expectedMonthlySales * unitPrice;
  const monthlyVariableCost = expectedMonthlySales * unitCost;
  const monthlyTotalCost = monthlyFixedCosts + monthlyVariableCost;
  const monthlyNetProfit = monthlyRevenue - monthlyTotalCost;
  const annualNetProfit = monthlyNetProfit * 12;
  const runwayMonths = monthlyNetProfit < 0 && Math.abs(monthlyNetProfit) > 0 
    ? Math.round(startupCapital / Math.abs(monthlyNetProfit)) 
    : 99;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <Calculator className="w-4 h-4" />
          <span>Financial Planning & Unit Economics Engine</span>
        </div>
        <h3 className="text-2xl font-bold text-stone-100">
          {language === 'ti' ? 'ናይ ንግዲ ባጀት፡ ዋጋን መኽሰብን መተመኒ' : language === 'de' ? 'Finanzbudgetierung & Deckungsbeitragsrechner' : 'Financial Budgeting & Break-Even Calculator'}
        </h3>
        <p className="text-stone-400 text-sm mt-1 max-w-2xl">
          {language === 'ti'
            ? 'ቀዋሚ ወጻኢታት፡ ናይ ሓንቲ ኣሃዱ ዋጋን መኽሰብን፡ መዓስ መኽሰብ ከም ትጅምሩ (Break-Even) ብልክዕ ኣስልዩ።'
            : language === 'de'
            ? 'Berechnen Sie Fixkosten, Stückkosten, Deckungsbeitrag, Gewinnschwelle (Break-Even) und Liquiditätsreichweite.'
            : 'Model unit economics, pricing sensitivity, fixed overhead, monthly break-even thresholds, and capital runway.'}
        </p>
      </div>

      {/* Main Grid: Inputs on Left, Real-Time Financial Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders & Inputs */}
        <div className="lg:col-span-5 bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-5">
          <h4 className="text-sm font-bold text-stone-200 uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Key Financial Variables</span>
          </h4>

          {/* Startup Capital */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-stone-300">Available Starting Capital</span>
              <span className="font-mono text-emerald-400 font-bold">${startupCapital.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={startupCapital}
              onChange={(e) => setStartupCapital(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-stone-950 rounded-lg cursor-pointer h-2"
            />
          </div>

          {/* Monthly Fixed Costs */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-stone-300">Monthly Fixed Costs (Rent, Salaries, Software)</span>
              <span className="font-mono text-rose-400 font-bold">${monthlyFixedCosts.toLocaleString()}/mo</span>
            </div>
            <input
              type="range"
              min="200"
              max="30000"
              step="100"
              value={monthlyFixedCosts}
              onChange={(e) => setMonthlyFixedCosts(Number(e.target.value))}
              className="w-full accent-rose-500 bg-stone-950 rounded-lg cursor-pointer h-2"
            />
          </div>

          {/* Unit Cost */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-stone-300">Direct Cost per Unit (COGS)</span>
              <span className="font-mono text-amber-400 font-bold">${unitCost}</span>
            </div>
            <input
              type="range"
              min="1"
              max="500"
              step="1"
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-950 rounded-lg cursor-pointer h-2"
            />
          </div>

          {/* Unit Selling Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-stone-300">Selling Price per Unit</span>
              <span className="font-mono text-cyan-400 font-bold">${unitPrice}</span>
            </div>
            <input
              type="range"
              min="5"
              max="1500"
              step="5"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-stone-950 rounded-lg cursor-pointer h-2"
            />
          </div>

          {/* Expected Monthly Units Sold */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-stone-300">Projected Monthly Sales (Units)</span>
              <span className="font-mono text-emerald-400 font-bold">{expectedMonthlySales} units</span>
            </div>
            <input
              type="range"
              min="10"
              max="2000"
              step="10"
              value={expectedMonthlySales}
              onChange={(e) => setExpectedMonthlySales(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-stone-950 rounded-lg cursor-pointer h-2"
            />
          </div>
        </div>

        {/* Real-Time Financial Dash & Break-Even Analysis */}
        <div className="lg:col-span-7 space-y-4">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] text-stone-400 uppercase font-mono">Gross Margin / Unit</span>
              <div className="text-xl font-bold text-emerald-400">${grossMarginPerUnit}</div>
              <div className="text-xs text-stone-400">{grossMarginPercent}% margin</div>
            </div>

            <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] text-stone-400 uppercase font-mono">Monthly Break-Even</span>
              <div className="text-xl font-bold text-amber-400">{breakEvenUnits} units</div>
              <div className="text-xs text-stone-400">${breakEvenRevenue.toLocaleString()} revenue</div>
            </div>

            <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-stone-400 uppercase font-mono">Monthly Net Profit</span>
              <div className={`text-xl font-bold ${monthlyNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${monthlyNetProfit.toLocaleString()}
              </div>
              <div className="text-xs text-stone-400">${annualNetProfit.toLocaleString()} / year</div>
            </div>
          </div>

          {/* Break-Even Progress Visualizer */}
          <div className="bg-stone-900/90 border border-stone-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-300 font-semibold">Break-Even Status</span>
              <span className={`font-bold ${expectedMonthlySales >= breakEvenUnits ? 'text-emerald-400' : 'text-amber-400'}`}>
                {expectedMonthlySales >= breakEvenUnits ? 'Profitable Operating Margin' : `Need ${breakEvenUnits - expectedMonthlySales} more units to break even`}
              </span>
            </div>

            <div className="w-full bg-stone-950 rounded-full h-3 overflow-hidden border border-stone-800 relative">
              <div
                className={`h-full transition-all duration-300 ${expectedMonthlySales >= breakEvenUnits ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-gradient-to-r from-amber-500 to-rose-500'}`}
                style={{ width: `${Math.min(100, Math.round((expectedMonthlySales / Math.max(breakEvenUnits, 1)) * 100))}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-stone-400 font-mono">
              <span>0 units</span>
              <span>Break-Even: {breakEvenUnits} units</span>
              <span>Current: {expectedMonthlySales} units</span>
            </div>
          </div>

          {/* Revenue vs Cost Breakdown Table */}
          <div className="bg-stone-900/90 border border-stone-800 p-5 rounded-2xl space-y-3">
            <h5 className="text-xs font-bold text-stone-300 uppercase tracking-wider">Monthly Cash-Flow Summary</h5>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-stone-950">
                <span className="text-stone-400">Total Monthly Revenue</span>
                <span className="font-mono text-emerald-400 font-bold">+${monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-stone-950">
                <span className="text-stone-400">Direct Variable Costs (COGS)</span>
                <span className="font-mono text-rose-400">-${monthlyVariableCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-stone-950">
                <span className="text-stone-400">Fixed Operating Overhead</span>
                <span className="font-mono text-rose-400">-${monthlyFixedCosts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-stone-950/80 border border-stone-700 font-bold">
                <span className="text-stone-200">Net Operational Cash Flow</span>
                <span className={`font-mono text-sm ${monthlyNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${monthlyNetProfit.toLocaleString()} / mo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
