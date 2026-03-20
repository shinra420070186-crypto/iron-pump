// ═══════════════════════════════════════════════════════════
// IRON PUMP — Elite Training System
// Complete App with Sound + Ripple + Real Intelligence
// ═══════════════════════════════════════════════════════════

const PROGRAM = [
    {
        id: 'day1',
        name: 'Day 1',
        label: 'UPPER (Chest + Back + Arms)',
        exercises: [
            { name: 'Bench Press', muscle: 'Chest', rec: '3×6-8' },
            { name: 'Chest-Supported Row', muscle: 'Back', rec: '3×8-10' },
            { name: 'Incline Dumbbell Press', muscle: 'Upper Chest', rec: '3×8-10' },
            { name: 'Lat Pulldown', muscle: 'Lats', rec: '3×8-10' },
            { name: 'Machine Chest Fly', muscle: 'Chest', rec: '3×12-15' },
            { name: 'Lateral Raises', muscle: 'Side Delts', rec: '3×12-15' },
            { name: 'Face Pulls', muscle: 'Rear Delts', rec: '3×15-20' },
            { name: 'Tricep Rope Pushdown', muscle: 'Triceps', rec: '3×12-15' },
            { name: 'Hammer Curls', muscle: 'Biceps', rec: '2×10-12' }
        ]
    },
    {
        id: 'day2',
        name: 'Day 2',
        label: 'LOWER (Quads) + CORE',
        exercises: [
            { name: 'Squat', muscle: 'Quads', rec: '3×5-8' },
            { name: 'Leg Press', muscle: 'Quads', rec: '3×10-12' },
            { name: 'Leg Extension', muscle: 'Quads', rec: '3×12-15' },
            { name: 'RDL (light)', muscle: 'Hamstrings', rec: '2×8-10' },
            { name: 'Standing Calf Raise', muscle: 'Calves', rec: '3×10-12' },
            { name: 'Cable Crunch', muscle: 'Core', rec: '3×10-15' },
            { name: 'Plank', muscle: 'Core', rec: '2×45-60 sec' }
        ]
    },
    {
        id: 'day3',
        name: 'Day 3',
        label: 'PUSH (Shoulders + Upper Chest + light Oblique)',
        exercises: [
            { name: 'Overhead Press', muscle: 'Shoulders', rec: '3×5-8' },
            { name: 'Incline Smith Press', muscle: 'Upper Chest', rec: '3×8-10' },
            { name: 'Machine Lateral Raises', muscle: 'Side Delts', rec: '4×12-20' },
            { name: 'Upper Chest Cable Fly', muscle: 'Upper Chest', rec: '3×12-15' },
            { name: 'Cable Lateral Raise', muscle: 'Side Delts', rec: '2×12-15' },
            { name: 'Dips', muscle: 'Chest/Triceps', rec: '3×10-15' },
            { name: 'Overhead Tricep Extension', muscle: 'Triceps', rec: '3×10-12' },
            { name: 'High Cable Side Bend', muscle: 'Obliques', rec: '2×12-15 each' }
        ]
    },
    {
        id: 'day4',
        name: 'Day 4',
        label: 'PULL (Back + Rear Delts + Biceps)',
        exercises: [
            { name: 'Pull-ups or Lat Pulldown', muscle: 'Lats', rec: '3×6-10' },
            { name: 'Chest-Supported Row', muscle: 'Back', rec: '3×8-10' },
            { name: 'Seated Row', muscle: 'Mid Back', rec: '3×10-12' },
            { name: 'Shrugs', muscle: 'Traps', rec: '3×10-12' },
            { name: 'Rear Delt Fly', muscle: 'Rear Delts', rec: '3×12-20' },
            { name: 'Incline Dumbbell Curl', muscle: 'Biceps', rec: '3×10-12' },
            { name: 'Preacher Curl', muscle: 'Biceps', rec: '2×12-15' }
        ]
    },
    {
        id: 'day5',
        name: 'Day 5',
        label: 'LOWER (Glutes + Hamstrings) + CORE',
        exercises: [
            { name: 'Romanian Deadlift', muscle: 'Hamstrings', rec: '3×6-8' },
            { name: 'Hip Thrust', muscle: 'Glutes', rec: '3×6-10' },
            { name: 'Hamstring Curl', muscle: 'Hamstrings', rec: '3×12-15' },
            { name: 'Bulgarian Split Squat', muscle: 'Quads/Glutes', rec: '2×8-10' },
            { name: 'Seated Calf Raise', muscle: 'Calves', rec: '3×12-15' },
            { name: 'Hanging Knee Raises', muscle: 'Core', rec: '3×10-15' },
            { name: 'Woodchoppers or Pallof Press', muscle: 'Core', rec: '2×12-15' }
        ]
    }
];

