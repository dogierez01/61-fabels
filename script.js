const splash = document.getElementById('splash-screen'), instr = document.getElementById('instructions-screen'),
      app = document.getElementById('main-app'), grid = document.getElementById('stations-grid'),
      playerZone = document.getElementById('player-zone'), audio = document.getElementById('audio-player'),
      transcript = document.getElementById('transcript-box'), popup = document.getElementById('translation-popup'),
      gameZone = document.getElementById('game-zone'), gameBoard = document.getElementById('game-board'),
      feedbackArea = document.getElementById('quiz-feedback-area'), ptsVal = document.getElementById('points-val');

let lifetimeScore = parseInt(localStorage.getItem('fablesScore')) || 0;
let completedLessons = JSON.parse(localStorage.getItem('completedFablesLessons')) || [];
if(ptsVal) ptsVal.innerText = lifetimeScore;

let wordBucket = []; let currentQ = 0; let attempts = 0; let totalScore = 0; let firstCard = null;

const stations = [
    {file:"01_BatInWar.mp3", title:"1. The Bat in the War"},
    {file:"02_BearChipmunk.mp3", title:"2. The Bear and the Chipmunk"},
    {file:"03_BearTwoFriends.mp3", title:"3. The Bear and the Two Friends"},
    {file:"04_BoyRattlesnake.mp3", title:"4. The Boy and the Rattlesnake"},
    {file:"05_ButterflyMonk.mp3", title:"5. The Butterfly and the Kind Monk"},
    {file:"06_CamelThistle.mp3", title:"6. The Camel and the Thistle"},
    {file:"07_CamelTent.mp3", title:"7. The Camel in the Tent"},
    {file:"08_CatFox.mp3", title:"8. The Cat and the Fox"},
    {file:"09_CrowPeacock.mp3", title:"9. The Crow and the Peacock"},
    {file:"10_DeerAntlers.mp3", title:"10. The Deer and His Antlers"},
    {file:"11_DogReflection.mp3", title:"11. The Dog and His Reflection"},
    {file:"12_DogWolf.mp3", title:"12. The Dog and the Wolf"},
    {file:"13_DogManger.mp3", title:"13. The Dog in the Manger"},
    {file:"14_DonkeyLapdog.mp3", title:"14. The Donkey and the Lapdog"},
    {file:"15_DonkeySalt.mp3", title:"15. The Donkey and the Salt"},
    {file:"16_EagleArrow.mp3", title:"16. The Eagle and the Arrow"},
    {file:"17_EagleBeetle.mp3", title:"17. The Eagle and the Beetle"},
    {file:"18_EagleChicken.mp3", title:"18. The Eagle Who Thought He Was a Chicken"},
    {file:"19_ElephantRope.mp3", title:"19. The Elephant and the Rope"},
    {file:"20_FalconKing.mp3", title:"20. The Falcon and the King"},
    {file:"21_FoxStork.mp3", title:"21. The Fox and the Stork"},
    {file:"22_FoxTraitorRooster.mp3", title:"22. The Fox and the Traitor Rooster"},
    {file:"23_FrogsWantedKing.mp3", title:"23. The Frogs Who Wanted a King"},
    {file:"24_GooseGoldenEggs.mp3", title:"24. The Goose and the Golden Eggs"},
    {file:"25_HeronFish.mp3", title:"25. The Heron and the Fish"},
    {file:"26_HorseLoadedDonkey.mp3", title:"26. The Horse and the Loaded Donkey"},
    {file:"27_HorseStagRider.mp3", title:"27. The Horse, the Stag, and the Rider"},
    {file:"28_LazySwallow.mp3", title:"28. The Lazy Swallow and the Winter"},
    {file:"29_LionCleverRabbit.mp3", title:"29. The Lion and the Clever Rabbit"},
    {file:"30_LionMouse.mp3", title:"30. The Lion and the Mouse"},
    {file:"31_LionPainting.mp3", title:"31. The Lion and the Painting"},
    {file:"32_LionDonkeyFox.mp3", title:"32. The Lion, the Donkey, and the Fox"},
    {file:"33_LionsDividedHerd.mp3", title:"33. The Lions and the Divided Herd"},
    {file:"34_LittleBirdCow.mp3", title:"34. The Little Bird and the Cow"},
    {file:"35_MiceWantedBell.mp3", title:"35. The Mice Who Wanted a Bell"},
    {file:"36_MonkeyCrocodile.mp3", title:"36. The Monkey and the Crocodile"},
    {file:"37_MouseFrogHawk.mp3", title:"37. The Mouse, the Frog, and the Hawk"},
    {file:"38_NightingaleHawk.mp3", title:"38. The Nightingale and the Hawk"},
    {file:"39_OakTreeReed.mp3", title:"39. The Oak Tree and the Reed"},
    {file:"40_OldDogHole.mp3", title:"40. The Old Dog and the Hole"},
    {file:"41_OldLionFootprints.mp3", title:"41. The Old Lion and the Footprints"},
    {file:"42_OldManScorpion.mp3", title:"42. The Old Man and the Scorpion"},
    {file:"43_PeacockCrane.mp3", title:"43. The Peacock and the Crane"},
    {file:"44_WomanMongoose.mp3", title:"44. The Peasant Woman and the Mongoose"},
    {file:"45_PeasantSnake.mp3", title:"45. The Peasant and the Snake"},
    {file:"46_ScorpionFrog.mp3", title:"46. The Scorpion and the Frog"},
    {file:"47_ElephantNoise.mp3", title:"47. The Silent Elephant and the Noise"},
    {file:"48_SnakeFile.mp3", title:"48. The Snake and the Steel File"},
    {file:"49_SpiderFly.mp3", title:"49. The Spider and the Flattered Fly"},
    {file:"50_TigerFox.mp3", title:"50. The Tiger and the Smart Fox"},
    {file:"51_TigerWoodpecker.mp3", title:"51. The Tiger and the Woodpecker"},
    {file:"52_TurtleScorpion.mp3", title:"52. The Turtle and the Scorpion"},
    {file:"53_TurtleGeese.mp3", title:"53. The Turtle and the Two Geese"},
    {file:"54_TwoDogs.mp3", title:"54. The Two Dogs"},
    {file:"55_TwoFrogsMilk.mp3", title:"55. The Two Frogs and the Milk"},
    {file:"56_RoostersEagle.mp3", title:"56. The Two Roosters and the Eagle"},
    {file:"57_TwoSeeds.mp3", title:"57. The Two Seeds"},
    {file:"58_WarriorWolf.mp3", title:"58. The Warrior and the Loyal Wolf"},
    {file:"59_WolfLamb.mp3", title:"59. The Wolf and the Lamb"},
    {file:"60_WolfSheep.mp3", title:"60. The Wolf in Sheep’s Clothing"},
    {file:"61_WoodcutterTrees.mp3", title:"61. The Woodcutter and the Trees"}
];

