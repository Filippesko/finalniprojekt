
const API_KEY = '3334dd39212241329a55761e7b882bd2';
const BASE = 'https://api.spoonacular.com';


const INGS = [
  {name:'vejce',en:'egg',e:'🥚',cat:'Základní'},{name:'mléko',en:'milk',e:'🥛',cat:'Základní'},
  {name:'máslo',en:'butter',e:'🧈',cat:'Základní'},{name:'mouka',en:'flour',e:'🌾',cat:'Základní'},
  {name:'cukr',en:'sugar',e:'🍬',cat:'Základní'},{name:'sůl',en:'salt',e:'🧂',cat:'Základní'},
  {name:'olivový olej',en:'olive oil',e:'🫒',cat:'Základní'},
  {name:'česnek',en:'garlic',e:'🧄',cat:'Zelenina'},{name:'cibule',en:'onion',e:'🧅',cat:'Zelenina'},
  {name:'rajče',en:'tomato',e:'🍅',cat:'Zelenina'},{name:'brambory',en:'potato',e:'🥔',cat:'Zelenina'},
  {name:'mrkev',en:'carrot',e:'🥕',cat:'Zelenina'},{name:'špenát',en:'spinach',e:'🍃',cat:'Zelenina'},
  {name:'brokolice',en:'broccoli',e:'🥦',cat:'Zelenina'},{name:'paprika',en:'pepper',e:'🫑',cat:'Zelenina'},
  {name:'okurka',en:'cucumber',e:'🥒',cat:'Zelenina'},{name:'avokádo',en:'avocado',e:'🥑',cat:'Zelenina'},
  {name:'houby',en:'mushroom',e:'🍄',cat:'Zelenina'},{name:'kukuřice',en:'corn',e:'🌽',cat:'Zelenina'},
  {name:'lilek',en:'eggplant',e:'🍆',cat:'Zelenina'},{name:'cuketa',en:'zucchini',e:'🥬',cat:'Zelenina'},
  {name:'citron',en:'lemon',e:'🍋',cat:'Ovoce'},{name:'jablko',en:'apple',e:'🍎',cat:'Ovoce'},
  {name:'banán',en:'banana',e:'🍌',cat:'Ovoce'},{name:'pomeranč',en:'orange',e:'🍊',cat:'Ovoce'},
  {name:'jahody',en:'strawberries',e:'🍓',cat:'Ovoce'},
  {name:'kuřecí maso',en:'chicken',e:'🍗',cat:'Maso'},{name:'hovězí maso',en:'beef',e:'🥩',cat:'Maso'},
  {name:'vepřové maso',en:'pork',e:'🐷',cat:'Maso'},{name:'slanina',en:'bacon',e:'🥓',cat:'Maso'},
  {name:'krevety',en:'shrimp',e:'🍤',cat:'Ryby'},{name:'losos',en:'salmon',e:'🐟',cat:'Ryby'},
  {name:'tuňák',en:'tuna',e:'🐠',cat:'Ryby'},{name:'treska',en:'cod',e:'🐡',cat:'Ryby'},
  {name:'těstoviny',en:'pasta',e:'🍝',cat:'Sacharidy'},{name:'rýže',en:'rice',e:'🍚',cat:'Sacharidy'},
  {name:'chleba',en:'bread',e:'🍞',cat:'Sacharidy'},{name:'fazole',en:'beans',e:'🫘',cat:'Sacharidy'},
  {name:'čočka',en:'lentils',e:'🥣',cat:'Sacharidy'},{name:'cizrna',en:'chickpeas',e:'🟡',cat:'Sacharidy'},
  {name:'quinoa',en:'quinoa',e:'🌾',cat:'Sacharidy'},
  {name:'sýr',en:'cheese',e:'🧀',cat:'Mléčné'},{name:'jogurt',en:'yogurt',e:'🥣',cat:'Mléčné'},
  {name:'smetana',en:'cream',e:'🥛',cat:'Mléčné'},{name:'tvaroh',en:'cottage cheese',e:'⬜',cat:'Mléčné'},
  {name:'med',en:'honey',e:'🍯',cat:'Dochucovadla'},{name:'sójová omáčka',en:'soy sauce',e:'🍶',cat:'Dochucovadla'},
  {name:'ocet',en:'vinegar',e:'🥢',cat:'Dochucovadla'},{name:'paprika koření',en:'paprika',e:'🌶️',cat:'Dochucovadla'},
  {name:'hořčice',en:'mustard',e:'🟡',cat:'Dochucovadla'},{name:'kečup',en:'ketchup',e:'🍅',cat:'Dochucovadla'},
];
const CATS = ['Vše','Základní','Zelenina','Ovoce','Maso','Ryby','Sacharidy','Mléčné','Dochucovadla'];

