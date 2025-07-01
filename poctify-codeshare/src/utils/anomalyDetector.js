export function detectAnomalies(rows, config = {}) {
  const defaults = {
    workingHours: [7, 20],
    wardSwitchMins: 10,
    deviceSwitchMins: 10,
    burstThreshold: 3,
    burstWindow: 5,
    hourlyLimit: 15,
  };
  const cfg = { ...defaults, ...config };

  const byOperator = new Map();
  rows.forEach(row => {
    if (!byOperator.has(row.operator_id)) byOperator.set(row.operator_id, []);
    byOperator.get(row.operator_id).push(row);
  });

  const summaries = [];
  byOperator.forEach((events, operator_id) => {
    let score = 0;
    let bursts = 0;
    const hours = {};
    events.forEach((e, idx) => {
      const hour = e.timestamp.getHours();
      hours[hour] = (hours[hour] || 0) + 1;
      if (hour < cfg.workingHours[0] || hour >= cfg.workingHours[1]) {
        score += 2;
      }
      if (idx > 0) {
        const prev = events[idx - 1];
        const delta = (e.timestamp - prev.timestamp) / 60000;
        if (e.location !== prev.location && delta < cfg.wardSwitchMins) score += 5;
        if (e.device !== prev.device && delta < cfg.deviceSwitchMins) score += 2;
      }
      const windowStart = new Date(e.timestamp.getTime() - cfg.burstWindow * 60000);
      const recent = events.filter(r => r.timestamp >= windowStart && r.timestamp <= e.timestamp);
      if (recent.length >= cfg.burstThreshold) {
        bursts += 1;
        score += 4;
      }
    });
    const totalEvents = events.length;
    let peakHour = 0;
    Object.values(hours).forEach(c => { if (c > peakHour) peakHour = c; });
    if (peakHour > cfg.hourlyLimit) {
      score += 2 * (peakHour - cfg.hourlyLimit);
    }
    const avgScore = score / totalEvents;
    summaries.push({ operator_id, tests: totalEvents, totalScore: score, avgScore, bursts, peakHour, hourlyCounts: hours });
  });
  return summaries;
}
