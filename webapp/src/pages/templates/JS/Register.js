document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signup-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const password1 = document.getElementById('password1').value;
        const password2 = document.getElementById('password2').value;

        if (password1 != password2) {
            alert("Passwords do not match.");
            return;
        }

        const userData = {
            name: document.getElementById('name').value,
            surname: document.getElementById('surname').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: password1
        };

        fetch('http://localhost:8080/api/post-user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(userData) 
        })
        .then(async response => {
            const data = await response.json(); // Leer el cuerpo de la respuesta

            if (response.status !== 201) {
                throw new Error(data.error || 'Error desconocido en el servidor');
            }

            return data;
        })
        .then(data => {
            alert('Registration successful!');
            form.reset(); 
            window.location.href = "./home.html";
        })
        .catch(error => {
            console.error('Error:', error.message);
            alert('An error occurred: ' + error.message);
        });
    });
});
