document.addEventListener("DOMContentLoaded", function () {
    const divRestaurants = document.getElementById("list-restaurants");
    const nav = document.querySelector("nav");

    if (localStorage.getItem("jwtToken")) {
        const settingsLink = document.createElement("a");
        settingsLink.href = "./userSettings.html";
        settingsLink.textContent = "Settings";

        const logoutLink = document.createElement("a");
        logoutLink.href = "#";  
        logoutLink.textContent = "Log Out";
        logoutLink.addEventListener("click", function(event) {
            event.preventDefault();  
            localStorage.removeItem("jwtToken"); 
            location.reload();  
        });

        nav.appendChild(settingsLink);
        nav.appendChild(logoutLink);
    } else {
        const signInLink = document.createElement("a");
        signInLink.href = "./login.html";
        signInLink.textContent = "Sign In";

        const signUpLink = document.createElement("a");
        signUpLink.href = "./register.html";
        signUpLink.textContent = "Sign Up";

        nav.appendChild(signInLink);
        nav.appendChild(signUpLink);
    }


    fetch('http://localhost:8081/api/get/restaurant/all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (Array.isArray(data)) {
            data.forEach(restaurant => {
                createRestaurantContainer(restaurant, divRestaurants);
            });
        } else {
            console.error("Expected an array of restaurants, received:", data);
        }
    })
    .catch(error => {
        console.error("Error fetching the restaurants:", error);
        divRestaurants.innerHTML = '<p class="error">Error loading restaurants. Please try again later.</p>';
    });
});



function createRestaurantContainer(restaurant, parentElement) {
    if (!restaurant || typeof restaurant !== 'object') {
        console.error('Invalid restaurant data:', restaurant);
        return;
    }

    const container = document.createElement('div');
    container.className = 'restaurant-container';
    
    const restaurantInfo = document.createElement('div');
    restaurantInfo.className = 'restaurant-info';
    restaurantInfo.innerHTML = `
        <h2>${restaurant.restaurant_name || 'Unnamed Restaurant'}, ${restaurant.restaurant_id || 'Unknown ID'}</h2>
        <p><strong>Owner:</strong> ${restaurant.restaurant_owner || 'Not specified'}</p>
    `;

    const addressesSection = document.createElement('div');
    addressesSection.className = 'addresses-section';
    addressesSection.innerHTML = '<h3>Locations</h3>';
    
    const addressesList = document.createElement('ul');
    if (Array.isArray(restaurant.restaurant_addresses)) {
        restaurant.restaurant_addresses
            .filter(address => address !== null)
            .forEach(address => {
                if (address && typeof address === 'object') {
                    const addressItem = document.createElement('li');
                    addressItem.innerHTML = `
                        ${address.street || ''}, 
                        ${address.city || ''}, 
                        ${address.state || ''} 
                        ${address.zip_code || ''}
                    `.replace(/,\s+,/g, ',').replace(/^,\s+|\s+,$/g, '');
                    addressesList.appendChild(addressItem);
                }
            });
    }
    
    if (!addressesList.children.length) {
        const noAddress = document.createElement('li');
        noAddress.textContent = 'No addresses available';
        addressesList.appendChild(noAddress);
    }
    addressesSection.appendChild(addressesList);
    
    const bookingsSection = document.createElement('div');
    bookingsSection.className = 'bookings-section';   
    if (localStorage.getItem("jwtToken")){
        const bookingForm = document.createElement("form");
        bookingForm.id = "booking-form";
        bookingForm.method = "post";
        bookingForm.innerHTML = `
            <div class="form-group">
                <label for="datetime">Date and Time:</label>
                <input type="datetime-local" id="datetime" name="datetime" required>
            </div>

            <div class="form-group">
                <label for="people">Number of People:</label>
                <input type="number" id="people" name="people" min="1" max="60" required>
            </div>

            <input type="submit" value="Make Reservation" class="submit-btn">
        `;
        
        // Create closure to capture restaurant data
        bookingForm.addEventListener('submit', function(event) {
            handleForm(event, restaurant);
        });
        
        bookingsSection.appendChild(bookingForm);
    } else {
        
        bookingsSection.innerHTML = `
            <h3>Bookings</h3>
            <h3>Log In to make some reservations</h3>
        `
    }
    
    container.appendChild(restaurantInfo);
    container.appendChild(addressesSection);
    container.appendChild(bookingsSection);
    
    container.style.marginBottom = '20px';
    
    parentElement.appendChild(container);
}

async function handleForm(event, restaurant) {
    event.preventDefault();
    
    const datetime = new Date(document.getElementById('datetime').value);
    const people = document.getElementById('people').value;

    const formData = {
        "booking_date": {
            "year": datetime.getFullYear(),
            "month": datetime.getMonth() + 1, // getMonth() returns 0-11
            "day": datetime.getDate(),
            "hour": datetime.getHours(),
            "minute": datetime.getMinutes()
        },
        "restaurant_id": restaurant.restaurant_id,
        "people_quantity": people
    }

    console.log(formData)

    await fetch('http://localhost:8081/api/post/booking/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Booking successful:', data);
        alert('Booking successful!');
    })
    .catch(error => {
        console.error("Error during booking:", error);
        alert('Error making booking. Please try again.');
    });
}

// Add CSS styles
const styles = document.createElement('style');
styles.textContent = `
    .restaurant-container {
        border: 1px solid #ddd;
        padding: 20px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .restaurant-info h2 {
        margin: 0 0 10px 0;
        color: #333;
    }

    .addresses-section,
    .bookings-section {
        margin-top: 15px;
    }

    .addresses-section h3,
    .bookings-section h3 {
        color: #666;
        margin-bottom: 10px;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    li {
        padding: 8px 0;
        border-bottom: 1px solid #eee;
    }

    li:last-child {
        border-bottom: none;
    }

    .error {
        color: #dc3545;
        padding: 20px;
        text-align: center;
        background-color: #f8d7da;
        border-radius: 4px;
        margin: 20px 0;
    }

    #booking-form {
        margin-top: 20px;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 4px;
    }

    .form-group {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
        color: #495057;
    }

    input[type="datetime-local"],
    input[type="number"] {
        width: 100%;
        padding: 8px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 16px;
    }

    .submit-btn {
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
    }

    .submit-btn:hover {
        background-color: #0056b3;
    }
`;
document.head.appendChild(styles);