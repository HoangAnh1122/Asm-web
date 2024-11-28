// Định nghĩa tài khoản quản trị viên cố định
const adminAccount = {
    username: "admin",
    password: "admin123",
    role: "admin"
};

// Khởi tạo giỏ hàng, đơn hàng, sản phẩm mẫu và người dùng hiện tại từ localStorage hoặc đặt mặc định
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// Thêm sản phẩm mẫu nếu chưa có trong `localStorage`
function addSampleProducts() {
    if (products.length === 0) {
        products = [
            { name: "Gold Necklace", price: 150, image: "images/gold_necklace.jpg", category: "Necklaces" },
            { name: "Silver Bracelet", price: 75, image: "images/silver_bracelet.jpg", category: "Bracelets" },
            { name: "Diamond Ring", price: 500, image: "images/diamond_ring.jpg", category: "Rings" },
            { name: "Pearl Earrings", price: 120, image: "images/pearl_earrings.jpg", category: "Earrings" },
            // Thêm các sản phẩm khác nếu cần thiết
        ];
        localStorage.setItem("products", JSON.stringify(products));
    }
}

// Gọi hàm để thêm sản phẩm mẫu nếu cần thiết
addSampleProducts();

// Đăng nhập
function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (username === adminAccount.username && password === adminAccount.password) {
        currentUser = adminAccount;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        alert("Admin login successful!");
        window.location.href = "products.html"; // Chuyển tới trang quản lý sản phẩm cho admin
    } else {
        const user = JSON.parse(localStorage.getItem(username));
        if (user && user.password === password) {
            currentUser = { username, role: "user" };
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            alert("Login successful!");
            window.location.href = "products.html";
        } else {
            alert("Invalid username or password.");
        }
    }
}

// Đăng ký
function register() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    if (username && password) {
        const newUser = { username, password, role: "user" };
        localStorage.setItem(username, JSON.stringify(newUser));
        alert("Registration successful! You can now log in.");
    } else {
        alert("Please enter both username and password to register.");
    }
}

// Đăng xuất
function logout() {
    currentUser = null;
    localStorage.removeItem("currentUser");
    alert("You have logged out.");
    window.location.href = "index.html";
}

// Hiển thị thông tin tài khoản
function displayAccountInfo() {
    const accountInfo = document.getElementById("account-info");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (currentUser) {
        accountInfo.innerHTML = `<p>Welcome, ${currentUser.username} (${currentUser.role})</p>
                                 <button onclick="logout()">Logout</button>`;
        loginForm.style.display = "none";
        registerForm.style.display = "none";
        displayOrders(); // Hiển thị lịch sử đơn hàng khi người dùng đã đăng nhập
    } else {
        accountInfo.innerHTML = "";
        loginForm.style.display = "block";
        registerForm.style.display = "block";
    }
}

// Hiển thị lịch sử đơn hàng
function displayOrders() {
    const orderDisplay = document.getElementById("order-history");
    if (orders.length === 0) {
        orderDisplay.innerHTML = "<p>No orders found.</p>";
    } else {
        orderDisplay.innerHTML = "<h3>Your Order History</h3>";
        orders.forEach((order) => {
            const items = order.items.map(item => `${item.name} (x${item.quantity})`).join(", ");
            orderDisplay.innerHTML += `<p>Order Date: ${order.date} - Items: ${items} - Status: ${order.status}</p>`;
        });
    }
}

// Hiển thị sản phẩm cho người dùng
function displayUserProducts() {
    const productDisplay = document.getElementById("product-display");
    productDisplay.innerHTML = "";

    products.forEach((product) => {
        productDisplay.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            </div>
        `;
    });
}

// Thêm, sửa, và xóa sản phẩm cho admin
function displayAdminProducts() {
    if (currentUser && currentUser.role === "admin") {
        document.getElementById("product-management").style.display = "block";
        const adminProductList = document.getElementById("admin-product-list");
        adminProductList.innerHTML = "";

        products.forEach((product, index) => {
            adminProductList.innerHTML += `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <button onclick="editProduct(${index})">Edit</button>
                    <button onclick="deleteProduct(${index})">Delete</button>
                </div>
            `;
        });
    }
}

// Thêm hoặc cập nhật sản phẩm
function addOrUpdateProduct() {
    const name = document.getElementById("product-name").value;
    const price = parseFloat(document.getElementById("product-price").value);
    const image = document.getElementById("product-image").value;

    if (name && !isNaN(price) && image) {
        products.push({ name, price, image });
        localStorage.setItem("products", JSON.stringify(products));
        displayAdminProducts();
        alert("Product added/updated successfully!");
    } else {
        alert("Please fill out all product fields.");
    }
}

// Xóa sản phẩm
function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    displayAdminProducts();
    alert("Product deleted successfully!");
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productName, productPrice) {
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${productName} has been added to the cart!`);
}

// Hiển thị giỏ hàng
function displayCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartItems.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td><button onclick="removeFromCart(${index})">Remove</button></td>
            </tr>
        `;
    });

    document.getElementById("total-price").innerText = `Total: $${total.toFixed(2)}`;
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

// Thanh toán giỏ hàng
function proceedToCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("checkout-total").innerText = `Total Payment: $${total.toFixed(2)}`;
    document.getElementById("checkout-section").style.display = "block";
}

function confirmPayment() {
    if (cart.length === 0) {
        alert("No items in cart to confirm payment.");
        return;
    }

    const order = { 
        items: [...cart],  // Lưu bản sao của giỏ hàng hiện tại
        date: new Date().toLocaleString(), 
        status: "Paid" 
    };
    
    // Thêm đơn hàng vào danh sách đơn hàng
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Xóa giỏ hàng sau khi thanh toán
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    
    alert("Payment confirmed! Thank you for your purchase.");
    displayCart();
    document.getElementById("checkout-section").style.display = "none";
}

// Hàm lọc sản phẩm
function filterProducts() {
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();
    const selectedCategory = document.getElementById("category-filter").value;

    const productDisplay = document.getElementById("product-display");
    productDisplay.innerHTML = "";

    const filteredProducts = products.filter(product => {
        // Kiểm tra xem sản phẩm có phù hợp với danh mục không
        const matchesCategory =
            selectedCategory === "all" || product.category === selectedCategory;
        
        // Kiểm tra xem tên sản phẩm có chứa từ khóa tìm kiếm không
        const matchesSearch = product.name.toLowerCase().includes(searchQuery);

        // Trả về sản phẩm nếu thỏa mãn cả 2 điều kiện
        return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        productDisplay.innerHTML = "<p>No products match your search.</p>";
        return;
    }

    // Hiển thị các sản phẩm đã lọc
    filteredProducts.forEach(product => {
        productDisplay.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            </div>
        `;
    });
}

// Khởi tạo khi tải trang
window.addEventListener("load", () => {
    if (window.location.pathname.endsWith("products.html")) {
        displayUserProducts();
        if (currentUser && currentUser.role === "admin") {
            displayAdminProducts();
        }
    } else if (window.location.pathname.endsWith("cart.html")) {
        displayCart();
    } else if (window.location.pathname.endsWith("account.html")) {
        displayAccountInfo();
    }
});
