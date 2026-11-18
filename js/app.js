/* =========================================
   FANZ OS V2.0 - MAIN APPLICATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const $ = (id) => document.getElementById(id);

    /* =====================================
       NAVIGATION
    ===================================== */

    const navItems = document.querySelectorAll("[data-view]");
    const openButtons = document.querySelectorAll("[data-open]");

    function openView(viewName) {
        document.querySelectorAll(".view").forEach(view => {
            view.classList.remove("active");
        });

        const target = $("view-" + viewName);

        if (target) {
            target.classList.add("active");
        }

        navItems.forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.view === viewName
            );
        });

        const pageName = $("pageName");

        if (pageName) {
            pageName.textContent =
                viewName.charAt(0).toUpperCase() + viewName.slice(1);
        }

        closeSidebar();
    }

    navItems.forEach(button => {
        button.addEventListener("click", () => {
            openView(button.dataset.view);
        });
    });

    openButtons.forEach(button => {
        button.addEventListener("click", () => {
            openView(button.dataset.open);
        });
    });

    /* =====================================
       MOBILE SIDEBAR
    ===================================== */

    const sidebar = document.querySelector(".sidebar");
    const menuBtn = $("menuBtn");

    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove("show");
        }
    }

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("show");
        });
    }

    /* =====================================
       GLOBAL SEARCH
    ===================================== */

    const globalSearch = $("globalSearch");

    if (globalSearch) {
        globalSearch.addEventListener("keydown", event => {
            if (event.key !== "Enter") return;

            const keyword = globalSearch.value
                .trim()
                .toLowerCase();

            const aliases = {
                home: "home",
                dashboard: "home",
                beranda: "home",
                notes: "notes",
                catatan: "notes",
                tasks: "tasks",
                tugas: "tasks",
                calculator: "calculator",
                kalkulator: "calculator",
                terminal: "terminal",
                calendar: "calendar",
                kalender: "calendar",
                files: "files",
                file: "files",
                musik: "music",
                music: "music",
                tools: "tools",
                utilities: "tools",
                cuaca: "weather",
                weather: "weather",
                settings: "settings",
                pengaturan: "settings"
            };

            const destination = aliases[keyword];

            if (destination) {
                openView(destination);
                globalSearch.value = "";
            } else {
                alert("Aplikasi tidak ditemukan: " + keyword);
            }
        });
    }

    /* =====================================
       DASHBOARD DATE
    ===================================== */

    const greeting = $("greeting");

    if (greeting) {
        const hour = new Date().getHours();

        if (hour < 11) {
            greeting.textContent = "Selamat pagi!";
        } else if (hour < 15) {
            greeting.textContent = "Selamat siang!";
        } else if (hour < 18) {
            greeting.textContent = "Selamat sore!";
        } else {
            greeting.textContent = "Selamat malam!";
        }
    }

    /* =====================================
       NOTES APPLICATION
    ===================================== */

    let notes = Storage.get("notes", []);
    let editingNoteId = null;

    const noteTitle = $("noteTitle");
    const noteContent = $("noteContent");
    const addNoteBtn = $("addNoteBtn");
    const saveNoteBtn = $("saveNoteBtn");
    const cancelNoteBtn = $("cancelNoteBtn");
    const noteSearch = $("noteSearch");
    const notesList = $("notesList");

    function resetNoteForm() {
        editingNoteId = null;

        if (noteTitle) noteTitle.value = "";
        if (noteContent) noteContent.value = "";

        if (saveNoteBtn) {
            saveNoteBtn.textContent = "Simpan Catatan";
        }
    }

    function renderNotes() {
        if (!notesList) return;

        notesList.innerHTML = "";

        const search = noteSearch
            ? noteSearch.value.toLowerCase()
            : "";

        const filtered = notes.filter(note => {
            return (
                note.title.toLowerCase().includes(search) ||
                note.content.toLowerCase().includes(search)
            );
        });

        if (filtered.length === 0) {
            notesList.textContent = "Belum ada catatan.";
            return;
        }

        filtered.forEach(note => {
            const card = document.createElement("div");
            card.className = "note-card";

            const title = document.createElement("h3");
            title.textContent = note.title;

            const content = document.createElement("p");
            content.textContent = note.content;

            const date = document.createElement("small");
            date.textContent = new Date(note.updatedAt)
                .toLocaleString("id-ID");

            const actions = document.createElement("div");
            actions.className = "note-actions";

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.className = "secondary-btn";

            editBtn.addEventListener("click", () => {
                editingNoteId = note.id;

                noteTitle.value = note.title;
                noteContent.value = note.content;

                saveNoteBtn.textContent = "Update Catatan";

                noteTitle.focus();
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Hapus";
            deleteBtn.className = "danger-btn";

            deleteBtn.addEventListener("click", () => {
                if (!confirm("Hapus catatan ini?")) return;

                notes = notes.filter(item => item.id !== note.id);

                Storage.set("notes", notes);

                renderNotes();
                resetNoteForm();
            });

            actions.append(editBtn, deleteBtn);
            card.append(title, content, date, actions);

            notesList.appendChild(card);
        });
    }

    if (addNoteBtn) {
        addNoteBtn.addEventListener("click", () => {
            resetNoteForm();
            noteTitle.focus();
        });
    }

    if (saveNoteBtn) {
        saveNoteBtn.addEventListener("click", () => {
            const title = noteTitle.value.trim();
            const content = noteContent.value.trim();

            if (!title || !content) {
                alert("Isi judul dan konten catatan terlebih dahulu.");
                return;
            }

            if (editingNoteId !== null) {
                notes = notes.map(note => {
                    if (note.id === editingNoteId) {
                        return {
                            ...note,
                            title,
                            content,
                            updatedAt: Date.now()
                        };
                    }

                    return note;
                });
            } else {
                notes.unshift({
                    id: Date.now() + Math.random(),
                    title,
                    content,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                });
            }

            Storage.set("notes", notes);

            resetNoteForm();
            renderNotes();
        });
    }

    if (cancelNoteBtn) {
        cancelNoteBtn.addEventListener("click", resetNoteForm);
    }

    if (noteSearch) {
        noteSearch.addEventListener("input", renderNotes);
    }

    renderNotes();

    /* =====================================
       TASK MANAGER
    ===================================== */

    let tasks = Storage.get("tasks", []);

    const taskInput = $("taskInput");
    const taskPriority = $("taskPriority");
    const taskDeadline = $("taskDeadline");
    const addTaskBtn = $("addTaskBtn");
    const taskList = $("taskList");

    function renderTasks() {
        if (!taskList) return;

        taskList.innerHTML = "";

        if (tasks.length === 0) {
            taskList.textContent = "Belum ada tugas.";
        }

        tasks.forEach(task => {
            const item = document.createElement("div");
            item.className = "task-item";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;

                Storage.set("tasks", tasks);
                renderTasks();
            });

            const info = document.createElement("div");
            info.className = "task-info";

            const title = document.createElement("span");
            title.textContent = task.title;

            if (task.completed) {
                title.style.textDecoration = "line-through";
                title.style.opacity = "0.6";
            }

            const details = document.createElement("small");

            const deadlineText = task.deadline
                ? " • " + task.deadline
                : "";

            details.textContent =
                "Prioritas: " + task.priority + deadlineText;

            info.append(title, details);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Hapus";
            deleteBtn.className = "danger-btn";

            deleteBtn.addEventListener("click", () => {
                tasks = tasks.filter(item => item.id !== task.id);

                Storage.set("tasks", tasks);
                renderTasks();
            });

            item.append(checkbox, info, deleteBtn);
            taskList.appendChild(item);
        });

        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;

        if ($("totalTasks")) $("totalTasks").textContent = total;
        if ($("completedTasks")) $("completedTasks").textContent = completed;
        if ($("pendingTasks")) $("pendingTasks").textContent = pending;

        const progress = total
            ? Math.round((completed / total) * 100)
            : 0;

        const progressBar = $("taskProgress");

        if (progressBar) {
            progressBar.style.width = progress + "%";
        }
    }

    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", () => {
            const title = taskInput.value.trim();

            if (!title) {
                alert("Masukkan nama tugas terlebih dahulu.");
                return;
            }

            tasks.unshift({
                id: Date.now() + Math.random(),
                title,
                priority: taskPriority.value,
                deadline: taskDeadline.value,
                completed: false,
                createdAt: Date.now()
            });

            Storage.set("tasks", tasks);

            taskInput.value = "";
            taskDeadline.value = "";

            renderTasks();
        });
    }

    renderTasks();

    /* =====================================
       CALENDAR
    ===================================== */

    let calendarDate = new Date();

    const calendarMonth = $("calendarMonth");
    const calendarGrid = $("calendarGrid");

    function renderCalendar() {
        if (!calendarGrid) return;

        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();

        if (calendarMonth) {
            calendarMonth.textContent =
                calendarDate.toLocaleDateString("id-ID", {
                    month: "long",
                    year: "numeric"
                });
        }

        calendarGrid.innerHTML = "";

        const weekdays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

        weekdays.forEach(day => {
            const cell = document.createElement("div");
            cell.className = "calendar-weekday";
            cell.textContent = day;

            calendarGrid.appendChild(cell);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const today = new Date();

        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement("div");
            empty.className = "calendar-empty";

            calendarGrid.appendChild(empty);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement("button");
            cell.className = "calendar-day";
            cell.textContent = day;

            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                cell.classList.add("today");
            }

            cell.addEventListener("click", () => {
                alert(
                    "Tanggal dipilih: " +
                    new Date(year, month, day)
                        .toLocaleDateString("id-ID", {
                            dateStyle: "full"
                        })
                );
            });

            calendarGrid.appendChild(cell);
        }
    }

    if ($("prevMonth")) {
        $("prevMonth").addEventListener("click", () => {
            calendarDate.setMonth(calendarDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if ($("nextMonth")) {
        $("nextMonth").addEventListener("click", () => {
            calendarDate.setMonth(calendarDate.getMonth() + 1);
            renderCalendar();
        });
    }

    renderCalendar();

    /* =====================================
       FILE MANAGER
    ===================================== */

    const fileInput = $("fileInput");
    const fileList = $("fileList");

    function renderFiles(files) {
        if (!fileList) return;

        fileList.innerHTML = "";

        if (!files.length) {
            fileList.textContent = "Belum ada file dipilih.";
            return;
        }

        Array.from(files).forEach(file => {
            const item = document.createElement("div");
            item.className = "file-item";

            const name = document.createElement("strong");
            name.textContent = file.name;

            const details = document.createElement("small");
            details.textContent =
                file.type || "File tidak diketahui" +
                " • " + (file.size / 1024).toFixed(2) + " KB";

            item.append(name, details);
            fileList.appendChild(item);
        });
    }

    if (fileInput) {
        fileInput.addEventListener("change", () => {
            renderFiles(fileInput.files);
        });
    }

    /* =====================================
       MUSIC PLAYER
    ===================================== */

    const audioPlayer = $("audioPlayer");
    const musicInput = $("musicInput");
    const musicTitle = $("musicTitle");
    const musicArtist = $("musicArtist");
    const musicPlay = $("musicPlay");
    const musicPrev = $("musicPrev");
    const musicNext = $("musicNext");
    const musicSeek = $("musicSeek");
    const musicCurrent = $("musicCurrent");
    const musicDuration = $("musicDuration");
    const musicPlaylist = $("musicPlaylist");

    let playlist = [];
    let currentTrack = 0;

    function formatTime(seconds) {
        if (!Number.isFinite(seconds)) return "00:00";

        const minutes = Math.floor(seconds / 60);
        const remaining = Math.floor(seconds % 60);

        return (
            String(minutes).padStart(2, "0") +
            ":" +
            String(remaining).padStart(2, "0")
        );
    }

    function loadTrack(index) {
        if (!playlist.length || !audioPlayer) return;

        currentTrack =
            (index + playlist.length) % playlist.length;

        const track = playlist[currentTrack];

        audioPlayer.src = track.url;

        if (musicTitle) {
            musicTitle.textContent = track.name;
        }

        if (musicArtist) {
            musicArtist.textContent = "Local Audio";
        }

        if (musicPlay) {
            musicPlay.textContent = "▶";
        }

        renderPlaylist();
    }

    function renderPlaylist() {
        if (!musicPlaylist) return;

        musicPlaylist.innerHTML = "";

        playlist.forEach((track, index) => {
            const button = document.createElement("button");

            button.className = "playlist-item";
            button.textContent =
                (index === currentTrack ? "▶ " : "") + track.name;

            button.addEventListener("click", () => {
                loadTrack(index);
                audioPlayer.play();
            });

            musicPlaylist.appendChild(button);
        });
    }

    if (musicInput) {
        musicInput.addEventListener("change", () => {
            playlist.forEach(track => URL.revokeObjectURL(track.url));

            playlist = Array.from(musicInput.files)
                .filter(file => file.type.startsWith("audio/"))
                .map(file => ({
                    name: file.name,
                    url: URL.createObjectURL(file)
                }));

            if (!playlist.length) {
                alert("Tidak ada file audio yang valid.");
                return;
            }

            loadTrack(0);
        });
    }

    if (musicPlay && audioPlayer) {
        musicPlay.addEventListener("click", () => {
            if (!playlist.length) {
                alert("Pilih file musik terlebih dahulu.");
                return;
            }

            if (audioPlayer.paused) {
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        });
    }

    if (musicPrev) {
        musicPrev.addEventListener("click", () => {
            loadTrack(currentTrack - 1);
            audioPlayer.play();
        });
    }

    if (musicNext) {
        musicNext.addEventListener("click", () => {
            loadTrack(currentTrack + 1);
            audioPlayer.play();
        });
    }

    if (audioPlayer) {
        audioPlayer.addEventListener("play", () => {
            if (musicPlay) musicPlay.textContent = "⏸";
        });

        audioPlayer.addEventListener("pause", () => {
            if (musicPlay) musicPlay.textContent = "▶";
        });

        audioPlayer.addEventListener("ended", () => {
            if (playlist.length) {
                loadTrack(currentTrack + 1);
                audioPlayer.play();
            }
        });

        audioPlayer.addEventListener("timeupdate", () => {
            if (musicSeek && audioPlayer.duration) {
                musicSeek.value =
                    (audioPlayer.currentTime / audioPlayer.duration) * 100;
            }

            if (musicCurrent) {
                musicCurrent.textContent =
                    formatTime(audioPlayer.currentTime);
            }
        });

        audioPlayer.addEventListener("loadedmetadata", () => {
            if (musicDuration) {
                musicDuration.textContent =
                    
