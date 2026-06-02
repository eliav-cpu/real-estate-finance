const normalizeSource = (source = {}) => ({
  name: source.name || 'Unnamed Source',
  publisher: source.publisher || null,
  url: source.url || null,
  accessDate: source.accessDate || null,
  dataDate: source.dataDate || null,
  confidence: source.confidence || 'Unrated',
  verificationStatus: source.verificationStatus || 'Needs Verification',
  usage: source.usage || null,
  notes: source.notes || null,
});

const auditSources = (sources = []) => {
  const normalized = sources.map(normalizeSource);
  const findings = normalized
    .filter((source) => source.verificationStatus !== 'Verified')
    .map((source) => `${source.name}: ${source.verificationStatus}`);

  return {
    status: findings.length === 0 ? 'APPROVED' : 'REVIEW',
    totalSources: normalized.length,
    findings,
    sources: normalized,
  };
};

module.exports = {
  normalizeSource,
  auditSources,
};
