// ═══════════════════════════════════════════════════════════
// IRON PUMP — Elite Training System
// Complete Application
// ═══════════════════════════════════════════════════════════

// Exercise Database
const EXERCISES = {
    chest: [
        'Bench Press', 'Incline Bench Press', 'Decline Bench Press',
        'Dumbbell Bench Press', 'Incline Dumbbell Press',
        'Cable Flyes', 'Pec Deck', 'Push Ups',
        'Chest Dips', 'Machine Chest Press'
    ],
    back: [
        'Deadlift', 'Barbell Row', 'Pull Ups', 'Chin Ups',
        'Lat Pulldown', 'Seated Cable Row', 'T-Bar Row',
        'Dumbbell Row', 'Face Pulls', 'Straight Arm Pulldown'
    ],
    shoulders: [
        'Overhead Press', 'Dumbbell Shoulder Press', 'Lateral Raise',
        'Front Raise', 'Reverse Flyes', 'Arnold Press',
        'Cable Lateral Raise', 'Upright Row', 'Shrugs'
    ],
    legs: [
        'Squat', 'Front Squat', 'Leg Press', 'Hack Squat',
        'Romanian Deadlift', 'Leg Curl', 'Leg Extension',
        'Bulgarian Split Squat', 'Lunges', 'Calf Raises',
        'Hip Thrust', 'Goblet Squat', 'Sumo Deadlift'
    ],
    arms: [
        'Barbell Curl', 'Dumbbell Curl', 'Hammer Curl',
        'Preacher Curl', 'Cable Curl', 'Tricep Pushdown',
        'Skull Crushers', 'Overhead Tricep Extension',
        'Dips', 'Close Grip Bench Press'
    ],
    core: [
        'Plank', 'Hanging Leg Raise', 'Cable Crunch',
        'Ab Wheel Rollout', 'Russian Twist', 'Decline Sit Up'
    ]
};

// Split configurations
const SPLITS = [
    { id: 'push', name: 'Push', emoji: '⬆️' },
    { id: 'pull', name: 'Pull', emoji: '⬇️' },
    { id: 'legs', name: 'Legs', emoji: '🦵' },
    { id: 'upper', name: 'Upper', emoji: '💪' },
    { id: 'lower', name: 'Lower', emoji: '🏋️' },
    { id: 'full', name: 'Full Body', emoji: '🔥' },
    { id: 'chest', name: 'Chest', emoji: '🫁' },
    { id: 'back', name: 'Back', emoji: '🔙' },
    { id: 'arms', name: 'Arms', emoji: '💪' }
];

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════

class IronPump {
    constructor() {
        this.currentWorkout = null;
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
        this.renderSplits();
        this.setupExecute();
        this.setupModal();
        this.setupRestTimer();
        this.setupComplete();
        this.loadHistory();
        this.updateIntel();
    }

    // ─────────────────────────────────────
    // Loading Screen
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
        const btns = document.querySelectorAll('.bnav');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;

                // Update buttons
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update pages
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('page-' + page).classList.add('active');

                // Refresh data when switching
                if (page === 'intel') {
                    this.updateIntel();
                    this.animateProgress();
                    this.drawChart();
                }
                if (page === 'history') {
                    this.loadHistory();
                }

