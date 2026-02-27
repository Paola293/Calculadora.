let currentInput = "";
const display = document.getElementById("current-operation");

function updateDisplay() {
    display.innerText = currentInput || "0";
}

function appendNumber(num) {
    if (currentInput === "0") currentInput = "";
    currentInput += num;
    updateDisplay();
}

function appendOperator(op) {
    // Bloqueia operador se o visor estiver vazio
    if (currentInput === "") return;
    
    const lastChar = currentInput.slice(-1);
    // Evita duplicar operadores
    if (["+", "-", "*", "/", "^"].includes(lastChar)) return;

    currentInput += op;
    updateDisplay();
}

function appendPercent() {
    if (currentInput === "" || ["+", "-", "*", "/", "("].includes(currentInput.slice(-1))) return;
    currentInput += "%";
    updateDisplay();
}

function calculate() {
    try {
        let expression = currentInput;
        const toRad = (deg) => deg * (Math.PI / 180);

        // 1. Lógica de Trigonometria Binária (Ex: 90cos60 ou cos60)
        // O regex identifica um número opcional (p1), a função (p2) e o ângulo (p3)
        const trigRegex = /(\d+\.?\d*)?(sin|cos|tan)(\d+\.?\d*)/g;
        expression = expression.replace(trigRegex, (match, p1, func, p3) => {
            const angle = parseFloat(p3);
            let val = 0;
            if (func === 'sin') val = Math.sin(toRad(angle));
            if (func === 'cos') val = Math.cos(toRad(angle));
            if (func === 'tan') val = Math.tan(toRad(angle));
            
            // Se houver um número antes (p1), ele MULTIPLICA: 90 * cos(60)
            return p1 ? `(${p1}*${val})` : `${val}`;
        });

        // 2. Lógica de Porcentagem de Soma/Subtração (Ex: 100 + 10%)
        expression = expression.replace(/(\d+\.?\d*)\s*([\+\-])\s*(\d+\.?\d*)%/g, (match, n1, op, n2) => {
            const base = parseFloat(n1);
            const perc = parseFloat(n2);
            const value = base * (perc / 100);
            return `${base}${op}${value}`;
        });

        // 3. Porcentagem simples (Ex: 50% vira 0.5)
        expression = expression.replace(/(\d+\.?\d*)%/g, (match, n) => (parseFloat(n) / 100).toString());

        // 4. Potência
        expression = expression.replace(/\^/g, "**");

        // Executa o cálculo final
        let finalResult = eval(expression);
        
        // Limpa resíduos de precisão do JS (ex: 0.0000000001)
        currentInput = parseFloat(finalResult.toFixed(8)).toString();
        updateDisplay();
    } catch (e) {
        display.innerText = "Erro";
        currentInput = "";
    }
}

function computeDirect(type) {
    if (currentInput === "") return;
    let val = parseFloat(currentInput);
    if (type === 'sqrt') currentInput = Math.sqrt(val).toString();
    if (type === 'fact') {
        let res = 1;
        for (let i = 2; i <= val; i++) res *= i;
        currentInput = res.toString();
    }
    updateDisplay();
}

function toggleMode() {
    const container = document.getElementById("calc-container");
    container.classList.toggle("scientific");
    const isSci = container.classList.contains("scientific");
    document.querySelector(".btn-toggle").innerText = isSci ? "Modo Simples" : "Modo Científico";
}

function clearDisplay() { currentInput = ""; updateDisplay(); }
function deleteLast() { currentInput = currentInput.slice(0, -1); updateDisplay(); }
function reverseString() { currentInput = currentInput.split("").reverse().join(""); updateDisplay(); }