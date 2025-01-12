import { validatePasswords } from '../utils/Utils.js';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signup-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const password1 = document.getElementById('password1').value;
        const password2 = document.getElementById('password2').value;

        if (!validatePasswords(password1, password2)) {
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
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to register: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Registration successful!');
                form.reset(); 
                window.location.href = "./index.html"
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
});
