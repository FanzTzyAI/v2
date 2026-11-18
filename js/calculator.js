(() => {

    const output = document.getElementById("calcOutput");

    const history = document.getElementById("calcHistory");

    if (!output) return;

    let expression = "";

    function render() {

        output.textContent = expression || "0";

    }

    document.querySelectorAll("[data-key]").forEach(button => {

        button.addEventListener("click", () => {

            const key = button.dataset.key;

            if (key === "AC") {

                expression = "";

                history.textContent = "FANZ OS CALCULATOR";

            }

            else if (key === "DEL") {

                expression = expression.slice(0, -1);

            }

            else if (key === "=") {

                try {

                    if (
                        !/^[0-9+*/%.() -]+$/.test(expression) ||
                        !expression.trim()
                    ) {

                        throw Error();

                    }

                    const result = Function(
                        '"use strict";return (' +
                        expression.replace(/%/g, "/100") +
                        ")"
                    )();

                    if (!Number.isFinite(result)) {

                        throw Error();

                    }

                    history.textContent = expression + " =";

                    expression = String(
                        Number(result.toFixed(8))
                    );

                }

                catch {

                    history.textContent = "Perhitungan tidak valid";

                    expression = "";

                }

            }

            else {

                expression += key;

            }

            render();

        });

    });

})();
