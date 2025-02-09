// Path: ../JS/Reservation.js
document.addEventListener("DOMContentLoaded", () => {
    const reviewInput = document.getElementById("example-input");
    const reviewSubmitBtn = document.querySelector(".submit-btn:nth-of-type(1)"); // First submit button
    const reservationSubmitBtn = document.querySelector(".submit-btn:nth-of-type(2)"); // Second submit button
    const datetimeInput = document.getElementById("datetime");
    const assistantsInput = document.getElementById("assistants");

    // Add a review
    reviewSubmitBtn.addEventListener("click", () => {
        const comment = reviewInput.value.trim();
        if (!comment) {
            alert("Please enter a comment.");
            return;
        }

        // Append the comment dynamically
        const reviewsSection = document.querySelector(".box:nth-of-type(1) h3 + p");
        const newComment = document.createElement("p");
        newComment.textContent = comment;
        reviewsSection.appendChild(newComment);

        // Optional: Save comment to a server
        fetch("http://localhost:8080/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ comment }),
        }).catch(error => console.error("Failed to save review:", error));

        reviewInput.value = ""; // Clear the input
    });

    // Complete a reservation
    reservationSubmitBtn.addEventListener("click", () => {
        const datetime = datetimeInput.value;
        const assistants = assistantsInput.value.trim();

        // Validate inputs
        if (!datetime || !assistants || parseInt(assistants) <= 0) {
            alert("Please provide valid reservation details.");
            return;
        }

        // Save reservation (send to server)
        fetch("http://localhost:8080/api/reservations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                datetime,
                assistants: parseInt(assistants),
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to save reservation.");
                }
                return response.json();
            })
            .then(data => {
                alert("Reservation successfully completed!");
                datetimeInput.value = ""; // Clear inputs
                assistantsInput.value = "";
            })
            .catch(error => {
                console.error("Failed to complete reservation:", error);
                alert("An error occurred. Please try again.");
            });
    });

    // Fetch and display existing restaurant data (optional)
    fetch("http://localhost:8080/api/restaurant-details")
        .then(response => response.json())
        .then(data => {
            document.querySelector(".box h2").textContent = data.name;
            document.querySelector(".box:nth-of-type(1) p:nth-of-type(1)").textContent = data.services;
            document.querySelector(".box:nth-of-type(2) p:nth-of-type(1)").textContent = data.description;
            document.querySelector(".box:nth-of-type(2) p:nth-of-type(2)").textContent = data.address;

            // Add existing reviews
            const reviewsSection = document.querySelector(".box:nth-of-type(1) h3 + p");
            data.reviews.forEach(review => {
                const newComment = document.createElement("p");
                newComment.textContent = review;
                reviewsSection.appendChild(newComment);
            });
        })
        .catch(error => console.error("Failed to fetch restaurant data:", error));
});