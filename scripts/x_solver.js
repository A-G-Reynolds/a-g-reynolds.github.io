//AUTHOR: A G Reynolds, April 2026
//Error Code 2000
//Translated from C Language. Primary differences are that the cstack becomes a plain js array. the output string is built the same way (char by char), but instead of null-termination, we join and trim. Null char check for end of string ('\0') is replaced with 'i >= input.length'. errors are written to output div. 

//function declaration with parameters

///SHUNTING YARD
function alg2rpn(input) {

    //declaring variables doesn't require type
    let i = -1;
    let o = 0;
    let nextstate = 0;

    //javascript doesn't need a stack. In js, an array accepts all variable times, and memory is automatically allocated and and automatically freed, so the infrastructure of stacks is no longer needed. This is implicit memory management, or garbage collection.  
    let top = [];
    let output = [];

    while(true) { 
        switch (nextstate) {
            case 0: 
                i++;
                if ( ( digit(input[i]) ) || ( variable(input[i]) ) ) 
                    nextstate = 1;
                else if (operator(input[i]))
                    nextstate = 2;
                else if (input[i] == '(')
                    nextstate = 3;
                else if (input[i] == ')')
                    nextstate = 4;
                
                //No end-of-string marker - instead, compare current position to total length of input.
                else if (i >= input.length)
                    nextstate = 5;
                else
                    nextstate = 6;
                break;

            case 1: 
                while ((digit(input[i])) || (variable(input[i]))) {
                    if (variable(input[i])) {
                        if (o > 0) {
                            if (output[o - 1] === ' ') {
                                output[o] = 'x';
                                o++;
                                i++;
                            } else if ((digit(output[o-1])) || (variable(output[o-1]))) {
                                //no reason to check if stack is empty or full, just push/pop char to array as needed
                                top.push('*');
                                output[o] = ' ';
                                o++;
                                output[o] = 'x';
                                o++;
                                i++;
                            } else {
                                return { error: true, code: 2083, msg: "ERROR 2083: Invalid Input."};
                            }
                        } else {
                            output[o] = 'x';
                            o++;
                            i++;
                        }
                    } else {
                        output[o] = input[i];
                        o++;
                        i++;
                    }
                }
                output[o] = ' ';
                o++;
                i--;
                nextstate = 0; 
                break;

            case 2:
                if ( (input[i] === '^') && (input[i+1] !== '2') ) {
                    return { error: true, code: 2104, msg: "ERROR 2104: Degree Value Not Supported."};
                    exit(0);   
                }

                while ( (top.length > 0) && (operator(top[top.length - 1])) && precedence(input[i], top[top.length -1])) {
                    output[o] = top.pop();
                    o++;
                    output[o] = ' ';
                    o++;
                }

                top.push(input[i]);
                nextstate = 0;
                break;
            
            case 3: 
                top.push(input[i]);
                nextstate = 0;
                break;

            case 4: 
                while (top.length > 0 && top[top.length - 1] !== '(') {
                    output[o] = top.pop();
                    o++;
                    output[o] = ' ';
                    o++;
                }
                if (top.length > 0) {
                    top.pop();
                } else {
                    return {error: true, code: 2134, msg: "ERROR 2134: Mismatch."};
                }
                nextstate = 0;
                break;

            case 5: 
                while ((top.length > 0) && operator(top[top.length - 1])) {
                    output[o] = top.pop();
                    o++;
                    output[o] = ' ';
                    o++;
                }
                if (top.length > 0) {
                    return {error: true, code: 2147, msg: "ERROR 2147: Invalid Input."};
                }
                else {
                    output[o] = '\0';
                    return {error: false, result: output.join('').replace(/\0/g, '').trim() };
                }
            
            case 6:
                return {error: true, code: 2155, msg: "ERROR 2155: Invalid Input"};
        }

    }
}

