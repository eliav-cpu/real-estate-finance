const round = (value, digits = 4) => Number(Number(value || 0).toFixed(digits));

const calculateMonthlyPayment = ({ loanAmount, annualInterestRate, termYears }) => {
  const principal = Number(loanAmount || 0);
  const monthlyRate = Number(annualInterestRate || 0) / 12;
  const numberOfPayments = Number(termYears || 0) * 12;

  if (principal <= 0 || numberOfPayments <= 0) return 0;
  if (monthlyRate === 0) return round(principal / numberOfPayments, 2);

  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  return round(payment, 2);
};

const buildAmortizationSchedule = ({ loanAmount, annualInterestRate, termYears }) => {
  const monthlyPayment = calculateMonthlyPayment({ loanAmount, annualInterestRate, termYears });
  const monthlyRate = Number(annualInterestRate || 0) / 12;
  const numberOfPayments = Number(termYears || 0) * 12;
  let balance = Number(loanAmount || 0);
  const schedule = [];

  for (let period = 1; period <= numberOfPayments; period += 1) {
    const interest = round(balance * monthlyRate, 2);
    const principal = round(Math.min(monthlyPayment - interest, balance), 2);
    balance = round(Math.max(balance - principal, 0), 2);
    schedule.push({ period, payment: monthlyPayment, principal, interest, endingBalance: balance });
  }

  return schedule;
};

const calculateDebtMetrics = ({ propertyValue, loanAmount, annualInterestRate, termYears, annualNOI }) => {
  const monthlyPayment = calculateMonthlyPayment({ loanAmount, annualInterestRate, termYears });
  const annualDebtService = round(monthlyPayment * 12, 2);
  const dscr = annualDebtService === 0 ? null : round(Number(annualNOI || 0) / annualDebtService, 4);
  const ltv = Number(propertyValue || 0) === 0 ? null : round(Number(loanAmount || 0) / Number(propertyValue || 0), 4);

  return {
    propertyValue: Number(propertyValue || 0),
    loanAmount: Number(loanAmount || 0),
    annualInterestRate: Number(annualInterestRate || 0),
    termYears: Number(termYears || 0),
    monthlyPayment,
    annualDebtService,
    ltv,
    dscr,
    amortizationSchedule: buildAmortizationSchedule({ loanAmount, annualInterestRate, termYears }),
    status: dscr === null ? 'REVIEW' : dscr >= 1.2 ? 'APPROVED' : 'REVIEW',
  };
};

module.exports = {
  calculateMonthlyPayment,
  buildAmortizationSchedule,
  calculateDebtMetrics,
};
