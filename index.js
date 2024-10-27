let linesCount = 6;
let planeCount = 6;
let rotateOffset = -90;

let previousTrack = 0;
let currentTrack = 0;
let currentDuration = 0;

let isTitleEdit = false;

let currentAudioSource = null;

let isPaused = true;
let isDrag = false;

let isPlayerOn = false;

let is3D = false;
let isCircles = false;

let volume = 0.5;
let currentVolume = 0.5;

let isRepeatOne = false;
let isShuffle = false;

let isMuted = false;
let keyTrigger = false;

let songTrack;



window.addEventListener('load',()=>{
    document.getElementById('big-title').style.top = `${(document.getElementById('audio-spectrum-container').getBoundingClientRect().height - 70)/2 - document.getElementById('big-title').offsetHeight/2}px`;
    document.getElementById('big-title').style.left = `${window.innerWidth/2 - document.getElementById('big-title').offsetWidth/2}px`;


    // if(window.innerWidth <= 800){
    //     is3D = true;
    // } else {
    //     is3D = false;
    // }    
});

function generatePlane(j,deg){
    let plane = document.createElement('div');
    plane.id = `plane-${j}`;
    plane.classList.add('plane');
    document.getElementById('circles-spectrum-container').appendChild(plane);
    for(let i=0;i<linesCount;i++){
        let line = document.createElement('div');
        line.classList.add('line');
        line.style.transform = `rotateZ(${i*(360/linesCount)}deg) rotateX(${deg}deg)`;
        document.getElementById(`plane-${j}`).appendChild(line);
    }
}

function  initializePlaylist(folderInput){
    if(audioContext.state === "suspended"){
        isPlayerOn = true;
        document.getElementById('playlist').classList.remove('hide');
        isPaused = false;
        audioContext.resume();
    }
    let playlist = document.getElementById('playlist');
    for(let i=0;i<folderInput.files.length;i++){
        let playlistItem = document.createElement('div');
        playlistItem.classList.add('playlist-item');
        playlistItem.id = `track-${i}`;
        playlistItem.addEventListener('click',()=>{
            selectTrack(i,playlistItem);
        })
        playlistItem.innerHTML = `${folderInput.files[i].name.substr(0,folderInput.files[i].name.lastIndexOf('.'))}`;
        playlist.appendChild(playlistItem);
        audio.src = URL.createObjectURL(folderInput.files[0]);
        // playlist.insertAdjacentHTML('beforeend',`
        //     <div class='playlist-item' id='track-${i}' onclick='selectTrack(i)'>
        //     ${folderInput.files[i].name.substr(0,folderInput.files[i].name.lastIndexOf('.'))}
        //     </div>
        //     `)

            
    }
}

function selectTrack(i,playlistItem){
    if(document.getElementById('slider').classList.contains('hide')){
        document.getElementById('player-controls').classList.add('selectable');
        document.getElementById('slider').classList.remove('hide');

        
    }
    if(document.getElementById('play-pause-icon').classList.contains('fa-play')){
        document.getElementById('play-pause-icon').classList.replace('fa-play','fa-pause');
    }
    currentTrack = i;
    audio.pause();
    audio.currentTime = 0;
    let folderInput = document.getElementById('folder-input');
    let songName = `${folderInput.files[i].name}`;
    const tempURL = URL.createObjectURL(folderInput.files[i]);
    audio.src = tempURL;
    if(audioContext.state !== 'suspended')
    document.getElementById('track-name').innerText = `${songName.substring(0,songName.lastIndexOf('.'))}`;
    // //console.log('current track: ' + i);
    playlistItem.classList.add('current-track');
    document.getElementById(`track-${previousTrack}`).classList.remove('current-track');
    document.getElementById(`track-${previousTrack}`).classList.remove('selected');
    previousTrack = i;
    playlistItem.classList.add('current-track');
    playlistItem.classList.add('selected');
    currentAudioSource = audio.src;
    audio.play();
}

