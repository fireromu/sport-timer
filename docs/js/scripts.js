//--- VARIABLES / CONSTANTS ---------------------------------------------------
  var states = {
    'active' : {'time':30,'txt':'<i class="fas fa-running"></i> Training'},
    'pause'  : {'time':30, 'txt':'<i class="fas fa-bed"></i> Pause'}
  };
  var isActive = true;
  var isRunning = true;
  var isMuted = true;
  var time = states[getStateCode()]['time'];
  var sounds = {
    'countdown' : new Audio('media/countdown_1.wav'),
    'end'       : new Audio('media/end.wav')
  };

//--- INITIALIZATION ----------------------------------------------------------
  $("#state").html(getStateText());
  $("#timer").html(time);
  setTimerDataDiv(states['active']['time'],states['pause']['time']);

// --- EVENT TRIGGERED FUNCTIONS -----------------------------------------------
$(document).ready(function(){
  var x = setInterval(timerFunction, 1000);

  // Click on Pause Button
  $("#b-pause").click(function(){
    isRunning = !isRunning;
    if (isRunning){
      $('#b-pause').html('<i class="fas fa-pause"></i>');
      $('#timerBox #overlay').css("display","none");
    } else {
    $('#b-pause').html('<i class="fas fa-play"></i>');
    $('#timerBox #overlay').css("display","flex");
    }
  });

  // Click on Reset Button
  $("#b-reset").click(function(){
    isActive = true;
    time = Number($('#tc-'+getStateCode()+'-value').html());
    correctTimerBoxClasses();
    $("#state").html(getStateText());
    $("#timer").html(time);
  });

  // Click on Mute/Unmute Button
  $("#b-mute").click(function(){
    isMuted = !isMuted;
    if (!isMuted){
      $(this).html('<i class="fas fa-volume-mute"></i>');
    } else {
      $(this).html('<i class="fas fa-volume-up"></i>');
    }
  });

  //Click on Up/Down Buttons
  $(".timerConfigIconBox i").click(function(){
    var id = $(this).attr('id');
    var parts = id.split('-');
    var inputID = 'tc-'+parts[1]+'-value';
    var f = 0;

    if      (parts[2] == 'up')   f = Number(parts[3]);
    else if (parts[2] == 'down') f = -1 * Number(parts[3]);
    var val = Number($('#'+inputID).html()) + f;
    if (val < 0) val = 0;
    if (val > 600) val = 600;

    $('#'+inputID).html(val);
  });
});

//--- FUNCTIONS --------------------------------------------------------------
function getStateCode(){
  return (isActive?'active':'pause');
}

function getStateText(){
  return states[getStateCode()]['txt'];
}

function setTimerDataDiv(ta,tp){
  $('#tc-active-value').html(ta);
  $('#tc-pause-value').html(tp);
}

function correctTimerBoxClasses (){
  $("#timerBox").toggleClass("stateActive",isActive);
  $("#timerBox").toggleClass("statePause",!isActive);
}

function timerFunction() {
  if (isRunning) {
    var val = Number($('#tc-'+getStateCode()+'-value').html());
    if (time > val) {
      time = val;
    }

    time--;
    if (time < 0){
      isActive = !isActive;
      time = Number($('#tc-'+getStateCode()+'-value').html());
      if (time > 0) {
        correctTimerBoxClasses();
      } else {
        isActive = !isActive;
        time = Number($('#tc-'+getStateCode()+'-value').html());
      }
    } else if (!isMuted && (time == 3 || time == 2 || time == 1)) playCountdownSound();
    else if (!isMuted && (time == 0)) playEndSound();

    $("#state").html(getStateText());
    $("#timer").html(time);
  }
}

function playCountdownSound(){
  sounds['countdown'].volume = 0.7;
  sounds['countdown'].play();
}

function playEndSound(){
  sounds['end'].volume = 1;
  sounds['end'].play();
}