stations.forEach((s, i) => {
    const btn = document.createElement('div'); btn.className = 'station-tile';
    if(completedLessons.includes(s.file)) btn.classList.add('completed');
    btn.innerHTML = `<b>${i + 1}</b> ${s.title}`;
    btn.onclick = () => { 
        grid.classList.add('hidden'); playerZone.classList.remove('hidden'); 
        document.getElementById('now-playing-title').innerText = s.title; 
        audio.src = s.file; wordBucket = []; 
    };
    grid.appendChild(btn);
});

document.getElementById('btn-start').onclick = () => { splash.classList.add('hidden'); instr.classList.remove('hidden'); };
document.getElementById('btn-enter').onclick = () => { instr.classList.add('hidden'); app.classList.remove('hidden'); };
document.getElementById('btn-back').onclick = () => { location.reload(); };

document.getElementById('ctrl-play').onclick = () => audio.play();
document.getElementById('ctrl-pause').onclick = () => audio.pause();
document.getElementById('ctrl-stop').onclick = () => { audio.pause(); audio.currentTime = 0; };
document.getElementById('btn-blind').onclick = () => { transcript.classList.add('hidden'); gameZone.classList.add('hidden'); audio.play(); };

document.getElementById('btn-read').onclick = () => {
    if (typeof lessonData === 'undefined') { alert("🚨 Error: data.js failed to load!"); return; }
    let fn = decodeURIComponent(audio.src.split('/').pop()); 
    if(!lessonData[fn]) { alert("🚨 Error: Missing text for " + fn); return; }
    
    const data = lessonData[fn][0];
    transcript.classList.remove('hidden'); gameZone.classList.add('hidden'); transcript.innerHTML = "";
    data.text.split(" ").forEach(w => {
        const span = document.createElement('span'); 
        const clean = w.toLowerCase().replace(/[^a-z0-9ğüşöçı]/gi, "");
        span.innerText = w + " "; span.className = "clickable-word";
        span.onclick = (e) => {
            const tr = data.dict[clean];
            if(tr) {
                if (!wordBucket.some(p => p.en === clean)) wordBucket.push({en: clean, tr: tr});
                popup.innerText = tr; popup.style.left = `${e.clientX}px`; popup.style.top = `${e.clientY - 50}px`;
                popup.classList.remove('hidden'); setTimeout(() => popup.classList.add('hidden'), 2000);
            }
        };
        transcript.appendChild(span);
    });
    audio.play();
};