function playNext(){
    if(isPaused === true){
        isPaused = false;
    }
    let songsLength = document.getElementById('playlist').children.length;
    if(isShuffle){

        let randomTrack = Math.floor(Math.random()*songsLength);
        currentTrack = randomTrack;
        selectTrack(randomTrack,document.getElementById(`track-${randomTrack}`));

    } else {

        currentTrack = (currentTrack + 1)%songsLength;
        audio.pause();
        audio.currentTime = 0;
        selectTrack(currentTrack,document.getElementById(`track-${currentTrack}`));

    }
}

function playPrevious(){
    if(isPaused === true){
        isPaused = false;
    }
    let songsLength = document.getElementById('playlist').children.length;
    if(isShuffle){

        let randomTrack = Math.floor(Math.random()*songsLength);
        currentTrack = randomTrack;
        selectTrack(randomTrack,document.getElementById(`track-${randomTrack}`));

    } else {

        currentTrack = (currentTrack - 1 + songsLength)%songsLength;
        audio.currentTime = 0;
        selectTrack(currentTrack,document.getElementById(`track-${currentTrack}`));

    }
}

document.getElementById('next-track-container').addEventListener('click',()=>{
    if(!isPlayerOn)return;
    playNext();
});

document.getElementById('previous-track-container').addEventListener('click',()=>{
    if(!isPlayerOn)return;
    playPrevious();
})

for(let a=0;a<planeCount;a++){
    generatePlane(a,rotateOffset);
    rotateOffset+=(90/(planeCount/2));
}

//Audio

let audio = document.createElement('audio');
audio.id='current-audio-track';
audio.src = null;
// audio.src = 'Jim Yosef  Alex Skrindo - Ruby  Future Trap  NCS - Copyright Free Music.mp3';
document.getElementById('container').appendChild(audio);

document.getElementById('current-audio-track').addEventListener('loadedmetadata',()=>{
    //console.log(audio.duration);
});

let audioContext = new window.AudioContext();

const track = audioContext.createMediaElementSource(audio);

const analyser = audioContext.createAnalyser();
analyser.fftSize = 512;

track.connect(analyser);
analyser.connect(audioContext.destination);

// audio.play();
function initializeAudioBars(barsCount){
    document.querySelector('.audio-bars-container').innerHTML = "";
    for(let i=0;i<barsCount;i++){
        const bar = document.createElement('div');
        bar.classList.add('audio-bar');
        document.querySelector('.audio-bars-container').appendChild(bar);
    }
}


function initializeCirclesAudioBars(barsCount){
    document.querySelector('.circles-spectrum-2d-container').innerHTML = "";
    for(let i=0;i<barsCount;i++){
        const bar = document.createElement('div');
        bar.classList.add('circles-spectrum-bar');
        bar.style.transform = `rotate(${2*i}deg)`;

        const glowElement = document.createElement('div');
        glowElement.classList.add('glow-element');
        glowElement.style.transform = `rotate(${2*i}deg) translateY(150px)`;

        document.querySelector('.circles-spectrum-2d-container').appendChild(bar);
        // document.querySelector('.circles-spectrum-2d-container').appendChild(glowElement);
        
    }
}


let barsCount = Math.floor(0.7*analyser.frequencyBinCount);
initializeAudioBars(barsCount);

let circleBarsCount = Math.floor(0.6*analyser.frequencyBinCount);
    initializeCirclesAudioBars(circleBarsCount);

    // Align circles 2d spectrum near big title
    document.getElementById('circles-spectrum-2d-container').style.top = `${window.innerHeight/2 - document.getElementById('circles-spectrum-2d-container').offsetHeight/2 - 150}px`;
    document.getElementById('circles-spectrum-2d-container').style.left = `${window.innerWidth/2 - document.getElementById('circles-spectrum-2d-container').offsetWidth/2 - 160}px`;

const frequencyData = new Uint8Array(analyser.frequencyBinCount);

