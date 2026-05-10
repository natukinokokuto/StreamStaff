const STORAGE_KEY = 'stream_manager_start_v1';

const initialState = {
  page: 'home',
  game: 'animal',
  result: '🎲 メニューからゲームを選んで「回す」を押す',
  trunk: '今日のメインテーマ',
  branch: '脱線できる話題',
  leaf: 'リスナーが食いついたポイント',
  listeners: [
    { name: 'ジャック', days: [1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,29,30,31], memo: 'ほぼ皆勤。強い常連。' },
    { name: 'くる', days: [1,2,3,5,6,7,8,9,10,11,12,13,14,15,16,18,20,21,22,23,24,25,26,29,30,31], memo: 'ログボ管理対象。' },
    { name: 'サクマ', days: [5,6,7,8,9,10,11,12,13,14,16,21,24,25,27,29,30], memo: 'まばら参加。' },
  ],
  selectedListener: 0,
  logs: []
};

const gameData = {
  animal: ['🐾 猫 × 冬に使うもの', '🐾 ゴリラ × 簡単にできる料理', '🐾 犬 × 昔流行ったもの', '🐾 ハト × 配信で起きがちなこと'],
  ogiri: ['🧠 絶対に盛り上がらないイベント名', '🧠 深夜のコンビニ店員が急に言いそうな一言', '🧠 猫が配信者だった時の初見挨拶'],
  line: ['🎭 ちょっと待って、話の枝が折れた。', '🎭 それはもう、ほぼ事件じゃん。', '🎭 いま誰がこの空気の責任取るの？'],
  itsu: ['🧩 昨日 猫が コンビニで 急に歌い出した', '🧩 今日 常連が 配信画面の裏で 名言っぽいことを言った', '🧩 夜に 初見さんが ダーツバーで コメント欄を凍らせた'],
  bob: ['📘 ボブジテン：ガソリン ※カタカナ禁止', '📘 ボブジテン：エンジン ※カタカナ禁止', '📘 ボブジテン：ジュース ※カタカナ禁止'],
  relo: ['🍻 レロレロ酒場：マーボー豆腐', '🍻 レロレロ酒場：だし巻きたまご', '🍻 レロレロ酒場：軟骨のから揚げ'],
  chin: ['🎲 チンチロ：1・2・3', '🎲 チンチロ：4・5・6', '🎲 チンチロ：6・6・6']
};

let state = load();
const screen = document.getElementById('screen');

