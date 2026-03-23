// ═══════════════════════════════════════════════════════════
// IRON PUMP — Elite Training System v5
// Clean build — no Arena, premium Body Weight page
// ═══════════════════════════════════════════════════════════

const PROGRAM = [
    {id:'day1',name:'Day 1',label:'UPPER (Chest + Back + Arms)',exercises:[{name:'Bench Press',muscle:'Chest',rec:'3×6-8'},{name:'Chest-Supported Row',muscle:'Back',rec:'3×8-10'},{name:'Incline Dumbbell Press',muscle:'Chest',rec:'3×8-10'},{name:'Lat Pulldown',muscle:'Back',rec:'3×8-10'},{name:'Machine Chest Fly',muscle:'Chest',rec:'3×12-15'},{name:'Lateral Raises',muscle:'Shoulders',rec:'3×12-15'},{name:'Face Pulls',muscle:'Shoulders',rec:'3×15-20'},{name:'Tricep Rope Pushdown',muscle:'Triceps',rec:'3×12-15'},{name:'Hammer Curls',muscle:'Biceps',rec:'2×10-12'}]},
    {id:'day2',name:'Day 2',label:'LOWER (Quads) + CORE',exercises:[{name:'Squat',muscle:'Quads',rec:'3×5-8'},{name:'Leg Press',muscle:'Quads',rec:'3×10-12'},{name:'Leg Extension',muscle:'Quads',rec:'3×12-15'},{name:'RDL (light)',muscle:'Hamstrings',rec:'2×8-10'},{name:'Standing Calf Raise',muscle:'Calves',rec:'3×10-12'},{name:'Cable Crunch',muscle:'Core',rec:'3×10-15'},{name:'Plank',muscle:'Core',rec:'2×45-60 sec'}]},
    {id:'day3',name:'Day 3',label:'PUSH (Shoulders + Upper Chest + light Oblique)',exercises:[{name:'Overhead Press',muscle:'Shoulders',rec:'3×5-8'},{name:'Incline Smith Press',muscle:'Chest',rec:'3×8-10'},{name:'Machine Lateral Raises',muscle:'Shoulders',rec:'4×12-20'},{name:'Upper Chest Cable Fly',muscle:'Chest',rec:'3×12-15'},{name:'Cable Lateral Raise',muscle:'Shoulders',rec:'2×12-15'},{name:'Dips',muscle:'Triceps',rec:'3×10-15'},{name:'Overhead Tricep Extension',muscle:'Triceps',rec:'3×10-12'},{name:'High Cable Side Bend',muscle:'Core',rec:'2×12-15 each'}]},
    {id:'day4',name:'Day 4',label:'PULL (Back + Rear Delts + Biceps)',exercises:[{name:'Pull-ups or Lat Pulldown',muscle:'Back',rec:'3×6-10'},{name:'Chest-Supported Row',muscle:'Back',rec:'3×8-10'},{name:'Seated Row',muscle:'Back',rec:'3×10-12'},{name:'Shrugs',muscle:'Back',rec:'3×10-12'},{name:'Rear Delt Fly',muscle:'Shoulders',rec:'3×12-20'},{name:'Incline Dumbbell Curl',muscle:'Biceps',rec:'3×10-12'},{name:'Preacher Curl',muscle:'Biceps',rec:'2×12-15'}]},
    {id:'day5',name:'Day 5',label:'LOWER (Glutes + Hamstrings) + CORE',exercises:[{name:'Romanian Deadlift',muscle:'Hamstrings',rec:'3×6-8'},{name:'Hip Thrust',muscle:'Glutes',rec:'3×6-10'},{name:'Hamstring Curl',muscle:'Hamstrings',rec:'3×12-15'},{name:'Bulgarian Split Squat',muscle:'Quads',rec:'2×8-10'},{name:'Seated Calf Raise',muscle:'Calves',rec:'3×12-15'},{name:'Hanging Knee Raises',muscle:'Core',rec:'3×10-15'},{name:'Woodchoppers or Pallof Press',muscle:'Core',rec:'2×12-15'}]}
];

const THEMES = {
    cyan:   {accent:'#00d4ff',dark:'#0066ff',grad:'linear-gradient(135deg,#00d4ff,#0066ff)'},
    violet: {accent:'#6b5eff',dark:'#4433dd',grad:'linear-gradient(135deg,#6b5eff,#4433dd)'},
    red:    {accent:'#ff4466',dark:'#ff0055',grad:'linear-gradient(135deg,#ff4466,#ff0055)'},
    gold:   {accent:'#ffaa00',dark:'#ff6600',grad:'linear-gradient(135deg,#ffaa00,#ff6600)'}
};

