const { Renderer, Stave, StaveNote, Accidental, Formatter, Voice, Clef } = Vex.Flow;
let currentLevel = 1; let currentQuizIndex = 0; let score = 0; let streak = 0;
let highScore = localStorage.getItem('posauneHighScore') || 0;
let currentQuizQuestion = null; let quizActive = true; let currentSliderSelection = 1;
let lastLearnRenderedNote = null; let currentLearnPosInt = 1;

// --- DATENBASIS (C-Dur Anfänger) ---
const positionMap = {
    1: [
        { text: "F", key: "f/3", level: 1, isBeginner: true, freq: 174.61 },
        { text: "B", key: "bb/2", level: 2, freq: 116.54 },
        { text: "b", key: "bb/3", level: 3, freq: 233.08 },
        { text: "Ais", key: "a#/2", level: 2, freq: 116.54 },
        { text: "ais", key: "a#/3", level: 3, freq: 233.08 }
    ],
    2: [
        { text: "E", key: "e/3", level: 1, isBeginner: true, freq: 164.81 },
        { text: "A", key: "a/3", level: 1, isBeginner: true, freq: 220.00 },
        { text: "A (tief)", key: "a/2", level: 2, freq: 110.00 },
    ],
    3: [
        { text: "C'", key: "c/4", level: 1, isBeginner: true, freq: 261.63 },
        { text: "Es", key: "eb/3", level: 2, freq: 155.56 },
        { text: "As", key: "ab/2", level: 2, freq: 103.83 },
        { text: "as", key: "ab/3", level: 3, freq: 207.65 },
        { text: "Gis", key: "g#/2", level: 2, freq: 103.83 },
        { text: "gis", key: "g#/3", level: 3, freq: 207.65 },
        { text: "Dis", key: "d#/3", level: 2, freq: 155.56 }
    ],
    4: [
        { text: "D", key: "d/3", level: 1, isBeginner: true, freq: 146.83 },
        { text: "G", key: "g/3", level: 1, isBeginner: true, freq: 196.00 },
        { text: "H", key: "b/3", level: 1, isBeginner: true, freq: 246.94 },
        { text: "G (tief)", key: "g/2", level: 2, freq: 98.00 }
    ],
    5: [
        { text: "Des", key: "db/3", level: 2, freq: 138.59 },
        { text: "Ges", key: "gb/2", level: 2, freq: 92.50 },
        { text: "ges", key: "gb/3", level: 3, freq: 185.00 },
        { text: "Cis", key: "c#/3", level: 2, freq: 138.59 },
        { text: "Fis", key: "f#/2", level: 2, freq: 92.50 },
        { text: "fis", key: "f#/3", level: 3, freq: 185.00 }
    ],
    6: [
        { text: "C", key: "c/3", level: 1, isBeginner: true, freq: 130.81 },
        { text: "F (tief)", key: "f/2", level: 2, freq: 87.31 }
    ],
    7: [
        { text: "H", key: "b/2", level: 2, freq: 123.47 },
        { text: "E", key: "e/2", level: 2, freq: 82.41 }
    ]
};

// --- HELPER: Rendert kleine Note für die Tabelle ---
function renderNoteThumbnail(container, noteKey) {
    const div = document.createElement('div');
    div.className = 'mini-staff';
    container.appendChild(div);
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(80, 60);
    const ctx = renderer.getContext();
    ctx.scale(0.6, 0.6);
    const stave = new Stave(0, 0, 130);
    stave.setContext(ctx).draw();
    const note = new StaveNote({ keys: [noteKey], duration: "w", clef: "bass", align_center: true });
    if (noteKey.includes('b')) note.addModifier(new Accidental('b'), 0);
    if (noteKey.includes('#')) note.addModifier(new Accidental('#'), 0);
    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables([note]);
    new Formatter().joinVoices([voice]).format([voice], 100);
    voice.draw(ctx, stave);
}

