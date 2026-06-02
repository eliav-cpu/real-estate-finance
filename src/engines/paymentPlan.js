const round = (value, digits = 2) => Number(Number(value || 0).toFixed(digits));

const validatePaymentPlan = (milestones, options = {}) => {
  const tolerance = options.tolerance ?? 0.001;
  const normalized = Array.isArray(milestones) ? milestones.map((item, index) => ({
    label: item.label || `Milestone ${index + 1}`,
    percent: Number(item.percent || 0),
    dueDate: item.dueDate || null,
  })) : [];

  const totalPercent = round(normalized.reduce((sum, item) => sum + item.percent, 0), 4);
  const valid = Math.abs(totalPercent - 100) <= tolerance;

  return {
    valid,
    totalPercent,
    differenceFrom100: round(totalPercent - 100, 4),
    milestones: normalized,
    status: valid ? 'APPROVED' : 'BLOCKED',
    findings: valid ? [] : [`Payment plan totals ${totalPercent}% instead of 100%.`],
  };
};

const buildPaymentSchedule = ({ price, milestones }) => {
  const validation = validatePaymentPlan(milestones);
  const schedule = validation.milestones.map((item) => ({
    ...item,
    amount: round(Number(price || 0) * item.percent / 100, 2),
  }));

  return {
    ...validation,
    price: round(price, 2),
    schedule,
    totalAmount: round(schedule.reduce((sum, item) => sum + item.amount, 0), 2),
  };
};

module.exports = {
  validatePaymentPlan,
  buildPaymentSchedule,
};
