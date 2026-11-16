"use strict";

var pet_info = { name: "Miso", weight: 12, happiness: 60, energy: 70 };
var reactionRunning = false;
var reactionTimer;

var petComments = {
  treat: ["Thanks for the treat!", "Another snack? Yes, please.", "That was tasty!"],
  play: ["Throw it again!", "I caught it!", "Let’s keep playing!"],
  exercise: ["That was a long walk.", "My paws need a break.", "Can we head home now?"],
  nap: ["Time for a nap.", "Five more minutes, please.", "I feel rested!"]
};
var commentIndexes = { treat: 0, play: 0, exercise: 0, nap: 0 };

$(function () {
  checkAndUpdatePetInfoInHtml();
  $(".treat-button").click(clickedTreatButton);
  $(".play-button").click(clickedPlayButton);
  $(".exercise-button").click(clickedExerciseButton);
  $(".nap-button").click(clickedNapButton);

  var resetDialog = document.getElementById("reset-dialog");
  document.getElementById("reset-button").addEventListener("click", function () {
    resetDialog.showModal();
  });
  resetDialog.addEventListener("close", function () {
    if (resetDialog.returnValue === "reset") {
      resetPet();
    }
  });
});

function clickedTreatButton() {
  pet_info.happiness += 10;
  pet_info.weight += 1;
  finishAction("treat");
}

function clickedPlayButton() {
  if (!canMove(15)) {
    return;
  }
  pet_info.happiness += 15;
  pet_info.weight -= 1;
  pet_info.energy -= 15;
  finishAction("play");
}

function clickedExerciseButton() {
  if (!canMove(20)) {
    return;
  }
  pet_info.happiness -= 5;
  pet_info.weight -= 1;
  pet_info.energy -= 20;
  finishAction("exercise");
}

// Napping restores energy used by play and exercise.
function clickedNapButton() {
  pet_info.energy += 25;
  pet_info.happiness += 5;
  finishAction("nap");
}

function canMove(energyNeeded) {
  if (pet_info.weight <= 0) {
    $("#pet-comment").text("I’m hungry. Can I have a treat first?");
    return false;
  }
  if (pet_info.energy < energyNeeded) {
    $("#pet-comment").text("I’m tired. I need a nap first.");
    return false;
  }
  return true;
}

function finishAction(action) {
  checkAndUpdatePetInfoInHtml();
  var comments = petComments[action];
  var index = commentIndexes[action] % comments.length;
  $("#pet-comment").text(comments[index]);
  commentIndexes[action] += 1;
  queuePetReaction(action);
}

function checkAndUpdatePetInfoInHtml() {
  checkWeightAndHappinessBeforeUpdating();
  updatePetInfoInHtml();
}

function checkWeightAndHappinessBeforeUpdating() {
  // Clamp the values after every action so repeated clicks cannot make them negative.
  if (pet_info.weight < 0) {
    pet_info.weight = 0;
  }
  pet_info.happiness = Math.max(0, Math.min(100, pet_info.happiness));
  pet_info.energy = Math.max(0, Math.min(100, pet_info.energy));
}

function updatePetInfoInHtml() {
  $(".name").text(pet_info.name);
  $(".weight").text(pet_info.weight);
  $(".happiness").text(pet_info.happiness);
  $(".energy").text(pet_info.energy);
  document.getElementById("happiness-meter").value = pet_info.happiness;
  document.getElementById("energy-meter").value = pet_info.energy;

  var mood = "Happy";
  if (pet_info.weight === 0) {
    mood = "Needs a treat";
  } else if (pet_info.energy < 20) {
    mood = "Ready for a nap";
  } else if (pet_info.happiness < 30) {
    mood = "Unhappy";
  } else if (pet_info.happiness >= 80) {
    mood = "Very happy";
  }
  $("#mood").text(mood);
}

function queuePetReaction(action) {
  var scene = document.getElementById("scene");
  var symbols = { treat: "♥", play: "✦", exercise: "➜", nap: "z z Z" };

  // .queue("reactions", callback) adds a visual reaction to this scene's named queue.
  // Reading .queue("reactions").length counts waiting reactions; passing [] clears
  // them when four are waiting. Stats and comments still update on every action.
  // Each callback sets the pose and symbol for 1.2 seconds. Named queues do not start
  // automatically, so .dequeue("reactions") starts the first callback below.
  // https://api.jquery.com/queue/
  if ($(scene).queue("reactions").length >= 4) {
    $(scene).queue("reactions", []);
  }
  $(scene).queue("reactions", function () {
    reactionRunning = true;
    scene.dataset.action = action;
    $("#reaction-symbol").text(symbols[action]);
    reactionTimer = window.setTimeout(function () {
      scene.dataset.action = "idle";
      $("#reaction-symbol").text("");
      // The brief idle frame restarts the CSS animation for repeated activities.
      reactionTimer = window.setTimeout(function () {
        reactionRunning = false;
        // .dequeue("reactions") removes and runs the next waiting callback on this
        // scene. Calling it after the timer prevents overlapping reactions.
        // An empty queue leaves the cat idle. https://api.jquery.com/dequeue/
        $(scene).dequeue("reactions");
      }, 40);
    }, 1200);
  });
  if (!reactionRunning) {
    $(scene).dequeue("reactions");
  }
}

function resetPet() {
  window.clearTimeout(reactionTimer);
  $("#scene").queue("reactions", []);
  reactionRunning = false;
  document.getElementById("scene").dataset.action = "idle";
  $("#reaction-symbol").text("");
  pet_info = { name: "Miso", weight: 12, happiness: 60, energy: 70 };
  commentIndexes = { treat: 0, play: 0, exercise: 0, nap: 0 };
  checkAndUpdatePetInfoInHtml();
  $("#pet-comment").text("Hi! Can we play?");
}