function generateReferenceTable() {
    const tbody = document.querySelector('#referenceTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    for (let pos = 1; pos <= 7; pos++) {
        const row = document.createElement('tr');
        const notes = positionMap[pos];
        const beginnerNotes = notes.filter(n => n.isBeginner);
        const advNotes = notes.filter(n => n.level === 2 && !n.isBeginner);
        const proNotes = notes.filter(n => n.level === 3 && !n.isBeginner);

        const tdPos = document.createElement('td');
        tdPos.innerHTML = `<span class="badge bg-secondary rounded-pill">${pos}</span>`;
        row.appendChild(tdPos);

        const td1 = document.createElement('td');
        if (beginnerNotes.length > 0) {
            beginnerNotes.forEach(n => {
                const d = document.createElement('div');
                d.className = "d-inline-block text-center m-1";
                d.innerHTML = `<div><strong>${n.text}</strong></div>`;
                renderNoteThumbnail(d, n.key);
                td1.appendChild(d);
            });
        } else td1.innerText = "-";
        row.appendChild(td1);

        const td2 = document.createElement('td');
        if (advNotes.length > 0) {
            advNotes.forEach(n => {
                const d = document.createElement('div');
                d.className = "d-inline-block text-center m-1";
                d.innerHTML = `<div><small>${n.text}</small></div>`;
                renderNoteThumbnail(d, n.key);
                td2.appendChild(d);
            });
        } else td2.innerText = "-";
        row.appendChild(td2);

        const td3 = document.createElement('td');
        if (proNotes.length > 0) {
            proNotes.forEach(n => {
                const d = document.createElement('div');
                d.className = "d-inline-block text-center m-1";
                d.innerHTML = `<div><small>${n.text}</small></div>`;
                renderNoteThumbnail(d, n.key);
                td3.appendChild(d);
            });
        } else td3.innerText = "-";
        row.appendChild(td3);
        tbody.appendChild(row);
    }
}

function setLevel(lvl) {
    currentLevel = lvl;
    let txt = "Modus: Anfänger (C-Dur Tonleiter)";
    if (lvl === 2) txt = "Modus: Fortgeschritten (Chromatisch)";
    if (lvl === 3) txt = "Modus: Profi (Alle Lagen)";
    document.getElementById('quizLevelHint').innerText = txt;
    initQuiz();
    setLearnPosition(document.getElementById('learnSlideRange').value);
}

function getNotesForPosition(p, l) {
    if (!positionMap[p]) return [];
    if (l === 1) return positionMap[p].filter(n => n.isBeginner);
    if (l === 2) return positionMap[p].filter(n => n.level <= 2);
    return positionMap[p];
}

function generateQuestionsForLevel(lvl) {
    let q = [];
    for (let pos = 1; pos <= 7; pos++) {
        const notes = getNotesForPosition(pos, lvl);
        notes.forEach(n => {
            q.push({
                noteName: n.text,
                correct: pos,
                key: n.key,
                freq: n.freq
            });
        });
    }
    return q;
}

// --- AUDIO ENGINE ---
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playBrassTone(freq) {
    const ctx = initAudio();
    const t = ctx.currentTime;
    const duration = 0.6;

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, t);
    masterGain.gain.linearRampToValueAtTime(0.5, t + 0.08); // Weicherer Attack
    masterGain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    masterGain.connect(ctx.destination);

    // Oscillator 1 (Sawtooth - Kern)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = freq;

    // Oscillator 2 (Sawtooth - Breite/Chor)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.value = freq;
    osc2.detune.value = 4; // Leicht verstimmt für Breite

    // Filter (Lowpass - das "Messing" Gefühl)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 1.5; 
    // Filter öffnet sich beim Anblasen (Wah-Effekt minimiert, eher "Bwaaah")
    filter.frequency.setValueAtTime(freq * 1.5, t);
    filter.frequency.linearRampToValueAtTime(freq * 4, t + 0.1); 
    filter.frequency.exponentialRampToValueAtTime(freq * 2, t + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + duration);
    osc2.stop(t + duration);
}

function playSingleNote(note) {
    playBrassTone(note.freq);
    renderVexFlowNotes("learnStaff", [note.key]);
}

function playQuizHint() {
    if(currentQuizQuestion) {
        playBrassTone(currentQuizQuestion.freq);
    }
}

function renderVexFlowNotes(id, keys, isGhost = false) {
    const div = document.getElementById(id); if (!div) return; div.innerHTML = "";
    if (isGhost) div.classList.add('grayscale-staff'); else div.classList.remove('grayscale-staff');
    const r = new Renderer(div, Renderer.Backends.SVG); r.resize(350, 150);
    const ctx = r.getContext(); ctx.scale(1.5, 1.5);
    const s = new Stave(10, 10, 210); s.addClef("bass"); s.setContext(ctx).draw();
    const n = new StaveNote({ keys: keys, duration: "w", clef: "bass", align_center: true });
    if (isGhost) n.setStyle({ fillStyle: "#999", strokeStyle: "#999" });
    keys.forEach((k, i) => { if (k.includes('b')) n.addModifier(new Accidental('b'), i); if (k.includes('#')) n.addModifier(new Accidental('#'), i); });
    const v = new Voice({ num_beats: 4, beat_value: 4 }); v.addTickables([n]);
    new Formatter().joinVoices([v]).format([v], 150); v.draw(ctx, s);
    div.querySelector('svg').setAttribute('viewBox', '0 0 350 150');
    div.querySelector('svg').style.width = "100%"; div.querySelector('svg').style.height = "100%";
}

