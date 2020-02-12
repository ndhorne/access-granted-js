/*
Copyright 2018-2020 Nicholas D. Horne

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

let pin, entry, entries, status;
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
  highlightKeys();
}

function verifyEntry() {
  if (entry == pin) {
    lcd.textContent = "Access Granted";
    lcd.style.backgroundColor = "green";
    resetDisplayTimeout = setTimeout(() => updateDisplay(), 3000);
    updateEntries();
    status = "PIN " + pin + " cracked in " + entries.length +
      " attempt" + (entries.length > 1 ? "s" : "");
    alert(status);
    initGame();
    return true;
  } else {
    lcd.textContent = "Access Denied";
    lcd.style.backgroundColor = "red";
    resetDisplayTimeout = setTimeout(() => updateDisplay(), 1500);
    updateEntries();
    entry = "";
    return false;
  }
}

function newGame(event) {
  initGame();
  updateDisplay();
  event.preventDefault();
}

function about(event) {
  let aboutText =
    "Access Granted JS\n" +
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
    "Source available at https://github.com/ndhorne";
  alert(aboutText);
  event.preventDefault();
}

function autoSolve(event) {
  let uniqueDigits = [];
  let inferences = [];
  let solved = false;
  
  for (let i = 0; i <= 9; i++) {
    if (pin.includes(i) && !uniqueDigits.includes(i)) {
      uniqueDigits.push(i);
    }
  }
  
  if (uniqueDigits.length == 4) {
    inferences.push(uniqueDigits.join(""));
  } else if (uniqueDigits.length == 3) {
    for (let i = 0; i <= 2; i++) {
      inferences.push(uniqueDigits.join("") + uniqueDigits[i]);
    }
  } else if (uniqueDigits.length == 2) {
    for (let i = 0; i <= 1; i++) {
      inferences.push(uniqueDigits.join("") + uniqueDigits[i] +
        uniqueDigits[i]);
    }
    inferences.push(uniqueDigits.join("") + uniqueDigits[0] +
      uniqueDigits[1]);
  } else if (uniqueDigits.length == 1) {
    inferences.push(uniqueDigits.join("") + uniqueDigits[0] +
      uniqueDigits[0] + uniqueDigits[0]);
  } else {
    console.log("uniqueDigits has bad length");
  }
  
  for (let inference of inferences) {
    let i;
    
    for(let j = 0; j <= 3; j++) {
      i = inference.slice(0);
      
      if (j == 1) {
        i = i[1] + i[0] + i[2] + i[3];
      } else if (j == 2) {
        i = i[2] + i[0] + i[1] + i[3];
      } else if (j == 3) {
        i = i[3] + i[0] + i[1] + i[2];
      }
      
      entry = i.slice(0);
      solved = verifyEntry();
      for(let k = 0; k <= 2; k++) {
        if (!solved) {
          entry = (i = i[0] + i[1] + i[3] + i[2]).slice(0);
          solved = verifyEntry();
          if (k == 2) {
            break;
          }
          if (!solved) {
            entry = (i = i[0] + i[2] + i[1] + i[3]).slice(0);
            solved = verifyEntry();
          } else {
            break;
          }
        } else {
          break;
        }
      }
      if (solved) {
        break;
      }
    }
    if (solved) {
      break;
    }
  }
  event.preventDefault();
}

initGame();

//display instructions dialog box upon page load
window.addEventListener("load", event => about(event));
