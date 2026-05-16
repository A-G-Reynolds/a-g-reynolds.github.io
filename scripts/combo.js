const comboGame = {
    combo: [], digi: 0, attmpt: 0, tol: 0, direct: true, guess: 0, done: false, diff: null,

    setDiff(d) {
        ['easy', 'normal', 'hard'].forEach(x =>
            document.getElementById('combo_' + x).style.borderColor='');
        document.getElementById('combo_'+ d).style.borderColor = '#d8c230';
        this.diff = d;
        if (d === 'easy') {this.digi=4; this.attmpt=6; this.tol=3; this.direct=true;}
        if (d === 'normal') {this.digi=5; this.attmpt=4; this.tol=2; this.direct=true;}
        if (d === 'hard') {this.digi=6; this.attmpt=3; this.tol=1; this.direct=false;}
        this.start();
    },

    start() {
        this.combo = Array.from({length: this.digi}, () => Math.floor(Math.random()*10));
        this.guess = 0; 
        this.done = false;
        
        document.getElementById('combo_history').innerHTML = '';
        document.getElementById('combo_history').style.display = 'none';
        document.getElementById('combo_status').textContent = '';
        document.getElementById('combo_status').className = 'combo_status';
        document.getElementById('combo_again').innerHTML = '';
        document.getElementById('combo_input').value = '';
        document.getElementById('combo_input_row').style.display = 'flex';
        document.getElementById('combo_legend').style.display = this.direct ? 'flex' : 'none';
        document.getElementById('combo_legend_hard').style.display = this.direct ? 'none' : 'flex';
        this.renderBlanks(new Array(this.digi).fill(''));
        this.updateMeta();
        document.getElementById('combo_input').focus();
    },

    renderBlanks(vals) {
        document.getElementById('combo_blanks').innerHTML = vals
            .map(v => `<div class="combo_blank">${v}</div>`)
            .join('');
    },

    updateMeta() {
        if (this.done) return;
        document.getElementById('combo_meta').textContent = 
        `Attempt ${this.guess+1} of ${this.attmpt} - enter ${this.digi} digits`;
    },

    submit(){
        if (this.done || !this.diff) return;
        const raw = document.getElementById('combo_input').value.trim();
        if (raw.length != this.digi || !/^\d+$/.test(raw)) {
            const s = document.getElementById('combo_status');
            s.textContent = `Enter exactly ${this.digi} digits.`;
            s.className = 'combo_status combo_status_err';
            return;
        }
        document.getElementById('combo_status').textContent = '';
        const guess = raw.split('').map(Number);
        this.guess++;

        const solve = [];
        let win = 0;
        for (let i = 0; i < this.digi; i++) {
            const g = guess[i], c = this.combo[i];
            if (g === c) {
                solve.push({ v: String(g), cls: 'combo_cell_exact'}); 
                win++;
            }
            else if (Math.abs(c - g) <= this.tol) {
                if (this.direct) 
                    solve.push({ v: c > g ? '+' : '-', cls: 'combo_cell_close'});
                else
                    solve.push({ v: '#', cls: 'combo_cell_close_nd'});
            }
            else {
                solve.push({ v: '\u2715', cls: 'combo_cell_miss'});
            }
        }

        this.renderBlanks(solve.map(s => s.cls === 'combo_cell_exact' ? s.v : ''));

        const hist = document.getElementById('combo_history');
        hist.style.display = 'block';
        hist.innerHTML += `<p class="message combo_history_row">
            <span class="combo_history_num">#${this.guess}</span>
            ${solve.map(s => `<span class="combo_history_cell ${s.cls}">${s.v}</span>`).join('')}
        </p>`;

        document.getElementById('combo_input').value = "";

        if (win === this.digi) {
            this.done = true;
            document.getElementById('combo_input_row').style.display = 'none';
            document.getElementById('combo_meta').textContent = '';
            const s = document.getElementById('combo_status');
            s.textContent = `CODE CRACKED in ${this.guess} ${this.guess === 1 ? 'attempt' : 'attempts'}!`;
            s.className = 'combo_status combo_status_win';
            this.showAgain();
        } else if (this.guess >= this.attmpt) {
            this.done = true;
            document.getElementById('combo_input_row').style.display = 'none';
            document.getElementById('combo_meta').textContent = '';
            this.renderBlanks(this.combo.map(String));
            const s = document.getElementById('combo_status');
            s.textContent = `LOCKED OUT. The Combination Was: ${this.combo.join('')}`;
            s.className = 'combo_status combo_status_lose';
            this.showAgain();
        }
        else {
            this.updateMeta();
            document.getElementById('combo_input').focus();
        }
    },

    showAgain() {
        document.getElementById('combo_again').innerHTML =
            `<button class="action" onclick="comboGame.start()" style="margin-top:6px;">Play Again</button>`;
    },

    openInfo() {
        document.getElementById('combo_modal_overlay').style.display = 'flex';
    },

    closeInfo() {
        document.getElementById('combo_modal_overlay').style.display='none';
    },

    reset() {
        this.done = true; this.diff = null;
        ['combo_history', 'combo_input_row', 'combo_legend', 'combo_legend_hard'].forEach(id => {
            document.getElementById(id).style.display = 'none';
        });
        document.getElementById('combo_blanks').innerHTML = '';
        document.getElementById('combo_meta').textContent = '';
        document.getElementById('combo_status').textContent = '';
        document.getElementById('combo_again').innerHTML = '';
        ['easy', 'normal', 'hard'].forEach(x =>
            document.getElementById('combo_' + x).style.borderColor = '');
    }
};