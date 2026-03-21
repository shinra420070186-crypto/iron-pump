// ═══════════════════════════════════════════════════════════
// IRON PUMP — Elite Training System v2
// Body Weight + PR Tracking + Muscle Volume + Themes + Backup
// ═══════════════════════════════════════════════════════════

const PROGRAM = [
    {
        id:'day1',name:'Day 1',label:'UPPER (Chest + Back + Arms)',
        exercises:[
            {name:'Bench Press',muscle:'Chest',rec:'3×6-8'},
            {name:'Chest-Supported Row',muscle:'Back',rec:'3×8-10'},
            {name:'Incline Dumbbell Press',muscle:'Chest',rec:'3×8-10'},
            {name:'Lat Pulldown',muscle:'Back',rec:'3×8-10'},
            {name:'Machine Chest Fly',muscle:'Chest',rec:'3×12-15'},
            {name:'Lateral Raises',muscle:'Shoulders',rec:'3×12-15'},
            {name:'Face Pulls',muscle:'Shoulders',rec:'3×15-20'},
            {name:'Tricep Rope Pushdown',muscle:'Triceps',rec:'3×12-15'},
            {name:'Hammer Curls',muscle:'Biceps',rec:'2×10-12'}
        ]
    },
    {
        id:'day2',name:'Day 2',label:'LOWER (Quads) + CORE',
        exercises:[
            {name:'Squat',muscle:'Quads',rec:'3×5-8'},
            {name:'Leg Press',muscle:'Quads',rec:'3×10-12'},
            {name:'Leg Extension',muscle:'Quads',rec:'3×12-15'},
            {name:'RDL (light)',muscle:'Hamstrings',rec:'2×8-10'},
            {name:'Standing Calf Raise',muscle:'Calves',rec:'3×10-12'},
            {name:'Cable Crunch',muscle:'Core',rec:'3×10-15'},
            {name:'Plank',muscle:'Core',rec:'2×45-60 sec'}
        ]
    },
    {
        id:'day3',name:'Day 3',label:'PUSH (Shoulders + Upper Chest + light Oblique)',
        exercises:[
            {name:'Overhead Press',muscle:'Shoulders',rec:'3×5-8'},
            {name:'Incline Smith Press',muscle:'Chest',rec:'3×8-10'},
            {name:'Machine Lateral Raises',muscle:'Shoulders',rec:'4×12-20'},
            {name:'Upper Chest Cable Fly',muscle:'Chest',rec:'3×12-15'},
            {name:'Cable Lateral Raise',muscle:'Shoulders',rec:'2×12-15'},
            {name:'Dips',muscle:'Triceps',rec:'3×10-15'},
            {name:'Overhead Tricep Extension',muscle:'Triceps',rec:'3×10-12'},
            {name:'High Cable Side Bend',muscle:'Core',rec:'2×12-15 each'}
        ]
    },
    {
        id:'day4',name:'Day 4',label:'PULL (Back + Rear Delts + Biceps)',
        exercises:[
            {name:'Pull-ups or Lat Pulldown',muscle:'Back',rec:'3×6-10'},
            {name:'Chest-Supported Row',muscle:'Back',rec:'3×8-10'},
            {name:'Seated Row',muscle:'Back',rec:'3×10-12'},
            {name:'Shrugs',muscle:'Back',rec:'3×10-12'},
            {name:'Rear Delt Fly',muscle:'Shoulders',rec:'3×12-20'},
            {name:'Incline Dumbbell Curl',muscle:'Biceps',rec:'3×10-12'},
            {name:'Preacher Curl',muscle:'Biceps',rec:'2×12-15'}
        ]
    },
    {
        id:'day5',name:'Day 5',label:'LOWER (Glutes + Hamstrings) + CORE',
        exercises:[
            {name:'Romanian Deadlift',muscle:'Hamstrings',rec:'3×6-8'},
            {name:'Hip Thrust',muscle:'Glutes',rec:'3×6-10'},
            {name:'Hamstring Curl',muscle:'Hamstrings',rec:'3×12-15'},
            {name:'Bulgarian Split Squat',muscle:'Quads',rec:'2×8-10'},
            {name:'Seated Calf Raise',muscle:'Calves',rec:'3×12-15'},
            {name:'Hanging Knee Raises',muscle:'Core',rec:'3×10-15'},
            {name:'Woodchoppers or Pallof Press',muscle:'Core',rec:'2×12-15'}
        ]
    }
];

const THEMES = {
    cyan: {accent:'#00d4ff',dark:'#0066ff',grad:'linear-gradient(135deg,#00d4ff,#0066ff)'},
    violet: {accent:'#6b5eff',dark:'#4433dd',grad:'linear-gradient(135deg,#6b5eff,#4433dd)'},
    red: {accent:'#ff4466',dark:'#ff0055',grad:'linear-gradient(135deg,#ff4466,#ff0055)'},
    gold: {accent:'#ffaa00',dark:'#ff6600',grad:'linear-gradient(135deg,#ffaa00,#ff6600)'}
};

