"use strict";

var pet_info = { name: "Miso", weight: 12, happiness: 60, energy: 70 };
var activityCount = 0;
var reactionRunning = false;
var reactionTimer;

var petComments = {
  treat: ["A snack? For me? You really get me.", "I heard the treat bag from the other room.", "I’ll accept this as an apology for the empty bowl."],
  play: ["That ball never stood a chance.", "Again! Wait, let me catch my breath.", "I meant to land like that. Obviously."],
  exercise: ["A whole workout? I was built for lounging.", "Fine. But I’m taking the sunny spot after this.", "That counts as cardio for the week, right?"],
  nap: ["Wake me when it’s snack time.", "Just five more minutes. Maybe twenty.", "Dreaming of a very large bowl of treats."]
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

// Nap is the extra action: it restores energy used by play and exercise.
function clickedNapButton() {
  pet_info.energy += 25;
  pet_info.happiness += 5;
  finishAction("nap");
}

function canMove(energyNeeded) {
  if (pet_info.weight <= 0) {
    $("#pet-comment").text("My tummy’s empty. A treat before we move?");
    return false;
  }
  if (pet_info.energy < energyNeeded) {
    $("#pet-comment").text("I’m all out of zoomies. Let’s take a nap first.");
    return false;
  }
  return true;
}

function finishAction(action) {
  activityCount += 1;
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
  $("#activity-count").text(activityCount);
  document.getElementById("happiness-meter").value = pet_info.happiness;
  document.getElementById("energy-meter").value = pet_info.energy;

  var mood = "Feeling good";
  if (pet_info.weight === 0) {
    mood = "Needs a treat";
  } else if (pet_info.energy < 20) {
    mood = "Ready for a nap";
  } else if (pet_info.happiness < 30) {
    mood = "Needs some love";
  } else if (pet_info.happiness >= 80) {
    mood = "On cloud nine";
  }
  $("#mood").text(mood);
}

function queuePetReaction(action) {
  var scene = document.getElementById("scene");
  var symbols = { treat: "♥", play: "✦", exercise: "➜", nap: "z z Z" };

  // .queue() stores reaction functions on the scene in a custom queue named "reactions".
  // Each function changes the cat's pose and symbol for 650 ms. A named queue does
  // not start automatically, so .dequeue() starts it when no reaction is running.
  // Limit waiting reactions to four so rapid clicks do not create a long backlog;
  // stats and the speech bubble still update immediately for every accepted action.
  // Documentation: https://api.jquery.com/queue/
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
        // .dequeue() removes and runs the next function from "reactions" on this
        // same scene. Calling it after the timer keeps reactions from overlapping.
        // When the queue is empty, nothing runs and the cat stays in its idle pose.
        // Documentation: https://api.jquery.com/dequeue/
        $(scene).dequeue("reactions");
      }, 40);
    }, 650);
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
  activityCount = 0;
  commentIndexes = { treat: 0, play: 0, exercise: 0, nap: 0 };
  checkAndUpdatePetInfoInHtml();
  $("#pet-comment").text("A fresh start. Same favorite human.");
}
