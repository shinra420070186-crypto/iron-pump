// ═══════════════════════════════════════════════════════════
// IRON PUMP — Elite Training System v4
// Arena System + Full Intelligence + History
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

function epley1RM(weight,reps){
    if(reps===1)return weight;
    return Math.round(weight*(1+reps/30));
}

// ═══════════════════════════════════════════════════════════
// ARENA SYSTEM
// ═══════════════════════════════════════════════════════════
const ARENA_RANKS = [
    {name:'Rookie',     minXP:0,    maxXP:200,  tier:1},
    {name:'Lifter',     minXP:200,  maxXP:500,  tier:2},
    {name:'Grinder',    minXP:500,  maxXP:1000, tier:3},
    {name:'Beast',      minXP:1000, maxXP:2000, tier:4},
    {name:'Titan',      minXP:2000, maxXP:4000, tier:5},
    {name:'Monster',    minXP:4000, maxXP:7000, tier:6},
    {name:'Iron Legend',minXP:7000, maxXP:99999,tier:7}
];

const ARENA_BADGES = [
    {id:'first_session',    name:'First Rep',          desc:'Complete your first workout',           icon:'🔱',xp:50, category:'split'},
    {id:'first_full_week',  name:'Full Week',          desc:'Complete all 5 sessions in a week',     icon:'⚡',xp:150,category:'split'},
    {id:'perfect_split',    name:'Perfect Split',      desc:'Complete the full split without skips', icon:'💎',xp:200,category:'split'},
    {id:'ten_sessions',     name:'10 Sessions',        desc:'Log 10 total workouts',                 icon:'🔥',xp:100,category:'split'},
    {id:'fifty_sessions',   name:'Fifty Strong',       desc:'Log 50 total workouts',                 icon:'⚔️',xp:300,category:'split'},
    {id:'routine_machine',  name:'Routine Machine',    desc:'Complete 4 full split weeks',           icon:'🏛️',xp:250,category:'split'},
    {id:'shift_survivor',   name:'Shift Survivor',     desc:'Complete a week with shifted days',     icon:'🛡️',xp:75, category:'adapt'},
    {id:'no_session_left',  name:'No Session Left',    desc:'Recover from a missed day same week',   icon:'⚡',xp:100,category:'adapt'},
    {id:'workproof',        name:'Workproof',          desc:'Train 3 weeks straight despite shifts', icon:'🔩',xp:150,category:'adapt'},
    {id:'first_pr',         name:'First PR',           desc:'Set your first personal record',        icon:'🏆',xp:75, category:'perf'},
    {id:'ten_prs',          name:'PR Machine',         desc:'Set 10 personal records',               icon:'💥',xp:150,category:'perf'},
    {id:'volume_beast',     name:'Volume Beast',       desc:'Hit 10,000 kg total volume in a week',  icon:'🦾',xp:200,category:'perf'},
    {id:'heavy_hitter',     name:'Heavy Hitter',       desc:'Beat your previous session volume',     icon:'💪',xp:50, category:'perf'},
    {id:'streak_3',         name:'On Fire',            desc:'Maintain a 3-day streak',               icon:'🔥',xp:50, category:'streak'},
    {id:'streak_7',         name:'Week Warrior',       desc:'Maintain a 7-day streak',               icon:'⚡',xp:100,category:'streak'},
    {id:'streak_14',        name:'Iron Will',          desc:'Maintain a 14-day streak',              icon:'💎',xp:200,category:'streak'},
    {id:'log_weight_5',     name:'Body Tracker',       desc:'Log bodyweight 5 times',                icon:'📊',xp:50, category:'consist'},
    {id:'consistency_machine',name:'Consistency Machine',desc:'Train 3 weeks with 4+ sessions each',icon:'⚙️',xp:200,category:'consist'},
];

