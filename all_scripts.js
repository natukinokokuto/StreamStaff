
const KEY="stream_manager_integrated_v1";
function ym(d){
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,"0");
  return `${y}-${m}`;
}
const kana=["一","二","三","四","五","六"];
const pipMap={
  1:[5],
  2:[1,9],
  3:[1,5,9],
  4:[1,3,7,9],
  5:[1,3,5,7,9],
  6:[1,3,4,6,7,9]
};
function setDice(el,num){
  el.dataset.value=num;
  el.innerHTML=pipMap[num].map(pos=>`<span class="pip p${pos} ${num===1?"red":""}"></span>`).join("");
}
const defaultState={
  logs:[],
  tree:{
    trunk:"今日のメインテーマを決める",
    branch:"話が止まった時の逃げ道",
    leaf:"コメントが増えたポイント"
  },
  listeners:[
    {name:"ジャック",days:[1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,29,30,31],memo:"ほぼ皆勤。強い常連。",penalty:0,registeredDate:"",birthday:""},
    {name:"くる",days:[1,2,3,5,6,7,8,9,10,11,12,13,14,15,16,18,20,21,22,23,24,25,26,29,30,31],memo:"ログボ管理対象。",penalty:0,registeredDate:"",birthday:""},
    {name:"ドク",days:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,21,22,23,24,25,26,27,28,29,30,31],memo:"救ってあげたい / 200",penalty:0,registeredDate:"",birthday:""}
  ],
  rewards:[
    {days:7,name:"週達成：リング / ヘッダー / ロック / しめじ"},
    {days:14,name:"14日達成：個通30分"},
    {days:31,name:"皆勤賞：リアルグッズ or 通話券1時間"}
  ],
  gameHistory:[],
  chLog:[],
  settings:{bgmVolume:45,seVolume:80,alarmVolume:80},
  chin:{
    mode:"normal",
    diceCount:3,
    diceNames:["サイコロ1","サイコロ2","サイコロ3","サイコロ4","サイコロ5","サイコロ6"],
    customDice:[
      {1:"罰ゲーム",2:"一発ギャグ",3:"水を飲む",4:"英語で一言",5:"自慢話",6:"歌う"},
      {1:"罰ゲーム",2:"一発ギャグ",3:"水を飲む",4:"英語で一言",5:"自慢話",6:"歌う"},
      {1:"罰ゲーム",2:"一発ギャグ",3:"水を飲む",4:"英語で一言",5:"自慢話",6:"歌う"},
      {1:"小話",2:"質問",3:"モノマネ",4:"昔話",5:"暴露",6:"褒める"},
      {1:"右の人",2:"左の人",3:"初見",4:"常連",5:"自分",6:"全員"},
      {1:"10秒",2:"30秒",3:"1分",4:"3分",5:"次の枠",6:"今日は封印"}
    ],
    localMap:{}
  },
  calendarEvents:[],
  calendarTypes:[
    {name:"登録日",color:"#10b981"},
    {name:"返礼品獲得日",color:"#f59e0b"},
    {name:"配信メモ",color:"#8b5cf6"},
    {name:"ペナルティー",color:"#ef4444"},
    {name:"約束",color:"#38bdf8"},
    {name:"その他",color:"#94a3b8"},
    {name:"誕生日",color:"#ec4899"}
  ],
  logboMonth:"",
  polls:[
    {
      id:"poll_sample_1",
      title:"今日どの企画からやる？",
      options:[
        {text:"チンチロ",votes:0},
        {text:"雑談",votes:0},
        {text:"大喜利",votes:0}
      ],
      memo:"URL投票は外部連携が必要。今は手動集計用。"
    }
  ],
  countdowns:[
    {
      id:"cd_newyear",
      title:"新年度",
      target:"2027-04-01T00:00:00",
      sound:"assets/countdown/学校のチャイム.mp3"
    }
  ],
  roulette:{
    items:["チンチロ","大喜利","雑談","罰ゲーム","歌う","モノマネ"],
    history:[]
  },
  tools:{
    counters:[
      {id:"c_sample_1",name:"ツッコミ回数",value:0},
      {id:"c_sample_2",name:"水飲み回数",value:0}
    ],
    timers:[
      {id:"t_sample_1",name:"休憩",duration:180,remaining:180,running:false,sound:"hato1",done:false},
      {id:"t_sample_2",name:"企画残り",duration:300,remaining:300,running:false,sound:"alarm_clock",done:false}
    ]
  },
  customGames:{
    animalAnimals:["猫","犬","ゾウ","牛","キツネ","ハト","ゴリラ","サル","馬","深夜のコンビニ店員"],
    animalTopics:["簡単にできる料理","昔流行ったもの","身につけるもの","虫の名前","冬に使うもの","配信で起きがちなこと"],
    ogiri:["身につけるものっぽく一番くだらないことを言って","深夜のコンビニ店員が急に言いそうな一言","猫が配信者だった時の初見挨拶","絶対に盛り上がらないイベント名"],
    line:["分からない……何も思い出せない……。何で炊けた米が部屋中に塗りたくられてるんだ……！？","それはもう、ほぼ事件じゃん。","ちょっと待って、話の枝が折れた。","いま誰がこの空気の責任取るの？"],
    when:["昨日","今日","朝","明日","おととい","去年","昼に","夕方に","夜に","誕生日に"],
    who:["お母さんが","酔っ払いが","猫が","常連が","初見さんが","師匠が"],
    where:["コンビニで","配信画面の裏で","公園で","居酒屋で","ダーツバーで","風呂場で"],
    what:["急に歌い出した","米を炊きすぎた","名言っぽいことを言った","謎のルールを作った","コメント欄を凍らせた"],
    bob:["アクセル","エンジン","オイル","オートマチック","ガソリン","ガソリンスタンド","カバー","ガレージ","アプローチ","ジュース","ランプ"],
    relo:["マーボー豆腐","チャンジャ","鮭とば","たこわさ","だし巻きたまご","枝豆","焼きナス","冷やしトマト","もつ鍋","軟骨のから揚げ"]
  }
};
let state=load();
state.settings = state.settings || structuredClone(defaultState.settings);
if(typeof state.settings.alarmVolume!=="number") state.settings.alarmVolume=80;
state.polls = state.polls || structuredClone(defaultState.polls || []);
state.ui = Object.assign({pollOpen:false,rouletteOpen:true,countersOpen:true,timersOpen:true,countdownsOpen:true}, state.ui || {});
state.ui = Object.assign({pollOpen:false,rouletteOpen:true,countersOpen:true,timersOpen:true,countdownsOpen:true}, state.ui || {});
    state.countdowns = state.countdowns || structuredClone(defaultState.countdowns || []);
state.countdowns.forEach(c=>{
  if(typeof c.sound!=="string") c.sound="assets/countdown/学校のチャイム.mp3";
  if(typeof c.finishedPlayed!=="boolean") c.finishedPlayed=false;
});
    state.tools = state.tools || structuredClone(defaultState.tools);
state.tools.counters = state.tools.counters || [];
state.tools.timers = state.tools.timers || [];
state.chin = state.chin || structuredClone(defaultState.chin);
state.chin.diceCount = state.chin.diceCount || 3;
state.chin.diceNames = state.chin.diceNames || structuredClone(defaultState.chin.diceNames);
state.chin.customDice = state.chin.customDice || structuredClone(defaultState.chin.customDice);
while(state.chin.diceNames.length<6) state.chin.diceNames.push(`サイコロ${state.chin.diceNames.length+1}`);
while(state.chin.customDice.length<6) state.chin.customDice.push(structuredClone(defaultState.chin.customDice[state.chin.customDice.length] || defaultState.chin.customDice[0]));
state.chin.localMap = state.chin.localMap || {};
state.customGames = state.customGames || structuredClone(defaultState.customGames);
for (const k in defaultState.customGames) state.customGames[k] = state.customGames[k] || structuredClone(defaultState.customGames[k]);
state.listeners = state.listeners || [];
state.calendarEvents = state.calendarEvents || [];
state.calendarTypes = state.calendarTypes || structuredClone(defaultState.calendarTypes || []);
if(!state.calendarTypes.length) state.calendarTypes = structuredClone(defaultState.calendarTypes || []);
    if(!state.calendarTypes.some(t=>t.name==="誕生日")) state.calendarTypes.push({name:"誕生日",color:"#ec4899"});
if(!state.calendarTypes.some(t=>t.name==="誕生日")) state.calendarTypes.push({name:"誕生日",color:"#ec4899"});
    state.polls = state.polls || structuredClone(defaultState.polls || []);
state.logboMonth = state.logboMonth || ym(new Date());
state.listeners.forEach(l=>{
  if(typeof l.penalty!=="number") l.penalty=0;
  if(typeof l.registeredDate!=="string") l.registeredDate="";
  if(typeof l.birthday!=="string") l.birthday="";
  if(typeof l.birthYear!=="string") l.birthYear="";
  if(typeof l.bloodType!=="string") l.bloodType="";
  if(typeof l.firstVisitDate!=="string") l.firstVisitDate="";
  if(typeof l.nickname!=="string") l.nickname="";
  if(!l.favorites) l.favorites={};
  ["project","game","food","area","music","anime","habit","free1","free2","ngTopic","dislikeFood","firstGame","mainWeapon","holiday","bgm","localThing","season","animal","oshi","firstStream","oneLine","teaseLine"].forEach(k=>{ if(typeof l.favorites[k]!=="string") l.favorites[k]=""; });
  if(!Array.isArray(l.topicSeeds)) l.topicSeeds=[];
  l.logboByMonth = l.logboByMonth || {};
  if(Array.isArray(l.days) && !l.logboByMonth[state.logboMonth]){
    l.logboByMonth[state.logboMonth] = [...l.days].sort((a,b)=>a-b);
  }
});
let selectedListener=0;
let selectedGame="animal";

const gameData={
  animal:{label:"動物",roll:()=>`🐾 ${pick(["猫","犬","ゾウ","牛","キツネ","ハト","ゴリラ","サル","馬","深夜のコンビニ店員"])} × 「${pick(["簡単にできる料理","昔流行ったもの","身につけるもの","虫の名前","冬に使うもの","配信で起きがちなこと"])}」といえば？`},
  ogiri:{label:"大喜利",roll:()=>`🧠 大喜利：${pick(["身につけるものっぽく一番くだらないことを言って","深夜のコンビニ店員が急に言いそうな一言","猫が配信者だった時の初見挨拶","絶対に盛り上がらないイベント名"] )}`},
  line:{label:"セリフ",roll:()=>`🎭 セリフ：${pick(["分からない……何も思い出せない……。何で炊けた米が部屋中に塗りたくられてるんだ……！？","それはもう、ほぼ事件じゃん。","ちょっと待って、話の枝が折れた。","いま誰がこの空気の責任取るの？"])}`},
  itsu:{label:"いつ誰",roll:()=>`🧩 ${pick(["昨日","今日","朝","明日","おととい","去年","昼に","夕方に","夜に","誕生日に"])} ${pick(["お母さんが","酔っ払いが","猫が","常連が","初見さんが","師匠が"])} ${pick(["コンビニで","配信画面の裏で","公園で","居酒屋で","ダーツバーで","風呂場で"])} ${pick(["急に歌い出した","米を炊きすぎた","名言っぽいことを言った","謎のルールを作った","コメント欄を凍らせた"])}`},
  bob:{label:"ボブ",roll:()=>`📘 ボブジテン：${pick(["アクセル","エンジン","オイル","オートマチック","ガソリン","ガソリンスタンド","カバー","ガレージ","アプローチ","ジュース","ランプ"])} ※カタカナ禁止で説明`},
  relo:{label:"酒場",roll:()=>`🍻 レロレロ酒場：${pick(["マーボー豆腐","チャンジャ","鮭とば","たこわさ","だし巻きたまご","枝豆","焼きナス","冷やしトマト","もつ鍋","軟骨のから揚げ"])} を噛まずに言える？`}
};
const trunks=[
  "最近あった地味にムカついた話",
  "昔はダサいと思ってたけど今はアリなもの",
  "仕事中にふと思ったこと",
  "最近ちょっと成長したこと",
  "配信中に決めたい謎ルール",
  "人に言うほどじゃないけど好きなもの",
  "最近買ってよかったもの / 失敗したもの",
  "昔の自分に言いたいこと",
  "大人になってから分かったこと",
  "自分だけかもしれない変なこだわり",
  "初見に聞きたい質問",
  "常連にだけ伝わる内輪ネタ",
  "最近の生活改善チャレンジ",
  "ちょっとした怒りを笑い話にする",
  "食べ物で一生語れるテーマ",
  "仕事あるあるから広げる話",
  "配信で起きたら面白い事件",
  "子どもの頃の謎ルール",
  "もし1日だけ別の職業をやるなら",
  "視聴者に二択で決めてもらう話",
  "自分の弱点をネタにする",
  "最近覚えた言葉・表現",
  "やってみたい企画の相談",
  "昔の流行を今見たらどう思うか",
  "今日のどうでもいいニュース"
];

const branches=[
  "食べ物の話に逃げる",
  "ダーツに例える",
  "英語学習に例える",
  "服の話に飛ばす",
  "昔の自分を掘る",
  "リスナーに二択で聞く",
  "失敗談に変える",
  "地域ネタにする",
  "仕事現場あるあるにする",
  "家族・友達の話に薄く寄せる",
  "コンビニで例える",
  "ゲームのステータス風にする",
  "ランキング形式にする",
  "『逆に』で反対意見を作る",
  "自分の偏見として話す",
  "昭和/平成/令和で比べる",
  "値段の話にする",
  "モテる/モテない論に脱線する",
  "配信者あるあるにする",
  "もしリスナーだったらで聞く",
  "一番ダサい答えを募集する",
  "一番かっこいい言い方に変える",
  "あるあるを3つ出す",
  "小学生の頃ならどうだったか考える",
  "老後の自分ならどうするか考える",
  "湘南っぽく言い換える",
  "英語で言うなら何か考える",
  "食わず嫌いだったものに繋げる",
  "自分ルールを作る",
  "次回企画にできるか考える"
];

const leaves=[
  "コメントが増えた単語を拾う",
  "初見が反応したらそこを太くする",
  "常連がツッコんだら枝化する",
  "笑いが起きた表現を保存",
  "次回の伏線としてログに残す",
  "リスナーの一言をタイトル化する",
  "投票ネタに変える",
  "切り抜き候補として保存する"
];

function makeBranchPack(){
  const pool=[...branches];
  const count=2+Math.floor(Math.random()*2);
  const picked=[];
  for(let i=0;i<count;i++){
    const idx=Math.floor(Math.random()*pool.length);
    picked.push(`・${pool.splice(idx,1)[0]}`);
  }
  return picked.join("\n");
}

function load(){try{return JSON.parse(localStorage.getItem(KEY))||defaultState}catch(e){return structuredClone(defaultState)}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function showScreen(id){
  if(id!=="chinchiro") stopChinBgm();
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".nav button").forEach(b=>b.classList.toggle("active",b.dataset.screen===id));
  if(id==="bonus") renderBonus();
  if(id==="memo") renderMemo();
  if(id==="settings") renderSettings();
  if(id==="calendar") renderCalendar();
  if(id==="tools") renderTools();
  if(id==="chinchiro"){ renderChinMode(); startChinBgm(); }
}
document.querySelectorAll(".nav button").forEach(b=>b.addEventListener("click",()=>showScreen(b.dataset.screen)));

if(window.openChinchiroFromGames) openChinchiroFromGames.onclick=()=>showScreen("chinchiro");
if(window.openCalendarFromTools) openCalendarFromTools.onclick=()=>showScreen("calendar");


function renderHome(){
  treeTrunk.textContent=state.tree.trunk;
  const branchesText=String(state.tree.branch||"").split(/\n+/).map(x=>x.replace(/^・/,"").trim()).filter(Boolean);
  treeBranch.innerHTML=branchesText.length
    ? `<ul class="branch-list">${branchesText.map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul>`
    : "話が止まった時の逃げ道";
  treeLeaf.textContent=state.tree.leaf;
  homeLogs.innerHTML=state.logs.slice(0,8).map(l=>`<div><b>${escapeHtml(l.title||"ログ")}</b><br><span class="muted">${escapeHtml(l.date)}</span><br>${escapeHtml(l.text)}</div>`).join("")||`<div>まだログなし</div>`;
}
autoTree.onclick=()=>{state.tree={trunk:pick(trunks),branch:makeBranchPack(),leaf:pick(leaves)};save();renderHome()}
nextBranch.onclick=()=>{state.tree.branch=makeBranchPack();save();renderHome()}
branchToLeaf.onclick=()=>{state.tree.leaf=state.tree.branch;state.logs.unshift({date:new Date().toLocaleString("ja-JP"),title:"葉っぱ保存",text:state.tree.branch});save();renderHome()}
saveQuickMemo.onclick=()=>{const v=quickMemo.value.trim();if(!v)return;state.logs.unshift({date:new Date().toLocaleString("ja-JP"),title:"配信メモ",text:v});quickMemo.value="";save();renderHome()}

function renderGames(){
  setupToolCollapse();
  renderRoulette();
  gameTabs.innerHTML=Object.entries(gameData).map(([k,g])=>`<button data-game="${k}" class="${k===selectedGame?"active":""}">${g.label}</button>`).join("");
  gameTabs.querySelectorAll("button").forEach(b=>b.onclick=()=>{selectedGame=b.dataset.game;renderGames()});
  gameHistory.innerHTML=state.gameHistory.map(h=>`<div>${escapeHtml(h)}</div>`).join("")||`<div>まだ履歴なし</div>`;
}
rollGame.onclick=()=>{const r=gameData[selectedGame].roll();gameResult.textContent=r;state.gameHistory.unshift(r);state.gameHistory=state.gameHistory.slice(0,20);save();renderGames()}
saveGameLog.onclick=()=>{const r=gameResult.textContent.trim();state.logs.unshift({date:new Date().toLocaleString("ja-JP"),title:"ゲーム結果",text:r});save();renderHome()}


