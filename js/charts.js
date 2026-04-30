/**
 * charts.js — Chart.js visualization module
 *
 * Three chart views:
 *   0 — Side-by-side impact comparison (bar)
 *   1 — Per-region impact scores coloured by selection (bar)
 *   2 — Resource utilization (doughnut gauge)
 */

'use strict';

let chartInstance = null;
let activeTab = 0;

/* Chart color constants — hardcoded hex required by Chart.js */
const C_GREEDY      = '#ff6b35';
const C_DP          = '#00d4ff';
const C_BOTH        = '#00e5a0';
const C_UNSELECTED  = '#2a3550';
const C_GRID        = 'rgba(30,45,69,.5)';
const C_TICK        = '#6b7a99';

/* ─────────────────────────────────────────────
   Tab switching
───────────────────────────────────────────── */

function switchTab(idx) {
  activeTab = idx;
  ['tab0', 'tab1', 'tab2'].forEach((id, i) => {
    document.getElementById(id).classList.toggle('active', i === idx);
  });
  renderChart();
}

/* ─────────────────────────────────────────────
   Main render dispatcher
───────────────────────────────────────────── */

function renderChart() {
  if (!gResult || !dResult) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const ctx = document.getElementById('mainChart').getContext('2d');

  if      (activeTab === 0) chartInstance = buildComparisonChart(ctx);
  else if (activeTab === 1) chartInstance = buildRegionImpactChart(ctx);
  else                      chartInstance = buildUtilizationChart(ctx);
}

/* ─────────────────────────────────────────────
   Chart 0 — Comparison bar
───────────────────────────────────────────── */

function buildComparisonChart(ctx) {
  setLegend([
    { color: C_GREEDY, label: `Greedy (${gResult.total})` },
    { color: C_DP,     label: `DP (${dResult.total})` },
  ]);

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Total Impact', 'Regions Selected', 'Resources Used'],
      datasets: [
        {
          label: 'Greedy',
          data: [gResult.total, gResult.selected.length, gResult.used],
          backgroundColor: 'rgba(255,107,53,.65)',
          borderColor: C_GREEDY,
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'DP',
          data: [dResult.total, dResult.selected.length, dResult.used],
          backgroundColor: 'rgba(0,212,255,.45)',
          borderColor: C_DP,
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: C_GRID }, ticks: { color: C_TICK, font: { size: 11 } } },
        y: { grid: { color: C_GRID }, ticks: { color: C_TICK, font: { size: 11 } } },
      },
    },
  });
}

/* ─────────────────────────────────────────────
   Chart 1 — Per-region impact coloured by selection
───────────────────────────────────────────── */

function buildRegionImpactChart(ctx) {
  const active = getActive();
  const gIds   = new Set(gResult.selected.map(r => r.id));
  const dIds   = new Set(dResult.selected.map(r => r.id));

  setLegend([
    { color: C_GREEDY,     label: 'Greedy only' },
    { color: C_DP,         label: 'DP only' },
    { color: C_BOTH,       label: 'Both selected' },
    { color: C_UNSELECTED, label: 'Not selected' },
  ]);

  const labels  = active.map(r => r.id);
  const impacts = active.map(r => calcImpact(r));
  const colors  = active.map(r => {
    const ig = gIds.has(r.id), id = dIds.has(r.id);
    if (ig && id)  return 'rgba(0,229,160,.7)';
    if (ig)        return 'rgba(255,107,53,.7)';
    if (id)        return 'rgba(0,212,255,.5)';
    return 'rgba(42,53,80,.8)';
  });
  const borders = active.map(r => {
    const ig = gIds.has(r.id), id = dIds.has(r.id);
    if (ig && id)  return C_BOTH;
    if (ig)        return C_GREEDY;
    if (id)        return C_DP;
    return C_UNSELECTED;
  });

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Impact Score',
        data: impacts,
        backgroundColor: colors,
        borderColor: borders,
        borderWidth: 1,
        borderRadius: 5,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: C_GRID },
          ticks: { color: C_TICK, font: { size: 11 }, autoSkip: false, maxRotation: 0 },
        },
        y: {
          grid: { color: C_GRID },
          ticks: { color: C_TICK, font: { size: 11 } },
          title: { display: true, text: 'Impact Score', color: C_TICK, font: { size: 10 } },
        },
      },
    },
  });
}

/* ─────────────────────────────────────────────
   Chart 2 — Resource utilization doughnut
───────────────────────────────────────────── */

function buildUtilizationChart(ctx) {
  const W = parseInt(document.getElementById('totalRes').value);
  const gUsedPct  = Math.round(gResult.used / W * 100);
  const dUsedPct  = Math.round(dResult.used / W * 100);

  setLegend([
    { color: C_GREEDY,     label: `Greedy used: ${gResult.used}/${W} (${gUsedPct}%)` },
    { color: C_DP,         label: `DP used: ${dResult.used}/${W} (${dUsedPct}%)` },
  ]);

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Greedy Used', 'Greedy Remaining', 'DP Used', 'DP Remaining'],
      datasets: [
        {
          label: 'Greedy',
          data: [gResult.used, W - gResult.used],
          backgroundColor: ['rgba(255,107,53,.8)', 'rgba(42,53,80,.4)'],
          borderColor: [C_GREEDY, '#1e2d45'],
          borderWidth: 1,
        },
        {
          label: 'DP',
          data: [dResult.used, W - dResult.used],
          backgroundColor: ['rgba(0,212,255,.65)', 'rgba(42,53,80,.4)'],
          borderColor: [C_DP, '#1e2d45'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed} units`,
          },
        },
      },
      cutout: '55%',
    },
  });
}

/* ─────────────────────────────────────────────
   Legend helper
───────────────────────────────────────────── */

function setLegend(items) {
  document.getElementById('chartLegend').innerHTML = items
    .map(({ color, label }) =>
      `<span class="leg-item">
         <span class="leg-dot" style="background:${color}"></span>${label}
       </span>`)
    .join('');
}
