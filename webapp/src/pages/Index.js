(function() {
    class AuthHandler {
        constructor() {
            this.navElement = document.querySelector('nav');
            this.init();
        }

        async init() {
            await this.checkAuthStatus();
            this.setupEventListeners();
        }

        async checkAuthStatus() {
            try {
                const token = localStorage.getItem("jwtToken")

                if (token) {

                    const authResponse = await fetch('http://localhost:8080/api/verify-token/', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const isAuthenticated = authResponse.ok;
                    console.log(`isAuthenticated: ${isAuthenticated}`);

                    this.navElement.innerHTML = `
                        <a href="./restaurants.html">Places</a>
                        ${isAuthenticated 
                            ? `<a href="./userSettings.html" id="settings">Settings</a>
                            <a href="#" id="logout">Log Out</a>`
                            : `<a href="./login.html" id="signup">Sign Up</a>`}
                    `;
                } else {
                    console.error('JWT cookie not found');
                    this.navElement.innerHTML = `
                        <a href="./restaurants.html">Places</a>
                        <a href="./login.html" id="signup">Sign Up</a>
                    `;
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                this.navElement.innerHTML = `
                    <a href="./restaurants.html">Places</a>s
                    <a href="./login.html" id="signup">Sign Up</a>
                `;
            }
        }


        async handleLogout() {
            localStorage.removeItem("jwtToken");
            window.location.reload(); // Añadir esta línea para refrescar la página
        }

        setupEventListeners() {
            this.navElement.addEventListener('click', async (e) => {
                if (e.target.id === 'logout') {
                    e.preventDefault();
                    await this.handleLogout();
                }
            });
        }

    }

    new AuthHandler();
})();