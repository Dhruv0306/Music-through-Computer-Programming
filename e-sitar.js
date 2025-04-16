// Initialize audio context and effects
let synth, drone, reverb;
let noteDuration = 0.5; // Default note duration in seconds
let isPlaying = false; // Track if we're currently playing

// Define the notes and frequencies for Madhya Saptak
const notes = {
    'Sa': 240,
    'Re': 270,
    'Ga': 288,
    'Ma': 320,
    'Pa': 360,
    'Dha': 405,
    'Ni': 432,
    "Sa'": 480
};

// Wait for the page to load
window.addEventListener('load', async () => {
    // Request audio context when user interacts
    document.addEventListener('click', initializeAudio, { once: true });
});

// Initialize audio components
async function initializeAudio() {
    // Start audio context
    await Tone.start();
    
    // Create effects
    reverb = new Tone.Reverb({
        decay: 2,
        wet: 0.3
    }).toDestination();

    // Create main synth
    synth = new Tone.Synth({
        oscillator: {
            type: "sawtooth",
        },
        envelope: {
            attack: 0.02,
            decay: 0.3,
            sustain: 0.6,
            release: 0.8
        },
        volume: -10
    }).connect(reverb);

    // Create drone
    drone = new Tone.Oscillator({
        type: "sine",
        frequency: "C3",
        volume: -20
    }).connect(reverb);

    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // String interaction
    const mainString = document.querySelector('.main-string');
    const stringBead = document.querySelector('.string-bead');
    
    // Handle mouse enter on string
    mainString.addEventListener('mouseenter', (e) => {
        stringBead.style.display = 'block';
        isPlaying = true;
        const rect = e.target.getBoundingClientRect();
        const position = (e.clientX - rect.left) / rect.width;
        const freq = 240 + (480 - 240) * position;
        synth.triggerAttack(freq);
        updateBeadPosition(e);
    });
    
    // Handle mouse leave from string
    mainString.addEventListener('mouseleave', (e) => {
        stringBead.style.display = 'none';
        isPlaying = false;
        synth.triggerRelease();
    });
    
    // Handle mouse movement on string
    mainString.addEventListener('mousemove', (e) => {
        if (isPlaying) {
            updateBeadPosition(e);
            const rect = e.target.getBoundingClientRect();
            const position = (e.clientX - rect.left) / rect.width;
            const freq = 240 + (480 - 240) * position;
            synth.frequency.rampTo(freq, 0.1);
            updateNoteHighlight(freq);
        }
    });

    // Note marker interactions
    document.querySelectorAll('.note-marker').forEach(marker => {
        marker.addEventListener('mouseenter', () => {
            isPlaying = true;
            const freq = parseFloat(marker.dataset.freq);
            synth.triggerAttack(freq);
            updateNoteHighlight(freq);
        });
        marker.addEventListener('mouseleave', () => {
            isPlaying = false;
            synth.triggerRelease();
        });
    });

    // Fret interactions
    document.querySelectorAll('.fret').forEach(fret => {
        fret.addEventListener('mouseenter', () => {
            isPlaying = true;
            const freq = parseFloat(fret.dataset.freq);
            synth.triggerAttack(freq);
            updateNoteHighlight(freq);
        });
        fret.addEventListener('mouseleave', () => {
            isPlaying = false;
            synth.triggerRelease();
        });
    });

    // Control listeners
    document.getElementById('droneToggle').addEventListener('click', toggleDrone);
    document.getElementById('reverb').addEventListener('input', updateReverb);
    document.getElementById('sustain').addEventListener('input', updateSustain);
    
    // Duration control
    const durationSlider = document.getElementById('duration');
    const durationValue = document.getElementById('durationValue');
    durationSlider.addEventListener('input', (e) => {
        noteDuration = parseFloat(e.target.value);
        durationValue.textContent = noteDuration.toFixed(1) + 's';
    });
}

// Find the closest note to a given frequency
function findClosestNote(freq) {
    let closestFreq = 240; // Default to Sa
    let closestNote = 'Sa';
    let minDiff = Infinity;

    for (const [note, noteFreq] of Object.entries(notes)) {
        const diff = Math.abs(noteFreq - freq);
        if (diff < minDiff) {
            minDiff = diff;
            closestFreq = noteFreq;
            closestNote = note;
        }
    }

    return { closestFreq, closestNote };
}

// Update bead position
function updateBeadPosition(e) {
    const rect = e.target.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const freq = 240 + (480 - 240) * position;
    const bead = document.querySelector('.string-bead');
    
    // Find the closest note
    const { closestFreq, closestNote } = findClosestNote(freq);
    
    // If we're close to a note (within 10 Hz), snap the bead to that position
    if (Math.abs(closestFreq - freq) < 10) {
        const snappedPosition = (closestFreq - 240) / (480 - 240);
        bead.style.left = `${snappedPosition * 100}%`;
        // Add a data attribute to show the current note
        bead.setAttribute('data-note', closestNote);
        bead.classList.add('on-note');
    } else {
        bead.style.left = `${position * 100}%`;
        bead.removeAttribute('data-note');
        bead.classList.remove('on-note');
    }
}

// Play a specific frequency
function playFrequency(freq) {
    // Ensure frequency is within our range
    freq = Math.max(240, Math.min(480, freq));
    
    if (!isPlaying) {
        synth.triggerAttack(freq);
        isPlaying = true;
    } else {
        // Just update the frequency without triggering attack
        synth.frequency.exponentialRampToValueAtTime(freq, Tone.now() + 0.1);
    }
    updateNoteHighlight(freq);
}

// Start playing a note
function startNote(e) {
    isPlaying = true;
    updateFrequency(e);
}

// Stop playing a note
function stopNote() {
    if (synth && synth.state === 'started') {
        synth.triggerRelease();
    }
    isPlaying = false;
    // Reset all note highlights
    document.querySelectorAll('.note-marker').forEach(marker => marker.style.color = '#ffd700');
}

// Update frequency based on mouse position
function updateFrequency(e) {
    if (!isPlaying) return;
    
    const rect = e.target.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    // Calculate the exact frequency based on position (240 Hz to 480 Hz range)
    const freq = 240 + (480 - 240) * position;
    
    playFrequency(freq);
}

// Update visual feedback for the closest note
function updateNoteHighlight(freq) {
    const markers = document.querySelectorAll('.note-marker');
    let closestMarker = null;
    let minDiff = Infinity;

    markers.forEach(marker => {
        const markerFreq = parseFloat(marker.dataset.freq);
        const diff = Math.abs(markerFreq - freq);
        if (diff < minDiff) {
            minDiff = diff;
            closestMarker = marker;
        }
        // Reset color
        marker.style.color = '#ffd700';
    });

    // Highlight the closest marker if we're within 10 Hz
    if (closestMarker && minDiff < 10) {
        closestMarker.style.color = '#ffeb3b';
    }
}

// Toggle drone sound
function toggleDrone() {
    const button = document.getElementById('droneToggle');
    if (drone.state === 'started') {
        drone.stop();
        button.textContent = 'Start Drone';
    } else {
        drone.start();
        button.textContent = 'Stop Drone';
    }
}

// Update reverb amount
function updateReverb(e) {
    if (reverb) {
        reverb.wet.value = parseFloat(e.target.value);
    }
}

// Update sustain
function updateSustain(e) {
    if (synth) {
        const sustainTime = parseFloat(e.target.value);
        synth.set({
            envelope: {
                sustain: sustainTime * 0.2,
                release: sustainTime * 0.5
            }
        });
    }
} 