if(audioContext.state !== 'suspended')
document.getElementById('track-name').innerText = `${audio.src.substring(audio.src.lastIndexOf('/')+1).split("%20").join(" ")}`;

function updateFrequencyData(){

    analyser.getByteFrequencyData(frequencyData);

    
    

    // 3D Spectrum

    //Random color


    if(is3D){

        //enable 3d spectrum and disable 2d spectrum

        document.getElementById('audio-bars-container').classList.add('hide');
        document.getElementById('circles-spectrum-2d-container').classList.add('hide');
        document.getElementById('circles-spectrum-container').classList.remove('hide');

        let randomColors = [Math.random()*255,Math.random()*255,Math.random()*255];
        let frequencyIndex = 0;
        for(let i=0;i<planeCount;i++){
            for(let j=0;j<linesCount;j++){
                document.getElementById(`plane-${i}`).getElementsByClassName('line')[j].style.height = `${(frequencyData[frequencyIndex%analyser.frequencyBinCount]/2.2)}px`;
                frequencyIndex++;
                //Random colors
                // document.getElementById(`plane-${i}`).getElementsByClassName('line')[j].style.background = `linear-gradient(rgb(${randomColors[0]},${randomColors[1]},${randomColors[2]}) 3px,rgb(${Math.max(0,(frequencyData[Math.floor(0.7*analyser.frequencyBinCount)]))},0,${Math.max(0,frequencyData[Math.floor(0.6*analyser.frequencyBinCount)])}) 3px )`;
                //Static color
                // document.getElementById(`plane-${i}`).getElementsByClassName('line')[j].style.background = `linear-gradient(yellow 3px,rgb(${Math.max(0,(frequencyData[Math.floor(0.7*analyser.frequencyBinCount)]))},0,${Math.max(0,frequencyData[Math.floor(0.6*analyser.frequencyBinCount)])}) 3px )`;
                //Intensity color
                document.getElementById(`plane-${i}`).getElementsByClassName('line')[j].style.background = `linear-gradient(rgb(${255 - Math.max(0,(frequencyData[Math.floor(0.7*analyser.frequencyBinCount)]))},255,${255 - Math.max(0,frequencyData[Math.floor(0.6*analyser.frequencyBinCount)])}) 3px,rgb(${Math.max(0,(frequencyData[Math.floor(0.7*analyser.frequencyBinCount)]))},0,${Math.max(0,frequencyData[Math.floor(0.6*analyser.frequencyBinCount)])}) 3px )`;
        }
    }
    
        
    } else {

        if(isCircles){

            setTimeout(() => {
                
                document.getElementById('circles-spectrum-2d-container').style.top = `${window.innerHeight/2 - document.getElementById('circles-spectrum-2d-container').offsetHeight/2 - 50}px`;
                document.getElementById('circles-spectrum-2d-container').style.left = `${window.innerWidth/2 - document.getElementById('circles-spectrum-2d-container').offsetWidth/2}px`;
            }, 1);

            document.getElementById('circles-spectrum-container').classList.add('hide');
document.getElementById('circles-spectrum-2d-container').classList.remove('hide');
document.getElementById('audio-bars-container').classList.add('hide');


               // Circles Spectrum

    for(let i=0;i<circleBarsCount;i++){

        // From left to right increasing frequency
        document.getElementsByClassName('circles-spectrum-bar')[i].style.height = `${(frequencyData[i] + 50)}px`;

        //toggle glow element intensity based on  bar height
        // if(document.getElementsByClassName('circles-spectrum-bar')[i].getBoundingClientRect().height > 110){
        //     console.log('opacity: ', `${(parseFloat(document.getElementsByClassName('circles-spectrum-bar')[i].getBoundingClientRect().height)/300)}`);
        //     document.getElementsByClassName('glow-element')[i].style.opacity = `${(parseFloat(document.getElementsByClassName('circles-spectrum-bar')[i].style.height)/300)}`;
        // }

        //alter the gradient at the circumference based on frequency

        //keep code here



        // document.getElementsByClassName('circles-spectrum-bar')[i].style.background = `linear-gradient(rgb(${Math.max(0,(frequencyData[Math.floor(0.7*analyser.frequencyBinCount)]))},0,${Math.max(0,frequencyData[Math.floor(0.6*analyser.frequencyBinCount)])}) 110px, (rgb(${255 - Math.max(0,(frequencyData[Math.floor(0.7*analyser.frequencyBinCount)]))},255,${255 - Math.max(0,frequencyData[Math.floor(0.6*analyser.frequencyBinCount)])}) 110px`;

        document.getElementsByClassName('circles-spectrum-bar')[i].style.background = `linear-gradient(rgb(${Math.max(0,(frequencyData[Math.floor(0.7*analyser.frequencyBinCount)]))},0,${Math.max(0,frequencyData[Math.floor(0.6*analyser.frequencyBinCount)])}) 110px, (rgb(${255 - Math.max(0,(frequencyData[Math.floor(0.7*analyser.frequencyBinCount)]))},255,${255 - Math.max(0,frequencyData[Math.floor(0.6*analyser.frequencyBinCount)])}) 110px`;

        // From right to left increasing frequency
        // document.getElementsByClassName('circles-spectrum-bar')[circleBarsCount - i - 1].style.height = `${(frequencyData[i] + 50)}px`;
        // document.getElementsByClassName('circles-spectrum-bar')[circleBarsCount - i - 1].style.background = `linear-gradient(rgb(${Math.max(0,(frequencyData[Math.floor(0.7*analyser.frequencyBinCount)]))},0,${Math.max(0,frequencyData[Math.floor(0.6*analyser.frequencyBinCount)])}) 110px, (rgb(${255 - Math.max(0,(frequencyData[Math.floor(0.7*analyser.frequencyBinCount)]))},255,${255 - Math.max(0,frequencyData[Math.floor(0.6*analyser.frequencyBinCount)])}) 110px`;
    }


        } else {
//disable other spectrums and enable 2d bars spectrum

document.getElementById('circles-spectrum-container').classList.add('hide');
document.getElementById('circles-spectrum-2d-container').classList.add('hide');
document.getElementById('audio-bars-container').classList.remove('hide');

// 2D Spectrum

for(let i=0;i<barsCount;i++){
document.getElementsByClassName('audio-bar')[i].style.height = `${(frequencyData[i])}px`;
}



}
        }

        

 

    


    
    



    // //console.log(frequencyData);

    document.getElementById('big-title').querySelector('h1').style.fontSize = `${Math.max(80,(frequencyData[4]/2)+20)}px`;
    document.getElementById('audio-spectrum-container').style.backgroundColor = `rgb(${Math.max(0,(frequencyData[Math.floor(0.7*analyser.frequencyBinCount)]))},0,${Math.max(0,frequencyData[Math.floor(0.6*analyser.frequencyBinCount)])})`;
    requestAnimationFrame(updateFrequencyData);
}

