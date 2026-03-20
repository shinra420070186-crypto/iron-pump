// ═══════════════════════════════════════════════════════════
// IRON PUMP — Elite Training System
// ═══════════════════════════════════════════════════════════

// Training Program - Customize your days here
const PROGRAM = [
    {
        id: 'day1',
        name: 'Day 1',
        label: 'Push',
        exercises: [
            { name: 'Bench Press', muscle: 'Chest' },
            { name: 'Incline Dumbbell Press', muscle: 'Upper Chest' },
            { name: 'Overhead Press', muscle: 'Shoulders' },
            { name: 'Lateral Raise', muscle: 'Side Delts' },
            { name: 'Tricep Pushdown', muscle: 'Triceps' },
            { name: 'Overhead Tricep Extension', muscle: 'Triceps' }
        ]
    },
    {
        id: 'day2',
        name: 'Day 2',
        label: 'Pull',
        exercises: [
            { name: 'Barbell Row', muscle: 'Back' },
            { name: 'Pull Ups', muscle: 'Lats' },
            { name: 'Seated Cable Row', muscle: 'Mid Back' },
            { name: 'Face Pulls', muscle: 'Rear Delts' },
            { name: 'Barbell Curl', muscle: 'Biceps' },
            { name: 'Hammer Curl', muscle: 'Biceps' }
        ]
    },
    {
        id: 'day3',
        name: 'Day 3',
        label: 'Legs',
        exercises: [
            { name: 'Squat', muscle: 'Quads' },
            { name: 'Romanian Deadlift', muscle: 'Hamstrings' },
            { name: 'Leg Press', muscle: 'Quads' },
            { name: 'Leg Curl', muscle: 'Hamstrings' },
            { name: 'Leg Extension', muscle: 'Quads' },
            { name: 'Calf Raises', muscle: 'Calves' }
        ]
    },
    {
        id: 'day4',
        name: 'Day 4',
        label: 'Upper',
        exercises: [
            { name: 'Incline Bench Press', muscle: 'Upper Chest' },
            { name: 'Dumbbell Row', muscle: 'Back' },
            { name: 'Dumbbell Shoulder Press', muscle: 'Shoulders' },
            { name: 'Lat Pulldown', muscle: 'Lats' },
            { name: 'Cable Flyes', muscle: 'Chest' },
            { name: 'Reverse Flyes', muscle: 'Rear Delts' }
        ]
    },
    {
        id: 'day5',
        name: 'Day 5',
        label: 'Lower',
        exercises: [
            { name: 'Deadlift', muscle: 'Full Body' },
            { name: 'Front Squat', muscle: 'Quads' },
            { name: 'Hip Thrust', muscle: 'Glutes' },
            { name: 'Bulgarian Split Squat', muscle: 'Quads' },
            { name: 'Leg Curl', muscle: 'Hamstrings' },
            { name: 'Calf Raises', muscle: 'Calves' }
        ]
    },
    {
        id: 'day6',
        name: 'Day 6',
        label: 'Arms & Shoulders',
        exercises: [
            { name: 'Arnold Press', muscle: 'Shoulders' },
            { name: 'Lateral Raise', muscle: 'Side Delts' },
            { name: 'Close Grip Bench Press', muscle: 'Triceps' },
            { name: 'Preacher Curl', muscle: 'Biceps' },
            { name: 'Skull Crushers', muscle: 'Triceps' },
            { name: 'Cable Curl', muscle: 'Biceps' }
        ]
    }
];

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════

class IronPump {
    constructor() {
        this.currentWorkout = null;
        this.currentExerciseIndex = 0;
        this.timerInterval = null;
        this.restInterval = null;
        this.restDuration = 120;
        this.restRemaining = 0;
        this.startTime = null;
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
        this.setupRestTimer();
        this.setupComplete();
        this.loadHistory();
        this.updateIntel();
    }

    // ─────────────────────────────────────
    // Loading
    // ─────────────────────────────────────
    setupLoading() {
        setTimeout(() => {
            document.getElementById('loader').classList.add('hidden');
            document.getElementById('app').classList.add('loaded');
            setTimeout(() => {
                this.animateProgress();
                this.animateCounters();
                this.drawChart();
            }, 300);
        }, 2000);
    }

