document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reservationForm");
    const datetimeInput = document.getElementById("datetime");
    const assistantsInput = document.getElementById("assistants");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const datetime = datetimeInput.value;
        const assistants = assistantsInput.value.trim();
        
        if (!datetime || !assistants || parseInt(assistants) <= 0) {
            alert("Please provide valid reservation details.");
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const firstParam = Object.keys(Object.fromEntries(urlParams))[0];

        const userData = {
            booking_date: datetime,
            people: assistants
        };

        fetch(`http://localhost:8080/api/post/booking/user/${firstParam}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to save reservation.");
                }
                return response.json();
            })
            .then((data) => {
                alert("Reservation successfully completed!");
                form.reset();
            })
            .catch(error => {
                console.error("Failed to complete reservation:", error);
                alert("An error occurred. Please try again.");
            });
    });
});