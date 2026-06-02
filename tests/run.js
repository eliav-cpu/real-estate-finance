const assert = require('assert');
const refin = require('../index');
const paymentPlan = require('../src/engines/paymentPlan');
const returns = require('../src/engines/returns');
const debt = require('../src/engines/debt');
const rentalRevenue = require('../src/engines/rentalRevenue');
const appreciation = require('../src/engines/appreciation');
const sourceGovernance = require('../src/governance/sourceGovernance');
const safety = require('../src/qa/clientOutputSafety');

const closeTo = (actual, expected, tolerance = 0.001) => {
  assert(Math.abs(actual - expected) <= tolerance, `Expected ${actual} to be close to ${expected}`);
};

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

test('annualGrossPotentialIncome supports legacy positional input', () => {
  assert.strictEqual(refin.annualGrossPotentialIncome(1000), 12000);
});

test('core formulas support object input', () => {
  assert.strictEqual(refin.grossOperatingIncome({ monthlyIncome: 1000, estimatedLossPercentage: 10 }), 10800);
  assert.strictEqual(refin.grossRentalMultiplier({ marketValue: 240000, agi: 12000 }), 20);
  assert.strictEqual(refin.estimatedPropertyValueByGRM({ grm: 20, annualIncome: 12000 }), 240000);
});

test('core formulas support README-style positional input', () => {
  assert.strictEqual(refin.grossOperatingIncome(1000, 10), 10800);
  assert.strictEqual(refin.grossRentalMultiplier(240000, 12000), 20);
  assert.strictEqual(refin.estimatedPropertyValueByGRM(20, 12000), 240000);
});

test('division-by-zero formulas return null instead of Infinity', () => {
  assert.strictEqual(refin.grossRentalMultiplier(240000, 0), null);
  assert.strictEqual(refin.estimatedPropertyValueByCapRate(10000, 0), null);
  assert.strictEqual(refin.returnOnEquity(10000, 0), null);
});

test('payment plan validates 100 percent total', () => {
  const result = paymentPlan.validatePaymentPlan([
    { label: 'signing', percent: 10 },
    { label: 'construction', percent: 35 },
    { label: 'handover', percent: 55 },
  ]);
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.totalPercent, 100);
});

test('payment plan rejects non-100 percent total', () => {
  const result = paymentPlan.validatePaymentPlan([
    { label: 'signing', percent: 10 },
    { label: 'handover', percent: 80 },
  ]);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.totalPercent, 90);
});

test('return engine calculates gross and net yield', () => {
  const result = returns.calculateReturnMetrics({ purchasePrice: 200000, annualGrossIncome: 24000, annualNetIncome: 16000, equityInvested: 50000 });
  closeTo(result.grossYield, 0.12);
  closeTo(result.netYield, 0.08);
  closeTo(result.cashOnCash, 0.32);
});

test('debt engine calculates DSCR and amortization', () => {
  const result = debt.calculateDebtMetrics({ loanAmount: 100000, annualInterestRate: 0.06, termYears: 10, annualNOI: 18000 });
  assert(result.monthlyPayment > 0);
  assert(result.annualDebtService > 0);
  assert(result.dscr > 1);
  assert.strictEqual(result.amortizationSchedule.length, 120);
});

test('hotel rental revenue calculates room revenue and RevPAR', () => {
  const result = rentalRevenue.calculateHotelRevenue({ rooms: 100, adr: 120, occupancy: 0.75, operatingDays: 365, expenseRatio: 0.35 });
  closeTo(result.roomRevenue, 3285000);
  closeTo(result.revPAR, 90);
  closeTo(result.noi, 2135250);
});

test('appreciation engine calculates future and gain values', () => {
  const result = appreciation.calculateAppreciationScenario({ currentValue: 200000, annualAppreciationRate: 0.05, years: 3 });
  closeTo(result.futureValue, 231525);
  closeTo(result.gain, 31525);
});

test('source governance marks missing verification', () => {
  const result = sourceGovernance.normalizeSource({ name: 'Example source' });
  assert.strictEqual(result.verificationStatus, 'Needs Verification');
});

test('client output safety blocks guarantee language', () => {
  const result = safety.scanClientOutput('This is a guaranteed return with no risk.');
  assert.strictEqual(result.pass, false);
  assert(result.blockedTerms.includes('guaranteed return'));
});

let failed = 0;
for (const t of tests) {
  try {
    t.fn();
    console.log(`PASS ${t.name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${t.name}`);
    console.error(error.stack || error.message);
  }
}

if (failed > 0) {
  console.error(`${failed} test(s) failed.`);
  process.exit(1);
}

console.log(`${tests.length} test(s) passed.`);
