/* =========================================
   FANZ OS V2.0 - TERMINAL
   Simulated Terminal System
========================================= */

const Terminal = {
    output: null,
    form: null,
    input: null,

    init() {
        this.output = document.getElementById("terminalOutput");
        this.form = document.getElementById("terminalForm");
        this.input = document.getElementById("terminalInput");

        if (!this.output || !this.form || !this.input) {
            console.warn("Terminal elements tidak ditemukan.");
            return;
        }

        this.form.addEventListener("submit", (event) => {
            event.preventDefault();

            const command = this.input.value.trim();

            if (!command) return;

            this.printCommand(command);
            this.execute(command);

            this.input.value = "";
            this.output.scrollTop = this.output.scrollHeight;
        });

        this.printText("FANZ OS Terminal [Version 2.0]");
        this.printText("Ketik 'help' untuk melihat daftar perintah.");
        this.printText("");
    },

    printText(message) {
        const line = document.createElement("p");
        line.className = "terminal-line";
        line.textContent = message;

        this.output.appendChild(line);
    },

    printCommand(command) {
        const line = document.createElement("p");
        line.className = "terminal-command";

        const prompt = document.createElement("span");
        prompt.textContent = "fanz@os:~$ ";

        const text = document.createElement("span");
        text.textContent = command;

        line.appendChild(prompt);
        line.appendChild(text);

        this.output.appendChild(line);
    },

    clear() {
        this.output.innerHTML = "";
    },

    execute(rawCommand) {
        const command = rawCommand.trim();
        const lower = command.toLowerCase();

        if (lower === "help") {
            this.help();
            return;
        }

        if (lower === "about") {
            this.about();
            return;
        }

        if (lower === "date") {
            this.printText(
                "Tanggal: " +
                new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })
            );
            return;
        }

        if (lower === "time") {
            this.printText(
                "Waktu: " +
                new Date().toLocaleTimeString("id-ID")
            );
            return;
        }

        if (lower === "clear") {
            this.clear();
            return;
        }

        if (lower === "version") {
            this.printText("FANZ OS Version 2.0");
            this.printText("Terminal Build: 2026.11");
            return;
        }

        if (lower === "whoami") {
            this.printText("User: Guest");
            this.printText("System: FANZ OS");
            return;
        }

        if (lower === "apps") {
            this.printText("Installed Applications:");
            this.printText("- Dashboard");
            this.printText("- Notes");
            this.printText("- Tasks");
            this.printText("- Calculator");
            this.printText("- Terminal");
            this.printText("- Calendar");
            this.printText("- File Manager");
            this.printText("- Music Player");
            this.printText("- Utilities");
            this.printText("- Weather");
            this.printText("- Settings");
            return;
        }

        if (lower === "neofetch") {
            this.neofetch();
            return;
        }

        if (lower.startsWith("echo ")) {
            this.printText(command.substring(5));
            return;
        }

        if (lower === "echo") {
            this.printText("");
            return;
        }

        if (lower === "help me") {
            this.printText("Gunakan perintah 'help' untuk melihat bantuan.");
            return;
        }

        this.printText(
            "Perintah tidak dikenal: " + command
        );

        this.printText(
            "Ketik 'help' untuk melihat daftar perintah."
        );
    },

    help() {
        this.printText("========== COMMAND LIST ==========");
        this.printText("help       - Menampilkan daftar perintah");
        this.printText("about      - Informasi sistem");
        this.printText("date       - Menampilkan tanggal");
        this.printText("time       - Menampilkan waktu");
        this.printText("clear      - Membersihkan terminal");
        this.printText("echo teks  - Menampilkan teks");
        this.printText("version    - Versi FANZ OS");
        this.printText("whoami     - Informasi pengguna");
        this.printText("apps       - Daftar aplikasi");
        this.printText("neofetch   - Informasi perangkat");
        this.printText("==================================");
    },

    about() {
        this.printText("========== ABOUT FANZ OS ==========");
        this.printText("Nama       : FANZ OS");
        this.printText("Versi      : 2.0");
        this.printText("Developer  : FANZ");
        this.printText("Platform   : Web Operating System");
        this.printText("Storage    : Browser LocalStorage");
        this.printText("===================================");
    },

    neofetch() {
        const browser = navigator.userAgent;
        const screenSize =
            window.screen.width + " x " + window.screen.height;

        this.printText("================================");
        this.printText("          FANZ OS 2.0");
        this.printText("================================");
        this.printText("OS       : FANZ OS");
        this.printText("Browser  : " + browser);
        this.printText("Screen   : " + screenSize);
        this.printText("Language : " + navigator.language);
        this.printText("Online   : " + (navigator.onLine ? "Yes" : "No"));
        this.printText("================================");
    }
};

window.Terminal = Terminal;
