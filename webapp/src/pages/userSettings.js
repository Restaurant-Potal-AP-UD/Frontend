// main.js
import {
    API_CONFIG,
    fetchWithError,
    handleFormSubmit,
    updateDOMElement,
    listShow,
} from "../utils/Utils.js";
  
document.addEventListener("DOMContentLoaded", async function () {
    let username;

    const isAuthenticated = localStorage.getItem("jwtToken");
    if (!isAuthenticated) {
        window.location.href = "./index.html";
        return;
    }

    async function logoutAndRedirect() {
        localStorage.removeItem("jwtToken");
        window.location.href = "./index.html";
    }

    async function loadUserData() {
        try {
            const data = await fetchWithError(`${API_CONFIG.baseUrl}/`);
            username = data.name + " " + data.surname;
            updateDOMElement(
                "user-presentation",
                `<h2>Hello ${data.username}</h2>
                <p>Here you can administrate your personal information, but also your active bookings and restaurants.</p>`
            );
        } catch (error) {
            updateDOMElement(
                "user-presentation",
                "<p>Failed to load user data. Please try again later.</p>"
            );
        }
    }

    async function loadUserBookings() {
        try {
            const data = await fetchWithError(`${API_CONFIG.baseUrl}/`);
            if (data.reservation) {
                updateDOMElement("user-bookings", `<h3>Active Bookings</h3><div id="bookings-list"></div>`);
                listShow(data.reservation, document.getElementById("bookings-list"));
          
                document
                    .querySelectorAll("#bookings-list [data-booking-id]")
                    .forEach(item => {
                        const bookingId = item.dataset.bookingId;
                        if (bookingId) {
                            const deleteButton = document.createElement("button");
                            deleteButton.textContent = "Delete Booking";
                            deleteButton.className = "delete-booking-btn";
                            deleteButton.onclick = () => handleDeleteBooking(bookingId);
                            item.appendChild(deleteButton);
                        }
                    });
            } else {
                updateDOMElement("user-bookings", "<p>The user has no active bookings.</p>");
            }
        } catch (error) {
            updateDOMElement("user-bookings", "<p>Failed to load bookings. Please try again later.</p>");
        }
    }

    async function loadUserRestaurants() {
        try {
            const data = await fetchWithError(`${API_CONFIG.restaurantBaseUrl}/get/restaurant/`);
            const restaurantForm = document.getElementById("restaurant-form");
            const restaurantSection = document.getElementById("user-restaurants");
            data.restaurant_owner = username;

            if (data && data.restaurant_name) {
                restaurantForm.remove();
                console.log(data);
                
                // Primero, crear el contenedor para la información
                restaurantSection.innerHTML = `
                    <div id="u-restaurant-info">
                        <h3>Active Restaurant</h3>
                        <div id="restaurant-details"></div>
                        <div id="address-section">
                            <h4>Restaurant Addresses</h4>
                            <div id="addresses-list"></div>
                            <form id="address-form">
                                <h4>Add New Address</h4>
                                <input type="text" id="street" placeholder="Street" required>
                                <input type="text" id="city" placeholder="City" required>
                                <input type="text" id="state" placeholder="State" required>
                                <input type="text" id="zip_code" placeholder="ZIP Code" required>
                                <input type="text" id="location" placeholder="Location Description" required>
                                <button type="submit">Add Address</button>
                            </form>
                        </div>
                    </div>`;
              
                const restaurantDetails = document.getElementById("restaurant-details");
                listShow(data, restaurantDetails);
                
                const addressForm = document.getElementById("address-form");
                if (addressForm) {
                    addressForm.addEventListener("submit", handleAddAddress);
                }
            }
        } catch (error) {
            console.error(error);
            updateDOMElement("u-restaurant-info", "<p>Failed to load restaurants. Please try again later.</p>");
        }
    }

    async function handleAddAddress(event) {
        event.preventDefault();

        try {
            const formData = {
                address: {
                    street: document.getElementById("street").value,
                    city: document.getElementById("city").value,
                    state: document.getElementById("state").value,
                    zip_code: document.getElementById("zip_code").value,
                },
                location: document.getElementById("location").value,
            };

            await fetchWithError(
                `${API_CONFIG.restaurantBaseUrl}/restaurant/create/address`,
                {
                    method: "POST",
                    body: JSON.stringify(formData)
                }
            );

            event.target.reset();
            // Recargar los restaurantes para mostrar la nueva dirección
            await loadUserRestaurants();
        } catch (error) {
            console.error(error);
            alert("An error occurred while adding the address. Please try again.");
        }
    }

    async function handleRestaurantForm(event) {
        event.preventDefault();
        
        try {
            const restaurantName = document.getElementById("u-restaurant-name").value;
            
            if (!restaurantName.trim()) {
                alert("Please enter a restaurant name");
                return;
            }

            const formData = {
                restaurant_name: restaurantName,
                restaurant_owner: username
            };

            const response = await fetchWithError(
                `${API_CONFIG.restaurantBaseUrl}/create/restaurant`,
                {
                    method: "POST",
                    body: JSON.stringify(formData)
                }
            );

            if (response) {
                // Recargar la sección de restaurantes para mostrar el nuevo restaurante
                await loadUserRestaurants();
            }
        } catch (error) {
            console.error("Error creating restaurant:", error);
            alert("Failed to create restaurant. Please try again.");
        }
    }

    async function handleDeleteBooking(bookingId) {
        if (confirm("Are you sure you want to delete this booking?")) {
            await handleFormSubmit({
                formData: { booking_id: bookingId },
                url: `${API_CONFIG.baseUrl}/delete/booking/user`,
                onSuccess: loadUserBookings,
            });
        }
    }

    // Event Listeners
    document.getElementById("restaurant-form")?.addEventListener("submit", handleRestaurantForm);
    document.getElementById("logout-link")?.addEventListener("click", async (e) => {
        e.preventDefault();
        await logoutAndRedirect();
    });

    window.handleDeleteBooking = handleDeleteBooking;

    try {
        await loadUserData();
        await Promise.all([loadUserBookings(), loadUserRestaurants()]);
    } catch (error) {
        console.error("Error initializing application:", error);
    }
});