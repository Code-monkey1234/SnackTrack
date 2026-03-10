// ============================================
//  SnackTrack — App Logic
//  Navigation, page builders, UI interactions
// ============================================


// ---- Navigation ----

function go(pageId) {
  if (pageId.startsWith('store-')) buildStore(pageId.replace('store-', ''));
  else if (pageId.startsWith('food-')) buildFood(pageId.replace('food-', ''));

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const el = document.getElementById('page-' + pageId);
  if (el) {
    el.classList.add('active');
    window.scrollTo(0, 0);
  }

  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (pageId === 'home') {
    document.getElementById('nl-home').classList.add('active');
  } else if (pageId.startsWith('store') || pageId.startsWith('food')) {
    document.getElementById('nl-menu').classList.add('active');
  }
}


// ---- Store page builder ----

function buildStore(sid) {
  const s = STORES[sid];
  const el = document.getElementById('page-store-' + sid);
  if (!el || el.dataset.built) return;
  el.dataset.built = '1';

  if (!s.open) {
    el.innerHTML = `
      <div class="store-layout">
        ${buildSidebar(sid)}
        <div class="store-main" style="display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:80px 40px">
          <div style="font-size:72px;margin-bottom:20px">${s.emoji}</div>
          <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:28px;margin-bottom:8px">${s.name}</div>
          <div style="display:inline-flex;align-items:center;gap:6px;background:#FEE2E2;color:#B91C1C;padding:6px 14px;border-radius:100px;font-size:12px;font-weight:600;margin-bottom:16px">● Currently Closed</div>
          <div style="color:var(--text-secondary);max-width:400px;margin-bottom:28px">${s.desc} Opens again tomorrow at 7:00 AM.</div>
          <div style="display:flex;gap:12px">
            <button class="btn-primary" onclick="go('home')">Browse Other Vendors</button>
            <button class="btn-secondary">Set Opening Reminder</button>
          </div>
        </div>
        <div class="store-right-panel">
          <div style="font-size:13px;color:var(--text-muted);padding-top:20px">Unavailable while closed.</div>
        </div>
      </div>`;
    return;
  }

  const items = STORE_ITEMS[sid] || [];

  const itemsHTML = items.map(item => `
    <div class="menu-item" onclick="go('food-${item.id}')">
      <div class="mi-img" style="background:${item.bg}">
        ${item.emoji}
        <div class="mi-price">${item.price}</div>
        ${item.veg ? '<div class="mi-veg">🌱</div>' : ''}
      </div>
      <div class="mi-body">
        <div class="mi-name">${item.name}</div>
        <div class="mi-type">${item.type}</div>
        <div class="macros">
          <div class="macro"><strong>${item.protein}g</strong>PROTEIN</div>
          <div class="macro"><strong>${item.carbs}g</strong>CARBS</div>
          <div class="macro"><strong>${item.energy}</strong>ENERGY</div>
        </div>
      </div>
    </div>`).join('');

  const tabsHTML = (s.tabs || []).map((t, i) =>
    `<button class="menu-tab${i === 0 ? ' active' : ''}" onclick="setTab(this)">${t}</button>`
  ).join('');

  const donutHTML = s.donut ? `
    <div class="donut" style="background:${s.donut}"><div class="donut-hole"></div></div>
    <div class="legend">
      ${(s.donutLegend || []).map(l => `
        <div class="legend-item">
          <div class="legend-dot" style="background:${l[0]}"></div>
          ${l[1]}
        </div>`).join('')}
    </div>
    ${(s.stats || []).map(st => st[2]
      ? `<div class="ns"><span>${st[0]}</span><span style="background:${st[2]};color:${st[3]};padding:2px 8px;border-radius:6px;font-size:12px">${st[1]}</span></div>`
      : `<div class="ns"><span>${st[0]}</span><span>${st[1]}</span></div>`
    ).join('')}
    <div style="margin-top:14px;padding:12px;background:var(--bg);border-radius:10px;font-size:12px;color:var(--text-secondary);line-height:1.5;font-style:italic">${s.quote || ''}</div>
  ` : '';

  el.innerHTML = `
    <div class="store-layout">
      ${buildSidebar(sid)}
      <div class="store-main">
        <div class="bc-row" style="margin-bottom:20px">
          <span class="bc" onclick="go('home')">Campus</span> ›
          <span class="bc">Canteen B</span> ›
          <span class="bc-cur">${s.name}</span>
        </div>
        <div class="store-hdr">
          <div>
            <div class="store-name-big">${s.title.replace('\n', '<br>')}</div>
            <div class="status-open">● Accepting Orders</div>
            <div class="store-desc-txt">${s.desc}</div>
          </div>
          <div style="display:flex;gap:10px">
            <button class="btn-secondary" style="font-size:13px;padding:10px 18px">Today's Menu</button>
            <button class="btn-primary"   style="font-size:13px;padding:10px 18px">Tomorrow's Preview</button>
          </div>
        </div>
        <div class="menu-tabs">${tabsHTML}</div>
        <div class="menu-grid">${itemsHTML}</div>
        <div class="pers-banner">
          <div style="display:flex;align-items:center;gap:16px">
            <div style="font-size:28px">${s.persIcon}</div>
            <div>
              <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:16px;margin-bottom:4px">${s.persTitle}</div>
              <div style="font-size:13px;color:var(--text-secondary)">${s.persDesc}</div>
            </div>
          </div>
          <button class="btn-secondary" style="font-size:13px;padding:10px 18px;white-space:nowrap">${s.persBtnTxt}</button>
        </div>
      </div>
      <div class="store-right-panel">
        <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:15px;margin-bottom:4px">📊 ${s.name} Summary</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">Average nutritional profile per meal</div>
        ${donutHTML}
      </div>
    </div>`;
}

