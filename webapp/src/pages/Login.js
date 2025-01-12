import { validatePasswords} from '../utils/Utils.js';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signin-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password1 = document.getElementById('password1').value;
        const password2 = document.getElementById('password2').value;

        if (!validatePasswords(password1, password2)) {
            alert('Las contraseñas no coinciden');
            return;
        }

        const userData = {
            username: username,
            hashed_password: password1
        }

        fetch('http://localhost:8080/api/generate-token/', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to get a token, please check Login credentials');
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            localStorage.setItem('jwtToken', data.token);
            form.reset();
            window.location.href = "./index.html";
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong, please try again.');
        });
    });
});

