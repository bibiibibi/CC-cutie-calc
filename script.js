// ---------- Grab things from the page ----------
const display = document.getElementById("display");
const buttons = document.getElementById("buttons");

// ---------- Variables that remember what's happening ----------
let current = "0";       // the number you're typing (kept as text)
let previous = null;     // the first number, saved when you press an operator
let operator = null;     // +, −, ×, or ÷
let startNew = false;    // true means: the next digit should start a fresh number

// ---------- Show the whole calculation on the screen ----------
function updateDisplay() {
  if (operator !== null) {
    // Still working on a calculation: show "9 ×" or "9 × 9"
    if (startNew) {
      display.textContent = previous + " " + operator;
    } else {
      display.textContent = previous + " " + operator + " " + current;
    }
  } else {
    // No calculation in progress: just show the number (like the result after equals)
    display.textContent = current;
  }
}

// ---------- Typing numbers ----------
function inputNumber(digit) {
  if (current === "0" || startNew) {
    current = digit;       // replace the screen
    startNew = false;
  } else {
    current = current + digit;  // add to the end
  }
}

function inputDecimal() {
  if (startNew) {
    current = "0.";
    startNew = false;
    return;
  }
  if (!current.includes(".")) {
    current = current + ".";
  }
}

// ---------- Choosing + − × ÷ ----------
function chooseOperator(op) {
  if (isNaN(parseFloat(current))) return;  // ignore if the screen shows an error

  // If we already have a pending calculation (like 2 + 3 then pressing +), finish it first
  if (operator !== null && !startNew) {
    calculate();
  }

  previous = parseFloat(current);
  operator = op;
  startNew = true;
}

// ---------- Doing the maths ----------
function calculate() {
  if (operator === null) return;
  if (startNew) return;  // no second number yet, so nothing to calculate

  const a = previous;
  const b = parseFloat(current);
  let result;

  if (operator === "+") result = a + b;
  if (operator === "−") result = a - b;
  if (operator === "×") result = a * b;
  if (operator === "÷") {
    if (b === 0) {
      showError();
      return;
    }
    result = a / b;
  }

  // toFixed/parseFloat tidies up things like 0.1 + 0.2 = 0.30000000000000004
  result = parseFloat(result.toFixed(10));

  current = String(result);
  operator = null;
  previous = null;
  startNew = true;
}

function showError() {
  current = "oops ♡";
  operator = null;
  previous = null;
  startNew = true;
}

// ---------- Clear and delete ----------
function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  startNew = false;
}

function deleteLast() {
  if (startNew || isNaN(parseFloat(current))) return;
  current = current.slice(0, -1);
  if (current === "" || current === "-") current = "0";
}

// ---------- Listen for button clicks ----------
// One listener on the whole grid; we check which button was clicked.
buttons.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    inputNumber(button.dataset.number);
  } else if (button.dataset.operator !== undefined) {
    chooseOperator(button.dataset.operator);
  } else if (button.dataset.action === "decimal") {
    inputDecimal();
  } else if (button.dataset.action === "equals") {
    calculate();
  } else if (button.dataset.action === "clear") {
    clearAll();
  } else if (button.dataset.action === "delete") {
    deleteLast();
  }

  updateDisplay();
});

updateDisplay();