let selected = [], activeCat = 'Vše', prevPage = 'search';
let favorites  = JSON.parse(localStorage.getItem('sc_fav')    || '[]');
let expiryList = JSON.parse(localStorage.getItem('sc_expiry') || '[]');

const $  = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const stripTags = h => h.replace(/<[^>]*>/g,'');
async function apiFetch(url) {
  if (!navigator.onLine) throw new Error('📡 Jste offline. Zkontrolujte připojení.');
  const r = await fetch(url).catch(() => { throw new Error('📡 Jste offline. Zkontrolujte připojení.'); });
  if (!r.ok) { const e = await r.json().catch(()=>{}); throw new Error(e?.message || `HTTP ${r.status}`); }
  const data = await r.json();
  if (data.message) throw new Error(data.message); // catches SW offline JSON
  return data;
}

function notify(msg) {
  const n = $('notif');
  n.textContent = msg;
  n.classList.add('show');
  clearTimeout(n._t);
  n._t = setTimeout(() => n.classList.remove('show'), 2500);
}

function showError(id, e) {
  $(id).innerHTML = `<div class="empty"><span class="empty-icon">⚠️</span><p>Chyba při načítání.<br><small>${e?.message||'Zkontroluj API klíč.'}</small></p></div>`;
}

function tab(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  $(id).classList.remove('hidden');
  document.querySelectorAll('.nt').forEach(t => t.classList.toggle('active', t.dataset.tab === id));
  document.querySelector('.nav-tabs').classList.remove('open');
  if (id === 'favorites') renderFavs();
  if (id === 'audit')     renderAudit();
}

document.querySelectorAll('.nt[data-tab]').forEach(b => b.addEventListener('click', () => tab(b.dataset.tab)));
$('menu-btn').addEventListener('click', () => document.querySelector('.nav-tabs').classList.toggle('open'));

document.querySelectorAll('.mp').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.mp').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.mode-panel').forEach(p => p.classList.add('hidden'));
  btn.classList.add('active');
  $('mode-' + btn.dataset.mode).classList.remove('hidden');
}));

function renderCats() {
  $('cat-tabs').innerHTML = CATS.map(c =>
    `<button class="ct${c===activeCat?' active':''}" data-cat="${c}">${c}</button>`
  ).join('');
  document.querySelectorAll('.ct').forEach(b => b.addEventListener('click', () => {
    activeCat = b.dataset.cat; renderCats(); renderIng();
  }));
}

function renderIng() {
  const q = $('ing-search').value.toLowerCase();
  const list = INGS.filter(i => (activeCat==='Vše'||i.cat===activeCat) && (!q||i.name.toLowerCase().includes(q)||i.en.includes(q)));
  $('ingredient-grid').innerHTML = list.map(i =>
    `<div class="ing-item${selected.includes(i.en)?' active':''}" data-en="${i.en}">
      <span class="ing-emoji">${i.e}</span>
      <div class="ing-name">${i.name}</div>
    </div>`
  ).join('') || `<div class="empty" style="grid-column:1/-1"><span class="empty-icon">🔍</span><p>Nenalezeno.</p></div>`;
  document.querySelectorAll('.ing-item').forEach(el => el.addEventListener('click', () => toggleIng(el.dataset.en)));
}

$('ing-search').addEventListener('input', renderIng);

function toggleIng(en) {
  selected = selected.includes(en) ? selected.filter(x => x!==en) : [...selected, en];
  renderIng(); renderChips();
}

