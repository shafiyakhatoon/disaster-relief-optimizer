/**
 * main.js — Application entry point
 *
 * Wires together: data ↔ algorithms ↔ ui ↔ charts
 * Call flow:
 *   1. Page load → init()
 *   2. User clicks "Run Allocation" → runAllocation()
 *   3. User adds/removes region → handled in ui.js helpers
 */

'use strict';

/** Number of active regions shown (controlled by slider) */
let activeCount = 6;

/** Returns the currently active subset of regions */
function getActive() {
  return regions.slice(0, activeCount);
}


function runHybrid() {
  const W = parseInt(document.getElementById('totalRes').value);
  const active = getActive();

  // Step 1: Greedy with 50%
  const half = Math.floor(W / 2);
  const gPart = greedySolve(active, half);

  // Remove selected regions from list
  const remainingItems = active.filter(r => 
    !gPart.selected.find(x => x.id === r.id)
  );

  // Step 2: DP on remaining
  const remainingCapacity = W - gPart.used;
  const dPart = dpSolve(remainingItems, remainingCapacity);

  // Combine results
  const hybridSelected = [...gPart.selected, ...dPart.selected];

  let totalImpact = 0;
  hybridSelected.forEach(r => totalImpact += calcImpact(r));

  const hybridResult = {
    selected: hybridSelected,
    total: Math.round(totalImpact * 10) / 10,
    used: gPart.used + dPart.used,
    trace: "Hybrid = Greedy → DP"
  };

  // Store globally (add new variable)
  window.hybridResult = hybridResult;

  // Update UI
  renderHybrid(hybridResult, W);
}


/* ─────────────────────────────────────────────
   Main Allocation Runner
───────────────────────────────────────────── */

function runAllocation() {
  const W      = parseInt(document.getElementById('totalRes').value);
  const active = getActive();

  if (active.length === 0) {
    alert('Please add at least one region before running the allocation.');
    return;
  }

  // Run both algorithms
  gResult = greedySolve(active, W);
  dResult = dpSolve(active, W);

  // Update all UI components
  renderTable();
  renderResults(W);
  renderTraces();
  renderChart();

  // Smooth-scroll to results
  document.getElementById('winnerBanner').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ─────────────────────────────────────────────
   Initialisation
───────────────────────────────────────────── */

function init() {
  // Set slider bounds based on data length
  const slider = document.getElementById('numRegions');
  slider.max   = regions.length;
  slider.value = activeCount;
  document.getElementById('regCountVal').textContent = activeCount;

  // Initial table render (no results yet)
  renderTable();

  // Auto-run so the page isn't empty on first load
  runAllocation();
}

// Boot
document.addEventListener('DOMContentLoaded', init);