function handleQuizInput(val) {
    const pos = parseFloat(val);
    currentSliderSelection = pos;
    updateVisuals('quiz', pos);
    const rounded = Math.round(pos);
    document.getElementById('quizCurrentSelection').innerText = "Position " + rounded;

    // Show notes for this position (nur als Info, nicht Lösung verraten wenn Quiz läuft? 
    // Aktuell zeigt es Töne an, das ist okay als Lernhilfe während des Ziehens)
    const notes = getNotesForPosition(rounded, currentLevel);
    const noteText = notes.length > 0 ? notes.map(n => n.text).join(', ') : "-";
    const notesDiv = document.getElementById('quizNotesOnPosition');
    if (notesDiv) notesDiv.innerText = `(Töne hier: ${noteText})`;

    highlightMarker('quiz', rounded);
}

// --- KEYBOARD CONTROLS ---
document.addEventListener('keydown', (e) => {
    // Only if not typing in an input (though we don't have text inputs really)
    if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return;

    const isQuiz = !document.getElementById('view-trainer').classList.contains('d-none') &&
        document.getElementById('pills-quiz-tab').classList.contains('active');
    const isLearn = !document.getElementById('view-trainer').classList.contains('d-none') &&
        document.getElementById('pills-learn-tab').classList.contains('active');

    if (!isQuiz && !isLearn) return;

    const sliderId = isQuiz ? 'quizSlideRange' : 'learnSlideRange';
    const slider = document.getElementById(sliderId);
    let currentVal = parseFloat(slider.value);

    if (e.key === 'ArrowRight') {
        e.preventDefault();
        let next = Math.min(7, Math.round(currentVal + 1));
        if (isQuiz) snapQuizInput(next);
        else setLearnPosition(next);
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        let prev = Math.max(1, Math.round(currentVal - 1));
        if (isQuiz) snapQuizInput(prev);
        else setLearnPosition(prev);
    } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (isQuiz) {
            // If check button is visible, click it
            if (document.getElementById('checkAnswerBtn').style.display !== 'none') {
                checkQuizAnswer();
            } else if (document.getElementById('nextBtn').style.display !== 'none') {
                nextQuestion();
            }
        } else if (isLearn) {
            playCurrentLearnTone();
        }
    }
});
function snapQuizInput(val) {
    const rounded = Math.round(val);
    document.getElementById('quizSlideRange').value = rounded;
    handleQuizInput(rounded);
}

function handleLearnInput(val) {
    const pos = parseFloat(val);
    updateVisuals('learn', pos);
    const rounded = Math.round(pos);

    // INTERACTIVE NOTES GENERATION
    const container = document.getElementById('learnNoteInteraction');
    container.innerHTML = '';

    // Alle verfügbaren Noten holen (Fallback auf alle Levels wenn nötig)
    let notes = getNotesForPosition(rounded, currentLevel);
    let isFallback = false;
    if (notes.length === 0) {
        notes = getNotesForPosition(rounded, 3);
        isFallback = true;
    }

    if (notes.length > 0 && Math.abs(pos - rounded) < 0.3) {
        // Render Buttons for each note
        notes.forEach((n, index) => {
            const btn = document.createElement('div');
            btn.className = `note-chip ${isFallback ? 'fallback-note' : ''} ${index === 0 ? 'active-note' : ''}`; // Default active first
            btn.innerHTML = `${n.text} <i class="bi bi-volume-up-fill small"></i>`;
            btn.onclick = () => playSingleNote(n);
            container.appendChild(btn);
        });

        // Default render first note in stave
        const keys = notes.map(n => n.key);
        if (lastLearnRenderedNote !== keys.join(',')) {
            renderVexFlowNotes("learnStaff", keys, isFallback);
            lastLearnRenderedNote = keys.join(',');
        }

    } else if (Math.abs(pos - rounded) < 0.3) {
        container.innerHTML = `<span class="text-muted">Keine Töne</span>`;
        document.getElementById('learnStaff').innerHTML = "";
    }
    highlightMarker('learn', rounded);
}

function handleLearnRelease(val) {
    const slider = document.getElementById('learnSlideRange');
    const currentVal = val || parseFloat(slider.value);
    const rounded = Math.round(currentVal);
    slider.value = rounded;
    handleLearnInput(rounded);
    if (document.getElementById('autoPlayCheck').checked) playCurrentLearnTone();
}

