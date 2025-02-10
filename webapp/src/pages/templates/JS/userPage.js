document.addEventListener("DOMContentLoaded", () => {
    fetchUserInfo();
    fetchUserBookings();

    document.getElementById("user-info-form").addEventListener("submit", updateUserInfo);
    document.getElementById("user-password-form").addEventListener("submit", updateUserPassword);
});

// Fetch user information and populate fields
function fetchUserInfo() {
    fetch("http://localhost:8080/api/get-user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch user info");
        return response.json();
    })
    .then(user => {
        document.getElementById("name").value = user.name;
        document.getElementById("surname").value = user.surname;
        document.getElementById("email").value = user.email;

        // Actualizar la presentación del usuario
        document.getElementById("user-name-display").textContent = `${user.name} ${user.surname}`;
        document.getElementById("user-email-display").textContent = `Email: ${user.email}`;
    })
    .catch(error => {
        console.error("Error fetching user info:", error);
        alert("Failed to load user information.");
    });
}

function fetchUserBookings() {
    fetch("http://localhost:8081/api/get/booking/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch user bookings");
        return response.json();
    })
    .then(bookings => {
        const bookingsList = document.getElementById("bookings-list");
        bookingsList.innerHTML = ""; 

        if (!Array.isArray(bookings) || bookings.length === 0) {
            bookingsList.innerHTML = "<p>No reservations found.</p>";
            return;
        }

        bookings.forEach(booking => {
            const bookingCard = document.createElement("div");
            bookingCard.classList.add("booking-card");

            // Formatear fecha
            const formattedDate = formatBookingDate(booking.booking_date);

            bookingCard.innerHTML = `
                <h4>${booking.restaurant_name}</h4>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Guests:</strong> ${booking.people}</p>
                <p><strong>Code:</strong> ${booking.code}</p>
                <p><strong>Customer:</strong> ${booking.customer}</p>
                <button class="delete-booking-btn" data-code="${booking.code}">Delete</button>
            `;

            // Agregar evento al botón de eliminar
            bookingCard.querySelector(".delete-booking-btn").addEventListener("click", function () {
                deleteBooking(booking.code);
            });

            bookingsList.appendChild(bookingCard);
        });
    })
    .catch(error => {
        console.error("Error fetching bookings:", error);
        document.getElementById("bookings-list").innerHTML = "<p>Error loading reservations.</p>";
    });
}

function formatBookingDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", { 
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
    }) + " - " + 
    date.toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit", 
        hour12: true 
    });
}


function deleteBooking(bookingCode) {
    fetch(`http://localhost:8081/api/delete/booking/user/${bookingCode}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to delete booking");
        return response.json();
    })
    .then(data => {
        alert("Reservation deleted successfully.");
        fetchUserBookings(); // Refrescar la lista después de eliminar
    })
    .catch(error => {
        console.error("Error deleting booking:", error);
        alert("Failed to delete reservation.");
    });
}



// Update user information
function updateUserInfo(event) {
    event.preventDefault();
    
    const updatedUser = {
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        email: document.getElementById("email").value
    };

    fetch("http://localhost:8080/api/update-user", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
        body: JSON.stringify(updatedUser),
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to update user information");
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("User information updated successfully.");
            fetchUserInfo(); // Refresh displayed user info
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error updating user information:", error);
        alert("An error occurred. Please try again.");
    });
}

// Update the user's password
function updateUserPassword(event) {
    event.preventDefault();
    
    const password1 = document.getElementById("password1").value;
    const password2 = document.getElementById("password2").value;

    if (password1 !== password2) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    fetch("http://localhost:8081/api/update-user/password/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
        body: JSON.stringify({ password: password1 }),
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to update password");
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("Password updated successfully.");
            document.getElementById("password1").value = "";
            document.getElementById("password2").value = "";
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error updating password:", error);
        alert("An error occurred. Please try again.");
    });
}

