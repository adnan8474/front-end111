export function detectAnomalies(rows, config = {}) {
  const defaults = {
    workingHours: [7, 20],
    wardSwitchMins: 10,
    deviceSwitchMins: 10,
    burstThreshold: 3,
    burstWindow: 5,
    hourlyLimit: 15,
    applyNightPenalty: true,
    suspiciousScore: 3.5,
    suspiciousBursts: 1,
  };
  const cfg = { ...defaults, ...config };

  const byOperator = new Map();
  rows.forEach(row => {
    if (!byOperator.has(row.operator_id)) byOperator.set(row.operator_id, []);
    byOperator.get(row.operator_id).push(row);
  });

  const summaries = [];
  byOperator.forEach((events, operator_id) => {
    events.sort((a, b) => a.timestamp - b.timestamp);

    let outOfHours = 0;
    const hours = {};
    events.forEach(e => {
      const hr = e.timestamp.getHours();
      hours[hr] = (hours[hr] || 0) + 1;
      if (hr < cfg.workingHours[0] || hr >= cfg.workingHours[1]) outOfHours++;
    });
    const totalEvents = events.length;
    const nightShiftPct = totalEvents ? outOfHours / totalEvents : 0;
    const nightWorker = nightShiftPct > 0.8;

    let score = 0;
    let bursts = 0;
    const breakdown = {
      nightPenalty: 0,
      locationSwitch: 0,
      deviceSwitch: 0,
      bursts: 0,
      hourlyExcess: 0,
    };
    const uniqueLocations = new Set(events.map(e => e.location)).size;
    const uniqueDevices = new Set(events.map(e => e.device)).size;

    events.forEach((e, idx) => {
      const hr = e.timestamp.getHours();
      const isOut = hr < cfg.workingHours[0] || hr >= cfg.workingHours[1];
      if (isOut && cfg.applyNightPenalty && !nightWorker) {
        score += 2;
        breakdown.nightPenalty += 2;
      }

      if (idx > 0) {
        const prev = events[idx - 1];
        const delta = (e.timestamp - prev.timestamp) / 60000;
        if (
          e.location !== prev.location &&
          delta < cfg.wardSwitchMins &&
          delta < 60 &&
          uniqueLocations > 2
        ) {
          score += 5;
          breakdown.locationSwitch += 5;
        }
        if (
          e.device !== prev.device &&
          delta < cfg.deviceSwitchMins &&
          delta < 60 &&
          uniqueDevices > 1
        ) {
          score += 2;
          breakdown.deviceSwitch += 2;
        }
      }

      const windowStart = new Date(e.timestamp.getTime() - cfg.burstWindow * 60000);
      const recent = events.filter(r => r.timestamp >= windowStart && r.timestamp <= e.timestamp);
      if (recent.length >= cfg.burstThreshold) {
        bursts += 1;
        score += 4;
        breakdown.bursts += 4;
      }
    });

    let peakHour = 0;
    Object.values(hours).forEach(c => {
      if (c > peakHour) peakHour = c;
    });
    if (peakHour > cfg.hourlyLimit) {
      const add = 2 * (peakHour - cfg.hourlyLimit);
      score += add;
      breakdown.hourlyExcess += add;
    }

    const avgScore = totalEvents ? score / totalEvents : 0;

    summaries.push({
      operator_id,
      tests: totalEvents,
      totalScore: score,
      avgScore,
      bursts,
      peakHour,
      hourlyCounts: hours,
      nightShiftPct,
      breakdown,
    });
  });

  const sortByScore = [...summaries].sort((a, b) => b.avgScore - a.avgScore);
  const topIndex = Math.floor(summaries.length * 0.1);
  const topOperators = new Set(sortByScore.slice(0, topIndex).map(s => s.operator_id));

  summaries.forEach(s => {
    s.suspicious =
      (s.avgScore >= cfg.suspiciousScore && s.bursts >= cfg.suspiciousBursts) ||
      topOperators.has(s.operator_id);
  });

  return summaries;
}
