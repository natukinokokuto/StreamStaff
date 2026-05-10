const KEY = 'stream_manager_pc_mobile_v2_touch';
const seed = {
  trunk: '今日のメインテーマを書く', branch: '脱線用の話題を書く', leaf: '食いついたポイントを書く',
  listeners: [
    { name: 'ジャック', days: [1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,29,30,31], memo: 'ほぼ皆勤。' },
    { name: 'くる', days: [1,2,3,5,6,7,8,9,10,11,12,13,14,15,16,18,20,21,22,23,24,25,26,29,30,31], memo: 'ログボ対象。' },
    { name: 'サクマ', days: [5,6,7,8,9,10,11,12,13,14,16,21,24,25,27,29,30], memo: 'まばら参加。' }
  ],
  logs: []
};
let data = load();
let currentGame = 'animal';
let lastResult = '左からゲームを選んでね';

const $ = (id) => document.getElementById(id);
const games = {
  animal: () => `🐾 ${pick(['猫','犬','ゾウ','牛','キツネ','ゴリラ','深夜のコンビニ店員'])} × 「${pick(['簡単にできる料理','昔流行ったもの','身につけるもの','虫の名前','冬に使うもの','配信で起きがちなこと'])}」といえば？`,
  ogiri: () => `🧠 大喜利：${pick(['絶対に盛り上がらないイベント名','猫が配信者だった時の初見挨拶','深夜のコンビニ店員が急に言いそうな一言','身につけるものっぽく一番くだらないことを言って'])}`,
  line: () => `🎭 セリフ：${pick(['分からない……何も思い出せない……。何で炊けた米が部屋中に塗りたくられてるんだ……！？','それはもう、ほぼ事件じゃん。','ちょっと待って、話の枝が折れた。','いま誰がこの空気の責任取るの？'])}`,
  itsu: () => `🧩 ${pick(['昨日','今日','朝','明日','去年','誕生日に'])} ${pick(['お母さんが','酔っ払いが','猫が','常連が','初見さんが'])} ${pick(['コンビニで','配信画面の裏で','公園で','ダーツバーで','風呂場で'])} ${pick(['急に歌い出した','米を炊きすぎた','名言っぽいことを言った','謎のルールを作った','コメント欄を凍らせた'])}`,
  bob: () => `📘 ボブジテン：${pick(['アクセル','エンジン','オイル','ガソリン','ガソリンスタンド','ガレージ','ジュース','ランプ'])} ※カタカナ禁止で説明`,
  relo: () => `🍻 レロレロ酒場：${pick(['マーボー豆腐','チャンジャ','鮭とば','たこわさ','だし巻きたまご','枝豆','焼きナス','冷やしトマト','もつ鍋','軟骨のから揚げ'])} を噛まずに言える？`,
  chin: () => { const d = [roll(), roll(), roll()]; return `🎲 チンチロ：${d.join('・')} / 合計 ${d.reduce((a,b)=>a+b,0)}`; }
};

function load(){ try { return JSON.parse(localStorage.getItem(KEY)) || structuredClone(seed); } catch { return structuredClone(seed); } }
function save(){ localStorage.setItem(KEY, JSON.stringify(data)); render(); }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function roll(){ return Math.ceil(Math.random()*6); }
function reward(n){ if(n>=31)return '皆勤賞：リアルグッズ or 通話券1時間'; if(n>=14)return '14日達成：個通30分'; if(n>=7)return '週達成：リング / ヘッダー / ロック / しめじ'; return 'まだ育成中'; }
function addLog(text){ data.logs.unshift({ date: new Date().toLocaleString('ja-JP'), text }); data.logs = data.logs.slice(0,50); save(); }
function safeTap(el, fn){ el.addEventListener('click', fn); }

function switchPage(pageId){
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.toggle('active', b.dataset.page === pageId));
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === pageId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function rollGame(){ lastResult = games[currentGame](); $('gameResult').textContent = lastResult; }
function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }

function render(){
  $('trunk').value = data.trunk; $('branch').value = data.branch; $('leaf').value = data.leaf;
  $('homeTrunk').textContent = data.trunk || '未設定'; $('logCount').textContent = data.logs.length; $('listenerCount').textContent = data.listeners.length;
  const currentIndex = Number($('listenerSelect').value || 0);
  $('listenerSelect').innerHTML = data.listeners.map((l,i)=>`<option value="${i}" ${i===currentIndex?'selected':''}>${escapeHtml(l.name)}</option>`).join('');
  const idx = Math.min(currentIndex, data.listeners.length - 1);
  const l = data.listeners[idx];
  if(l){
    $('selectedListenerName').textContent = l.name;
    $('rewardText').textContent = `${l.days.length}/31日：${reward(l.days.length)}`;
    $('dayGrid').innerHTML = Array.from({length:31},(_,i)=>i+1).map(day=>`<button type="button" class="day ${l.days.includes(day)?'on':''}" data-day="${day}">${day}</button>`).join('');
  }
  $('listenerCards').innerHTML = data.listeners.map((l,i)=>`<div class="card"><div class="listener-name">${escapeHtml(l.name)}</div><p class="reward">${l.days.length}/31日：${reward(l.days.length)}</p><textarea data-memo="${i}">${escapeHtml(l.memo||'')}</textarea></div>`).join('');
  $('logList').innerHTML = data.logs.map(l=>`<div class="card log-item"><div class="log-date">${escapeHtml(l.date)}</div>${escapeHtml(l.text)}</div>`).join('');
}

function bind(){
  document.querySelectorAll('.menu-btn').forEach(btn => safeTap(btn, () => switchPage(btn.dataset.page)));
  document.querySelectorAll('.game-buttons button').forEach(btn => safeTap(btn, () => {
    currentGame = btn.dataset.game;
    document.querySelectorAll('.game-buttons button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    rollGame();
  }));
  safeTap($('rollBtn'), rollGame);
  safeTap($('saveGameLog'), () => addLog(lastResult));
  safeTap($('saveTree'), () => { data.trunk = $('trunk').value; data.branch = $('branch').value; data.leaf = $('leaf').value; save(); });
  safeTap($('addListenerBtn'), () => { const name = prompt('常連名'); if(!name)return; data.listeners.push({name, days:[], memo:''}); save(); $('listenerSelect').value = String(data.listeners.length - 1); render(); });
  safeTap($('saveManualLog'), () => { const t = $('manualLog').value.trim(); if(!t)return; addLog(t); $('manualLog').value=''; });
  safeTap($('resetData'), () => { if(confirm('データ初期化する？')) { localStorage.removeItem(KEY); data = structuredClone(seed); save(); } });
  $('listenerSelect').addEventListener('change', render);
  $('dayGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('.day'); if(!btn) return;
    const idx = Number($('listenerSelect').value || 0); const l = data.listeners[idx]; if(!l) return;
    const d = Number(btn.dataset.day);
    l.days = l.days.includes(d) ? l.days.filter(x=>x!==d) : [...l.days,d].sort((a,b)=>a-b);
    save();
  });
  $('listenerCards').addEventListener('change', (e) => {
    const t = e.target.closest('[data-memo]'); if(!t) return;
    data.listeners[Number(t.dataset.memo)].memo = t.value; save();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bind();
  render();
  document.querySelector('[data-game="animal"]').classList.add('active');
});