function getLogboDays(listener){
  listener.logboByMonth = listener.logboByMonth || {};
  if(!listener.logboByMonth[state.logboMonth]) listener.logboByMonth[state.logboMonth]=[];
  return listener.logboByMonth[state.logboMonth];
}
function setLogboDays(listener, days){
  listener.logboByMonth = listener.logboByMonth || {};
  listener.logboByMonth[state.logboMonth]=[...days].sort((a,b)=>a-b);
  listener.days = listener.logboByMonth[state.logboMonth]; // 旧表示互換
}
function logboMonthDate(){
  const [y,m]=state.logboMonth.split("-").map(Number);
  return new Date(y,m-1,1);
}
function shiftLogboMonth(delta){
  const d=logboMonthDate();
  d.setMonth(d.getMonth()+delta);
  state.logboMonth=ym(d);
  state.listeners.forEach(l=>{ l.days=getLogboDays(l); });
  save();
  renderBonus();
  renderMemo();
}
function renderLogboCalendar(listener, listenerIndex){
  const d=logboMonthDate();
  const y=d.getFullYear();
  const m=d.getMonth();
  const daysInMonth=new Date(y,m+1,0).getDate();
  const firstDow=new Date(y,m,1).getDay();
  const checked=getLogboDays(listener);
  const weeks=["日","月","火","水","木","金","土"];
  let daysHtml="";
  for(let i=0;i<firstDow;i++){
    daysHtml+=`<div class="day blank"></div>`;
  }
  for(let day=1;day<=daysInMonth;day++){
    const dow=new Date(y,m,day).getDay();
    daysHtml+=`<button class="day ${checked.includes(day)?"on":""} ${dow===0?"sun":dow===6?"sat":""}" data-day="${day}">
      <span>${day}</span><small>${weeks[dow]}</small>
    </button>`;
  }
  return `<div class="logbo-calendar"><div class="logbo-days-grid" style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px;width:100%">${daysHtml}</div></div>`;
}
function currentLogboCount(listener){
  return getLogboDays(listener).length;
}

function renderBonus(){
  if(window.bulkLogboDate && !bulkLogboDate.value) bulkLogboDate.value=ymd(new Date());
  state.listeners.forEach(l=>{ l.days=getLogboDays(l); });
  listenerTabs.innerHTML=state.listeners.map((l,i)=>`<button class="${i===selectedListener?"active":""}" data-i="${i}">${escapeHtml(l.name)}</button>`).join("");
  listenerTabs.querySelectorAll("button").forEach(b=>b.onclick=()=>{selectedListener=Number(b.dataset.i);renderBonus()});
  const l=state.listeners[selectedListener];
  selectedListenerBox.innerHTML=`
    <h3>${escapeHtml(l.name)}</h3>
    <p class="muted">参加 ${currentLogboCount(l)}日 / ${state.logboMonth}</p>
    <div class="penalty-box">
      <div class="row" style="justify-content:space-between">
        <div>
          <div class="muted">ペナルティー</div>
          <div class="penalty-count">${l.penalty || 0}</div>
        </div>
        <div class="row">
          <button class="btn danger mini-btn" data-penalty-minus="${selectedListener}">−</button>
          <button class="btn danger mini-btn" data-penalty-plus="${selectedListener}">＋</button>
          <button class="btn mini-btn" data-penalty-reset="${selectedListener}">リセット</button>
          <button class="btn mini-btn" data-penalty-detail="${selectedListener}">内容を開く</button>
        </div>
      </div>
      <div class="penalty-details" data-penalty-detail-box="${selectedListener}">
        ${penaltyDetailList(l.name)}
      </div>
    </div>
    <div class="logbo-month-head">
      <button class="btn mini-btn" onclick="shiftLogboMonth(-1)">← 前月</button>
      <b>${state.logboMonth}</b>
      <button class="btn mini-btn" onclick="shiftLogboMonth(1)">次月 →</button>
    </div>
    ${renderLogboCalendar(l, selectedListener)}
    <h3 style="margin-top:14px">達成済み</h3>
    ${achievedList(l)}
  `;
  selectedListenerBox.querySelectorAll(".day:not(.blank)").forEach(b=>b.onclick=()=>{
    const d=Number(b.dataset.day);
    const days=getLogboDays(l);
    setLogboDays(l, days.includes(d)?days.filter(x=>x!==d):[...days,d]);
    save();renderBonus();renderMemo();
  });
  bindPenaltyButtons(selectedListenerBox);
  renderRewards();
}

function getBulkLogboInfo(){
  const v=bulkLogboDate?.value;
  const date=v ? new Date(v+"T00:00:00") : new Date();
  if(!v && bulkLogboDate) bulkLogboDate.value=ymd(date);
  return {month:ym(date), day:date.getDate()};
}
function bulkSetLogbo(shouldAdd){
  const info=getBulkLogboInfo();
  const day=info.day;
  if(!day || day<1 || day>31) return alert("日付が変だぞｗ");
  const msg=shouldAdd
    ? `${info.month} ${day}日を全員にログボ入力する？`
    : `${info.month} ${day}日を全員から外す？`;
  if(!confirm(msg)) return;
  state.logboMonth=info.month;
  state.listeners.forEach(l=>{
    l.logboByMonth=l.logboByMonth||{};
    const days=l.logboByMonth[info.month]||[];
    l.logboByMonth[info.month]=shouldAdd
      ? Array.from(new Set([...days,day])).sort((a,b)=>a-b)
      : days.filter(d=>d!==day);
    l.days=l.logboByMonth[state.logboMonth];
  });
  save();
  renderBonus();
  renderMemo();
}
if(window.bulkLogboAdd) bulkLogboAdd.onclick=()=>bulkSetLogbo(true);
if(window.bulkLogboRemove) bulkLogboRemove.onclick=()=>bulkSetLogbo(false);

function renderRewards(){
  rewardEditor.innerHTML=state.rewards.map((r,i)=>`
    <div class="reward-row">
      <input type="number" min="1" max="31" value="${r.days}" data-i="${i}" data-field="days">
      <input value="${escapeAttr(r.name)}" data-i="${i}" data-field="name">
      <button class="btn danger" data-del="${i}">削除</button>
    </div>`).join("");
  rewardEditor.querySelectorAll("input").forEach(inp=>inp.onchange=()=>{const i=Number(inp.dataset.i); const f=inp.dataset.field; state.rewards[i][f]=f==="days"?Number(inp.value):inp.value; state.rewards.sort((a,b)=>a.days-b.days); save();renderBonus();renderMemo()});
  rewardEditor.querySelectorAll("[data-del]").forEach(btn=>btn.onclick=()=>{state.rewards.splice(Number(btn.dataset.del),1);save();renderBonus();renderMemo()});
}
addReward.onclick=()=>{state.rewards.push({days:1,name:"新しい達成品"});state.rewards.sort((a,b)=>a.days-b.days);save();renderBonus()}
addListener.onclick=()=>{const name=prompt("常連名");if(!name)return;const today=ymd(new Date());state.listeners.push({name,days:[],logboByMonth:{[state.logboMonth]:[]},memo:"",penalty:0,registeredDate:today});selectedListener=state.listeners.length-1;state.calendarEvents.push({id:uid("cal"),date:today,listener:name,type:"登録日",item:"常連登録"});save();renderBonus();renderMemo();renderCalendar()}
function deleteListener(index){
  const l=state.listeners[index];
  if(!l)return;
  if(!confirm(`${l.name} を削除する？\nログボ記録と常連メモも消えるよ。`)) return;
  state.calendarEvents = (state.calendarEvents||[]).filter(ev=>ev.listener!==l.name);
  state.listeners.splice(index,1);
  if(state.listeners.length===0){
    state.listeners.push({name:"新しい常連",days:[],logboByMonth:{[state.logboMonth]:[]},memo:"",penalty:0,registeredDate:"",birthday:""});
  }
  selectedListener=Math.min(selectedListener,state.listeners.length-1);
  if(selectedListener<0) selectedListener=0;
  save();
  renderBonus();
  renderMemo();
}
if(window.deleteSelectedListener) deleteSelectedListener.onclick=()=>deleteListener(selectedListener);
function changePenalty(index,delta){
  const l=state.listeners[index];
  if(!l)return;
  if(typeof l.penalty!=="number") l.penalty=0;
  l.penalty=Math.max(0,l.penalty+delta);
  save();
  renderBonus();
  renderMemo();
}
function resetPenalty(index){
  const l=state.listeners[index];
  if(!l)return;
  if(!confirm(`${l.name} のペナルティーをリセットする？`)) return;
  l.penalty=0;
  save();
  renderBonus();
  renderMemo();
}
function bindPenaltyButtons(root=document){
  root.querySelectorAll("[data-penalty-plus]").forEach(btn=>btn.onclick=()=>changePenalty(Number(btn.dataset.penaltyPlus),1));
  root.querySelectorAll("[data-penalty-minus]").forEach(btn=>btn.onclick=()=>changePenalty(Number(btn.dataset.penaltyMinus),-1));
  root.querySelectorAll("[data-penalty-reset]").forEach(btn=>btn.onclick=()=>resetPenalty(Number(btn.dataset.penaltyReset)));
  root.querySelectorAll("[data-penalty-detail]").forEach(btn=>btn.onclick=()=>{
    const idx=btn.dataset.penaltyDetail;
    const box=root.querySelector(`[data-penalty-detail-box="${idx}"]`);
    if(!box)return;
    box.classList.toggle("open");
    btn.textContent=box.classList.contains("open") ? "内容を閉じる" : "内容を開く";
  });
}

function achievedList(l){
  const count=currentLogboCount(l);
  const items=state.rewards.filter(r=>count>=r.days).map(r=>`<li>${r.days}日：${escapeHtml(r.name)}</li>`).join("");
  return `<ul class="clean">${items||"<li>まだ達成品なし</li>"}</ul>`;
}

let detailListenerIndex=0;

function dateDiffText(dateStr){
  if(!dateStr) return "-";
  const start=new Date(dateStr+"T00:00:00");
  const now=new Date();
  if(isNaN(start.getTime())) return "-";
  let days=Math.floor((now-start)/(1000*60*60*24));
  if(days<0) return "未来の日付";
  const years=Math.floor(days/365.2425);
  const months=Math.floor(days/30.4375);
  if(years>=1) return `${years}年くらい / ${days}日`;
  if(months>=1) return `${months}ヶ月くらい / ${days}日`;
  return `${days}日`;
}
function calcAge(birthday){
  if(!birthday) return "-";
  const b=new Date(birthday+"T00:00:00");
  const now=new Date();
  if(isNaN(b.getTime())) return "-";
  let age=now.getFullYear()-b.getFullYear();
  const hadBirthday=(now.getMonth()>b.getMonth()) || (now.getMonth()===b.getMonth() && now.getDate()>=b.getDate());
  if(!hadBirthday) age--;
  return age>=0 ? `${age}歳` : "-";
}


function splitBirthday(birthday){
  if(!birthday) return {month:"",day:""};
  const parts=String(birthday).split("/");
  return {month:parts[0]||"",day:parts[1]||""};
}
function formatBirthday(month, day){
  const m=Number(month);
  const d=Number(day);
  if(!m || !d) return "";
  return `${String(m).padStart(2,"0")}/${String(d).padStart(2,"0")}`;
}

function isBirthdayToday(birthday){
  if(!birthday) return false;
  const now=new Date();
  const md=`${String(now.getMonth()+1).padStart(2,"0")}/${String(now.getDate()).padStart(2,"0")}`;
  return birthday===md;
}

function displayAge(l){
  if(!l || !l.birthday) return "-";
  if(!l.birthYear) return "年齢不詳";
  const birth=l.birthday || "";
  if(birth.length>=5){
    const md=birth.replace("/", "-");
    return calcAge(`${l.birthYear}-${md}`);
  }
  return "年齢不詳";
}

function generateTopicSeeds(l){
  const f=l.favorites || {};
  const name=l.nickname || l.name || "この人";
  const seeds=[];

  if(l.nickname) seeds.push(`あだ名は「${l.nickname}」。呼び方ネタにできる`);
  if(l.birthday) seeds.push(`誕生日は ${l.birthday}。${calcAge(l.birthday)}の話題にできる`);
  if(l.bloodType) seeds.push(`${l.bloodType}っぽいところを軽く聞ける`);
  if(l.firstVisitDate || l.registeredDate) seeds.push(`初来枠から ${dateDiffText(l.firstVisitDate || l.registeredDate)}。記念日トークにできる`);
  if(f.area) seeds.push(`${f.area}の天気・方言・地元ネタを振れる`);
  if(f.project) seeds.push(`${name}は「${f.project}」好き。今日やるか聞ける`);
  if(f.game) seeds.push(`${f.game}最近やってる？で広げられる`);
  if(f.food) seeds.push(`${f.food}のおすすめ店・食べ方を聞ける`);
  if(f.music) seeds.push(`${f.music}系の曲やライブ話を振れる`);
  if(f.anime) seeds.push(`${f.anime}の推しキャラ・名シーンを聞ける`);
  if(f.habit) seeds.push(`${f.habit}としていじれる/拾える`);
  if(f.free1) seeds.push(`${f.free1}から一言質問を作る`);
  if(f.free2) seeds.push(`${f.free2}から近況を聞ける`);
  if(f.dislikeFood) seeds.push(`嫌いな食べ物は${f.dislikeFood}。食べ物トークで避ける/軽く聞ける`);
  if(f.firstGame) seeds.push(`初めてやったゲームは${f.firstGame}。懐かしゲーム話に繋げる`);
  if(f.mainWeapon) seeds.push(`よく使う武器/キャラは${f.mainWeapon}。こだわりを聞ける`);
  if(f.holiday) seeds.push(`休日は${f.holiday}。休みの日トークに使える`);
  if(f.bgm) seeds.push(`作業用BGMは${f.bgm}。音楽の話を振れる`);
  if(f.localThing) seeds.push(`地元あるある：${f.localThing}`);
  if(f.season) seeds.push(`好きな季節は${f.season}。季節ネタに振れる`);
  if(f.animal) seeds.push(`好きな動物は${f.animal}。動物ネタに使える`);
  if(f.oshi) seeds.push(`推しは${f.oshi}。推し活トークに繋げる`);
  if(f.firstStream) seeds.push(`初見だった配信/企画は${f.firstStream}。思い出話にできる`);
  if(f.oneLine) seeds.push(`一言プロフィール：${f.oneLine}`);
  if(f.teaseLine) seeds.push(`いじりOKライン：${f.teaseLine}`);
  if(f.ngTopic) seeds.push(`⚠ NG注意：${f.ngTopic}`);
  if((l.penalty||0)>0) seeds.push(`ペナルティー${l.penalty}回。内容確認から話を作れる`);

  if(!seeds.length) seeds.push("まだ情報少なめ。好きな企画・地域・NG話題を入れると話題化できる");
  return seeds.slice(0,16);
}
function refreshTopicSeeds(index){
  const l=state.listeners[index];
  if(!l)return;
  l.topicSeeds=generateTopicSeeds(l);
  save();
  renderMemo();
  if(document.getElementById("listenerDetail").classList.contains("active")) renderListenerDetail();
}
function renderSeedList(l,i){
  const seeds=(l.topicSeeds && l.topicSeeds.length) ? l.topicSeeds : generateTopicSeeds(l);
  return `<div class="seed-box">
    <div class="row" style="justify-content:space-between">
      <b>🧠 話題の種</b>
      <button class="btn mini-btn" data-refresh-seeds="${i}">話題更新</button>
    </div>
    <div class="seed-list">${seeds.slice(0,5).map(s=>`<div class="seed-item">${escapeHtml(s)}</div>`).join("")}</div>
  </div>`;
}

function openListenerDetail(index){
  detailListenerIndex=index;
  renderListenerDetail();
  showScreen("listenerDetail");
}
function renderListenerDetail(){
  const l=state.listeners[detailListenerIndex];
  if(!l) return;
  detailName.textContent=`${l.name} の詳細設定`;
  detailInputName.value=l.name || "";
  detailNickname.value=l.nickname || "";
  const bd=splitBirthday(l.birthday || "");
  detailBirthMonth.value=bd.month ? Number(bd.month) : "";
  detailBirthDay.value=bd.day ? Number(bd.day) : "";
  detailBirthYear.value=l.birthYear || "";
  detailBlood.value=l.bloodType || "";
  detailFirstVisit.value=l.firstVisitDate || l.registeredDate || "";
  detailAge.textContent=displayAge(l);
  detailSinceFirst.textContent=dateDiffText(l.firstVisitDate || l.registeredDate);
  detailBloodView.textContent=l.bloodType || "-";
  const f=l.favorites || {};
  favProject.value=f.project || "";
  favGame.value=f.game || "";
  favFood.value=f.food || "";
  favArea.value=f.area || "";
  favMusic.value=f.music || "";
  favAnime.value=f.anime || "";
  favHabit.value=f.habit || "";
  favFree1.value=f.free1 || "";
  favFree2.value=f.free2 || "";
  favNgTopic.value=f.ngTopic || "";
  favDislikeFood.value=f.dislikeFood || "";
  favFirstGame.value=f.firstGame || "";
  favMainWeapon.value=f.mainWeapon || "";
  favHoliday.value=f.holiday || "";
  favBgm.value=f.bgm || "";
  favLocalThing.value=f.localThing || "";
  favSeason.value=f.season || "";
  favAnimal.value=f.animal || "";
  favOshi.value=f.oshi || "";
  favFirstStream.value=f.firstStream || "";
  favOneLine.value=f.oneLine || "";
  favTeaseLine.value=f.teaseLine || "";

  const seeds=l.topicSeeds && l.topicSeeds.length ? l.topicSeeds : generateTopicSeeds(l);
  detailTopicSeeds.innerHTML=seeds.map(s=>`<div>${escapeHtml(s)}</div>`).join("") || `<div class="muted">まだ話題の種なし</div>`;
}
if(window.backToMemo) backToMemo.onclick=()=>showScreen("memo");
if(window.refreshDetailSeeds) refreshDetailSeeds.onclick=()=>refreshTopicSeeds(detailListenerIndex);
if(window.toggleMoreDetail) toggleMoreDetail.onclick=()=>{
  moreDetailPanel.classList.toggle("open");
  toggleMoreDetail.textContent=moreDetailPanel.classList.contains("open") ? "お気に入り詳細を閉じる" : "お気に入りをもっと詳しく";
};
if(window.saveListenerDetail) saveListenerDetail.onclick=()=>{
  const l=state.listeners[detailListenerIndex];
  if(!l) return;
  const oldName=l.name;
  const newName=detailInputName.value.trim() || oldName;
  l.name=newName;
  l.nickname=detailNickname.value.trim();
  l.birthday=formatBirthday(detailBirthMonth.value, detailBirthDay.value);
  l.birthYear=detailBirthYear.value.trim();
  l.bloodType=detailBlood.value;
  l.firstVisitDate=detailFirstVisit.value;
  l.favorites={
    project:favProject.value.trim(),
    game:favGame.value.trim(),
    food:favFood.value.trim(),
    area:favArea.value.trim(),
    music:favMusic.value.trim(),
    anime:favAnime.value.trim(),
    habit:favHabit.value.trim(),
    free1:favFree1.value.trim(),
    free2:favFree2.value.trim(),
    ngTopic:favNgTopic.value.trim(),
    dislikeFood:favDislikeFood.value.trim(),
    firstGame:favFirstGame.value.trim(),
    mainWeapon:favMainWeapon.value.trim(),
    holiday:favHoliday.value.trim(),
    bgm:favBgm.value.trim(),
    localThing:favLocalThing.value.trim(),
    season:favSeason.value.trim(),
    animal:favAnimal.value.trim(),
    oshi:favOshi.value.trim(),
    firstStream:favFirstStream.value.trim(),
    oneLine:favOneLine.value.trim(),
    teaseLine:favTeaseLine.value.trim()
  };
  l.topicSeeds=generateTopicSeeds(l);
  if(l.firstVisitDate) l.registeredDate=l.firstVisitDate;

  if(oldName!==newName){
    (state.calendarEvents||[]).forEach(ev=>{ if(ev.listener===oldName) ev.listener=newName; });
  }

  if(l.registeredDate){
    const exists=(state.calendarEvents||[]).some(ev=>ev.listener===l.name && ev.type==="登録日" && ev.date===l.registeredDate);
    if(!exists) state.calendarEvents.push({id:uid("cal"),date:l.registeredDate,listener:l.name,type:"登録日",item:"初来枠 / 常連登録"});
  }

  save();
  renderListenerDetail();
  renderMemo();
  renderBonus();
  renderCalendar();
  alert("保存した！");
};