document.getElementById('btn-game').onclick = () => {
    let fn = decodeURIComponent(audio.src.split('/').pop()); 
    const lesson = lessonData[fn][0];
    transcript.classList.add('hidden'); gameZone.classList.remove('hidden'); feedbackArea.innerHTML = "";
    gameBoard.innerHTML = ""; firstCard = null; gameBoard.style.display = "grid";
    let set = [...wordBucket];
    for (let k in lesson.dict) { if (set.length >= 8) break; if (!set.some(p => p.en === k)) set.push({en: k, tr: lesson.dict[k]}); }
    let deck = [];
    set.forEach(p => { deck.push({text: p.en, match: p.tr}); deck.push({text: p.tr, match: p.en}); });
    deck.sort(() => Math.random() - 0.5);
    deck.forEach(card => {
        const div = document.createElement('div'); div.className = 'game-card'; div.innerText = card.text;
        div.onclick = () => {
            if (div.classList.contains('correct') || div.classList.contains('selected')) return;
            if (firstCard) {
                if (firstCard.innerText === card.match) {
                    div.classList.add('correct'); firstCard.classList.add('correct'); firstCard = null;
                } else {
                    div.classList.add('wrong'); setTimeout(() => { div.classList.remove('wrong'); firstCard.classList.remove('selected'); firstCard = null; }, 500);
                }
            } else { firstCard = div; div.classList.add('selected'); }
        };
        gameBoard.appendChild(div);
    });
};

document.getElementById('btn-bowling').onclick = () => {
    let fn = decodeURIComponent(audio.src.split('/').pop()); 
    const lesson = lessonData[fn][0];
    transcript.classList.add('hidden'); gameZone.classList.remove('hidden'); gameBoard.style.display = "none";
    currentQ = 0; totalScore = 0; attempts = 0;
    runQuiz(lesson);
};

