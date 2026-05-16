// Error Code 1000 

(function() {
    emailjs.init("_azclRLt19xXjsyLx");
})();

function calculateSphere() {
    let rad = document.getElementById("sphere_r").value;
    let vol = document.getElementById("sphere_output");

    vol.innerHTML = "";

    if (rad === "") {
       vol.innerHTML = "<p class='message funct_error'>Cannot Accept Void Input.</p>";
        return;
    }

    const r = Number(rad);

    if (isNaN(r) || r < 0) {
        vol.innerHTML = "<p class='message funct_error'>Invalid Input.</p>";
        return;
    }

    const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
    vol.innerHTML = `<p class='message'>RADIUS: <strong>${r}</strong> | VOLUME = <strong>${volume.toFixed(4)}</strong> cubic units</p>`;
}

function submitContact(event) {
    event.preventDefault();
    
    const status = document.getElementById("contact_status");
    const submitBtn = document.querySelector(".contact_submit");
    const emailVal = document.getElementById("contact_email").value;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

    if(!emailOk) {
        status.innerHTML= "<p class='message funct_error'>Please Enter a Valid Email Address.</p>";
        return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    status.innerHTML = "";
    
    emailjs.sendForm("service_28si41m", "template_simutd8", "#contact_form")
        .then(() => {
            status.innerHTML = "<p class='message' style='color: #40c936;'>Message Sent! I'll be in touch soon!</p>";
            document.getElementById("contact_form").reset();
            submitBtn.disabled = false;
            submitBtn.textContent = "Send";
        })
        .catch((err)=> {
            console.error("EmailJS Error:", err);
            status.innerHTML = "<p class='message funct_error'>Something went wrong. Please try again.</p>";
            submitBtn.disabled = false;
            submitBtn.textContent = "Send";
        });
}

function resetPanel(outputId, inputId) {
    document.getElementById(outputId).innerHTML = "";
    if (inputId) document.getElementById(inputId).value = "";
}

function resetContact() {
    document.getElementById("contact_status").innerHTML = "";
}

function product() {
    let a = document.getElementById("product_a").value;
    let b = document.getElementById("product_b").value;

    if (a === "" || b === "") {
        document.getElementById("product_output").innerHTML +=
            "<p class='message funct_error'>Cannot Accept Void Entry.</p>";
        return;
    }

    a = Number(a);
    b = Number(b);

    if (isNaN(a) || isNaN(b)) {
        document.getElementById("product_output").innerHTML +=
            "<p class='message funct_error'>Invalid Input.</p>";
        return;
    }

    let result = a * b;
    document.getElementById("product_output").innerHTML +=
        `<p class='message'>${a} &times; ${b} = <strong>${result}</strong></p>`;
}

let lowestNumbers = [];

function lowestAdd() {
    let input = document.getElementById("lowest_input").value;

    if (input === "") {
        document.getElementById("lowest_output").innerHTML +=
            "<p class='message funct_error'>Cannot Accept Void Entry.</p>";
        return;
    }

    let num = Number(input);

    if (isNaN(num)) {
        document.getElementById("lowest_output").innerHTML +=
            "<p class='message funct_error'>Invalid Input.</p>";
        return;
    }

    lowestNumbers.push(num);
    document.getElementById("lowest_output").innerHTML +=
        `<p class='message'>Added: <strong>${num}</strong></p>`;
    document.getElementById("lowest_input").value = "";
}

function lowestDone() {
    if (lowestNumbers.length === 0) {
        document.getElementById("lowest_output").innerHTML +=
            "<p class='message funct_error'>No Numbers Were Entered.</p>";
        return;
    }

    let min = lowestNumbers[0];
    for (let i = 1; i < lowestNumbers.length; i++) {
        if (lowestNumbers[i] < min) min = lowestNumbers[i];
    }

    document.getElementById("lowest_output").innerHTML +=
        `<p class='message'>Entered: <strong>${lowestNumbers.join(", ")}</strong></p>` +
        `<p class='message'>Lowest: <strong>${min}</strong></p>`;

    lowestNumbers = [];
}

function rangeDone() {
    if (lowestNumbers.length === 0) {
        document.getElementById("lowest_output").innerHTML +=
            "<p class='message funct_error'>No Numbers Were Entered.</p>";
        return;
    }

    let min = lowestNumbers[0];
    let max = lowestNumbers[0];
    for (let i = 1; i < lowestNumbers.length; i++) {
        if (lowestNumbers[i] < min) min = lowestNumbers[i];
        if (lowestNumbers[i] > max) max = lowestNumbers[i];
    }

    let range = max - min;

    document.getElementById("lowest_output").innerHTML +=
        `<p class='message'>Entered: <strong>${lowestNumbers.join(", ")}</strong></p>` +
        `<p class='message'>Lowest: <strong>${min}</strong></p>`  +
        `<p class='message'>Highest: <strong>${max}</strong></p>` +
        `<p class='message'>Range: <strong>${range}</strong></p>`;

    lowestNumbers = [];
}

// Fibonacci 
function fibonacci() {
    let input = document.getElementById("fib_input").value;

    if (input === "") {
        document.getElementById("fib_output").innerHTML +=
            "<p class='message funct_error'>The Form Cannot be Void.</p>";
        return;
    }

    let count = Number(input);

    if (isNaN(count) || !Number.isInteger(count) || count < 2 || count > 100) {
        document.getElementById("fib_output").innerHTML +=
            "<p class='message funct_error'>Invalid Input.</p>";
        return;
    }

    let fibs = [];
    fibs[0] = 0;
    fibs[1] = 1;

    for (let n = 2; n < count; n++) {
        fibs[n] = fibs[n - 1] + fibs[n - 2];
    }

    let output = "";
    for (let i = 0; i < count; i++) {
        output += `<span class="fib_num">f(${i}) = ${fibs[i]}</span>`;
    }

    document.getElementById("fib_output").innerHTML +=
        `<div class="fib_grid">${output}</div>`;
}

// Factorial  n! = n x (n-1) x (n-2) x ... x 1
function factorial() {
    let input = document.getElementById("factorial_input").value;

    if (input === "") {
        document.getElementById("factorial_output").innerHTML +=
            "<p class='message funct_error'>Cannot Accept Void Entry.</p>";
        return;
    }

    let n = Number(input);

    if (isNaN(n) || !Number.isInteger(n) || n < 0) {
        document.getElementById("factorial_output").innerHTML +=
            "<p class='message funct_error'>Invalid Input. Enter a non-negative integer.</p>";
        return;
    }

    if (n > 20) {
        document.getElementById("factorial_output").innerHTML +=
            "<p class='message funct_error'>Input too large. Maximum is 20.</p>";
        return;
    }

    let result = 1;
    let steps  = n === 0 ? "0" : "";

    for (let i = n; i >= 1; i--) {
        result *= i;
        steps  += (i === n) ? `${i}` : ` \u00d7 ${i}`;
    }

    document.getElementById("factorial_output").innerHTML +=
        `<p class='message'>${n}! = ${steps} = <strong>${result}</strong></p>`;
}

// Bubble Sort
let sortNumbers = [];

function sortAdd() {
    let input = document.getElementById("sort_input").value;

    if (input === "") {
        document.getElementById("sort_output").innerHTML +=
            "<p class='message funct_error'>Cannot Accept Void Entry.</p>";
        return;
    }

    let num = Number(input);

    if (isNaN(num)) {
        document.getElementById("sort_output").innerHTML +=
            "<p class='message funct_error'>Invalid Input.</p>";
        return;
    }

    sortNumbers.push(num);
    document.getElementById("sort_output").innerHTML +=
        `<p class='message'>Added: <strong>${num}</strong></p>`;
    document.getElementById("sort_input").value = "";
}

function sortDone() {
    if (sortNumbers.length === 0) {
        document.getElementById("sort_output").innerHTML +=
            "<p class='message funct_error'>No Numbers Were Entered.</p>";
        return;
    }

    let unsorted = [...sortNumbers];

    let n = sortNumbers.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = n - 1; i < j; j--) {
            if (sortNumbers[j - 1] > sortNumbers[j]) {
                let temp           = sortNumbers[j - 1];
                sortNumbers[j - 1] = sortNumbers[j];
                sortNumbers[j]     = temp;
            }
        }
    }

    document.getElementById("sort_output").innerHTML +=
        `<p class='message'>Before: <b>${unsorted.join(", ")}</b></p>` +
        `<p class='message'>After: <b>${sortNumbers.join(" < ")}</b></p>`;

    sortNumbers = [];
}


