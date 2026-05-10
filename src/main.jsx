import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice5, Gift, Mic2, Users, NotebookPen, Sparkles, Home, Trophy, Shuffle, Save, Plus, Trash2 } from 'lucide-react';
import './style.css';

const STORAGE_KEY = 'stream_base_v001';
const seedData = {
  listeners: [
    { name: 'ジャック', days: [1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,29,30,31], memo: 'ほぼ皆勤。強い常連。' },
    { name: 'くる', days: [1,2,3,5,6,7,8,9,10,11,12,13,14,15,16,18,20,21,22,23,24,25,26,29,30,31], memo: 'ログボ管理対象。' },
    { name: 'サクマ', days: [5,6,7,8,9,10,11,12,13,14,16,21,24,25,27,29,30], memo: 'まばら参加。' },
    { name: 'ドク', days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,21,22,23,24,25,26,27,28,29,30,31], memo: '救ってあげたい / 200' },
  ],
  trunk: '今日のメインテーマを書く', branch: '話が止まったらここから枝を伸ばす', leaf: 'リスナーが食いついた葉っぱを残す', logs: [],
  games: {
    animal: { animals: ['猫','犬','ゾウ','牛','キツネ','ハト','ゴリラ','サル','馬','深夜のコンビニ店員'], topics: ['簡単にできる料理','昔流行ったもの','身につけるもの','虫の名前','冬に使うもの','配信で起きがちなこと'] },
    ogiri: ['身につけるものっぽく一番くだらないことを言って','深夜のコンビニ店員が急に言いそうな一言','猫が配信者だった時の初見挨拶','絶対に盛り上がらないイベント名'],
    lines: ['分からない……何も思い出せない……。何で炊けた米が部屋中に塗りたくられてるんだ……！？','それはもう、ほぼ事件じゃん。','ちょっと待って、話の枝が折れた。','いま誰がこの空気の責任取るの？'],
    itsuDoko: { when: ['昨日','今日','朝','明日','おととい','去年','昼に','夕方に','夜に','誕生日に'], who: ['お母さんが','酔っ払いが','猫が','常連が','初見さんが','師匠が'], where: ['コンビニで','配信画面の裏で','公園で','居酒屋で','ダーツバーで','風呂場で'], what: ['急に歌い出した','米を炊きすぎた','名言っぽいことを言った','謎のルールを作った','コメント欄を凍らせた'] },
    bob: ['アクセル','エンジン','オイル','オートマチック','ガソリン','ガソリンスタンド','カバー','ガレージ','アプローチ','ジュース','ランプ'],
    relorero: ['マーボー豆腐','チャンジャ','鮭とば','たこわさ','だし巻きたまご','枝豆','焼きナス','冷やしトマト','もつ鍋','軟骨のから揚げ']
  }
};
function loadData(){ try{ const raw=localStorage.getItem(STORAGE_KEY); return raw?JSON.parse(raw):seedData; }catch{return seedData;} }
function clone(obj){ return typeof structuredClone==='function'?structuredClone(obj):JSON.parse(JSON.stringify(obj)); }
function pick(list){ return list[Math.floor(Math.random()*list.length)]; }
function countStreak(days){ const set=new Set(days); let streak=0; for(let i=31;i>=1;i--){ if(set.has(i)) streak++; else if(streak>0) break; } return streak; }
function rewardText(count){ if(count>=31)return '皆勤賞：リアルグッズ or 通話券1時間'; if(count>=14)return '14日達成：個通30分'; if(count>=7)return '週達成：リング / ヘッダー / ロック / しめじ'; return 'まだ育成中'; }
function Button({children,onClick,variant='primary',className=''}){ return <button onClick={onClick} className={`btn ${variant} ${className}`}>{children}</button>; }
function Card({children}){ return <div className="card">{children}</div>; }
function Input(props){ return <input {...props} className={`input ${props.className||''}`} />; }
function Textarea(props){ return <textarea {...props} className={`textarea ${props.className||''}`} />; }

