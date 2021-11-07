/* 

With apologies to MDN's Chris Mills, whose speak easy synthesis demo I have hacked 

Todo/idea list:
- Why are different voices offered on iPad
- disable iOS autocomplete?
- Add ability to control number of buttons
–- Use basic JS concepts like arrays & loops where needed :)
- 2nd sound doesn't fire if clicked before 1st is finished
- Ability to hide help text
- Set cookie for voice pref 
- Trigger speak() when rate and pitch change to make it quicker to test
- Analytics to log morphemes?
- Sharable URLs with presets (yeah)
- toggle back to intro view when all inputs are empty
*/ 


//---------------------------------
// Vars
var synth = window.speechSynthesis;

var form = document.querySelector('form');
var intro = document.querySelector('.intro');


// Need to create arrays from NodeLists (to call indexOf method later)
var buttons = Array.from(document.querySelectorAll('.play'));
var sounds = Array.from(document.querySelectorAll('.sound'));

// Hopefully we can ditch the IDs
var play1 = document.querySelector('#play-1');
var play2 = document.querySelector('#play-2');
var sound1 = document.querySelector('#sound-1');
var sound2 = document.querySelector('#sound-2');


var display = document.querySelector('#display');
var settings = document.querySelector('#settings');
var voiceSelect = document.querySelector('select');
var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');

var voices = [];


//---------------------------------
// Enable/disable buttons

// Event handlers for text inputs (could instead use forEach?)
for(var i=0; i<=sounds.length; i++) {
  if (typeof sounds[i] != 'undefined') {
    sounds[i].addEventListener('input', toggleButtons);
  }
}
// When text is added to an input: 
//  enable the corresponding button and add a click handler
// and when all text is deleted: 
//  disable the corresponding button
function toggleButtons(){
  // find button with corresponding index in button array
  var targetButton = buttons[sounds.indexOf(this)];
  var targetSound = this;
  if (this.value !== '') {
    targetButton.removeAttribute('disabled');    
    targetButton.onclick = function(event) {
      event.preventDefault();
      speak(targetSound);
    }
    appReady();
  } else {
    targetButton.setAttribute('disabled','true');
  }
}
// set class to show enabled buttons and hide disabled ones
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
  speak(sound1);
}


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

function speak(sound){

  // Use this to prevent dead clicks on other buttons
  if (synth.speaking) {
      console.error('speechSynthesis.speaking');
      return;
  }

  if (sound.value !== '') {
    
    // I can't explain why the new instance has to be called this
    var utterThis = new SpeechSynthesisUtterance(sound.value);

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
