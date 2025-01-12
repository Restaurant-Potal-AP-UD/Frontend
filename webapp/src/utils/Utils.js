function validatePasswords(password1, password2) {
    return password1 === password2;
}

function getJWT() {
    const cookies = document.cookie.split("; ");
    const sessionCookie = cookies.find(cookie => cookie.startsWith("Session="));
    return sessionCookie ? sessionCookie.split("=")[1] : null;
}

export function displayNestedList(data, parentNode) {
    if (!data) return;

    const ul = document.createElement('ul');
    
    if (Array.isArray(data)) {
        data.forEach(item => {
            if (item !== null) {
                const li = document.createElement('li');
                li.classList.add('restaurant-item');
                
                const contentContainer = document.createElement('div');
                contentContainer.classList.add('restaurant-content');
                
                if (typeof item === 'object') {
                    Object.entries(item).forEach(([key, value]) => {
                        const propertyDiv = document.createElement('div');
                        propertyDiv.classList.add('restaurant-property');
                        
                        const formattedKey = key.split('_')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');
                        
                        if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                            propertyDiv.innerHTML = `<strong>${formattedKey}:</strong>`;
                            const nestedContainer = document.createElement('div');
                            nestedContainer.classList.add('nested-content');
                            displayNestedContent(value, nestedContainer);
                            propertyDiv.appendChild(nestedContainer);
                        } else {
                            propertyDiv.innerHTML = `<strong>${formattedKey}:</strong> ${value}`;
                        }
                        contentContainer.appendChild(propertyDiv);
                    });
                } else {
                    contentContainer.textContent = item;
                }
                
                const formContainer = document.createElement('div');
                formContainer.classList.add('booking-form-container');
                formContainer.setAttribute('data-restaurant-id', item.id);
                
                li.appendChild(contentContainer);
                li.appendChild(formContainer);
                ul.appendChild(li);
            }
        });
    } else if (typeof data === 'object') {
        const li = document.createElement('li');
        processObjectContent(data, li);
        ul.appendChild(li);
    } else {
        const li = document.createElement('li');
        li.textContent = data;
        ul.appendChild(li);
    }
    
    parentNode.appendChild(ul);
}

function displayNestedContent(data, container) {
    if (Array.isArray(data)) {
        const nestedUl = document.createElement('ul');
        data.forEach(item => {
            const nestedLi = document.createElement('li');
            if (typeof item === 'object' && item !== null) {
                processObjectContent(item, nestedLi);
            } else {
                nestedLi.textContent = item;
            }
            nestedUl.appendChild(nestedLi);
        });
        container.appendChild(nestedUl);
    } else if (typeof data === 'object' && data !== null) {
        processObjectContent(data, container);
    }
}

function processObjectContent(obj, container) {
    Object.entries(obj).forEach(([key, value]) => {
        const propertyDiv = document.createElement('div');
        propertyDiv.classList.add('property');
        
        const formattedKey = key.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            propertyDiv.innerHTML = `<strong>${formattedKey}:</strong>`;
            const nestedContainer = document.createElement('div');
            nestedContainer.classList.add('nested-content');
            displayNestedContent(value, nestedContainer);
            propertyDiv.appendChild(nestedContainer);
        } else {
            propertyDiv.innerHTML = `<strong>${formattedKey}:</strong> ${value}`;
        }
        container.appendChild(propertyDiv);
    });
}

export const API_CONFIG = {
    baseUrl: "http://localhost:8080/api/user",
    restaurantBaseUrl: "http://localhost:8081/api",
    getHeaders: () => ({
        "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
    })
};

export async function fetchWithError(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: API_CONFIG.getHeaders(),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        return await response.text();
    } catch (error) {
        console.error(`Error in fetch to ${url}:`, error);
        throw error;
    }
}

export async function handleFormSubmit({
    formData,
    url,
    method = 'POST',
    onSuccess,
    onError,
    validation
}) {
    try {
        if (validation) {
            const isValid = validation(formData);
            if (!isValid) return;
        }

        const response = await fetchWithError(url, {
            method,
            body: typeof formData === 'string' ? formData : JSON.stringify(formData),
        });

        if (onSuccess) {
            await onSuccess(response);
        }
    } catch (error) {
        if (onError) {
            onError(error);
        } else {
            alert(`Error: ${error.message}`);
        }
    }
}

export function updateDOMElement(elementId, content, defaultContent = '') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = content || defaultContent;
    } else {
        console.warn(`Element with id '${elementId}' not found`);
    }
}

export function listShow(data, parentNode) {
    displayNestedList(data, parentNode);
}

export { validatePasswords, getJWT };