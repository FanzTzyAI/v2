/* =====================================
   FANZ OS V2.0
   CALCULATOR
===================================== */

const Calculator = {

    expression: "",

    history: [],

    display() {

        const element = document.getElementById("calcDisplay");

        if (element) {
            element.textContent = this.expression || "0";
        }

    },

    input(value) {

        if (value === "AC") {

            this.expression = "";

            document.getElementById("calcHistory").textContent = "";

        }

        else if (value === "DEL") {

            this.expression = this.expression.slice(0, -1);

        }

        else if (value === "=") {

            this.calculate();

            return;

        }

        else {

            if (this.expression.length >= 40) return;

            const allowed = /^[0-9+\-*/.%]$/;

            if (!allowed.test(value)) return;

            this.expression += value;

        }

        this.display();

    },

    calculate() {

        if (!this.expression) return;

        try {

            const expression = this.expression;

            if (
                !/^[0-9+\-*/.%() ]+$/.test(expression)
            ) {
                throw new Error("Invalid expression");
            }

            if (
                /[+\-*/.%]{2,}/.test(expression)
            ) {
                throw new Error("Invalid expression");
            }

            const result = Function(
                '"use strict"; return (' + expression + ')'
            )();

            if (
                typeof result !== "number" ||
                !Number.isFinite(result)
            ) {
                throw new Error("Invalid result");
            }

            const output = Number(
                result.toPrecision(12)
            ).toString();

            document.getElementById("calcHistory")
                .textContent = expression + " =";

            this.history.unshift({
                expression,
                result: output
            });

            this.history = this.history.slice(0, 10);

            this.expression = output;

            this.display();

        }

        catch (error) {

            document.getElementById("calcHistory")
                .textContent = "Invalid calculation";

            this.expression = "";

            this.display();

        }

    },

    init() {

        document.querySelectorAll("[data-calc]")
            .forEach(button => {

                button.addEventListener("click", () => {

                    this.input(button.dataset.calc);

                });

            });

    }

};

Calculator.init();

window.Calculator = Calculator;
