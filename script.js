// YouTube Player Variables
let player;
let musicPlaying = false;
let currentSongIndex = 0;
const songs = [
    'B2Mac_zdXnw', // Song 1
    '1_k5kzGMhEg'  // Song 2
];

// YouTube API Ready
function onYouTubeIframeAPIReady() {
    player = new YT.Player('ytplayer', {
        height: '0',
        width: '0',
        videoId: songs[0],
        playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 0
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

// Handle song ending - play next song
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        currentSongIndex++;
        if (currentSongIndex < songs.length) {
            player.loadVideoById(songs[currentSongIndex]);
        } else {
            // Loop back to first song
            currentSongIndex = 0;
            player.loadVideoById(songs[currentSongIndex]);
        }
    }
}

// Toggle Music
function toggleMusic() {
    const control = document.getElementById('musicControl');
    if (musicPlaying) {
        player.pauseVideo();
        control.classList.remove('playing');
    } else {
        player.playVideo();
        control.classList.add('playing');
    }
    musicPlaying = !musicPlaying;
}

// Initialize
let completedPuzzles = 0;
const totalPuzzles = 5;

// Hide loading after page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }, 1000);
});

// Close popup and start music
function closePopup() {
    document.getElementById('popupOverlay').classList.add('hidden');
    // Auto-start music when popup is closed
    if (player && player.playVideo) {
        player.playVideo();
        document.getElementById('musicControl').classList.add('playing');
        musicPlaying = true;
    }
}

// Create particles
function createParticles() {
    const container = document.getElementById('particlesContainer');
    
    // Create hearts
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'particle heart-particle';
        heart.textContent = ['💕', '💖', '💗', '💝'][Math.floor(Math.random() * 4)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 15 + 20) + 'px';
        heart.style.animationDelay = Math.random() * 10 + 's';
        heart.style.animationDuration = (Math.random() * 5 + 10) + 's';
        container.appendChild(heart);
    }

    // Create sparkles
    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'particle sparkle-particle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 8 + 's';
        sparkle.style.animationDuration = (Math.random() * 3 + 8) + 's';
        container.appendChild(sparkle);
    }
}

createParticles();