// ═══════════════════════════════════════════════════════════
// SOUND ENGINE
// ═══════════════════════════════════════════════════════════
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        document.addEventListener('click', () => {
            if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }, { once: true });
    }

    play(type) {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const sounds = {
            tap: { f: 2200, d: 0.025, v: 0.08, t: 'sine' },
            add: { f: 1400, d: 0.06, v: 0.1, t: 'sine' },
            skip: { f: 800, d: 0.08, v: 0.06, t: 'triangle' },
            finish: { f: 880, d: 0.2, v: 0.12, t: 'sine' },
            complete: { f: 523, d: 0.4, v: 0.15, t: 'sine' },
            back: { f: 600, d: 0.04, v: 0.06, t: 'sine' },
            delete: { f: 400, d: 0.06, v: 0.08, t: 'sawtooth' },
            start: { f: 660, d: 0.15, v: 0.1, t: 'sine' },
            rest: { f: 1000, d: 0.3, v: 0.12, t: 'sine' }
        };

        const s = sounds[type] || sounds.tap;
        osc.type = s.t;
        osc.frequency.setValueAtTime(s.f, now);

        if (type === 'complete') {
            osc.frequency.setValueAtTime(523, now);
            osc.frequency.setValueAtTime(659, now + 0.1);
            osc.frequency.setValueAtTime(784, now + 0.2);
        }
        if (type === 'finish') {
            osc.frequency.exponentialRampToValueAtTime(1320, now + s.d);
        }
        if (type === 'rest') {
            osc.frequency.exponentialRampToValueAtTime(500, now + s.d);
        }

        gain.gain.setValueAtTime(s.v, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + s.d);
        osc.start(now);
        osc.stop(now + s.d + 0.01);
    }
}

