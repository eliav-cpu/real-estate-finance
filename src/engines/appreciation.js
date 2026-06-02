const round = (value, digits = 2) => Number(Number(value || 0).toFixed(digits));

const calculateAppreciationScenario = ({ currentValue, annualAppreciationRate, years }) => {
  const startValue = Number(currentValue || 0);
  const rate = Number(annualAppreciationRate || 0);
  const duration = Number(years || 0);
  const futureValue = startValue * Math.pow(1 + rate, duration);

  return {
    currentValue: round(startValue),
    annualAppreciationRate: rate,
    years: duration,
    futureValue: round(futureValue),
    gain: round(futureValue - startValue),
    status: startValue > 0 ? 'APPROVED' : 'REVIEW',
  };
};

module.exports = {
  calculateAppreciationScenario,
};