function buildSidebar(activeSid) {
  const order = ['hrb', 'pp', 'ww', 'dd', 'pasta', 'zen'];

  const items = order.map(sid => {
    const s = STORES[sid];
    return `
      <div class="vli${sid === activeSid ? ' active' : ''}" onclick="go('store-${sid}')">
        <div class="vli-name">${s.name}</div>
        <div class="vli-sub">
          <span>⭐ ${s.rating}</span>
          <span>${s.tag}</span>
          ${s.open ? `<span>${s.wait || ''}</span>` : '<span class="closed-dot">● Closed</span>'}
        </div>
      </div>`;
  }).join('');

  return `
    <div class="store-sidebar">
      <div class="sb-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input placeholder="Search vendors...">
      </div>
      ${items}
      <div style="margin-top:20px;padding:12px;background:var(--bg);border-radius:10px;border:1px solid var(--border)">
        <div style="font-size:12px;font-weight:700;color:var(--text-muted);margin-bottom:6px">⏰ Canteen Hours</div>
        <div style="font-size:13px;color:var(--text-secondary);font-weight:600">07:00 AM – 09:30 PM</div>
      </div>
    </div>`;
}


// ---- Food detail page builder ----

function buildFood(fid) {
  const f = FOODS[fid];
  if (!f) return;

  const el = document.getElementById('page-food-' + fid);
  if (!el || el.dataset.built) return;
  el.dataset.built = '1';

  const storeName = STORES[f.storeId]?.name || f.storeId;

  el.innerHTML = `
    <div class="detail-top-bar">
      <div class="bc-row">
        <span class="bc" onclick="go('home')">Back to Menu</span> ›
        <span class="bc" onclick="go('store-${f.storeId}')">${storeName}</span> ›
        <span class="bc-cur">${f.name}</span>
      </div>
    </div>

    <div class="detail-layout">
      <div>
        <div class="detail-img">${f.emoji}</div>
        <div class="food-tags">
          ${f.tags.map(t => `<div class="food-tag">${t}</div>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <h3 style="font-size:18px;font-weight:700">Product Description</h3>
          <div style="display:flex;gap:14px;font-size:13px;color:var(--text-secondary)">
            <span>⏱ ${f.prepTime}</span>
            ${f.vegan ? '<span style="color:var(--green)">🌱 Vegan Available</span>' : ''}
          </div>
        </div>
        <div class="detail-desc">${f.desc}</div>
        <div class="detail-sections">
          <div>
            <h4 style="font-size:15px;font-weight:700;margin-bottom:12px">🌿 Ingredients</h4>
            <div class="ing-tags">
              ${f.ingredients.map(i => `<div class="ing-tag">${i}</div>`).join('')}
            </div>
          </div>
          <div>
            <h4 style="font-size:15px;font-weight:700;margin-bottom:12px">⚠️ Allergen Information</h4>
            <div class="allergen-box">${f.allergen}</div>
          </div>
        </div>
      </div>

      <div class="detail-right">
        <a class="store-lnk" onclick="go('store-${f.storeId}')">🍀 ${storeName}</a>
        <div class="detail-name-h">${f.name}</div>
        <div class="portion-lbl">Portion Size: ${f.portion}</div>
        <div class="detail-price-h">${f.price} <small>/ per serving</small></div>

        <div class="nutr-card">
          <div class="nutr-hdr">
            <h4>🔥 Nutritional Breakdown</h4>
            <div class="kcal-lbl">${f.kcal} kcal</div>
          </div>
          <div class="mb-row">
            <div class="mb-lbl"><span>Protein</span><span style="font-weight:700">${f.protein}g</span></div>
            <div class="bar-track"><div class="bar-fill" style="width:${f.proteinPct}%;background:var(--primary)"></div></div>
          </div>
          <div class="mb-row">
            <div class="mb-lbl"><span>Carbs</span><span style="font-weight:700">${f.carbs}g</span></div>
            <div class="bar-track"><div class="bar-fill" style="width:${f.carbsPct}%;background:var(--green)"></div></div>
          </div>
          <div class="mb-row">
            <div class="mb-lbl"><span>Fats</span><span style="font-weight:700">${f.fat}g</span></div>
            <div class="bar-track"><div class="bar-fill" style="width:${f.fatPct}%;background:#F59E0B"></div></div>
          </div>
        </div>

        <div class="qty-row">
          <span style="font-size:14px;font-weight:500;color:var(--text-secondary)">Quantity</span>
          <div class="qty-ctrl">
            <button class="qty-btn" onclick="changeQty(this, -1)">−</button>
            <div class="qty-v">1</div>
            <button class="qty-btn" onclick="changeQty(this, 1)">+</button>
          </div>
        </div>

        <button class="add-cart-btn" onclick="go('checkout')">Add to Cart • ${f.price}</button>
        <div class="detail-action-btns">
          <button class="btn-outline">📅 Add to Plan</button>
          <button class="btn-outline">🔔 Set Reminder</button>
        </div>
        <div class="budget-note">Fits your daily budget of ${f.budget} left.</div>
        <div class="health-card">
          <div class="health-title">🌿 Health Insight</div>
          <div class="health-text">${f.insight}</div>
        </div>
      </div>
    </div>

    <div class="related-section">
      <div style="font-family:'Syne',sans-serif;font-size:22px;font-weight:700;margin-bottom:4px">More from ${storeName}</div>
      <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-muted);margin-bottom:20px">
        <span>Recommended pairings and sides for your meal.</span>
        <a style="color:var(--primary);font-weight:600;cursor:pointer" onclick="go('store-${f.storeId}')">View Store Menu →</a>
      </div>
      <div class="related-grid">
        ${f.related.map(r => `
          <div class="rc" onclick="go('food-${r.id}')">
            <div class="rc-img">${r.emoji}</div>
            <div class="rc-body">
              <div class="rc-name">${r.name}</div>
              <div class="rc-cal">${r.cal}</div>
              <div class="rc-price">${r.price}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}


// ---- UI interactions ----

function filterVC(chip, cat) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');

  document.querySelectorAll('.vendor-card').forEach(card => {
    const matches = cat === 'all' || (card.dataset.cat || '').includes(cat);
    card.style.display = matches ? '' : 'none';
  });
}

function setTab(tab) {
  tab.closest('.menu-tabs').querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
}

function selStation(opt) {
  opt.closest('.station-opts').querySelectorAll('.station-opt').forEach(o => o.classList.remove('selected'));
  opt.classList.add('selected');
}

function selPay(opt) {
  const card = opt.closest('.pay-card');

  card.querySelectorAll('.pay-opt').forEach(o => {
    o.classList.remove('selected');
    const ro = o.querySelector('.radio-out');
    ro.classList.remove('checked');
    const ri = ro.querySelector('.radio-in');
    if (ri) ri.remove();
  });

  opt.classList.add('selected');
  const ro = opt.querySelector('.radio-out');
  ro.classList.add('checked');
  const ri = document.createElement('div');
  ri.className = 'radio-in';
  ro.appendChild(ri);
}

function changeQty(btn, delta) {
  const v = btn.closest('.qty-ctrl').querySelector('.qty-v');
  let n = parseInt(v.textContent) + delta;
  n = Math.max(1, Math.min(99, n));
  v.textContent = n;
}
