document.addEventListener("DOMContentLoaded", function () {

    const accordionTriggers = document.querySelectorAll(".accordion-trigger");
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener("click", function () {
            if (window.innerWidth <= 768) {
                const parentBox = this.parentElement;
                parentBox.classList.toggle("active");
                document.querySelectorAll(".accordion-box").forEach(box => {
                    if (box !== parentBox) box.classList.remove("active");
                });
            }
        });
    });

    const locBtn = document.querySelector(".set-location-btn");
    const locBar = document.getElementById("locationBar");
    if (locBtn && locBar) {
        locBtn.addEventListener("click", function() { locBar.style.display = "none"; });
    }

    const menuItems = [
        { id: 1, name: "Match Day Bucket", category: "chicken", price: 19.5, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500", desc: "8 Pcs Hot & Crispy Chicken + 2 Dips. Perfect for game day!" },
        { id: 2, name: "Zinger Burger", category: "burgers", price: 5.49, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", desc: "Signature crunchy chicken fillet burger with dynamic spicy mayo." },
        { id: 3, name: "Chicken Rice Bowlz", category: "rice", price: 6.99, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500", desc: "Flavor-packed gravy over premium rice alongside crispy chicken pops." },
        { id: 4, name: "Veg Krisper Burger", category: "veg", price: 4.49, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500", desc: "100% vegetarian crisp potato and veggie patty with fresh lettuce." },
        { id: 5, name: "Large French Fries", category: "snacks", price: 2.99, image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500", desc: "Crispy golden premium quality fries with signature seasoning." },
        { id: 6, name: "Chilled Pepsi Can", category: "drinks", price: 1.99, image: "https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=500", desc: "Refresh your meal with a sparkling ice-cold carbonated soda." }
    ];

    let cart = [];

    const homeView = document.getElementById("homeView");
    const menuView = document.getElementById("menuView");
    const helpView = document.getElementById("helpView");
    const homeLogoBtn = document.getElementById("homeLogoBtn");

    function hideAllViews() {
        homeView.classList.add("hidden-view");
        menuView.classList.add("hidden-view");
        helpView.classList.add("hidden-view");
    }

    window.showMenuView = function(category = "all") {
        hideAllViews();
        menuView.classList.remove("hidden-view");
        window.scrollTo(0, 0);
        filterMenuCategory(category);
    };

    window.showHomeView = function() {
        hideAllViews();
        homeView.classList.remove("hidden-view");
        window.scrollTo(0, 0);
    };

    window.showHelpView = function() {
        hideAllViews();
        helpView.classList.remove("hidden-view");
        window.scrollTo(0, 0);
    };

    if (homeLogoBtn) homeLogoBtn.addEventListener("click", showHomeView);

    function displayMenuItems(items) {
        const menuContainer = document.getElementById("menuItemsDisplay");
        if (!menuContainer) return;
        if (items.length === 0) {
            menuContainer.innerHTML = `<p style="padding:20px;font-family:Arial;">No items found.</p>`;
            return;
        }
        menuContainer.innerHTML = items.map(item => `
            <div class="food-card">
                <img src="${item.image}" alt="${item.name}">
                <div class="food-card-body">
                    <h4>${item.name}</h4>
                    <p>${item.desc}</p>
                </div>
                <div class="food-card-footer">
                    <span class="food-price">$${item.price.toFixed(2)}</span>
                    <button class="food-add-btn" onclick="addItemToCart(${item.id})">Add To Bucket</button>
                </div>
            </div>
        `).join('');
    }

    window.filterMenuCategory = function(category) {
        document.querySelectorAll(".menu-side-btn").forEach(btn => btn.classList.remove("active-category"));
        const activeBtn = document.getElementById(`cat-${category}`);
        if (activeBtn) activeBtn.classList.add("active-category");
        displayMenuItems(category === "all" ? menuItems : menuItems.filter(i => i.category === category));
    };

    const cartDrawer = document.getElementById("cartDrawer");
    const cartToggleBtn = document.getElementById("cartToggleBtn");
    const cartCloseBtn = document.getElementById("cartCloseBtn");

    if (cartToggleBtn) cartToggleBtn.addEventListener("click", () => cartDrawer.classList.toggle("open-drawer"));
    if (cartCloseBtn) cartCloseBtn.addEventListener("click", () => cartDrawer.classList.remove("open-drawer"));

    window.addItemToCart = function(id) {
        const product = menuItems.find(i => i.id === id);
        const existing = cart.find(i => i.id === id);
        if (existing) existing.quantity += 1;
        else cart.push({ ...product, quantity: 1 });
        updateCartDOM();
    };

    window.incrementItem = function(id) {
        const item = cart.find(i => i.id === id);
        if (item) item.quantity += 1;
        updateCartDOM();
    };

    window.decrementItem = function(id) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity -= 1;
            if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
        }
        updateCartDOM();
    };

    window.removeItem = function(id) {
        cart = cart.filter(i => i.id !== id);
        updateCartDOM();
    };

    function updateCartDOM() {
        const badge = document.getElementById("cart-count");
        const body = document.getElementById("cartDrawerItems");
        const subtotalEl = document.getElementById("cartSubtotal");

        if (badge) badge.innerText = cart.reduce((t, i) => t + i.quantity, 0);
        if (!body) return;

        if (cart.length === 0) {
            body.innerHTML = `<p class="empty-cart-msg">Your bucket is empty. Let's add some chicken!</p>`;
            if (subtotalEl) subtotalEl.innerText = "0.00";
            return;
        }

        body.innerHTML = cart.map(item => `
            <div class="cart-drawer-item">
                <img class="cart-item-img" src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <p class="cart-item-unit-price">$${item.price.toFixed(2)} each</p>
                    <div class="cart-qty-controls">
                        <button class="qty-btn" onclick="decrementItem(${item.id})"><i class="fa-solid fa-minus"></i></button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="incrementItem(${item.id})"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
                <div class="cart-item-right">
                    <strong class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</strong>
                    <button class="cart-remove-btn" onclick="removeItem(${item.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `).join('');

        if (subtotalEl) subtotalEl.innerText = cart.reduce((t, i) => t + i.price * i.quantity, 0).toFixed(2);
    }

    const offersCarousel = document.getElementById("offersCarousel");
    const slideLeft = document.getElementById("slideLeft");
    const slideRight = document.getElementById("slideRight");
    if (offersCarousel && slideLeft && slideRight) {
        slideLeft.addEventListener("click", () => offersCarousel.scrollBy({ left: -300, behavior: 'smooth' }));
        slideRight.addEventListener("click", () => offersCarousel.scrollBy({ left: 300, behavior: 'smooth' }));
    }

    const qrContainer = document.getElementById("kfcMenuQrCode");
    if (qrContainer) {
        new QRCode(qrContainer, { text: window.location.href, width: 120, height: 120, colorDark: "#e4002b", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H });
    }

    displayMenuItems(menuItems);

    window.openPaymentModal = function() {
        const subtotalUSD = cart.reduce((t, i) => t + i.price * i.quantity, 0);
        if (subtotalUSD === 0) { alert("Your bucket is empty! Add some chicken before checking out."); return; }
        const subtotalINR = Math.round(subtotalUSD * 85);
        document.getElementById("pop-up-total").innerText = "₹" + subtotalINR + ".00";
        document.getElementById("qrcode-container").innerHTML = "";
        new QRCode(document.getElementById("qrcode-container"), {
            text: `upi://pay?pa=seshswetha-1@okhdfcbank=KFC_Clone_Store&am=${subtotalINR}&cu=INR`,
            width: 200, height: 200, colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H
        });
        document.getElementById("payment-modal").style.display = "flex";
    };

    window.closeModal = function() { document.getElementById("payment-modal").style.display = "none"; };

    window.addEventListener("click", function(e) {
        const modal = document.getElementById("payment-modal");
        if (e.target === modal) modal.style.display = "none";
    });

    window.toggleFAQ = function(questionEl) {
        const faqItem = questionEl.parentElement;
        const isOpen = faqItem.classList.contains("faq-open");
        questionEl.closest(".faq-section").querySelectorAll(".faq-item").forEach(item => item.classList.remove("faq-open"));
        if (!isOpen) faqItem.classList.add("faq-open");
    };

    window.scrollToSection = function(id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.filterFAQ = function() {
        const query = document.getElementById("helpSearchInput").value.toLowerCase();
        document.querySelectorAll(".faq-item").forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(query) ? "" : "none";
        });
        document.querySelectorAll(".faq-section").forEach(section => {
            const visible = [...section.querySelectorAll(".faq-item")].some(i => i.style.display !== "none");
            section.style.display = visible ? "" : "none";
        });
    };
});