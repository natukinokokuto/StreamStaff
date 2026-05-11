
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
    state.hostProfile = Object.assign({name:"", memo:"", ngWords:"", loveFantasy:false, favoriteThings:"", hobbies:"", frequentTopics:"", streamGenres:"", talkSettings:{clockEnabled:"on", clockPosition:"right", neonColor:"#39d0ff", bgTheme:"cyber", font:"system", shadow:"on", glow:"on"}}, state.hostProfile || {});
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
    state.hostProfile = Object.assign({name:"", memo:"", ngWords:"", loveFantasy:false, favoriteThings:"", hobbies:"", frequentTopics:"", streamGenres:"", talkSettings:{clockEnabled:"on", clockPosition:"right", neonColor:"#39d0ff", bgTheme:"cyber", font:"system", shadow:"on", glow:"on"}}, state.hostProfile || {});
    state.hostProfile.talkSettings = Object.assign({clockEnabled:"on", clockPosition:"right", neonColor:"#39d0ff", bgTheme:"cyber", font:"system", shadow:"on", glow:"on"}, state.hostProfile.talkSettings || {});
    nameInput.value = state.hostProfile.name || "";
    memoInput.value = state.hostProfile.memo || "";
    if(ngInput) ngInput.value = state.hostProfile.ngWords || "";
    if(loveInput) loveInput.checked = !!state.hostProfile.loveFantasy;
    const favInput = document.getElementById("hostFavoriteThingsInput");
    const hobbyInput = document.getElementById("hostHobbiesInput");
    const frequentInput = document.getElementById("hostFrequentTopicsInput");
    const genreInput = document.getElementById("hostStreamGenresInput");
    if(favInput) favInput.value = state.hostProfile.favoriteThings || "";
    if(hobbyInput) hobbyInput.value = state.hostProfile.hobbies || "";
    if(frequentInput) frequentInput.value = state.hostProfile.frequentTopics || "";
    if(genreInput) genreInput.value = state.hostProfile.streamGenres || "";
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
    const favoriteThings = document.getElementById("hostFavoriteThingsInput")?.value.trim() || "";
    const hobbies = document.getElementById("hostHobbiesInput")?.value.trim() || "";
    const frequentTopics = document.getElementById("hostFrequentTopicsInput")?.value.trim() || "";
    const streamGenres = document.getElementById("hostStreamGenresInput")?.value.trim() || "";
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
    state.hostProfile = {name:name, memo:memo, ngWords:ngWords, loveFantasy:loveFantasy, favoriteThings:favoriteThings, hobbies:hobbies, frequentTopics:frequentTopics, streamGenres:streamGenres, talkSettings:talkSettings};
    safeSave();
    renderHostProfileSettings();
    window.renderRoulette();
    alert("枠主情報を保存した！");
  }

  function clearHostProfileFromSettings(){
    ensureRouletteState();
    if(!confirm("枠主情報を削除する？")) return;
    state.hostProfile = {name:"", memo:"", ngWords:"", loveFantasy:false, favoriteThings:"", hobbies:"", frequentTopics:"", streamGenres:"", talkSettings:{clockEnabled:"on", clockPosition:"right", neonColor:"#39d0ff", bgTheme:"cyber", font:"system", shadow:"on", glow:"on"}};
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
  function hostProfileTalkItems(){
    const hp = getHostProfile();
    const raw = [hp.favoriteThings,hp.hobbies,hp.frequentTopics,hp.streamGenres].join("\n");
    const items = raw.split(/\n|,/).map(x=>x.trim()).filter(Boolean);
    const out = [];
    items.forEach(x=>{
      out.push(`枠主プロフィール：${x}の話`);
      out.push(`${x}を始めた頃の話`);
      out.push(`${x}で最近思ったこと`);
    });
    return out;
  }
  function getModeData(){
    const m = modes[currentMode] || modes.zatsudan;
    const hostItems = hostProfileTalkItems();
    if(currentMode === "love" && isLoveFantasy()) return Object.assign({}, m, {label:"恋バナモード（妄想寄り）", trunks:m.fantasyTrunks});
    if(hostItems.length && ["zatsudan","memory","midnight"].includes(currentMode)){
      return Object.assign({}, m, {trunks:[...hostItems, ...(m.trunks||[])]});
    }
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

