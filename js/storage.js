/* =====================================
   FANZ OS V2.0
   STORAGE SYSTEM
   Developer: FANDI
===================================== */

const Storage = {

    get(key, fallback = []) {
        try {
            const data = localStorage.getItem("fanz_" + key);

            return data !== null
                ? JSON.parse(data)
                : fallback;

        } catch (error) {
            console.error("Storage read error:", error);
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(
                "fanz_" + key,
                JSON.stringify(value)
            );

            return true;

        } catch (error) {
            console.error("Storage write error:", error);

            alert("Penyimpanan penuh atau tidak tersedia.");

            return false;
        }
    },

    remove(key) {
        localStorage.removeItem("fanz_" + key);
    },

    clear() {
        Object.keys(localStorage)
            .filter(key => key.startsWith("fanz_"))
            .forEach(key => localStorage.removeItem(key));
    },

    exportData() {
        const backup = {};

        Object.keys(localStorage)
            .filter(key => key.startsWith("fanz_"))
            .forEach(key => {
                backup[key] = localStorage.getItem(key);
            });

        return backup;
    },

    importData(data) {
        if (
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {
            throw new Error("Format backup tidak valid.");
        }

        for (const [key, value] of Object.entries(data)) {

            if (!key.startsWith("fanz_")) continue;

            if (typeof value !== "string") {
                throw new Error("Data backup tidak valid.");
            }

            JSON.parse(value);
        }

        Object.entries(data).forEach(([key, value]) => {

            if (key.startsWith("fanz_")) {
                localStorage.setItem(key, value);
            }

        });

        return true;
    }

};

window.Storage = Storage;
