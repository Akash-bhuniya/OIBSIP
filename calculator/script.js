// History management
        let calculationHistory = [];
        const MAX_HISTORY_ITEMS = 20;

        // Mode switching
        function showMode(mode) {
            const calculatorMode = document.getElementById('calculator-mode');
            const convertersMode = document.getElementById('converters-mode');
            const buttons = document.querySelectorAll('.mode-btn');
            
            buttons.forEach(btn => btn.classList.remove('active'));
            
            if (mode === 'calculator') {
                calculatorMode.classList.remove('hidden');
                convertersMode.classList.add('hidden');
                buttons[0].classList.add('active');
            } else {
                calculatorMode.classList.add('hidden');
                convertersMode.classList.remove('hidden');
                buttons[1].classList.add('active');
            }
        }

        // Calculator Toggle Function
        function toggleCalculator(mode) {
            const normalButtons = document.getElementById('normalButtons');
            const scientificButtons = document.getElementById('scientificButtons');
            const toggleBtns = document.querySelectorAll('.toggle-btn');
            
            toggleBtns.forEach(btn => btn.classList.remove('active'));
            
            if (mode === 'normal') {
                normalButtons.classList.remove('hidden');
                scientificButtons.classList.add('hidden');
                toggleBtns[0].classList.add('active');
            } else {
                normalButtons.classList.add('hidden');
                scientificButtons.classList.remove('hidden');
                toggleBtns[1].classList.add('active');
            }
        }

        // History toggle function
        function toggleHistory() {
            const historyPanel = document.getElementById('historyPanel');
            const calculatorContainer = document.querySelector('.calculator-container');
            
            if (historyPanel.style.display === 'none' || historyPanel.style.display === '') {
                historyPanel.style.display = 'block';
                calculatorContainer.style.gridTemplateColumns = '1fr 300px';
            } else {
                historyPanel.style.display = 'none';
                calculatorContainer.style.gridTemplateColumns = '1fr';
            }
        }

        // Add calculation to history
        function addToHistory(expression, result) {
            const historyItem = {
                expression: expression,
                result: result,
                timestamp: new Date()
            };
            
            calculationHistory.unshift(historyItem);
            
            // Keep only the latest MAX_HISTORY_ITEMS
            if (calculationHistory.length > MAX_HISTORY_ITEMS) {
                calculationHistory = calculationHistory.slice(0, MAX_HISTORY_ITEMS);
            }
            
            updateHistoryDisplay();
        }

        // Update history display
        function updateHistoryDisplay() {
            const historyList = document.getElementById('historyList');
            
            if (calculationHistory.length === 0) {
                historyList.innerHTML = '<div class="history-empty">No calculations yet. Start calculating to see your history!</div>';
                return;
            }
            
            historyList.innerHTML = calculationHistory.map(item => `
                <div class="history-item" onclick="useHistoryResult('${item.result}')">
                    <div class="history-expression">${item.expression}</div>
                    <div class="history-result">= ${item.result}</div>
                </div>
            `).join('');
        }

        // Use history result
        function useHistoryResult(result) {
            document.getElementById('calculatorDisplay').value = result;
        }

        // Clear history
        function clearHistory() {
            calculationHistory = [];
            updateHistoryDisplay();
        }

        // Unified Calculator Functions
        function appendToCalculator(value) {
            const display = document.getElementById('calculatorDisplay');
            display.value += value;
        }

        function clearCalculator() {
            document.getElementById('calculatorDisplay').value = '';
        }

        function backspaceCalculator() {
            const display = document.getElementById('calculatorDisplay');
            display.value = display.value.slice(0, -1);
        }

        // Enhanced power function
        function insertPower() {
            const display = document.getElementById('calculatorDisplay');
            const currentValue = display.value;
            
            // Find the last number or closing parenthesis
            const match = currentValue.match(/(\d+(?:\.\d+)?|\))$/);
            if (match) {
                const base = match[1];
                const beforeBase = currentValue.slice(0, match.index);
                display.value = beforeBase + 'Math.pow(' + base + ',';
            } else {
                display.value += 'Math.pow(';
            }
        }

        // Enhanced square root function
        function insertSquareRoot() {
            const display = document.getElementById('calculatorDisplay');
            display.value += 'Math.sqrt(';
        }

        // Enhanced factorial function
        function insertFactorial() {
            const display = document.getElementById('calculatorDisplay');
            const currentValue = display.value;
            
            // Find the last number
            const match = currentValue.match(/(\d+(?:\.\d+)?)$/);
            if (match) {
                const number = match[1];
                const beforeNumber = currentValue.slice(0, match.index);
                display.value = beforeNumber + 'factorial(' + number + ')';
            } else {
                display.value += 'factorial(';
            }
        }

        function calculateResult() {
            const display = document.getElementById('calculatorDisplay');
            const originalExpression = display.value;
            
            try {
                let expression = originalExpression;
                
                if (!expression || expression.trim() === '') {
                    return;
                }
                
                // Replace display symbols with JavaScript operators
                expression = expression.replace(/×/g, '*');
                expression = expression.replace(/÷/g, '/');
                
                // Handle factorial function calls
                expression = expression.replace(/factorial\(([^)]+)\)/g, (match, num) => {
                    return factorial(parseFloat(num));
                });
                
                // Handle factorial notation (number followed by !)
                expression = expression.replace(/(\d+(?:\.\d+)?)!/g, (match, num) => {
                    return factorial(parseFloat(num));
                });
                
                // Replace mathematical functions with Math equivalents
                expression = expression.replace(/sin\(/g, 'Math.sin(');
                expression = expression.replace(/cos\(/g, 'Math.cos(');
                expression = expression.replace(/tan\(/g, 'Math.tan(');
                expression = expression.replace(/log\(/g, 'Math.log10(');
                
                // Math.pow and Math.sqrt are already handled by the insert functions
                
                // Validate parentheses
                const openParens = (expression.match(/\(/g) || []).length;
                const closeParens = (expression.match(/\)/g) || []).length;
                if (openParens !== closeParens) {
                    display.value = 'Error: Unmatched parentheses';
                    return;
                }
                
                // Evaluate the expression
                const result = Function('"use strict"; return (' + expression + ')')();
                
                if (isNaN(result) || !isFinite(result)) {
                    display.value = 'Error';
                } else {
                    const formattedResult = Number(result.toPrecision(12)).toString();
                    display.value = formattedResult;
                    
                    // Add to history
                    addToHistory(originalExpression, formattedResult);
                }
            } catch (error) {
                display.value = 'Error';
                console.error('Calculation error:', error);
            }
        }

        function factorial(n) {
            if (n < 0) return NaN;
            if (n === 0 || n === 1) return 1;
            if (n > 170) return Infinity; // Prevent stack overflow
            
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }

        // Temperature Converter
        function convertTemperature() {
            const temp = parseFloat(document.getElementById('tempInput').value);
            const from = document.getElementById('tempFrom').value;
            const to = document.getElementById('tempTo').value;
            const result = document.getElementById('tempResult');
            
            if (isNaN(temp)) {
                result.textContent = 'Please enter a valid temperature';
                return;
            }
            
            let celsius;
            
            // Convert to Celsius first
            switch (from) {
                case 'celsius':
                    celsius = temp;
                    break;
                case 'fahrenheit':
                    celsius = (temp - 32) * 5/9;
                    break;
                case 'kelvin':
                    celsius = temp - 273.15;
                    break;
            }
            
            // Convert from Celsius to target
            let converted;
            switch (to) {
                case 'celsius':
                    converted = celsius;
                    break;
                case 'fahrenheit':
                    converted = celsius * 9/5 + 32;
                    break;
                case 'kelvin':
                    converted = celsius + 273.15;
                    break;
            }
            
            result.textContent = `${temp}° ${from.charAt(0).toUpperCase() + from.slice(1)} = ${converted.toFixed(2)}° ${to.charAt(0).toUpperCase() + to.slice(1)}`;
        }

        // EMI Calculator
        function calculateEMI() {
            const principal = parseFloat(document.getElementById('loanAmount').value);
            const rate = parseFloat(document.getElementById('interestRate').value) / 100 / 12;
            const tenure = parseFloat(document.getElementById('loanTenure').value) * 12;
            const result = document.getElementById('emiResult');
            
            if (isNaN(principal) || isNaN(rate) || isNaN(tenure)) {
                result.textContent = 'Please enter valid values';
                return;
            }
            
            const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
            const totalAmount = emi * tenure;
            const totalInterest = totalAmount - principal;
            
            result.innerHTML = `
                <strong>Monthly EMI:</strong> ₹${emi.toFixed(2)}<br>
                <strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}<br>
                <strong>Total Interest:</strong> ₹${totalInterest.toFixed(2)}
            `;
        }

        // Length Converter
        function convertLength() {
            const length = parseFloat(document.getElementById('lengthInput').value);
            const from = document.getElementById('lengthFrom').value;
            const to = document.getElementById('lengthTo').value;
            const result = document.getElementById('lengthResult');
            
            if (isNaN(length)) {
                result.textContent = 'Please enter a valid length';
                return;
            }
            
            const conversions = {
                meters: 1,
                kilometers: 1000,
                centimeters: 0.01,
                feet: 0.3048,
                inches: 0.0254,
                yards: 0.9144
            };
            
            const meters = length * conversions[from];
            const converted = meters / conversions[to];
            
            result.textContent = `${length} ${from} = ${converted.toFixed(4)} ${to}`;
        }

        // BMI Calculator
        function calculateBMI() {
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value) / 100; // Convert cm to m
            const result = document.getElementById('bmiResult');
            
            if (isNaN(weight) || isNaN(height)) {
                result.textContent = 'Please enter valid values';
                return;
            }
            
            const bmi = weight / (height * height);
            let category;
            
            if (bmi < 18.5) category = 'Underweight';
            else if (bmi < 25) category = 'Normal weight';
            else if (bmi < 30) category = 'Overweight';
            else category = 'Obese';
            
            result.innerHTML = `
                <strong>BMI:</strong> ${bmi.toFixed(1)}<br>
                <strong>Category:</strong> ${category}
            `;
        }

        // Percentage Calculator
        function calculatePercentage() {
            const number = parseFloat(document.getElementById('percentNumber').value);
            const percent = parseFloat(document.getElementById('percentValue').value);
            const result = document.getElementById('percentResult');
            
            if (isNaN(number) || isNaN(percent)) {
                result.textContent = 'Please enter valid values';
                return;
            }
            
            const percentageValue = (number * percent) / 100;
            
            result.innerHTML = `
                <strong>${percent}% of ${number} = ${percentageValue}</strong><br>
                ${number} + ${percent}% = ${number + percentageValue}<br>
                ${number} - ${percent}% = ${number - percentageValue}
            `;
        }

        // Age Calculator
        function calculateAge() {
            const birthDate = new Date(document.getElementById('birthDate').value);
            const result = document.getElementById('ageResult');
            
            if (!birthDate || birthDate > new Date()) {
                result.textContent = 'Please enter a valid birth date';
                return;
            }
            
            const today = new Date();
            let years = today.getFullYear() - birthDate.getFullYear();
            let months = today.getMonth() - birthDate.getMonth();
            let days = today.getDate() - birthDate.getDate();
            
            if (days < 0) {
                months--;
                days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            }
            
            if (months < 0) {
                years--;
                months += 12;
            }
            
            const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
            
            result.innerHTML = `
                <strong>Age:</strong> ${years} years, ${months} months, ${days} days<br>
                <strong>Total Days:</strong> ${totalDays} days
            `;
        }

        // Keyboard support for calculator
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            const display = document.getElementById('calculatorDisplay');
            
            // Only handle keyboard input when calculator is visible
            if (document.getElementById('calculator-mode').classList.contains('hidden')) {
                return;
            }
            
            event.preventDefault();
            
            if (key >= '0' && key <= '9') {
                appendToCalculator(key);
            } else if (key === '.') {
                appendToCalculator('.');
            } else if (key === '+') {
                appendToCalculator('+');
            } else if (key === '-') {
                appendToCalculator('-');
            } else if (key === '*') {
                appendToCalculator('*');
            } else if (key === '/') {
                appendToCalculator('/');
            } else if (key === '(' || key === ')') {
                appendToCalculator(key);
            } else if (key === 'Enter' || key === '=') {
                calculateResult();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                clearCalculator();
            } else if (key === 'Backspace') {
                backspaceCalculator();
            }
        });

        // Initialize history panel as hidden on mobile
        window.addEventListener('load', function() {
            if (window.innerWidth <= 768) {
                document.getElementById('historyPanel').style.display = 'none';
                document.querySelector('.calculator-container').style.gridTemplateColumns = '1fr';
            }
        });
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'97ded638f5cf7a24',t:'MTc1NzY3NDE1Mi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();