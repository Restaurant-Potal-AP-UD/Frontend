// Path: ../JS/userPage.js

document.addEventListener("DOMContentLoaded", () => {
    const userInfoSection = document.getElementById("user-primary-info");
    const passwordForm = document.getElementById("user-password-form");
    const bookingsSection = document.getElementById("u-restaurant-info");

    // Fetch and populate user information
    fetchUserInfo();

    // Fetch and display user's bookings
    fetchUserBookings();

    // Handle password update form submission
    passwordForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const password1 = document.getElementById("password1").value;
        const password2 = document.getElementById("password2").value;

        if (password1 !== password2) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        if (password1.length < 9 || password1.length > 80) {
            alert("Password must be between 9 and 80 characters.");
            return;
        }

        updateUserPassword(password1);
    });
});

// Fetch user information and populate fields
function fetchUserInfo() {
    fetch("http://localhost:8080/api/user")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch user info");
            }
            return response.json();
        })
        .then((user) => {
            document.getElementById("name").value = user.name;
            document.getElementById("surname").value = user.surname;
            document.getElementById("email").value = user.email;
        })
        .catch((error) => {
            console.error("Error fetching user info:", error);
            alert("Failed to load user information.");
        });
}

// Update the user's password
function updateUserPassword(newPassword) {
    fetch("http://localhost:8080/api/user/update-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to update password");
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                alert("Password updated successfully.");
                document.getElementById("password1").value = "";
                document.getElementById("password2").value = "";
            } else {
                alert("Error: " + data.error);
            }
        })
        .catch((error) => {
            console.error("Error updating password:", error);
            alert("An error occurred. Please try again.");
        });
}

// Fetch and display user's bookings
function fetchUserBookings() {
    fetch("http://localhost:8080/api/user/bookings")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch bookings");
            }
            return response.json();
        })
        .then((bookings) => {
            const bookingsSection = document.getElementById("u-restaurant-info");
            bookings.forEach((booking) => {
                const bookingElement = document.createElement("div");
                bookingElement.classList.add("booking-item");
                bookingElement.innerHTML = `
                    <p><strong>Restaurant:</strong> ${booking.restaurantName}</p>
                    <p><strong>Date:</strong> ${booking.date}</p>
                    <p><strong>Assistants:</strong> ${booking.assistants}</p>
                    <button class="delete-booking-btn" data-id="${booking.id}">Delete</button>
                `;
                bookingsSection.appendChild(bookingElement);
            });

            // Add delete functionality for each booking
            document.querySelectorAll(".delete-booking-btn").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const bookingId = event.target.getAttribute("data-id");
                    deleteUserBooking(bookingId);
                });
            });
        })
        .catch((error) => {
            console.error("Error fetching bookings:", error);
            alert("Failed to load bookings.");
        });
}

// Delete a specific booking
function deleteUserBooking(bookingId) {
    fetch(`http://localhost:8080/api/user/bookings/${bookingId}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete booking");
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                alert("Booking deleted successfully.");
                fetchUserBookings(); // Refresh bookings list
            } else {
                alert("Error: " + data.error);
            }
        })
        .catch((error) => {
            console.error("Error deleting booking:", error);
            alert("Failed to delete booking. Please try again.");
        });
}
