//AUTHOR: A G Reynolds, April 2026
//last updated 5/01/26 5:32 pm
//Error Code 3000
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
    let term = "";
    let tempNum=[];

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
                            if ((input[i+1] === '^') && (digit(input[i+2]))) {
                                term += tempNum.join('');
                                term += 'x';
                                term += input[i+2];
                                term += ' ';
                                tempNum = [];
                            }
                            
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
                                return { error: true, code: 2083, msg: "ERROR 3067: Invalid Input."};
                            }

                        } else {
                            if ((input[i+1] === '^') && (digit(input[i+2]))) {
                                term += '1x';
                                term += input[i+2];
                                term += ' ';
                            }
                            output[o] = 'x';
                            o++;
                            i++;
                        }

                    } else {
                        output[o] = input[i];
                        tempNum.push(input[i]);
                        o++;
                        i++;
                    }
                }
                output[o] = ' ';
                o++;
                i--;
                tempNum = [];
                nextstate = 0; 
                break;

            case 2:
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
                    return {error: true, code: 2134, msg: "ERROR 3122: Mismatch."};
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
                    return {error: true, code: 2147, msg: "ERROR 3135: Invalid Input."};
                }
                else {
                    output[o] = '\0';

                    let allTerms = term.split(' ').filter(t => t.length > 0);
                    let term0 = null, term1 = null, term2 = null, term3 = null, term4 = null;
                    for (let k = 0; k < allTerms.length; k++) {
                        let t = allTerms[k];
                        let deg = t[t.length - 1];
                        
                        if (deg === '4') term4 = t;
                        else if (deg === '3') term3 = t;
                        else if (deg === '2') term2 = t;
                        else if (deg === '1') term1 = t;
                    }

                    return {error: false, result: output.join('').replace(/\0/g, '').trim(), term0, term1, term2, term3, term4
                    };
                }
            
            case 6:
                return {error: true, code: 2155, msg: "ERROR 3157: Invalid Input"};
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
                        return {error: true, code: 2198, msg: "ERROR 3207: Invalid Input"};
                    }
                } else {
                    return {error: true, code: 2201, msg: "ERROR 3210: Invalid Input"};
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
                    return {error: true, code: 2234, msg:"ERROR 3243: No Stack Result."};
                }
                if (top.length > 0) {
                    return {error: true, code: 2237, msg:"ERROR 3246: Invalid RPN."};
                }
                return {error: false, result: ans};
            
            case 6: 
                top.push(x);
                nextstate = 0;
                break;

            case 7:
                return {error: true, code: 2247, msg:"ERROR 3256: Invalid Input"};
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
                return {error: true, code: 2287, msg: "ERROR 3296: Division by Zero"};
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

function getFacts(n) {
    let abs = Math.abs(Math.round(n));
    if (abs === 0) return [1];
    let factors = [];
    for (let i=1; i <= abs; i++) {
        if (abs % i === 0) 
            factors.push(i);
    }
    return factors;
}

function syntheticDiv(coeffs, root) {
    let result = [coeffs[0]];
    for (let i = 1; i < coeffs.length; i++)
        result.push(result[result.length -1] * root + coeffs[i]);
    result.pop();
    return result;
}

function format(r) {
    r = +r.toFixed(6);
    if (r === 0) return `(x)`;
    if (r < 0) return `(x + ${Math.abs(r)})`;
    return `(x - ${r})`;
}

