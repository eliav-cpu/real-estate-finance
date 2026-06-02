const blockedTerms = [
  'guaranteed return',
  'risk-free',
  'no risk',
  'certain profit',
  'guaranteed appreciation',
  'guaranteed rent',
  'תשואה מובטחת',
  'ללא סיכון',
  'רווח בטוח',
];

const scanClientOutput = (text = '') => {
  const normalized = String(text).toLowerCase();
  const found = blockedTerms.filter((term) => normalized.includes(term.toLowerCase()));

  return {
    pass: found.length === 0,
    blockedTerms: found,
    status: found.length === 0 ? 'APPROVED' : 'BLOCKED',
    disclaimerRequired: true,
  };
};

module.exports = {
  blockedTerms,
  scanClientOutput,
};
