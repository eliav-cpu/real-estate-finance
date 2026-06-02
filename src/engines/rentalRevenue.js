const round = (value, digits = 2) => Number(Number(value || 0).toFixed(digits));

const calculateHotelRevenue = ({ rooms, adr, occupancy, operatingDays = 365, expenseRatio = 0, managementFeeRatio = 0, investorShareRatio = 1 }) => {
  const roomRevenue = Number(rooms || 0) * Number(adr || 0) * Number(occupancy || 0) * Number(operatingDays || 0);
  const revPAR = Number(adr || 0) * Number(occupancy || 0);
  const operatingExpenses = roomRevenue * Number(expenseRatio || 0);
  const managementFee = roomRevenue * Number(managementFeeRatio || 0);
  const noi = roomRevenue - operatingExpenses - managementFee;
  const investorShare = noi * Number(investorShareRatio || 0);

  return {
    rooms: Number(rooms || 0),
    adr: Number(adr || 0),
    occupancy: Number(occupancy || 0),
    operatingDays: Number(operatingDays || 0),
    roomRevenue: round(roomRevenue),
    revPAR: round(revPAR),
    operatingExpenses: round(operatingExpenses),
    managementFee: round(managementFee),
    noi: round(noi),
    investorShare: round(investorShare),
    status: roomRevenue > 0 ? 'APPROVED' : 'REVIEW',
  };
};

const calculateResidentialRentalRevenue = ({ monthlyRent, vacancyRatio = 0, annualExpenses = 0 }) => {
  const annualGrossIncome = Number(monthlyRent || 0) * 12;
  const vacancyLoss = annualGrossIncome * Number(vacancyRatio || 0);
  const annualNetIncome = annualGrossIncome - vacancyLoss - Number(annualExpenses || 0);

  return {
    annualGrossIncome: round(annualGrossIncome),
    vacancyLoss: round(vacancyLoss),
    annualExpenses: round(annualExpenses),
    annualNetIncome: round(annualNetIncome),
    status: annualGrossIncome > 0 ? 'APPROVED' : 'REVIEW',
  };
};

module.exports = {
  calculateHotelRevenue,
  calculateResidentialRentalRevenue,
};