function resetLowest() {
    lowestNumbers = [];
    resetPanel("lowest_output", "lowest_input");
}

function resetSort() {
    sortNumbers = [];
    resetPanel("sort_output", "sort_input");
}

// Standard Calculator
const calculator = {
    current: "",
    op: "",
    prev: "",
    fresh: false,

    pressNum(val) {
        if (this.fresh) {
            this.current = "";
            this.fresh = false;
        }
        this.current += val;
        document.getElementById("calc_display").textContent = this.current;
    },

    pressOpr(o) {
        if (this.current === "") return;
        if (this.prev !== "") this.equals(true);
        this.op   = o;
        this.prev = this.current;
        this.current = "";
    },

    equals(more) {
        if (this.prev === "" || this.current === "") return;

        let a = parseFloat(this.prev);
        let b = parseFloat(this.current);
        let result;

        if      (this.op === "+") result = a + b;
        else if (this.op === "-") result = a - b;
        else if (this.op === "*") result = a * b;
        else if (this.op === "/") {
            if (b === 0) {
                document.getElementById("calc_display").textContent = "Error";
                this.current = this.prev = this.op = "";
                return;
            }
            result = a / b;
        }

        result = parseFloat(result.toFixed(10));
        document.getElementById("calc_display").textContent = result;
        this.prev    = more ? String(result) : "";
        this.fresh   = !more;
        this.current = String(result);
    },

    clear() {
        this.current = this.op = this.prev = "";
        this.fresh = false;
        document.getElementById("calc_display").textContent = "0";
    },

    squareVolume() {
        if (this.current === "") return;
        let result = parseFloat(this.current) ** 2;
        result = parseFloat(result.toFixed(10));
        document.getElementById("calc_display").textContent = result;
        this.prev    = this.current;
        this.current = String(result);
        this.fresh   = true;
    },

    percent() {
        if (this.current === "") return;
        let result = parseFloat(this.current) / 100;
        result = parseFloat(result.toFixed(10));
        document.getElementById("calc_display").textContent = result;
        this.prev    = this.current;
        this.current = String(result);
        this.fresh   = true;
    },

    toggle() {
        if (this.current === "" || this.current === "0") return;
        if (this.current.startsWith("-")) {
            this.current = this.current.slice(1);
        } else {
            this.current = "-" + this.current;
        }
        document.getElementById("calc_display").textContent = this.current;
    }
}