                this.vibrate(10);
            });
        });
    }

    // ─────────────────────────────────────
    // Circular Progress Animation
    // ─────────────────────────────────────
    animateProgress() {
        document.querySelectorAll('.cprog').forEach(el => {
            const val = parseInt(el.dataset.val) || 0;
            const ring = el.querySelector('.cprog-ring');
            const circ = 2 * Math.PI * 40; // r=40
            const offset = circ - (val / 100) * circ;

            ring.style.strokeDasharray = circ;
            ring.style.strokeDashoffset = circ;

            setTimeout(() => {
                ring.style.strokeDashoffset = offset;
            }, 300);
        });
    }

    // ─────────────────────────────────────
    // Counter Animation
    // ─────────────────────────────────────
    animateCounters() {
        const counters = {
            'intel-vol': this.getWeeklyVolume(),
            'intel-sessions': this.getMonthSessions(),
            'intel-prs': 0,
            'intel-streak': this.getStreak()
        };

        Object.keys(counters).forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const target = counters[id];
            const duration = 1500;
            const start = performance.now();

            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased).toLocaleString();
                if (progress < 1) requestAnimationFrame(tick);
            };

            setTimeout(() => requestAnimationFrame(tick), 500);
        });
    }

    // ─────────────────────────────────────
    // Chart Drawing
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

        const w = rect.width;
        const h = rect.height;
        const pad = { t: 20, r: 15, b: 30, l: 45 };
        const cw = w - pad.l - pad.r;
        const ch = h - pad.t - pad.b;

        // Get real data from saved workouts
        const weeklyData = this.getWeeklyChartData();
        const data = weeklyData.values;
        const labels = weeklyData.labels;

        if (data.length < 2) {
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = '14px Space Grotesk';
            ctx.textAlign = 'center';
            ctx.fillText('Complete workouts to see chart data', w / 2, h / 2);
            return;
        }

        const maxVal = Math.max(...data) * 1.15 || 100;
        const minVal = 0;
        const range = maxVal - minVal;

        const xS = (i) => pad.l + (i / (data.length - 1)) * cw;
        const yS = (v) => pad.t + ch - ((v - minVal) / range) * ch;

        const draw = (progress) => {
            ctx.clearRect(0, 0, w, h);

            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 4; i++) {
                const y = pad.t + (i / 4) * ch;
                ctx.beginPath();
                ctx.moveTo(pad.l, y);
                ctx.lineTo(w - pad.r, y);
                ctx.stroke();

                const val = maxVal - (i / 4) * range;
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.font = '10px JetBrains Mono';
                ctx.textAlign = 'right';
                ctx.fillText(Math.round(val).toLocaleString(), pad.l - 8, y + 4);
            }

            // Labels
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            labels.forEach((l, i) => {
                ctx.fillText(l, xS(i), h - 8);
            });

            const len = Math.floor(data.length * progress);
            if (len < 1) return;

            // Gradient fill
            const grad = ctx.createLinearGradient(0, pad.t, 0, h - pad.b);
            grad.addColorStop(0, 'rgba(0,212,255,0.3)');
            grad.addColorStop(1, 'rgba(0,212,255,0)');

            ctx.beginPath();
            ctx.moveTo(xS(0), h - pad.b);
            for (let i = 0; i <= Math.min(len, data.length - 1); i++) {
                ctx.lineTo(xS(i), yS(data[i]));
            }
            ctx.lineTo(xS(Math.min(len, data.length - 1)), h - pad.b);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();

            // Line
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

            // Points
            for (let i = 0; i <= Math.min(len, data.length - 1); i++) {
                const x = xS(i);
                const y = yS(data[i]);

                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0,212,255,0.2)';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#00d4ff';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
            }
        };

        // Animate
        const startTime = performance.now();
        const animate = (now) => {
            const p = Math.min((now - startTime) / 1500, 1);
            const ep = 1 - Math.pow(1 - p, 3);
            draw(ep);
            if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    // ─────────────────────────────────────
    // Execute - Split Selection
    // ─────────────────────────────────────
    renderSplits() {
        const grid = document.getElementById('splitGrid');
        if (!grid) return;
        grid.innerHTML = SPLITS.map(s => `
            <button class="split-btn" data-split="${s.id}">
                <span class="split-emoji">${s.emoji}</span>
                <span class="split-name">${s.name}</span>
            </button>
        `).join('');
    }

    setupExecute() {
        // Split selection
        document.getElementById('splitGrid').addEventListener('click', (e) => {
            const btn = e.target.closest('.split-btn');
            if (!btn) return;
            this.startWorkout(btn.dataset.split);
        });

        // Add exercise
        document.getElementById('addExBtn').addEventListener('click', () => {
            this.openExerciseModal();
        });

        // Finish workout
        document.getElementById('woFinish').addEventListener('click', () => {
            this.finishWorkout();
        });
    }

    startWorkout(splitId) {
        const split = SPLITS.find(s => s.id === splitId);
        this.currentWorkout = {
            split: splitId,
            splitName: split.name,
            exercises: [],
            startTime: new Date().toISOString(),
            totalVolume: 0,
            totalSets: 0
        };

        this.startTime = Date.now();
        this.startTimer();

        document.getElementById('woSplit').textContent = split.emoji + ' ' + split.name;
        document.getElementById('woInactive').classList.add('hidden');
        document.getElementById('woActive').classList.remove('hidden');

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

    // ─────────────────────────────────────
    // Exercise Modal
    // ─────────────────────────────────────
    setupModal() {
        const overlay = document.getElementById('exModal');
        const search = document.getElementById('exSearch');

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeModal();
        });

        search.addEventListener('input', () => {
            this.filterExercises(search.value);
        });
    }

    openExerciseModal() {
        const modal = document.getElementById('exModal');
        const search = document.getElementById('exSearch');
        modal.classList.remove('hidden');
        search.value = '';
        this.filterExercises('');
        setTimeout(() => search.focus(), 300);
        this.vibrate(10);
    }

    closeModal() {
        document.getElementById('exModal').classList.add('hidden');
    }

    filterExercises(query) {
        const results = document.getElementById('exResults');
        const q = query.toLowerCase().trim();
        let html = '';

        Object.keys(EXERCISES).forEach(cat => {
            const filtered = EXERCISES[cat].filter(ex =>
                ex.toLowerCase().includes(q)
            );

            if (filtered.length > 0) {
                html += `<div class="ex-cat">${cat}</div>`;
                filtered.forEach(ex => {
                    html += `<div class="ex-result" data-name="${ex}" data-cat="${cat}">
                        <span>${ex}</span>
                        <span class="ex-result-muscle">${cat}</span>
                    </div>`;
                });
            }
        });

        if (html === '') {
            html = '<p style="text-align:center;color:var(--text3);padding:20px">No exercises found</p>';
        }

        results.innerHTML = html;

        // Add click handlers
        results.querySelectorAll('.ex-result').forEach(item => {
            item.addEventListener('click', () => {
                this.addExercise(item.dataset.name, item.dataset.cat);
                this.closeModal();
            });
        });
    }

    // ─────────────────────────────────────
    // Exercise Management
    // ─────────────────────────────────────
    addExercise(name, category) {
        const exercise = {
            id: Date.now(),
            name: name,
            category: category,
            sets: [{ weight: '', reps: '' }]
        };

        this.currentWorkout.exercises.push(exercise);
        this.renderExercises();
        this.updateLiveStats();
        this.vibrate(15);
    }

    renderExercises() {
        const list = document.getElementById('exList');
        list.innerHTML = '';

        this.currentWorkout.exercises.forEach((ex, ei) => {
            const card = document.createElement('div');
            card.className = 'ex-card';

            let setsHtml = '';
            if (ex.sets.length === 0) {
                setsHtml = '<p class="no-sets">No sets yet</p>';
            } else {
                setsHtml = ex.sets.map((set, si) => `
                    <div class="set-row">
                        <span class="set-num">${si + 1}</span>
                        <input type="number" class="set-input" placeholder="kg" 
                            value="${set.weight}" 
                            data-ei="${ei}" data-si="${si}" data-field="weight"
                            inputmode="decimal">
                        <input type="number" class="set-input" placeholder="reps" 
                            value="${set.reps}" 
                            data-ei="${ei}" data-si="${si}" data-field="reps"
                            inputmode="numeric">
                        <button class="set-del" data-ei="${ei}" data-si="${si}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                `).join('');
            }

            card.innerHTML = `
                <div class="ex-head">
                    <span class="ex-name">${ex.name}</span>
                    <button class="ex-del" data-ei="${ei}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
                <div class="sets-list">${setsHtml}</div>
                <button class="add-set" data-ei="${ei}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Set
                </button>
            `;

            list.appendChild(card);

            // Event listeners for this card
            // Set inputs
            card.querySelectorAll('.set-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const ei2 = parseInt(e.target.dataset.ei);
                    const si = parseInt(e.target.dataset.si);
                    const field = e.target.dataset.field;
                    this.currentWorkout.exercises[ei2].sets[si][field] = e.target.value;
                    this.updateLiveStats();
                });
            });

            // Delete set
            card.querySelectorAll('.set-del').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const ei2 = parseInt(btn.dataset.ei);
                    const si = parseInt(btn.dataset.si);
                    this.currentWorkout.exercises[ei2].sets.splice(si, 1);
                    this.renderExercises();
                    this.updateLiveStats();
                    this.vibrate(10);
                });
            });

            // Add set
            card.querySelector('.add-set').addEventListener('click', () => {
                this.currentWorkout.exercises[ei].sets.push({ weight: '', reps: '' });
                this.renderExercises();
                this.vibrate(10);

                // Start rest timer
                this.startRest();
            });

            // Delete exercise
            card.querySelector('.ex-del').addEventListener('click', () => {
                this.currentWorkout.exercises.splice(ei, 1);
                this.renderExercises();
                this.updateLiveStats();
                this.vibrate(20);
            });
        });
    }

    updateLiveStats() {
        let vol = 0;
        let sets = 0;

        this.currentWorkout.exercises.forEach(ex => {
            ex.sets.forEach(set => {
                const w = parseFloat(set.weight);
                const r = parseFloat(set.reps);
                if (w > 0 && r > 0) {
                    vol += w * r;
                    sets++;
                }
            });
        });

        document.getElementById('liveVol').textContent = Math.round(vol).toLocaleString();
        document.getElementById('liveSets').textContent = sets;
        document.getElementById('liveEx').textContent = this.currentWorkout.exercises.length;

        this.currentWorkout.totalVolume = vol;
        this.currentWorkout.totalSets = sets;
    }

    // ─────────────────────────────────────
    // Rest Timer
    // ─────────────────────────────────────
    setupRestTimer() {
        document.getElementById('restSkip').addEventListener('click', () => {
            this.stopRest();
        });

        document.getElementById('restAdd30').addEventListener('click', () => {
            this.restRemaining += 30;
            this.vibrate(10);
        });
    }

    startRest() {
        // Only start if there are completed sets
        let hasSets = false;
        this.currentWorkout.exercises.forEach(ex => {
            ex.sets.forEach(set => {
                if (parseFloat(set.weight) > 0 && parseFloat(set.reps) > 0) {
                    hasSets = true;
                }
            });
        });
        if (!hasSets) return;

        this.restRemaining = this.restDuration;
        const totalDuration = this.restDuration;

        document.getElementById('restOverlay').classList.remove('hidden');
        this.updateRestDisplay(totalDuration);

        if (this.restInterval) clearInterval(this.restInterval);
        this.restInterval = setInterval(() => {
            this.restRemaining--;
            this.updateRestDisplay(totalDuration);

            if (this.restRemaining <= 0) {
                this.stopRest();
                this.vibrate(50);
            }
        }, 1000);
    }

    updateRestDisplay(total) {
        const min = Math.floor(this.restRemaining / 60);
        const sec = this.restRemaining % 60;
        document.getElementById('restTime').textContent =
            min + ':' + sec.toString().padStart(2, '0');

        // Update ring
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

        // Check if there's any data
        let hasData = false;
        this.currentWorkout.exercises.forEach(ex => {
            ex.sets.forEach(set => {
                if (parseFloat(set.weight) > 0 && parseFloat(set.reps) > 0) {
                    hasData = true;
                }
            });
        });

        if (!hasData) {
            alert('Log at least one set with weight and reps before finishing!');
            return;
        }

        // Stop timer
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.stopRest();

        // Calculate duration
        const duration = Math.round((Date.now() - this.startTime) / 60000);

        // Save workout
        this.currentWorkout.endTime = new Date().toISOString();
        this.currentWorkout.duration = duration;
        this.updateLiveStats();

        const workouts = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
        workouts.push(this.currentWorkout);
        localStorage.setItem('ironpump_workouts', JSON.stringify(workouts));

        // Show complete screen
        document.getElementById('compVol').textContent = Math.round(this.currentWorkout.totalVolume).toLocaleString();
        document.getElementById('compSets').textContent = this.currentWorkout.totalSets;
        document.getElementById('compTime').textContent = duration;
        document.getElementById('completeOverlay').classList.remove('hidden');

        // Reset
        document.getElementById('woActive').classList.add('hidden');
        document.getElementById('woInactive').classList.remove('hidden');
        document.getElementById('exList').innerHTML = '';
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
            list.innerHTML = '<div class="no-history"><p>No workouts yet.</p><p>Complete your first workout!</p></div>';
            return;
        }

        list.innerHTML = workouts.slice().reverse().map(wo => {
            const date = new Date(wo.startTime);
            const dateStr = date.toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
            });
            const dur = wo.duration || 0;

            return `
                <div class="history-card">
                    <div class="history-top">
                        <span class="history-split">${wo.splitName || wo.split}</span>
                        <span class="history-date">${dateStr}</span>
                    </div>
                    <div class="history-stats">
                        <span class="history-stat">Vol: <span>${Math.round(wo.totalVolume || 0).toLocaleString()} kg</span></span>
                        <span class="history-stat">Sets: <span>${wo.totalSets || 0}</span></span>
                        <span class="history-stat">Time: <span>${dur} min</span></span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ─────────────────────────────────────
    // Intel Data
    // ─────────────────────────────────────
    updateIntel() {
        const vol = this.getWeeklyVolume();
        const sessions = this.getMonthSessions();
        const streak = this.getStreak();

        document.getElementById('intel-vol').textContent = Math.round(vol).toLocaleString();
        document.getElementById('intel-sessions').textContent = sessions;
        document.getElementById('intel-streak').textContent = streak;
    }

    getWeeklyVolume() {
        const workouts = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        let vol = 0;

        workouts.forEach(wo => {
            if (new Date(wo.startTime).getTime() > weekAgo) {
                vol += wo.totalVolume || 0;
            }
        });

        return vol;
    }

    getMonthSessions() {
        const workouts = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
        const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        let count = 0;

        workouts.forEach(wo => {
            if (new Date(wo.startTime).getTime() > monthAgo) {
                count++;
            }
        });

        return count;
    }

    getStreak() {
        const workouts = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
        if (workouts.length === 0) return 0;

        const dates = workouts.map(wo => {
            const d = new Date(wo.startTime);
            return d.toDateString();
        });

        const unique = [...new Set(dates)].sort((a, b) =>
            new Date(b) - new Date(a)
        );

        let streak = 1;
        for (let i = 0; i < unique.length - 1; i++) {
            const curr = new Date(unique[i]);
            const prev = new Date(unique[i + 1]);
            const diff = (curr - prev) / (24 * 60 * 60 * 1000);

            if (diff <= 1.5) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    getWeeklyChartData() {
        const workouts = JSON.parse(localStorage.getItem('ironpump_workouts') || '[]');
        const weeks = {};
        const labels = [];
        const values = [];

        workouts.forEach(wo => {
            const date = new Date(wo.startTime);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const key = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            if (!weeks[key]) weeks[key] = 0;
            weeks[key] += wo.totalVolume || 0;
        });

        Object.keys(weeks).forEach(key => {
            labels.push(key);
            values.push(Math.round(weeks[key]));
        });

        return { labels, values };
    }

    // ─────────────────────────────────────
    // Utilities
    // ─────────────────────────────────────
    vibrate(ms = 10) {
        if ('vibrate' in navigator) {
            navigator.vibrate(ms);
        }
    }
}

// Start the app
const app = new IronPump();