class ArenaSystem {
    constructor(){this.data=this.load();}
    load(){const s=localStorage.getItem('ip_arena');if(s)return JSON.parse(s);return{xp:0,badges:[],lastMissionReset:null,completedMissions:[],weeklyXP:0,weekStart:null,claimedRewards:[]};}
    save(){localStorage.setItem('ip_arena',JSON.stringify(this.data));}
    getRank(){const xp=this.data.xp;for(let i=ARENA_RANKS.length-1;i>=0;i--){if(xp>=ARENA_RANKS[i].minXP)return ARENA_RANKS[i];}return ARENA_RANKS[0];}
    getNextRank(){const rank=this.getRank();const idx=ARENA_RANKS.findIndex(r=>r.name===rank.name);return ARENA_RANKS[idx+1]||null;}
    addXP(amount,reason){const oldRank=this.getRank();this.data.xp+=amount;this.data.weeklyXP=(this.data.weeklyXP||0)+amount;const newRank=this.getRank();this.save();if(oldRank.name!==newRank.name)return{rankedUp:true,newRank:newRank.name,xpGained:amount,reason};return{rankedUp:false,xpGained:amount,reason};}
    unlockBadge(badgeId){if(this.data.badges.includes(badgeId))return null;const badge=ARENA_BADGES.find(b=>b.id===badgeId);if(!badge)return null;this.data.badges.push(badgeId);this.addXP(badge.xp,'Badge: '+badge.name);this.save();return badge;}
    hasBadge(id){return this.data.badges.includes(id);}
    getWeekSessions(all){const now=new Date(),day=now.getDay(),monday=new Date(now);monday.setDate(now.getDate()-(day===0?6:day-1));monday.setHours(0,0,0,0);return all.filter(w=>new Date(w.startTime)>=monday);}
    getSplitCompletion(all){const week=this.getWeekSessions(all);const completed=['day1','day2','day3','day4','day5'].filter(d=>week.some(w=>w.dayId===d));return{completed:completed.length,total:5,days:completed};}
    getDailyMissions(all){
        const today=new Date().toDateString();
        if(this.data.lastMissionReset!==today){this.data.completedMissions=[];this.data.lastMissionReset=today;this.save();}
        const split=this.getSplitCompletion(all);
        const bwLogs=JSON.parse(localStorage.getItem('ip_bw')||'[]');
        const todayWorkouts=all.filter(w=>new Date(w.startTime).toDateString()===today);
        const missions=[];
        if(!bwLogs.some(l=>new Date(l.date).toDateString()===today)){
            missions.push({id:'log_bw_today',label:'Log Body Weight',desc:'Track your weight today',xp:10,icon:'📊',difficulty:'easy'});
        } else {
            missions.push({id:'open_arena',label:'Check Arena',desc:'Review your progress',xp:10,icon:'⚡',difficulty:'easy',auto:true});
        }
        if(split.completed<5){
            const pending=['day1','day2','day3','day4','day5'].find(d=>!split.days.includes(d));
            if(pending){const dayName=PROGRAM.find(p=>p.id===pending)?.name||pending;missions.push({id:'complete_session_'+pending,label:'Execute '+dayName,desc:'Complete your next split session',xp:30,icon:'🔱',difficulty:'medium'});}
        } else {
            missions.push({id:'review_split',label:'Split Review',desc:'All 5 sessions done this week',xp:30,icon:'💎',difficulty:'medium',auto:true});
        }
        if(todayWorkouts.length>0){
            missions.push({id:'beat_volume',label:'Volume King',desc:'Beat your previous session volume',xp:40,icon:'💥',difficulty:'hard',completed:this.checkBeatVolume(all)});
        } else {
            missions.push({id:'no_skip',label:'Zero Skips',desc:'Finish all exercises in next session',xp:40,icon:'⚔️',difficulty:'hard'});
        }
        return missions;
    }
    checkBeatVolume(all){if(all.length<2)return false;const last=all[all.length-1];const prev=all.slice(0,-1).filter(w=>w.dayId===last.dayId);if(!prev.length)return false;return last.totalVolume>prev[prev.length-1].totalVolume;}
    getStreak(all){if(!all.length)return 0;const dates=[...new Set(all.map(w=>new Date(w.startTime).toDateString()))].sort((a,b)=>new Date(b)-new Date(a));let streak=1;for(let i=0;i<dates.length-1;i++){if((new Date(dates[i])-new Date(dates[i+1]))/86400000<=1.5)streak++;else break;}return streak;}
    getWeeklyChallenges(all){
        const split=this.getSplitCompletion(all);
        const bwLogs=JSON.parse(localStorage.getItem('ip_bw')||'[]');
        const weekSessions=this.getWeekSessions(all);
        const now=new Date(),day=now.getDay(),mon=new Date(now);
        mon.setDate(now.getDate()-(day===0?6:day-1));mon.setHours(0,0,0,0);
        return[
            {id:'perfect_split_week',label:'Perfect Split',desc:'Complete all 5 sessions this week',progress:split.completed,total:5,xp:150,icon:'💎',type:'featured'},
            {id:'beat_last_week',label:'Volume Surge',desc:'Beat last week total volume',progress:this.getVolumeProgress(all),total:100,xp:100,icon:'📈',type:'performance'},
            {id:'log_bw_3',label:'Body Tracker',desc:'Log bodyweight 3 times this week',progress:Math.min(bwLogs.filter(l=>new Date(l.date)>=mon).length,3),total:3,xp:50,icon:'📊',type:'discipline'},
            {id:'no_skip_week',label:'Zero Skips',desc:'Finish all exercises in every session',progress:weekSessions.filter(w=>!(w.exercises||[]).some(e=>e.skipped)).length,total:Math.max(weekSessions.length,1),xp:80,icon:'⚔️',type:'discipline'}
        ];
    }
    getVolumeProgress(all){const now=Date.now();const t=all.filter(w=>new Date(w.startTime).getTime()>now-7*86400000).reduce((a,w)=>a+(w.totalVolume||0),0);const l=all.filter(w=>{const x=new Date(w.startTime).getTime();return x>now-14*86400000&&x<=now-7*86400000;}).reduce((a,w)=>a+(w.totalVolume||0),0);if(!l)return 50;return Math.min(100,Math.round((t/l)*100));}
    checkAndAwardBadges(all){
        const nb=[];const split=this.getSplitCompletion(all);const streak=this.getStreak(all);
        const prs=JSON.parse(localStorage.getItem('ip_prs')||'{}');const bwLogs=JSON.parse(localStorage.getItem('ip_bw')||'[]');
        const weekVol=all.filter(w=>new Date(w.startTime).getTime()>Date.now()-7*86400000).reduce((a,w)=>a+(w.totalVolume||0),0);
        if(all.length>=1){const b=this.unlockBadge('first_session');if(b)nb.push(b);}
        if(all.length>=10){const b=this.unlockBadge('ten_sessions');if(b)nb.push(b);}
        if(all.length>=50){const b=this.unlockBadge('fifty_sessions');if(b)nb.push(b);}
        if(split.completed>=5){const b=this.unlockBadge('first_full_week');if(b)nb.push(b);}
        if(streak>=3){const b=this.unlockBadge('streak_3');if(b)nb.push(b);}
        if(streak>=7){const b=this.unlockBadge('streak_7');if(b)nb.push(b);}
        if(streak>=14){const b=this.unlockBadge('streak_14');if(b)nb.push(b);}
        if(Object.keys(prs).length>=1){const b=this.unlockBadge('first_pr');if(b)nb.push(b);}
        if(Object.keys(prs).length>=10){const b=this.unlockBadge('ten_prs');if(b)nb.push(b);}
        if(weekVol>=10000){const b=this.unlockBadge('volume_beast');if(b)nb.push(b);}
        if(bwLogs.length>=5){const b=this.unlockBadge('log_weight_5');if(b)nb.push(b);}
        if(this.checkBeatVolume(all)){const b=this.unlockBadge('heavy_hitter');if(b)nb.push(b);}
        return nb;
    }
    completeMission(id){if(this.data.completedMissions.includes(id))return false;this.data.completedMissions.push(id);this.save();return true;}
    isMissionComplete(id){return this.data.completedMissions.includes(id);}
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
        this.arena=new ArenaSystem();
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