    // ─────────────────────────────────────
    // Navigation
    // ─────────────────────────────────────
    setupNav() {
        document.querySelectorAll('.bnav').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                document.querySelectorAll('.bnav').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('page-' + page).classList.add('active');

                if (page === 'intel') {
                    this.updateIntel();
                    this.animateProgress();
                    this.drawChart();
                }
                if (page === 'history') this.loadHistory();
                this.vibrate(10);
            });
        });
    }

    // ─────────────────────────────────────
    // Progress Animation
    // ─────────────────────────────────────
    animateProgress() {
        document.querySelectorAll('.cprog').forEach(el => {
            const val = parseInt(el.dataset.val) || 0;
            const ring = el.querySelector('.cprog-ring');
            const circ = 2 * Math.PI * 40;
            const offset = circ - (val / 100) * circ;
            ring.style.strokeDasharray = circ;
            ring.style.strokeDashoffset = circ;
            setTimeout(() => { ring.style.strokeDashoffset = offset; }, 300);
        });
    }

    // ─────────────────────────────────────
    // Counter Animation
    // ─────────────────────────────────────
    animateCounters() {
        const targets = {
            'intel-vol': this.getWeeklyVolume(),
            'intel-sessions': this.getMonthSessions(),
            'intel-prs': 0,
            'intel-streak': this.getStreak()
        };
        Object.keys(targets).forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const target = targets[id];
            const start = performance.now();
            const tick = (now) => {
                const p = Math.min((now - start) / 1500, 1);
                const e = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * e).toLocaleString();
                if (p < 1) requestAnimationFrame(tick);
            };
            setTimeout(() => requestAnimationFrame(tick), 500);
        });
    }

    // ─────────────────────────────────────
    // Chart
    // ─────────────────────────────────────
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

        const wd = this.getWeeklyChartData();
        if (wd.values.length < 2) {
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = '14px Space Grotesk';
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
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.shadowColor = 'rgba(0,212,255,0.5)';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            for (let i = 0; i <= Math.min(len, data.length - 1); i++) {
                if (i === 0) ctx.moveTo(xS(i), yS(data[i]));
                else ctx.lineTo(xS(i), yS(data[i]));
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            for (let i = 0; i <= Math.min(len, data.length - 1); i++) {
                const x = xS(i), y = yS(data[i]);
                ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,212,255,0.2)'; ctx.fill();
                ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = '#00d4ff'; ctx.fill();
                ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
            }
        };

        const st = performance.now();
        const anim = (now) => {
            const p = Math.min((now - st) / 1500, 1);
            draw(1 - Math.pow(1 - p, 3));
            if (p < 1) requestAnimationFrame(anim);
        };
        requestAnimationFrame(anim);
    }

    // ─────────────────────────────────────
    // Day Selection
    // ─────────────────────────────────────
    renderDays() {
        const grid = document.getElementById('dayGrid');
        if (!grid) return;
        grid.innerHTML = PROGRAM.map(day => `
            <button class="day-btn" data-day="${day.id}">
                <span class="day-num">${day.name}</span>
                <span class="day-label">${day.label}</span>
                <span class="day-count">${day.exercises.length} exercises</span>
            </button>
        `).join('');

        grid.addEventListener('click', (e) => {
            const btn = e.target.closest('.day-btn');
            if (!btn) return;
            this.startWorkout(btn.dataset.day);
        });
    }

    // ─────────────────────────────────────
    // Start Workout
    // ─────────────────────────────────────
    startWorkout(dayId) {
        const day = PROGRAM.find(d => d.id === dayId);
        if (!day) return;

        this.currentWorkout = {
            dayId: dayId,
            dayName: day.name,
            dayLabel: day.label,
            splitName: day.name + ' — ' + day.label,
            exercises: day.exercises.map(ex => ({
                name: ex.name,
                muscle: ex.muscle,
                sets: [],
                skipped: false,
                completed: false
            })),
            startTime: new Date().toISOString(),
            totalVolume: 0,
            totalSets: 0
        };

        this.currentExerciseIndex = 0;
        this.startTime = Date.now();
        this.startTimer();

        document.getElementById('woInactive').classList.add('hidden');
        document.getElementById('woActive').classList.remove('hidden');

        this.renderCurrentExercise();
        this.updateWorkoutHeader();
        this.updateLiveStats();
        this.vibrate(20);
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const min = Math.floor(elapsed / 60000);
            const sec = Math.floor((elapsed % 60000) / 1000);
            document.getElementById('woTimer').textContent =
                min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
        }, 1000);
    }

    updateWorkoutHeader() {
        const wo = this.currentWorkout;
        document.getElementById('woSplit').textContent = wo.dayName + ' — ' + wo.dayLabel;

        // Progress indicator
        const total = wo.exercises.length;
        const done = wo.exercises.filter(e => e.completed || e.skipped).length;
        document.getElementById('woProgress').textContent = `${done}/${total}`;
    }

    // ─────────────────────────────────────
    // Current Exercise View
    // ─────────────────────────────────────
    renderCurrentExercise() {
        const container = document.getElementById('exContainer');
        const wo = this.currentWorkout;

        if (this.currentExerciseIndex >= wo.exercises.length) {
            this.finishWorkout();
            return;
        }

        const ex = wo.exercises[this.currentExerciseIndex];
        const exNum = this.currentExerciseIndex + 1;
        const exTotal = wo.exercises.length;
        const hasData = ex.sets.some(s => parseFloat(s.weight) > 0 && parseFloat(s.reps) > 0);

        // Build sets HTML
        let setsHtml = '';
        if (ex.sets.length === 0) {
            setsHtml = '<p class="no-sets">Tap "Add Set" to begin</p>';
        } else {
            setsHtml = ex.sets.map((set, si) => `
                <div class="set-row" style="animation: fadeUp 0.3s ease ${si * 0.05}s both">
                    <span class="set-num">${si + 1}</span>
                    <input type="number" class="set-input" placeholder="kg"
                        value="${set.weight}" data-si="${si}" data-field="weight"
                        inputmode="decimal">
                    <input type="number" class="set-input" placeholder="reps"
                        value="${set.reps}" data-si="${si}" data-field="reps"
                        inputmode="numeric">
                    <button class="set-del" data-si="${si}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            `).join('');
        }

        // Skip button logic
        let skipHtml = '';
        if (!hasData) {
            skipHtml = `
                <button class="skip-btn skip-exercise" id="skipBtn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 4 15 12 5 20 5 4"/>
                        <line x1="19" y1="5" x2="19" y2="19"/>
                    </svg>
                    Skip Exercise
                </button>`;
        } else {
            skipHtml = `
                <button class="skip-btn skip-set" id="skipBtn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 4 15 12 5 20 5 4"/>
                        <line x1="19" y1="5" x2="19" y2="19"/>
                    </svg>
                    Skip Set
                </button>`;
        }

        container.innerHTML = `
            <div class="current-ex" style="animation: fadeUp 0.4s ease">
                <div class="ex-progress-bar">
                    <div class="ex-progress-fill" style="width: ${(exNum / exTotal) * 100}%"></div>
                </div>
                <div class="ex-counter">${exNum} of ${exTotal}</div>
                <div class="ex-title-section">
                    <h3 class="ex-title">${ex.name}</h3>
                    <span class="ex-muscle">${ex.muscle}</span>
                </div>
                <div class="sets-list">${setsHtml}</div>
                <div class="ex-actions">
                    <button class="add-set-btn" id="addSetBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add Set
                    </button>
                    ${skipHtml}
                    ${hasData ? `
                    <button class="finish-ex-btn" id="finishExBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 11 12 14 22 4"/>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                        </svg>
                        Finish Exercise
                    </button>` : ''}
                </div>
            </div>
        `;

        // Event Listeners
        // Add Set
        document.getElementById('addSetBtn').addEventListener('click', () => {
            ex.sets.push({ weight: '', reps: '' });
            this.renderCurrentExercise();
            this.vibrate(10);
        });

        // Skip Button
        document.getElementById('skipBtn').addEventListener('click', () => {
            if (!hasData) {
                // Skip entire exercise
                ex.skipped = true;
                ex.completed = true;
                this.currentExerciseIndex++;
                this.updateWorkoutHeader();
                this.renderCurrentExercise();
                this.vibrate(15);
            } else {
                // Skip adding more sets, keep current data
                ex.completed = true;
                this.currentExerciseIndex++;
                this.updateWorkoutHeader();
                this.updateLiveStats();
                this.renderCurrentExercise();
                this.startRest();
                this.vibrate(15);
            }
        });

        // Finish Exercise
        const finishExBtn = document.getElementById('finishExBtn');
        if (finishExBtn) {
            finishExBtn.addEventListener('click', () => {
                ex.completed = true;
                this.currentExerciseIndex++;
                this.updateWorkoutHeader();
                this.updateLiveStats();
                this.renderCurrentExercise();
                this.startRest();
                this.vibrate(20);
            });
        }

        // Set Inputs
        container.querySelectorAll('.set-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const si = parseInt(e.target.dataset.si);
                const field = e.target.dataset.field;
                ex.sets[si][field] = e.target.value;
                this.updateLiveStats();
                this.renderCurrentExercise();
            });
            input.addEventListener('focus', () => {
                input.select();
            });
        });

        // Delete Set
        container.querySelectorAll('.set-del').forEach(btn => {
            btn.addEventListener('click', () => {
                const si = parseInt(btn.dataset.si);
                ex.sets.splice(si, 1);
                this.renderCurrentExercise();
                this.updateLiveStats();
                this.vibrate(10);
            });
        });
    }

    updateLiveStats() {
        if (!this.currentWorkout) return;
        let vol = 0, sets = 0;
        this.currentWorkout.exercises.forEach(ex => {
            ex.sets.forEach(set => {
                const w = parseFloat(set.weight);
                const r = parseFloat(set.reps);
                if (w > 0 && r > 0) { vol += w * r; sets++; }
            });
        });
        document.getElementById('liveVol').textContent = Math.round(vol).toLocaleString();
        document.getElementById('liveSets').textContent = sets;
        document.getElementById('liveEx').textContent =
            this.currentWorkout.exercises.filter(e => e.completed && !e.skipped).length;
        this.currentWorkout.totalVolume = vol;
        this.currentWorkout.totalSets = sets;
    }

    // ─────────────────────────────────────
    // Rest Timer
    // ─────────────────────────────────────
    setupRestTimer() {
        document.getElementById('restSkip').addEventListener('click', () => this.stopRest());
        document.getElementById('restAdd30').addEventListener('click', () => {
            this.restRemaining += 30;
            this.vibrate(10);
        });
    }

    startRest() {
        this.restRemaining = this.restDuration;
        const total = this.restDuration;
        document.getElementById('restOverlay').classList.remove('hidden');
        this.updateRestDisplay(total);
        if (this.restInterval) clearInterval(this.restInterval);
        this.restInterval = setInterval(() => {
            this.restRemaining--;
            this.updateRestDisplay(total);
            if (this.restRemaining <= 0) { this.stopRest(); this.vibrate(50); }
        }, 1000);
    }

    updateRestDisplay(total) {
        const min = Math.floor(this.restRemaining / 60);
        const sec = this.restRemaining % 60;
        document.getElementById('restTime').textContent = min + ':' + sec.toString().padStart(2, '0');
        const circ = 2 * Math.PI * 90;
        const offset = circ - (this.restRemaining / total) * circ;
        const ring = document.getElementById('restRingFill');
        ring.style.strokeDasharray = circ;
        ring.style.strokeDashoffset = offset;
    }

    stopRest() {
        if (this.restInterval) clearInterval(this.restInterval);
        document.getElementById('restOverlay').classList.add('hidden');
    }

    // ─────────────────────────────────────
    // Finish Workout
    // ─────────────────────────────────────
    setupComplete() {
        document.getElementById('compClose').addEventListener('click', () => {
            document.getElementById('completeOverlay').classList.add('hidden');
        });
    }

    finishWorkout() {
        if (!this.currentWorkout) return;
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.stopRest();

        const duration = Math.round((Date.now() - this.startTime) / 60000);
        this.currentWorkout.endTime = new Date().toISOString();
        this.currentWorkout.duration = duration;
        this.updateLiveStats();

        // Only save if there's actual data
        if (this.currentWorkout.totalSets > 0) {
            const workouts = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
            workouts.push(this.currentWorkout);
            localStorage.setItem('ironpump_workouts', JSON.stringify(workouts));
        }

        // Show complete
        document.getElementById('compVol').textContent = Math.round(this.currentWorkout.totalVolume).toLocaleString();
        document.getElementById('compSets').textContent = this.currentWorkout.totalSets;
        document.getElementById('compTime').textContent = duration;
        document.getElementById('completeOverlay').classList.remove('hidden');

        // Reset
        document.getElementById('woActive').classList.add('hidden');
        document.getElementById('woInactive').classList.remove('hidden');
        document.getElementById('exContainer').innerHTML = '';
        document.getElementById('liveVol').textContent = '0';
        document.getElementById('liveSets').textContent = '0';
        document.getElementById('liveEx').textContent = '0';
        document.getElementById('woTimer').textContent = '00:00';
        this.currentWorkout = null;
        this.vibrate(30);
    }

    // ─────────────────────────────────────
    // History
    // ─────────────────────────────────────
    loadHistory() {
        const workouts = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
        const list = document.getElementById('historyList');
        if (workouts.length === 0) {
            list.innerHTML = '<div class="no-history"><p>No workouts yet.</p><p>Complete your first session!</p></div>';
            return;
        }
        list.innerHTML = workouts.slice().reverse().map(wo => {
            const date = new Date(wo.startTime);
            const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            return `
                <div class="history-card">
                    <div class="history-top">
                        <span class="history-split">${wo.splitName || wo.dayName + ' — ' + wo.dayLabel}</span>
                        <span class="history-date">${dateStr}</span>
                    </div>
                    <div class="history-stats">
                        <span class="history-stat">Vol: <span>${Math.round(wo.totalVolume || 0).toLocaleString()} kg</span></span>
                        <span class="history-stat">Sets: <span>${wo.totalSets || 0}</span></span>
                        <span class="history-stat">Time: <span>${wo.duration || 0} min</span></span>
                    </div>
                </div>`;
        }).join('');
    }

    // ─────────────────────────────────────
    // Intel Data
    // ─────────────────────────────────────
    updateIntel() {
        document.getElementById('intel-vol').textContent = Math.round(this.getWeeklyVolume()).toLocaleString();
        document.getElementById('intel-sessions').textContent = this.getMonthSessions();
        document.getElementById('intel-streak').textContent = this.getStreak();
    }

    getWeeklyVolume() {
        const workouts = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return workouts.reduce((sum, wo) => {
            return new Date(wo.startTime).getTime() > weekAgo ? sum + (wo.totalVolume || 0) : sum;
        }, 0);
    }

    getMonthSessions() {
        const workouts = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
        const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return workouts.filter(wo => new Date(wo.startTime).getTime() > monthAgo).length;
    }

    getStreak() {
        const workouts = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
        if (workouts.length === 0) return 0;
        const dates = [...new Set(workouts.map(wo => new Date(wo.startTime).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
        let streak = 1;
        for (let i = 0; i < dates.length - 1; i++) {
            if ((new Date(dates[i]) - new Date(dates[i + 1])) / 86400000 <= 1.5) streak++;
            else break;
        }
        return streak;
    }

    getWeeklyChartData() {
        const workouts = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
        const weeks = {};
        workouts.forEach(wo => {
            const d = new Date(wo.startTime);
            const ws = new Date(d); ws.setDate(d.getDate() - d.getDay());
            const key = ws.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            weeks[key] = (weeks[key] || 0) + (wo.totalVolume || 0);
        });
        return { labels: Object.keys(weeks), values: Object.values(weeks).map(v => Math.round(v)) };
    }

    vibrate(ms = 10) {
        if ('vibrate' in navigator) navigator.vibrate(ms);
    }
}

const app = new IronPump();
