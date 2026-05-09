
const doorScreen=document.getElementById("door-screen");
const quoteScreen=document.getElementById("quote-screen");
const doorChoices=document.getElementById("doorChoices");

const tocButton=document.getElementById("tocButton");
const resetSeenButton=document.getElementById("resetSeenButton");
const progressText=document.getElementById("progressText");
const tocScreen=document.getElementById("tocScreen");
const tocBackButton=document.getElementById("tocBackButton");
const tocResetButton=document.getElementById("tocResetButton");
const tocList=document.getElementById("tocList");
const tocSearch=document.getElementById("tocSearch");
const shuffleBtn=document.getElementById("shuffleBtn");
const backBtn=document.getElementById("backBtn");
const nextBtn=document.getElementById("nextBtn");
const transitionOverlay=document.getElementById("transitionOverlay");
const transitionMood=document.getElementById("transitionMood");
const doorLabel=document.getElementById("doorLabel");
const typeLabel=document.getElementById("typeLabel");
const quoteTitle=document.getElementById("quoteTitle");
const languageLabel=document.getElementById("languageLabel");
const quoteText=document.getElementById("quoteText");
const knownWrap=document.getElementById("knownWrap");
const knownJp=document.getElementById("knownJp");
const quoteJp=document.getElementById("quoteJp");
const translationNote=document.getElementById("translationNote");
const bioEl=document.getElementById("bio");
const episodeEl=document.getElementById("episode");
const sceneEl=document.getElementById("scene");
const intentEl=document.getElementById("intent");
const contextEl=document.getElementById("context");
const connectionEl=document.getElementById("connection");
const workContextWrap=document.getElementById("workContextWrap");
const workContextEl=document.getElementById("workContext");
const relatedQuotes=document.getElementById("relatedQuotes");
const traceBox=document.getElementById("traceBox");
const wikiLink=document.getElementById("wikiLink");

const quoteMap=Object.fromEntries(WORD_QUOTES.map(q=>[q.id,q]));