//RPN EVALUATOR:
function rpneval(input, x) {
    let i = -1;
    let nextstate = 0;
    let index = 0;
    let top = [];
    let temp_index = [];
    let ans;
    let val;
    let calcResult;
    let num1;
    let num2;
 
    while(true) {
        switch(nextstate) {
            case 0:
                i++;
                if (operator(input[i]))
                    nextstate = 1;
                else if (digit(input[i]))
                    nextstate = 2;
                else if (space(input[i]))
                    nextstate = 4;
                else if (i >= input.length)
                    nextstate = 5;
                else if (variable(input[i]))
                    nextstate = 6;
                else
                    nextstate = 7;
                break;

            case 1:
                if (top.length > 0) {
                    num2 = top.pop();
                    if (top.length > 0) {
                        num1 = top.pop();

                        calcResult = calculate(num1, num2, input[i]);
                        if (calcResult && calcResult.error) return calcResult;
                        top.push(calcResult);
                        nextstate = 0;
                        } else {
                        return {error: true, code: 2198, msg: "ERROR 2198: Invalid Input"};
                    }
                } else {
                    return {error: true, code: 2201, msg: "ERROR 2201: Invalid Input"};
                }
                break;
            
            case 2:
                temp_index[index++] = input[i];
                i++;

                if(digit(input[i]))
                    nextstate = 2;
                else
                    nextstate = 3;
                break
            
            case 3:
                temp_index[index] = '\0';
                val = parseFloat(temp_index.join(''));
                top.push(val);
                index = 0;
                temp_index = [];
                i--;
                nextstate = 0;
                break;

            case 4: 
                nextstate = 0;
                break;

            case 5:
                if (top.length >0) {
                    ans = top.pop();
                }
                else {
                    return {error: true, code: 2234, msg:"ERROR 2234: No Stack Result."};
                }
                if (top.length > 0) {
                    return {error: true, code: 2237, msg:"ERROR 2237: Invalid RPN."};
                }
                return {error: false, result: ans};
            
            case 6: 
                top.push(x);
                nextstate = 0;
                break;

            case 7:
                return {error: true, code: 2247, msg:"ERROR 2247: Invalid Input"};
        }
    }
}

//UTILITIES

function operator(c) {
    return ( (c == '+') || (c == '-') || (c == '*') || (c == '/') || (c == '^'));
}

function digit(c) {
    return ( ( (c >= '0') && (c <= '9') ) || (c == '.') );
}

function space(c){
    return (c == ' ');
}

function variable(c){
    return (c !== undefined && c.toLowerCase() === 'x');
}

function calculate(num1, num2, opr) {
    let ans;

    switch(opr) {
        case '+':
            ans = num1 + num2;
            break;
        case '-':
            ans = num1 - num2;
            break;
        case '*':
            ans = num1 * num2;
            break;
        case '/':
            if (num2 !== 0)
                ans = num1 / num2;
            else {
                return {error: true, code: 2287, msg: "ERROR 2287: Division by Zero"};
            }
            break;
        case '^':
            ans = Math.pow(num1, num2);
            break;
    }
    return ans;
}

function precedence(o1, o2) {
    let order1, order2;

    switch (o1) {
        case '+': order1 = 1;
            break;
        case '-': order1 = 1;
            break;
        case '*': order1 = 2;
            break;
        case '/': order1 = 2;
            break;
        case '^': order1 = 3;
            break;
    }
    switch (o2) {
        case '+': order2 = 1;
            break;
        case '-': order2 = 1;
            break;
        case '*': order2 = 2;
            break;
        case '/': order2 = 2;
            break;
        case '^': order2 = 3;
            break;
    }
    return (order1 <= order2);
}

function linear(b, c) {
    let x = -c / b;
    return `${+x.toFixed(6)}`; 
}

function real(a, b, c) {
    let x = (-b + Math.sqrt(b*b - 4*a*c)) / (2*a);
    let xx = (-b - Math.sqrt(b*b - 4*a*c)) / (2*a);
    return `{${+x.toFixed(6)}, ${+xx.toFixed(6)}}`;
}

function quad(a, b, c) {
    if((b*b - 4*a*c) < 0) {
        return complex(a, b, c);
    }
    else{
        return real(a, b, c);
    }
}