// ═══════════════════════════════════════════════════════════
// RIPPLE EFFECT
// ═══════════════════════════════════════════════════════════
function createRipple(e, el) {
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX || e.touches[0].clientX) - rect.left - size / 2 + 'px';
    ripple.style.top = (e.clientY || e.touches[0].clientY) - rect.top - size / 2 + 'px';
    ripple.className = 'ripple';
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
class IronPump {
    constructor() {
        this.workout = null;
        this.exIndex = 0;
        this.timerInt = null;
        this.restInt = null;
        this.restDur = 120;
        this.restRem = 0;
        this.startTime = null;
        this.sound = new SoundEngine();
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onReady());
        } else {
            this.onReady();
        }
    }

    onReady() {
        this.setupLoading();
        this.setupNav();
        this.renderDays();
        this.setupRest();
        this.setupComplete();
        this.setupBack();
        this.loadHistory();
        this.updateIntel();

        // Global ripple on all buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button, .day-card, .mcard, .hero-card');
            if (btn) createRipple(e, btn);
        });
    }

    // ─── Loading ───
    setupLoading() {
        setTimeout(() => {
            document.getElementById('loader').classList.add('hidden');
            document.getElementById('app').classList.add('loaded');
            setTimeout(() => {
                this.updateIntel();
                this.drawChart();
            }, 400);
        }, 2200);
    }

    // ─── Navigation ───
    setupNav() {
        document.querySelectorAll('.bnav').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                document.querySelectorAll('.bnav').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('page-' + page).classList.add('active');
                if (page === 'intel') { this.updateIntel(); this.drawChart(); }
                if (page === 'history') this.loadHistory();
                this.sound.play('tap');
                this.vib(10);
            });
        });
    }

    // ─── Back Button ───
    setupBack() {
        document.getElementById('backBtn').addEventListener('click', () => {
            if (this.workout && this.workout.totalSets > 0) {
                if (!confirm('You have an active workout. Discard and go back?')) return;
            }
            this.cancelWorkout();
            this.sound.play('back');
            this.vib(10);
        });
    }

    cancelWorkout() {
        if (this.timerInt) clearInterval(this.timerInt);
        this.stopRest();
        this.workout = null;
        document.getElementById('woActive').classList.add('hidden');
        document.getElementById('woInactive').classList.remove('hidden');
        document.getElementById('exContainer').innerHTML = '';
        document.getElementById('liveVol').textContent = '0';
        document.getElementById('liveSets').textContent = '0';
        document.getElementById('liveEx').textContent = '0';
        document.getElementById('woTimer').textContent = '00:00';
    }

    // ─── Day Selection ───
    renderDays() {
        const grid = document.getElementById('dayGrid');
        if (!grid) return;
        grid.innerHTML = PROGRAM.map((day, i) => `
            <div class="day-card ripple-container" data-day="${day.id}" style="animation:popIn .4s cubic-bezier(.34,1.56,.64,1) ${i * 0.08}s both">
                <div class="day-left">
                    <span class="day-num">${day.name}</span>
                    <span class="day-sub">${day.label}</span>
                    <span class="day-count">${day.exercises.length} exercises</span>
                </div>
                <svg class="day-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
        `).join('');

        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.day-card');
            if (!card) return;
            this.startWorkout(card.dataset.day);
        });
    }

    // ─── Start Workout ───
    startWorkout(dayId) {
        const day = PROGRAM.find(d => d.id === dayId);
        if (!day) return;

        this.workout = {
            dayId, dayName: day.name, dayLabel: day.label,
            splitName: day.name + ' — ' + day.label,
            exercises: day.exercises.map(ex => ({
                name: ex.name, muscle: ex.muscle, rec: ex.rec,
                sets: [], skipped: false, completed: false
            })),
            startTime: new Date().toISOString(),
            totalVolume: 0, totalSets: 0
        };

        this.exIndex = 0;
        this.startTime = Date.now();
        this.startTimer();

        document.getElementById('woInactive').classList.add('hidden');
        document.getElementById('woActive').classList.remove('hidden');

        this.renderEx();
        this.updateHeader();
        this.updateLive();
        this.sound.play('start');
        this.vib(25);
    }

    startTimer() {
        if (this.timerInt) clearInterval(this.timerInt);
        this.timerInt = setInterval(() => {
            const e = Date.now() - this.startTime;
            const m = Math.floor(e / 60000);
            const s = Math.floor((e % 60000) / 1000);
            document.getElementById('woTimer').textContent =
                m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
        }, 1000);
    }

    updateHeader() {
        const wo = this.workout;
        document.getElementById('woSplit').textContent = wo.dayName + ' — ' + wo.dayLabel;
        const done = wo.exercises.filter(e => e.completed || e.skipped).length;
        document.getElementById('woProgress').textContent = `${done}/${wo.exercises.length}`;
    }

    // ─── Exercise View ───
    renderEx() {
        const c = document.getElementById('exContainer');
        const wo = this.workout;

        if (this.exIndex >= wo.exercises.length) {
            this.finishWorkout();
            return;
        }

        const ex = wo.exercises[this.exIndex];
        const num = this.exIndex + 1;
        const total = wo.exercises.length;
        const hasData = ex.sets.some(s => parseFloat(s.weight) > 0 && parseFloat(s.reps) > 0);

        let setsHtml = '';
        if (ex.sets.length === 0) {
            setsHtml = '<div class="no-sets">Tap "Add Set" to begin logging</div>';
        } else {
            setsHtml = ex.sets.map((set, si) => {
                const filled = parseFloat(set.weight) > 0 && parseFloat(set.reps) > 0;
                return `
                <div class="set-row ${filled ? 'filled' : ''}" style="animation:popIn .3s cubic-bezier(.34,1.56,.64,1) ${si * 0.05}s both">
                    <span class="set-num">${si + 1}</span>
                    <input type="number" class="set-input" placeholder="kg"
                        value="${set.weight}" data-si="${si}" data-field="weight" inputmode="decimal">
                    <input type="number" class="set-input" placeholder="reps"
                        value="${set.reps}" data-si="${si}" data-field="reps" inputmode="numeric">
                    <button class="set-del" data-si="${si}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>`;
            }).join('');
        }

        let skipHtml = '';
        if (!hasData) {
            skipHtml = `<button class="action-btn btn-skip-ex ripple-container" id="skipBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>
                </svg>Skip Exercise</button>`;
        } else {
            skipHtml = `<button class="action-btn btn-skip-set ripple-container" id="skipBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>
                </svg>Skip Remaining Sets</button>`;
        }

        c.innerHTML = `
            <div class="ex-active-card">
                <div class="ex-top-bar"></div>
                <div class="ex-progress-section">
                    <div class="ex-progress-bar"><div class="ex-progress-fill" style="width:${(num / total) * 100}%"></div></div>
                    <div class="ex-counter">EXERCISE ${num} OF ${total}</div>
                </div>
                <div class="ex-body">
                    <div class="ex-title-section">
                        <h3 class="ex-title">${ex.name}</h3>
                        <span class="ex-muscle">${ex.muscle}</span>
                        <span class="ex-rec">${ex.rec}</span>
                    </div>
                    <div class="sets-list">${setsHtml}</div>
                    <div class="ex-actions">
                        <button class="action-btn btn-add ripple-container" id="addSetBtn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>Add Set</button>
                        ${skipHtml}
                        ${hasData ? `<button class="action-btn btn-finish-ex ripple-container" id="finishExBtn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 11 12 14 22 4"/>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                            </svg>Finish Exercise</button>` : ''}
                    </div>
                </div>
            </div>`;

        // Add Set
        document.getElementById('addSetBtn').addEventListener('click', () => {
            ex.sets.push({ weight: '', reps: '' });
            this.renderEx();
            this.sound.play('add');
            this.vib(10);
        });

        // Skip
        document.getElementById('skipBtn').addEventListener('click', () => {
            if (!hasData) {
                ex.skipped = true;
                ex.completed = true;
            } else {
                ex.completed = true;
            }
            this.exIndex++;
            this.updateHeader();
            this.updateLive();
            this.renderEx();
            this.sound.play('skip');
            this.vib(15);
            if (hasData) this.startRestTimer();
        });

        // Finish Exercise
        const fb = document.getElementById('finishExBtn');
        if (fb) {
            fb.addEventListener('click', () => {
                ex.completed = true;
                this.exIndex++;
                this.updateHeader();
                this.updateLive();
                this.renderEx();
                this.sound.play('finish');
                this.vib(25);
                this.startRestTimer();
            });
        }

        // Set Inputs
        c.querySelectorAll('.set-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const si = parseInt(e.target.dataset.si);
                ex.sets[si][e.target.dataset.field] = e.target.value;
                this.updateLive();
                this.renderEx();
            });
            input.addEventListener('focus', () => input.select());
        });

        // Delete Set
        c.querySelectorAll('.set-del').forEach(btn => {
            btn.addEventListener('click', () => {
                ex.sets.splice(parseInt(btn.dataset.si), 1);
                this.renderEx();
                this.updateLive();
                this.sound.play('delete');
                this.vib(10);
            });
        });
    }

    updateLive() {
        if (!this.workout) return;
        let vol = 0, sets = 0;
        this.workout.exercises.forEach(ex => {
            ex.sets.forEach(s => {
                const w = parseFloat(s.weight), r = parseFloat(s.reps);
                if (w > 0 && r > 0) { vol += w * r; sets++; }
            });
        });

        const volEl = document.getElementById('liveVol');
        const setsEl = document.getElementById('liveSets');
        const exEl = document.getElementById('liveEx');

        const oldVol = volEl.textContent;
        volEl.textContent = Math.round(vol).toLocaleString();
        setsEl.textContent = sets;
        exEl.textContent = this.workout.exercises.filter(e => e.completed && !e.skipped).length;

        if (volEl.textContent !== oldVol) {
            volEl.classList.remove('bump');
            void volEl.offsetWidth;
            volEl.classList.add('bump');
        }

        this.workout.totalVolume = vol;
        this.workout.totalSets = sets;
    }

    // ─── Rest Timer ───
    setupRest() {
        document.getElementById('restSkip').addEventListener('click', () => {
            this.stopRest();
            this.sound.play('tap');
        });
        document.getElementById('restAdd30').addEventListener('click', () => {
            this.restRem += 30;
            this.sound.play('add');
            this.vib(10);
        });
    }

    startRestTimer() {
        this.restRem = this.restDur;
        const total = this.restDur;
        document.getElementById('restOverlay').classList.remove('hidden');
        this.updateRestUI(total);
        this.sound.play('rest');
        if (this.restInt) clearInterval(this.restInt);
        this.restInt = setInterval(() => {
            this.restRem--;
            this.updateRestUI(total);
            if (this.restRem <= 0) {
                this.stopRest();
                this.sound.play('finish');
                this.vib(50);
            }
        }, 1000);
    }

    updateRestUI(total) {
        const m = Math.floor(this.restRem / 60);
        const s = this.restRem % 60;
        document.getElementById('restTime').textContent = m + ':' + s.toString().padStart(2, '0');
        const circ = 2 * Math.PI * 90;
        document.getElementById('restRingFill').style.strokeDasharray = circ;
        document.getElementById('restRingFill').style.strokeDashoffset = circ - (this.restRem / total) * circ;
    }

    stopRest() {
        if (this.restInt) clearInterval(this.restInt);
        document.getElementById('restOverlay').classList.add('hidden');
    }

    // ─── Finish Workout ───
    setupComplete() {
        document.getElementById('compClose').addEventListener('click', () => {
            document.getElementById('completeOverlay').classList.add('hidden');
            this.sound.play('tap');
        });
    }

    finishWorkout() {
        if (!this.workout) return;
        if (this.timerInt) clearInterval(this.timerInt);
        this.stopRest();

        const dur = Math.round((Date.now() - this.startTime) / 60000);
        this.workout.endTime = new Date().toISOString();
        this.workout.duration = dur;
        this.updateLive();

        if (this.workout.totalSets > 0) {
            const all = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
            all.push(this.workout);
            localStorage.setItem('ironpump_workouts', JSON.stringify(all));
        }

        document.getElementById('compVol').textContent = Math.round(this.workout.totalVolume).toLocaleString();
        document.getElementById('compSets').textContent = this.workout.totalSets;
        document.getElementById('compTime').textContent = dur;
        document.getElementById('completeOverlay').classList.remove('hidden');

        document.getElementById('woActive').classList.add('hidden');
        document.getElementById('woInactive').classList.remove('hidden');
        document.getElementById('exContainer').innerHTML = '';
        document.getElementById('liveVol').textContent = '0';
        document.getElementById('liveSets').textContent = '0';
        document.getElementById('liveEx').textContent = '0';
        document.getElementById('woTimer').textContent = '00:00';

        this.workout = null;
        this.sound.play('complete');
        this.vib(40);
    }

    // ─── History ───
    loadHistory() {
        const all = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
        const list = document.getElementById('historyList');
        if (all.length === 0) {
            list.innerHTML = '<div class="no-history"><p>No workouts yet</p><p>Complete your first session!</p></div>';
            return;
        }
        list.innerHTML = all.slice().reverse().map((wo, i) => {
            const d = new Date(wo.startTime);
            const ds = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            return `<div class="history-card" style="animation:popIn .4s ease ${i * 0.06}s both">
                <div class="history-top">
                    <span class="history-split">${wo.splitName || wo.dayName}</span>
                    <span class="history-date">${ds}</span>
                </div>
                <div class="history-stats">
                    <span class="history-stat">Vol: <span>${Math.round(wo.totalVolume || 0).toLocaleString()} kg</span></span>
                    <span class="history-stat">Sets: <span>${wo.totalSets || 0}</span></span>
                    <span class="history-stat">Time: <span>${wo.duration || 0}m</span></span>
                </div>
            </div>`;
        }).join('');
    }

    // ─── REAL Intelligence ───
    updateIntel() {
        const all = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
        const now = Date.now();
        const weekAgo = now - 7 * 86400000;
        const monthAgo = now - 30 * 86400000;

        // Weekly volume
        let weekVol = 0, lastWeekVol = 0;
        let monthSessions = 0, totalEx = 0;
        all.forEach(wo => {
            const t = new Date(wo.startTime).getTime();
            if (t > weekAgo) weekVol += wo.totalVolume || 0;
            if (t > weekAgo - 7 * 86400000 && t <= weekAgo) lastWeekVol += wo.totalVolume || 0;
            if (t > monthAgo) monthSessions++;
            totalEx += (wo.exercises || []).filter(e => e.completed && !e.skipped).length;
        });

        // Streak
        const streak = this.getStreak(all);

        // Performance (based on volume trend)
        let perf = 0;
        if (all.length > 0) {
            perf = Math.min(100, Math.round((weekVol / (lastWeekVol || weekVol || 1)) * 70 + streak * 3));
        }

        // Consistency (sessions per week target = 5)
        const weeksTracked = Math.max(1, Math.ceil((now - new Date(all[0]?.startTime || now).getTime()) / (7 * 86400000)));
        const avgPerWeek = all.length / weeksTracked;
        const cons = Math.min(100, Math.round((avgPerWeek / 5) * 100));

        // Recovery (inverse of recent frequency - rest days)
        const last3Days = all.filter(wo => new Date(wo.startTime).getTime() > now - 3 * 86400000).length;
        const rec = last3Days >= 3 ? 30 : last3Days === 2 ? 55 : last3Days === 1 ? 80 : 100;

        // Animate values
        this.animateVal('intel-vol', weekVol);
        this.animateVal('intel-sessions', monthSessions);
        this.animateVal('intel-excount', totalEx);
        this.animateVal('intel-streak', streak);

        // Animate rings
        this.animateRing('perfRing', perf, 'perfNum');
        this.animateRing('consRing', cons, 'consNum');
        this.animateRing('recRing', rec, 'recNum');

        // Trends
        const volDiff = weekVol - lastWeekVol;
        const volTrend = document.getElementById('volTrend');
        if (volTrend) {
            if (all.length === 0) volTrend.textContent = 'No data';
            else if (volDiff > 0) volTrend.textContent = '+' + Math.round(volDiff).toLocaleString() + ' kg';
            else if (volDiff < 0) volTrend.textContent = Math.round(volDiff).toLocaleString() + ' kg';
            else volTrend.textContent = 'Stable';
        }

        const sesTrend = document.getElementById('sesTrend');
        if (sesTrend) {
            if (all.length === 0) sesTrend.textContent = 'No data';
            else sesTrend.textContent = avgPerWeek.toFixed(1) + '/week';
        }
    }

    animateRing(ringId, val, numId) {
        const el = document.getElementById(ringId);
        if (!el) return;
        const ring = el.querySelector('.cprog-ring');
        const numEl = document.getElementById(numId);
        const circ = 2 * Math.PI * 40;
        const offset = circ - (val / 100) * circ;
        ring.style.strokeDasharray = circ;
        ring.style.strokeDashoffset = circ;
        el.dataset.val = val;

        setTimeout(() => {
            ring.style.strokeDashoffset = offset;
            // Animate number
            const start = performance.now();
            const tick = (now) => {
                const p = Math.min((now - start) / 1500, 1);
                numEl.textContent = Math.round(val * (1 - Math.pow(1 - p, 3)));
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }, 300);
    }

    animateVal(id, target) {
        const el = document.getElementById(id);
        if (!el) return;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / 1200, 1);
            const e = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * e).toLocaleString();
            if (p < 1) requestAnimationFrame(tick);
        };
        setTimeout(() => requestAnimationFrame(tick), 400);
    }

    getStreak(all) {
        if (all.length === 0) return 0;
        const dates = [...new Set(all.map(w => new Date(w.startTime).toDateString()))]
            .sort((a, b) => new Date(b) - new Date(a));
        let streak = 1;
        for (let i = 0; i < dates.length - 1; i++) {
            if ((new Date(dates[i]) - new Date(dates[i + 1])) / 86400000 <= 1.5) streak++;
            else break;
        }
        return streak;
    }

    // ─── Chart ───
    drawChart() {
        const canvas = document.getElementById('volChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        const w = rect.width, h = rect.height;
        const pad = { t: 20, r: 15, b: 30, l: 45 };
        const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;

        const wd = this.getChartData();
        if (wd.values.length < 2) {
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = '13px Space Grotesk';
            ctx.textAlign = 'center';
            ctx.fillText('Complete workouts to see trends', w / 2, h / 2);
            return;
        }

        const data = wd.values, labels = wd.labels;
        const mx = Math.max(...data) * 1.15 || 100;
        const xS = (i) => pad.l + (i / (data.length - 1)) * cw;
        const yS = (v) => pad.t + ch - (v / mx) * ch;

        const draw = (progress) => {
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 4; i++) {
                const y = pad.t + (i / 4) * ch;
                ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.font = '10px JetBrains Mono';
                ctx.textAlign = 'right';
                ctx.fillText(Math.round(mx - (i / 4) * mx).toLocaleString(), pad.l - 8, y + 4);
            }
            ctx.textAlign = 'center';
            labels.forEach((l, i) => { ctx.fillText(l, xS(i), h - 8); });

            const len = Math.floor(data.length * progress);
            if (len < 1) return;

            const grad = ctx.createLinearGradient(0, pad.t, 0, h - pad.b);
            grad.addColorStop(0, 'rgba(0,212,255,0.3)');
            grad.addColorStop(1, 'rgba(0,212,255,0)');
            ctx.beginPath();
            ctx.moveTo(xS(0), h - pad.b);
            for (let i = 0; i <= Math.min(len, data.length - 1); i++) ctx.lineTo(xS(i), yS(data[i]));
            ctx.lineTo(xS(Math.min(len, data.length - 1)), h - pad.b);
            ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

            ctx.shadowColor = 'rgba(0,212,255,0.5)';
            ctx.shadowBlur = 15;
            ctx.beginPath(); ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 3;
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            for (let i = 0; i <= Math.min(len, data.length - 1); i++) {
                if (i === 0) ctx.moveTo(xS(i), yS(data[i]));
                else ctx.lineTo(xS(i), yS(data[i]));
            }
            ctx.stroke(); ctx.shadowBlur = 0;

            for (let i = 0; i <= Math.min(len, data.length - 1); i++) {
                const x = xS(i), y = yS(data[i]);
                ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,212,255,0.2)'; ctx.fill();
                ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = '#00d4ff'; ctx.fill();
                ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
            }
        };

        const st = performance.now();
        const anim = (now) => {
            draw(1 - Math.pow(1 - Math.min((now - st) / 1500, 1), 3));
            if ((now - st) < 1500) requestAnimationFrame(anim);
        };
        requestAnimationFrame(anim);
    }

    getChartData() {
        const all = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
        const weeks = {};
        all.forEach(wo => {
            const d = new Date(wo.startTime);
            const ws = new Date(d); ws.setDate(d.getDate() - d.getDay());
            const key = ws.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            weeks[key] = (weeks[key] || 0) + (wo.totalVolume || 0);
        });
        return { labels: Object.keys(weeks), values: Object.values(weeks).map(v => Math.round(v)) };
    }

    // ─── Utilities ───
    vib(ms) { if ('vibrate' in navigator) navigator.vibrate(ms); }
}

const app = new IronPump();