function trackSliderInterval(){

    songTrack = setInterval(() => {
        
    
        if(!isDrag)
        updateTime();

        if(audio.readyState > 0 && !isDrag){
            currentDuration = audio.currentTime;
            document.getElementById('slider-input').value = (currentDuration/audio.duration)*100;
            document.getElementById('slider-input').dispatchEvent(new Event('input'));
            // //console.log(document.getElementById('slider-input').value);
    
            //update time
    
        }
    }, 100);


}
    
    

document.getElementById('slider-input').addEventListener('input',()=>{
    let value = document.getElementById('slider-input').value;
    currentDuration = (value/100)*audio.duration;
    clearInterval(songTrack);
    document.getElementById('slider-input').style.background = `linear-gradient(to right,#eee ${value}%, #333 ${value}%)`;
    updateTime();
    trackSliderInterval();
    // //console.log('current duration: ',currentDuration);
});

document.getElementById('slider-input').addEventListener('mousedown',()=>{
    isDrag = true;
});

document.getElementById('slider-input').addEventListener('mouseup',()=>{
    isDrag = false;
});

document.getElementById('slider-input').addEventListener('change',()=>{
    // audio.pause();
    audio.currentTime = currentDuration;

    setTimeout(() => {
        if(!isPaused){
            audio.play();
        }
    }, 1);
})