function complex(a, b, c) {
    let xr = -b / (2.0 *a);
    let xi = Math.sqrt(Math.abs(b*b - 4*a*c))/(2.0 * a);
    return `{${+xr.toFixed(6)} + ${+xi.toFixed(6)}i, ${+xr.toFixed(6)} - ${+xi.toFixed(6)}i}`
}

const solver = {
    //string for shunting yard
    expr: "",

    //string shown in calc display
    display: "",

    inExp: false,

    pressNum(val) {
        if (this.inExp) {
            this.display
        }    this.expr += val;
        this.display += val;
        document.getElementById("solver_display").innerHTML = this.display;
    },

    pressX(){
        this.expr += "x";
        this.display += "x"
        document.getElementById("solver_display").innerHTML = this.display;;
    },

    pressSquare() {
        this.expr += "^2";
        this.display += "<sup>2</sup>";
        document.getElementById("solver_display").innerHTML = this.display;;
    },
    
    pressOpr(op) {
        this.expr += op;
        this.display += op;
        document.getElementById("solver_display").innerHTML = this.display;;
    },
    
    pressOpnCls(p) {
        this.expr += p;
        this.display += p;
        document.getElementById("solver_display").innerHTML = this.display;;
    },
    
    clear() {
        this.expr = "";
        this.display = "";
        document.getElementById("solver_display").textContent = "0";
        document.getElementById("solver_output").innerHTML = "";
    },

    toggle() {
        if (this.expr === "" || this.expr === "0") return;
        if (this.expr.startsWith("-")) {
            this.expr = this.expr.slice(1);
            this.display = this.display.startsWith("-") ? this.display.slice(1) : this.display;
        }
        else {
            this.expr = "-" + this.expr;
            this.display = "-" + this.display;
        }
        document.getElementById("solver_display").innerHTML = this.display;;
    },

    back() {
        if (this.expr === "") return;

        if(this.expr.endsWith("^2")) {
            this.expr = this.expr.slice(0, -2);
            this.display = this.display.replace(/<sup>2<\/sup>$/,"");
        }
        else {
            this.expr = this.expr.slice(0,-1);
            this.display = this.display.slice(0, -1);
        }
        document.getElementById("solver_display").innerHTML = this.display;;
    },

    solve() { 
        let outputDiv = document.getElementById("solver_output");

        if(this.expr === "") {
            outputDiv.innerHTML += `<p class='message funct_error'>ERROR 2368: Void Entry</p>`;
            return;
        }

        let rpn = alg2rpn(this.expr);
        if(rpn.error) {
            outputDiv.innerHTML += `<p class='message funct_error'>${rpn.msg}</p>`;
            return;
        }

        let res1 = rpneval(rpn.result, -1);
        if(res1.error) {
            outputDiv.innerHTML += `<p class='message funct_error'>${res1.msg}</p>`;
            return;
        }

        let res2 = rpneval(rpn.result, 1);
        if(res2.error) {
            outputDiv.innerHTML += `<p class='message funct_error'>${res2.msg}</p>`;
            return;
        }

        let resC = rpneval(rpn.result, 0);
        if(resC.error) {
            outputDiv.innerHTML += `<p class='message funct_error'>${resC.msg}</p>`;
            return;
        }

        let c = resC.result;
        let a = (res1.result + res2.result - 2 * c ) / 2;
        let b = res2.result - a - c;

        let solution;

        if (a === 0) {
            if (b === 0) {
                outputDiv.innerHTML += `<p class ='message funct_error'>ERROR 2404: Degenerate Equation</p>`;
                return;
            }
            else {
                solution = linear(b, c);
            }
        }
        else {
            solution = quad(a, b, c);
        }
        document.getElementById("solver_display").innerHTML = solution;
        outputDiv.innerHTML += `<p class='message'>${this.expr} &nbsp;&rarr;&nbsp; ${solution}</p>`
        document.getElementById("solver_display").innerHTML = this.display;

        this.expr = "";
        this.display = "";
        document.getElementById("solver_display").innerHTML = this.display;;
    }
}