const factoringEq = {
    //string for shunting yard
    expr: "",

    //string shown in calc display
    display: "",
    exponent: false,

    pressNum(val) {
        if(this.exponent){
            this.expr += "^"+val;
            this.display += "<sup>" +val+ "</sup>";
            this.exponent = false;
        } else {
        this.expr += val;
        this.display += val;
        }
        document.getElementById("factoringEq_display").innerHTML = this.display;
    },

    pressX(){
        this.exponent = false;
        this.expr += "x";
        this.display += "x"
        document.getElementById("factoringEq_display").innerHTML = this.display;
    },

    pressSquare() {
        this.exponent = true;
    },
    
    pressOpr(op) {
        this.exponent = false;
        this.expr += op;
        this.display += op;
        document.getElementById("factoringEq_display").innerHTML = this.display;
    },
    
    pressOpnCls(p) {
        this.exponent = false;
        this.expr += p;
        this.display += p;
        document.getElementById("factoringEq_display").innerHTML = this.display;
    },
    
    clear() {
        this.expr = "";
        this.display = "";
        this.exponent = false;
        document.getElementById("factoringEq_display").textContent = "0";
        document.getElementById("factoringEq_output").innerHTML = "";
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
        document.getElementById("factoringEq_display").innerHTML = this.display;
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
        document.getElementById("factoringEq_display").innerHTML = this.display;
    },

    solve() { 
        this.exponent = false;
        let outputDiv = document.getElementById("factoringEq_output");

        if(this.expr === "") {
            outputDiv.innerHTML += `<p class='message funct_error'>ERROR 3468: Void Entry</p>`;
            return;
        }

        let rpn = alg2rpn(this.expr);
        if(rpn.error) {
            outputDiv.innerHTML += `<p class='message funct_error'>${rpn.msg}</p>`;
            return;
        }

        let degree = 0;
        let q = 1; // q = leading coefficient
        
        if (rpn.term4) {
            degree = 4;
            q = parseFloat(rpn.term4.slice(0, -2));
        } 
        else if (rpn.term3) {
            degree =3;
            q = parseFloat(rpn.term3.slice(0, -2));
        }
        else if (rpn.term2) {
            degree =2;
            q = parseFloat(rpn.term2.slice(0, -2));
        }
            
        else if (rpn.term1) {
            degree = 1;
            q = parseFloat(rpn.term1.slice(0, -2));
        } 

        if (degree >= 5) {
            outputDiv.innerHTML += `<p class='message funct_error'>ERROR 3500: Abel-Ruffini</p>`;
            return;
        }

        let resC = rpneval(rpn.result, 0);
        if(resC.error) {
            outputDiv.innerHTML += `<p class='message funct_error'>${resC.msg}</p>`;
            return;
        }

        let p = resC.result; //constant term
        let solution;
        let factoredForm;
        
        if (degree <= 2) {
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

            let a = (res1.result + res2.result - 2 * p ) / 2;
            let b = res2.result - a - p;

            if (a === 0) {
                if (b === 0) {
                    outputDiv.innerHTML += `<p class ='message funct_error'>ERROR 3532: Degenerate Equation</p>`;
                    return;
                }
                else {
                    solution = linear(b, p);
                    factoredForm = format(parseFloat(linear(b,p)));
                }
            }
            else {
                let disc = b*b - 4*a*p;
                let prefix = (Math.abs(a) != 1) ? `${+a.toFixed(6)}` : (a === -1 ? '-' : '');
                if (disc >= 0) {
                    let r1 = (-b + Math.sqrt(disc)) / (2*a);
                    let r2 = (-b - Math.sqrt(disc)) / (2*a);
                    factoredForm = `${prefix}${format(r1)}${format(r2)}`;
                }
                else {
                    factoredForm = 'Irreducible';
                }
                solution = `${quad(a, b, p)}`;
            }
        }
        else {
            /*Rational Root Theorem states that if a polynomial has rational roots, they will be made up of the factors of the constant term, p, and the leading co efficient, q. */
            let factP = getFacts(Math.abs(Math.round(p)));
            let factQ = getFacts(Math.abs(Math.round(q)));
            let roots = [];
            let seen = new Set();
            let e = 1e-9;

            for (let P of factP) {
                for (let Q of factQ) {
                    for (let sign of [1, -1]) {
                        let candidate = sign * P / Q;
                        let key = candidate.toFixed(10);
                        if (seen.has(key)) continue;
                        seen.add(key);

                        let ev = rpneval(rpn.result, candidate)
                        if(ev.error) continue;
                        if(Math.abs(ev.result) < e) {
                            roots.push(candidate);
                        }
                    }
                }
            }

            if (roots.length === 0) {
                outputDiv.innerHTML += `<p class='message funct_error'>ERROR 3580: Irreducible of Rationals</p>`;
                return;
            }
            
            let coeffs = new Array(degree + 1).fill(0);
            coeffs[degree] = p;
            if (rpn.term1) coeffs[degree - 1] = parseFloat(rpn.term1.slice(0, -2));
            if (rpn.term2) coeffs[degree - 2] = parseFloat(rpn.term2.slice(0, -2));
            if (rpn.term3) coeffs[degree - 3] = parseFloat(rpn.term3.slice(0, -2));
            if (rpn.term4) coeffs[degree - 4] = parseFloat(rpn.term4.slice(0, -2));

            let working = [...coeffs];
            let factoredParts = [];
            let allRoots = [];
            let prefix = (Math.abs(q) != 1)? `${+q.toFixed(6)}` : (q === -1 ? '-' : '');
            if (prefix) factoredParts.push(prefix);

            for (let root of roots) {
                factoredParts.push(format(root));
                allRoots.push(`${+root.toFixed(6)}`);
                working = syntheticDiv(working, root);
            }

            let remaining = working.length - 1;

            if (remaining === 1) {
                let [ra, rb] = working;
                let finalRoot = -rb / ra;
                factoredParts.push(format(finalRoot));
                allRoots.push(`${+finalRoot.toFixed(6)}`);
            }
            else if (remaining === 2) {
                let [qa, qb, qc] = working;
                let disc = qb * qb -4 * qa * qc;
                if (disc >= 0) {
                    let r1 = (-qb +Math.sqrt(disc))/(2 * qa);
                    let r2 = (-qb - Math.sqrt(disc)) / (2*qa);
                    factoredParts.push(format(r1));
                    factoredParts.push(format(r2));
                    allRoots.push(`${+r1.toFixed(6)}`, `${+r2.toFixed(6)}`);
                }
                else {
                    let qa_ = +qa.toFixed(4), qb_= +qb.toFixed(4), qc_ = +qc.toFixed(4);
                    let irrStr =`(${qa_ !== 1 ? qa_ : ''}x<sup>2</sup>`;
                    if (qb_ !== 0) irrStr += ` ${qb_ > 0 ? '+' : '-'} ${Math.abs(qb_)}x`;
                    if (qc_ !== 0) irrStr += ` ${qc_ > 0 ? '+' : '-'} ${Math.abs(qc_)}`;
                    irrStr += `)`;
                    factoredParts.push(irrStr);
                    let xr = +(-qb / (2 * qa)).toFixed(6);
                    let xi = +(Math.sqrt(-disc) / (2 * qa)).toFixed(6);
                    allRoots.push(`${xr} + ${xi}i`, `${xr} - ${xi}i`);
                }
            }
 
            factoredForm = factoredParts.join('');
            solution     = `x = {${allRoots.join(', ')}}`;
        }
        document.getElementById("factoringEq_display").innerHTML = factoredForm;
        outputDiv.innerHTML +=
            `<p class='message'>${this.display} &nbsp;&rarr;&nbsp; ${factoredForm}</p>`;
            `<p class='message'>&nbsp;&nbsp;&nbsp;&nbsp; ${solution}</p>`;            
        this.expr    = "";
        this.display = "";
    }
}