function renderMemo(){
  memoGrid.innerHTML=state.listeners.map((l,i)=>`
    <div class="card"><div class="inner">
      <div class="row" style="justify-content:space-between">
        <h2 style="margin:0">${escapeHtml(l.name)}</h2>
        <div class="row">
          <button class="btn mini-btn" data-open-detail="${i}">詳細設定</button>
          <button class="btn danger" data-delete-memo-listener="${i}" style="min-height:36px;padding:6px 10px">削除</button>
        </div>
      </div>
      <p class="muted">${l.nickname ? "@" + escapeHtml(l.nickname) + " / " : ""}ログボ ${currentLogboCount(l)}日 / ${state.logboMonth}</p>
      ${l.birthday ? `<p class="muted">🎂 誕生日 ${escapeHtml(l.birthday)}</p>` : ""}
      <p class="muted">年齢 ${displayAge(l)} / 初来枠から ${dateDiffText(l.firstVisitDate || l.registeredDate)}</p>
      ${renderSeedList(l,i)}
      <div class="penalty-box">
        <div class="row" style="justify-content:space-between">
          <div>
            <div class="muted">ペナルティー</div>
            <div class="penalty-count">${l.penalty || 0}</div>
          </div>
          <div class="row">
            <button class="btn danger mini-btn" data-penalty-minus="${i}">−</button>
            <button class="btn danger mini-btn" data-penalty-plus="${i}">＋</button>
            <button class="btn mini-btn" data-penalty-reset="${i}">リセット</button>
            <button class="btn mini-btn" data-penalty-detail="${i}">内容を開く</button>
          </div>
        </div>
        <div class="penalty-details" data-penalty-detail-box="${i}">
          ${penaltyDetailList(l.name)}
        </div>
      </div>
      <h3>達成依頼 / 達成品</h3>
      ${achievedList(l)}
      <h3>カレンダー同期メモ</h3>
      ${calendarMemoList(l.name)}
      <label>常連メモ</label>
      <textarea data-memo="${i}">${escapeHtml(l.memo||"")}</textarea>
    </div></div>`).join("");
  memoGrid.querySelectorAll("textarea").forEach(t=>t.onchange=()=>{state.listeners[Number(t.dataset.memo)].memo=t.value;save()});
  memoGrid.querySelectorAll("[data-birthday]").forEach(inp=>inp.onchange=()=>{
    state.listeners[Number(inp.dataset.birthday)].birthday=inp.value;
    save();renderMemo();renderCalendar();
  });
  memoGrid.querySelectorAll("[data-registered-date]").forEach(inp=>inp.onchange=()=>{
    const l=state.listeners[Number(inp.dataset.registeredDate)];
    l.registeredDate=inp.value;
    if(inp.value){
      const exists=(state.calendarEvents||[]).some(ev=>ev.listener===l.name && ev.type==="登録日" && ev.date===inp.value);
      if(!exists) state.calendarEvents.push({id:uid("cal"),date:inp.value,listener:l.name,type:"登録日",item:"常連登録"});
    }
    save();renderMemo();renderCalendar();
  });
  memoGrid.querySelectorAll("[data-refresh-seeds]").forEach(btn=>btn.onclick=()=>refreshTopicSeeds(Number(btn.dataset.refreshSeeds)));
  memoGrid.querySelectorAll("[data-open-detail]").forEach(btn=>btn.onclick=()=>openListenerDetail(Number(btn.dataset.openDetail)));
  memoGrid.querySelectorAll("[data-delete-memo-listener]").forEach(btn=>btn.onclick=()=>deleteListener(Number(btn.dataset.deleteMemoListener)));
  bindPenaltyButtons(memoGrid);
}


function fitBrushText(text){
  const plain=String(text).replace(/[─ー\\s]/g,"");
  brush.classList.remove("long","xlong");
  if(plain.length>=18) brush.classList.add("xlong");
  else if(plain.length>=10) brush.classList.add("long");
}

/* Chinchiro */
let rolling=false;
let diceEls=[];
function renderDiceArea(count){
  const c=Math.max(1,Math.min(6,Number(count)||3));
  const size = c<=3 ? "clamp(68px,13vw,112px)" : c<=4 ? "clamp(58px,11vw,92px)" : "clamp(48px,9vw,76px)";
  diceArea.style.setProperty("--dice-size", size);
  diceArea.innerHTML=Array.from({length:c},(_,i)=>`<div class="dice" id="d${i+1}"></div>`).join("");
  diceEls=Array.from(diceArea.querySelectorAll(".dice"));
  diceEls.forEach(d=>setDice(d,1));
}
renderDiceArea(3);
function play(id){const a=document.getElementById(id); if(!a) return; try{a.volume=(state.settings?.seVolume ?? 80)/100; a.currentTime=0; a.play().catch(()=>{})}catch(e){}}
function rand(){return Math.floor(Math.random()*6)+1}
function judge(arr){
  const s=[...arr].sort((a,b)=>a-b).join("");
  if(s==="111") return {name:"ピンゾロ",brush:"── ピンゾロ ──",type:"best"};
  if(s==="123") return {name:"ヒフミ",brush:"── ヒフミ ──",type:"worst"};
  if(s==="456") return {name:"シゴロ",brush:"── シゴロ ──",type:"win"};
  if(arr[0]===arr[1]&&arr[1]===arr[2]) return {name:`${arr[0]}ゾロ`,brush:`── ${kana[arr[0]-1]}ゾロ ──`,type:"zoro"};
  for(let n=1;n<=6;n++){
    if(arr.filter(x=>x===n).length===2){
      const point=arr.find(x=>x!==n);
      return {name:`通常目 ${point}`,brush:`── ${kana[point-1]}の目 ──`,type:"normal"};
    }
  }
  return {name:"目なし",brush:"── 目なし ──",type:"none"};
}
rollChin.onclick=()=>{
  if(rolling)return; rolling=true;
  chStage.className="ch-stage"; brush.className="brush"; ink.className="ink";
  play("seGlass");
  diceEls.forEach(d=>d.classList.add("rolling"));
  let spin=setInterval(()=>diceEls.forEach(d=>setDice(d,rand())),75);
  setTimeout(()=>{
    clearInterval(spin);
    const diceCount = state.chin.mode==="custom" ? state.chin.diceCount : 3;
    let final=Array.from({length:diceCount},()=>rand());
    const p=Math.random();
    if(state.chin.mode!=="custom"){
      if(p<0.08) final=[1,1,1];
      else if(p<0.17) final=[1,2,3];
    }
    diceEls.forEach((d,i)=>{d.classList.remove("rolling");setDice(d,final[i])});
    let res=judge(final);
    let displayText=res.brush;
    let logName=res.name;

    if(state.chin.mode==="custom"){
      const items=final.map((num,i)=>state.chin.customDice[i]?.[num] || `${num}の目`);
      const namedItems=items.map((item,i)=>`${state.chin.diceNames[i]||`サイコロ${i+1}`}：${item}`);
      const allSame=items.length>1 && items.every(x=>x===items[0]);
      if(allSame){
        displayText=`── ${items[0]} ──`;
        logName=`カスタム一致：${items[0]}`;
        res={...res,type:"customHit"};
      }else{
        displayText=`── ${namedItems.join(" / ")} ──`;
        logName=`カスタム：${namedItems.join(" / ")}`;
        res={...res,type:"custom"};
      }
    }

    if(state.chin.mode==="local"){
      const key=comboKey(final);
      const text=state.chin.localMap[key] || defaultLocalText(key);
      displayText=`── ${text} ──`;
      logName=`ローカル：${text}`;
      res={...res,type:res.type};
    }

    const hasSpecialSound = ["best","worst","zoro","customHit"].includes(res.type);
    if(!hasSpecialSound) play("seKoduzumi");
    setTimeout(()=>{
      ink.className="ink show";
      brush.textContent=displayText;
      brush.className="brush show";
      fitBrushText(displayText);
      if(res.type==="best"){chStage.className="ch-stage hot shake";brush.className="brush gold show";fitBrushText(displayText);play("seHorn")}
      else if(res.type==="worst"){chStage.className="ch-stage cold shake";brush.className="brush blue show";fitBrushText(displayText);play("seChime")}
      else if(res.type==="zoro" || res.type==="customHit"){chStage.className="ch-stage hot shake";brush.className="brush gold show";fitBrushText(displayText);play("seSword")}
      else if(res.type==="win"){chStage.className="ch-stage hot";brush.className="brush gold show";fitBrushText(displayText)}
      else {chStage.className="ch-stage";fitBrushText(displayText)}
      state.chLog.unshift(`${new Date().toLocaleTimeString("ja-JP")}　${final.join("・")}　${logName}`);
      state.chLog=state.chLog.slice(0,20); save(); renderChLog();
      rolling=false;
    },420);
  },1450);
}
function renderChLog(){chLog.innerHTML=state.chLog.map(x=>`<div>${escapeHtml(x)}</div>`).join("")||`<div>まだ出目なし</div>`}


function applyVolumes(){
  const bgm=document.getElementById("bgmChin");
  if(bgm) bgm.volume=(state.settings.bgmVolume||0)/100;
  ["seGlass","seKoduzumi","seHorn","seChime","seSword"].forEach(id=>{
    const a=document.getElementById(id);
    if(a) a.volume=(state.settings.seVolume||0)/100;
  });
}
function startChinBgm(){
  applyVolumes();
  const bgm=document.getElementById("bgmChin");
  if(!bgm) return;
  try{ bgm.play().catch(()=>{}); }catch(e){}
}
function stopChinBgm(){
  const bgm=document.getElementById("bgmChin");
  if(!bgm) return;
  bgm.pause();
}
const editLabels={
  animalAnimals:"動物ゲーム：動物",
  animalTopics:"動物ゲーム：お題",
  ogiri:"大喜利：お題",
  line:"セリフ：セリフ",
  when:"いつ誰どこ何：いつ",
  who:"いつ誰どこ何：誰が",
  where:"いつ誰どこ何：どこで",
  what:"いつ誰どこ何：何をした",
  bob:"ボブジテン：単語",
  relo:"レロレロ酒場：単語"
};

function renderFirebaseSettings(){
  if(!window.firebaseApiKey) return;
  const f=state.settings.firebase || {};
  firebaseEnabled.checked=!!f.enabled;
  firebaseApiKey.value=f.apiKey || "";
  firebaseAuthDomain.value=f.authDomain || "";
  firebaseProjectId.value=f.projectId || "";
  firebaseStorageBucket.value=f.storageBucket || "";
  firebaseMessagingSenderId.value=f.messagingSenderId || "";
  firebaseAppId.value=f.appId || "";
}
if(window.saveFirebaseConfig) saveFirebaseConfig.onclick=()=>{
  state.settings.firebase={
    enabled:!!firebaseEnabled.checked,
    apiKey:firebaseApiKey.value.trim(),
    authDomain:firebaseAuthDomain.value.trim(),
    projectId:firebaseProjectId.value.trim(),
    storageBucket:firebaseStorageBucket.value.trim(),
    messagingSenderId:firebaseMessagingSenderId.value.trim(),
    appId:firebaseAppId.value.trim()
  };
  save();
  alert("Firebase設定を保存した！");
};
if(window.firebaseTestBtn) firebaseTestBtn.onclick=()=>{
  const f=state.settings.firebase || {};
  const ok=f.apiKey && f.projectId && f.appId;
  alert(ok ? "Firebase接続情報OKっぽい！" : "設定が足りないかも！");
};

function renderSettings(){
  bgmVolume.value=state.settings.bgmVolume;
  seVolume.value=state.settings.seVolume;
  alarmVolume.value=state.settings.alarmVolume;
  bgmVolText.textContent=state.settings.bgmVolume;
  seVolText.textContent=state.settings.seVolume;
  alarmVolText.textContent=state.settings.alarmVolume;
  editCategory.innerHTML=Object.entries(editLabels).map(([k,v])=>`<option value="${k}">${v}</option>`).join("");
  renderGameItemList();
  applyVolumes();
}
function renderGameItemList(){
  const key=editCategory.value || "animalAnimals";
  const list=state.customGames[key] || [];
  gameItemList.innerHTML=list.map((item,i)=>`
    <div class="row" style="justify-content:space-between;background:#0b0d13;border:1px solid var(--line);border-radius:12px;padding:9px">
      <span>${escapeHtml(item)}</span>
      <button class="btn danger" data-delitem="${i}" style="min-height:36px;padding:6px 10px">削除</button>
    </div>
  `).join("") || `<div>まだ項目なし</div>`;
  gameItemList.querySelectorAll("[data-delitem]").forEach(btn=>btn.onclick=()=>{
    state.customGames[key].splice(Number(btn.dataset.delitem),1);
    save(); renderGameItemList(); renderGames();
  });
}
bgmVolume.oninput=()=>{state.settings.bgmVolume=Number(bgmVolume.value);bgmVolText.textContent=state.settings.bgmVolume;save();applyVolumes();}
seVolume.oninput=()=>{state.settings.seVolume=Number(seVolume.value);seVolText.textContent=state.settings.seVolume;save();applyVolumes();}
alarmVolume.oninput=()=>{state.settings.alarmVolume=Number(alarmVolume.value);alarmVolText.textContent=state.settings.alarmVolume;save();applyVolumes();}
testBgm.onclick=()=>startChinBgm();
stopBgm.onclick=()=>stopChinBgm();
testSe.onclick=()=>play("seKoduzumi");
resetChLog.onclick=()=>{if(confirm("チンチロ履歴をリセットする？")){state.chLog=[];save();renderChLog();alert("リセットした！")}}
editCategory.onchange=()=>renderGameItemList();
addGameItem.onclick=()=>{
  const key=editCategory.value;
  const v=newItemText.value.trim();
  if(!v)return;
  state.customGames[key].push(v);
  newItemText.value="";
  save(); renderGameItemList(); renderGames();
}


function renderChinMode(){
  if(!window.chinModeTabs) return;
  document.querySelectorAll("#chinModeTabs button").forEach(btn=>{
    btn.classList.toggle("active",btn.dataset.mode===state.chin.mode);
    btn.onclick=()=>{state.chin.mode=btn.dataset.mode;save();renderChinMode();}
  });

  const isNormal=state.chin.mode==="normal";
  const isCustom=state.chin.mode==="custom";
  const isLocal=state.chin.mode==="local";

  normalRuleView.style.display=isNormal?"block":"none";
  customRuleView.style.display=isCustom?"grid":"none";
  localRuleView.style.display=isLocal?"grid":"none";
  customPanel.classList.toggle("active",isCustom);
  localPanel.classList.toggle("active",isLocal);

  ruleTitle.textContent=isNormal?"チンチロ役表":isCustom?"カスタム登録一覧":"ローカル登録一覧";

  renderCustomDiceSelect();
  renderCustomRuleView();
  renderLocalRuleView();
  renderCustomDiceEditor();
  renderLocalComboEditor();
  renderDiceArea(state.chin.mode==="custom" ? state.chin.diceCount : 3);
}
function renderCustomDiceSelect(){
  if(!window.customDiceSelect) return;
  customDiceCount.value=state.chin.diceCount;
  const current=Math.min(Number(customDiceSelect.value || 0), state.chin.diceCount-1);
  customDiceSelect.innerHTML=state.chin.diceNames.slice(0,state.chin.diceCount).map((name,i)=>`<option value="${i}" ${i===current?"selected":""}>${escapeHtml(name)}</option>`).join("");
  customDiceSelect.value=String(current);
  const idx=Number(customDiceSelect.value||0);
  customDiceName.value=state.chin.diceNames[idx] || `サイコロ${idx+1}`;
}
function renderCustomRuleView(){
  if(!window.customRuleView) return;
  customRuleView.innerHTML=`<div class="registered-item"><b>使用サイコロ</b>${state.chin.diceCount}個</div>`+
    state.chin.customDice.slice(0,state.chin.diceCount).map((diceMap,i)=>`
      <div class="registered-item">
        <b>${escapeHtml(state.chin.diceNames[i] || `サイコロ${i+1}`)}</b>
        ${Array.from({length:6},(_,n)=>`${n+1}：${escapeHtml(diceMap[n+1]||"")}`).join("<br>")}
      </div>
    `).join("");
}
function renderLocalRuleView(){
  if(!window.localRuleView) return;
  localRuleView.innerHTML=makeLocalKeys().map(k=>`
    <div class="registered-item">
      <b>${escapeHtml(comboLabelFromKey(k))}</b>
      ${escapeHtml(state.chin.localMap[k] || defaultLocalText(k))}
    </div>
  `).join("");
}
function renderCustomDiceEditor(){
  if(!window.customDiceEditor) return;
  const diceIndex=Number(customDiceSelect.value||0);
  customDiceName.value=state.chin.diceNames[diceIndex] || `サイコロ${diceIndex+1}`;
  const diceMap=state.chin.customDice[diceIndex];
  customDiceEditor.innerHTML=Array.from({length:6},(_,i)=>{
    const n=i+1;
    return `<div class="map-row"><label>${n}の目</label><input data-custom-face="${n}" value="${escapeAttr(diceMap[n]||"")}"></div>`;
  }).join("");
  customDiceEditor.querySelectorAll("[data-custom-face]").forEach(inp=>{
    inp.oninput=()=>{state.chin.customDice[diceIndex][inp.dataset.customFace]=inp.value;save();renderCustomRuleView();}
  });
}
function comboKey(arr){
  for(let n=1;n<=6;n++){
    if(arr.filter(x=>x===n).length===2){
      const point=arr.find(x=>x!==n);
      return `point-${point}`;
    }
  }
  const res=judge(arr);
  return res.type;
}
function comboLabelFromKey(key){
  if(key.startsWith("point-")) return `${key.replace("point-","")}の目`;
  const labels={best:"ピンゾロ",worst:"ヒフミ",zoro:"ゾロ目",win:"シゴロ",none:"目なし"};
  return labels[key] || key;
}
function makeLocalKeys(){
  return ["point-1","point-2","point-3","point-4","point-5","point-6","best","zoro","win","worst","none"];
}
function defaultLocalText(key){
  const defaults={
    "point-1":"一の目",
    "point-2":"二の目",
    "point-3":"三の目",
    "point-4":"四の目",
    "point-5":"五の目",
    "point-6":"六の目",
    best:"ピンゾロ",
    zoro:"ゾロ目",
    win:"シゴロ",
    worst:"ヒフミ",
    none:"目なし"
  };
  return defaults[key] || key;
}
function renderLocalComboEditor(){
  if(!window.localComboSelect) return;
  const keys=makeLocalKeys();
  const current=localComboSelect.value || keys[0];
  localComboSelect.innerHTML=keys.map(k=>`<option value="${k}" ${k===current?"selected":""}>${comboLabelFromKey(k)}</option>`).join("");
  const key=localComboSelect.value || keys[0];
  localComboText.value=state.chin.localMap[key] || defaultLocalText(key);
}
if(window.customDiceCount) customDiceCount.onchange=()=>{
  state.chin.diceCount=Math.max(1,Math.min(6,Number(customDiceCount.value)||3));
  if(Number(customDiceSelect.value||0)>=state.chin.diceCount) customDiceSelect.value=String(state.chin.diceCount-1);
  save(); renderChinMode();
};
if(window.customDiceSelect) customDiceSelect.onchange=()=>{renderCustomDiceSelect();renderCustomDiceEditor();};
if(window.customDiceName) customDiceName.oninput=()=>{
  const idx=Number(customDiceSelect.value||0);
  state.chin.diceNames[idx]=customDiceName.value.trim() || `サイコロ${idx+1}`;
  save(); renderCustomDiceSelect(); renderCustomRuleView();
};
if(window.localComboSelect) localComboSelect.onchange=()=>{
  const key=localComboSelect.value;
  localComboText.value=state.chin.localMap[key] || defaultLocalText(key);
};
if(window.saveLocalCombo) saveLocalCombo.onclick=()=>{
  const key=localComboSelect.value;
  state.chin.localMap[key]=localComboText.value.trim() || defaultLocalText(key);
  save();
  renderLocalRuleView();
  alert("保存した！");
};




