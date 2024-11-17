const products = [
    { id: 1, name: "Call of Duty: Modern Warfare 2", price: 315000, image: "img/COD-MW2.avif" },
    { id: 2, name: "CRASH TEAM RUMBLE", price: 180000, image: "img/CRASH-TEAM-RUMBLE.avif" },
    { id: 3, name: "CUPHEAD", price: 90000, image: "img/CUPHEAD.jpg" },
    { id: 4, name: "FALLOUT", price: 135000, image: "img/FALLOUT.jpg" },
    { id: 5, name: "FAR CRY 6", price: 270000, image: "img/FARCRY6.jpg" }, 
    { id: 6, name: "FC 25", price: 315000, image: "img/FC25.jpg" },
    { id: 7, name: "God Of War: RAGNAROK", price: 315000, image: "img/GOW-RAGNAROK.webp" },
    { id: 8, name: "GTA V", price: 135000, image: "img/GTA5.jpg" },
    { id: 9, name: "Halo: The Master Chief Collection", price: 180000, image: "img/HALO-master-chief-collection.webp" },
    { id: 10, name: "LORDS OF THE FALLEN", price: 270000, image: "img/LOF.webp" },
    { id: 11, name: "LUIGI'S MANSION 2", price: 225000, image: "img/LUIGIS-2.png" },
    { id: 12, name: "MINECRAFT", price: 135000, image: "img/MINECARFT.webp" },
    { id: 13, name: "MORTAL KOMBAT 1", price: 247000, image: "img/MK1.webp" },
    { id: 14, name: "PRINCE OF PERSIA", price: 180000, image: "img/PRINCE-OF-PERSIA.png" },
    { id: 15, name: "RESIDENT EVIL 3", price: 180000, image: "img/RE3.jpg" },
    { id: 16, name: "RED READ REDEPTION II", price: 270000, image: "img/RRR2.jpeg" },
    { id: 17, name: "SPIDER-MAN 2", price: 315000, image: "img/spiderman-2.avif" },
    { id: 18, name: "BATTLEFIELD 1", price: 60000, image: "img/BF1.jpg" },
    { id: 19, name: "ASSASSIN'S CREED ROGUE REMASTERED", price: 135000, image: "img/ACR.JPG" },
    { id: 20, name: "SUPER MARIO ODYSSEY", price: 279000, image: "img/SUPER-MARIO-ODYSSEY.jpeg" }

];

let users = [
    { email: 'milton.novoa2005@gmail.com', password: 'contraseña123' }
];

let cart = [];
let user = null;

const mainContent = document.getElementById('main-content');
const cartCount = document.getElementById('cart-count');
const searchInput = document.getElementById('search');
const modal = document.getElementById('payment-modal');
const closeBtn = modal.querySelector('.close');
const paymentForm = document.getElementById('payment-form');
const loginLink = document.getElementById('login');
const registerLink = document.getElementById('register');
const logoutLink = document.getElementById('logout');

// Funciones de renderizado
function renderProducts(productsToRender) {
    mainContent.innerHTML = `
        <div class="product-grid">
            ${productsToRender.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Añadir al carrito</button>
                </div>
            `).join('')}
        </div>
    `;
}

function renderCart() {
    mainContent.innerHTML = `
        <div class="cart-container">
            <h2>Carrito de Compras</h2>
            ${cart.length === 0 ? '<p>Tu carrito está vacío</p>' : ''}
            ${cart.map(item => `
                <div class="cart-item">
                    <span>${item.name} - $${item.price.toFixed(2)}</span>
                    <button onclick="removeFromCart(${item.id})"><i class='bx bx-trash'></i></button>
                </div>
            `).join('')}
            ${cart.length > 0 ? `
                <div class="cart-total">Total: $${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</div>
                <button class="checkout-btn" onclick="checkout()">Proceder al pago</button>
            ` : ''}
        </div>
    `;
}

function renderLoginForm() {
    mainContent.innerHTML = `
        <form id="login-form" class="auth-form">
            <h2>Iniciar Sesión</h2>
            <div class="form-group">
                <label for="login-email">Email</label>
                <input type="email" id="login-email" required>
            </div>
            <div class="form-group">
                <label for="login-password">Contraseña</label>
                <input type="password" id="login-password" required>
            </div>
            <button type="submit">Iniciar Sesión</button>
            <p>¿No tienes una cuenta? <a href="#" id="go-to-register">Regístrate aquí</a></p>
        </form>
    `;
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('go-to-register').addEventListener('click', renderRegisterForm);
}

function renderRegisterForm() {
    mainContent.innerHTML = `
        <form id="register-form" class="auth-form">
            <h2>Registrarse</h2>
            <div class="form-group">
                <label for="register-email">Email</label>
                <input type="email" id="register-email" required>
            </div>
            <div class="form-group">
                <label for="register-password">Contraseña</label>
                <input type="password" id="register-password" required>
            </div>
            <div class="form-group">
                <label for="register-confirm-password">Confirmar Contraseña</label>
                <input type="password" id="register-confirm-password" required>
            </div>
            <button type="submit">Registrarse</button>
            <p>¿Ya tienes una cuenta? <a href="#" id="go-to-login">Inicia sesión aquí</a></p>
        </form>
    `;
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('go-to-login').addEventListener('click', renderLoginForm);
}

// Funciones de autenticación
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
        user = { email: foundUser.email };
        alert('Sesión iniciada correctamente');
        updateAuthUI();
        renderProducts(products);
    } else {
        alert('Email o contraseña incorrectos');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        alert('Este email ya está registrado');
        return;
    }
    
    users.push({ email, password });
    alert('Registro exitoso. Por favor, inicia sesión.');
    renderLoginForm();
}

function handleLogout() {
    user = null;
    updateAuthUI();
    renderProducts(products);
}

function updateAuthUI() {
    if (user) {
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        logoutLink.style.display = 'inline';
        logoutLink.textContent = `Cerrar Sesión (${user.email})`;
    } else {
        loginLink.style.display = 'inline';
        registerLink.style.display = 'inline';
        logoutLink.style.display = 'none';
    }
}

// Funciones de carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        alert('Producto añadido al carrito');
    }
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCartCount();
        renderCart();
    }
}

function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Función de búsqueda
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(filteredProducts);
}

// Función de checkout
function checkout() {
    if (!user) {
        alert('Por favor, inicia sesión para continuar con la compra');
        renderLoginForm();
        return;
    }
    // Mostrar el modal de pago
    modal.style.display = 'block';
}

// Cerrar el modal
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

// Cerrar el modal si se hace clic fuera de él
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Manejar el envío del formulario de pago
paymentForm.onsubmit = function(e) {
    e.preventDefault();
    alert('¡Pago procesado con éxito!');
    modal.style.display = 'none';
    cart = [];
    updateCartCount();
    renderProducts(products);
}

document.getElementById('home').addEventListener('click', () => renderProducts(products));
document.getElementById('products').addEventListener('click', () => renderProducts(products));
document.getElementById('cart').addEventListener('click', renderCart);
loginLink.addEventListener('click', renderLoginForm);
registerLink.addEventListener('click', renderRegisterForm);
logoutLink.addEventListener('click', handleLogout);

searchInput.addEventListener('input', (e) => searchProducts(e.target.value));

updateAuthUI();
renderProducts(products);