document.getElementById('play-pause-container').addEventListener('click',()=>{
    if(!isPlayerOn)return;
    if(isPaused){
        document.getElementById('play-pause-icon').classList.replace('fa-play','fa-pause');
        audio.play();
    } else {
        document.getElementById('play-pause-icon').classList.replace('fa-pause','fa-play');
        audio.pause();
    }
    isPaused = !isPaused;
});

// When audio can be played or paused via external methods (bluetooth headsets)

audio.addEventListener('pause',()=>{
    document.getElementById('play-pause-icon').classList.replace('fa-pause','fa-play');
    audio.pause();
    isPaused = true;
});
audio.addEventListener('play',()=>{
    document.getElementById('play-pause-icon').classList.replace('fa-play','fa-pause');
        audio.play();
        isPaused = false;
});

document.addEventListener('keydown',(e)=>{
    if(!isPlayerOn || isTitleEdit)return;
    if(e.key === "ArrowRight"){
        console.log("Seek right");
        audio.currentTime = Math.min(audio.duration,audio.currentTime+5);
    } else if (e.key === "ArrowLeft"){
        audio.currentTime = Math.max(0,audio.currentTime-5);
    }
    console.log(e.key);
    if(e.key === " "){

        if(isPaused){
            document.getElementById('play-pause-icon').classList.replace('fa-play','fa-pause');
            audio.play();
        } else {
            document.getElementById('play-pause-icon').classList.replace('fa-pause','fa-play');
            audio.pause();
        }
        isPaused = !isPaused;
    } else if(e.key === "m"){
        keyTrigger = true;
        
        isMuted = !isMuted;

        
    if(isMuted){
        document.getElementById('volume-control-slider-input').value = '0';
        document.getElementById('volume-control-slider-input').dispatchEvent(new Event('input'));
    } else {
        document.getElementById('volume-control-slider-input').value = currentVolume;
        document.getElementById('volume-control-slider-input').dispatchEvent(new Event('input'));
        // setVolume(volume);
    }
    keyTrigger = false;
    
    
    } else if(audio.readyState > 0){
        
         if(e.key === "n"){
            playNext();
        } else if(e.key === "p"){
            playPrevious();
        } else if(e.key === "r"){
            if(!document.getElementById('repeat').classList.contains('hide')){
                //repeat all button currently
                document.getElementById('repeat').classList.add('hide');
                document.getElementById('repeat-one').classList.remove('hide');
                isRepeatOne = true;
            } else {
                //repeat one button currently
                document.getElementById('repeat').classList.remove('hide');
                document.getElementById('repeat-one').classList.add('hide');
                isRepeatOne = false;
            }

        } else if(e.key === "s"){
            if(!document.getElementById('shuffle').classList.contains('hide')){
                //shuffle button currently
                document.getElementById('shuffle').classList.add('hide');
                document.getElementById('no-shuffle').classList.remove('hide');
                isShuffle = false;

            } else {
                //no shuffle button currently
                document.getElementById('shuffle').classList.remove('hide');
                document.getElementById('no-shuffle').classList.add('hide');
                isShuffle = true;
            }

        } 
    }
});

requestAnimationFrame(updateFrequencyData);
document.getElementById('')
//console.log(audio.duration);