let calendarCursor=new Date();
let selectedCalendarDate=ymd(new Date());

function ymd(d){
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,"0");
  const day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function monthStart(d){return new Date(d.getFullYear(),d.getMonth(),1)}
function addMonths(d,n){return new Date(d.getFullYear(),d.getMonth()+n,1)}
function eventsForDate(date){
  const evs=(state.calendarEvents||[]).filter(ev=>ev.date===date);
  // registeredDate from listeners also shown, even if old data has no explicit event
  state.listeners.forEach(l=>{
    if(l.registeredDate===date && !evs.some(ev=>ev.listener===l.name && ev.type==="登録日")){
      evs.push({id:"auto_"+l.name+"_"+date,date,listener:l.name,type:"登録日",item:"常連登録"});
    }
  });
  state.listeners.forEach(l=>{
    if(l.birthday){
      const md=l.birthday;
      const current=date.slice(5).replace("-","/");
      if(current===md && !evs.some(ev=>ev.listener===l.name && ev.type==="誕生日")){
        evs.push({id:"birthday_"+l.name+"_"+date,date,listener:l.name,type:"誕生日",item:"🎂 誕生日"});
      }
    }
  });
  return evs;
}
function calendarMemoList(listenerName){
  const evs=(state.calendarEvents||[])
    .filter(ev=>ev.listener===listenerName)
    .sort((a,b)=>String(b.date).localeCompare(String(a.date)))
    .slice(0,10);
  if(!evs.length) return `<ul class="clean"><li>カレンダー記録なし</li></ul>`;
  return `<ul class="clean">${evs.map(ev=>`<li>${escapeHtml(ev.date)}：${escapeHtml(ev.type)} / ${escapeHtml(ev.item)}</li>`).join("")}</ul>`;
}
function applyCalendarPenalty(listenerName, delta){
  const l=state.listeners.find(x=>x.name===listenerName);
  if(!l) return;
  if(typeof l.penalty!=="number") l.penalty=0;
  l.penalty=Math.max(0,l.penalty+delta);
}
function penaltyDetailList(listenerName){
  const evs=(state.calendarEvents||[])
    .filter(ev=>ev.listener===listenerName && ev.type==="ペナルティー")
    .sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  if(!evs.length) return `<div class="penalty-log"><div class="muted">カレンダー登録のペナルティー内容なし</div></div>`;
  return `<div class="penalty-log">${evs.map(ev=>`
    <div>
      <b>${escapeHtml(ev.date)}</b><br>
      ${escapeHtml(ev.item || "ペナルティー")}
    </div>
  `).join("")}</div>`;
}



function getCalendarType(typeName){
  return (state.calendarTypes||[]).find(t=>t.name===typeName) || {name:typeName,color:"#8b5cf6"};
}
function renderCalendarTypeOptions(){
  if(!window.calendarType) return;
  const current=calendarType.value;
  calendarType.innerHTML=(state.calendarTypes||[]).map(t=>`<option value="${escapeAttr(t.name)}" ${t.name===current?"selected":""}>${escapeHtml(t.name)}</option>`).join("");
}
function renderCalendarTypeEditor(){
  if(!window.calendarTypeEditor) return;
  calendarTypeEditor.innerHTML=(state.calendarTypes||[]).map((t,i)=>`
    <span class="type-chip">
      <span class="type-color-dot" style="background:${escapeAttr(t.color)}"></span>
      ${escapeHtml(t.name)}
      <input type="color" value="${escapeAttr(t.color)}" data-type-color="${i}" style="width:34px;height:26px;padding:0;border:0">
      ${["登録日","返礼品獲得日","配信メモ","ペナルティー","約束","その他"].includes(t.name) ? "" : `<button class="btn danger mini-btn" data-type-del="${i}">削除</button>`}
    </span>
  `).join("");
  calendarTypeEditor.querySelectorAll("[data-type-color]").forEach(inp=>inp.oninput=()=>{
    state.calendarTypes[Number(inp.dataset.typeColor)].color=inp.value;
    save();renderCalendar();
  });
  calendarTypeEditor.querySelectorAll("[data-type-del]").forEach(btn=>btn.onclick=()=>{
    const i=Number(btn.dataset.typeDel);
    if(!confirm(`${state.calendarTypes[i].name} を削除する？`)) return;
    state.calendarTypes.splice(i,1);
    save();renderCalendar();
  });
}

function renderCalendar(){
  if(!window.calendarMonth) return;
  const y=calendarCursor.getFullYear();
  const m=calendarCursor.getMonth();
  calendarTitle.textContent=`${y}年 ${m+1}月`;
  calendarListener.innerHTML=state.listeners.map(l=>`<option value="${escapeAttr(l.name)}">${escapeHtml(l.name)}</option>`).join("");
  renderCalendarTypeOptions();
  renderCalendarTypeEditor();
  selectedDateTitle.textContent=`${selectedCalendarDate} の記録`;

  const first=new Date(y,m,1);
  const start=new Date(y,m,1-first.getDay());
  const today=ymd(new Date());
  const weeks=["日","月","火","水","木","金","土"];
  let cells=weeks.map((w,i)=>`<div class="cal-week ${i===0?"sun":i===6?"sat":""}">${w}</div>`).join("");

  const jpHolidays={
    "01-01":"元日",
    "02-11":"建国記念の日",
    "02-23":"天皇誕生日",
    "04-29":"昭和の日",
    "05-03":"憲法記念日",
    "05-04":"みどりの日",
    "05-05":"こどもの日",
    "08-11":"山の日",
    "11-03":"文化の日",
    "11-23":"勤労感謝の日"
  };

  for(let i=0;i<42;i++){
    const d=new Date(start);
    d.setDate(start.getDate()+i);
    const date=ymd(d);
    const md=date.slice(5);
    const dow=d.getDay();
    const isHoliday=Boolean(jpHolidays[md]);
    const evs=eventsForDate(date);
    const marks=evs.slice(0,3).map(ev=>{
      const typeInfo=getCalendarType(ev.type);
      const label=ev.type==="誕生日" ? `🎂 ${ev.listener}` : `${ev.listener}：${ev.type}`;
      return `<div class="cal-mark ${ev.type==="誕生日"?"birthday-mark":""}" style="background:${escapeAttr(typeInfo.color)}22;color:${escapeAttr(typeInfo.color)};border:1px solid ${escapeAttr(typeInfo.color)}66">${escapeHtml(label)}</div>`;
    }).join("");
    const more=evs.length>3?`<div class="cal-mark">+${evs.length-3}</div>`:"";
    cells+=`<button class="cal-day 
      ${d.getMonth()!==m?"out":""}
      ${date===today?"today":""}
      ${(dow===0 || isHoliday)?"sun":dow===6?"sat":""}
      " data-cal-date="${date}">
      <div class="cal-num">${d.getDate()}</div>${marks}${more}
    </button>`;
  }
  calendarMonth.innerHTML=cells;
  calendarMonth.querySelectorAll("[data-cal-date]").forEach(btn=>btn.onclick=()=>{selectedCalendarDate=btn.dataset.calDate;renderCalendar();});
  renderSelectedDateEvents();
}
function renderSelectedDateEvents(){
  if(!window.selectedDateEvents) return;
  selectedDateTitle.textContent=`${selectedCalendarDate} の記録`;
  const evs=eventsForDate(selectedCalendarDate);
  selectedDateEvents.innerHTML=evs.map(ev=>`
    <div class="event-item">
      <b><span class="type-color-dot" style="background:${escapeAttr(getCalendarType(ev.type).color)}"></span> ${escapeHtml(ev.listener)}：${escapeHtml(ev.type)}</b>
      <div>${escapeHtml(ev.item)}</div>
      <div class="muted">${escapeHtml(ev.date)}</div>
      ${String(ev.id||"").startsWith("auto_") || String(ev.id||"").startsWith("birthday_") ? "" : `<button class="btn danger mini-btn" data-del-cal="${escapeAttr(ev.id)}" style="margin-top:8px">削除</button>`}
    </div>
  `).join("") || `<div class="event-item muted">この日の記録なし</div>`;
  selectedDateEvents.querySelectorAll("[data-del-cal]").forEach(btn=>btn.onclick=()=>{
    if(!confirm("このカレンダー記録を削除する？")) return;
    const target=state.calendarEvents.find(ev=>ev.id===btn.dataset.delCal);
    if(target && target.type==="ペナルティー") applyCalendarPenalty(target.listener,-1);
    state.calendarEvents=state.calendarEvents.filter(ev=>ev.id!==btn.dataset.delCal);
    save();renderCalendar();renderMemo();renderBonus();
  });
}
if(window.prevMonth) prevMonth.onclick=()=>{calendarCursor=addMonths(calendarCursor,-1);renderCalendar();}
if(window.nextMonth) nextMonth.onclick=()=>{calendarCursor=addMonths(calendarCursor,1);renderCalendar();}
if(window.todayCalendar) todayCalendar.onclick=()=>{calendarCursor=new Date();selectedCalendarDate=ymd(new Date());renderCalendar();}

if(window.addCalendarType) addCalendarType.onclick=()=>{
  const name=newCalendarTypeName.value.trim();
  const color=newCalendarTypeColor.value || "#38bdf8";
  if(!name) return alert("種類名を入れてｗ");
  if((state.calendarTypes||[]).some(t=>t.name===name)) return alert("その種類はもうあるｗ");
  state.calendarTypes.push({name,color});
  newCalendarTypeName.value="";
  save();renderCalendar();
};

if(window.addCalendarEvent) addCalendarEvent.onclick=()=>{
  const listener=calendarListener.value;
  const type=calendarType.value;
  const item=calendarItem.value.trim() || type;
  if(!listener)return;
  state.calendarEvents.push({id:uid("cal"),date:selectedCalendarDate,listener,type,item});
  if(type==="登録日"){
    const l=state.listeners.find(x=>x.name===listener);
    if(l) l.registeredDate=selectedCalendarDate;
  }
  if(type==="ペナルティー"){
    applyCalendarPenalty(listener,1);
  }
  calendarItem.value="";
  save();renderCalendar();renderMemo();renderBonus();
}



function encodeUrlData(obj){
  const json=JSON.stringify(obj);
  const bytes=new TextEncoder().encode(json);
  let bin="";
  bytes.forEach(b=>bin+=String.fromCharCode(b));
  return btoa(bin);
}
function getFirebaseConfig(){
  const f=state.settings?.firebase || {};
  return {
    apiKey:f.apiKey || "",
    authDomain:f.authDomain || "",
    projectId:f.projectId || "",
    storageBucket:f.storageBucket || "",
    messagingSenderId:f.messagingSenderId || "",
    appId:f.appId || ""
  };
}
function firebaseReady(){
  const f=state.settings?.firebase || {};
  return !!(f.enabled && f.apiKey && f.projectId && f.appId);
}
function getPollVoteUrl(poll){
  const base=location.href.split("#")[0].split("?")[0].replace(/index\.html$/,"");
  const url=new URL("vote.html", base);
  const payload={
    poll:poll.id,
    title:poll.title || "",
    options:(poll.options||[]).map(o=>o.text || String(o))
  };
  url.searchParams.set("data", encodeUrlData(payload));
  // 古いURL形式との互換用
  url.searchParams.set("poll", poll.id);
  url.searchParams.set("title", poll.title || "");
  url.searchParams.set("options", payload.options.join("|"));
  if(firebaseReady()){
    url.searchParams.set("fb", encodeUrlData(getFirebaseConfig()));
  }
  return url.toString();
}
function getQrUrl(text){
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(text)}`;
}


let ssFirebaseApp=null;
let ssFirestore=null;
const pollUnsubs={};

function initSSFirebase(){
  if(!firebaseReady()) return null;
  if(ssFirestore) return ssFirestore;
  try{
    const cfg=getFirebaseConfig();
    ssFirebaseApp=firebase.apps && firebase.apps.length ? firebase.app() : firebase.initializeApp(cfg);
    ssFirestore=firebase.firestore();
    return ssFirestore;
  }catch(e){
    console.error(e);
    alert("Firebase初期化に失敗。設定を確認してｗ");
    return null;
  }
}
async function syncPollToFirebase(pi){
  const poll=state.polls[pi];
  if(!poll) return;
  const db=initSSFirebase();
  if(!db) return alert("Firebase設定が未完了。設定画面で有効化してねｗ");

  const docRef=db.collection("streamstaff_polls").doc(poll.id);
  const payload={
    id:poll.id,
    title:poll.title,
    options:poll.options.map(o=>({text:o.text,votes:Number(o.votes||0)})),
    updatedAt:firebase.firestore.FieldValue.serverTimestamp()
  };

  await docRef.set(payload,{merge:true});

  if(pollUnsubs[poll.id]) pollUnsubs[poll.id]();

  pollUnsubs[poll.id]=docRef.onSnapshot(snap=>{
    if(!snap.exists) return;
    const data=snap.data();
    const target=state.polls.find(p=>p.id===poll.id);
    if(!target || !data.options) return;
    target.options=target.options.map((o,i)=>({
      text:o.text,
      votes:Number(data.options[i]?.votes || 0)
    }));
    target.firebaseLive=true;
    save();
    renderPolls();
  });

  poll.firebaseLive=true;
  save();
  renderPolls();
  alert("Firebaseリアルタイム同期を開始した！");
}

function renderPolls(){
  if(window.pollPanelBody){
    pollPanelBody.classList.toggle("open", !!state.ui?.pollOpen);
    if(window.togglePollPanel) togglePollPanel.textContent=state.ui?.pollOpen ? "閉じる" : "開く";
  }
  if(window.togglePollPanel) togglePollPanel.onclick=()=>{
    state.ui=state.ui||{};
    state.ui.pollOpen=!state.ui.pollOpen;
    save();renderPolls();
  };
  if(!window.pollList) return;
  pollList.innerHTML=(state.polls||[]).map((poll,pi)=>{
    const total=poll.options.reduce((s,o)=>s+(o.votes||0),0);
    const options=poll.options.map((o,oi)=>{
      const pct=total ? Math.round((o.votes||0)/total*100) : 0;
      return `<div class="poll-option">
        <div class="row" style="justify-content:space-between">
          <b>${escapeHtml(o.text)}</b>
          <span class="poll-votes">${o.votes||0}票 / ${pct}%</span>
        </div>
        <div class="poll-bar"><div class="poll-fill" style="width:${pct}%"></div></div>
        <div class="row" style="margin-top:8px">
          <button class="btn primary mini-btn" data-poll-plus="${pi}" data-option="${oi}">＋1</button>
          <button class="btn mini-btn" data-poll-minus="${pi}" data-option="${oi}">−1</button>
        </div>
      </div>`;
    }).join("");
    return `<div class="poll-box">
      <div class="row" style="justify-content:space-between">
        <div>
          <h3 style="margin:0">${escapeHtml(poll.title)}</h3>
          <div class="muted">合計 ${total}票</div>
          <div class="firebase-sync-badge ${poll.firebaseLive ? "" : "off"}">${poll.firebaseLive ? "Firebase LIVE" : "Local"}</div>
        </div>
        <div class="row">
          <button class="btn mini-btn" data-poll-firebase="${pi}">Firebase同期</button>
          <button class="btn danger mini-btn" data-poll-delete="${pi}">削除</button>
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn mini-btn" data-poll-share="${pi}">URL / QR表示</button>
      </div>
      <div class="poll-share" data-poll-share-box="${pi}">
        <b>リスナー投票URL</b>
        <div class="poll-url">${escapeHtml(getPollVoteUrl(poll))}</div>
        <div class="row" style="margin-top:8px">
          <button class="btn primary mini-btn" data-copy-poll-url="${pi}">URLコピー</button>
          <a class="btn mini-btn" href="${escapeHtml(getPollVoteUrl(poll))}" target="_blank">投票ページを開く</a>
        </div>
        <img class="poll-qr" src="${escapeHtml(getQrUrl(getPollVoteUrl(poll)))}" alt="投票QR">
        <div class="muted" style="margin-top:8px">※Firebase設定済みなら、このURLからリアルタイム投票できます。QR生成にはネット接続が必要。</div>
      </div>
      ${options}
      <div class="row" style="margin-top:10px">
        <button class="btn mini-btn" data-poll-reset="${pi}">投票リセット</button>
      </div>
    </div>`;
  }).join("") || `<div class="poll-box muted">投票なし</div>`;

  pollList.querySelectorAll("[data-poll-plus]").forEach(btn=>btn.onclick=()=>{
    const p=state.polls[Number(btn.dataset.pollPlus)];
    const o=p.options[Number(btn.dataset.option)];
    o.votes=(o.votes||0)+1;
    save();renderPolls();
  });
  pollList.querySelectorAll("[data-poll-minus]").forEach(btn=>btn.onclick=()=>{
    const p=state.polls[Number(btn.dataset.pollMinus)];
    const o=p.options[Number(btn.dataset.option)];
    o.votes=Math.max(0,(o.votes||0)-1);
    save();renderPolls();
  });
  pollList.querySelectorAll("[data-poll-reset]").forEach(btn=>btn.onclick=()=>{
    const p=state.polls[Number(btn.dataset.pollReset)];
    if(!confirm(`${p.title} の票をリセットする？`)) return;
    p.options.forEach(o=>o.votes=0);
    save();renderPolls();
  });
  pollList.querySelectorAll("[data-poll-firebase]").forEach(btn=>btn.onclick=()=>syncPollToFirebase(Number(btn.dataset.pollFirebase)));
  pollList.querySelectorAll("[data-poll-delete]").forEach(btn=>btn.onclick=()=>{
    const i=Number(btn.dataset.pollDelete);
    if(!confirm(`${state.polls[i].title} を削除する？`)) return;
    state.polls.splice(i,1);
    save();renderPolls();
  });
  pollList.querySelectorAll("[data-poll-share]").forEach(btn=>btn.onclick=()=>{
    const i=Number(btn.dataset.pollShare);
    if(firebaseReady() && !state.polls[i].firebaseLive){
      syncPollToFirebase(i);
    }
    const box=pollList.querySelector(`[data-poll-share-box="${i}"]`);
    if(box) box.classList.toggle("open");
  });
  pollList.querySelectorAll("[data-copy-poll-url]").forEach(btn=>btn.onclick=async()=>{
    const i=Number(btn.dataset.copyPollUrl);
    const url=getPollVoteUrl(state.polls[i]);
    try{
      await navigator.clipboard.writeText(url);
      alert("投票URLをコピーした！");
    }catch(e){
      prompt("コピーできなかったから手動でコピーしてｗ", url);
    }
  });
}
if(window.addPoll) addPoll.onclick=()=>{
  const title=newPollTitle.value.trim() || "新しい投票";
  const options=newPollOptions.value.split(",").map(x=>x.trim()).filter(Boolean);
  if(options.length<2) return alert("選択肢は2つ以上ほしいｗ");
  state.polls.push({
    id:uid("poll"),
    title,
    options:options.map(text=>({text,votes:0})),
    memo:""
  });
  newPollTitle.value="";
  newPollOptions.value="";
  save();renderPolls();
}

const timerSounds=[
  {id:"hato1",label:"鳩時計1"},
  {id:"hato2",label:"鳩時計2"},
  {id:"alarm_clock",label:"目覚まし時計"},
  {id:"wall_clock",label:"柱時計の鐘"},
  {id:"sponsor",label:"スポンサー提供"},
  {id:"closed",label:"営業終了アナウンス"}
];
let timerTick=null;
function uid(prefix){return prefix+"_"+Date.now()+"_"+Math.random().toString(36).slice(2,7)}
function fmtTime(sec){
  sec=Math.max(0,Number(sec)||0);
  const m=Math.floor(sec/60);
  const s=sec%60;
  return `${m}:${String(s).padStart(2,"0")}`;
}
function playAlarm(sound){
  const a=document.getElementById("alarm_"+sound);
  if(!a) return;
  try{
    a.volume=(state.settings?.alarmVolume ?? 80)/100;
    a.currentTime=0;
    a.play().catch(()=>{});
  }catch(e){}
}

function formatCountdown(ms){
  if(ms<=0) return "00日 00:00:00";
  const total=Math.floor(ms/1000);
  const days=Math.floor(total/86400);
  const hours=Math.floor((total%86400)/3600);
  const mins=Math.floor((total%3600)/60);
  const secs=total%60;
  return `${String(days).padStart(2,"0")}日 ${String(hours).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}
