/* 

With apologies to MDN's Chris Mills, whose speak easy synthesis demo I have hacked 

Todo/idea list:
- Add ability to control number of buttons
–- Use basic JS concepts like arrays & loops where needed :)
- 2nd sound doesn't fire if clicked before 1st is finished
- Ability to hide help text
- Set cookie for voice pref 

*/ 


//---------------------------------
// Vars
var synth = window.speechSynthesis;

var form = document.querySelector('form');
var intro = document.querySelector('.intro');
var play1 = document.querySelector('#play-1');
var play2 = document.querySelector('#play-2');
var utterance1 = document.querySelector('#utterance-1');
var utterance2 = document.querySelector('#utterance-2');


var display = document.querySelector('#display');
var settings = document.querySelector('#settings');
var voiceSelect = document.querySelector('select');
var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');

var voices = [];

//---------------------------------
// Voice list

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });
  var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = '';
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

//---------------------------------
// Speak

function speak(utterance){
    console.log('speak ' + utterance);
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (utterance.value !== '') {
    var utterThis = new SpeechSynthesisUtterance(utterance.value);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}

play1.onclick = function(event) {
  event.preventDefault();
  speak(utterance1);
  // play1.blur();
}
play2.onclick = function(event) {
  event.preventDefault();
  speak(utterance2);
  // play2.blur();
}

//---------------------------------
// Enable/disable buttons

// Check on keystroke
utterance1.addEventListener('input', toggleButtons);
utterance2.addEventListener('input', toggleButtons);

function toggleButtons(){
  if (utterance1.value !== '') {
    play1.removeAttribute('disabled');
    appReady()
  } else {
    play1.setAttribute('disabled','true');
  }
  if (utterance2.value !== '') {
    play2.removeAttribute('disabled');
    appReady()
  } else {
    play2.setAttribute('disabled','true');
  }
}

function appReady() {
  form.classList.add('ready');
}

//---------------------------------
// Getting started

function scrollTo(target){
  target.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start'
  });
}
document.querySelector('.display-link').onclick = function() {
  event.preventDefault();
  scrollTo(display);
}
document.querySelector('.settings-link').onclick = function() {
  event.preventDefault();
  scrollTo(settings);
}

//---------------------------------
// Audio settings

pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
}
rate.onchange = function() {
  rateValue.textContent = rate.value;
}

voiceSelect.onchange = function(){
  speak(utterance1);
}