    setupLoading(){
        setTimeout(()=>{
            document.getElementById('loader').classList.add('hidden');
            document.getElementById('app').classList.add('loaded');
            setTimeout(()=>{this.updateIntel();this.drawChart()},400);
        },2200);
    }

    setupNav(){
        document.querySelectorAll('.bnav').forEach(btn=>{
            btn.addEventListener('click',()=>{
                const page=btn.dataset.page;
                document.querySelectorAll('.bnav').forEach(b=>b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
                document.getElementById('page-'+page).classList.add('active');
                window.scrollTo({top:0,behavior:'instant'});
                if(page==='intel'){this.updateIntel();this.drawChart();this.renderMuscleVolume();}
                if(page==='history')this.loadHistory();
                if(page==='arena')this.renderArena();
                this.sound.play('tap');this.vib(10);
            });
        });
    }

    setupBack(){
        document.getElementById('backBtn').addEventListener('click',()=>{
            if(this.workout&&this.workout.totalSets>0){if(!confirm('Discard active workout?'))return}
            this.cancelWorkout();this.sound.play('back');this.vib(10);
        });
        const bwBack=document.getElementById('bwBackBtn');
        if(bwBack)bwBack.addEventListener('click',()=>{
            document.getElementById('bwSubPage').classList.add('hidden');
            document.getElementById('intelMain').classList.remove('hidden');
            this.sound.play('back');this.vib(10);
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

    getPrevSession(dayId){
        const all=JSON.parse(localStorage.getItem('ironpump_workouts')||'[]');
        const prev=all.filter(w=>w.dayId===dayId&&w.endTime);
        if(prev.length<1)return null;
        return prev[prev.length-1];
    }

    getPrevSetData(dayId,exName,setIndex){
        const session=this.getPrevSession(dayId);
        if(!session)return null;
        const ex=(session.exercises||[]).find(e=>e.name===exName);
        if(!ex||!ex.sets||!ex.sets[setIndex])return null;
        const s=ex.sets[setIndex];
        if(parseFloat(s.weight)>0&&parseFloat(s.reps)>0)return s;
        return null;
    }

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
            const w=document.getElementById('setWeight');
            const r=document.getElementById('setReps');
            if(w)ex.sets[si].weight=w.value;
            if(r)ex.sets[si].reps=r.value;
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
            this.sound.play('skip');this.vib(15);
            setTimeout(()=>this.renderEx(),260);
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
        const valEl=document.getElementById('prBannerVal');
        const repsEl=document.getElementById('prBannerReps');
        const rightEl=document.getElementById('prBannerRight');
        if(!valEl||!repsEl)return;
        const cur=ex.sets[si]||{};
        const curW=parseFloat(cur.weight)||0;
        const curR=parseFloat(cur.reps)||0;
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

    getSetPR(exName,setIndex){const key=exName+'__set'+setIndex;return this.prRecords[key]||null;}
    saveSetPR(exName,setIndex,weight,reps){
        const key=exName+'__set'+setIndex;const prev=this.prRecords[key];
        if(!prev||weight>prev.weight||(weight===prev.weight&&reps>prev.reps)){
            this.prRecords[key]={weight,reps,date:new Date().toISOString()};
            localStorage.setItem('ip_prs',JSON.stringify(this.prRecords));
        }
    }

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
        setTimeout(()=>this.awardWorkoutXP(),300);
    }

    awardWorkoutXP(){
        const all=JSON.parse(localStorage.getItem('ironpump_workouts')||'[]');
        if(!all.length)return;
        const rewards=[];const wo=all[all.length-1];
        const r1=this.arena.addXP(20,'Workout Logged');
        rewards.push({label:'Workout Logged',xp:20});
        const allDone=(wo.exercises||[]).every(e=>e.completed);
        if(allDone){this.arena.addXP(25,'All Exercises Complete');rewards.push({label:'All Exercises',xp:25});}
        const newBadges=this.arena.checkAndAwardBadges(all);
        newBadges.forEach(b=>rewards.push({label:'Badge: '+b.name,xp:b.xp,badge:true}));
        const missions=this.arena.getDailyMissions(all);
        missions.forEach(m=>{
            if(m.auto&&!this.arena.isMissionComplete(m.id)){
                this.arena.completeMission(m.id);
                this.arena.addXP(m.xp,'Mission: '+m.label);
                rewards.push({label:'Mission: '+m.label,xp:m.xp});
            }
        });
        if(rewards.length)this.showArenaRewards(rewards,r1.rankedUp,r1.rankedUp?r1.newRank:null);
    }

    showArenaRewards(rewards,rankedUp,newRank){
        const overlay=document.getElementById('arenaRewardOverlay');if(!overlay)return;
        const totalXP=rewards.reduce((a,r)=>a+r.xp,0);
        const rank=this.arena.getRank();const next=this.arena.getNextRank();
        const pct=next?Math.round(((this.arena.data.xp-rank.minXP)/(next.minXP-rank.minXP))*100):100;
        document.getElementById('arenaRewardItems').innerHTML=rewards.map((r,i)=>
            `<div class="arena-reward-item" style="animation:popIn .3s ease ${i*.08}s both">
                <span class="arena-reward-label">${r.badge?'🏆 ':''}${r.label}</span>
                <span class="arena-reward-xp">+${r.xp} XP</span>
            </div>`).join('');
        document.getElementById('arenaRewardTotal').textContent='+'+totalXP+' XP';
        document.getElementById('arenaRewardRank').textContent=rankedUp?'🔺 RANKED UP — '+newRank:'Rank: '+rank.name;
        document.getElementById('arenaXPBar2').style.width=pct+'%';
        overlay.classList.remove('hidden');
        this.sound.play('complete');this.vib(30);
    }

    setupWeight(){
        const bwBtn=document.getElementById('bwOpenBtn');
        if(bwBtn)bwBtn.addEventListener('click',()=>{
            document.getElementById('intelMain').classList.add('hidden');
            document.getElementById('bwSubPage').classList.remove('hidden');
            this.renderWeight();this.sound.play('tap');this.vib(10);
        });
        document.getElementById('bwSave').addEventListener('click',()=>{
            const val=parseFloat(document.getElementById('bwInput').value);
            if(!val||val<20||val>300){alert('Enter a valid weight (20-300 kg)');return;}
            const logs=JSON.parse(localStorage.getItem('ip_bw')||'[]');
            logs.push({weight:val,date:new Date().toISOString()});
            localStorage.setItem('ip_bw',JSON.stringify(logs));
            document.getElementById('bwInput').value='';
            this.renderWeight();this.sound.play('finish');this.vib(20);
        });
    }

    renderWeight(){
        const logs=JSON.parse(localStorage.getItem('ip_bw')||'[]');
        const cur=document.getElementById('bwCurrent');
        if(logs.length===0){cur.innerHTML='<div class="bw-current"><span class="bw-label">No weight logged yet</span><span class="bw-value">—</span></div>';}
        else{
            const latest=logs[logs.length-1];const prev=logs.length>1?logs[logs.length-2]:null;
            const diff=prev?(latest.weight-prev.weight).toFixed(1):0;
            const cls=diff>0?'up':diff<0?'down':'same';const sign=diff>0?'+':'';
            cur.innerHTML=`<div class="bw-current"><span class="bw-label">Current Weight</span><div><span class="bw-value">${latest.weight} kg</span>${prev?`<span class="bw-change ${cls}">${sign}${diff} kg</span>`:''}</div></div>`;
        }
        this.drawWeightChart(logs);
        const hist=document.getElementById('bwHistory');
        if(logs.length===0){hist.innerHTML='';return;}
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
        if(logs.length<2){ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='13px Space Grotesk';ctx.textAlign='center';ctx.fillText('Log more weights to see trend',w/2,h/2);return;}
        const data=logs.slice(-20).map(l=>l.weight);
        const labels=logs.slice(-20).map(l=>{const d=new Date(l.date);return(d.getMonth()+1)+'/'+d.getDate();});
        const mx=Math.max(...data)*1.02,mn=Math.min(...data)*.98,range=mx-mn||1;
        const xS=(i)=>pad.l+(i/(data.length-1))*cw;
        const yS=(v)=>pad.t+ch-((v-mn)/range)*ch;
        ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;
        for(let i=0;i<=4;i++){const y=pad.t+(i/4)*ch;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();
            ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='10px JetBrains Mono';ctx.textAlign='right';ctx.fillText((mx-(i/4)*range).toFixed(1),pad.l-8,y+4);}
        ctx.textAlign='center';labels.forEach((l,i)=>{if(i%Math.ceil(data.length/6)===0)ctx.fillText(l,xS(i),h-8);});
        const grad=ctx.createLinearGradient(0,pad.t,0,h-pad.b);grad.addColorStop(0,'rgba(0,255,136,0.3)');grad.addColorStop(1,'rgba(0,255,136,0)');
        ctx.beginPath();ctx.moveTo(xS(0),h-pad.b);for(let i=0;i<data.length;i++)ctx.lineTo(xS(i),yS(data[i]));
        ctx.lineTo(xS(data.length-1),h-pad.b);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
        ctx.beginPath();ctx.strokeStyle='#00ff88';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';
        for(let i=0;i<data.length;i++){if(i===0)ctx.moveTo(xS(i),yS(data[i]));else ctx.lineTo(xS(i),yS(data[i]));}ctx.stroke();
        for(let i=0;i<data.length;i++){const x=xS(i),y=yS(data[i]);
            ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle='rgba(0,255,136,0.2)';ctx.fill();
            ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle='#00ff88';ctx.fill();}
    }

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

    renderArena(){
        const all=JSON.parse(localStorage.getItem('ironpump_workouts')||'[]');
        const rank=this.arena.getRank();const next=this.arena.getNextRank();
        const xp=this.arena.data.xp;
        const pct=next?Math.round(((xp-rank.minXP)/(next.minXP-rank.minXP))*100):100;
        const streak=this.arena.getStreak(all);
        const split=this.arena.getSplitCompletion(all);
        const missions=this.arena.getDailyMissions(all);
        const challenges=this.arena.getWeeklyChallenges(all);
        const remaining=5-split.completed;
        const statusLine=remaining>0?`${remaining} session${remaining>1?'s':''} away from clearing the split.`:'Split complete. Legendary week.';
        document.getElementById('arenaRank').textContent=rank.name;
        document.getElementById('arenaXP').textContent=xp.toLocaleString();
        document.getElementById('arenaXPNext').textContent=next?(next.minXP).toLocaleString():'MAX';
        document.getElementById('arenaXPBar').style.width=pct+'%';
        document.getElementById('arenaStreak').textContent=streak;
        document.getElementById('arenaSplit').textContent=split.completed+' / 5';
        document.getElementById('arenaStatusLine').textContent=statusLine;
        const splitDays=['day1','day2','day3','day4','day5'];
        const splitLabels=['Day 1','Day 2','Day 3','Day 4','Day 5'];
        document.getElementById('arenaSplitTracker').innerHTML=splitDays.map((d,i)=>{
            const done=split.days.includes(d);
            return `<div class="arena-split-day ${done?'done':'pending'}">
                <div class="arena-split-dot">${done?'✓':''}</div>
                <span class="arena-split-label">${splitLabels[i]}</span>
            </div>`;
        }).join('');
        document.getElementById('arenaMissions').innerHTML=missions.map(m=>{
            const done=this.arena.isMissionComplete(m.id)||(m.auto);
            return `<div class="arena-mission ${done?'done':''}">
                <div class="arena-mission-left">
                    <span class="arena-mission-icon">${m.icon}</span>
                    <div><span class="arena-mission-label">${m.label}</span><span class="arena-mission-desc">${m.desc}</span></div>
                </div>
                <div class="arena-mission-right">
                    <span class="arena-mission-xp">+${m.xp} XP</span>
                    ${done?'<span class="arena-mission-check">✓</span>':`<button class="arena-claim-btn" onclick="app.claimMission('${m.id}',${m.xp},'${m.label}')">Claim</button>`}
                </div>
            </div>`;
        }).join('');
        const featured=challenges[0];
        const featPct=Math.min(100,Math.round((featured.progress/featured.total)*100));
        document.getElementById('arenaFeatured').innerHTML=`
            <div class="arena-featured-top">
                <span class="arena-featured-icon">${featured.icon}</span>
                <div><span class="arena-featured-label">${featured.label}</span><span class="arena-featured-desc">${featured.desc}</span></div>
                <span class="arena-featured-xp">+${featured.xp} XP</span>
            </div>
            <div class="arena-featured-progress">
                <div class="arena-featured-bar"><div class="arena-featured-fill" style="width:${featPct}%"></div></div>
                <span class="arena-featured-count">${featured.progress} / ${featured.total}</span>
            </div>`;
        document.getElementById('arenaChallenges').innerHTML=challenges.slice(1).map(c=>{
            const p=Math.min(100,Math.round((c.progress/c.total)*100));
            return `<div class="arena-challenge">
                <div class="arena-challenge-top">
                    <span class="arena-challenge-icon">${c.icon}</span>
                    <div class="arena-challenge-info"><span class="arena-challenge-label">${c.label}</span><span class="arena-challenge-desc">${c.desc}</span></div>
                    <span class="arena-challenge-xp">+${c.xp}</span>
                </div>
                <div class="arena-bar-wrap">
                    <div class="arena-bar"><div class="arena-bar-fill" style="width:${p}%"></div></div>
                    <span class="arena-bar-pct">${c.progress}/${c.total}</span>
                </div>
            </div>`;
        }).join('');
        document.getElementById('arenaBadges').innerHTML=ARENA_BADGES.map((b,i)=>{
            const unlocked=this.arena.hasBadge(b.id);
            return `<div class="arena-badge ${unlocked?'unlocked':'locked'}" style="animation:popIn .25s ease ${i*.03}s both" title="${b.desc}">
                <span class="arena-badge-icon">${unlocked?b.icon:'🔒'}</span>
                <span class="arena-badge-name">${b.name}</span>
            </div>`;
        }).join('');
    }

    claimMission(id,xp,label){
        if(this.arena.isMissionComplete(id)){this.sound.play('skip');return;}
        this.arena.completeMission(id);
        this.arena.addXP(xp,'Mission: '+label);
        this.sound.play('finish');this.vib(20);
        this.renderArena();
        const toast=document.getElementById('arenaToast');
        if(toast){toast.textContent='+'+xp+' XP — '+label;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2000);}
    }

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
        if(bsEl){if(bestSessionVol>0){const d=new Date(bestSessionDate);const ds=d.toLocaleDateString('en-US',{month:'short',day:'numeric'});bsEl.innerHTML=`<span class="intel-extra-val">${Math.round(bestSessionVol).toLocaleString()} kg</span><span class="intel-extra-sub">on ${ds}</span>`;}else{bsEl.innerHTML=`<span class="intel-extra-val">—</span>`;}}
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

    drawChart(){
        const canvas=document.getElementById('volChart');if(!canvas)return;
        const ctx=canvas.getContext('2d');const dpr=window.devicePixelRatio||1;
        const rect=canvas.getBoundingClientRect();canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;
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
