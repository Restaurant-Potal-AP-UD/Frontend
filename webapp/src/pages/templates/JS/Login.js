import { validatePasswords} from '../../../utils/Utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signin-form');

    const handleFormSubmission = async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value.trim;
        const password1 = document.getElementById('password1').value;
        const password2 = document.getElementById('password2').value;

        if (!validatePasswords(password1, password2)) {
            alert('Las contraseñas no coinciden');
            return;
        }

        const userData = {
            username: username,
            hashed_password: password1 // Hash password ideally
        }

        try {
            const response = await fetch('http://localhost:8080/api/generate-token/', {
                method : 'POST',
                body: JSON.stringify(userData),
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {

                throw new Error(`Error ${response.status}: ${response.statusText}`);
               
            }

            const data = await response.json();

            console.log(data);

            localStorage.setItem('jwtToken', data.token);
            form.reset();

            localStorage.setItem('jwtToken', data.token);
            window.location.href = "./index.html";
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong, please try again.');
        }

    };

    form.addEventListener('submit', handleFormSubmission);

});

       
