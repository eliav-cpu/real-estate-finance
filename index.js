const valuesFromArgs = (argsLike, names) => {
  const args = Array.from(argsLike);
  if (args.length === 1 && args[0] && typeof args[0] === 'object' && !Array.isArray(args[0])) {
    return names.map((name) => Number(args[0][name] || 0));
  }
  return names.map((_, index) => Number(args[index] || 0));
};

const finite = (value, fallback = 0) => (Number.isFinite(Number(value)) ? Number(value) : fallback);
const fixed = (value, digits = 2) => Number(finite(value).toFixed(digits));

const annualGrossPotentialIncome = (expectedMonthlyRentIncome) => {
  return finite(expectedMonthlyRentIncome) * 12;
};

const netOperatingIncome = function () {
  const [
    monthlyIncome,
    vacancies,
    nonPayments,
    taxes,
    mortgageInterest,
    marketing,
    advertising,
    management,
    legal,
    accounting,
    utilities,
    repairs,
    maintenance,
    acquisition,
    saleCosts,
  ] = valuesFromArgs(arguments, [
    'monthlyIncome',
    'vacancies',
    'nonPayments',
    'taxes',
    'mortgageInterest',
    'marketing',
    'advertising',
    'management',
    'legal',
    'accounting',
    'utilities',
    'repairs',
    'maintenance',
    'acquisition',
    'sale_costs',
  ]);

  const grossPotentialIncome = annualGrossPotentialIncome(monthlyIncome);
  const totalExpenses = vacancies + nonPayments + taxes + mortgageInterest + marketing + advertising + management + legal + accounting + utilities + repairs + maintenance + acquisition + saleCosts;
  return fixed(grossPotentialIncome - totalExpenses);
};

const grossRentalMultiplier = function () {
  const [marketValue, agi] = valuesFromArgs(arguments, ['marketValue', 'agi']);
  if (agi === 0) return null;
  return fixed(marketValue / agi, 3);
};

const estimatedPropertyValueByGRM = function () {
  const [grm, annualIncome] = valuesFromArgs(arguments, ['grm', 'annualIncome']);
  return fixed(grm * annualIncome);
};

const grossOperatingIncome = function () {
  const [monthlyIncome, estimatedLossPercentage] = valuesFromArgs(arguments, ['monthlyIncome', 'estimatedLossPercentage']);
  const annualIncome = annualGrossPotentialIncome(monthlyIncome);
  const estimatedLoss = annualIncome * (estimatedLossPercentage / 100);
  return fixed(annualIncome - estimatedLoss);
};

const capitalizationRate = function () {
  const [
    monthlyIncome,
    vacancies,
    nonPayments,
    taxes,
    marketing,
    advertising,
    management,
    legal,
    accounting,
    utilities,
    repairs,
    maintenance,
    acquisition,
    saleCosts,
    saleEarned,
  ] = valuesFromArgs(arguments, [
    'monthlyIncome',
    'vacancies',
    'nonPayments',
    'taxes',
    'marketing',
    'advertising',
    'management',
    'legal',
    'accounting',
    'utilities',
    'repairs',
    'maintenance',
    'acquisition',
    'sale_costs',
    'sale_earned',
  ]);

  if (saleEarned === 0) return null;
  const grossPotentialIncome = annualGrossPotentialIncome(monthlyIncome);
  const totalExpenses = vacancies + nonPayments + taxes + marketing + advertising + management + legal + accounting + utilities + repairs + maintenance + acquisition + saleCosts;
  return fixed((grossPotentialIncome - totalExpenses) / saleEarned, 3);
};

const estimatedPropertyValueByCapRate = function () {
  const [noi, capRate] = valuesFromArgs(arguments, ['noi', 'capRate']);
  if (capRate === 0) return null;
  return fixed(noi / capRate);
};

const cashFlowBeforeTaxes = function () {
  const [noi, interestRate, loanPrinciple, capitalExpenditures, capitalExpenditureLoans, earnedInterest] = valuesFromArgs(arguments, [
    'noi',
    'interestRate',
    'loanPrinciple',
    'capitalExpenditures',
    'capitalExpenditureLoans',
    'earnedInterest',
  ]);

  const debtService = (interestRate / 100) * loanPrinciple + loanPrinciple;
  return fixed(noi - debtService - capitalExpenditures - capitalExpenditureLoans + earnedInterest);
};

const cashFlowAfterTaxes = function () {
  const [cfbt, stateIncomeTax, federalIncomeTax] = valuesFromArgs(arguments, ['cfbt', 'stateIncomeTax', 'federalIncomeTax']);
  return fixed(cfbt - stateIncomeTax - federalIncomeTax);
};

const breakEvenRatio = function () {
  const [interestRate, loanPrinciple, marketing, advertising, management, legal, accounting, utilities, repairs, maintenance, goi] = valuesFromArgs(arguments, [
    'interestRate',
    'loanPrinciple',
    'marketing',
    'advertising',
    'management',
    'legal',
    'accounting',
    'utilities',
    'repairs',
    'maintenance',
    'goi',
  ]);

  if (goi === 0) return null;
  const debtService = (interestRate / 100) * loanPrinciple + loanPrinciple;
  const operatingExpenses = marketing + advertising + management + legal + accounting + utilities + repairs + maintenance;
  return fixed((debtService + operatingExpenses) / goi);
};

const returnOnEquity = function () {
  const [cfat, principleInvested] = valuesFromArgs(arguments, ['cfat', 'principleInvested']);
  if (principleInvested === 0) return null;
  return fixed(cfat / principleInvested);
};

module.exports = {
  annualGrossPotentialIncome,
  netOperatingIncome,
  grossRentalMultiplier,
  estimatedPropertyValueByGRM,
  grossOperatingIncome,
  capitalizationRate,
  estimatedPropertyValueByCapRate,
  cashFlowBeforeTaxes,
  cashFlowAfterTaxes,
  breakEvenRatio,
  returnOnEquity,
};