const SEEN_STORAGE_KEY = "wordDoorSeenQuoteIds_v1";
let seenMemoryFallback = new Set();
function getSeenIds(){
  try {
    const raw = localStorage.getItem(SEEN_STORAGE_KEY);
    if(raw !== null) return new Set(JSON.parse(raw || "[]"));
  } catch(e){}
  return new Set(seenMemoryFallback);
}
function saveSeenIds(seen){
  seenMemoryFallback = new Set(seen);
  try { localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify([...seen])); } catch(e){}
}
function markSeen(id){
  const seen = getSeenIds();
  seen.add(id);
  saveSeenIds(seen);
  updateProgressText();

}
function resetSeen(){
  seenMemoryFallback = new Set();
  try { localStorage.removeItem(SEEN_STORAGE_KEY); } catch(e){}
  updateProgressText();
  renderToc(tocSearch ? tocSearch.value : "");
}
function getAllQuoteIds(){
  return WORD_QUOTES.map(q => q.id);
}
function updateProgressText(){
  if(!progressText) return;
  const seen = getSeenIds();
  const total = WORD_QUOTES.length;
  const count = [...seen].filter(id => quoteMap[id]).length;
  progressText.textContent = `既読 ${count} / ${total}｜未読の言葉を優先して表示します`;
}
function pickUnseenQuoteId(ids){
  const seen = getSeenIds();
  const valid = (ids || []).filter(id => quoteMap[id]);
  const unseen = valid.filter(id => !seen.has(id));
  const pool = unseen.length ? unseen : valid;
  if(!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
function showScreen(screen){
  [doorScreen, tocScreen, quoteScreen].forEach(s => {
    if(s){
      s.classList.remove("active");
      s.classList.add("hidden");
    }
  });
  if(screen){
    screen.classList.add("active");
    screen.classList.remove("hidden");
  }
}
function openQuoteFromToc(id){
  const q = quoteMap[id];
  if(!q) return;
  showScreen(quoteScreen);
    scrollToQuoteTop();
  startWhiteTransition(q.regionEra || q.period || "言葉の奥へ");
  setTimeout(()=>{ loadQuote(id,{name:"",mood:""}); endWhiteTransition(); }, 520);
}
function renderToc(filterText=""){
  if(!tocList) return;
  const seen = getSeenIds();
  const f = filterText.trim().toLowerCase();
  const items = WORD_QUOTES.filter(q => {
    const hay = `${q.speakerJp||""} ${q.speaker||""} ${q.quoteOriginal||""} ${q.knownJp||""} ${q.doorJp||""} ${q.period||""} ${q.regionEra||""}`.toLowerCase();
    return !f || hay.includes(f);
  });
  tocList.innerHTML = "";
  items.forEach((q, idx)=>{
    const card = document.createElement("button");
    card.type = "button";
    card.className = "toc-item" + (seen.has(q.id) ? " seen" : "");
    card.innerHTML = `
      <span class="toc-num">${String(idx+1).padStart(3,"0")}</span>
      <span class="toc-main">
        <span class="toc-speaker">${q.speakerJp || q.speaker || ""}</span>
        <span class="toc-quote">${q.knownJp || q.quoteOriginal || ""}</span>
        <span class="toc-doorjp">${q.doorJp || q.jp || ""}</span>
      </span>
      <span class="toc-status">${seen.has(q.id) ? "既読" : "未読"}</span>
    `;
    card.addEventListener("click",()=>openQuoteFromToc(q.id));
    tocList.appendChild(card);
  });
  if(!items.length){
    tocList.innerHTML = '<p class="muted">該当する言葉がありません。</p>';
  }
}

function pick(a){return a[Math.floor(Math.random()*a.length)]}
function shuffle(a){return[...a].sort(()=>Math.random()-0.5)}
function doorCount(){const h=new Date().getHours();if(h>=23||h<=5)return 1;if(h>=18)return 2;return 3}


function openMood(moodData){
  const quoteId = pickUnseenQuoteId(moodData.quoteIds) || pick(moodData.quoteIds);
  const q = quoteMap[quoteId] || pick(WORD_QUOTES);
  startWhiteTransition(moodData.label || "言葉の奥へ");
  setTimeout(()=>{
    showScreen(quoteScreen);
    scrollToQuoteTop();
    loadQuote(q.id,{name:moodData.label,mood:moodData.label});
    endWhiteTransition();
  },720);
}

function renderMoodChoices(){
  if(!moodChoices || typeof WORD_MOODS === "undefined") return;
  moodChoices.innerHTML = "";
  WORD_MOODS.forEach(m=>{
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mood-chip";
    btn.innerHTML = `<span>${m.label}</span><small>${m.note || ""}</small>`;
    btn.addEventListener("click",()=>openMood(m));
    moodChoices.appendChild(btn);
  });
}

function renderDoorChoices(){
 const count=doorCount();
 const choices=shuffle(WORD_DOORS).slice(0,count);
 doorChoices.style.setProperty("--cols",count);
 doorChoices.innerHTML="";
 choices.forEach(d=>{
  const card=document.createElement("div");card.className="door-card";
  const button=document.createElement("button");button.className=`door ${d.className}`;button.innerHTML='<span class="knob"></span>';button.addEventListener("click",()=>openDoor(button,d));
  card.appendChild(button);doorChoices.appendChild(card);
 });
}

function startWhiteTransition(text){transitionMood.textContent=text;transitionOverlay.classList.add("active")}
function endWhiteTransition(){setTimeout(()=>transitionOverlay.classList.remove("active"),280)}

function openDoor(el,doorData){
 el.classList.add("opening");
 const quoteId = pickUnseenQuoteId(doorData.quoteIds) || pick(doorData.quoteIds);
 const q = quoteMap[quoteId] || pick(WORD_QUOTES);
 setTimeout(()=>startWhiteTransition(q.regionEra || q.period || "言葉の奥へ"),450);
 setTimeout(()=>{
   showScreen(quoteScreen);
    scrollToQuoteTop();
   loadQuote(q.id,doorData);
   endWhiteTransition();
 },1050);
}

function traceHtml(q){
 const trace = q.trace || [];
 if(!trace.length){
   return `<h2>この言葉の背景</h2><p class="trace-empty">確認済みの背景情報はまだありません。</p>`;
 }
 return `<h2>この言葉の背景</h2>
   <div class="trace-list">
     ${trace.map(item=>{
       const year = item[0] || "";
       const text = item[1] || "";
       return `<div class="trace-card">
         <div class="trace-year">${year}</div>
         <div class="trace-text">${text}</div>
       </div>`;
     }).join("")}
   </div>`;
}


function renderRelated(q){
 if(!relatedQuotes) return;
 relatedQuotes.innerHTML="";
 const ids = (q.relatedIds || []).filter(id => quoteMap[id]);
 ids.forEach(id=>{
  const next = quoteMap[id];
  const b = document.createElement("button");
  b.type = "button";
  b.innerHTML = `<span class="related-speaker">${next.speakerJp}</span><br><span class="related-line">${next.doorJp || next.jp || next.knownJp || next.quoteOriginal}</span>`;
  b.addEventListener("click",()=>{
    startWhiteTransition(next.regionEra || next.period || "言葉の奥へ");
    setTimeout(()=>{showScreen(quoteScreen);
    scrollToQuoteTop();loadQuote(next.id,{name:"",mood:""});endWhiteTransition()},720);
  });
  relatedQuotes.appendChild(b);
 });
 if(!ids.length){
  relatedQuotes.innerHTML = '<p class="muted">近い言葉は、次の更新で追加予定です。</p>';
 }
}


function scrollToQuoteTop(){
  try {
    window.scrollTo({top:0,left:0,behavior:"auto"});
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  } catch(e){
    window.scrollTo(0,0);
  }
}

function loadQuote(id,doorData){
 scrollToQuoteTop();
 const q=quoteMap[id]||pick(WORD_QUOTES);
 markSeen(q.id);
 doorLabel.textContent="";
 typeLabel.textContent=`${q.period} / ${q.type}`;
 quoteTitle.textContent=`${q.speaker}（${q.speakerJp}）`;
 languageLabel.textContent=q.languageLabel;
 quoteText.textContent=q.quoteOriginal || q.quote || "";
 if(q.knownJp){
   knownWrap.style.display="block";
   knownJp.textContent=q.knownJp;
 }else{
   knownWrap.style.display="none";
   knownJp.textContent="";
 }
 quoteJp.textContent=q.doorJp || q.jp || "";
 translationNote.textContent=q.translationNote || "";
 if(q.workContext){
   workContextWrap.style.display="block";
   workContextEl.innerHTML=(q.workContext || "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
 }else{
   workContextWrap.style.display="none";
   workContextEl.textContent="";
 }
 bioEl.textContent=q.bio || "";
 episodeEl.textContent=q.episode || "";
 sceneEl.textContent=q.scene;
 intentEl.textContent=q.intent;
 contextEl.textContent=q.context;
 connectionEl.textContent=q.connection;
 renderRelated(q);
 traceBox.innerHTML=traceHtml(q);
 wikiLink.href=`https://ja.wikipedia.org/wiki/${encodeURIComponent(q.speakerJp)}`;
}

function showDoorScreen(){
 showScreen(doorScreen);
 renderDoorChoices();
 
 updateProgressText();
}
shuffleBtn.addEventListener("click",renderDoorChoices);
backBtn.addEventListener("click",showDoorScreen);
nextBtn.addEventListener("click",showDoorScreen);
renderDoorChoices();


if(tocButton){
  tocButton.addEventListener("click",()=>{
    renderToc("");
    showScreen(tocScreen);
    if(tocSearch) tocSearch.value="";
  });
}
if(tocBackButton){
  tocBackButton.addEventListener("click",()=>showScreen(doorScreen));
}
if(resetSeenButton){
  resetSeenButton.addEventListener("click",resetSeen);
}
if(tocResetButton){
  tocResetButton.addEventListener("click",resetSeen);
}
if(tocSearch){
  tocSearch.addEventListener("input",()=>renderToc(tocSearch.value));
}
updateProgressText();