// ═══════════════════════════════════════════════════════════
// SOUND ENGINE
// ═══════════════════════════════════════════════════════════
class SoundEngine {
    constructor(){this.ctx=null;this.on=true;document.addEventListener('click',()=>{if(!this.ctx)this.ctx=new(window.AudioContext||window.webkitAudioContext)()},{once:true})}
    play(type){
        if(!this.on||!this.ctx)return;
        const now=this.ctx.currentTime,osc=this.ctx.createOscillator(),gain=this.ctx.createGain();
        osc.connect(gain);gain.connect(this.ctx.destination);
        const S={tap:{f:2200,d:.025,v:.08,t:'sine'},add:{f:1400,d:.06,v:.1,t:'sine'},skip:{f:800,d:.08,v:.06,t:'triangle'},finish:{f:880,d:.2,v:.12,t:'sine'},complete:{f:523,d:.4,v:.15,t:'sine'},back:{f:600,d:.04,v:.06,t:'sine'},delete:{f:400,d:.06,v:.08,t:'sawtooth'},start:{f:660,d:.15,v:.1,t:'sine'},rest:{f:1000,d:.3,v:.12,t:'sine'},pr:{f:880,d:.5,v:.15,t:'sine'}};
        const s=S[type]||S.tap;osc.type=s.t;osc.frequency.setValueAtTime(s.f,now);
        if(type==='complete'){osc.frequency.setValueAtTime(523,now);osc.frequency.setValueAtTime(659,now+.1);osc.frequency.setValueAtTime(784,now+.2)}
        if(type==='finish')osc.frequency.exponentialRampToValueAtTime(1320,now+s.d);
        if(type==='pr'){osc.frequency.setValueAtTime(660,now);osc.frequency.setValueAtTime(880,now+.15);osc.frequency.setValueAtTime(1100,now+.3)}
        gain.gain.setValueAtTime(s.v,now);gain.gain.exponentialRampToValueAtTime(.001,now+s.d);osc.start(now);osc.stop(now+s.d+.01);
    }
}