function App(){
  const [data,setData]=useState(loadData); const [tab,setTab]=useState('home'); const [game,setGame]=useState('animal'); const [result,setResult]=useState('🎲 ボタンを押すとお題が出る'); const [selectedListener,setSelectedListener]=useState(0); const [logText,setLogText]=useState('');
  useEffect(()=>localStorage.setItem(STORAGE_KEY,JSON.stringify(data)),[data]);
  const currentListener=data.listeners[selectedListener]||data.listeners[0];
  const stats=useMemo(()=>{ const total=data.listeners.reduce((s,l)=>s+l.days.length,0); const max=[...data.listeners].sort((a,b)=>b.days.length-a.days.length)[0]; return {total,max};},[data.listeners]);
  const rollGame=()=>{ const g=data.games; if(game==='animal')setResult(`🐾 ${pick(g.animal.animals)} × 「${pick(g.animal.topics)}」といえば？`); if(game==='ogiri')setResult(`🧠 大喜利：${pick(g.ogiri)}`); if(game==='line')setResult(`🎭 セリフ：${pick(g.lines)}`); if(game==='itsu')setResult(`🧩 ${pick(g.itsuDoko.when)} ${pick(g.itsuDoko.who)} ${pick(g.itsuDoko.where)} ${pick(g.itsuDoko.what)}`); if(game==='bob')setResult(`📘 ボブジテン：${pick(g.bob)} ※カタカナ禁止で説明`); if(game==='relo')setResult(`🍻 レロレロ酒場：${pick(g.relorero)} を噛まずに言える？`); if(game==='chin'){ const d=[1,2,3].map(()=>Math.ceil(Math.random()*6)); setResult(`🎲 チンチロ：${d.join('・')} / 合計 ${d.reduce((a,b)=>a+b,0)}`); }};
  const updateTree=(key,value)=>setData(prev=>({...prev,[key]:value}));
  const toggleDay=(day)=>setData(prev=>{ const next=clone(prev); const l=next.listeners[selectedListener]; l.days=l.days.includes(day)?l.days.filter(d=>d!==day):[...l.days,day].sort((a,b)=>a-b); return next; });
  const addListener=()=>{ const name=prompt('リスナー名'); if(!name)return; setData(prev=>({...prev,listeners:[...prev.listeners,{name,days:[],memo:''}]})); setSelectedListener(data.listeners.length); };
  const saveLog=()=>{ const text=logText.trim(); if(!text)return; const entry={date:new Date().toLocaleString('ja-JP'),text,result,trunk:data.trunk,branch:data.branch,leaf:data.leaf}; setData(prev=>({...prev,logs:[entry,...prev.logs].slice(0,30)})); setLogText(''); };
  const nav=[['home',Home,'ホーム'],['games',Dice5,'ゲーム'],['bonus',Gift,'ログボ'],['listeners',Users,'常連'],['logs',NotebookPen,'ログ']];
  return <div className="app"><div className="wrap"><motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} className="header"><div><h1>配信管制室</h1><p>スマホ用・自分専用プロトタイプ</p></div><div className="logo"><Mic2 size={26}/></div></motion.div>
  <AnimatePresence mode="wait">
    {tab==='home'&&<motion.div key="home" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="space"><div className="kpis"><Kpi label="ログボ総数" value={stats.total}/><Kpi label="最強常連" value={stats.max?.name||'-'}/><Kpi label="保存ログ" value={data.logs.length}/></div><Card><h2><Sparkles size={18}/> 配信の樹</h2><TreeInput label="幹" value={data.trunk} onChange={v=>updateTree('trunk',v)}/><TreeInput label="枝" value={data.branch} onChange={v=>updateTree('branch',v)}/><TreeInput label="葉" value={data.leaf} onChange={v=>updateTree('leaf',v)}/></Card><Button onClick={()=>{setTab('games');setGame('animal')}} className="big">無音緊急ボタンへ</Button></motion.div>}
    {tab==='games'&&<motion.div key="games" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="space"><div className="tabs">{[['animal','動物'],['ogiri','大喜利'],['line','セリフ'],['itsu','いつ誰'],['bob','ボブ'],['relo','酒場'],['chin','チンチロ']].map(([id,label])=><button key={id} onClick={()=>setGame(id)} className={game===id?'active':''}>{label}</button>)}</div><Card><p className="muted">配信中にそのまま読めるやつ</p><div className="result">{result}</div><Button onClick={rollGame} className="big"><Shuffle size={20}/> 回す</Button></Card><Card><p className="muted">今の結果を配信ログに残す</p><Textarea value={logText} onChange={e=>setLogText(e.target.value)} placeholder="盛り上がった反応・次回の伏線など"/><Button onClick={saveLog} variant="secondary"><Save size={16}/> 保存</Button></Card></motion.div>}
    {tab==='bonus'&&currentListener&&<motion.div key="bonus" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="space"><div className="scrollBtns">{data.listeners.map((l,i)=><Button key={l.name} variant={i===selectedListener?'primary':'secondary'} onClick={()=>setSelectedListener(i)}>{l.name}</Button>)}<Button onClick={addListener} variant="secondary"><Plus size={18}/></Button></div><Card><div className="listenerHead"><div><h2>{currentListener.name}</h2><p className="muted">参加 {currentListener.days.length}/31日・連続 {countStreak(currentListener.days)}日</p></div><Trophy size={36}/></div><div className="reward">{rewardText(currentListener.days.length)}</div><div className="calendar">{Array.from({length:31},(_,i)=>i+1).map(day=><button key={day} onClick={()=>toggleDay(day)} className={currentListener.days.includes(day)?'on':''}>{day}</button>)}</div></Card></motion.div>}
    {tab==='listeners'&&<motion.div key="listeners" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="space">{data.listeners.map((l,i)=><Card key={l.name}><div className="listenerHead"><div><h2>{l.name}</h2><p className="muted">{l.days.length}/31日 / {rewardText(l.days.length)}</p></div><Button variant="secondary" onClick={()=>{setSelectedListener(i);setTab('bonus')}}>開く</Button></div><Textarea value={l.memo} onChange={e=>setData(prev=>{const next=clone(prev); next.listeners[i].memo=e.target.value; return next;})}/></Card>)}</motion.div>}
    {tab==='logs'&&<motion.div key="logs" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="space">{data.logs.length===0&&<Card><p className="muted">まだログなし。ゲーム画面から保存できる。</p></Card>}{data.logs.map((log,i)=><Card key={i}><p className="muted">{log.date}</p><h3>{log.text}</h3><p className="muted">{log.result}</p></Card>)}{data.logs.length>0&&<Button variant="danger" onClick={()=>setData(prev=>({...prev,logs:[]}))}><Trash2 size={16}/> ログ全消し</Button>}</motion.div>}
  </AnimatePresence></div><nav>{nav.map(([id,Icon,label])=><button key={id} onClick={()=>setTab(id)} className={tab===id?'active':''}><Icon size={21}/><span>{label}</span></button>)}</nav></div>;
}
function Kpi({label,value}){ return <div className="kpi"><p>{label}</p><strong>{value}</strong></div>; }
function TreeInput({label,value,onChange}){ return <div className="field"><label>{label}</label><Input value={value} onChange={e=>onChange(e.target.value)}/></div>; }
createRoot(document.getElementById('root')).render(<App/>);
