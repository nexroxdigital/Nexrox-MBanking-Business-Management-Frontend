export const fmtBDT = (n) =>
  new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 2 }).format(
    Number(n || 0)
  );

export const todayISO = () => new Date().toISOString().slice(0, 10);
export const monthKey = (d) => d.slice(0, 7); // YYYY-MM
export const isSameDay = (iso1, iso2) => iso1 === iso2;
export const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const clamp2 = (v) => Math.round(Number(v || 0) * 100) / 100;

export function computeSums(transactions, clients) {
  const byDay = {};
  const byMonth = {};
  let totalSell = 0,
    totalProfit = 0;
  transactions.forEach((t) => {
    totalSell += Number(t.amount || 0);
    totalProfit += Number(t.commission || 0);
    byDay[t.date] = byDay[t.date] || { sell: 0, profit: 0, due: 0 };
    byDay[t.date].sell += Number(t.amount || 0);
    byDay[t.date].profit += Number(t.commission || 0);
    const m = monthKey(t.date);
    byMonth[m] = byMonth[m] || { sell: 0, profit: 0, due: 0 };
    byMonth[m].sell += Number(t.amount || 0);
    byMonth[m].profit += Number(t.commission || 0);
  });
  const clientStats = computeClientStats({ transactions, clients });
  // set same total due to each day/month snapshot for simplicity
  Object.keys(byDay).forEach((d) => (byDay[d].due = clientStats.totalDue));
  Object.keys(byMonth).forEach((m) => (byMonth[m].due = clientStats.totalDue));
  return {
    totalSell,
    totalProfit,
    totalDue: clientStats.totalDue,
    byDay,
    byMonth,
  };
}

export function computeClientStats(state) {
  const byClient = {};
  state.transactions.forEach((t) => {
    if (!t.clientId) return;
    byClient[t.clientId] = byClient[t.clientId] || { sell: 0 };
    byClient[t.clientId].sell += Number(t.amount || 0);
  });
  let totalDue = 0;
  state.clients.forEach((c) => {
    const sell = byClient[c.id]?.sell || 0;
    const paid = (c.payments || []).reduce(
      (s, p) => s + Number(p.amount || 0),
      0
    );
    totalDue += sell - paid;
  });
  return { byClient, totalDue };
}

export function computeBalances(numbers, transactions) {
  const balances = Object.fromEntries(
    numbers.map((n) => [n.id, Number(n.manualAdj || 0)])
  );
  transactions.forEach((t) => {
    const sign = t.type === "Cash Out" ? +1 : -1;
    balances[t.numberId] = clamp2(
      (balances[t.numberId] || 0) + sign * Number(t.amount || 0)
    );
  });
  return balances;
}

export const COMMISSION_RATES = {
  // % of amount by type when NumberType = Agent
  // Adjust these as needed.
  Bkash: {
    "Cash In": 0.02,
    "Cash Out": 0.005,
    "Bill Payment": 0.002,
  },
  Nagad: {
    "Cash In": 0.02,
    "Cash Out": 0.0055,
    "Bill Payment": 0.002,
  },
  Rocket: {
    "Cash In": 0.02,
    "Cash Out": 0.005,
    "Bill Payment": 0.002,
  },
  "Bill Payment": { "Bill Payment": 0.002 }, // fallback for odd mapping
};

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}