function renderCountdowns(){
  setupToolCollapse();
  if(!window.countdownList) return;

  countdownList.innerHTML=(state.countdowns||[]).map((c,i)=>{
    const diff=new Date(c.target).getTime()-Date.now();
    const done=diff<=0;
    if(!done && c.finishedPlayed) c.finishedPlayed=false;

    if(done && !c.finishedPlayed){
      c.finishedPlayed=true;
      try{
        const a=new Audio(c.sound || "assets/countdown/学校のチャイム.mp3");
        a.volume=(state.settings?.masterVolume ?? 70)/100;
        a.play();
      }catch(e){}
      save();
    }
    return `<div class="countdown-box ${done ? "countdown-finished" : ""}">
      <div class="row" style="justify-content:space-between">
        <div>
          <h3 style="margin:0">${escapeHtml(c.title)}</h3>
          <div class="countdown-label">${escapeHtml(c.target.replace("T"," "))}</div>
          <div class="countdown-label">通知音：${escapeHtml((c.sound||"").split("/").pop().replace(".mp3",""))}</div>
        </div>
        <button class="btn danger mini-btn" data-del-countdown="${i}">削除</button>
      </div>

      <div class="countdown-time">
        ${done ? "🎉 到達！" : formatCountdown(diff)}
      </div>
    </div>`;
  }).join("") || `<div class="countdown-box muted">カウントダウンなし</div>`;

  countdownList.querySelectorAll("[data-del-countdown]").forEach(btn=>btn.onclick=()=>{
    const i=Number(btn.dataset.delCountdown);
    if(!confirm(`${state.countdowns[i].title} を削除する？`)) return;
    state.countdowns.splice(i,1);
    save();
    renderCountdowns();
  });
}

if(window.addCountdown) addCountdown.onclick=()=>{
  const title=newCountdownTitle.value.trim() || "カウントダウン";
  const target=newCountdownTarget.value;
  if(!target) return alert("日時を入れてｗ");

  state.countdowns.push({
    id:uid("countdown"),
    title,
    target,
    sound:newCountdownSound.value,
    finishedPlayed:false
  });

  newCountdownTitle.value="";
  newCountdownTarget.value="";
  save();
  renderCountdowns();
};

setInterval(()=>{
  renderCountdowns();
},1000);


function setupToolCollapse(){
  const pairs=[
    ["rouletteOpen","toggleRoulettePanel","roulettePanelBody"],
    ["countersOpen","toggleCountersPanel","countersPanelBody"],
    ["timersOpen","toggleTimersPanel","timersPanelBody"],
    ["countdownsOpen","toggleCountdownsPanel","countdownsPanelBody"]
  ];
  pairs.forEach(([key,btnId,bodyId])=>{
    const btn=document.getElementById(btnId);
    const body=document.getElementById(bodyId);
    if(!btn || !body) return;
    body.classList.toggle("open", !!state.ui[key]);
    btn.textContent=state.ui[key] ? "閉じる" : "開く";
    btn.onclick=()=>{
      state.ui[key]=!state.ui[key];
      save();
      setupToolCollapse();
    };
  });
}


let rouletteRotation=0;
let rouletteSpinning=false;

function renderRoulette(){
  const itemsBox=document.getElementById("rouletteItems");
  const histBox=document.getElementById("rouletteHistory");
  const card=document.getElementById("rouletteGameCard");
  const toggle=document.getElementById("toggleRoulettePanel");

  state.roulette = state.roulette || {items:[],history:[]};
  state.roulette.items = state.roulette.items || [];
  state.roulette.history = state.roulette.history || [];
  state.ui = state.ui || {};
  if(typeof state.ui.rouletteOpen!=="boolean") state.ui.rouletteOpen=true;

  if(card){
    card.classList.toggle("open", state.ui.rouletteOpen);
  }
  if(toggle){
    toggle.textContent=state.ui.rouletteOpen ? "閉じる" : "開く";
  }

  if(itemsBox){
    const items=state.roulette.items;
    itemsBox.innerHTML=items.map((item,i)=>`
      <div class="roulette-item">
        <div class="row" style="justify-content:space-between">
          <b>${escapeHtml(item)}</b>
          <button class="btn danger mini-btn" data-del-roulette="${i}" type="button">削除</button>
        </div>
      </div>
    `).join("") || `<div class="roulette-item muted">項目なし</div>`;
  }

  if(histBox){
    histBox.innerHTML=(state.roulette.history||[]).slice(0,10).map(h=>`
      <div>${escapeHtml(h.time)}：<b>${escapeHtml(h.result)}</b></div>
    `).join("") || `<div>履歴なし</div>`;
  }
}


function renderTools(){
  setupToolCollapse();
  renderRoulette();
  renderPolls();
  if(!window.counterList) return;
  newTimerSound.innerHTML=timerSounds.map(s=>`<option value="${s.id}">${s.label}</option>`).join("");

  counterList.innerHTML=state.tools.counters.map((c,i)=>`
    <div class="tool-item">
      <div class="row" style="justify-content:space-between">
        <input value="${escapeAttr(c.name)}" data-counter-name="${i}" style="max-width:65%">
        <button class="btn danger mini-btn" data-counter-del="${i}">削除</button>
      </div>
      <div class="row" style="justify-content:space-between;margin-top:12px">
        <div class="count-value">${c.value||0}</div>
        <div class="row">
          <button class="btn mini-btn" data-counter-minus="${i}">−</button>
          <button class="btn primary mini-btn" data-counter-plus="${i}">＋</button>
          <button class="btn mini-btn" data-counter-reset="${i}">リセット</button>
        </div>
      </div>
    </div>
  `).join("") || `<div class="tool-item muted">カウンターなし</div>`;

  timerList.innerHTML=state.tools.timers.map((t,i)=>`
    <div class="tool-item ${t.running?"running":""} ${t.done?"done":""}">
      <div class="row" style="justify-content:space-between">
        <input value="${escapeAttr(t.name)}" data-timer-name="${i}" style="max-width:58%">
        <button class="btn danger mini-btn" data-timer-del="${i}">削除</button>
      </div>
      <div class="row" style="justify-content:space-between;margin-top:12px">
        <div class="timer-value">${fmtTime(t.remaining)}</div>
        <div class="row">
          <button class="btn primary mini-btn" data-timer-toggle="${i}">${t.running?"停止":"開始"}</button>
          <button class="btn mini-btn" data-timer-reset="${i}">リセット</button>
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <label style="margin:0">時間</label>
        <input type="number" min="0" value="${Math.floor((t.duration||0)/60)}" data-timer-min="${i}" style="max-width:82px">
        <span>分</span>
        <input type="number" min="0" max="59" value="${(t.duration||0)%60}" data-timer-sec="${i}" style="max-width:82px">
        <span>秒</span>
        <select data-timer-sound="${i}" style="max-width:180px">
          ${timerSounds.map(s=>`<option value="${s.id}" ${t.sound===s.id?"selected":""}>${s.label}</option>`).join("")}
        </select>
        <button class="btn mini-btn" data-timer-test="${i}">音テスト</button>
      </div>
    </div>
  `).join("") || `<div class="tool-item muted">タイマーなし</div>`;

  bindToolButtons();
  ensureTimerTick();
}
function bindToolButtons(){
  counterList.querySelectorAll("[data-counter-name]").forEach(inp=>inp.onchange=()=>{state.tools.counters[Number(inp.dataset.counterName)].name=inp.value;save();renderTools()});
  counterList.querySelectorAll("[data-counter-plus]").forEach(btn=>btn.onclick=()=>{state.tools.counters[Number(btn.dataset.counterPlus)].value++;save();renderTools()});
  counterList.querySelectorAll("[data-counter-minus]").forEach(btn=>btn.onclick=()=>{const c=state.tools.counters[Number(btn.dataset.counterMinus)];c.value=Math.max(0,(c.value||0)-1);save();renderTools()});
  counterList.querySelectorAll("[data-counter-reset]").forEach(btn=>btn.onclick=()=>{state.tools.counters[Number(btn.dataset.counterReset)].value=0;save();renderTools()});
  counterList.querySelectorAll("[data-counter-del]").forEach(btn=>btn.onclick=()=>{const i=Number(btn.dataset.counterDel); if(confirm(`${state.tools.counters[i].name} を削除する？`)){state.tools.counters.splice(i,1);save();renderTools()}});

  timerList.querySelectorAll("[data-timer-name]").forEach(inp=>inp.onchange=()=>{state.tools.timers[Number(inp.dataset.timerName)].name=inp.value;save();renderTools()});
  timerList.querySelectorAll("[data-timer-toggle]").forEach(btn=>btn.onclick=()=>toggleTimer(Number(btn.dataset.timerToggle)));
  timerList.querySelectorAll("[data-timer-reset]").forEach(btn=>btn.onclick=()=>resetTimer(Number(btn.dataset.timerReset)));
  timerList.querySelectorAll("[data-timer-del]").forEach(btn=>btn.onclick=()=>{const i=Number(btn.dataset.timerDel); if(confirm(`${state.tools.timers[i].name} を削除する？`)){state.tools.timers.splice(i,1);save();renderTools()}});
  timerList.querySelectorAll("[data-timer-min], [data-timer-sec]").forEach(inp=>inp.onchange=()=>updateTimerDurationFromInputs(inp));
  timerList.querySelectorAll("[data-timer-sound]").forEach(sel=>sel.onchange=()=>{state.tools.timers[Number(sel.dataset.timerSound)].sound=sel.value;save();});
  timerList.querySelectorAll("[data-timer-test]").forEach(btn=>btn.onclick=()=>playAlarm(state.tools.timers[Number(btn.dataset.timerTest)].sound));
}
function updateTimerDurationFromInputs(inp){
  const i=Number(inp.dataset.timerMin ?? inp.dataset.timerSec);
  const minEl=timerList.querySelector(`[data-timer-min="${i}"]`);
  const secEl=timerList.querySelector(`[data-timer-sec="${i}"]`);
  const duration=Math.max(1,(Number(minEl.value)||0)*60 + Math.min(59,Number(secEl.value)||0));
  const t=state.tools.timers[i];
  t.duration=duration;
  if(!t.running) t.remaining=duration;
  t.done=false;
  save();renderTools();
}
function toggleTimer(i){
  const t=state.tools.timers[i];
  if(!t)return;
  if(t.remaining<=0) t.remaining=t.duration;
  t.running=!t.running;
  t.done=false;
  save();renderTools();
}
function resetTimer(i){
  const t=state.tools.timers[i];
  if(!t)return;
  t.running=false;
  t.done=false;
  t.remaining=t.duration;
  save();renderTools();
}
function ensureTimerTick(){
  if(timerTick) return;
  timerTick=setInterval(()=>{
    let changed=false, needRender=false;
    state.tools.timers.forEach(t=>{
      if(t.running){
        t.remaining=Math.max(0,(t.remaining||0)-1);
        changed=true;
        needRender=true;
        if(t.remaining<=0){
          t.running=false;
          t.done=true;
          playAlarm(t.sound);
        }
      }
    });
    if(changed) save();
    if(needRender && document.getElementById("tools").classList.contains("active")) renderTools();
  },1000);
}
if(window.addCounter) addCounter.onclick=()=>{
  const name=newCounterName.value.trim() || "新しいカウンター";
  state.tools.counters.push({id:uid("c"),name,value:0});
  newCounterName.value="";
  save();renderTools();
}
if(window.addTimer) addTimer.onclick=()=>{
  const name=newTimerName.value.trim() || "新しいタイマー";
  const duration=Math.max(1,(Number(newTimerMinutes.value)||0)*60 + Math.min(59,Number(newTimerSeconds.value)||0));
  state.tools.timers.push({id:uid("t"),name,duration,remaining:duration,running:false,sound:newTimerSound.value||"hato1",done:false});
  newTimerName.value="";
  save();renderTools();
}

function encodeSaveData(obj){
  const json=JSON.stringify(obj);
  const bytes=new TextEncoder().encode(json);
  let binary="";
  bytes.forEach(b=>binary+=String.fromCharCode(b));
  return "STREAMBASE1:" + btoa(binary);
}
function decodeSaveData(code){
  const raw=String(code||"").trim();
  if(!raw.startsWith("STREAMBASE1:")) throw new Error("保存文字列の形式が違う");
  const b64=raw.replace("STREAMBASE1:","");
  const binary=atob(b64);
  const bytes=new Uint8Array([...binary].map(ch=>ch.charCodeAt(0)));
  const json=new TextDecoder().decode(bytes);
  return JSON.parse(json);
}
function refreshAll(){
  save();
  renderHome();
  renderGames();
  renderBonus();
  renderMemo();
  renderChLog();
  renderChinMode();
  renderSettings();
  renderFirebaseSettings();
  renderCalendar();
  renderTools();
  renderPolls();
  renderRoulette();
  renderCountdowns();
  applyVolumes();
}
if(window.exportDataCode) exportDataCode.onclick=()=>{
  dataCodeBox.value=encodeSaveData(state);
};
if(window.copyDataCode) copyDataCode.onclick=async()=>{
  if(!dataCodeBox.value.trim()) dataCodeBox.value=encodeSaveData(state);
  try{
    await navigator.clipboard.writeText(dataCodeBox.value);
    alert("コピーした！");
  }catch(e){
    dataCodeBox.select();
    document.execCommand("copy");
    alert("コピーした！ たぶん！");
  }
};
if(window.importDataCode) importDataCode.onclick=()=>{
  try{
    const next=decodeSaveData(dataCodeBox.value);
    if(!confirm("この保存文字列を読み込む？\\n今のデータは上書きされるよ。")) return;
    state=next;
    state.settings = state.settings || structuredClone(defaultState.settings);
    if(typeof state.settings.alarmVolume!=="number") state.settings.alarmVolume=80;
    state.calendarEvents = state.calendarEvents || [];
    state.calendarTypes = state.calendarTypes || structuredClone(defaultState.calendarTypes || []);
    if(!state.calendarTypes.length) state.calendarTypes = structuredClone(defaultState.calendarTypes || []);
    state.polls = state.polls || structuredClone(defaultState.polls || []);
    state.logboMonth = state.logboMonth || ym(new Date());
    state.listeners = state.listeners || [];
    state.listeners.forEach(l=>{
      l.logboByMonth = l.logboByMonth || {};
      if(Array.isArray(l.days) && !l.logboByMonth[state.logboMonth]) l.logboByMonth[state.logboMonth]=[...l.days].sort((a,b)=>a-b);
      l.days=getLogboDays(l);
    });
    state.polls = state.polls || structuredClone(defaultState.polls || []);
state.tools = state.tools || structuredClone(defaultState.tools);
    state.tools.counters = state.tools.counters || [];
    state.tools.timers = state.tools.timers || [];
    state.chin = state.chin || structuredClone(defaultState.chin);
    state.chin.diceCount = state.chin.diceCount || 3;
    state.chin.diceNames = state.chin.diceNames || structuredClone(defaultState.chin.diceNames);
    state.chin.customDice = state.chin.customDice || structuredClone(defaultState.chin.customDice);
    state.chin.localMap = state.chin.localMap || {};
    state.customGames = state.customGames || structuredClone(defaultState.customGames);
    for (const k in defaultState.customGames) state.customGames[k] = state.customGames[k] || structuredClone(defaultState.customGames[k]);
    state.listeners = state.listeners || [];
    state.listeners.forEach(l=>{ if(typeof l.penalty!=="number") l.penalty=0; if(typeof l.registeredDate!=="string") l.registeredDate="";
  if(typeof l.birthday!=="string") l.birthday="";
  if(typeof l.birthYear!=="string") l.birthYear="";
  if(typeof l.bloodType!=="string") l.bloodType="";
  if(typeof l.firstVisitDate!=="string") l.firstVisitDate="";
  if(typeof l.nickname!=="string") l.nickname="";
  if(!l.favorites) l.favorites={};
  ["project","game","food","area","music","anime","habit","free1","free2","ngTopic","dislikeFood","firstGame","mainWeapon","holiday","bgm","localThing","season","animal","oshi","firstStream","oneLine","teaseLine"].forEach(k=>{ if(typeof l.favorites[k]!=="string") l.favorites[k]=""; });
  if(!Array.isArray(l.topicSeeds)) l.topicSeeds=[]; });
    selectedListener=0;
    refreshAll();
    alert("読み込んだ！");
  }catch(e){
    alert("読み込み失敗：保存文字列が違うか壊れてるかも");
  }
};