function renderChips() {
  $('find-btn').disabled = !selected.length;
  $('chips').innerHTML = selected.length
    ? selected.map(en => { const i = INGS.find(x=>x.en===en); return `<div class="chip">${i?.e||''} ${i?.name||en}<button data-en="${en}">×</button></div>`; }).join('')
    : '<span class="sel-hint">Nic nevybráno</span>';
  $('chips').querySelectorAll('button').forEach(b => b.addEventListener('click', () => toggleIng(b.dataset.en)));
}

$('clear-btn').addEventListener('click', () => { selected = []; renderIng(); renderChips(); });

function showResultsPage(title, meta) {
  $('results-title').textContent = title;
  $('results-meta').textContent  = meta;
  $('results-grid').innerHTML    = '<div class="loader"><div class="spinner"></div><p>Hledám recepty…</p></div>';
  $('results-back').onclick = () => tab(prevPage);
  tab('results');
}

function renderCards(list, containerId='results-grid') {
  const grid = $(containerId);
  if (!list.length) { grid.innerHTML = `<div class="empty"><span class="empty-icon">🍽️</span><p>Žádné recepty.</p></div>`; return; }
  grid.innerHTML = list.map(r => {
    const fav = favorites.some(f => f.id===r.id);
    return `<div class="rcard" data-id="${r.id}">
      ${r.image ? `<img src="${r.image}" alt="${esc(r.title)}" loading="lazy">` : `<div class="rimg-ph">🍲</div>`}
      <div class="rbody">
        <h3>${esc(r.title)}</h3>
        <div class="rtags">
          ${r.usedCount!=null?`<span class="tag tg">✓ ${r.usedCount}</span>`:''}
          ${r.missCount>0?`<span class="tag ta">+${r.missCount} chybí</span>`:''}
          ${r.calories?`<span class="tag ta">⚡ ${r.calories} kcal</span>`:''}
          ${r.protein?`<span class="tag tg">💪 ${r.protein}g</span>`:''}
        </div>
        <div class="rmeta">
          <span>Klikni pro detail</span>
          <button class="fav-btn" data-id="${r.id}" data-title="${esc(r.title)}" data-img="${r.image||''}">${fav?'❤️':'🤍'}</button>
        </div>
      </div>
    </div>`;
  }).join('');
  grid.querySelectorAll('.rcard').forEach(c => c.addEventListener('click', e => { if (!e.target.closest('.fav-btn')) openDetail(+c.dataset.id); }));
  grid.querySelectorAll('.fav-btn').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    toggleFav(+b.dataset.id, b.dataset.title, b.dataset.img);
    b.textContent = favorites.some(f=>f.id===+b.dataset.id) ? '❤️' : '🤍';
  }));
}

$('find-btn').addEventListener('click', async () => {
  if (!selected.length) return;
  prevPage = 'search';
  showResultsPage('Recepty podle ingrediencí', selected.slice(0,3).join(', ') + (selected.length>3?'…':''));
  try {
    const data = await apiFetch(`${BASE}/recipes/findByIngredients?ingredients=${selected.join(',')}&number=12&ranking=1&ignorePantry=true&apiKey=${API_KEY}`);
    $('results-meta').textContent = `${data.length} nalezeno`;
    renderCards(data.map(r => ({id:r.id,title:r.title,image:r.image,usedCount:r.usedIngredientCount,missCount:r.missedIngredientCount})));
  } catch(e) { showError('results-grid', e); }
});

$('find-nutri-btn').addEventListener('click', async () => {
  prevPage = 'search';
  const p = new URLSearchParams({minCalories:$('min-cal').value||0,maxCalories:$('max-cal').value||99999,minProtein:$('min-prot').value||0,maxFat:$('max-fat').value||99999,number:$('num-res').value,apiKey:API_KEY});
  showResultsPage('Výsledky podle nutricí', '');
  try {
    const data = await apiFetch(`${BASE}/recipes/findByNutrients?${p}`);
    $('results-meta').textContent = `${data.length} nalezeno`;
    renderCards(data.map(r => ({id:r.id,title:r.title,image:r.image,calories:r.calories,protein:r.protein})));
  } catch(e) { showError('results-grid', e); }
});