function updateTime(){
    let timeElapsed = document.getElementById('time-elapsed');
        let minutes = Math.floor(currentDuration/60);
        let seconds = Math.floor(currentDuration)%60;
        if(seconds < 10){
            timeElapsed.innerHTML = `${minutes}:0${seconds%60}`;
        } else {
            timeElapsed.innerHTML = `${minutes}:${Math.floor(seconds)%60}`;
        }
        let totalMinutes = Math.floor(audio.duration/60);
        let totalSeconds = Math.floor(audio.duration)%60;
        if(totalSeconds < 10){
            timeElapsed.innerHTML += ` / ${totalMinutes}:0${totalSeconds}`;
        } else {
            timeElapsed.innerHTML += ` / ${totalMinutes}:${totalSeconds}`;
        }
}



trackSliderInterval();

document.getElementById('folder-input').addEventListener('change',()=>{
    let folderInput = document.getElementById('folder-input'); 
    folderInput.style.display = 'none';
    //console.log(folderInput.files);
    console.log('all songs: ');
    for(let i=0;i<folderInput.files.length;i++){
        console.log(folderInput.files[i].name);
    }
     initializePlaylist(folderInput);
});

document.getElementById('current-audio-track').addEventListener('ended',()=>{
    audio.pause();
    setTimeout(() => {
        audio.currentTime = 0;
        if(isRepeatOne){
            audio.play();
            return;
        } else {
            if(isShuffle){
                let randomTrack = Math.floor(Math.random()*document.getElementById('playlist').children.length);
                selectTrack(randomTrack,document.getElementById(`track-${randomTrack}`));
            } else {
                playNext();
            }
        }
    }, 2000);
});

//initial volume
audio.volume = 0.5;
document.getElementById('volume-control-slider-input').style.background = `linear-gradient(to right,#eee ${0.5*100}%, #333 ${0.5*100}%)`;


//dispatch

document.getElementById('volume-control-slider-input').addEventListener('input',()=>{
    console.log(isMuted);

    if(!isMuted){
        if(!keyTrigger){
            volume = document.getElementById('volume-control-slider-input').value;
            setVolume(volume);
        } else {
            setVolume(currentVolume);
        }
    } else {
        if(!keyTrigger){
            if(document.getElementById('volume-control-slider-input').value > '0'){
                volume = document.getElementById('volume-control-slider-input').value;
                isMuted = false;
                setVolume(volume);
            }
        }
        setVolume('0');
    }
    
});

document.getElementById('volume-control-slider-input').addEventListener('change',()=>{
    let volumeInput = document.getElementById('volume-control-slider-input');
    if(volumeInput.value > '0'){
        currentVolume = volumeInput.value;
    } else {
        isMuted = true;
    }
});

function setVolume(volume){

    console.log('volume set to: ',volume);

    audio.volume = volume;
    document.getElementById('volume-control-slider-input').style.background = `linear-gradient(to right,#eee ${volume*100}%, #333 ${volume*100}%)`;

    if(volume === '0'){
        document.getElementById('volume-control-icon').querySelector('i').classList = "fas fa-volume-mute";
    }
     else {
        document.getElementById('volume-control-icon').querySelector('i').classList = "fa fa-volume-up";
    }

    

}

window.addEventListener('resize',()=>{

    document.getElementById('big-title').style.top = `${(document.getElementById('audio-spectrum-container').getBoundingClientRect().height - 70)/2 - document.getElementById('big-title').offsetHeight/2}px`;
    document.getElementById('big-title').style.left = `${window.innerWidth/2 - document.getElementById('big-title').offsetWidth/2}px`;
    
    if(!isPlayerOn)return;
    
    document.getElementById('circles-spectrum-2d-container').style.top = `${window.innerHeight/2 - document.getElementById('circles-spectrum-2d-container').offsetHeight/2 - 50}px`;
    document.getElementById('circles-spectrum-2d-container').style.left = `${window.innerWidth/2 - document.getElementById('circles-spectrum-2d-container').offsetWidth/2}px`;
    if(window.innerWidth <= 800){
        

        barsCount = Math.floor(0.4*analyser.frequencyBinCount);

        initializeAudioBars(barsCount);

        // if(!is3D){
   
        //     toggleSpectrum('3D');
        //     document.getElementById('circles-spectrum-container').classList.remove('hide');
        //     document.getElementById('audio-bars-container').classList.add('hide');
        // }
    } else {
        

        barsCount = Math.floor(0.7*analyser.frequencyBinCount);

        initializeAudioBars(barsCount);

        // toggleSpectrum('2D');
        // document.getElementById('audio-bars-container').classList.remove('hide');
        // document.getElementById('circles-spectrum-container').classList.add('hide');
    }
})

