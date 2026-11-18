const Store = {

    get(key, fallback) {

        try {

            const value = localStorage.getItem("fanzos_" + key);

            return value === null
                ? fallback
                : JSON.parse(value);

        } catch {

            return fallback;

        }

    },

    set(key, value) {

        localStorage.setItem(
            "fanzos_" + key,
            JSON.stringify(value)
        );

    },

    remove(key) {

        localStorage.removeItem("fanzos_" + key);

    }

};