class SoundEngine {
    constructor(){this.ctx=null;this.on=true;document.addEventListener('click',()=>{if(!this.ctx)this.ctx=new(window.AudioContext||window.webkitAudioContext)()},{once:true});}
    play(type){
        if(!this.on||!this.ctx)return;
        const now=this.ctx.currentTime,osc=this.ctx.createOscillator(),gain=this.ctx.createGain();
        osc.connect(gain);gain.connect(this.ctx.destination);
        const S={tap:{f:2200,d:.025,v:.08,t:'sine'},add:{f:1400,d:.06,v:.1,t:'sine'},skip:{f:800,d:.08,v:.06,t:'triangle'},finish:{f:880,d:.2,v:.12,t:'sine'},complete:{f:523,d:.4,v:.15,t:'sine'},back:{f:600,d:.04,v:.06,t:'sine'},start:{f:660,d:.15,v:.1,t:'sine'},rest:{f:1000,d:.3,v:.12,t:'sine'},pr:{f:880,d:.5,v:.15,t:'sine'}};
        const s=S[type]||S.tap;osc.type=s.t;osc.frequency.setValueAtTime(s.f,now);
        if(type==='complete'){osc.frequency.setValueAtTime(523,now);osc.frequency.setValueAtTime(659,now+.1);osc.frequency.setValueAtTime(784,now+.2);}
        if(type==='finish')osc.frequency.exponentialRampToValueAtTime(1320,now+s.d);
        if(type==='pr'){osc.frequency.setValueAtTime(660,now);osc.frequency.setValueAtTime(880,now+.15);osc.frequency.setValueAtTime(1100,now+.3);}
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

function epley1RM(weight,reps){return reps===1?weight:Math.round(weight*(1+reps/30));}

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
            setTimeout(()=>{this.updateIntel();this.drawChart();},400);
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
                window.scrollTo({top:0,behavior:'instant'});
                if(page==='intel'){this.updateIntel();setTimeout(()=>this.drawChart(),50);this.renderMuscleVolume();}
                if(page==='history')this.loadHistory();
                if(page==='weight')setTimeout(()=>this.renderWeight(),50);
                this.sound.play('tap');this.vib(10);
            });
        });
    }

    // ─── Back ───
    setupBack(){
        document.getElementById('backBtn').addEventListener('click',()=>{
            if(this.workout&&this.workout.totalSets>0){if(!confirm('Discard active workout?'))return;}
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
            <div class="day-card" data-day="${d.id}" style="animation:popIn .35s ease ${i*.06}s both">
                <div class="day-left"><span class="day-num">${d.name}</span><span class="day-sub">${d.label}</span><span class="day-count">${d.exercises.length} exercises</span></div>
                <svg class="day-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>`).join('');
        grid.addEventListener('click',(e)=>{
            const c=e.target.closest('.day-card');
            if(c){
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

    // ─── Previous Session ───
    getPrevSession(dayId){
        const all=JSON.parse(localStorage.getItem('ironpump_workouts')||'[]');
        const prev=all.filter(w=>w.dayId===dayId&&w.endTime);
        return prev.length<1?null:prev[prev.length-1];
    }

    getPrevSetData(dayId,exName,setIndex){
        const session=this.getPrevSession(dayId);if(!session)return null;
        const ex=(session.exercises||[]).find(e=>e.name===exName);
        if(!ex||!ex.sets||!ex.sets[setIndex])return null;
        const s=ex.sets[setIndex];
        return(parseFloat(s.weight)>0&&parseFloat(s.reps)>0)?s:null;
    }

    // ─── Start Workout ───
    startWorkout(dayId){
        const day=PROGRAM.find(d=>d.id===dayId);if(!day)return;
        this.workout={dayId,dayName:day.name,dayLabel:day.label,splitName:day.name+' — '+day.label,
            exercises:day.exercises.map(ex=>({name:ex.name,muscle:ex.muscle,rec:ex.rec,sets:[{weight:'',reps:''}],currentSetIndex:0,skipped:false,completed:false})),
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
        if(this.exIndex>=wo.exercises.length){this.finishWorkout();return;}
        const ex=wo.exercises[this.exIndex],num=this.exIndex+1,total=wo.exercises.length;
        if(ex.currentSetIndex===undefined)ex.currentSetIndex=0;
        const si=ex.currentSetIndex;
        const set=ex.sets[si]||{weight:'',reps:''};
        if(!ex.sets[si])ex.sets[si]=set;
        const hasData=parseFloat(set.weight)>0&&parseFloat(set.reps)>0;
        const canFinish=si>0||hasData;
        const prData=this.getSetPR(ex.name,si);
        const prevSet=this.getPrevSetData(wo.dayId,ex.name,si);
        const prevHtml=prevSet?`<div class="prev-set-hint"><span class="prev-set-label">LAST TIME</span><span class="prev-set-val">${prevSet.weight} kg × ${prevSet.reps}</span></div>`:'';
        const prHtml=`<div class="pr-ref-card" id="prBanner">
            <div class="pr-ref-left"><span class="pr-ref-label">SET ${si+1} BEST</span>
            <div class="pr-ref-values">
                <div class="pr-ref-box" id="prBannerVal">${prData?prData.weight:'—'}</div>
                <span class="pr-ref-x">×</span>
                <div class="pr-ref-box" id="prBannerReps">${prData?prData.reps:'—'}</div>
            </div></div>
            <span class="pr-ref-right" id="prBannerRight">${prData?'prev best':'first time'}</span>
        </div>`;
        const setHtml=`<div class="set-glass-card" id="activeSetCard">
            <div class="set-glass-top">
                <span class="set-glass-num">SET ${si+1}</span>
                <div style="display:flex;align-items:center;gap:10px">
                    ${prevHtml}
                    ${si>0?`<span class="set-glass-done">${si} done</span>`:''}
                </div>
            </div>
            <div class="set-glass-inputs">
                <div class="set-glass-field">
                    <input type="number" class="set-glass-input" id="setWeight" placeholder="0" value="${set.weight}" inputmode="decimal" autocomplete="off">
                    <span class="set-glass-unit">kg</span>
                </div>
                <div class="set-glass-divider"></div>
                <div class="set-glass-field">
                    <input type="number" class="set-glass-input" id="setReps" placeholder="0" value="${set.reps}" inputmode="numeric" autocomplete="off">
                    <span class="set-glass-unit">reps</span>
                </div>
            </div>
        </div>`;
        c.innerHTML=`<div class="ex-active-card"><div class="ex-top-bar"></div>
            <div class="ex-progress-section"><div class="ex-progress-bar"><div class="ex-progress-fill" style="width:${(num/total)*100}%"></div></div><div class="ex-counter">EXERCISE ${num} OF ${total}</div></div>
            <div class="ex-body">
                <div class="ex-title-section"><h3 class="ex-title">${ex.name}</h3><span class="ex-muscle">${ex.muscle}</span><span class="ex-rec">${ex.rec}</span></div>
                ${prHtml}${setHtml}
                <div class="ex-actions">
                    <button class="action-btn btn-add" id="addSetBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Next Set</button>
                    ${canFinish?`<button class="action-btn btn-finish-ex" id="finishExBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>Finish Exercise</button>`:''}
                    ${!canFinish?`<button class="action-btn btn-skip-ex" id="skipBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>Skip Exercise</button>`:''}
                </div>
            </div></div>`;
        const syncCurrent=()=>{
            const w=document.getElementById('setWeight');const r=document.getElementById('setReps');
            if(w)ex.sets[si].weight=w.value;if(r)ex.sets[si].reps=r.value;
        };
        ['setWeight','setReps'].forEach(id=>{
            const el=document.getElementById(id);if(!el)return;
            el.addEventListener('input',()=>{syncCurrent();this.updateLive();this.updatePRBannerForSet(ex,si);});
            el.addEventListener('focus',()=>el.select());
        });
        document.getElementById('addSetBtn').addEventListener('click',()=>{
            syncCurrent();
            const card=document.getElementById('activeSetCard');
            if(card){card.style.transition='opacity .25s ease,transform .25s ease';card.style.opacity='0';card.style.transform='translateX(-40px)';}
            setTimeout(()=>{ex.currentSetIndex=si+1;if(!ex.sets[si+1])ex.sets[si+1]={weight:'',reps:''};this.updateLive();this.renderEx();this.sound.play('add');this.vib(10);},260);
        });
        const fb=document.getElementById('finishExBtn');
        if(fb)fb.addEventListener('click',()=>{
            syncCurrent();ex.completed=true;
            ex.sets.forEach((s,i)=>{const w=parseFloat(s.weight),r=parseFloat(s.reps);if(w>0&&r>0)this.saveSetPR(ex.name,i,w,r);});
            this.exIndex++;this.updateHeader();this.updateLive();
            this.sound.play('finish');this.vib(25);this.startRestTimer();
            const card=document.getElementById('activeSetCard');
            if(card){card.style.transition='opacity .25s ease,transform .25s ease';card.style.opacity='0';card.style.transform='translateY(-20px)';}
            setTimeout(()=>this.renderEx(),260);
        });
        const skipEl=document.getElementById('skipBtn');
        if(skipEl)skipEl.addEventListener('click',()=>{
            syncCurrent();ex.skipped=true;ex.completed=true;
            this.exIndex++;this.updateHeader();this.updateLive();
            this.sound.play('skip');this.vib(15);setTimeout(()=>this.renderEx(),260);
        });
        const newCard=document.getElementById('activeSetCard');
        if(newCard){
            newCard.style.opacity='0';newCard.style.transform='translateX(40px)';
            requestAnimationFrame(()=>{newCard.style.transition='opacity .3s ease,transform .3s ease';newCard.style.opacity='1';newCard.style.transform='translateX(0)';});
        }
        this.updatePRBannerForSet(ex,si);
    }

    updatePRBannerForSet(ex,si){
        const banner=document.getElementById('prBanner');if(!banner)return;
        const valEl=document.getElementById('prBannerVal');const repsEl=document.getElementById('prBannerReps');const rightEl=document.getElementById('prBannerRight');
        if(!valEl||!repsEl)return;
        const cur=ex.sets[si]||{};const curW=parseFloat(cur.weight)||0;const curR=parseFloat(cur.reps)||0;
        const prev=this.getSetPR(ex.name,si);
        if(!prev){valEl.textContent=curW||'—';repsEl.textContent=curR||'—';rightEl.textContent='first time';banner.classList.remove('pr-new');return;}
        const isNew=curW>0&&curR>0&&(curW>prev.weight||(curW===prev.weight&&curR>prev.reps));
        if(isNew){valEl.textContent=curW;repsEl.textContent=curR;rightEl.textContent='🏆 NEW PR!';banner.classList.add('pr-new');}
        else{valEl.textContent=prev.weight;repsEl.textContent=prev.reps;rightEl.textContent='prev best';banner.classList.remove('pr-new');}
    }

    updateLive(){
        if(!this.workout)return;let vol=0,sets=0;
        this.workout.exercises.forEach(ex=>{ex.sets.forEach(s=>{const w=parseFloat(s.weight),r=parseFloat(s.reps);if(w>0&&r>0){vol+=w*r;sets++;}});});
        const volEl=document.getElementById('liveVol'),old=volEl.textContent;
        volEl.textContent=Math.round(vol).toLocaleString();
        document.getElementById('liveSets').textContent=sets;
        document.getElementById('liveEx').textContent=this.workout.exercises.filter(e=>e.completed&&!e.skipped).length;
        if(volEl.textContent!==old){volEl.classList.remove('bump');void volEl.offsetWidth;volEl.classList.add('bump');}
        this.workout.totalVolume=vol;this.workout.totalSets=sets;
    }

    // ─── PR System ───
    getSetPR(exName,setIndex){return this.prRecords[exName+'__set'+setIndex]||null;}
    saveSetPR(exName,setIndex,weight,reps){
        const key=exName+'__set'+setIndex;const prev=this.prRecords[key];
        if(!prev||weight>prev.weight||(weight===prev.weight&&reps>prev.reps)){
            this.prRecords[key]={weight,reps,date:new Date().toISOString()};
            localStorage.setItem('ip_prs',JSON.stringify(this.prRecords));
        }
    }

    // ─── Rest Timer ───
    setupRest(){
        document.getElementById('restSkip').addEventListener('click',()=>{this.stopRest();this.sound.play('tap');});
        document.getElementById('restAdd30').addEventListener('click',()=>{this.restRem+=30;this.sound.play('add');this.vib(10);});
    }
    startRestTimer(){
        this.restRem=this.restDur;const total=this.restDur;
        document.getElementById('restOverlay').classList.remove('hidden');
        this.updateRestUI(total);this.sound.play('rest');
        if(this.restInt)clearInterval(this.restInt);
        this.restInt=setInterval(()=>{this.restRem--;this.updateRestUI(total);if(this.restRem<=0){this.stopRest();this.sound.play('finish');this.vib(50);}},1000);
    }
    updateRestUI(total){
        document.getElementById('restTime').textContent=Math.floor(this.restRem/60)+':'+(this.restRem%60).toString().padStart(2,'0');
        const circ=2*Math.PI*90;
        document.getElementById('restRingFill').style.strokeDasharray=circ;
        document.getElementById('restRingFill').style.strokeDashoffset=circ-(this.restRem/total)*circ;
    }
    stopRest(){if(this.restInt)clearInterval(this.restInt);document.getElementById('restOverlay').classList.add('hidden');}

    // ─── Finish Workout ───
    setupComplete(){
        document.getElementById('compClose').addEventListener('click',()=>{document.getElementById('completeOverlay').classList.add('hidden');this.sound.play('tap');});
        document.getElementById('woFinish').addEventListener('click',()=>{if(!this.workout)return;this.showConfirm();});
        document.getElementById('confirmCancel').addEventListener('click',()=>{document.getElementById('confirmOverlay').classList.add('hidden');this.sound.play('tap');});
        document.getElementById('confirmOk').addEventListener('click',()=>{document.getElementById('confirmOverlay').classList.add('hidden');this.finishWorkout();});
    }
    showConfirm(){document.getElementById('confirmOverlay').classList.remove('hidden');this.sound.play('tap');this.vib(10);}

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

    // ─── BODY WEIGHT PAGE ───
    setupWeight(){
        this.wheel=new WheelPicker(this.sound,this.vib.bind(this));
        document.getElementById('bwWeightTap').addEventListener('click',()=>{
            const unit=localStorage.getItem('ip_bw_unit')||'kg';
            const logs=JSON.parse(localStorage.getItem('ip_bw')||'[]');
            let current=null;
            if(logs.length>0){
                const kg=logs[logs.length-1].weight;
                current=unit==='lbs'?parseFloat((kg*2.20462).toFixed(1)):kg;
            }
            this.wheel.openWeight(unit,current,(val,u)=>{
                const kg=u==='lbs'?parseFloat((val/2.20462).toFixed(2)):val;
                localStorage.setItem('ip_bw_unit',u);
                const allLogs=JSON.parse(localStorage.getItem('ip_bw')||'[]');
                allLogs.push({weight:kg,date:new Date().toISOString()});
                localStorage.setItem('ip_bw',JSON.stringify(allLogs));
                this.renderWeight();this.vib(25);
            });
        });
        document.getElementById('bwHeightTap').addEventListener('click',()=>{
            const unit=localStorage.getItem('ip_height_unit')||'cm';
            let current=null;
            const saved=localStorage.getItem('ip_height');
            if(saved){
                const cm=parseFloat(saved);
                current=unit==='ft'?{ft:Math.floor(cm/2.54/12),inch:Math.round((cm/2.54)%12)}:cm;
            }
            this.wheel.openHeight(unit,current,(val,u)=>{
                const cm=u==='ft'?parseFloat(((val.ft*12+val.inch)*2.54).toFixed(1)):val;
                localStorage.setItem('ip_height',cm);
                localStorage.setItem('ip_height_unit',u);
                this.renderWeight();this.vib(20);
            });
        });
    }

    renderWeight(){
        const logs=JSON.parse(localStorage.getItem('ip_bw')||'[]');
        const height=parseFloat(localStorage.getItem('ip_height')||'0');
        const bwUnit=localStorage.getItem('ip_bw_unit')||'kg';
        const htUnit=localStorage.getItem('ip_height_unit')||'cm';

        // ── Update tap buttons ──
        const wDisp=document.getElementById('bwWeightDisplay');
        const wUnit=document.getElementById('bwWeightUnit');
        const hDisp=document.getElementById('bwHeightDisplay');
        const hUnit=document.getElementById('bwHeightUnit');
        if(wUnit)wUnit.textContent=bwUnit;
        if(htUnit==='ft'&&hUnit)hUnit.textContent='ft / in';
        else if(hUnit)hUnit.textContent='cm';

        if(logs.length>0){
            const kg=logs[logs.length-1].weight;
            const displayW=bwUnit==='lbs'?parseFloat((kg*2.20462).toFixed(1)):kg;
            if(wDisp)wDisp.textContent=displayW;
        } else {if(wDisp)wDisp.textContent='—';}

        if(height>0){
            let hDisplay;
            if(htUnit==='ft'){
                const totalIn=height/2.54;
                hDisplay=Math.floor(totalIn/12)+"' "+Math.round(totalIn%12)+'"';
            } else {hDisplay=height+' cm';}
            if(hDisp)hDisp.textContent=height>0?hDisplay:'—';
        } else {if(hDisp)hDisp.textContent='—';}

        // ── Hero stats ──
        if(logs.length>0){
            const latest=logs[logs.length-1];
            const first=logs[0];
            const totalDiffKg=parseFloat((latest.weight-first.weight).toFixed(1));
            const sign=totalDiffKg>0?'+':'';
            const diffColor=totalDiffKg<0?'var(--green)':totalDiffKg>0?'var(--red)':'var(--text3)';
            const displayW=bwUnit==='lbs'?parseFloat((latest.weight*2.20462).toFixed(1)):latest.weight;
            document.getElementById('bwCurrentVal').textContent=displayW+(bwUnit==='lbs'?' lbs':' kg');
            const changeEl=document.getElementById('bwChangeVal');
            const diffDisplay=bwUnit==='lbs'?parseFloat((totalDiffKg*2.20462).toFixed(1)):totalDiffKg;
            changeEl.textContent=(diffDisplay>0?'+':'')+diffDisplay+(bwUnit==='lbs'?' lbs':' kg');
            changeEl.style.color=diffColor;
        } else {
            document.getElementById('bwCurrentVal').textContent='—';
            document.getElementById('bwChangeVal').textContent='—';
        }

        // Log streak
        const streak=this.calcLogStreak(logs);
        document.getElementById('bwStreakVal').textContent=streak;

        // ── BMI ──
        const bmiCard=document.getElementById('bwBmiCard');
        if(height>0&&logs.length>0){
            bmiCard.style.display='block';
            const w=logs[logs.length-1].weight;
            const h=height/100;
            const bmi=parseFloat((w/(h*h)).toFixed(1));
            let cat,col,desc;
            if(bmi<18.5){cat='Underweight';col='#00d4ff';desc='Below healthy range. Focus on caloric surplus.';}
            else if(bmi<25){cat='Normal Weight';col='#00ff88';desc='Healthy BMI range. Keep it up.';}
            else if(bmi<30){cat='Overweight';col='#ffaa00';desc='Slightly above range. Gradual deficit helps.';}
            else{cat='Obese';col='#ff4466';desc='Above healthy range. Consult a professional.';}
            document.getElementById('bwBmiVal').textContent=bmi;
            document.getElementById('bwBmiVal').style.color=col;
            document.getElementById('bwBmiCat').textContent=cat;
            document.getElementById('bwBmiCat').style.color=col;
            document.getElementById('bwBmiDesc').textContent=desc;
            const circle=document.getElementById('bwBmiCircle');
            circle.style.background=`radial-gradient(circle,${col}18,transparent)`;
            circle.style.border=`2px solid ${col}40`;
        } else {
            bmiCard.style.display='none';
        }

        // ── Rate of Change ──
        const rateVal=document.getElementById('bwRateVal');
        const rateSub=document.getElementById('bwRateSub');
        const rateBadge=document.getElementById('bwRateBadge');
        if(logs.length>=2){
            // Use last 2 weeks of data for rate
            const recent=logs.slice(-14);
            const first=recent[0];const last=recent[recent.length-1];
            const days=(new Date(last.date)-new Date(first.date))/(1000*86400)||1;
            const kgPerWeek=((last.weight-first.weight)/days)*7;
            const sign=kgPerWeek>0?'+':'';
            rateVal.textContent=sign+kgPerWeek.toFixed(2)+' kg/week';
            if(kgPerWeek<-0.1){
                rateVal.style.color='var(--green)';
                rateBadge.textContent='Cutting';rateBadge.className='bw-rate-badge cutting';
                rateSub.textContent='You are in a deficit. Good cutting pace.';
            } else if(kgPerWeek>0.1){
                rateVal.style.color='var(--amber)';
                rateBadge.textContent='Bulking';rateBadge.className='bw-rate-badge bulking';
                rateSub.textContent='You are gaining weight. Lean bulk in progress.';
            } else {
                rateVal.style.color='var(--cyan)';
                rateBadge.textContent='Stable';rateBadge.className='bw-rate-badge stable';
                rateSub.textContent='Weight is stable. Maintenance phase.';
            }
        } else {
            rateVal.textContent='—';rateVal.style.color='var(--text4)';
            rateBadge.textContent='No data';rateBadge.className='bw-rate-badge nodata';
            rateSub.textContent='Log more entries to see weekly change rate';
        }

        // ── Chart ──
        this.drawWeightChart(logs);

        // ── History ──
        const histEl=document.getElementById('bwHistoryList');
        if(logs.length===0){histEl.innerHTML='<p style="text-align:center;color:var(--text4);padding:16px 0">No weight logged yet</p>';return;}
        const reversed=logs.slice().reverse().slice(0,30);
        histEl.innerHTML=reversed.map((l,i)=>{
            const prevEntry=reversed[i+1];
            const diff=prevEntry?parseFloat((l.weight-prevEntry.weight).toFixed(1)):null;
            const cls=diff===null?'same':diff>0?'up':diff<0?'down':'same';
            const sign=diff>0?'+':'';
            const d=new Date(l.date);
            const ds=d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
            return `<div class="bw-history-row" style="animation:popIn .25s ease ${i*.03}s both">
                <span class="bw-history-date">${ds}</span>
                <div class="bw-history-right">
                    ${diff!==null?`<span class="bw-history-diff ${cls}">${sign}${diff}</span>`:''}
                    <span class="bw-history-weight">${l.weight} kg</span>
                </div>
            </div>`;
        }).join('');
    }

    calcLogStreak(logs){
        if(!logs.length)return 0;
        const dates=[...new Set(logs.map(l=>new Date(l.date).toDateString()))].sort((a,b)=>new Date(b)-new Date(a));
        let streak=1;
        for(let i=0;i<dates.length-1;i++){
            if((new Date(dates[i])-new Date(dates[i+1]))/86400000<=1.5)streak++;
            else break;
        }
        return streak;
    }

    drawWeightChart(logs){
        const canvas=document.getElementById('bwChart');if(!canvas)return;
        const rect=canvas.getBoundingClientRect();
        if(!rect.width||!rect.height)return;
        const ctx=canvas.getContext('2d');const dpr=window.devicePixelRatio||1;
        canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;
        ctx.scale(dpr,dpr);const w=rect.width,h=rect.height;
        const pad={t:24,r:16,b:32,l:48};const cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;
        if(logs.length<2){
            ctx.fillStyle='rgba(255,255,255,0.25)';ctx.font='13px Space Grotesk';
            ctx.textAlign='center';ctx.fillText('Log more weights to see trend',w/2,h/2);return;
        }
        const data=logs.slice(-20).map(l=>l.weight);
        const labels=logs.slice(-20).map(l=>{const d=new Date(l.date);return(d.getMonth()+1)+'/'+d.getDate();});
        const rawMax=Math.max(...data),rawMin=Math.min(...data);
        const padding=(rawMax-rawMin)*0.15||0.5;
        const mx=rawMax+padding,mn=rawMin-padding,range=mx-mn;

        // Update min/max display
        const maxEl=document.getElementById('bwChartMax');const minEl=document.getElementById('bwChartMin');
        if(maxEl)maxEl.textContent='Max '+rawMax+' kg';
        if(minEl)minEl.textContent='Min '+rawMin+' kg';

        const xS=(i)=>pad.l+(i/(data.length-1||1))*cw;
        const yS=(v)=>pad.t+ch-((v-mn)/range)*ch;

        // Grid lines
        ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
        for(let i=0;i<=4;i++){
            const y=pad.t+(i/4)*ch;
            ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();
            ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='10px JetBrains Mono';ctx.textAlign='right';
            ctx.fillText((mx-(i/4)*range).toFixed(1),pad.l-6,y+4);
        }

        // Date labels
        ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='10px JetBrains Mono';ctx.textAlign='center';
        const step=Math.max(1,Math.ceil(data.length/5));
        labels.forEach((l,i)=>{if(i%step===0||i===data.length-1)ctx.fillText(l,xS(i),h-8);});

        // Min/Max range band
        ctx.beginPath();
        ctx.moveTo(xS(0),yS(rawMax));
        for(let i=1;i<data.length;i++)ctx.lineTo(xS(i),yS(rawMax));
        for(let i=data.length-1;i>=0;i--)ctx.lineTo(xS(i),yS(rawMin));
        ctx.closePath();
        ctx.fillStyle='rgba(0,255,136,0.04)';ctx.fill();

        // Fill gradient under curve
        const grad=ctx.createLinearGradient(0,pad.t,0,h-pad.b);
        grad.addColorStop(0,'rgba(0,255,136,0.25)');grad.addColorStop(1,'rgba(0,255,136,0.0)');
        ctx.beginPath();ctx.moveTo(xS(0),h-pad.b);
        for(let i=0;i<data.length;i++)ctx.lineTo(xS(i),yS(data[i]));
        ctx.lineTo(xS(data.length-1),h-pad.b);ctx.closePath();ctx.fillStyle=grad;ctx.fill();

        // Smooth curve using bezier
        ctx.beginPath();ctx.strokeStyle='#00ff88';ctx.lineWidth=2.5;ctx.lineCap='round';ctx.lineJoin='round';
        ctx.shadowColor='rgba(0,255,136,0.4)';ctx.shadowBlur=8;
        for(let i=0;i<data.length;i++){
            if(i===0){ctx.moveTo(xS(0),yS(data[0]));}
            else{
                const cpx=(xS(i-1)+xS(i))/2;
                ctx.bezierCurveTo(cpx,yS(data[i-1]),cpx,yS(data[i]),xS(i),yS(data[i]));
            }
        }
        ctx.stroke();ctx.shadowBlur=0;

        // Smooth dots with no flicker
        for(let i=0;i<data.length;i++){
            const x=xS(i),y=yS(data[i]);
            ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);
            ctx.fillStyle='rgba(0,255,136,0.15)';ctx.fill();
            ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);
            ctx.fillStyle='#00ff88';ctx.fill();
        }
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
        if(sorted.length===0){grid.innerHTML='<p style="text-align:center;color:var(--text4);padding:20px">Complete workouts to see muscle breakdown</p>';return;}
        grid.innerHTML=sorted.map((m,i)=>`
            <div class="muscle-row" style="animation:popIn .3s ease ${i*.05}s both">
                <div class="muscle-info"><span class="muscle-name">${m[0]}</span><span class="muscle-sets">${m[1]} sets</span></div>
                <div class="muscle-bar"><div class="muscle-bar-fill ${colors[i%4]}" style="width:${(m[1]/max)*100}%"></div></div>
            </div>`).join('');
    }

    // ─── History ───
    loadHistory(){
        const all=JSON.parse(localStorage.getItem('ironpump_workouts')||'[]');
        const list=document.getElementById('historyList');
        if(all.length===0){list.innerHTML='<div class="no-history"><p>No workouts yet</p><p>Complete your first session!</p></div>';return;}
        list.innerHTML=all.slice().reverse().map((wo,i)=>{
            const d=new Date(wo.startTime);
            const ds=d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
            const exDetails=wo.exercises?wo.exercises.filter(e=>e.completed&&!e.skipped).map(ex=>{
                const sets=ex.sets?ex.sets.filter(s=>parseFloat(s.weight)>0&&parseFloat(s.reps)>0):[];
                if(sets.length===0)return '';
                return `<div class="hist-ex-row"><span class="hist-ex-name">${ex.name}</span><span class="hist-ex-sets">${sets.map(s=>`${s.weight}kg×${s.reps}`).join(' · ')}</span></div>`;
            }).join(''):'';
            const vol=Math.round(wo.totalVolume||0).toLocaleString();
            const sets=wo.totalSets||0;const dur=wo.duration||0;
            return `<div class="history-card" style="animation:popIn .3s ease ${i*.06}s both">
                <div class="history-top" onclick="this.closest('.history-card').classList.toggle('expanded');app.vib(8)">
                    <div><span class="history-split">${wo.splitName||wo.dayName}</span><span class="history-date">${ds}</span></div>
                    <svg class="hist-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div class="history-stats">
                    <div class="hist-stat-pill"><span class="hist-stat-icon">⚡</span><span>${vol} kg</span></div>
                    <div class="hist-stat-pill"><span class="hist-stat-icon">📦</span><span>${sets} sets</span></div>
                    <div class="hist-stat-pill"><span class="hist-stat-icon">⏱</span><span>${dur}m</span></div>
                </div>
                <div class="hist-details">${exDetails||'<span style="font-size:.78rem;color:var(--text4)">No exercise data</span>'}</div>
            </div>`;
        }).join('');
    }

    // ─── Intelligence ───
    getMonSunWeek(){
        const now=new Date(),day=now.getDay(),monday=new Date(now);
        monday.setDate(now.getDate()-(day===0?6:day-1));monday.setHours(0,0,0,0);
        const lastMonday=new Date(monday);lastMonday.setDate(monday.getDate()-7);
        return{thisWeekStart:monday.getTime(),lastWeekStart:lastMonday.getTime(),lastWeekEnd:monday.getTime()};
    }

    updateIntel(){
        const all=JSON.parse(localStorage.getItem('ironpump_workouts')||'[]');
        const now=Date.now();
        const {thisWeekStart,lastWeekStart,lastWeekEnd}=this.getMonSunWeek();
        const monthAgo=now-30*86400000;
        let weekVol=0,lastWeekVol=0,monthSessions=0,totalEx=0,bestSessionVol=0,bestSessionDate='';
        all.forEach(wo=>{
            const t=new Date(wo.startTime).getTime(),vol=wo.totalVolume||0;
            if(t>=thisWeekStart)weekVol+=vol;
            if(t>=lastWeekStart&&t<lastWeekEnd)lastWeekVol+=vol;
            if(t>monthAgo)monthSessions++;
            totalEx+=(wo.exercises||[]).filter(e=>e.completed&&!e.skipped).length;
            if(vol>bestSessionVol){bestSessionVol=vol;bestSessionDate=wo.startTime;}
        });
        const streak=this.getStreak(all);
        let perf=0;
        if(all.length>0){const volRatio=weekVol/(lastWeekVol||weekVol||1);perf=Math.min(100,Math.round(volRatio*65+streak*3+(monthSessions>8?15:monthSessions>4?8:0)));}
        const weeksTracked=Math.max(1,Math.ceil((now-new Date(all[0]?.startTime||now).getTime())/(7*86400000)));
        const avgPerWeek=all.length/weeksTracked;
        const cons=Math.min(100,Math.round((avgPerWeek/5)*100));
        const last3Days=all.filter(wo=>new Date(wo.startTime).getTime()>now-3*86400000).length;
        const rec=last3Days>=3?25:last3Days===2?50:last3Days===1?80:100;
        const last7Load=all.filter(wo=>new Date(wo.startTime).getTime()>now-7*86400000).reduce((a,wo)=>a+(wo.totalSets||0),0);
        const last28Load=all.filter(wo=>new Date(wo.startTime).getTime()>now-28*86400000).reduce((a,wo)=>a+(wo.totalSets||0),0);
        const avgWeekLoad=last28Load/4;
        let fitnessStatus='Balanced',fitnessColor='var(--cyan)';
        if(last7Load>avgWeekLoad*1.3){fitnessStatus='High Load';fitnessColor='var(--amber)';}
        else if(last7Load<avgWeekLoad*0.5&&avgWeekLoad>0){fitnessStatus='Deload Zone';fitnessColor='var(--green)';}
        else if(avgWeekLoad===0){fitnessStatus='Start Training';fitnessColor='var(--text3)';}
        this.animateVal('intel-vol',weekVol);this.animateVal('intel-sessions',monthSessions);
        this.animateVal('intel-excount',totalEx);this.animateVal('intel-streak',streak);
        this.animateRing('perfRing',perf,'perfNum');this.animateRing('consRing',cons,'consNum');this.animateRing('recRing',rec,'recNum');
        const vt=document.getElementById('volTrend');
        if(vt){const d=weekVol-lastWeekVol;vt.textContent=all.length===0?'No data':d>0?'+'+Math.round(d).toLocaleString()+' kg':d<0?Math.round(d).toLocaleString()+' kg':'Stable';}
        const st=document.getElementById('sesTrend');
        if(st)st.textContent=all.length===0?'No data':avgPerWeek.toFixed(1)+'/week';
        const bsEl=document.getElementById('bestSession');
        if(bsEl){if(bestSessionVol>0){const d=new Date(bestSessionDate);bsEl.innerHTML=`<span class="intel-extra-val">${Math.round(bestSessionVol).toLocaleString()} kg</span><span class="intel-extra-sub">on ${d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>`;}else{bsEl.innerHTML='<span class="intel-extra-val">—</span>';}}
        const fatEl=document.getElementById('fatigueStatus');
        if(fatEl)fatEl.innerHTML=`<span class="intel-extra-val" style="color:${fitnessColor}">${fitnessStatus}</span><span class="intel-extra-sub">vs 4-week avg</span>`;
        this.renderMuscleVolume();
    }

    animateRing(ringId,val,numId){
        const el=document.getElementById(ringId);if(!el)return;
        const ring=el.querySelector('.cprog-ring'),numEl=document.getElementById(numId);
        const circ=2*Math.PI*40,offset=circ-(val/100)*circ;
        ring.style.strokeDasharray=circ;ring.style.strokeDashoffset=circ;el.dataset.val=val;
        setTimeout(()=>{ring.style.strokeDashoffset=offset;
            const start=performance.now();
            const tick=(now)=>{const p=Math.min((now-start)/1500,1);numEl.textContent=Math.round(val*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick);};
            requestAnimationFrame(tick);},300);
    }

    animateVal(id,target){
        const el=document.getElementById(id);if(!el)return;
        const start=performance.now();
        const tick=(now)=>{const p=Math.min((now-start)/1200,1);el.textContent=Math.round(target*(1-Math.pow(1-p,3))).toLocaleString();if(p<1)requestAnimationFrame(tick);};
        setTimeout(()=>requestAnimationFrame(tick),400);
    }

    getStreak(all){
        if(all.length===0)return 0;
        const dates=[...new Set(all.map(w=>new Date(w.startTime).toDateString()))].sort((a,b)=>new Date(b)-new Date(a));
        let streak=1;for(let i=0;i<dates.length-1;i++){if((new Date(dates[i])-new Date(dates[i+1]))/86400000<=1.5)streak++;else break;}
        return streak;
    }

    // ─── Volume Chart ───
    drawChart(){
        const canvas=document.getElementById('volChart');if(!canvas)return;
        const rect=canvas.getBoundingClientRect();
        if(!rect.width||!rect.height)return;
        const ctx=canvas.getContext('2d');const dpr=window.devicePixelRatio||1;
        canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;
        ctx.scale(dpr,dpr);const w=rect.width,h=rect.height;
        const pad={t:20,r:15,b:30,l:45};const cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;
        const wd=this.getChartData();
        if(wd.values.length<2){ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='13px Space Grotesk';ctx.textAlign='center';ctx.fillText('Complete workouts to see trends',w/2,h/2);return;}
        const data=wd.values,labels=wd.labels;const mx=Math.max(...data)*1.15||100;
        const xS=(i)=>pad.l+(i/(data.length-1))*cw;const yS=(v)=>pad.t+ch-(v/mx)*ch;
        const draw=(progress)=>{
            ctx.clearRect(0,0,w,h);ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;
            for(let i=0;i<=4;i++){const y=pad.t+(i/4)*ch;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();
                ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='10px JetBrains Mono';ctx.textAlign='right';ctx.fillText(Math.round(mx-(i/4)*mx).toLocaleString(),pad.l-8,y+4);}
            ctx.textAlign='center';labels.forEach((l,i)=>{ctx.fillText(l,xS(i),h-8);});
            const len=Math.floor(data.length*progress);if(len<1)return;
            const grad=ctx.createLinearGradient(0,pad.t,0,h-pad.b);grad.addColorStop(0,'rgba(0,212,255,0.3)');grad.addColorStop(1,'rgba(0,212,255,0)');
            ctx.beginPath();ctx.moveTo(xS(0),h-pad.b);for(let i=0;i<=Math.min(len,data.length-1);i++)ctx.lineTo(xS(i),yS(data[i]));
            ctx.lineTo(xS(Math.min(len,data.length-1)),h-pad.b);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
            ctx.beginPath();ctx.strokeStyle='#00d4ff';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';
            for(let i=0;i<=Math.min(len,data.length-1);i++){if(i===0)ctx.moveTo(xS(i),yS(data[i]));else ctx.lineTo(xS(i),yS(data[i]));}ctx.stroke();
            for(let i=0;i<=Math.min(len,data.length-1);i++){const x=xS(i),y=yS(data[i]);
                ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle='rgba(0,212,255,0.2)';ctx.fill();
                ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle='#00d4ff';ctx.fill();}
        };
        const st=performance.now();const anim=(now)=>{draw(1-Math.pow(1-Math.min((now-st)/1500,1),3));if((now-st)<1500)requestAnimationFrame(anim);};requestAnimationFrame(anim);
    }

    getChartData(){
        const all=JSON.parse(localStorage.getItem('ironpump_workouts')||'[]');const weeks={};
        all.forEach(wo=>{
            const d=new Date(wo.startTime),monday=new Date(d),day=d.getDay();
            monday.setDate(d.getDate()-(day===0?6:day-1));
            const key=monday.toLocaleDateString('en-US',{month:'short',day:'numeric'});
            weeks[key]=(weeks[key]||0)+(wo.totalVolume||0);
        });
        return{labels:Object.keys(weeks),values:Object.values(weeks).map(v=>Math.round(v))};
    }

    // ─── Settings ───
    setupSettings(){
        document.querySelectorAll('.theme-btn').forEach(btn=>{
            btn.addEventListener('click',()=>{
                document.querySelectorAll('.theme-btn').forEach(b=>b.classList.remove('active'));
                btn.classList.add('active');this.applyTheme(btn.dataset.theme);
                localStorage.setItem('ip_theme',btn.dataset.theme);this.sound.play('tap');this.vib(10);
            });
        });
        document.getElementById('exportBtn').addEventListener('click',()=>{this.exportData();this.sound.play('finish');});
        document.getElementById('importBtn').addEventListener('click',()=>{document.getElementById('importFile').click();});
        document.getElementById('importFile').addEventListener('change',(e)=>{this.importData(e);this.sound.play('complete');});
        const restOpts=document.getElementById('restOptions');
        [60,90,120,150,180].forEach(sec=>{
            const btn=document.createElement('button');
            btn.className='action-btn btn-add';btn.style.cssText='flex:1;min-width:60px;padding:10px';
            btn.textContent=sec>=60?(sec/60)+'m':sec+'s';
            if(sec===this.restDur){btn.style.borderColor='var(--cyan)';btn.style.color='var(--cyan)';}
            btn.addEventListener('click',()=>{
                this.restDur=sec;localStorage.setItem('ip_rest_dur',sec);
                restOpts.querySelectorAll('button').forEach(b=>{b.style.borderColor='';b.style.color='';});
                btn.style.borderColor='var(--cyan)';btn.style.color='var(--cyan)';
                this.sound.play('tap');this.vib(10);
            });
            restOpts.appendChild(btn);
        });
    }

    loadTheme(){const t=localStorage.getItem('ip_theme')||'cyan';this.applyTheme(t);
        setTimeout(()=>{const btn=document.querySelector(`[data-theme="${t}"]`);if(btn){document.querySelectorAll('.theme-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');}},100);}

    applyTheme(name){
        const t=THEMES[name]||THEMES.cyan;const r=document.documentElement;
        r.style.setProperty('--cyan',t.accent);r.style.setProperty('--blue',t.dark);r.style.setProperty('--gcyan',t.grad);
    }

    exportData(){
        const data={workouts:JSON.parse(localStorage.getItem('ironpump_workouts')||'[]'),
            bodyweight:JSON.parse(localStorage.getItem('ip_bw')||'[]'),
            prs:JSON.parse(localStorage.getItem('ip_prs')||'{}'),
            height:localStorage.getItem('ip_height')||'',
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
                if(data.height)localStorage.setItem('ip_height',data.height);
                if(data.theme){localStorage.setItem('ip_theme',data.theme);this.applyTheme(data.theme);}
                if(data.restDur){localStorage.setItem('ip_rest_dur',data.restDur);this.restDur=parseInt(data.restDur);}
                alert('Data imported successfully!');this.loadHistory();this.updateIntel();
            }catch(err){alert('Invalid backup file!');}
        };
        reader.readAsText(file);e.target.value='';
    }

    vib(ms){if('vibrate' in navigator)navigator.vibrate(ms);}
}

const app=new IronPump();

// ═══════════════════════════════════════════════════════════
// WHEEL PICKER — iOS-style velocity-responsive scroll picker
// ═══════════════════════════════════════════════════════════
class WheelPicker {
    constructor(sound, vib){
        this.sound=sound;this.vib=vib;
        this.ctx=null;this.onConfirm=null;this.mode=null;
        this.cols=[];this.unit='kg';
        this._lastTickTime=0;this._lastTickIndex=-1;
        this._setupAudio();this._bindOverlay();
    }

    _setupAudio(){
        document.addEventListener('click',()=>{
            if(!this.ctx)this.ctx=new(window.AudioContext||window.webkitAudioContext)();
        },{once:true});
    }

    // Play velocity-responsive tick
    _tick(velocity=1){
        if(!this.ctx)return;
        const now=performance.now();
        // Throttle: minimum gap between ticks scales with velocity
        const minGap=Math.max(20,80-(velocity*40));
        if(now-this._lastTickTime<minGap)return;
        this._lastTickTime=now;
        const t=this.ctx.currentTime;
        const osc=this.ctx.createOscillator();
        const gain=this.ctx.createGain();
        const filter=this.ctx.createBiquadFilter();
        osc.connect(filter);filter.connect(gain);gain.connect(this.ctx.destination);
        filter.type='bandpass';filter.frequency.value=2800;filter.Q.value=3;
        // Velocity-responsive pitch and volume
        const speed=Math.min(velocity,3);
        const freq=1800+speed*400;
        const vol=0.04+speed*0.02;
        const dur=0.018+speed*0.004;
        osc.type='triangle';
        osc.frequency.setValueAtTime(freq,t);
        osc.frequency.exponentialRampToValueAtTime(freq*0.7,t+dur);
        gain.gain.setValueAtTime(0,t);
        gain.gain.linearRampToValueAtTime(vol,t+0.002);
        gain.gain.exponentialRampToValueAtTime(0.001,t+dur);
        osc.start(t);osc.stop(t+dur+0.005);
    }

    // Selection snap sound
    _snap(){
        if(!this.ctx)return;
        const t=this.ctx.currentTime;
        // Two-layer snap: click + soft tone
        [
            {f:3200,d:0.012,v:0.06,type:'square'},
            {f:880,d:0.08,v:0.04,type:'sine'}
        ].forEach(s=>{
            const osc=this.ctx.createOscillator();
            const gain=this.ctx.createGain();
            osc.connect(gain);gain.connect(this.ctx.destination);
            osc.type=s.type;osc.frequency.setValueAtTime(s.f,t);
            if(s.type==='sine')osc.frequency.exponentialRampToValueAtTime(s.f*0.6,t+s.d);
            gain.gain.setValueAtTime(s.v,t);
            gain.gain.exponentialRampToValueAtTime(0.001,t+s.d);
            osc.start(t);osc.stop(t+s.d+0.005);
        });
        this.vib(8);
    }

    _bindOverlay(){
        document.getElementById('wheelCancel').addEventListener('click',()=>this.close());
        document.getElementById('wheelConfirm').addEventListener('click',()=>this._confirm());
        document.getElementById('wheelOverlay').addEventListener('click',(e)=>{
            if(e.target===document.getElementById('wheelOverlay'))this.close();
        });
        // Unit toggle buttons
        document.getElementById('wheelUnit1').addEventListener('click',(e)=>this._switchUnit(e.target.dataset.unit));
        document.getElementById('wheelUnit2').addEventListener('click',(e)=>this._switchUnit(e.target.dataset.unit));
    }

    _switchUnit(unit){
        if(this.unit===unit)return;
        this.unit=unit;
        document.querySelectorAll('.wheel-unit-btn').forEach(b=>{
            b.classList.toggle('active',b.dataset.unit===unit);
        });
        this._rebuildCols();
        this._snap();
    }

    open(title,unitOpts,unit,cols,onConfirm){
        this.onConfirm=onConfirm;this.unit=unit;this.mode=title;
        document.getElementById('wheelTitle').textContent=title;
        // Setup unit toggle
        const u1=document.getElementById('wheelUnit1');
        const u2=document.getElementById('wheelUnit2');
        u1.textContent=unitOpts[0];u1.dataset.unit=unitOpts[0];
        u2.textContent=unitOpts[1];u2.dataset.unit=unitOpts[1];
        u1.classList.toggle('active',unit===unitOpts[0]);
        u2.classList.toggle('active',unit===unitOpts[1]);
        this._colDefs=cols;
        this._buildCols(cols);
        document.getElementById('wheelOverlay').classList.remove('hidden');
        this._updateDisplay();
    }

    openWeight(unit,currentVal,onConfirm){
        this._weightUnit=unit;this._heightUnit=null;
        const colDefs=this._getWeightCols(unit,currentVal);
        this.open('Body Weight',['kg','lbs'],unit,colDefs,onConfirm);
    }

    openHeight(unit,currentVal,onConfirm){
        this._heightUnit=unit;this._weightUnit=null;
        const colDefs=this._getHeightCols(unit,currentVal);
        this.open('Height',['cm','ft'],unit,colDefs,onConfirm);
    }

    _getWeightCols(unit,current){
        if(unit==='kg'){
            const wholes=[]; for(let i=20;i<=250;i++)wholes.push(i);
            const decimals=['0','1','2','3','4','5','6','7','8','9'];
            let wIdx=wholes.indexOf(current?Math.floor(current):70);if(wIdx<0)wIdx=50;
            let dIdx=current?Math.round((current%1)*10):0;
            return [
                {items:wholes,selected:wIdx,width:2},
                {items:['.',],selected:0,width:0,fixed:true},
                {items:decimals,selected:dIdx,width:1}
            ];
        } else {
            const wholes=[]; for(let i=44;i<=551;i++)wholes.push(i);
            let idx=wholes.indexOf(current?Math.round(current):154);if(idx<0)idx=110;
            return [{items:wholes,selected:idx,width:3}];
        }
    }

    _getHeightCols(unit,current){
        if(unit==='cm'){
            const vals=[]; for(let i=100;i<=250;i++)vals.push(i);
            let idx=vals.indexOf(current?Math.round(current):170);if(idx<0)idx=70;
            return [{items:vals,selected:idx,width:3}];
        } else {
            const feet=[4,5,6,7];
            const inches=[]; for(let i=0;i<=11;i++)inches.push(i);
            const ftIdx=current?feet.indexOf(current.ft):1;
            const inIdx=current?current.inch:0;
            return [
                {items:feet,selected:ftIdx<0?1:ftIdx,width:1,suffix:"'"},
                {items:inches,selected:inIdx,width:2,suffix:'"'}
            ];
        }
    }

    _buildCols(colDefs){
        const body=document.getElementById('wheelBody');
        body.innerHTML='';
        this.cols=[];
        colDefs.forEach((def,ci)=>{
            if(def.fixed){
                const sep=document.createElement('span');
                sep.className='wheel-sep';sep.textContent='.';
                body.appendChild(sep);return;
            }
            const wrap=document.createElement('div');
            wrap.className='wheel-col-wrap';
            const col=document.createElement('div');
            col.className='wheel-col';
            const items=document.createElement('div');
            items.className='wheel-items';
            // Pad top/bottom so selected item can reach center
            const pad=2;
            for(let p=0;p<pad;p++){
                const ph=document.createElement('div');ph.className='wheel-item';ph.style.opacity='0';
                items.appendChild(ph);
            }
            def.items.forEach((val,i)=>{
                const el=document.createElement('div');
                el.className='wheel-item'+(i===def.selected?' selected':'');
                el.textContent=(def.suffix?val+def.suffix:val);
                items.appendChild(el);
            });
            for(let p=0;p<pad;p++){
                const ph=document.createElement('div');ph.className='wheel-item';ph.style.opacity='0';
                items.appendChild(ph);
            }
            col.appendChild(items);wrap.appendChild(col);body.appendChild(wrap);
            const colState={el:col,items:def.items,selected:def.selected,def};
            this.cols.push(colState);
            this._initDrag(col,colState,ci);
            this._scrollToSelected(col,def.selected,false);
        });
    }

    _rebuildCols(){
        const newDefs=this._heightUnit===null
            ?this._getWeightCols(this.unit,this._getCurrentVal())
            :this._getHeightCols(this.unit,this._getCurrentVal());
        this._colDefs=newDefs;
        this._buildCols(newDefs);
        this._updateDisplay();
    }

    _getCurrentVal(){
        if(this._weightUnit!==null){
            if(this.unit==='kg'&&this.cols.length>=2){
                const w=this.cols[0].items[this.cols[0].selected];
                const d=this.cols[1]?this.cols[1].items[this.cols[1].selected]:0;
                return parseFloat(w+'.'+d);
            } else if(this.cols.length>0){
                return this.cols[0].items[this.cols[0].selected];
            }
        } else if(this._heightUnit!==null){
            if(this.unit==='cm'&&this.cols.length>0)return this.cols[0].items[this.cols[0].selected];
            if(this.unit==='ft'&&this.cols.length>=2)return{ft:this.cols[0].items[this.cols[0].selected],inch:this.cols[1].items[this.cols[1].selected]};
        }
        return null;
    }

    _initDrag(col,state,colIndex){
        const itemH=44;
        let startY=0,lastY=0,lastTime=0,velocity=0,rafId=null,isDragging=false;
        let momentum=0;

        const getY=e=>e.touches?e.touches[0].clientY:e.clientY;

        const snapToNearest=()=>{
            const items=col.querySelector('.wheel-items');
            const transform=new WebKitCSSMatrix(getComputedStyle(items).transform);
            const currentOffset=-transform.m42;
            const raw=Math.round(currentOffset/itemH);
            const idx=Math.max(0,Math.min(raw,state.items.length-1));
            if(idx!==state.selected){
                state.selected=idx;
                this._snap();
                this._updateSelected(col,idx);
                this._updateDisplay();
            } else {
                this._scrollToSelected(col,idx,true);
            }
        };

        const onStart=e=>{
            e.preventDefault();
            if(rafId)cancelAnimationFrame(rafId);
            isDragging=true;
            startY=getY(e);lastY=startY;lastTime=performance.now();velocity=0;momentum=0;
            col.style.cursor='grabbing';
        };

        const onMove=e=>{
            if(!isDragging)return;
            e.preventDefault();
            const y=getY(e);
            const dy=y-lastY;
            const dt=performance.now()-lastTime;
            velocity=dt>0?dy/dt*16:0;
            lastY=y;lastTime=performance.now();
            const items=col.querySelector('.wheel-items');
            const mat=new WebKitCSSMatrix(getComputedStyle(items).transform);
            let newY=mat.m42+dy;
            const maxY=0;
            const minY=-(state.items.length-1)*itemH;
            newY=Math.max(minY-40,Math.min(maxY+40,newY));
            items.style.transition='none';
            items.style.transform=`translateY(${newY}px)`;
            // Tick sound
            const approxIdx=Math.round(-newY/itemH);
            const clampedIdx=Math.max(0,Math.min(approxIdx,state.items.length-1));
            if(clampedIdx!==this._lastTickIndex){
                this._lastTickIndex=clampedIdx;
                const spd=Math.abs(velocity/16);
                this._tick(Math.min(spd,3));
            }
        };

        const onEnd=e=>{
            if(!isDragging)return;
            isDragging=false;col.style.cursor='grab';
            // Momentum flick
            const items=col.querySelector('.wheel-items');
            const mat=new WebKitCSSMatrix(getComputedStyle(items).transform);
            let offset=mat.m42+velocity*6;
            const maxY=0;const minY=-(state.items.length-1)*itemH;
            offset=Math.max(minY,Math.min(maxY,offset));
            const idx=Math.max(0,Math.min(Math.round(-offset/itemH),state.items.length-1));
            state.selected=idx;
            this._scrollToSelected(col,idx,true);
            this._snap();
            this._updateSelected(col,idx);
            this._updateDisplay();
        };

        col.addEventListener('touchstart',onStart,{passive:false});
        col.addEventListener('touchmove',onMove,{passive:false});
        col.addEventListener('touchend',onEnd);
        col.addEventListener('mousedown',onStart);
        document.addEventListener('mousemove',e=>{if(isDragging)onMove(e);});
        document.addEventListener('mouseup',e=>{if(isDragging)onEnd(e);});
    }

    _scrollToSelected(col,idx,animate){
        const items=col.querySelector('.wheel-items');
        const offset=-(idx*44);
        items.style.transition=animate?'transform .35s cubic-bezier(.32,0,.67,0)':'none';
        items.style.transform=`translateY(${offset}px)`;
    }

    _updateSelected(col,idx){
        col.querySelectorAll('.wheel-item').forEach((el,i)=>{
            // Offset by pad=2
            el.classList.toggle('selected',i-2===idx);
        });
    }

    _updateDisplay(){
        const disp=document.getElementById('wheelSelectedDisplay');
        if(!disp)return;
        const val=this._getCurrentVal();
        if(val===null){disp.textContent='';return;}
        if(this._weightUnit!==null){
            disp.textContent=val+' '+this.unit;
        } else if(this.unit==='ft'&&val&&typeof val==='object'){
            disp.textContent=val.ft+"' "+val.inch+'"';
        } else {
            disp.textContent=val+' cm';
        }
    }

    _confirm(){
        const val=this._getCurrentVal();
        if(val!==null&&this.onConfirm)this.onConfirm(val,this.unit);
        this.close();
    }

    close(){
        const overlay=document.getElementById('wheelOverlay');
        const sheet=document.getElementById('wheelSheet');
        sheet.style.transition='transform .25s cubic-bezier(.32,0,.67,0)';
        sheet.style.transform='translateY(100%)';
        setTimeout(()=>{
            overlay.classList.add('hidden');
            sheet.style.transform='';sheet.style.transition='';
        },260);
    }
}