// Toggle 2D/3D Spectrum


function toggleSpectrum(spectrum){
    let toggleBackground = document.getElementById('toggle-background');
    if(spectrum === '2D'){
        toggleBackground.style.left = '0';
        is3D = false;
        isCircles = false;
        // toggleBackground.classList.replace('right','left');
    } else if(spectrum === '3D'){
        toggleBackground.style.left = '33%';
        is3D = true;
        isCircles = false;
        // toggleBackground.classList.replace('left','right');
    } else if(spectrum === 'circles'){
        is3D = false;
        isCircles = true;
        toggleBackground.style.left = '66%';
    }
}

document.querySelectorAll('.toggle-tile').forEach((tile)=>{
    
    tile.addEventListener('click',()=>{
        if(!isPlayerOn)return;
    console.log('click')
    let toggleBackground = document.getElementById('toggle-background');

    if(tile.id === '2D'){
        toggleSpectrum('2D');
    } else if(tile.id === '3D'){
        toggleSpectrum('3D');

    } else if(tile.id === 'circles'){
        toggleSpectrum('circles');

    }
})
    
});

document.getElementById('big-title-edit-input').addEventListener('keydown',(e)=>{
    let input = document.getElementById('big-title-edit-input');
    if(e.key === "Enter"){
        if(input.value !== ""){
            document.getElementById('big-title').querySelector('h1').innerText = input.value;
            document.getElementById('big-title').style.top = `${(document.getElementById('audio-spectrum-container').getBoundingClientRect().height - 70)/2 - document.getElementById('big-title').offsetHeight/2}px`;
            document.getElementById('big-title').style.left = `${window.innerWidth/2 - document.getElementById('big-title').offsetWidth/2}px`;
            input.value = "";

        }
    }
})

document.getElementById('big-title-edit-input').addEventListener('focus',()=>{
    isTitleEdit = true;
});

document.getElementById('big-title-edit-input').addEventListener('blur',()=>{
    document.getElementById('big-title-edit-input').value = "";
    isTitleEdit = false;
});

document.querySelectorAll('.shuffle-repeat').forEach((button)=>{
    button.addEventListener('click',()=>{

        if(button.id.includes('shuffle')){

            if(button.id === 'shuffle'){
                //shuffle button currently
                document.getElementById('shuffle').classList.add('hide');
                document.getElementById('no-shuffle').classList.remove('hide');
                isShuffle = false;

            } else {
                //no shuffle button currently
                document.getElementById('shuffle').classList.remove('hide');
                document.getElementById('no-shuffle').classList.add('hide');
                isShuffle = true;
            }
        } else {
            if(button.id === 'repeat'){
                //repeat all button currently
                document.getElementById('repeat').classList.add('hide');
                document.getElementById('repeat-one').classList.remove('hide');
                isRepeatOne = true;
            } else {
                //repeat one button currently
                document.getElementById('repeat').classList.remove('hide');
                document.getElementById('repeat-one').classList.add('hide');
                isRepeatOne = false;
            }
        }
    });
});

document.getElementById('volume-control-icon').addEventListener('click',()=>{
    
isMuted = !isMuted;
    
if(isMuted){
    document.getElementById('volume-control-slider-input').value = '0';
    document.getElementById('volume-control-slider-input').dispatchEvent(new Event('input'));
} else {
    document.getElementById('volume-control-slider-input').value = currentVolume;
    document.getElementById('volume-control-slider-input').dispatchEvent(new Event('input'));
    // setVolume(volume);
}
});