function runQuiz(lesson) {
    if (currentQ >= 7) { finishQuiz(); return; }
    const qData = lesson.questions[currentQ];
    const storyNum = parseInt(decodeURIComponent(audio.src.split('/').pop()).substring(0,2));
    
    feedbackArea.innerHTML = `
        <div id="quiz-container">
            <div class="score-badge">SCORE: ${totalScore} | Q: ${currentQ+1}/7</div>
            <button id="btn-hear-q" class="mode-btn neon-green">👂 LISTEN TO QUESTION</button>
            <div id="mic-box" class="hidden" style="margin-top:20px;">
                <button id="btn-speak" class="mic-btn">🎤</button>
                <p id="mic-status" style="color:#666; font-weight:bold;">Ready...</p>
            </div>
            <div id="res-area"></div>
        </div>`;

    document.getElementById('btn-hear-q').onclick = () => {
        const utter = new SpeechSynthesisUtterance(qData.q);
        utter.lang = 'en-US'; // Forces English pronunciation for students on Turkish devices
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            let selectedVoice;
            if (storyNum % 2 !== 0) { // ODD stories = Neural2-F (Female fallback)
                selectedVoice = voices.find(v => (v.name.includes("Female") || v.name.includes("Zira") || v.name.includes("Google US English")) && v.lang.startsWith('en'));
            } else { // EVEN stories = Neural2-D (Male fallback)
                selectedVoice = voices.find(v => (v.name.includes("Male") || v.name.includes("David")) && v.lang.startsWith('en'));
            }
            utter.voice = selectedVoice || voices.find(v => v.lang.startsWith('en')) || voices[0];
        }
        utter.onend = () => { document.getElementById('mic-box').classList.remove('hidden'); };
        window.speechSynthesis.speak(utter);
    };

    document.getElementById('btn-speak').onclick = function() {
        const btn = this; const status = document.getElementById('mic-status');
        if (window.currentRec) { window.currentRec.abort(); }
        window.currentRec = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
        window.currentRec.lang = 'en-US';
        window.currentRec.interimResults = false;
        window.currentRec.onstart = () => { btn.classList.add('active'); status.innerText = "Listening..."; };
        window.currentRec.onresult = (e) => {
            document.getElementById('mic-box').classList.add('hidden'); 
            const res = e.results[0][0].transcript.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
            const ans = qData.a_en.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
            if (res === ans) {
                let pts = (attempts === 0) ? 20 : 15; totalScore += pts;
                showResult(true, pts === 20 ? "STRIKE! (+20)" : "SPARE! (+15)", qData, lesson);
            } else {
                attempts++;
                if (attempts === 1) { showResult(false, "MISS! TRY AGAIN", qData, lesson, true); }
                else { showResult(false, "MISS! (0 pts)", qData, lesson, false); }
            }
        };
        window.currentRec.onerror = () => { btn.classList.remove('active'); status.innerText = "Error. Try again."; };
        window.currentRec.start();
    };
}

function showResult(isCorrect, msg, qData, lesson, canRetry = false) {
    const area = document.getElementById('res-area');
    area.innerHTML = `<h1 style="color:${isCorrect?'#39ff14':'#f44'}; font-size: 50px;">${msg}</h1>`;
    if (isCorrect || !canRetry) {
        area.innerHTML += `
            <p class="quiz-q-text">Q: ${qData.q}</p>
            <p class="quiz-a-text">EN: ${qData.a_en}</p>
            <p style="color:#888; font-size:30px; font-weight: bold;">TR: ${qData.a_tr}</p>
            <button id="btn-nxt" class="action-btn-large" style="margin-top:30px;">NEXT QUESTION ⮕</button>`;
        document.getElementById('btn-nxt').onclick = () => { currentQ++; attempts = 0; runQuiz(lesson); };
    } else {
        area.innerHTML += `<button id="btn-retry" class="action-btn-large" style="margin-top:30px;">RETRY FOR SPARE</button>`;
        document.getElementById('btn-retry').onclick = () => {
            area.innerHTML = ""; document.getElementById('mic-box').classList.remove('hidden');
            document.getElementById('btn-speak').classList.remove('active');
            document.getElementById('mic-status').innerText = "Ready for Spare...";
        };
    }
}

function finishQuiz() {
    lifetimeScore += totalScore; localStorage.setItem('fablesScore', lifetimeScore);
    const fn = decodeURIComponent(audio.src.split('/').pop());
    if(!completedLessons.includes(fn)) {
        completedLessons.push(fn); localStorage.setItem('completedFablesLessons', JSON.stringify(completedLessons));
    }
    feedbackArea.innerHTML = `<h1 style="color:#ccff00; font-size: 60px;">FINISHED!</h1><h2 style="font-size: 40px;">QUIZ SCORE: ${totalScore}</h2><button onclick="location.reload()" class="action-btn-large">SAVE & RETURN</button>`;
}
