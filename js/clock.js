/* =====================================
   FANZ OS V2.0
   CLOCK SYSTEM
===================================== */

function updateClock() {

    const now = new Date();

    const clock = document.getElementById("clock");
    const date = document.getElementById("date");

    if (clock) {

        clock.textContent = now.toLocaleTimeString(
            "id-ID",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }
        );

    }

    if (date) {

        date.textContent = now.toLocaleDateString(
            "id-ID",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    }

}

updateClock();

setInterval(updateClock, 1000);
