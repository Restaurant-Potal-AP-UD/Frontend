document.getElementById("search-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita la recarga de la página

    const name = document.getElementById("restaurant-name").value;
    const location = document.getElementById("location").value;

    try {
        const response = await fetch("/search-restaurants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, location })
        });

        if (!response.ok) {
            throw new Error("Error fetching data");
        }

        const restaurants = await response.json();
        displayRestaurants(restaurants);
    } catch (error) {
        console.error("Error:", error);
    }
});

function displayRestaurants(restaurants) {
    const list = document.getElementById("restaurant-list");
    list.innerHTML = ""; // Limpiar resultados anteriores

    if (restaurants.length === 0) {
        list.innerHTML = "<li>No restaurants found</li>";
        return;
    }

    restaurants.forEach(restaurant => {
        const li = document.createElement("li");
        li.textContent = `${restaurant.name} - ${restaurant.location}`;
        list.appendChild(li);
    });
}