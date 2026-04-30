'use strict';

let gResult = null;
let dResult = null;

/* ───────────── TABLE ───────────── */

function renderTable() {
  const active = getActive();
  const gIds = gResult ? new Set(gResult.selected.map(r => r.id)) : new Set();
  const dIds = dResult ? new Set(dResult.selected.map(r => r.id)) : new Set();

  const rows = active.map((region, idx) => {
    const impact = calcImpact(region);
    const inG = gIds.has(region.id);
    const inD = dIds.has(region.id);

    let rowClass = '';
    let tagHtml  = '';

    if (inG && inD) {
      rowClass = 'selected-both';
      tagHtml  = '<span class="tag tag-both">BOTH</span>';
    } else if (inG) {
      rowClass = 'selected-greedy';
      tagHtml  = '<span class="tag tag-greedy">GREEDY</span>';
    } else if (inD) {
      rowClass = 'selected-dp';
      tagHtml  = '<span class="tag tag-dp">DP</span>';
    } else {
      tagHtml  = '<span class="tag" style="color:gray;border:1px solid gray">NOT SELECTED</span>';
    }

    const urgPct = (region.urgency / 10) * 60;

    return `
      <tr class="${rowClass}">
        <td><span class="region-id">${region.id}</span></td>
        <td>${region.name}</td>
        <td>
          <div class="urg-wrap">
            <div class="urg-bar" style="width:${urgPct}px"></div>
            ${region.urgency}
          </div>
        </td>
        <td>${region.population}K</td>
        <td>${region.distance} km</td>
        <td>${region.resources}</td>
        <td>${impact}</td>
        <td>${tagHtml}</td>
        <td><button onclick="removeRegion(${idx})">✕</button></td>
      </tr>
    `;
  });

  document.getElementById('regBody').innerHTML = rows.join('');
}

/* ───────────── RESULTS ───────────── */

function renderResults(totalResources) {

  // Clear hybrid when normal run
  document.getElementById('hybridBox').innerHTML = '';

  // Greedy
  document.getElementById('g-impact').textContent = gResult.total;
  document.getElementById('g-count').textContent  = gResult.selected.length;

  const gLeft = totalResources - gResult.used;

  document.getElementById('g-res').innerHTML =
    `${gResult.used} / ${totalResources}<br><small>Left: ${gLeft}</small>`;

  document.getElementById('g-regions').innerHTML =
    gResult.selected.map(r => `<span>${r.id}</span>`).join(' ');

  // DP
  document.getElementById('d-impact').textContent = dResult.total;
  document.getElementById('d-count').textContent  = dResult.selected.length;

  const dLeft = totalResources - dResult.used;

  document.getElementById('d-res').innerHTML =
    `${dResult.used} / ${totalResources}<br><small>Left: ${dLeft}</small>`;

  document.getElementById('d-regions').innerHTML =
    dResult.selected.map(r => `<span>${r.id}</span>`).join(' ');

  /* ───────── WINNER ───────── */

  const banner = document.getElementById('winnerBanner');
  const txt    = document.getElementById('winnerText');

  banner.style.display = 'block';

  if (dResult.total > gResult.total) {
    txt.innerHTML = `DP is better (Higher Impact: ${dResult.total})`;
  } else if (dResult.total === gResult.total) {
    txt.innerHTML = `Both give same result (${gResult.total})`;
  } else {
    txt.innerHTML = `Greedy is better`;
  }

  /* ───────── EXPLANATION ───────── */

  const explainBox = document.getElementById('explainBox');
  explainBox.style.display = 'block';

  if (dResult.total > gResult.total) {
    explainBox.innerHTML = `
      ❌ Greedy failed:<br>
      Greedy selected [${gResult.selected.map(r => r.id).join(", ")}]<br>
      DP selected [${dResult.selected.map(r => r.id).join(", ")}]<br>
      👉 DP gives better impact (${dResult.total} > ${gResult.total})
    `;
  } else {
    explainBox.innerHTML = `
      ✅ Both algorithms gave same optimal result (${gResult.total})
    `;
  }
}

/* ───────── HYBRID RESULT ───────── */

function renderHybrid(h, totalResources) {
  const box = document.getElementById("hybridBox");

  const left = totalResources - h.used;

  box.innerHTML = `
    <h3 style="margin-bottom:6px;">⚡ Hybrid Result</h3>
    <div>Impact: <b>${h.total}</b></div>
    <div>Selected: ${h.selected.map(r => r.id).join(", ")}</div>
    <div>Used: ${h.used} / ${totalResources}</div>
    <div>Left: ${left}</div>
  `;
}

/* ───────── TRACE ───────── */

function renderTraces() {
  document.getElementById('greedyTrace').innerHTML = gResult.trace;
  document.getElementById('dpTrace').innerHTML     = dResult.trace;
}

/* ───────── REGION HANDLING ───────── */

function addRegion() {
  const name = document.getElementById('nr-name').value || `R${regions.length+1}`;
  const urg  = parseInt(document.getElementById('nr-urg').value);
  const pop  = parseInt(document.getElementById('nr-pop').value);
  const dist = parseInt(document.getElementById('nr-dist').value);
  const res  = parseInt(document.getElementById('nr-res').value);

  regions.push({
    id:`R${regions.length+1}`,
    name,
    urgency:urg,
    population:pop,
    distance:dist,
    resources:res
  });

  renderTable();
}

function removeRegion(idx) {
  regions.splice(idx, 1);
  renderTable();
}

function syncRegionCount(val) {
  activeCount = parseInt(val);
  document.getElementById('regCountVal').textContent = val;
  renderTable();
}