function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}
function escapeAttr(s){return escapeHtml(s).replace(/"/g,"&quot;")}

renderHome();renderGames();renderBonus();renderMemo();renderCalendar();renderChLog();renderChinMode();renderSettings();renderTools();renderPolls();renderRoulette();renderCountdowns();applyVolumes();ensureTimerTick();


document.addEventListener("click",(e)=>{
  if(e.target && e.target.id==="openFirebaseHelp"){
    const modal=document.getElementById("firebaseHelpModal");
    if(modal) modal.classList.add("open");
  }
  if(e.target && e.target.id==="closeFirebaseHelp"){
    const modal=document.getElementById("firebaseHelpModal");
    if(modal) modal.classList.remove("open");
  }
  if(e.target && e.target.id==="firebaseHelpModal"){
    e.target.classList.remove("open");
  }
});
document.addEventListener("keydown",(e)=>{
  if(e.key==="Escape"){
    const modal=document.getElementById("firebaseHelpModal");
    if(modal) modal.classList.remove("open");
  }
});


document.addEventListener("click",(e)=>{
  const t=e.target;
  if(!t) return;

  if(t.id==="addRouletteItem"){
    const input=document.getElementById("newRouletteItem");
    const v=input?.value.trim();
    if(!v) return;
    state.roulette=state.roulette||{items:[],history:[]};
    state.roulette.items.push(v);
    input.value="";
    save();renderRoulette();
  }

  if(t.id==="shuffleRoulette"){
    const arr=state.roulette?.items||[];
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    save();renderRoulette();
  }

  if(t.id==="clearRouletteHistory"){
    if(!confirm("ルーレット履歴を削除する？")) return;
    state.roulette.history=[];
    save();renderRoulette();
  }

  if(t.id==="spinRoulette"){
    spinCasinoRoulette();
  }

  if(t.dataset && t.dataset.delRoulette!==undefined){
    const i=Number(t.dataset.delRoulette);
    state.roulette.items.splice(i,1);
    save();renderRoulette();
  }
});

function spinCasinoRoulette(){
  if(rouletteSpinning) return;
  const items=state.roulette?.items || [];
  if(items.length<2) return alert("ルーレット項目は2個以上ほしいｗ");

  const stage=document.getElementById("rouletteStage");
  const wheel=document.getElementById("rouletteWheel");
  const resultEl=document.getElementById("rouletteResult");
  if(!stage || !wheel || !resultEl) return alert("ルーレット表示が見つからないｗ");

  rouletteSpinning=true;
  stage.classList.remove("hit");
  resultEl.classList.remove("show");
  resultEl.textContent="回転中…";

  const winnerIndex=Math.floor(Math.random()*items.length);
  const winner=items[winnerIndex];

  rouletteRotation += 360*6 + Math.floor(Math.random()*360);
  wheel.style.transform=`rotate(${rouletteRotation}deg)`;

  setTimeout(()=>{
    resultEl.textContent=winner;
    resultEl.classList.add("show");
    stage.classList.add("hit");
    state.roulette.history.unshift({
      time:new Date().toLocaleTimeString("ja-JP"),
      result:winner
    });
    state.roulette.history=state.roulette.history.slice(0,30);
    save();renderRoulette();
    try{ playAlarm("sponsor"); }catch(e){}
    rouletteSpinning=false;
  },4200);
}


document.addEventListener("click",(e)=>{
  const t=e.target;
  if(!t) return;

  if(t.id==="toggleRoulettePanel"){
    state.ui=state.ui||{};
    state.ui.rouletteOpen=!state.ui.rouletteOpen;
    save();
    renderRoulette();
    return;
  }

  if(t.id==="addRouletteItem"){
    const input=document.getElementById("newRouletteItem");
    const v=input?.value.trim();
    if(!v) return;
    state.roulette=state.roulette||{items:[],history:[]};
    state.roulette.items=state.roulette.items||[];
    state.roulette.items.push(v);
    input.value="";
    save();
    renderRoulette();
    return;
  }

  if(t.id==="shuffleRoulette"){
    const arr=state.roulette?.items||[];
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    save();
    renderRoulette();
    return;
  }

  if(t.id==="clearRouletteHistory"){
    if(!confirm("ルーレット履歴を削除する？")) return;
    state.roulette=state.roulette||{items:[],history:[]};
    state.roulette.history=[];
    save();
    renderRoulette();
    return;
  }

  if(t.id==="spinRoulette"){
    spinCasinoRoulette();
    return;
  }

  if(t.dataset && t.dataset.delRoulette!==undefined){
    const i=Number(t.dataset.delRoulette);
    if(state.roulette?.items) state.roulette.items.splice(i,1);
    save();
    renderRoulette();
    return;
  }
});

function spinCasinoRoulette(){
  if(rouletteSpinning) return;
  state.roulette=state.roulette||{items:[],history:[]};
  const items=state.roulette.items || [];
  if(items.length<2) return alert("ルーレット項目は2個以上ほしいｗ");

  const stage=document.getElementById("rouletteStage");
  const wheel=document.getElementById("rouletteWheel");
  const resultEl=document.getElementById("rouletteResult");
  if(!stage || !wheel || !resultEl) return alert("ルーレット表示が見つからないｗ");

  rouletteSpinning=true;
  stage.classList.remove("hit");
  resultEl.classList.remove("show");
  resultEl.textContent="回転中…";

  const winnerIndex=Math.floor(Math.random()*items.length);
  const winner=items[winnerIndex];

  rouletteRotation += 360*6 + Math.floor(Math.random()*360);
  wheel.style.transform=`rotate(${rouletteRotation}deg)`;

  setTimeout(()=>{
    resultEl.textContent=winner;
    resultEl.classList.add("show");
    stage.classList.add("hit");
    state.roulette.history=state.roulette.history||[];
    state.roulette.history.unshift({
      time:new Date().toLocaleTimeString("ja-JP"),
      result:winner
    });
    state.roulette.history=state.roulette.history.slice(0,30);
    save();
    renderRoulette();
    try{ playAlarm("sponsor"); }catch(e){}
    rouletteSpinning=false;
  },4200);
}

document.addEventListener("DOMContentLoaded",()=>renderRoulette());


;

/* v71 roulette audio + bet rules */
(function(){
  let rouletteRotationV71 = 0;
  let rouletteSpinningV71 = false;
  let tickTimerV71 = null;

  const casinoNumbers = ["0","32","15","19","4","21","2","25","17","34","6","27","13","36","11","30","8","23","10","5","24","16","33","1","20","14","31","9","22","18","29","7","28","12","35","3","26"];
  const redNums = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);

  function ensureRouletteState(){
    window.state = window.state || {};
    state.roulette = state.roulette || {};
    if(!state.roulette.mode) state.roulette.mode = "custom";
    if(!Array.isArray(state.roulette.items) || state.roulette.items.length < 1){
      state.roulette.items = ["チンチロ","大喜利","雑談","罰ゲーム","歌う","モノマネ"];
    }
    if(!Array.isArray(state.roulette.history)) state.roulette.history = [];
    if(!Array.isArray(state.roulette.bets)) state.roulette.bets = [];
    if(!Array.isArray(state.roulette.guestBetters)) state.roulette.guestBetters = [];
    state.hostProfile = Object.assign({name:"", memo:"", ngWords:"", loveFantasy:false, talkSettings:{clockEnabled:"on", clockPosition:"right", neonColor:"#39d0ff", bgTheme:"cyber", font:"system", shadow:"on", glow:"on"}}, state.hostProfile || {});
    state.hostProfile.talkSettings = Object.assign({clockEnabled:"on", clockPosition:"right", neonColor:"#39d0ff", bgTheme:"cyber", font:"system", shadow:"on", glow:"on"}, state.hostProfile.talkSettings || {});

    state.roulette.settings = Object.assign({
      bgmVolume:50,
      seVolume:80,
      betLimit:"all",
      enableNumber:true,
      enableColor:true,
      enableOddEven:true,
      enableRange:true
    }, state.roulette.settings || {});
  }

  function safeSave(){ try{ if(typeof save === "function") save(); }catch(e){} }

  function esc(s){
    return String(s).replace(/[&<>"']/g,function(m){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m];
    });
  }

  function audioEl(id){ return document.getElementById(id); }

  function setAudioVolumes(){
    ensureRouletteState();
    const bgm = audioEl("rouletteBgm");
    if(bgm) bgm.volume = Number(state.roulette.settings.bgmVolume || 0) / 100;

    ["seRouletteKakugo","seRouletteSpin","seRouletteSlow","seRouletteCard","seRouletteCoin","seRouletteResult","seRoulettePolice"].forEach(function(id){
      const a = audioEl(id);
      if(a) a.volume = Number(state.roulette.settings.seVolume || 0) / 100;
    });
  }

  function playAudio(id, restart){
    setAudioVolumes();
    const a = audioEl(id);
    if(!a) return;
    try{
      if(restart !== false) a.currentTime = 0;
      a.play().catch(function(){});
    }catch(e){}
  }

  function stopAudio(id){
    const a = audioEl(id);
    if(!a) return;
    try{ a.pause(); a.currentTime = 0; }catch(e){}
  }

  function stopRouletteSfx(){
    ["seRouletteSpin","seRouletteSlow"].forEach(stopAudio);
  }

  function startRouletteBgm(){
    setAudioVolumes();
    const bgm = audioEl("rouletteBgm");
    if(!bgm) return;
    try{ bgm.loop = true; bgm.play().catch(function(){}); }catch(e){}
  }

  function stopRouletteBgm(){
    stopAudio("rouletteBgm");
  }

  const originalShowScreen = window.showScreen;
  if(typeof originalShowScreen === "function" && !window.__rouletteShowScreenPatched){
    window.showScreen = function(id){
      const result = originalShowScreen.apply(this, arguments);
      if(id === "roulette"){
        startRouletteBgm();
      }else{
        stopRouletteBgm();
        stopRouletteSfx();
      }
      return result;
    };
    window.__rouletteShowScreenPatched = true;
  }

  function getBetters(){
    ensureRouletteState();
    const host = state.hostProfile && state.hostProfile.name ? [state.hostProfile.name] : [];
    const listeners = Array.isArray(state.listeners) ? state.listeners.map(function(l){ return l.name; }).filter(Boolean) : [];
    return Array.from(new Set(host.concat(listeners).concat(state.roulette.guestBetters || [])));
  }

  function isHostBetter(name){
    return !!(state.hostProfile && state.hostProfile.name && name === state.hostProfile.name);
  }

  function currentSlots(){
    ensureRouletteState();
    if(state.roulette.mode === "casino"){
      return casinoNumbers.map(function(n){
        const num = Number(n);
        return {
          label:n,
          value:n,
          color:n === "0" ? "#047857" : (redNums.has(num) ? "#b91c1c" : "#030712")
        };
      });
    }
    const colors = ["#b91c1c", "#030712", "#047857"];
    return state.roulette.items.map(function(item,i){
      return { label:item, value:item, color:colors[i % colors.length] };
    });
  }

  function betType(bet){
    const parts = String(bet).split(":");
    if(parts[0] === "number") return "number";
    if(parts[0] === "color") return "color";
    if(parts[0] === "type") return "oddEven";
    if(parts[0] === "range") return "range";
    return "unknown";
  }

  function betAllowed(bet){
    ensureRouletteState();
    const s = state.roulette.settings;
    const t = betType(bet);
    if(t === "number") return !!s.enableNumber;
    if(t === "color") return !!s.enableColor;
    if(t === "oddEven") return !!s.enableOddEven;
    if(t === "range") return !!s.enableRange;
    return true;
  }

  function betOdds(bet){
    return betType(bet) === "number" ? "36x" : "2x";
  }

  function uniqueBetTypesCount(nextBet){
    ensureRouletteState();
    const set = new Set(state.roulette.bets.map(function(b){ return b.bet; }));
    if(nextBet) set.add(nextBet);
    return set.size;
  }

  function canAddBetType(nextBet){
    ensureRouletteState();
    const limit = state.roulette.settings.betLimit;
    if(limit === "all") return true;
    const n = Number(limit);
    if(!n) return true;
    return uniqueBetTypesCount(nextBet) <= n;
  }

  function renderWheel(){
    const segments = document.getElementById("rouletteSegments");
    const labels = document.getElementById("rouletteLabelLayer");
    const slots = currentSlots();
    if(!segments || !labels || !slots.length) return;

    const slice = 360 / slots.length;
    segments.style.background = "conic-gradient(" + slots.map(function(s,i){
      return s.color + " " + (i*slice) + "deg " + ((i+1)*slice) + "deg";
    }).join(",") + ")";

    labels.innerHTML = slots.map(function(s,i){
      const a = i * slice + slice / 2;
      const cls = state.roulette.mode === "casino" ? "roulette-label casino-label" : "roulette-label";
      const raw = String(s.label);
      const text = esc(raw.length > 10 ? raw.slice(0,10) + "…" : raw);
      return '<span class="' + cls + '" style="--a:' + a + 'deg">' + text + '</span>';
    }).join("");
  }

  function renderZoom(main, sub, hot){
    const zMain = document.getElementById("rouletteZoomMain");
    const zSub = document.getElementById("rouletteZoomSub");
    const box = document.getElementById("rouletteZoomWindow");
    if(zMain){
      zMain.textContent = main;
      zMain.classList.remove("tick");
      void zMain.offsetWidth;
      zMain.classList.add("tick");
    }
    if(zSub) zSub.textContent = sub || "";
    if(box) box.classList.toggle("hot", !!hot);
  }

  function betLabel(bet){
    if(!bet) return "";
    const parts = String(bet).split(":");
    const type = parts[0];
    const val = parts[1];
    if(type === "number") return val;
    if(type === "color") return val === "red" ? "RED" : "BLACK";
    if(type === "type") return val === "even" ? "EVEN" : "ODD";
    if(type === "range") return val;
    return bet;
  }

  function isWinningBet(bet, result){
    const n = Number(result);
    const parts = String(bet).split(":");
    const type = parts[0];
    const val = parts[1];
    if(type === "number") return String(result) === val;
    if(result === "0") return false;
    if(type === "color"){
      const isRed = redNums.has(n);
      return (val === "red" && isRed) || (val === "black" && !isRed);
    }
    if(type === "type"){
      return (val === "even" && n % 2 === 0) || (val === "odd" && n % 2 === 1);
    }
    if(type === "range"){
      if(val === "1-18") return n >= 1 && n <= 18;
      if(val === "19-36") return n >= 19 && n <= 36;
    }
    return false;
  }

  function renderBetBoard(){
    ensureRouletteState();
    const grid = document.getElementById("rouletteNumberBetGrid");
    const select = document.getElementById("rouletteBetterSelect");
    const list = document.getElementById("rouletteBetList");

    if(grid && !grid.dataset.ready){
      grid.innerHTML = Array.from({length:36}, function(_,i){
        const n = i + 1;
        const cls = redNums.has(n) ? "red" : "black";
        return '<button class="bet-cell ' + cls + '" data-bet="number:' + n + '" type="button">' + n + '<span class="bet-odds">36x</span></button>';
      }).join("");
      grid.dataset.ready = "1";
    }

    const betters = getBetters();
    if(select){
      const current = select.value;
      select.innerHTML = betters.length
        ? betters.map(function(name){
            const label = isHostBetter(name) ? "★ " + name + "（枠主）" : name;
            return '<option value="' + esc(name) + '">' + esc(label) + '</option>';
          }).join("")
        : '<option value="">登録者なし</option>';
      if(current) select.value = current;
    }

    document.querySelectorAll("[data-bet]").forEach(function(cell){
      const bet = cell.dataset.bet;
      const bets = state.roulette.bets.filter(function(b){ return b.bet === bet; });
      cell.classList.toggle("disabled-bet", !betAllowed(bet));

      let odds = cell.querySelector(".bet-odds");
      if(!odds){
        odds = document.createElement("span");
        odds.className = "bet-odds";
        cell.appendChild(odds);
      }
      odds.textContent = betOdds(bet);

      let stack = cell.querySelector(".chip-stack");
      if(!stack){
        stack = document.createElement("div");
        stack.className = "chip-stack";
        cell.appendChild(stack);
      }

      stack.innerHTML = bets.map(function(b){
        return '<span class="bet-chip ' + (isHostBetter(b.name) ? "host-chip" : "") + '">' + esc(b.name) + '</span>';
      }).join("");
      cell.classList.remove("bet-win");
    });

    if(list){
      list.innerHTML = state.roulette.bets.map(function(b,i){
        return '<div class="roulette-bet-row"><span><b>' + esc(b.name) + '</b> → ' + esc(betLabel(b.bet)) + ' <span class="roulette-tag">' + betOdds(b.bet) + '</span></span><button class="btn danger mini-btn" data-del-bet="' + i + '" type="button">削除</button></div>';
      }).join("") || '<div class="muted">まだベットなし</div>';
    }
  }

  function highlightWinningBets(result){
    document.querySelectorAll("[data-bet]").forEach(function(cell){
      if(isWinningBet(cell.dataset.bet, result)){
        cell.classList.add("bet-win");
      }
    });
  }

  function renderRouletteSettings(){
    ensureRouletteState();
    const s = state.roulette.settings;

    const bgm = document.getElementById("rouletteBgmVolume");
    const se = document.getElementById("rouletteSeVolume");
    const limit = document.getElementById("rouletteBetLimitSelect");
    const limitText = document.getElementById("rouletteBetLimitText");

    if(bgm) bgm.value = s.bgmVolume;
    if(se) se.value = s.seVolume;
    if(document.getElementById("rouletteBgmVolText")) rouletteBgmVolText.textContent = s.bgmVolume;
    if(document.getElementById("rouletteSeVolText")) rouletteSeVolText.textContent = s.seVolume;

    if(limit && !limit.dataset.ready){
      let html = '<option value="all">全部</option>';
      for(let i=1;i<=41;i++) html += '<option value="' + i + '">' + i + '種類</option>';
      limit.innerHTML = html;
      limit.dataset.ready = "1";
    }
    if(limit) limit.value = s.betLimit;
    if(limitText) limitText.textContent = s.betLimit === "all" ? "全部" : s.betLimit + "種類";

    if(document.getElementById("betEnableNumber")) betEnableNumber.checked = !!s.enableNumber;
    if(document.getElementById("betEnableColor")) betEnableColor.checked = !!s.enableColor;
    if(document.getElementById("betEnableOddEven")) betEnableOddEven.checked = !!s.enableOddEven;
    if(document.getElementById("betEnableRange")) betEnableRange.checked = !!s.enableRange;

    setAudioVolumes();
  }

  function saveRouletteSettingsFromUi(){
    ensureRouletteState();
    state.roulette.settings.bgmVolume = Number(document.getElementById("rouletteBgmVolume")?.value || 50);
    state.roulette.settings.seVolume = Number(document.getElementById("rouletteSeVolume")?.value || 80);
    state.roulette.settings.betLimit = document.getElementById("rouletteBetLimitSelect")?.value || "all";
    state.roulette.settings.enableNumber = !!document.getElementById("betEnableNumber")?.checked;
    state.roulette.settings.enableColor = !!document.getElementById("betEnableColor")?.checked;
    state.roulette.settings.enableOddEven = !!document.getElementById("betEnableOddEven")?.checked;
    state.roulette.settings.enableRange = !!document.getElementById("betEnableRange")?.checked;
    safeSave();
    renderRouletteSettings();
    window.renderRoulette();
    alert("ルーレット設定を保存した！");
  }

  function renderHostProfileSettings(){
    const nameInput = document.getElementById("hostNameInput");
    const memoInput = document.getElementById("hostMemoInput");
    const ngInput = document.getElementById("hostNgWordsInput");
    const loveInput = document.getElementById("hostLoveFantasyInput");
    const status = document.getElementById("hostProfileStatus");
    if(!nameInput || !memoInput || !status) return;
    ensureRouletteState();
    state.hostProfile = Object.assign({name:"", memo:"", ngWords:"", loveFantasy:false, talkSettings:{clockEnabled:"on", clockPosition:"right", neonColor:"#39d0ff", bgTheme:"cyber", font:"system", shadow:"on", glow:"on"}}, state.hostProfile || {});
    state.hostProfile.talkSettings = Object.assign({clockEnabled:"on", clockPosition:"right", neonColor:"#39d0ff", bgTheme:"cyber", font:"system", shadow:"on", glow:"on"}, state.hostProfile.talkSettings || {});
    nameInput.value = state.hostProfile.name || "";
    memoInput.value = state.hostProfile.memo || "";
    if(ngInput) ngInput.value = state.hostProfile.ngWords || "";
    if(loveInput) loveInput.checked = !!state.hostProfile.loveFantasy;
    const ts = state.hostProfile.talkSettings || {};
    const setVal = (id,val)=>{ const el=document.getElementById(id); if(el) el.value = val; };
    setVal("talkClockEnabledInput", ts.clockEnabled || "on");
    setVal("talkClockPositionInput", ts.clockPosition || "right");
    setVal("talkNeonColorInput", ts.neonColor || "#39d0ff");
    setVal("talkBgThemeInput", ts.bgTheme || "cyber");
    setVal("talkFontInput", ts.font || "system");
    setVal("talkShadowInput", ts.shadow || "on");
    setVal("talkGlowInput", ts.glow || "on");
    const ngCount = String(state.hostProfile.ngWords||"").split(/\n|,/).map(x=>x.trim()).filter(Boolean).length;
    if(state.hostProfile.name){
      status.innerHTML = '<span class="host-profile-badge">★ ' + esc(state.hostProfile.name) + '</span>' + (state.hostProfile.memo ? '　' + esc(state.hostProfile.memo) : '') + (ngCount ? '<br><span class="muted">NGワード ' + ngCount + '件 / レスキューに反映</span>' : '') + '<br><span class="muted">レスキュー表示設定：保存済み</span>';
    }else{
      status.textContent = "未登録";
    }
  }

  function saveHostProfileFromSettings(){
    ensureRouletteState();
    const nameInput = document.getElementById("hostNameInput");
    const memoInput = document.getElementById("hostMemoInput");
    const ngInput = document.getElementById("hostNgWordsInput");
    const loveInput = document.getElementById("hostLoveFantasyInput");
    if(!nameInput || !memoInput) return;
    const name = nameInput.value.trim();
    const memo = memoInput.value.trim();
    const ngWords = ngInput ? ngInput.value.trim() : "";
    const loveFantasy = loveInput ? !!loveInput.checked : false;
    const talkSettings = {
      clockEnabled: document.getElementById("talkClockEnabledInput")?.value || "on",
      clockPosition: document.getElementById("talkClockPositionInput")?.value || "right",
      neonColor: document.getElementById("talkNeonColorInput")?.value || "#39d0ff",
      bgTheme: document.getElementById("talkBgThemeInput")?.value || "cyber",
      font: document.getElementById("talkFontInput")?.value || "system",
      shadow: document.getElementById("talkShadowInput")?.value || "on",
      glow: document.getElementById("talkGlowInput")?.value || "on"
    };
    if(!name){ alert("枠主名を入れてｗ"); return; }
    state.hostProfile = {name:name, memo:memo, ngWords:ngWords, loveFantasy:loveFantasy, talkSettings:talkSettings};
    safeSave();
    renderHostProfileSettings();
    window.renderRoulette();
    alert("枠主情報を保存した！");
  }

  function clearHostProfileFromSettings(){
    ensureRouletteState();
    if(!confirm("枠主情報を削除する？")) return;
    state.hostProfile = {name:"", memo:"", ngWords:"", loveFantasy:false, talkSettings:{clockEnabled:"on", clockPosition:"right", neonColor:"#39d0ff", bgTheme:"cyber", font:"system", shadow:"on", glow:"on"}};
    safeSave();
    renderHostProfileSettings();
    window.renderRoulette();
  }

  window.renderRoulette = function renderRoulette(){
    ensureRouletteState();
    renderWheel();
    renderBetBoard();

    const resultEl = document.getElementById("rouletteResult");
    const itemsBox = document.getElementById("rouletteItems");
    const historyBox = document.getElementById("rouletteHistory");
    const modeLabel = document.getElementById("rouletteModeLabel");
    const modeNote = document.getElementById("rouletteModeNote");
    const center = document.getElementById("rouletteCenterText");
    const itemsTitle = document.getElementById("rouletteItemsTitle");
    const customBtn = document.getElementById("rouletteCustomMode");
    const casinoBtn = document.getElementById("rouletteCasinoMode");
    const betCard = document.getElementById("rouletteBetBoardCard");
    const isCasino = state.roulette.mode === "casino";

    if(resultEl && !resultEl.classList.contains("show")) resultEl.textContent = "READY";
    if(modeLabel) modeLabel.textContent = isCasino ? "CASINO MODE" : "CUSTOM MODE";
    if(modeNote){
      modeNote.textContent = isCasino
        ? "0〜36のカジノ盤面。ベット制限とON/OFFは設定から変更可能。"
        : "項目数に合わせて盤面のマス目が変わるモード。赤→黒→緑の順で配置。";
    }
    if(center) center.textContent = isCasino ? "37" : "SS";
    if(itemsTitle) itemsTitle.textContent = isCasino ? "カジノ数字" : "カスタム項目";
    if(betCard) betCard.style.display = isCasino ? "block" : "none";

    if(customBtn && casinoBtn){
      customBtn.classList.toggle("primary", !isCasino);
      casinoBtn.classList.toggle("primary", isCasino);
    }

    if(itemsBox){
      if(isCasino){
        itemsBox.innerHTML = casinoNumbers.map(function(n){
          return '<div class="roulette-full-item locked"><span>' + esc(n) + '</span><span class="roulette-tag">CASINO</span></div>';
        }).join("");
      }else{
        itemsBox.innerHTML = state.roulette.items.map(function(item,i){
          return '<div class="roulette-full-item"><span>' + esc(item) + '</span><button class="btn danger mini-btn" type="button" data-del-roulette="' + i + '">削除</button></div>';
        }).join("") || '<div class="muted">項目なし</div>';
      }
    }

    if(historyBox){
      historyBox.innerHTML = state.roulette.history.map(function(h){
        const betText = h.betWinners && h.betWinners.length ? ' / 的中：' + h.betWinners.join("、") : '';
        return '<div>' + esc(h.time || "") + '　<span class="muted">' + esc(h.mode || "") + '</span>　<b>' + esc(h.result || h) + '</b>' + esc(betText) + '</div>';
      }).join("") || '<div>まだ履歴なし</div>';
    }
  };

  function openRoulette(){
    ensureRouletteState();
    if(typeof showScreen === "function"){
      showScreen("roulette");
    }else{
      document.querySelectorAll(".screen").forEach(function(s){ s.classList.remove("active"); });
      const target = document.getElementById("roulette");
      if(target) target.classList.add("active");
      startRouletteBgm();
    }
    setTimeout(function(){
      window.renderRoulette();
      renderZoom("READY", state.roulette.mode === "casino" ? "BET PLEASE" : "赤 → 黒 → 緑", false);
    }, 0);
  }

  function startTicking(duration, slots, winnerIndex){
    const arrow = document.getElementById("rouletteArrow");
    clearInterval(tickTimerV71);
    let interval = 70;
    const start = Date.now();
    let currentIndex = 0;

    function tick(){
      if(arrow){
        arrow.classList.remove("tick");
        void arrow.offsetWidth;
        arrow.classList.add("tick");
      }
      const current = slots[currentIndex % slots.length];
      const next = slots[(currentIndex + 1) % slots.length];
      const next2 = slots[(currentIndex + 2) % slots.length];
      const elapsed = Date.now() - start;
      const progress = Math.min(1, elapsed / duration);
      renderZoom(current.value, String(next.value) + " → " + String(next2.value), progress > 0.72);
      currentIndex++;
      interval = 70 + progress * progress * 520;
      clearInterval(tickTimerV71);
      if(progress < 1) tickTimerV71 = setInterval(tick, interval);
    }
    tickTimerV71 = setInterval(tick, interval);

    setTimeout(function(){
      const before = slots[(winnerIndex - 1 + slots.length) % slots.length];
      renderZoom(before.value, "止まるか！？ → まだ滑る！？", true);
    }, duration - 1050);
    setTimeout(function(){
      renderZoom(slots[winnerIndex].value, "ここだぁぁ！！", true);
    }, duration - 360);
  }

  function stopTicking(){
    clearInterval(tickTimerV71);
    tickTimerV71 = null;
  }

  function countdownThenSpin(){
    ensureRouletteState();
    if(rouletteSpinningV71) return;
    const slots = currentSlots();
    if(slots.length < 2){ alert("ルーレット項目は2個以上ほしいｗ"); return; }

    playAudio("seRouletteKakugo", true);

    const countdown = document.getElementById("rouletteCountdown");
    rouletteSpinningV71 = true;
    let n = 3;
    if(countdown){
      countdown.textContent = n;
      countdown.classList.add("show");
      const timer = setInterval(function(){
        n--;
        if(n > 0){
          countdown.textContent = n;
        }else{
          clearInterval(timer);
          countdown.textContent = "GO!";
          setTimeout(function(){
            countdown.classList.remove("show");
            spinRoulette();
          }, 350);
        }
      }, 1000);
    }else{
      spinRoulette();
    }
  }

  function showCutin(){
    const cutin = document.getElementById("rouletteCutin");
    if(!cutin) return;
    cutin.classList.remove("show");
    void cutin.offsetWidth;
    cutin.classList.add("show");
    setTimeout(function(){ cutin.classList.remove("show"); }, 1300);
  }

  function spinRoulette(){
    const stage = document.getElementById("rouletteStage");
    const wheel = document.getElementById("rouletteWheel");
    const resultEl = document.getElementById("rouletteResult");
    if(!stage || !wheel || !resultEl){
      rouletteSpinningV71 = false;
      alert("ルーレット表示が見つからないｗ");
      return;
    }

    const slots = currentSlots();
    const winnerIndex = Math.floor(Math.random() * slots.length);
    const winner = slots[winnerIndex];

    stage.classList.remove("hit");
    resultEl.classList.remove("show");
    resultEl.textContent = "カチカチ中…";

    playAudio("seRouletteSpin", true);

    const slice = 360 / slots.length;
    const targetAngle = 360 - (winnerIndex * slice) - slice / 2;
    const currentMod = ((rouletteRotationV71 % 360) + 360) % 360;
    rouletteRotationV71 = rouletteRotationV71 + 360 * 9 + targetAngle - currentMod;
    wheel.style.transform = "rotate(" + rouletteRotationV71 + "deg)";

    startTicking(5600, slots, winnerIndex);

    setTimeout(function(){
      stopAudio("seRouletteSpin");
      playAudio("seRouletteSlow", true);
      showCutin();
    }, 4300);

    setTimeout(function(){
      stopTicking();
      stopAudio("seRouletteSpin");

      renderZoom(winner.value, "WINNER", true);

      const winners = state.roulette.mode === "casino"
        ? state.roulette.bets.filter(function(b){ return isWinningBet(b.bet, winner.value); }).map(function(b){ return b.name; })
        : [];

      if(state.roulette.mode === "casino"){
        highlightWinningBets(winner.value);
        if(winners.length){
          playAudio("seRouletteCard", true);
          playAudio("seRouletteCoin", true);
        }else{
          playAudio("seRouletteResult", true);
        }
      }else{
        playAudio("seRouletteResult", true);
      }

      resultEl.textContent = state.roulette.mode === "casino"
        ? "🎲 " + winner.value + (winners.length ? " / 的中 " + winners.length + "人" : "") + " 🎲"
        : "🎉 " + winner.value + " 🎉";

      resultEl.classList.add("show");
      stage.classList.add("hit");

      state.roulette.history.unshift({
        time:new Date().toLocaleTimeString("ja-JP"),
        mode:state.roulette.mode === "casino" ? "CASINO" : "CUSTOM",
        result:winner.value,
        betWinners:winners
      });
      state.roulette.history = state.roulette.history.slice(0,30);

      safeSave();
      window.renderRoulette();
      if(state.roulette.mode === "casino") highlightWinningBets(winner.value);
      rouletteSpinningV71 = false;
    }, 5900);
  }

  document.addEventListener("click", function(e){
    const t = e.target;
    if(!t) return;

    if(t.id === "openRouletteFromGames"){ openRoulette(); return; }

    if(t.id === "backRouletteToGames"){
      if(typeof showScreen === "function") showScreen("games");
      else stopRouletteBgm();
      return;
    }

    if(t.id === "rouletteCustomMode"){
      ensureRouletteState();
      state.roulette.mode = "custom";
      safeSave();
      window.renderRoulette();
      renderZoom("CUSTOM", "赤 → 黒 → 緑", false);
      return;
    }

    if(t.id === "rouletteCasinoMode"){
      ensureRouletteState();
      state.roulette.mode = "casino";
      safeSave();
      window.renderRoulette();
      renderZoom("CASINO", "BET PLEASE", false);
      return;
    }

    if(t.id === "addRouletteItem"){
      ensureRouletteState();
      if(rouletteSpinningV71) return;
      const input = document.getElementById("newRouletteItem");
      const v = input && input.value ? input.value.trim() : "";
      if(!v) return;
      state.roulette.items.push(v);
      input.value = "";
      state.roulette.mode = "custom";
      safeSave();
      window.renderRoulette();
      return;
    }

    if(t.id === "addRouletteGuestBetter"){
      ensureRouletteState();
      const name = prompt("ベットに置く名前");
      if(!name) return;
      state.roulette.guestBetters.push(name);
      safeSave();
      window.renderRoulette();
      return;
    }

    const betTarget = t.closest ? t.closest("[data-bet]") : null;
    if(betTarget && betTarget.dataset && betTarget.dataset.bet !== undefined){
      ensureRouletteState();
      if(state.roulette.mode !== "casino"){
        alert("ベットはカジノモードで使うやつｗ");
        return;
      }

      const bet = betTarget.dataset.bet;
      if(!betAllowed(bet)){
        playAudio("seRoulettePolice", true);
        alert("このベット種類はOFFになってるｗ");
        return;
      }

      if(!canAddBetType(bet)){
        playAudio("seRoulettePolice", true);
        alert("ベット種類数の上限を超えてるｗ");
        return;
      }

      const select = document.getElementById("rouletteBetterSelect");
      const name = select && select.value ? select.value : "";
      if(!name){
        alert("先に登録者かゲスト名を選んでｗ");
        return;
      }

      state.roulette.bets.push({ name:name, bet:bet });
      safeSave();
      window.renderRoulette();
      return;
    }

    if(t.dataset && t.dataset.delBet !== undefined){
      ensureRouletteState();
      const i = Number(t.dataset.delBet);
      state.roulette.bets.splice(i,1);
      safeSave();
      window.renderRoulette();
      return;
    }

    if(t.id === "clearRouletteBets"){
      ensureRouletteState();
      if(!confirm("ベットを全部消す？")) return;
      state.roulette.bets = [];
      safeSave();
      window.renderRoulette();
      return;
    }

    if(t.id === "spinRoulette"){ countdownThenSpin(); return; }

    if(t.id === "shuffleRoulette"){
      ensureRouletteState();
      if(rouletteSpinningV71) return;
      const arr = state.roulette.items;
      for(let i=arr.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
      }
      safeSave();
      window.renderRoulette();
      return;
    }

    if(t.id === "clearRouletteHistory"){
      ensureRouletteState();
      if(!confirm("ルーレット履歴を削除する？")) return;
      state.roulette.history = [];
      safeSave();
      window.renderRoulette();
      return;
    }

    if(t.dataset && t.dataset.delRoulette !== undefined){
      ensureRouletteState();
      if(rouletteSpinningV71) return;
      if(state.roulette.mode === "casino") return;
      const i = Number(t.dataset.delRoulette);
      if(state.roulette.items.length <= 2){ alert("項目は2個以上必要！"); return; }
      state.roulette.items.splice(i,1);
      safeSave();
      window.renderRoulette();
      return;
    }

    if(t.id === "saveHostProfile"){ saveHostProfileFromSettings(); return; }
    if(t.id === "clearHostProfile"){ clearHostProfileFromSettings(); return; }
    if(t.id === "saveRouletteSettings"){ saveRouletteSettingsFromUi(); return; }
    if(t.id === "testRouletteBgm"){ startRouletteBgm(); return; }
    if(t.id === "stopRouletteBgm"){ stopRouletteBgm(); return; }
  }, true);

  document.addEventListener("input", function(e){
    const t = e.target;
    if(!t) return;
    if(t.id === "rouletteBgmVolume" || t.id === "rouletteSeVolume" || t.id === "rouletteBetLimitSelect" ||
       t.id === "betEnableNumber" || t.id === "betEnableColor" || t.id === "betEnableOddEven" || t.id === "betEnableRange"){
      ensureRouletteState();
      if(t.id === "rouletteBgmVolume"){
        state.roulette.settings.bgmVolume = Number(t.value);
      }
      if(t.id === "rouletteSeVolume"){
        state.roulette.settings.seVolume = Number(t.value);
      }
      if(t.id === "rouletteBetLimitSelect"){
        state.roulette.settings.betLimit = t.value;
      }
      if(t.id === "betEnableNumber") state.roulette.settings.enableNumber = !!t.checked;
      if(t.id === "betEnableColor") state.roulette.settings.enableColor = !!t.checked;
      if(t.id === "betEnableOddEven") state.roulette.settings.enableOddEven = !!t.checked;
      if(t.id === "betEnableRange") state.roulette.settings.enableRange = !!t.checked;
      safeSave();
      renderRouletteSettings();
      window.renderRoulette();
    }
  }, true);

  document.addEventListener("keydown", function(e){
    if(e.key === "Enter" && document.activeElement && document.activeElement.id === "newRouletteItem"){
      const btn = document.getElementById("addRouletteItem");
      if(btn) btn.click();
    }
  });

  const originalRenderSettings = window.renderSettings;
  if(typeof originalRenderSettings === "function" && !window.__rouletteRenderSettingsPatched){
    window.renderSettings = function(){
      const result = originalRenderSettings.apply(this, arguments);
      renderHostProfileSettings();
      renderRouletteSettings();
      return result;
    };
    window.__rouletteRenderSettingsPatched = true;
  }

  document.addEventListener("DOMContentLoaded", function(){
    ensureRouletteState();
    renderZoom("READY", state.roulette.mode === "casino" ? "BET PLEASE" : "赤 → 黒 → 緑", false);
    window.renderRoulette();
    renderHostProfileSettings();
    renderRouletteSettings();
  });

  if(document.readyState !== "loading"){
    ensureRouletteState();
    renderZoom("READY", state.roulette.mode === "casino" ? "BET PLEASE" : "赤 → 黒 → 緑", false);
    window.renderRoulette();
    renderHostProfileSettings();
    renderRouletteSettings();
  }
})();


/* v76 Talk Rescue fullscreen - expanded theme engine */
(function(){
  const talkRecentKey = "streamstaff_talk_recent_v76";
  const fallbackNg = [];
  const commonBranches = [
    "恥ずかしかったこと","嬉しかったこと","黒歴史","緊張したこと","イキってた話",
    "意味わからん流行り","サボり・逃げ道","友達との話","先生・先輩・上司の話","当時の謎ルール",
    "今なら怒られる話","地元差・世代差","一番記憶に残ってる場面","無茶ぶり：3秒で説明して",
    "無茶ぶり：ラスボス風に話して","無茶ぶり：先生視点で話して","無茶ぶり：ランキングにして",
    "無茶ぶり：物語っぽくして","逆に嫌だった話","思ったより良かった話","誰かに助けられた話",
    "調子乗った話","ミスった話","謎に覚えてる一言","リスナーに二択で聞く"
  ];
  const commonLeaves = [
    "みんなもある？","今でも覚えてる？","写真残ってる？","今なら怒られる？","誰が一番やばかった？",
    "コメントで一個だけ教えて","同世代いる？","逆に嫌だった？","一番強い思い出どれ？",
    "それ今やったらアリ？","当時の自分に言うなら？","あるある判定して","一番バカなやつ採用",
    "リスナーの体験談も拾う","そこから次の枝に逃げる","ツッコミ入ったら葉にする",
    "共感コメントを拾う","初見にも聞いてみる","地域差コメントを拾う","世代差コメントを拾う"
  ];

  const pairedEvents = {
    "小学生":["運動会","遠足","給食","夏休み","冬休み","席替え","授業参観","係活動","放課後","初めての習い事","友達の家","ゲーム貸し借り"],
    "中学生":["体育祭","文化祭","修学旅行","部活","テスト期間","席替え","放課後","塾","卒業式","合唱コンクール","初恋っぽい空気","謎の流行り"],
    "高校時代":["体育祭","文化祭","修学旅行","部活","テスト期間","放課後","バイト探し","卒業式","打ち上げ","昼休み","通学路","クラス替え"],
    "専門学生":["初登校","実習","課題提出","クラス飲み","友達作り","寝坊","テスト","卒業制作","放課後","進路相談"],
    "初バイト":["初出勤","初給料","やらかし","変なお客さん","怖い先輩","シフトミス","休憩時間","閉店作業","制服","面接"],
    "新社会人":["初出勤","歓迎会","新年会","初任給","飲み会","仕事ミス","名刺交換","上司との会話","朝の通勤","研修","電話対応","初めて怒られた日"],
    "一人暮らし初期":["引っ越し","初自炊","家具選び","家電トラブル","洗濯","夜中のコンビニ","家賃の現実","近所探索","虫との遭遇","寂しい夜"],
    "配信初期":["初配信","コメント0人","初見さん","マイク事故","OBS設定","初めての常連","緊張した枠","謎の沈黙","初コラボ","配信後の反省"],
    "地元時代":["駅前","コンビニ","祭り","友達との集合場所","地元飯","帰り道","謎の店","ヤンキーっぽい人","海・川・山","夜の散歩"],
    "最近":["買い物","仕事帰り","寝る前","休日","コンビニ","SNS","YouTube","服選び","食事","ちょっとした失敗","体調管理","部屋の片付け"],
    "深夜":["コンビニ","SNS巡回","寝る前の考え事","急な掃除","謎の食欲","昔の記憶","音楽","寂しさ","明日の不安","変なテンション"]
  };

  function makeMemoryTrunks(){
    const out=[];
    Object.entries(pairedEvents).forEach(([axis, events])=>{
      events.forEach(ev=>{
        if(axis === "新社会人" && ["歓迎会","新年会","初任給"].includes(ev)) out.push(`${axis}一発目の${ev}の話`);
        else if(axis === "最近") out.push(`最近の${ev}の話`);
        else if(axis === "深夜") out.push(`深夜の${ev}の話`);
        else out.push(`${axis}の${ev}の話`);
      });
    });
    return out;
  }

  const modes = {
    zatsudan:{
      label:"雑談モード",
      trunks:[
        "最近の買い物の話","最近ちょっと笑った話","今日のどうでもいいニュース","仕事帰りに考えた話","最近の食べ物の話",
        "服・靴・身だしなみの話","コンビニでつい買うもの","最近見た動画の話","自分だけの変なこだわり","地味に困ってること",
        "最近ちょっと成長したこと","やめたいけどやめられない習慣","大人になって変わった感覚","昔は嫌いだったけど今アリなもの",
        "人に言うほどじゃないけど好きなもの","最近の小さな失敗","体力・健康の話","家でのだらしない話","配信前の準備の話",
        "最近の自分ルール","地元あるある","仕事あるある","天気でテンション変わる話","寝る前の習慣"
      ],
      branches:commonBranches,
      leaves:commonLeaves
    },
    memory:{
      label:"思い出モード",
      trunks:makeMemoryTrunks(),
      branches:commonBranches.concat(["思い出補正込みで話す","当時の流行りを掘る","友達のキャラを思い出す","今の自分ならどうするか","人生の分岐っぽく話す"]),
      leaves:commonLeaves.concat(["同じ時代の人いる？","その頃なに流行ってた？","自分の学校だけだった？","今思うと謎じゃない？"])
    },
    love:{
      label:"恋バナモード",
      trunks:[
        "学生時代の恋っぽい空気","片思いしてた時の話","好きになる瞬間の話","告白する・される妄想","LINEの距離感の話",
        "デートで気まずそうな場面","勘違いしたかもしれない話","優しさと脈ありの違い","モテると思ってた行動","青春っぽい失敗",
        "友達に相談する恋バナ","好きなタイプの話","冷める瞬間の話","理想と現実の差","映画みたいな恋愛シーン"
      ],
      fantasyTrunks:[
        "理想の出会いシチュエーション","雨の日に起きてほしいイベント","漫画みたいな告白シーン","幼馴染は本当に強いのか会議",
        "深夜の電話イベント妄想","文化祭で起きそうなベタ展開","職場じゃなくて異世界なら許される恋愛イベント",
        "絶対に現実では無理なデートプラン","恋愛ドラマの第1話っぽい出会い","急にモテ期が来たらどこで気づくか",
        "ベタだけど嫌いじゃないシチュ","逆に一番冷める妄想シチュ","少女漫画の強すぎる演出","ラブコメの勘違いイベント"
      ],
      branches:["勘違い","タイミング","友達に相談","LINE・DM","服装・第一印象","優しさの基準","嫉妬","気まずさ","無茶ぶり：ドラマ予告風に話して","無茶ぶり：少女漫画風にして"],
      leaves:["それ脈ありだと思う？","みんなならどうする？","これはセーフ？","逆に冷める瞬間は？","ベタだけど好き？","現実である？","一番強いシチュ何？","コメントで判定して"]
    },
    midnight:{
      label:"深夜モード",
      trunks:[
        "夜中に急に考える人生の話","寝る前に思い出す昔の場面","深夜のコンビニの話","静かに語れる好きなもの","孤独感の話",
        "SNS見すぎた夜の話","明日への不安の話","音楽で思い出す場面","大人になって分かったこと","昔の自分に言いたいこと",
        "夜だけ許されるテンション","深夜に食べたくなるもの","寝れない時の謎行動","将来のぼんやりした話","後悔を笑い話にする"
      ],
      branches:["静かに語る","少し笑い話にする","音楽に逃げる","昔の自分を掘る","不安とネタの間で話す","ひとり時間","明日になればどうでもいい話","無茶ぶり：ポエム風に話して"],
      leaves:["深夜勢いる？","寝る前なに考える？","これ分かる人いる？","同じタイプいる？","明日休みの人？","夜中だけ強くなる感情ある？","コメント欄だけの秘密にする？"]
    },
    chaos:{
      label:"カオスモード",
      trunks:[
        "存在しない部活","コンビニのラスボス","絶対に弱い必殺技","存在しない法律","深夜テンション商品名",
        "学校に一人はいない奴","冷蔵庫のラスボス","もし配信部屋にゴリラが来たら","ギリありそうな都市伝説","絶対に売れない新商品",
        "最弱の魔法名","地味すぎる超能力","存在しない体育祭種目","意味不明な校則","コンビニ四天王",
        "異世界転生した配管工","ラスボス前のどうでもいい会話","絶対に盛り上がらないイベント名","弱そうな怪人名","世界一どうでもいいランキング"
      ],
      branches:["物語を作れ","ラスボスを出せ","設定を盛れ","途中で裏切れ","世界観を壊せ","伏線っぽい事言え","最終回みたいにしろ","急に恋愛要素入れろ","リスナーに丸投げ","先生視点で語れ","悪役会議にしろ","ゲームのステータス風にしろ","無茶ぶり：CM風にして","無茶ぶり：必殺技名を付けろ","無茶ぶり：一番弱くして"],
      leaves:["リスナーは乗っかれ","ツッコミ歓迎","後付け設定OK","矛盾を恐れるな","コメント欄は共犯です","一番意味不明な奴優勝","設定追加して","ボケを育てろ","主はツッコミ担当","世界観を壊すな、でも壊していい","途中から敵増やしてOK","コメント欄でラスボス作れ"]
    }
  };

  let currentMode = "zatsudan";
  let memoOn = true;
  const qs = (id)=>document.getElementById(id);
  const esc = (s)=>String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  function getHostProfile(){
    try{
      if(typeof state !== "undefined" && state.hostProfile) return Object.assign({ngWords:"", loveFantasy:false, talkSettings:{clockEnabled:"on", clockPosition:"right", neonColor:"#39d0ff", bgTheme:"cyber", font:"system", shadow:"on", glow:"on"}}, state.hostProfile);
    }catch(e){}
    return {ngWords:"", loveFantasy:false, talkSettings:{clockEnabled:"on", clockPosition:"right", neonColor:"#39d0ff", bgTheme:"cyber", font:"system", shadow:"on", glow:"on"}};
  }
  function getNgWords(){
    const hp = getHostProfile();
    return String(hp.ngWords||"").split(/\n|,/).map(x=>x.trim()).filter(Boolean).concat(fallbackNg);
  }
  function isLoveFantasy(){
    const hp = getHostProfile();
    const ng = getNgWords().join(" ");
    return !!hp.loveFantasy || ng.includes("恋愛") || ng.includes("恋バナ");
  }

  function getTalkSettings(){
    const hp = getHostProfile();
    return Object.assign({clockEnabled:"on", clockPosition:"right", neonColor:"#39d0ff", bgTheme:"cyber", font:"system", shadow:"on", glow:"on"}, hp.talkSettings || {});
  }
  function hexToGlow(hex, alpha){
    const h = String(hex || "#39d0ff").replace("#","");
    const n = h.length === 3 ? h.split("").map(c=>c+c).join("") : h;
    const r = parseInt(n.slice(0,2),16) || 57;
    const g = parseInt(n.slice(2,4),16) || 208;
    const b = parseInt(n.slice(4,6),16) || 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }
  function backgroundFor(theme){
    if(theme === "midnight") return "radial-gradient(circle at top left,rgba(88,28,135,.34),transparent 34%),radial-gradient(circle at bottom right,rgba(30,64,175,.22),transparent 30%),#030712";
    if(theme === "simple") return "#05070c";
    if(theme === "soft") return "radial-gradient(circle at top left,rgba(255,79,216,.18),transparent 34%),radial-gradient(circle at bottom right,rgba(57,208,255,.14),transparent 30%),#090b12";
    return "radial-gradient(circle at top left,rgba(124,58,237,.28),transparent 34%),radial-gradient(circle at bottom right,rgba(34,211,238,.18),transparent 30%),#05070c";
  }
  function applyTalkAppearance(){
    const overlay = qs("talkRescueOverlay");
    if(!overlay) return;
    const ts = getTalkSettings();
    const fixed = currentMode === "love" ? "#ff4fd8" : (currentMode === "chaos" ? "#ff2d2d" : null);
    const neon = fixed || ts.neonColor || "#39d0ff";
    overlay.style.setProperty("--talk-neon", neon);
    overlay.style.setProperty("--talk-glow", hexToGlow(neon, currentMode === "chaos" ? .72 : .58));
    overlay.style.background = backgroundFor(ts.bgTheme);
    overlay.classList.toggle("clock-off", ts.clockEnabled === "off");
    overlay.classList.remove("talk-clock-left","talk-clock-center","talk-clock-right");
    overlay.classList.add("talk-clock-" + (ts.clockPosition || "right"));
    overlay.classList.remove("talk-font-system","talk-font-rounded","talk-font-gothic","talk-font-mincho","talk-font-mono");
    overlay.classList.add("talk-font-" + (ts.font || "system"));
    overlay.classList.toggle("no-shadow", ts.shadow === "off");
    overlay.classList.toggle("no-glow", ts.glow === "off");
  }
  function loadRecent(){
    try{return JSON.parse(localStorage.getItem(talkRecentKey)||"[]")}catch(e){return []}
  }
  function saveRecent(items){
    try{localStorage.setItem(talkRecentKey, JSON.stringify(items.slice(0,80)))}catch(e){}
  }
  function filterList(list){
    const ng=getNgWords();
    const recent=loadRecent();
    let filtered=list.filter(x=>!ng.some(w=>String(x).includes(w))).filter(x=>!recent.includes(x));
    if(filtered.length < 5) filtered=list.filter(x=>!ng.some(w=>String(x).includes(w)));
    if(filtered.length < 5) filtered=list;
    return filtered;
  }
  function pickFive(list){
    const pool = filterList([...list]);
    const out = [];
    while(out.length < 5 && pool.length){
      out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
    }
    return out;
  }
  function getModeData(){
    const m = modes[currentMode] || modes.zatsudan;
    if(currentMode === "love" && isLoveFantasy()) return Object.assign({}, m, {label:"恋バナモード（妄想寄り）", trunks:m.fantasyTrunks});
    return m;
  }
  function showChaosWarning(){
    const w = qs("talkChaosWarning");
    if(!w) return;
    w.classList.remove("show");
    void w.offsetWidth;
    w.classList.add("show");
  }
  function renderTalk(){
    const m = getModeData();
    const overlay = qs("talkRescueOverlay");
    if(!overlay) return;
    overlay.classList.toggle("memo-on", memoOn);
    overlay.classList.toggle("chaos-mode", currentMode === "chaos");
    applyTalkAppearance();
    qs("talkRescueModeLabel").textContent = m.label;
    const trunks = pickFive(m.trunks);
    const branches = pickFive(m.branches);
    const leaves = pickFive(m.leaves);
    qs("talkRescueTrunks").innerHTML = trunks.map(x=>`<div class="talk-rescue-card">${esc(x)}</div>`).join("");
    qs("talkRescueBranches").innerHTML = branches.map(x=>`<div>${esc(x)}</div>`).join("");
    qs("talkRescueLeaves").innerHTML = leaves.map(x=>`<div>${esc(x)}</div>`).join("");
    saveRecent([...trunks, ...loadRecent()]);
    document.querySelectorAll("[data-talk-mode]").forEach(btn=>{
      btn.classList.toggle("active", btn.dataset.talkMode === currentMode);
    });
    const memoBtn = document.querySelector('[data-talk-action="memo"]');
    if(memoBtn){
      memoBtn.classList.toggle("active", memoOn);
      memoBtn.textContent = memoOn ? "メモON" : "メモOFF";
    }
  }
  function openTalk(){
    const overlay = qs("talkRescueOverlay");
    if(!overlay) return;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden","false");
    renderTalk();
  }
  function closeTalk(){
    const overlay = qs("talkRescueOverlay");
    if(!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden","true");
  }
  function updateClock(){
    const c = qs("talkRescueClock");
    if(!c) return;
    const d = new Date();
    c.textContent = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  }
  document.addEventListener("DOMContentLoaded", ()=>{
    const openBtn = qs("openTalkRescue");
    if(openBtn) openBtn.addEventListener("click", openTalk);
    const actions = qs("talkRescueActions");
    if(actions){
      actions.addEventListener("click", (e)=>{
        const modeBtn = e.target.closest("[data-talk-mode]");
        const actionBtn = e.target.closest("[data-talk-action]");
        if(modeBtn){
          currentMode = modeBtn.dataset.talkMode;
          if(currentMode === "chaos") showChaosWarning();
          renderTalk();
          return;
        }
        if(actionBtn){
          const a = actionBtn.dataset.talkAction;
          if(a === "memo"){ memoOn = !memoOn; renderTalk(); }
          if(a === "refresh"){ renderTalk(); }
          if(a === "settings"){
            closeTalk();
            if(typeof showScreen === "function") showScreen("settings");
            else location.hash = "#settings";
          }
          if(a === "close"){ closeTalk(); }
        }
      });
    }
    document.addEventListener("keydown",(e)=>{
      const overlay = qs("talkRescueOverlay");
      if(!overlay || !overlay.classList.contains("open")) return;
      if(e.key === "Escape") closeTalk();
      if(e.key === " "){ e.preventDefault(); renderTalk(); }
      if(e.key.toLowerCase() === "m"){ memoOn = !memoOn; renderTalk(); }
      if(["1","2","3","4","5"].includes(e.key)){
        currentMode = ["zatsudan","memory","love","midnight","chaos"][Number(e.key)-1];
        if(currentMode === "chaos") showChaosWarning();
        renderTalk();
      }
    });
    updateClock();
    setInterval(updateClock,1000);
    renderTalk();
  });
})();

