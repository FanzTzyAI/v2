(() => {

    const views = [
        "home",
        "notes",
        "tasks",
        "calculator",
        "terminal",
        "settings"
    ];

    const names = {
        home: "Overview",
        notes: "Notes",
        tasks: "Task Manager",
        calculator: "Calculator",
        terminal: "Terminal",
        settings: "Settings"
    };

    const $ = id => document.getElementById(id);

    // NOTIFICATION

    function toast(message) {

        const el = $("toast");

        el.textContent = message;

        el.classList.add("show");

        clearTimeout(toast.timer);

        toast.timer = setTimeout(() => {

            el.classList.remove("show");

        }, 2300);

    }

    // NAVIGATION

    function openView(name) {

        if (!views.includes(name)) return;

        document.querySelectorAll(".view").forEach(view => {

            view.classList.toggle(
                "active",
                view.id === "view-" + name
            );

        });

        document.querySelectorAll(".nav-item").forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.view === name
            );

        });

        $("pageName").textContent = names[name];

        $("sidebar").classList.remove("open");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    document.querySelectorAll("[data-view]").forEach(button => {

        button.addEventListener("click", () => {

            openView(button.dataset.view);

        });

    });

    document.querySelectorAll("[data-open]").forEach(button => {

        button.addEventListener("click", () => {

            openView(button.dataset.open);

        });

    });

    // MOBILE MENU

    $("menuBtn").addEventListener("click", () => {

        $("sidebar").classList.toggle("open");

    });

    // THEME

    function applyTheme() {

        document.body.classList.toggle(
            "light",
            Store.get("theme", "dark") === "light"
        );

    }

    function toggleTheme() {

        const current = Store.get("theme", "dark");

        Store.set(
            "theme",
            current === "dark" ? "light" : "dark"
        );

        applyTheme();

        toast("Tema berhasil diubah.");

    }

    $("themeBtn").addEventListener(
        "click",
        toggleTheme
    );

    $("settingsTheme").addEventListener(
        "click",
        toggleTheme
    );

    applyTheme();

    // ACCENT COLOR

    const savedColor = Store.get(
        "accent",
        "#7c5cff"
    );

    document.documentElement.style.setProperty(
        "--accent",
        savedColor
    );

    document.querySelectorAll("[data-color]").forEach(button => {

        button.addEventListener("click", () => {

            const color = button.dataset.color;

            document.documentElement.style.setProperty(
                "--accent",
                color
            );

            Store.set("accent", color);

            toast("Warna aksen diperbarui.");

        });

    });

    // NOTES

    let notes = Store.get("notes", []);

    function renderNotes() {

        const container = $("notesList");

        container.innerHTML = "";

        $("noteCount").textContent =
            notes.length + " NOTES";

        if (!notes.length) {

            container.innerHTML =
                '<div class="empty">Belum ada catatan tersimpan.</div>';

            return;

        }

        notes.forEach((note, index) => {

            const card = document.createElement("article");

            card.className = "note-card";

            const title = document.createElement("h4");

            title.textContent = note.title;

            const body = document.createElement("p");

            body.textContent = note.body;

            const date = document.createElement("small");

            date.textContent = note.date;

            date.style.cssText =
                "display:block;color:var(--muted);font-size:8px;margin:9px 0";

            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Hapus catatan";

            deleteButton.addEventListener("click", () => {

                notes.splice(index, 1);

                Store.set("notes", notes);

                renderNotes();

                toast("Catatan dihapus.");

            });

            card.append(
                title,
                body,
                date,
                deleteButton
            );

            container.appendChild(card);

        });

    }

    $("saveNote").addEventListener("click", () => {

        const title = $("noteTitle").value.trim();

        const body = $("noteBody").value.trim();

        if (!title && !body) {

            toast("Tulis catatan terlebih dahulu.");

            return;

        }

        notes.unshift({

            title: title || "Tanpa judul",

            body: body,

            date: new Date().toLocaleString("id-ID")

        });

        Store.set("notes", notes);

        $("noteTitle").value = "";

        $("noteBody").value = "";

        renderNotes();

        toast("Catatan berhasil disimpan.");

    });

    renderNotes();

    // TASK MANAGER

    let tasks = Store.get("tasks", []);

    function renderTasks() {

        const container = $("taskList");

        container.innerHTML = "";

        if (!tasks.length) {

            container.innerHTML =
                '<div class="empty">Belum ada tugas. Tambahkan tugas pertamamu!</div>';

        }

        tasks.forEach((task, index) => {

            const row = document.createElement("div");

            row.className =
                "task-item" + (task.done ? " done" : "");

            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";

            checkbox.checked = task.done;

            checkbox.addEventListener("change", () => {

                tasks[index].done = checkbox.checked;

                saveTasks();

            });

            const label = document.createElement("span");

            label.textContent = task.text;

            const deleteButton = document.createElement("button");

            deleteButton.textContent = "✕";

            deleteButton.addEventListener("click", () => {

                tasks.splice(index, 1);

                saveTasks();

            });

            row.append(
                checkbox,
                label,
                deleteButton
            );

            container.appendChild(row);

        });

        const done = tasks.filter(task => task.done).length;

        const total = tasks.length;

        const remaining = total - done;

        const percentage = total
            ? Math.round(done / total * 100)
            : 0;

        $("totalTasks").textContent = total;

        $("doneTasks").textContent = done;

        $("remainingTasks").textContent = remaining;

        $("taskProgress").textContent =
            percentage + "%";

        $("progressBar").style.width =
            percentage + "%";

        $("taskSummary").textContent =
            done + " dari " + total + " tugas selesai";

    }

    function saveTasks() {

        Store.set("tasks", tasks);

        renderTasks();

    }

    function addTask() {

        const value = $("taskInput").value.trim();

        if (!value) {

            toast("Tulis tugas terlebih dahulu.");

            return;

        }

        tasks.push({

            text: value,

            done: false

        });

        $("taskInput").value = "";

        saveTasks();

        toast("Tugas ditambahkan.");

    }

    $("addTask").addEventListener(
        "click",
        addTask
    );

    $("taskInput").addEventListener("keydown", event => {

        if (event.key === "Enter") {

            addTask();

        }

    });

    $("clearDone").addEventListener("click", () => {

        tasks = tasks.filter(task => !task.done);

        saveTasks();

        toast("Tugas selesai dihapus.");

    });

    renderTasks();

    // RESET DATA

    $("clearData").addEventListener("click", () => {

        const confirmReset = confirm(
            "Hapus semua catatan dan tugas?"
        );

        if (!confirmReset) return;

        notes = [];

        tasks = [];

        Store.set("notes", notes);

        Store.set("tasks", tasks);

        renderNotes();

        renderTasks();

        toast("Data lokal berhasil direset.");

    });

})();
