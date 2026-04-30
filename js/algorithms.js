/**
 * algorithms.js — Core algorithmic logic
 *
 * Implements:
 *   1. Impact function
 *   2. Greedy allocation  — O(n log n)
 *   3. Dynamic Programming (0/1 Knapsack) — O(n × W)
 */

'use strict';

/* ─────────────────────────────────────────────
   Impact Function
   Impact = (Urgency × Population) / Distance
   Balances: severity, scale, delivery difficulty
───────────────────────────────────────────── */

/**
 * @param {Object} region
 * @returns {number} rounded impact score
 */
function calcImpact(region) {
  return Math.round((region.urgency * region.population) / region.distance * 10) / 10;
}

/* ─────────────────────────────────────────────
   Greedy Allocation
   Strategy: pick highest (impact / resources) ratio first.
   Time:  O(n log n)  — dominated by sort
   Space: O(n)
───────────────────────────────────────────── */

/**
 * @param {Object[]} items  — region list
 * @param {number}   W      — total resource capacity
 * @returns {{ selected, total, used, trace }}
 */
function greedySolve(items, W) {
  // Sort descending by impact-per-resource-unit (efficiency ratio)
  const sorted = [...items].sort((a, b) => {
    return (calcImpact(b) / b.resources) - (calcImpact(a) / a.resources);
  });

  let remaining = W;
  const selected = [];
  let totalImpact = 0;

  const traceLines = [
    `<span class="t-head2">// GREEDY — sort by impact ÷ resources</span>`,
    `Available capacity: <span class="t-step">${W} units</span>`,
    `Sorted order: ${sorted.map(r => r.id).join(' → ')}`,
    ``,
  ];

  for (const region of sorted) {
    const ratio = (calcImpact(region) / region.resources).toFixed(3);
    if (region.resources <= remaining) {
      selected.push(region);
      remaining -= region.resources;
      totalImpact += calcImpact(region);
      traceLines.push(
        `<span class="t-pick">✓ SELECT ${region.id.padEnd(4)} ratio=${ratio}  ` +
        `needs=${region.resources}  remaining=${remaining}</span>`
      );
    } else {
      traceLines.push(
        `<span class="t-skip">✗ SKIP   ${region.id.padEnd(4)} ratio=${ratio}  ` +
        `needs=${region.resources} > ${remaining}</span>`
      );
    }
  }

  const total = Math.round(totalImpact * 10) / 10;
  const used  = W - remaining;

  traceLines.push(``, `<span class="t-step">Final Impact: ${total}  Used: ${used}/${W}</span>`);

  return { selected, total, used, trace: traceLines.join('\n') };
}

/* ─────────────────────────────────────────────
   Dynamic Programming — 0/1 Knapsack
   Strategy: consider every possible subset via
             bottom-up DP table.
   Time:  O(n × W)
   Space: O(n × W)  — full table for traceback
───────────────────────────────────────────── */

/**
 * @param {Object[]} items  — region list
 * @param {number}   W      — total resource capacity (integer)
 * @returns {{ selected, total, used, trace, dpTable }}
 */
function dpSolve(items, W) {
  const n   = items.length;
  const cap = Math.round(W);  // ensure integer capacity

  const impacts = items.map(r => calcImpact(r));
  const weights = items.map(r => r.resources);

  // Build DP table: dp[i][w] = best total impact using first i items with capacity w
  // Use Float32Array for memory efficiency
  const dp = Array.from({ length: n + 1 }, () => new Float32Array(cap + 1));

  for (let i = 1; i <= n; i++) {
    const wi = weights[i - 1];
    const vi = impacts[i - 1];
    for (let w = 0; w <= cap; w++) {
      // Option A: don't take item i
      dp[i][w] = dp[i - 1][w];
      // Option B: take item i (if it fits)
      if (wi <= w) {
        const withItem = dp[i - 1][w - wi] + vi;
        if (withItem > dp[i][w]) {
          dp[i][w] = withItem;
        }
      }
    }
  }

  // Traceback — find which items were selected
  let w = cap;
  const selected = [];

  const traceLines = [
    `<span class="t-head">// DP — 0/1 Knapsack bottom-up</span>`,
    `Building ${n} × ${cap} DP table...`,
    `Optimal value at dp[${n}][${cap}] = ${Math.round(dp[n][cap] * 10) / 10}`,
    ``,
    `<span class="t-head">Traceback (n → 1):</span>`,
  ];

  for (let i = n; i > 0; i--) {
    if (Math.abs(dp[i][w] - dp[i - 1][w]) > 0.001) {
      // Item i was included
      selected.push(items[i - 1]);
      traceLines.push(
        `<span class="t-pick">✓ INCLUDE ${items[i-1].id.padEnd(4)} ` +
        `impact=${impacts[i-1]}  weight=${weights[i-1]}  cap → ${w - weights[i-1]}</span>`
      );
      w -= weights[i - 1];
    } else {
      traceLines.push(
        `<span class="t-skip">✗ EXCLUDE ${items[i-1].id.padEnd(4)} ` +
        `dp[${i}][${w}]=${Math.round(dp[i][w]*10)/10} == dp[${i-1}][${w}]</span>`
      );
    }
  }

  const total = Math.round(dp[n][cap] * 10) / 10;
  const used  = cap - w;

  traceLines.push(``, `<span class="t-step">Optimal Impact: ${total}  Used: ${used}/${W}</span>`);

  // Return a compact sample of the DP table (last row) for optional display
  const dpTableSample = Array.from(dp[n]).map((v, i) => ({ w: i, val: Math.round(v * 10) / 10 }));

  return { selected, total, used, trace: traceLines.join('\n'), dpTableSample };
}