$('find-name-btn').addEventListener('click', findByName);
$('name-q').addEventListener('keydown', e => e.key==='Enter' && findByName());
async function findByName() {
  const q = $('name-q').value.trim(); if (!q) return;
  prevPage = 'search';
  const p = new URLSearchParams({query:q,number:12,apiKey:API_KEY});
  if ($('cuisine').value)  p.append('cuisine', $('cuisine').value);
  if ($('mealtype').value) p.append('type',    $('mealtype').value);
  showResultsPage(`„${q}"`, '');
  try {
    const data = await apiFetch(`${BASE}/recipes/complexSearch?${p}`);
    $('results-meta').textContent = `${data.results.length} nalezeno`;
    renderCards(data.results.map(r => ({id:r.id,title:r.title,image:r.image})));
  } catch(e) { showError('results-grid', e); }
}

async function openDetail(id) {
  const from = document.querySelector('.page:not(.hidden)')?.id || 'results';
  if (from !== 'detail') prevPage = from;
  $('detail-back-btn').onclick = () => tab(prevPage);
  $('detail-content').innerHTML = '<div class="loader"><div class="spinner"></div><p>Načítám recept…</p></div>';
  tab('detail');
  try {
    const d = await apiFetch(`${BASE}/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=false`);
    const fav = favorites.some(f=>f.id===id);
    const steps = d.analyzedInstructions?.[0]?.steps || [];
    $('detail-content').innerHTML = `
      ${d.image?`<img src="${d.image}" alt="${esc(d.title)}" class="detail-img">`:''}
      <div class="detail-top">
        <h1 class="detail-title">${esc(d.title)}</h1>
        <button class="detail-fav-btn" id="dfav">${fav?'❤️':'🤍'}</button>
      </div>
      <div class="dbadges">
        ${d.readyInMinutes?`<span class="badge bda">⏱ ${d.readyInMinutes} min</span>`:''}
        ${d.servings?`<span class="badge bdg">🍽 ${d.servings} porcí</span>`:''}
        ${d.vegetarian?'<span class="badge bdg">🌱 Vegetariánský</span>':''}
        ${d.vegan?'<span class="badge bdg">🌿 Veganský</span>':''}
        ${d.glutenFree?'<span class="badge bda">🌾 Bez lepku</span>':''}
        ${d.dairyFree?'<span class="badge bda">🥛 Bez laktózy</span>':''}
      </div>
      <div class="detail-cols">
        <div>
          <div class="sec-title">Ingredience</div>
          <ul class="ing-list">${(d.extendedIngredients||[]).map(i=>`<li>${esc(i.original)}</li>`).join('')}</ul>
        </div>
        <div>
          <div class="sec-title">Postup</div>
          ${steps.length
            ? steps.map(s=>`<div class="step"><div class="snum">${s.number}</div><div class="stext">${esc(s.step)}</div></div>`).join('')
            : `<p class="stext">${d.instructions?stripTags(d.instructions):'Postup není k dispozici.'}</p>`}
        </div>
      </div>`;
    $('dfav').addEventListener('click', () => {
      toggleFav(d.id, d.title, d.image||'');
      $('dfav').textContent = favorites.some(f=>f.id===d.id) ? '❤️' : '🤍';
    });
  } catch(e) {
    $('detail-content').innerHTML = `<div class="empty"><span class="empty-icon">⚠️</span><p>Recept se nepodařilo načíst.<br><small>${e.message}</small></p></div>`;
  }
}

function toggleFav(id, title, image) {
  const idx = favorites.findIndex(f=>f.id===id);
  idx>=0 ? favorites.splice(idx,1) : favorites.push({id,title,image});
  notify(idx>=0 ? 'Odebráno z oblíbených' : 'Přidáno do oblíbených ❤️');
  localStorage.setItem('sc_fav', JSON.stringify(favorites));
  if (!$('favorites').classList.contains('hidden')) renderFavs();
}