function load(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialState; }
  catch { return initialState; }
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function esc(str){ return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function setPage(page){ state.page = page; save(); render(); }

function render(){
  document.querySelectorAll('.bottom-nav button').forEach(btn => btn.classList.toggle('active', btn.dataset.page === state.page));
  const pages = { home: renderHome, games: renderGames, bonus: renderBonus, listeners: renderListeners, logs: renderLogs };
  screen.innerHTML = pages[state.page]();
  bindEvents();
}

function renderHome(){
  return `
    <section class="card">
      <h2>✅ 起動OK</h2>
      <p>これはまず白画面を潰すための最小版。Reactもビルドも使わないから、GitHub Pagesでもそのまま開ける。</p>
      <p class="muted">次にここへ本格機能を1個ずつ足していく。</p>
    </section>
    <section class="card">
      <h2>配信の樹</h2>
      <input id="trunk" class="input" value="${esc(state.trunk)}" placeholder="幹：今日のテーマ">
      <br><br>
      <input id="branch" class="input" value="${esc(state.branch)}" placeholder="枝：脱線ネタ">
      <br><br>
      <input id="leaf" class="input" value="${esc(state.leaf)}" placeholder="葉：反応ポイント">
    </section>
    <section class="menu-grid">
      <button class="menu-btn" data-jump="games"><strong>🎲 ゲーム</strong><span>動物・大喜利・セリフなど</span></button>
      <button class="menu-btn" data-jump="bonus"><strong>🎁 ログボ</strong><span>31日チェック管理</span></button>
      <button class="menu-btn" data-jump="listeners"><strong>👥 常連</strong><span>リスナーメモ</span></button>
      <button class="menu-btn" data-jump="logs"><strong>📝 ログ</strong><span>配信メモ保存</span></button>
    </section>`;
}

function renderGames(){
  const games = [['animal','動物'],['ogiri','大喜利'],['line','セリフ'],['itsu','いつ誰'],['bob','ボブ'],['relo','酒場'],['chin','チンチロ']];
  return `
    <section class="card">
      <h2>ゲーム選択</h2>
      <div class="chips">${games.map(([id,label])=>`<button class="chip ${state.game===id?'active':''}" data-game="${id}">${label}</button>`).join('')}</div>
    </section>
    <section class="card">
      <p class="muted">配信中にそのまま読む</p>
      <div class="result">${esc(state.result)}</div>
      <button class="main-btn" id="roll">回す</button>
    </section>
    <section class="card">
      <h2>ログ保存</h2>
      <textarea id="logText" class="textarea" placeholder="盛り上がった反応、次回の伏線など"></textarea>
      <br><br><button class="main-btn" id="saveLog">この結果を保存</button>
    </section>`;
}

function renderBonus(){
  const l = state.listeners[state.selectedListener] || state.listeners[0];
  return `
    <section class="card">
      <h2>ログボ管理</h2>
      <div class="chips">${state.listeners.map((x,i)=>`<button class="chip ${i===state.selectedListener?'active':''}" data-listener="${i}">${esc(x.name)}</button>`).join('')}</div>
      <p class="muted">${esc(l.name)}：${l.days.length}/31日</p>
    </section>
    <section class="card"><div class="calendar">
      ${Array.from({length:31},(_,i)=>i+1).map(day=>`<button class="day ${l.days.includes(day)?'on':''}" data-day="${day}">${day}</button>`).join('')}
    </div></section>`;
}

function renderListeners(){
  return `
    <section class="card"><h2>常連メモ</h2><button class="main-btn" id="addListener">リスナー追加</button></section>
    ${state.listeners.map((l,i)=>`<section class="card"><h2>${esc(l.name)}</h2><p class="muted">参加 ${l.days.length}/31日</p><textarea class="textarea memo" data-memo="${i}">${esc(l.memo || '')}</textarea></section>`).join('')}`;
}

function renderLogs(){
  return `
    <section class="card"><h2>配信ログ</h2><p class="muted">保存数：${state.logs.length}</p>${state.logs.length?'<button class="main-btn danger" id="clearLogs">ログ全消し</button>':''}</section>
    ${state.logs.length ? state.logs.map(log=>`<section class="card"><p class="muted">${esc(log.date)}</p><h2>${esc(log.text)}</h2><p>${esc(log.result)}</p></section>`).join('') : '<section class="card"><p class="muted">まだログなし。</p></section>'}`;
}

function bindEvents(){
  document.querySelectorAll('.bottom-nav button').forEach(btn => btn.onclick = () => setPage(btn.dataset.page));
  document.querySelectorAll('[data-jump]').forEach(btn => btn.onclick = () => setPage(btn.dataset.jump));
  ['trunk','branch','leaf'].forEach(id => { const el=document.getElementById(id); if(el) el.oninput=()=>{state[id]=el.value; save();}; });
  document.querySelectorAll('[data-game]').forEach(btn => btn.onclick = () => { state.game = btn.dataset.game; save(); render(); });
  const roll = document.getElementById('roll'); if(roll) roll.onclick = () => { state.result = pick(gameData[state.game]); save(); render(); };
  const saveLog = document.getElementById('saveLog'); if(saveLog) saveLog.onclick = () => { const text=document.getElementById('logText').value.trim(); if(!text) return alert('ログ内容を入れてね'); state.logs.unshift({ date:new Date().toLocaleString('ja-JP'), text, result:state.result }); save(); setPage('logs'); };
  document.querySelectorAll('[data-listener]').forEach(btn => btn.onclick = () => { state.selectedListener = Number(btn.dataset.listener); save(); render(); });
  document.querySelectorAll('[data-day]').forEach(btn => btn.onclick = () => { const l=state.listeners[state.selectedListener]; const day=Number(btn.dataset.day); l.days = l.days.includes(day) ? l.days.filter(d=>d!==day) : [...l.days, day].sort((a,b)=>a-b); save(); render(); });
  document.querySelectorAll('[data-memo]').forEach(el => el.oninput = () => { state.listeners[Number(el.dataset.memo)].memo = el.value; save(); });
  const add = document.getElementById('addListener'); if(add) add.onclick = () => { const name=prompt('リスナー名'); if(!name) return; state.listeners.push({name,days:[],memo:''}); state.selectedListener = state.listeners.length - 1; save(); render(); };
  const clear = document.getElementById('clearLogs'); if(clear) clear.onclick = () => { if(confirm('ログを消す？')){ state.logs=[]; save(); render(); } };
}

render();