function updateVisuals(prefix, pos) {
    const maxMove = 240; const movePerPos = maxMove / 6; const px = (pos - 1) * movePerPos;
    document.getElementById(prefix + 'VisualSlide').style.transform = `translateX(${px}px)`;
    const rounded = Math.round(pos);
    document.querySelectorAll(`#pills-${prefix} .pos-btn`).forEach(b => {
        b.classList.remove('active-pos');
        if (parseInt(b.innerText) === rounded && Math.abs(pos - rounded) < 0.3) b.classList.add('active-pos');
    });
}

function highlightMarker(prefix, pos) {
    for (let i = 1; i <= 7; i++) {
        const m = document.getElementById(`${prefix}-marker-${i}`);
        if (m) m.classList.remove('active-marker');
    }
    const active = document.getElementById(`${prefix}-marker-${pos}`);
    if (active) active.classList.add('active-marker');
}

function setLearnPosition(pos) {
    document.getElementById('learnSlideRange').value = pos;
    handleLearnInput(pos);
    if (document.getElementById('autoPlayCheck').checked) playCurrentLearnTone();
}

function playCurrentLearnTone() {
    const rounded = Math.round(parseFloat(document.getElementById('learnSlideRange').value));
    let notes = getNotesForPosition(rounded, currentLevel);
    if (notes.length === 0) notes = getNotesForPosition(rounded, 3);

    // PLAY ONLY PRIMARY NOTE (First in list or best match)
    if (notes.length > 0) {
        // Prioritize Beginner Note if exists
        const primary = notes.find(n => n.isBeginner) || notes[0];
        playSingleNote(primary);
    }
}

function initQuiz() {
    score = 0; streak = 0; document.getElementById('score').innerText = 0; document.getElementById('streakCount').innerText = 0;
    nextQuestion();
}
function nextQuestion() {
    quizActive = true;
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('checkAnswerBtn').style.display = 'block';
    document.getElementById('quizFeedback').style.display = 'none';
    document.getElementById('quizStaff').classList.remove('correct', 'wrong');
    const questions = generateQuestionsForLevel(currentLevel);
    if (questions.length === 0) { alert("Keine Fragen!"); return; }
    currentQuizQuestion = questions[Math.floor(Math.random() * questions.length)];
    renderVexFlowNotes("quizStaff", [currentQuizQuestion.key]);
    
    // Reset Position to 1 for new question
    handleQuizInput(1); 
    document.getElementById('quizSlideRange').value = 1;
}
function checkQuizAnswer() {
    if (!quizActive) return;
    const userPos = Math.round(currentSliderSelection);
    const fb = document.getElementById('quizFeedback');
    const staff = document.getElementById('quizStaff');
    
    if (userPos === currentQuizQuestion.correct) {
        streak++; score += (10 + (streak > 1 ? streak * 2 : 0));
        if (score > highScore) { highScore = score; localStorage.setItem('posauneHighScore', score); }
        fb.className = "feedback-badge bg-success text-white";
        fb.innerHTML = `<strong>Richtig!</strong> <i class="bi bi-music-note-beamed"></i>`;
        staff.classList.add('correct');
        playBrassTone(currentQuizQuestion.freq);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
        streak = 0; fb.className = "feedback-badge bg-danger text-white";
        fb.innerHTML = `<strong>Falsch.</strong> Die richtige Position ist <strong>${currentQuizQuestion.correct}</strong>`;
        staff.classList.add('wrong');
        playBrassTone(80); // Error sound
        
        // VISUAL FEEDBACK: Move slide to correct position automatically
        setTimeout(() => {
            snapQuizInput(currentQuizQuestion.correct);
            playBrassTone(currentQuizQuestion.freq); // Play correct tone after moving
        }, 800);
    }
    document.getElementById('score').innerText = score;
    document.getElementById('streakCount').innerText = streak;
    document.getElementById('highScore').innerText = highScore;
    fb.style.display = 'block';
    document.getElementById('checkAnswerBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'block';
    quizActive = false;
}

function switchMainView(v) {
    const t = document.getElementById('view-trainer'); const i = document.getElementById('view-instructions');
    if (v === 'trainer') { t.classList.remove('d-none'); i.classList.add('d-none'); if (currentQuizQuestion) renderVexFlowNotes("quizStaff", [currentQuizQuestion.key]); }
    else { t.classList.add('d-none'); i.classList.remove('d-none'); }
    const nb = document.getElementById('navbarNav'); if (nb.classList.contains('show')) new bootstrap.Collapse(nb).hide();
}

document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
    setLearnPosition(1);
    document.getElementById('darkModeSwitch').addEventListener('change', () => document.documentElement.setAttribute('data-bs-theme', document.getElementById('darkModeSwitch').checked ? 'dark' : 'light'));
    document.getElementById('score').innerText = 0; document.getElementById('streakCount').innerText = 0; document.getElementById('highScore').innerText = highScore;
    generateReferenceTable();
});