function renderFavs() {
  if (!favorites.length) {
    $('fav-grid').innerHTML = `<div class="empty"><span class="empty-icon">🤍</span><p>Žádné oblíbené recepty.</p></div>`;
  } else renderCards(favorites, 'fav-grid');
}

function populateExpSelect() {
  $('exp-ing').innerHTML = '<option value="">-- Vyber ingredienci --</option>' +
    INGS.map(i=>`<option value="${i.en}">${i.e} ${i.name}</option>`).join('');
}

$('add-expiry-btn').addEventListener('click', addExpiry);
$('exp-days').addEventListener('keydown', e => e.key==='Enter' && addExpiry());

function addExpiry() {
  const en = $('exp-ing').value, days = parseInt($('exp-days').value);
  if (!en) return notify('Vyber ingredienci');
  if (isNaN(days)||days<0) return notify('Zadej platný počet dnů');
  if (expiryList.find(x=>x.en===en)) return notify('Tato ingredience už je v seznamu');
  const ing = INGS.find(i=>i.en===en);
  expiryList.push({en, name:ing.name, emoji:ing.e, days});
  expiryList.sort((a,b)=>a.days-b.days);
  saveExpiry(); $('exp-days').value=''; $('exp-ing').value=''; renderAudit();
}

function removeExpiry(en) { expiryList=expiryList.filter(x=>x.en!==en); saveExpiry(); renderAudit(); }
function clearAudit()     { expiryList=[]; saveExpiry(); $('audit-results').innerHTML=''; renderAudit(); }
function saveExpiry()     { localStorage.setItem('sc_expiry', JSON.stringify(expiryList)); }

function urgencyClass(d) { return d<=2?'urgent':d<=5?'soon':'ok'; }
function urgencyLabel(d) { return d===0?'Dnes!':d===1?'Zítra':`${d} ${d<=4?'dny':'dní'}`; }

function renderAudit() {
  $('audit-find-btn').disabled = !expiryList.length;
  $('audit-items').innerHTML = expiryList.length
    ? expiryList.map(item=>`
        <div class="audit-item">
          <div class="audit-emoji">${item.emoji}</div>
          <div class="audit-name">${esc(item.name)}</div>
          <span class="audit-days ${urgencyClass(item.days)}">${urgencyLabel(item.days)}</span>
          <button class="audit-remove" data-en="${item.en}">×</button>
        </div>`).join('')
    : '<p class="audit-empty">Žádné ingredience. Přidej co máš v lednici ↑</p>';
  $('audit-items').querySelectorAll('.audit-remove').forEach(b => b.addEventListener('click', ()=>removeExpiry(b.dataset.en)));
}

$('audit-find-btn').addEventListener('click', async () => {
  const urgent = expiryList.filter(x=>x.days<=5).map(x=>x.en);
  const toSearch = urgent.length ? urgent : expiryList.map(x=>x.en);
  $('audit-results').innerHTML = '<div class="loader"><div class="spinner"></div><p>Hledám záchranné recepty…</p></div>';
  try {
    const data = await apiFetch(`${BASE}/recipes/findByIngredients?ingredients=${toSearch.join(',')}&number=9&ranking=1&ignorePantry=true&apiKey=${API_KEY}`);
    if (!data.length) { $('audit-results').innerHTML=`<div class="empty"><span class="empty-icon">😔</span><p>Žádné recepty.</p></div>`; return; }
    $('audit-results').innerHTML = `
      <div class="audit-results-title"><h2 class="serif">Uvař to <em style="color:var(--green);font-style:italic">dnes</em></h2><span>${data.length} receptů</span></div>
      <div class="card-grid" id="audit-card-grid"></div>`;
    prevPage = 'audit';
    renderCards(data.map(r=>({id:r.id,title:r.title,image:r.image,usedCount:r.usedIngredientCount,missCount:r.missedIngredientCount})),'audit-card-grid');
  } catch(e) { showError('audit-results', e); }
});

$('clear-audit-btn').addEventListener('click', clearAudit);

// SERVICE WORKER
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(()=>{}));
}

// INIT
renderCats(); renderIng(); renderChips(); populateExpSelect(); renderAudit();

