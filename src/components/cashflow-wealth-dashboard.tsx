"use client";

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Home, CreditCard, PiggyBank, Calendar, Building2, Landmark } from 'lucide-react';

const CashFlowDashboard = () => {
  const [activeTab, setActiveTab] = useState('cashflow');
  const [stockView, setStockView] = useState('integrated');

  const monthlyIncome = {
    salary: 4500000,
    rent: 800000,
    dividends: 150000,
    interest: 50000
  };

  const monthlyExpenses = {
    fixed: 1200000,
    loanPayment: 1500000,
    pension: 500000,
    savings: 300000,
    living: 800000
  };

  const loans = [
    { name: '주택담보대출', balance: 150000000, rate: 3.5, monthly: 900000, bank: '국민은행' },
    { name: '신용대출', balance: 30000000, rate: 4.2, monthly: 600000, bank: '신한은행' }
  ];

  const realEstate = [
    { type: '아파트(거주)', value: 500000000, loan: 150000000, rent: 0 },
    { type: '오피스텔(임대)', value: 200000000, loan: 0, rent: 800000 }
  ];

  const pensions = [
    { type: 'TDF 연금', monthly: 300000, balance: 25000000, startAge: 55, expectedMonthly: 1200000 },
    { type: '변액연금보험', monthly: 200000, balance: 15000000, startAge: 55, expectedMonthly: 800000 }
  ];

  const stocks = {
    korea: [
      { name: '삼성전자', shares: 100, price: 70000, broker: '삼성증권', sector: '반도체' },
      { name: 'SK하이닉스', shares: 50, price: 150000, broker: '삼성증권', sector: '반도체' },
      { name: 'NAVER', shares: 30, price: 200000, broker: '키움증권', sector: 'IT' }
    ],
    us: [
      { name: 'Apple', shares: 20, price: 180, broker: '삼성증권', sector: '기술', currency: 'USD' },
      { name: 'Microsoft', shares: 15, price: 380, broker: '키움증권', sector: '기술', currency: 'USD' },
      { name: 'Tesla', shares: 10, price: 240, broker: '삼성증권', sector: '자동차', currency: 'USD' }
    ],
    etf: [
      { name: 'TIGER 미국S&P500', shares: 500, price: 15000, broker: '삼성증권', holdings: ['Apple', 'Microsoft'] },
      { name: 'KODEX 반도체', shares: 200, price: 45000, broker: '키움증권', holdings: ['삼성전자', 'SK하이닉스'] }
    ]
  };

  const otherAssets = {
    deposits: 50000000,
    bonds: 30000000,
    gold: 10000000,
    crypto: 5000000
  };

  const totalMonthlyIncome = Object.values(monthlyIncome).reduce((a, b) => a + b, 0);
  const totalMonthlyExpense = Object.values(monthlyExpenses).reduce((a, b) => a + b, 0);
  const netCashFlow = totalMonthlyIncome - totalMonthlyExpense;

  const stocksKoreaValue = stocks.korea.reduce((sum, s) => sum + s.shares * s.price, 0);
  const stocksUSValue = stocks.us.reduce((sum, s) => sum + s.shares * s.price * 1300, 0);
  const etfValue = stocks.etf.reduce((sum, e) => sum + e.shares * e.price, 0);
  const totalStocksValue = stocksKoreaValue + stocksUSValue + etfValue;

  const totalPensionBalance = pensions.reduce((sum, p) => sum + p.balance, 0);
  const realEstateNetValue = realEstate.reduce((sum, r) => sum + r.value - r.loan, 0);
  const totalLoanBalance = loans.reduce((sum, l) => sum + l.balance, 0);

  const totalAssets = totalStocksValue + otherAssets.deposits + otherAssets.bonds + 
                      otherAssets.gold + otherAssets.crypto + totalPensionBalance + 
                      realEstate.reduce((sum, r) => sum + r.value, 0);
  
  const netWorth = totalAssets - totalLoanBalance;

  const portfolioData = [
    { name: '부동산', value: realEstate.reduce((sum, r) => sum + r.value, 0), color: '#8b5cf6' },
    { name: '주식', value: totalStocksValue, color: '#3b82f6' },
    { name: '예적금', value: otherAssets.deposits, color: '#10b981' },
    { name: '채권', value: otherAssets.bonds, color: '#f59e0b' },
    { name: '연금', value: totalPensionBalance, color: '#ec4899' },
    { name: '금', value: otherAssets.gold, color: '#fbbf24' },
    { name: '가상자산', value: otherAssets.crypto, color: '#6366f1' }
  ];

  const cashFlowProjection = Array.from({ length: 6 }, (_, i) => ({
    month: `${i + 1}월`,
    income: totalMonthlyIncome,
    expense: totalMonthlyExpense,
    net: netCashFlow,
    accumulated: netCashFlow * (i + 1)
  }));

  const incomeData = [
    { name: '근로소득', value: monthlyIncome.salary, color: '#3b82f6' },
    { name: '월세수익', value: monthlyIncome.rent, color: '#8b5cf6' },
    { name: '배당/이자', value: monthlyIncome.dividends + monthlyIncome.interest, color: '#10b981' }
  ];

  const expenseData = [
    { name: '고정비', value: monthlyExpenses.fixed, color: '#ef4444' },
    { name: '대출상환', value: monthlyExpenses.loanPayment, color: '#f59e0b' },
    { name: '투자/저축', value: monthlyExpenses.pension + monthlyExpenses.savings, color: '#8b5cf6' },
    { name: '생활비', value: monthlyExpenses.living, color: '#6366f1' }
  ];

  const stocksByBroker = useMemo(() => {
    const grouped: any = {};
    const allStocks = [...stocks.korea, ...stocks.us, ...stocks.etf];
    allStocks.forEach(stock => {
      if (!grouped[stock.broker]) {
        grouped[stock.broker] = [];
      }
      grouped[stock.broker].push({
        ...stock,
        value: stock.currency === 'USD' ? stock.shares * stock.price * 1300 : stock.shares * stock.price
      });
    });
    return grouped;
  }, [stocks.korea, stocks.us, stocks.etf]);

  const stocksBySector = useMemo(() => {
    const grouped: any = {};
    const allStocks = [...stocks.korea, ...stocks.us];
    allStocks.forEach(stock => {
      if (!grouped[stock.sector]) {
        grouped[stock.sector] = { total: 0, stocks: [] };
      }
      const value = stock.currency === 'USD' ? stock.shares * stock.price * 1300 : stock.shares * stock.price;
      grouped[stock.sector].total += value;
      grouped[stock.sector].stocks.push({ ...stock, value });
    });
    return grouped;
  }, [stocks.korea, stocks.us]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ko-KR', { 
      style: 'currency', 
      currency: 'KRW', 
      maximumFractionDigits: 0 
    }).format(value);
  };

  const tabs = [
    { id: 'cashflow', label: '현금흐름', icon: TrendingUp },
    { id: 'portfolio', label: '포트폴리오', icon: PiggyBank },
    { id: 'stocks', label: '주식', icon: TrendingUp },
    { id: 'realestate', label: '부동산', icon: Home },
    { id: 'pension', label: '연금', icon: Calendar },
    { id: 'loans', label: '대출', icon: CreditCard }
  ];

  const stockViews = [
    { id: 'integrated', label: '통합 보기' },
    { id: 'broker', label: '증권사별' },
    { id: 'sector', label: '섹터별' },
    { id: 'overlap', label: 'ETF 중복 분석' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            재테크 통합 대시보드
          </h1>
          <p className="text-gray-400">현금흐름 중심의 자산 관리</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">순자산</span>
              <TrendingUp className="text-blue-400" size={20} />
            </div>
            <div className="text-3xl font-bold">{formatCurrency(netWorth)}</div>
            <div className="text-xs text-gray-400 mt-1">부채 제외</div>
          </div>

          <div className={`bg-gradient-to-br backdrop-blur-sm border rounded-xl p-6 ${
            netCashFlow >= 0 
              ? 'from-green-500/20 to-green-600/20 border-green-500/30' 
              : 'from-red-500/20 to-red-600/20 border-red-500/30'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">월 현금흐름</span>
              {netCashFlow >= 0 ? (
                <TrendingUp className="text-green-400" size={20} />
              ) : (
                <TrendingDown className="text-red-400" size={20} />
              )}
            </div>
            <div className="text-3xl font-bold">{formatCurrency(netCashFlow)}</div>
            <div className="text-xs text-gray-400 mt-1">수입 - 지출</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">월 수입</span>
              <DollarSign className="text-purple-400" size={20} />
            </div>
            <div className="text-3xl font-bold">{formatCurrency(totalMonthlyIncome)}</div>
            <div className="text-xs text-gray-400 mt-1">총 수입원</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">총 부채</span>
              <CreditCard className="text-orange-400" size={20} />
            </div>
            <div className="text-3xl font-bold">{formatCurrency(totalLoanBalance)}</div>
            <div className="text-xs text-gray-400 mt-1">대출 잔액</div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-gray-300'
                }`}
              >
                <IconComponent size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'cashflow' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="text-green-400" />
                  월 수입 구성
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie 
                      data={incomeData} 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={80} 
                      dataKey="value" 
                      label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                    >
                      {incomeData.map((entry, index) => (
                        <Cell key={`cell-income-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{formatCurrency(totalMonthlyIncome)}</div>
                  <div className="text-sm text-gray-400">총 월 수입</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingDown className="text-red-400" />
                  월 지출 구성
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie 
                      data={expenseData} 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={80} 
                      dataKey="value" 
                      label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-expense-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-red-400">{formatCurrency(totalMonthlyExpense)}</div>
                  <div className="text-sm text-gray-400">총 월 지출</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4">6개월 현금흐름 예측</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cashFlowProjection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#fff" />
                  <YAxis stroke="#fff" tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)} 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} 
                  />
                  <Legend />
                  <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b98140" name="수입" />
                  <Area type="monotone" dataKey="expense" stackId="2" stroke="#ef4444" fill="#ef444440" name="지출" />
                  <Line type="monotone" dataKey="accumulated" stroke="#8b5cf6" strokeWidth={3} name="누적 순현금흐름" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold mb-4 text-green-400">수입 상세</h3>
                <div className="space-y-3">
                  {Object.entries(monthlyIncome).map(([key, value]) => {
                    const labels = {
                      salary: '근로소득',
                      rent: '월세 수익',
                      dividends: '배당금',
                      interest: '이자'
                    };
                    return (
                      <div key={key} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">{labels[key]}</span>
                        <span className="font-semibold">{formatCurrency(value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold mb-4 text-red-400">지출 상세</h3>
                <div className="space-y-3">
                  {Object.entries(monthlyExpenses).map(([key, value]) => {
                    const labels = {
                      fixed: '고정비',
                      loanPayment: '대출 상환',
                      pension: '연금 납입',
                      savings: '적금',
                      living: '생활비'
                    };
                    return (
                      <div key={key} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">{labels[key]}</span>
                        <span className="font-semibold">{formatCurrency(value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold mb-4">자산 배분</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={portfolioData} 
                      cx="50%" 
                      cy="50%" 
                      labelLine={false} 
                      label={(entry) => `${entry.name} ${((entry.value / totalAssets) * 100).toFixed(1)}%`} 
                      outerRadius={100} 
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-portfolio-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold mb-4">자산 구성 상세</h3>
                <div className="space-y-3">
                  {portfolioData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                        <span>{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(item.value)}</div>
                        <div className="text-xs text-gray-400">{((item.value / totalAssets) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>총 자산</span>
                    <span className="text-blue-400">{formatCurrency(totalAssets)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stocks' && (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {stockViews.map(view => (
                <button
                  key={view.id}
                  onClick={() => setStockView(view.id)}
                  className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    stockView === view.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-gray-300'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>

            {stockView === 'integrated' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="text-blue-400" />
                    한국 주식
                  </h3>
                  <div className="space-y-3">
                    {stocks.korea.map((stock, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold">{stock.name}</span>
                          <span className="text-xs text-gray-400">{stock.broker}</span>
                        </div>
                        <div className="text-sm text-gray-400">{stock.shares}주 × {formatCurrency(stock.price)}</div>
                        <div className="text-right font-semibold text-blue-400 mt-1">
                          {formatCurrency(stock.shares * stock.price)}
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-white/20 font-bold text-right">
                      합계: {formatCurrency(stocksKoreaValue)}
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="text-green-400" />
                    미국 주식
                  </h3>
                  <div className="space-y-3">
                    {stocks.us.map((stock, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold">{stock.name}</span>
                          <span className="text-xs text-gray-400">{stock.broker}</span>
                        </div>
                        <div className="text-sm text-gray-400">{stock.shares}주 × ${stock.price}</div>
                        <div className="text-right font-semibold text-green-400 mt-1">
                          {formatCurrency(stock.shares * stock.price * 1300)}
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-white/20 font-bold text-right">
                      합계: {formatCurrency(stocksUSValue)}
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Landmark className="text-purple-400" />
                    ETF
                  </h3>
                  <div className="space-y-3">
                    {stocks.etf.map((etf, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-sm">{etf.name}</span>
                          <span className="text-xs text-gray-400">{etf.broker}</span>
                        </div>
                        <div className="text-sm text-gray-400">{etf.shares}주 × {formatCurrency(etf.price)}</div>
                        <div className="text-xs text-orange-400 mt-1">보유: {etf.holdings.join(', ')}</div>
                        <div className="text-right font-semibold text-purple-400 mt-1">
                          {formatCurrency(etf.shares * etf.price)}
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-white/20 font-bold text-right">
                      합계: {formatCurrency(etfValue)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {stockView === 'broker' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(stocksByBroker).map(([broker, stockList]) => (
                  <div key={broker} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold mb-4">{broker}</h3>
                    <div className="space-y-3">
                      {stockList.map((stock, idx) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-lg">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold">{stock.name}</span>
                            <span className="font-semibold text-blue-400">{formatCurrency(stock.value)}</span>
                          </div>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-white/20 font-bold text-right">
                        합계: {formatCurrency(stockList.reduce((sum, s) => sum + s.value, 0))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

                        {stockView === 'sector' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(stocksBySector).map(([sector, data]) => (
                  <div
                    key={sector}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                  >
                    <h3 className="text-lg font-semibold mb-4">{sector}</h3>
                    <div className="space-y-3">
                      {data.stocks.map((stock, idx) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold">{stock.name}</div>
                              <div className="text-xs text-gray-400">
                                {stock.broker}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-blue-400">
                                {formatCurrency(stock.value)}
                              </div>
                              <div className="text-xs text-gray-400">
                                {stock.shares}주 × {formatCurrency(stock.price)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-white/20 font-bold text-right">
                        합계: {formatCurrency(data.total)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CashFlowDashboard;

