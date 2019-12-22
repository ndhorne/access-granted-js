/*
Copyright 2018, 2019 Nicholas D. Horne

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
"use strict";

let pin, entry, entries;
let buttons = [];
let lcd = document.getElementById("lcd");
let resetDisplayTimeout;

for (let i = 0; i < 10; i++) {
  buttons[i] = document.getElementById("button" + i);
}

buttons.forEach(button => {
  button.addEventListener("click", event => {
    if (entry.length < 4) {
      entry += event.target.textContent;
      keyIn();
    }
  });
});

window.addEventListener("keydown", event => {
  if (/^\d$/.test(event.key)) {
    if (entry.length < 4) {
      entry += event.key;
      keyIn();
    }
  }
});

function updateDisplay() {
  lcd.style.backgroundColor = "darkgrey";
  lcd.textContent = entry;
}

function keyIn() {
  clearTimeout(resetDisplayTimeout);
  updateDisplay();
  if (entry.length == 4) {
    setTimeout(() => verifyEntry(), 500);
  }
}

function highlightKeys() {
  buttons.forEach(button => {
    button.style.backgroundColor = "";
  });
  for (let key of pin) {
    let button = document.getElementById("button" + key);
    button.style.backgroundColor = "orange";
  }
}

function updateEntries() {
  entries.push(entry);
}

function pinGen() {
  //shadow pin binding residing in global scope
  let pin = "";
  for (let i = 0; i < 4; i++) {
    pin += Math.floor(Math.random() * 10);
  }
  //print PIN to console for debugging (or cheating)
  //console.log(pin);
  return pin;
}

function initGame() {
  pin = pinGen();
  entry = "";
  entries = [];
  updateDisplay();
  highlightKeys();
}

function verifyEntry() {
  if (entry == pin) {
    lcd.textContent = "Access Granted";
    lcd.style.backgroundColor = "green";
    resetDisplayTimeout = setTimeout(() => updateDisplay(), 3000);
    updateEntries();
    alert("PIN " + pin + " cracked in " + entries.length +
      " attempt" + (entries.length > 1 ? "s" : ""));
    initGame();
  } else {
    lcd.textContent = "Access Denied";
    lcd.style.backgroundColor = "red";
    resetDisplayTimeout = setTimeout(() => updateDisplay(), 1500);
    updateEntries();
    entry = "";
  }
}

function newGame(event) {
  event.preventDefault();
  initGame();
}

function about(event) {
  alert("Access Granted JS\n" +
    "\n" +
    "A pointless diversion by Nicholas D. Horne\n" +
    "\n" +
    "Can you actually crack a four-digit PIN on your\n" +
    "first attempt as seen in the movies on a telltale\n" +
    "worn keypad? The \"worn\" keys contained in the\n" +
    "PIN have been highlighted on the keypad. PINs\n" +
    "are four digits in length. Digits may be repeated\n" +
    "resulting in PINs with less than four keys being\n" +
    "highlighted. PINs may begin with zero. Input is\n" +
    "accepted by way of both mouse primary button\n" +
    "and keyboard number keys.\n" +
    "\n" +
    "Source available at https://github.com/ndhorne");
  event.preventDefault();
}

initGame();

//display instructions dialog box upon page load
window.addEventListener("load", event => about(event));
