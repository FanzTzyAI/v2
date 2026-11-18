(() => {

    const form = document.getElementById("terminalForm");

    const input = document.getElementById("terminalCommand");

    const output = document.getElementById("terminalOutput");

    if (!form) return;

    const commands = {

        help:
            "Perintah: help, about, date, time, clear, whoami, status, joke",

        about:
            "FANZ OS v1.0.0 — Futuristic Web Operating System.",

        whoami:
            "guest — kreator ruang kerja digital.",

        status:
            "System: ONLINE | Storage: LOCAL | Interface: RESPONSIVE",

        joke:
            "Kenapa programmer suka kopi? Karena Java sudah jadi bahasa sehari-hari."

    };

    function line(text) {

        const p = document.createElement("p");

        p.textContent = text;

        output.appendChild(p);

        output.scrollTop = output.scrollHeight;

    }

    form.addEventListener("submit", e => {

        e.preventDefault();

        const cmd = input.value.trim().toLowerCase();

        if (!cmd) return;

        line("guest@fanzos:~$ " + cmd);

        if (cmd === "clear") {

            output.innerHTML = "";

        }

        else if (cmd === "date") {

            line(new Date().toLocaleDateString("id-ID"));

        }

        else if (cmd === "time") {

            line(new Date().toLocaleTimeString("id-ID"));

        }

        else {

            line(
                commands[cmd] ||
                "Perintah tidak dikenal. Ketik help."
            );

        }

        input.value = "";

    });

    document.getElementById("clearTerminal")
        .addEventListener("click", () => {

            output.innerHTML = "";

        });

})();
