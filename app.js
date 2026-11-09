const $=id=>document.getElementById(id);
const defaultTasks=[
 {text:"Physics: board theory / derivation practice",subject:"Physics",done:false},
 {text:"Biology: NCERT reading + diagrams",subject:"Biology",done:false},
 {text:"Chemistry: Organic Chemistry practice",subject:"Chemistry",done:false},
 {text:"NEET MCQs (mixed or current chapter)",subject:"NEET",done:false},
 {text:"Revision + review mistakes",subject:"Revision",done:false}
];
const chapters=[
 ["Physics","Electrostatics"],["Physics","Current Electricity"],["Physics","Magnetic Effects of Current"],["Physics","Electromagnetic Induction"],["Physics","Alternating Current"],["Physics","Electromagnetic Waves"],["Physics","Optics"],["Physics","Dual Nature"],["Physics","Atoms and Nuclei"],["Physics","Semiconductor Electronics"],
 ["Chemistry","Organic Chemistry"],["Chemistry","Physical Chemistry"],["Chemistry","Inorganic Chemistry"],
 ["Biology","Reproduction"],["Biology","Genetics and Evolution"],["Biology","Biology and Human Welfare"],["Biology","Biotechnology"],["Biology","Ecology"]
];
let state=JSON.parse(localStorage.getItem("neetQuestState")||"{}");
state.tasks ||= defaultTasks; state.chapters ||= {}; state.xp ||= 0; state.streak ||= 0;
function save(){localStorage.setItem("neetQuestState",JSON.stringify(state));render();}
function render(){
 $("xp").textContent=state.xp; $("streak").textContent=state.streak;
 const done=state.tasks.filter(t=>t.done).length,total=state.tasks.length,pct=total?Math.round(done/total*100):0;
 $("progressText").textContent=pct+"%"; $("progressBar").style.width=pct+"%"; $("doneCount").textContent=`${done} / ${total}`;
 $("taskList").innerHTML="";
 state.tasks.forEach((t,i)=>{const row=document.createElement("div");row.className="task"+(t.done?" done":"");
 row.innerHTML=`<input type="checkbox" ${t.done?"checked":""} aria-label="Complete task"><span class="tasktext"></span><button aria-label="Delete task">✕</button>`;
 row.querySelector(".tasktext").textContent=t.text;
 row.querySelector("input").onchange=e=>{if(e.target.checked&&!t.done)state.xp+=10;t.done=e.target.checked;save();};
 row.querySelector("button").onclick=()=>{state.tasks.splice(i,1);save();};$("taskList").append(row);});
 let counts={Physics:[0,0],Chemistry:[0,0],Biology:[0,0]};
 chapters.forEach(([s,c])=>{counts[s][1]++;if(state.chapters[s+"|"+c])counts[s][0]++;});
 Object.keys(counts).forEach(s=>{let p=counts[s][1]?Math.round(counts[s][0]/counts[s][1]*100):0;$(`${s.toLowerCase()}Bar`).style.width=p+"%";$(`${s.toLowerCase()}Pct`).textContent=p+"%";});
 $("chapterList").innerHTML="";
 chapters.forEach(([s,c])=>{let key=s+"|"+c,row=document.createElement("label");row.className="chapter";row.innerHTML=`<input type="checkbox" ${state.chapters[key]?"checked":""}><span></span><small></small>`;row.querySelector("span").textContent=c;row.querySelector("small").textContent=s;row.querySelector("input").onchange=e=>{state.chapters[key]=e.target.checked; if(e.target.checked)state.xp+=5;save();};$("chapterList").append(row);});
 const exam=new Date("2027-02-16T00:00:00+05:30");$("boardCountdown").textContent=Math.max(0,Math.ceil((exam-new Date())/86400000))+" days";
}
$("addBtn").onclick=()=>{let text=$("taskInput").value.trim();if(!text)return;state.tasks.push({text,done:false,subject:"Custom"});$("taskInput").value="";save();};
$("taskInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("addBtn").click();});
$("resetBtn").onclick=()=>{if(confirm("Reset today's tasks? This keeps chapter progress and notes.")){state.tasks=defaultTasks.map(t=>({...t}));save();}};
$("saveNotes").onclick=()=>{localStorage.setItem("neetQuestMistakes",$("mistakes").value);$("noteStatus").textContent="Saved on this device ✓";};
$("mistakes").value=localStorage.getItem("neetQuestMistakes")||"";
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();
