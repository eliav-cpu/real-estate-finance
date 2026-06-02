const safeDivide = (numerator, denominator) => {
  const n = Number(numerator || 0);
  const d = Number(denominator || 0);
  if (d === 0) return null;
  return n / d;
};

const round = (value, digits = 4) => value === null ? null : Number(Number(value).toFixed(digits));

const calculateReturnMetrics = ({ purchasePrice, annualGrossIncome, annualNetIncome, equityInvested }) => {
  const grossYield = safeDivide(annualGrossIncome, purchasePrice);
  const netYield = safeDivide(annualNetIncome, purchasePrice);
  const cashOnCash = safeDivide(annualNetIncome, equityInvested);

  return {
    purchasePrice: Number(purchasePrice || 0),
    annualGrossIncome: Number(annualGrossIncome || 0),
    annualNetIncome: Number(annualNetIncome || 0),
    equityInvested: Number(equityInvested || 0),
    grossYield: round(grossYield),
    netYield: round(netYield),
    cashOnCash: round(cashOnCash),
    status: [grossYield, netYield, cashOnCash].includes(null) ? 'REVIEW' : 'APPROVED',
  };
};

module.exports = {
  calculateReturnMetrics,
};