function createRipple(e,el){
    const r=el.getBoundingClientRect(),rip=document.createElement('span'),sz=Math.max(r.width,r.height);
    rip.style.width=rip.style.height=sz+'px';
    rip.style.left=(e.clientX||e.touches?.[0]?.clientX||0)-r.left-sz/2+'px';
    rip.style.top=(e.clientY||e.touches?.[0]?.clientY||0)-r.top-sz/2+'px';
    rip.className='ripple';el.appendChild(rip);setTimeout(()=>rip.remove(),600);
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
class IronPump {
    constructor(){
        this.workout=null;this.exIndex=0;this.timerInt=null;this.restInt=null;
        this.restDur=parseInt(localStorage.getItem('ip_rest_dur'))||120;
        this.restRem=0;this.startTime=null;this.sound=new SoundEngine();
        this.prRecords=JSON.parse(localStorage.getItem('ip_prs')||'{}');
        this.init();
    }

    init(){
        if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>this.onReady());
        else this.onReady();
    }

    onReady(){
        this.loadTheme();
        this.setupLoading();this.setupNav();this.renderDays();
        this.setupRest();this.setupComplete();this.setupBack();
        this.setupWeight();this.setupSettings();
        this.loadHistory();this.updateIntel();
        document.addEventListener('click',(e)=>{
            const btn=e.target.closest('button,.day-card,.mcard,.hero-card,.theme-btn');
            if(btn)createRipple(e,btn);
        });
    }

    // ─── Loading ───
    setupLoading(){
        setTimeout(()=>{
            document.getElementById('loader').classList.add('hidden');
            document.getElementById('app').classList.add('loaded');
            setTimeout(()=>{this.updateIntel();this.drawChart()},400);
        },2200);
    }

    // ─── Navigation ───
    setupNav(){
        document.querySelectorAll('.bnav').forEach(btn=>{
            btn.addEventListener('click',()=>{
                const page=btn.dataset.page;
                document.querySelectorAll('.bnav').forEach(b=>b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
                document.getElementById('page-'+page).classList.add('active');
                if(page==='intel'){this.updateIntel();this.drawChart();this.renderMuscleVolume()}
                if(page==='history')this.loadHistory();
                if(page==='weight')this.renderWeight();
                this.sound.play('tap');this.vib(10);
            });
        });
    }

    // ─── Back ───
    setupBack(){
        document.getElementById('backBtn').addEventListener('click',()=>{
            if(this.workout&&this.workout.totalSets>0){if(!confirm('Discard active workout?'))return}
            this.cancelWorkout();this.sound.play('back');this.vib(10);
        });
    }

    cancelWorkout(){
        if(this.timerInt)clearInterval(this.timerInt);this.stopRest();this.workout=null;
        document.getElementById('woActive').classList.add('hidden');
        document.getElementById('woInactive').classList.remove('hidden');
        document.getElementById('exContainer').innerHTML='';
        document.getElementById('liveVol').textContent='0';
        document.getElementById('liveSets').textContent='0';
        document.getElementById('liveEx').textContent='0';
        document.getElementById('woTimer').textContent='00:00';
    }

    // ─── Days ───
    renderDays(){
        const grid=document.getElementById('dayGrid');if(!grid)return;
        grid.innerHTML=PROGRAM.map((d,i)=>`
            <div class="day-card" data-day="${d.id}" style="animation:popIn .4s cubic-bezier(.34,1.56,.64,1) ${i*.08}s both">
                <div class="day-left"><span class="day-num">${d.name}</span><span class="day-sub">${d.label}</span><span class="day-count">${d.exercises.length} exercises</span></div>
                <svg class="day-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>`).join('');
        grid.addEventListener('click',(e)=>{
            const c=e.target.closest('.day-card');
            if(c){
                // water ripple
                const r=c.getBoundingClientRect();
                const rip=document.createElement('span');
                const sz=Math.max(r.width,r.height)*1.4;
                const cx=(e.clientX||e.touches?.[0]?.clientX||r.left+r.width/2)-r.left;
                const cy=(e.clientY||e.touches?.[0]?.clientY||r.top+r.height/2)-r.top;
                rip.className='water-ripple';
                rip.style.cssText=`width:${sz}px;height:${sz}px;left:${cx-sz/2}px;top:${cy-sz/2}px`;
                c.appendChild(rip);setTimeout(()=>rip.remove(),900);
                this.startWorkout(c.dataset.day);
            }
        });
    }

    // ─── Start Workout ───
    startWorkout(dayId){
        const day=PROGRAM.find(d=>d.id===dayId);if(!day)return;
        this.workout={dayId,dayName:day.name,dayLabel:day.label,splitName:day.name+' — '+day.label,
            exercises:day.exercises.map(ex=>({name:ex.name,muscle:ex.muscle,rec:ex.rec,sets:[],skipped:false,completed:false})),
            startTime:new Date().toISOString(),totalVolume:0,totalSets:0};
        this.exIndex=0;this.startTime=Date.now();this.startTimer();
        document.getElementById('woInactive').classList.add('hidden');
        document.getElementById('woActive').classList.remove('hidden');
        this.renderEx();this.updateHeader();this.updateLive();
        this.sound.play('start');this.vib(25);
    }

    startTimer(){
        if(this.timerInt)clearInterval(this.timerInt);
        this.timerInt=setInterval(()=>{
            const e=Date.now()-this.startTime;
            document.getElementById('woTimer').textContent=
                Math.floor(e/60000).toString().padStart(2,'0')+':'+Math.floor((e%60000)/1000).toString().padStart(2,'0');
        },1000);
    }

    updateHeader(){
        const wo=this.workout;
        document.getElementById('woSplit').textContent=wo.dayName+' — '+wo.dayLabel;
        document.getElementById('woProgress').textContent=wo.exercises.filter(e=>e.completed||e.skipped).length+'/'+wo.exercises.length;
    }

    // ─── Exercise View ───
    renderEx(){
        const c=document.getElementById('exContainer'),wo=this.workout;
        if(this.exIndex>=wo.exercises.length){this.finishWorkout();return}
        const ex=wo.exercises[this.exIndex],num=this.exIndex+1,total=wo.exercises.length;
        const hasData=ex.sets.some(s=>parseFloat(s.weight)>0&&parseFloat(s.reps)>0);

        let setsHtml='';
        if(ex.sets.length===0)setsHtml='<div class="no-sets">Tap "Add Set" to begin logging</div>';
        else setsHtml=ex.sets.map((set,si)=>{
            const filled=parseFloat(set.weight)>0&&parseFloat(set.reps)>0;
            return `<div class="set-row ${filled?'filled':''}" style="animation:popIn .3s cubic-bezier(.34,1.56,.64,1) ${si*.05}s both">
                <span class="set-num">${si+1}</span>
                <input type="number" class="set-input" placeholder="kg" value="${set.weight}" data-si="${si}" data-field="weight" inputmode="decimal">
                <input type="number" class="set-input" placeholder="reps" value="${set.reps}" data-si="${si}" data-field="reps" inputmode="numeric">
                <button class="set-del" data-si="${si}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>`;
        }).join('');

        let skipHtml=!hasData?
            `<button class="action-btn btn-skip-ex" id="skipBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>Skip Exercise</button>`:
            `<button class="action-btn btn-skip-set" id="skipBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>Skip Remaining Sets</button>`;

        c.innerHTML=`<div class="ex-active-card"><div class="ex-top-bar"></div>
            <div class="ex-progress-section"><div class="ex-progress-bar"><div class="ex-progress-fill" style="width:${(num/total)*100}%"></div></div><div class="ex-counter">EXERCISE ${num} OF ${total}</div></div>
            <div class="ex-body"><div class="ex-title-section"><h3 class="ex-title">${ex.name}</h3><span class="ex-muscle">${ex.muscle}</span><span class="ex-rec">${ex.rec}</span></div>
            <div class="pr-banner" id="prBanner"><div class="pr-banner-left"><span class="pr-banner-icon">🏅</span><div><div class="pr-banner-label">Best Set</div><div class="pr-banner-val" id="prBannerVal">—</div></div></div><span class="pr-banner-right" id="prBannerRight"></span></div>
            <div class="sets-list">${setsHtml}</div>
            <div class="ex-actions">
                <button class="action-btn btn-add" id="addSetBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add Set</button>
                ${skipHtml}
                ${hasData?`<button class="action-btn btn-finish-ex" id="finishExBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>Finish Exercise</button>`:''}
            </div></div></div>`;

        document.getElementById('addSetBtn').addEventListener('click',()=>{ex.sets.push({weight:'',reps:''});this.renderEx();this.sound.play('add');this.vib(10)});
        document.getElementById('skipBtn').addEventListener('click',()=>{
            if(!hasData){ex.skipped=true;ex.completed=true}else{ex.completed=true}
            this.exIndex++;this.updateHeader();this.updateLive();this.renderEx();
            this.sound.play('skip');this.vib(15);if(hasData)this.startRestTimer();
        });
        if(fb)fb.addEventListener('click',()=>{
            ex.completed=true;this.exIndex++;this.updateHeader();this.updateLive();
            this.renderEx();this.sound.play('finish');this.vib(25);this.startRestTimer();
        });
        c.querySelectorAll('.set-input').forEach(inp=>{
            inp.addEventListener('input',(e)=>{const si=parseInt(e.target.dataset.si);if(ex.sets[si]){ex.sets[si][e.target.dataset.field]=e.target.value;this.updateLive();this.updatePRBanner(ex)}});
            inp.addEventListener('focus',()=>inp.select());
        });
        // init PR banner
        this.updatePRBanner(ex);
        c.querySelectorAll('.set-del').forEach(btn=>{
            btn.addEventListener('click',()=>{ex.sets.splice(parseInt(btn.dataset.si),1);this.renderEx();this.updateLive();this.sound.play('delete');this.vib(10)});
        });
    }

    updateLive(){
        if(!this.workout)return;let vol=0,sets=0;
        this.workout.exercises.forEach(ex=>{ex.sets.forEach(s=>{const w=parseFloat(s.weight),r=parseFloat(s.reps);if(w>0&&r>0){vol+=w*r;sets++}})});
        const volEl=document.getElementById('liveVol'),old=volEl.textContent;
        volEl.textContent=Math.round(vol).toLocaleString();
        document.getElementById('liveSets').textContent=sets;
        document.getElementById('liveEx').textContent=this.workout.exercises.filter(e=>e.completed&&!e.skipped).length;
        if(volEl.textContent!==old){volEl.classList.remove('bump');void volEl.offsetWidth;volEl.classList.add('bump')}
        this.workout.totalVolume=vol;this.workout.totalSets=sets;
    }

    // ─── PR System ───
    getPR(exName){
        return this.prRecords[exName]||null;
    }

    savePR(exName,weight,reps){
        this.prRecords[exName]={weight,reps,date:new Date().toISOString()};
        localStorage.setItem('ip_prs',JSON.stringify(this.prRecords));
    }

    updatePRBanner(ex){
        const banner=document.getElementById('prBanner');if(!banner)return;
        const valEl=document.getElementById('prBannerVal');const rightEl=document.getElementById('prBannerRight');
        if(!valEl||!rightEl)return;

        // find best set in current exercise
        let bestW=0,bestR=0;
        ex.sets.forEach(s=>{const w=parseFloat(s.weight),r=parseFloat(s.reps);if(w>0&&r>0&&w>bestW){bestW=w;bestR=r}});

        const prev=this.getPR(ex.name);

        if(!prev){
            // no history yet
            if(bestW>0){
                valEl.textContent=bestW+' kg × '+bestR+' reps';
                rightEl.textContent='First time!';
                banner.classList.remove('pr-new');
            } else {
                valEl.textContent='No data yet';
                rightEl.textContent='';
            }
            return;
        }

        // show stored best
        const isNewPR=bestW>0&&(bestW>prev.weight||(bestW===prev.weight&&bestR>prev.reps));

        if(isNewPR){
            // new PR achieved this session
            const old=valEl.textContent;
            valEl.textContent=bestW+' kg × '+bestR+' reps';
            rightEl.textContent='🏆 NEW PR!';
            if(valEl.textContent!==old){valEl.classList.remove('bump');void valEl.offsetWidth;valEl.classList.add('bump')}
            banner.classList.add('pr-new');
            this.savePR(ex.name,bestW,bestR);
            this.sound.play('pr');this.vib(20);
        } else {
            valEl.textContent=prev.weight+' kg × '+prev.reps+' reps';
            rightEl.textContent='Best ever';
            banner.classList.remove('pr-new');
        }
    }

    // ─── Rest Timer ───
    setupRest(){
        document.getElementById('restSkip').addEventListener('click',()=>{this.stopRest();this.sound.play('tap')});
        document.getElementById('restAdd30').addEventListener('click',()=>{this.restRem+=30;this.sound.play('add');this.vib(10)});
    }

    startRestTimer(){
        this.restRem=this.restDur;const total=this.restDur;
        document.getElementById('restOverlay').classList.remove('hidden');
        this.updateRestUI(total);this.sound.play('rest');
        if(this.restInt)clearInterval(this.restInt);
        this.restInt=setInterval(()=>{this.restRem--;this.updateRestUI(total);if(this.restRem<=0){this.stopRest();this.sound.play('finish');this.vib(50)}},1000);
    }

    updateRestUI(total){
        document.getElementById('restTime').textContent=Math.floor(this.restRem/60)+':'+(this.restRem%60).toString().padStart(2,'0');
        const circ=2*Math.PI*90;
        document.getElementById('restRingFill').style.strokeDasharray=circ;
        document.getElementById('restRingFill').style.strokeDashoffset=circ-(this.restRem/total)*circ;
    }

    stopRest(){if(this.restInt)clearInterval(this.restInt);document.getElementById('restOverlay').classList.add('hidden')}

    // ─── Finish ───
    setupComplete(){document.getElementById('compClose').addEventListener('click',()=>{document.getElementById('completeOverlay').classList.add('hidden');this.sound.play('tap')})}

    finishWorkout(){
        if(!this.workout)return;if(this.timerInt)clearInterval(this.timerInt);this.stopRest();
        const dur=Math.round((Date.now()-this.startTime)/60000);
        this.workout.endTime=new Date().toISOString();this.workout.duration=dur;this.updateLive();
        if(this.workout.totalSets>0){
            const all=JSON.parse(localStorage.getItem('ironpump_workouts')||'[]');
            all.push(this.workout);localStorage.setItem('ironpump_workouts',JSON.stringify(all));
        }
        document.getElementById('compVol').textContent=Math.round(this.workout.totalVolume).toLocaleString();
        document.getElementById('compSets').textContent=this.workout.totalSets;
        document.getElementById('compTime').textContent=dur;
        document.getElementById('completeOverlay').classList.remove('hidden');
        document.getElementById('woActive').classList.add('hidden');
        document.getElementById('woInactive').classList.remove('hidden');
        document.getElementById('exContainer').innerHTML='';
        document.getElementById('liveVol').textContent='0';
        document.getElementById('liveSets').textContent='0';
        document.getElementById('liveEx').textContent='0';
        document.getElementById('woTimer').textContent='00:00';
        this.workout=null;this.sound.play('complete');this.vib(40);
    }

    // ─── Body Weight ───
    setupWeight(){
        document.getElementById('bwSave').addEventListener('click',()=>{
            const val=parseFloat(document.getElementById('bwInput').value);
            if(!val||val<20||val>300){alert('Enter a valid weight (20-300 kg)');return}
            const logs=JSON.parse(localStorage.getItem('ip_bw')||'[]');
            logs.push({weight:val,date:new Date().toISOString()});
            localStorage.setItem('ip_bw',JSON.stringify(logs));
            document.getElementById('bwInput').value='';
            this.renderWeight();this.sound.play('finish');this.vib(20);
        });
    }

    renderWeight(){
        const logs=JSON.parse(localStorage.getItem('ip_bw')||'[]');
        // Current weight display
        const cur=document.getElementById('bwCurrent');
        if(logs.length===0){cur.innerHTML='<div class="bw-current"><span class="bw-label">No weight logged yet</span><span class="bw-value">—</span></div>';
        }else{
            const latest=logs[logs.length-1];const prev=logs.length>1?logs[logs.length-2]:null;
            const diff=prev?(latest.weight-prev.weight).toFixed(1):0;
            const cls=diff>0?'up':diff<0?'down':'same';
            const sign=diff>0?'+':'';
            cur.innerHTML=`<div class="bw-current"><span class="bw-label">Current Weight</span><div><span class="bw-value">${latest.weight} kg</span>${prev?`<span class="bw-change ${cls}">${sign}${diff} kg</span>`:''}</div></div>`;
        }
        // Chart
        this.drawWeightChart(logs);
        // History
        const hist=document.getElementById('bwHistory');
        if(logs.length===0){hist.innerHTML='';return}
        hist.innerHTML='<div class="settings-card"><h3>Weight Log</h3>'+logs.slice().reverse().slice(0,20).map(l=>{
            const d=new Date(l.date);
            return `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)"><span style="font-size:.8rem;color:var(--text3)">${d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span><span style="font-family:var(--mono);font-weight:600">${l.weight} kg</span></div>`;
        }).join('')+'</div>';
    }

    drawWeightChart(logs){
        const canvas=document.getElementById('bwChart');if(!canvas)return;
        const ctx=canvas.getContext('2d');const dpr=window.devicePixelRatio||1;
        const rect=canvas.getBoundingClientRect();canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;
        ctx.scale(dpr,dpr);const w=rect.width,h=rect.height;
        const pad={t:20,r:15,b:30,l:45};const cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;

        if(logs.length<2){ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='13px Space Grotesk';ctx.textAlign='center';ctx.fillText('Log more weights to see trend',w/2,h/2);return}

        const data=logs.slice(-20).map(l=>l.weight);
        const labels=logs.slice(-20).map(l=>{const d=new Date(l.date);return(d.getMonth()+1)+'/'+d.getDate()});
        const mx=Math.max(...data)*1.02,mn=Math.min(...data)*.98,range=mx-mn||1;
        const xS=(i)=>pad.l+(i/(data.length-1))*cw;
        const yS=(v)=>pad.t+ch-((v-mn)/range)*ch;

        ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;
        for(let i=0;i<=4;i++){const y=pad.t+(i/4)*ch;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();
            ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='10px JetBrains Mono';ctx.textAlign='right';
            ctx.fillText((mx-(i/4)*range).toFixed(1),pad.l-8,y+4)}

        ctx.textAlign='center';labels.forEach((l,i)=>{if(i%Math.ceil(data.length/6)===0)ctx.fillText(l,xS(i),h-8)});

        const grad=ctx.createLinearGradient(0,pad.t,0,h-pad.b);grad.addColorStop(0,'rgba(0,255,136,0.3)');grad.addColorStop(1,'rgba(0,255,136,0)');
        ctx.beginPath();ctx.moveTo(xS(0),h-pad.b);for(let i=0;i<data.length;i++)ctx.lineTo(xS(i),yS(data[i]));
        ctx.lineTo(xS(data.length-1),h-pad.b);ctx.closePath();ctx.fillStyle=grad;ctx.fill();

        ctx.shadowColor='rgba(0,255,136,0.5)';ctx.shadowBlur=15;
        ctx.beginPath();ctx.strokeStyle='#00ff88';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';
        for(let i=0;i<data.length;i++){if(i===0)ctx.moveTo(xS(i),yS(data[i]));else ctx.lineTo(xS(i),yS(data[i]))}
        ctx.stroke();ctx.shadowBlur=0;

        for(let i=0;i<data.length;i++){const x=xS(i),y=yS(data[i]);
            ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle='rgba(0,255,136,0.2)';ctx.fill();
            ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle='#00ff88';ctx.fill();
            ctx.beginPath();ctx.arc(x,y,1.5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill()}
    }

    // ─── Muscle Volume ───
    renderMuscleVolume(){
        const all=JSON.parse(localStorage.getItem('ironpump_workouts')||'[]');
        const weekAgo=Date.now()-7*86400000;const muscles={};
        all.forEach(wo=>{
            if(new Date(wo.startTime).getTime()<weekAgo)return;
            (wo.exercises||[]).forEach(ex=>{
                if(!ex.completed||ex.skipped)return;
                const m=ex.muscle;if(!muscles[m])muscles[m]=0;
                muscles[m]+=ex.sets.filter(s=>parseFloat(s.weight)>0&&parseFloat(s.reps)>0).length;
            });
        });

        const grid=document.getElementById('muscleGrid');
        const sorted=Object.entries(muscles).sort((a,b)=>b[1]-a[1]);
        const max=sorted.length>0?sorted[0][1]:1;
        const colors=['c1','c2','c3','c4'];

        if(sorted.length===0){grid.innerHTML='<p style="text-align:center;color:var(--text4);padding:20px">Complete workouts to see muscle breakdown</p>';return}

        grid.innerHTML=sorted.map((m,i)=>`
            <div class="muscle-row" style="animation:popIn .3s ease ${i*.06}s both">
                <div class="muscle-info"><span class="muscle-name">${m[0]}</span><span class="muscle-sets">${m[1]} sets</span></div>
                <div class="muscle-bar"><div class="muscle-bar-fill ${colors[i%4]}" style="width:${(m[1]/max)*100}%"></div></div>
            </div>`).join('');
    }

    // ─── History ───
    loadHistory(){
        const all=JSON.parse(localStorage.getItem('ironpump_workouts')||'[]');const list=document.getElementById('historyList');
        if(all.length===0){list.innerHTML='<div class="no-history"><p>No workouts yet</p><p>Complete your first session!</p></div>';return}
        list.innerHTML=all.slice().reverse().map((wo,i)=>{
            const d=new Date(wo.startTime);const ds=d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
            return `<div class="history-card" style="animation:popIn .4s ease ${i*.06}s both"><div class="history-top"><span class="history-split">${wo.splitName||wo.dayName}</span><span class="history-date">${ds}</span></div><div class="history-stats"><span class="history-stat">Vol: <span>${Math.round(wo.totalVolume||0).toLocaleString()} kg</span></span><span class="history-stat">Sets: <span>${wo.totalSets||0}</span></span><span class="history-stat">Time: <span>${wo.duration||0}m</span></span></div></div>`;
        }).join('');
    }

    // ─── Intelligence ───
    updateIntel(){
        const all=JSON.parse(localStorage.getItem('ironpump_workouts')||'[]');
        const now=Date.now(),weekAgo=now-7*86400000,monthAgo=now-30*86400000;
        let weekVol=0,lastWeekVol=0,monthSessions=0,totalEx=0;
        all.forEach(wo=>{const t=new Date(wo.startTime).getTime();
            if(t>weekAgo)weekVol+=wo.totalVolume||0;
            if(t>weekAgo-7*86400000&&t<=weekAgo)lastWeekVol+=wo.totalVolume||0;
            if(t>monthAgo)monthSessions++;
            totalEx+=(wo.exercises||[]).filter(e=>e.completed&&!e.skipped).length;
        });

        const streak=this.getStreak(all);
        let perf=0;if(all.length>0)perf=Math.min(100,Math.round((weekVol/(lastWeekVol||weekVol||1))*70+streak*3));
        const weeksTracked=Math.max(1,Math.ceil((now-new Date(all[0]?.startTime||now).getTime())/(7*86400000)));
        const avgPerWeek=all.length/weeksTracked;
        const cons=Math.min(100,Math.round((avgPerWeek/5)*100));
        const last3Days=all.filter(wo=>new Date(wo.startTime).getTime()>now-3*86400000).length;
        const rec=last3Days>=3?30:last3Days===2?55:last3Days===1?80:100;

        this.animateVal('intel-vol',weekVol);this.animateVal('intel-sessions',monthSessions);
        this.animateVal('intel-excount',totalEx);this.animateVal('intel-streak',streak);
        this.animateRing('perfRing',perf,'perfNum');this.animateRing('consRing',cons,'consNum');this.animateRing('recRing',rec,'recNum');

        const vt=document.getElementById('volTrend');
        if(vt){const d=weekVol-lastWeekVol;vt.textContent=all.length===0?'No data':d>0?'+'+Math.round(d).toLocaleString()+' kg':d<0?Math.round(d).toLocaleString()+' kg':'Stable'}
        const st=document.getElementById('sesTrend');if(st)st.textContent=all.length===0?'No data':avgPerWeek.toFixed(1)+'/week';

        this.renderMuscleVolume();
    }

    animateRing(ringId,val,numId){
        const el=document.getElementById(ringId);if(!el)return;
        const ring=el.querySelector('.cprog-ring'),numEl=document.getElementById(numId);
        const circ=2*Math.PI*40,offset=circ-(val/100)*circ;
        ring.style.strokeDasharray=circ;ring.style.strokeDashoffset=circ;el.dataset.val=val;
        setTimeout(()=>{ring.style.strokeDashoffset=offset;
            const start=performance.now();
            const tick=(now)=>{const p=Math.min((now-start)/1500,1);numEl.textContent=Math.round(val*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)};
            requestAnimationFrame(tick)},300);
    }

    animateVal(id,target){
        const el=document.getElementById(id);if(!el)return;
        const start=performance.now();
        const tick=(now)=>{const p=Math.min((now-start)/1200,1);el.textContent=Math.round(target*(1-Math.pow(1-p,3))).toLocaleString();if(p<1)requestAnimationFrame(tick)};
        setTimeout(()=>requestAnimationFrame(tick),400);
    }

    getStreak(all){
        if(all.length===0)return 0;
        const dates=[...new Set(all.map(w=>new Date(w.startTime).toDateString()))].sort((a,b)=>new Date(b)-new Date(a));
        let streak=1;for(let i=0;i<dates.length-1;i++){if((new Date(dates[i])-new Date(dates[i+1]))/86400000<=1.5)streak++;else break}
        return streak;
    }

    // ─── Chart ───
    drawChart(){
        const canvas=document.getElementById('volChart');if(!canvas)return;
        const ctx=canvas.getContext('2d');const dpr=window.devicePixelRatio||1;
        const rect=canvas.getBoundingClientRect();canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;
        ctx.scale(dpr,dpr);const w=rect.width,h=rect.height;
        const pad={t:20,r:15,b:30,l:45};const cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;
        const wd=this.getChartData();
        if(wd.values.length<2){ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='13px Space Grotesk';ctx.textAlign='center';ctx.fillText('Complete workouts to see trends',w/2,h/2);return}
        const data=wd.values,labels=wd.labels;const mx=Math.max(...data)*1.15||100;
        const xS=(i)=>pad.l+(i/(data.length-1))*cw;const yS=(v)=>pad.t+ch-(v/mx)*ch;

        const draw=(progress)=>{
            ctx.clearRect(0,0,w,h);ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;
            for(let i=0;i<=4;i++){const y=pad.t+(i/4)*ch;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();
                ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='10px JetBrains Mono';ctx.textAlign='right';ctx.fillText(Math.round(mx-(i/4)*mx).toLocaleString(),pad.l-8,y+4)}
            ctx.textAlign='center';labels.forEach((l,i)=>{ctx.fillText(l,xS(i),h-8)});
            const len=Math.floor(data.length*progress);if(len<1)return;
            const grad=ctx.createLinearGradient(0,pad.t,0,h-pad.b);grad.addColorStop(0,'rgba(0,212,255,0.3)');grad.addColorStop(1,'rgba(0,212,255,0)');
            ctx.beginPath();ctx.moveTo(xS(0),h-pad.b);for(let i=0;i<=Math.min(len,data.length-1);i++)ctx.lineTo(xS(i),yS(data[i]));
            ctx.lineTo(xS(Math.min(len,data.length-1)),h-pad.b);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
            ctx.shadowColor='rgba(0,212,255,0.5)';ctx.shadowBlur=15;ctx.beginPath();ctx.strokeStyle='#00d4ff';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';
            for(let i=0;i<=Math.min(len,data.length-1);i++){if(i===0)ctx.moveTo(xS(i),yS(data[i]));else ctx.lineTo(xS(i),yS(data[i]))}ctx.stroke();ctx.shadowBlur=0;
            for(let i=0;i<=Math.min(len,data.length-1);i++){const x=xS(i),y=yS(data[i]);
                ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fillStyle='rgba(0,212,255,0.2)';ctx.fill();
                ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle='#00d4ff';ctx.fill();
                ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill()}
        };
        const st=performance.now();const anim=(now)=>{draw(1-Math.pow(1-Math.min((now-st)/1500,1),3));if((now-st)<1500)requestAnimationFrame(anim)};requestAnimationFrame(anim);
    }

    getChartData(){
        const all=JSON.parse(localStorage.getItem('ironpump_workouts')||'[]');const weeks={};
        all.forEach(wo=>{const d=new Date(wo.startTime);const ws=new Date(d);ws.setDate(d.getDate()-d.getDay());
            const key=ws.toLocaleDateString('en-US',{month:'short',day:'numeric'});weeks[key]=(weeks[key]||0)+(wo.totalVolume||0)});
        return{labels:Object.keys(weeks),values:Object.values(weeks).map(v=>Math.round(v))};
    }

    // ─── Settings ───
    setupSettings(){
        // Themes
        document.querySelectorAll('.theme-btn').forEach(btn=>{
            btn.addEventListener('click',()=>{
                document.querySelectorAll('.theme-btn').forEach(b=>b.classList.remove('active'));
                btn.classList.add('active');this.applyTheme(btn.dataset.theme);
                localStorage.setItem('ip_theme',btn.dataset.theme);this.sound.play('tap');this.vib(10);
            });
        });

        // Export
        document.getElementById('exportBtn').addEventListener('click',()=>{this.exportData();this.sound.play('finish')});
        // Import
        document.getElementById('importBtn').addEventListener('click',()=>{document.getElementById('importFile').click()});
        document.getElementById('importFile').addEventListener('change',(e)=>{this.importData(e);this.sound.play('complete')});

        // Rest Duration Options
        const restOpts=document.getElementById('restOptions');
        [60,90,120,150,180].forEach(sec=>{
            const btn=document.createElement('button');
            btn.className='action-btn btn-add';
            btn.style.cssText='flex:1;min-width:60px;padding:10px';
            btn.textContent=sec>=60?(sec/60)+'m':sec+'s';
            if(sec===this.restDur)btn.style.borderColor='var(--cyan)';btn.style.color=sec===this.restDur?'var(--cyan)':'';
            btn.addEventListener('click',()=>{
                this.restDur=sec;localStorage.setItem('ip_rest_dur',sec);
                restOpts.querySelectorAll('button').forEach(b=>{b.style.borderColor='';b.style.color=''});
                btn.style.borderColor='var(--cyan)';btn.style.color='var(--cyan)';
                this.sound.play('tap');this.vib(10);
            });
            restOpts.appendChild(btn);
        });
    }

    // ─── Themes ───
    loadTheme(){const t=localStorage.getItem('ip_theme')||'cyan';this.applyTheme(t);
        setTimeout(()=>{const btn=document.querySelector(`[data-theme="${t}"]`);if(btn){document.querySelectorAll('.theme-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}},100)}

    applyTheme(name){
        const t=THEMES[name]||THEMES.cyan;const r=document.documentElement;
        r.style.setProperty('--cyan',t.accent);r.style.setProperty('--blue',t.dark);
        r.style.setProperty('--gcyan',t.grad);
    }

    // ─── Backup ───
    exportData(){
        const data={workouts:JSON.parse(localStorage.getItem('ironpump_workouts')||'[]'),
            bodyweight:JSON.parse(localStorage.getItem('ip_bw')||'[]'),
            prs:JSON.parse(localStorage.getItem('ip_prs')||'{}'),
            theme:localStorage.getItem('ip_theme')||'cyan',
            restDur:localStorage.getItem('ip_rest_dur')||'120',
            exportDate:new Date().toISOString()};
        const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
        const url=URL.createObjectURL(blob);const a=document.createElement('a');
        a.href=url;a.download='ironpump-backup-'+new Date().toISOString().split('T')[0]+'.json';
        a.click();URL.revokeObjectURL(url);
    }

    importData(e){
        const file=e.target.files[0];if(!file)return;
        const reader=new FileReader();
        reader.onload=(ev)=>{
            try{
                const data=JSON.parse(ev.target.result);
                if(data.workouts)localStorage.setItem('ironpump_workouts',JSON.stringify(data.workouts));
                if(data.bodyweight)localStorage.setItem('ip_bw',JSON.stringify(data.bodyweight));
                if(data.prs)localStorage.setItem('ip_prs',JSON.stringify(data.prs));
                if(data.theme){localStorage.setItem('ip_theme',data.theme);this.applyTheme(data.theme)}
                if(data.restDur){localStorage.setItem('ip_rest_dur',data.restDur);this.restDur=parseInt(data.restDur)}
                alert('Data imported successfully!');this.loadHistory();this.updateIntel();this.renderWeight();
            }catch(err){alert('Invalid backup file!')}
        };
        reader.readAsText(file);e.target.value='';
    }

    vib(ms){if('vibrate' in navigator)navigator.vibrate(ms)}
}

const app=new IronPump();