// Progress bar
function updateProgress() {
    const progress = (completedPuzzles / totalPuzzles) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

// Start journey
function startJourney() {
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('mainContent').classList.add('active');

    setTimeout(() => {
        document.getElementById('puzzle1').classList.add('visible');
    }, 300);
}

// Puzzle 1: Heart Matcher
const hearts = ['💖', '💝', '💗', '💕', '💖', '💝', '💗', '💕'];
let selected = [];
let matched = 0;

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

const shuffledHearts = shuffleArray(hearts);
const heartMatcher = document.getElementById('heartMatcher');
shuffledHearts.forEach((heart, index) => {
    const item = document.createElement('div');
    item.className = 'interactive-item';
    item.textContent = heart;
    item.dataset.type = heart;
    item.addEventListener('click', () => selectHeart(item));
    heartMatcher.appendChild(item);
});

function selectHeart(item) {
    if (item.classList.contains('matched') || selected.length >= 2) return;

    selected.push(item);
    item.classList.add('selected');

    if (selected.length === 2) {
        setTimeout(() => {
            if (selected[0].dataset.type === selected[1].dataset.type) {
                selected.forEach(s => {
                    s.classList.remove('selected');
                    s.classList.add('matched');
                });
                matched += 2;
                if (matched === 8) {
                    completePuzzle(1);
                }
            } else {
                selected.forEach(s => s.classList.remove('selected'));
            }
            selected = [];
        }, 600);
    }
}

// Puzzle 2: Word Builder
const words = ['I', 'love', 'you', 'so', 'much'];
const correctOrder = 'I love you so much';
const shuffledWords = shuffleArray(words);
const wordPuzzle = document.getElementById('wordPuzzle');
let selectedWords = [];

shuffledWords.forEach(word => {
    const tile = document.createElement('div');
    tile.className = 'word-tile';
    tile.textContent = word;
    tile.addEventListener('click', () => selectWord(tile, word));
    wordPuzzle.appendChild(tile);
});

function selectWord(tile, word) {
    if (tile.classList.contains('selected')) {
        tile.classList.remove('selected');
        selectedWords = selectedWords.filter(w => w !== word);
    } else {
        tile.classList.add('selected');
        selectedWords.push(word);

        if (selectedWords.join(' ') === correctOrder) {
            setTimeout(() => completePuzzle(2), 500);
        }
    }
}

// Puzzle 3: Find Hidden Hearts
const hiddenHeartsGrid = document.getElementById('hiddenHearts');
const totalItems = 15;
const heartPositions = [];
let foundHearts = 0;

// Randomly select 5 positions for hearts
while (heartPositions.length < 5) {
    const pos = Math.floor(Math.random() * totalItems);
    if (!heartPositions.includes(pos)) {
        heartPositions.push(pos);
    }
}

for (let i = 0; i < totalItems; i++) {
    const item = document.createElement('div');
    item.className = 'interactive-item';
    item.textContent = '?';
    item.dataset.isHeart = heartPositions.includes(i);
    item.addEventListener('click', () => checkHiddenHeart(item));
    hiddenHeartsGrid.appendChild(item);
}

function checkHiddenHeart(item) {
    if (item.classList.contains('found')) return;
    
    if (item.dataset.isHeart === 'true') {
        item.textContent = '💖';
        item.classList.add('found');
        foundHearts++;
        
        if (foundHearts === 5) {
            setTimeout(() => completePuzzle(3), 500);
        }
    } else {
        item.textContent = '❌';
        setTimeout(() => {
            item.textContent = '?';
        }, 500);
    }
}

// Puzzle 4: Hidden Message
const hiddenWords = document.getElementById('hiddenWords');
const hiddenMessage = ['You', 'Are', 'My', 'World', 'Forever'];
let revealed = 0;

hiddenMessage.forEach(word => {
    const tile = document.createElement('div');
    tile.className = 'word-tile';
    tile.textContent = '?';
    tile.dataset.word = word;
    tile.addEventListener('mouseenter', revealWord);
    tile.addEventListener('click', revealWord);
    hiddenWords.appendChild(tile);
});

function revealWord(e) {
    if (!e.target.classList.contains('selected')) {
        e.target.textContent = e.target.dataset.word;
        e.target.classList.add('selected');
        revealed++;

        if (revealed === hiddenMessage.length) {
            setTimeout(() => completePuzzle(4), 1000);
        }
    }
}

// Puzzle 5: Count Hearts
const countHearts = document.getElementById('countHearts');
const heartCount = 7;
for (let i = 0; i < heartCount; i++) {
    const item = document.createElement('div');
    item.className = 'interactive-item selected';
    item.textContent = '💕';
    countHearts.appendChild(item);
}

function checkCount(count) {
    if (count === heartCount) {
        completePuzzle(5);
    }
}

// Complete puzzle
function completePuzzle(number) {
    completedPuzzles++;
    updateProgress();

    document.getElementById(`check${number}`).classList.add('visible');
    
    setTimeout(() => {
        document.getElementById(`reveal${number}`).classList.add('visible');
        document.getElementById(`puzzle${number}`).classList.add('unlocked');
    }, 600);

    // Show next puzzle or final message
    if (number < totalPuzzles) {
        setTimeout(() => {
            const nextPuzzle = document.getElementById(`puzzle${number + 1}`);
            nextPuzzle.classList.add('visible');
            nextPuzzle.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 2000);
    } else {
        setTimeout(() => {
            const finalMsg = document.getElementById('finalMessage');
            finalMsg.classList.add('visible');
            finalMsg.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 2000);
    }
}
