document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.getElementById('heroSection');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const currentSectionSpan = document.querySelector('.current-section');
    const sectionNames = {
        'home': 'Home',
        'menu': 'Menu',
        'about': 'About',
        'contact': 'Contact',
        'catering': 'Catering',
        'experiences': 'Experiences',
        'more': 'More'
    };
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all nav links
            navLinks.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Update mobile dropdown current section text
            if (currentSectionSpan && sectionNames[targetSection]) {
                currentSectionSpan.textContent = sectionNames[targetSection];
            }
            
            // Close mobile dropdown if open
            const mobileDropdown = document.querySelector('.mobile-dropdown');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileDropdown && mobileToggle) {
                mobileDropdown.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
            
            // If Home is clicked, expand hero section and show home content
            if (targetSection === 'home') {
                heroSection.classList.remove('collapsed');
                
                // Hide all content sections
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show home section after hero expands
                setTimeout(() => {
                    const homeSection = document.getElementById('home');
                    if (homeSection) {
                        homeSection.classList.add('active');
                    }
                    // Scroll to top smoothly
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 300);
            } else {
                // Collapse hero section for other sections
                heroSection.classList.add('collapsed');
                
                // Hide all content sections
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show target section after a short delay for smooth transition
                setTimeout(() => {
                    const target = document.getElementById(targetSection);
                    if (target) {
                        target.classList.add('active');
                        // Scroll to top smoothly, accounting for fixed header
                        const headerHeight = document.querySelector('.navbar').offsetHeight;
                        window.scrollTo({
                            top: target.offsetTop - headerHeight,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            }
        });
    });
    
    // Handle "View Menu" button in home section
    const viewMenuBtn = document.querySelector('.view-menu-btn');
    if (viewMenuBtn) {
        viewMenuBtn.addEventListener('click', function() {
            const menuLink = document.querySelector('[data-section="menu"]');
            if (menuLink) {
                menuLink.click();
            }
        });
    }
    
    // Handle reservation form submission
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your reservation request! We will contact you shortly to confirm.');
            this.reset();
        });
    }
    
    // (Removed legacy alert for Order Online)
    
    // Handle menu tab switching
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuTabContents = document.querySelectorAll('.menu-tab-content');
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            menuTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab contents
            menuTabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show target tab content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
                // Do not auto-scroll on tab change to avoid page jumping
            }
        });
    });
    
    // Handle mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    
    if (mobileMenuToggle && mobileDropdown) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            mobileDropdown.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!mobileDropdown.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    mobileMenuToggle.classList.remove('active');
                    mobileDropdown.classList.remove('active');
                }
            }
        });
    }

    const TAX_RATE = 0.0825;
    const DELIVERY_FEE = 3.99;
    const cartButton = document.getElementById('cartButton');
    const cartDrawer = document.getElementById('cartDrawer');
    const closeCart = document.getElementById('closeCart');
    const cartItemsEl = document.getElementById('cartItems');
    const cartCountEl = document.getElementById('cartCount');
    const subtotalAmt = document.getElementById('subtotalAmt');
    const deliveryAmt = document.getElementById('deliveryAmt');
    const taxAmt = document.getElementById('taxAmt');
    const tipAmt = document.getElementById('tipAmt');
    const totalAmt = document.getElementById('totalAmt');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const clearCartBtn = document.getElementById('clearCart');
    const orderTypeInputs = document.querySelectorAll('input[name="orderType"]');
    const deliveryFields = document.getElementById('deliveryFields');
    const deliveryAddress = document.getElementById('deliveryAddress');
    const deliveryInstructions = document.getElementById('deliveryInstructions');
    const tipButtons = document.querySelectorAll('.tip-btn');
    const customTipInput = document.getElementById('customTip');

    // Quantity modal elements
    const qtyBackdrop = document.getElementById('qtyBackdrop');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const qtyInput = document.getElementById('qtyInput');
    const qtyCancel = document.getElementById('qtyCancel');
    const qtyConfirm = document.getElementById('qtyConfirm');
    let pendingItem = null; // { name, price }

    let cart = { items: [], tip: { mode: 'percent', value: 0 }, orderType: 'pickup' };

    function money(n) { return `$${n.toFixed(2)}`; }
    function saveCart() { localStorage.setItem('cumin_cart', JSON.stringify(cart)); }
    function loadCart() {
        try { const raw = localStorage.getItem('cumin_cart'); if (raw) cart = JSON.parse(raw); } catch(e) {}
        if (!cart || !Array.isArray(cart.items)) cart = { items: [], tip: { mode: 'percent', value: 0 }, orderType: 'pickup' };
    }
    function updateCartCount() {
        const count = cart.items.reduce((a,b)=>a+b.qty,0);
        if (cartCountEl) cartCountEl.textContent = String(count);
    }
    function openCart() { if (cartDrawer) { cartDrawer.classList.add('active'); cartDrawer.setAttribute('aria-hidden','false'); } }
    function closeCartDrawer() { if (cartDrawer) { cartDrawer.classList.remove('active'); cartDrawer.setAttribute('aria-hidden','true'); } }

    function parsePrice(text) {
        const m = text.match(/\$([0-9]+(?:\.[0-9]{1,2})?)/);
        return m ? parseFloat(m[1]) : 0;
    }

    function addToCart(name, price) {
        const id = name.toLowerCase();
        const existing = cart.items.find(i=>i.id===id && i.price===price);
        if (existing) existing.qty += 1; else cart.items.push({ id, name, price, qty: 1 });
        saveCart();
        updateCartCount();
        renderCart();
    }

    function addToCartWithQty(name, price, qty) {
        if (!qty || qty < 1) return;
        const id = name.toLowerCase();
        const existing = cart.items.find(i=>i.id===id && i.price===price);
        if (existing) existing.qty += qty; else cart.items.push({ id, name, price, qty });
        saveCart();
        updateCartCount();
        renderCart();
    }

    function removeFromCart(id, price) {
        cart.items = cart.items.filter(i => !(i.id===id && i.price===price));
        saveCart();
        updateCartCount();
        renderCart();
    }

    function changeQty(id, price, delta) {
        const item = cart.items.find(i=>i.id===id && i.price===price);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) removeFromCart(id, price); else { saveCart(); updateCartCount(); renderCart(); }
    }

    function totals() {
        const subtotal = cart.items.reduce((s,i)=> s + i.price * i.qty, 0);
        const delivery = cart.orderType === 'delivery' && cart.items.length ? DELIVERY_FEE : 0;
        const taxable = subtotal + delivery;
        const tax = taxable * TAX_RATE;
        let tip = 0;
        if (cart.tip.mode === 'percent') tip = subtotal * (cart.tip.value || 0);
        if (cart.tip.mode === 'custom') tip = Math.max(0, Number(cart.tip.value) || 0);
        const total = subtotal + delivery + tax + tip;
        return { subtotal, delivery, tax, tip, total };
    }

    function renderCart() {
        if (!cartItemsEl) return;
        cartItemsEl.innerHTML = '';
        cart.items.forEach(i => {
            const row = document.createElement('div');
            row.className = 'cart-line';
            const name = document.createElement('div');
            name.textContent = `${i.name}`;
            const qty = document.createElement('div');
            qty.className = 'qty';
            const minus = document.createElement('button'); minus.textContent = '-';
            const q = document.createElement('span'); q.textContent = String(i.qty);
            const plus = document.createElement('button'); plus.textContent = '+';
            minus.addEventListener('click', ()=>changeQty(i.id, i.price, -1));
            plus.addEventListener('click', ()=>changeQty(i.id, i.price, +1));
            qty.appendChild(minus); qty.appendChild(q); qty.appendChild(plus);
            const price = document.createElement('div');
            price.textContent = money(i.price * i.qty);
            row.appendChild(name); row.appendChild(qty); row.appendChild(price);
            cartItemsEl.appendChild(row);
        });
        const t = totals();
        if (subtotalAmt) subtotalAmt.textContent = money(t.subtotal);
        if (deliveryAmt) deliveryAmt.textContent = money(t.delivery);
        if (taxAmt) taxAmt.textContent = money(t.tax);
        if (tipAmt) tipAmt.textContent = money(t.tip);
        if (totalAmt) totalAmt.textContent = money(t.total);
    }

    function clearCart() {
        cart.items = [];
        saveCart();
        updateCartCount();
        renderCart();
    }

    function injectAddButtons() {
        const items = document.querySelectorAll('.menu-item');
        items.forEach(el => {
            if (el.querySelector('.add-btn')) return;
            const nameEl = el.querySelector('.item-name');
            const priceEl = el.querySelector('.item-price');
            if (!nameEl || !priceEl) return;
            const btn = document.createElement('button');
            btn.className = 'add-btn';
            btn.textContent = 'Add';
            btn.addEventListener('click', () => openQtyModal(nameEl.textContent.trim(), parsePrice(priceEl.textContent)));
            priceEl.after(btn);
        });
    }

    function openQtyModal(name, price) {
        pendingItem = { name, price };
        if (qtyInput) qtyInput.value = '1';
        if (qtyBackdrop) qtyBackdrop.hidden = false;
        setTimeout(() => { if (qtyInput) qtyInput.focus(); }, 0);
    }

    function closeQtyModal() {
        pendingItem = null;
        if (qtyBackdrop) qtyBackdrop.hidden = true;
    }

    function setTipPercent(p) {
        cart.tip = { mode: 'percent', value: p };
        customTipInput.value = '';
        tipButtons.forEach(b => b.classList.toggle('active', Number(b.dataset.tip) === p));
        saveCart(); renderCart();
    }

    function setCustomTip(val) {
        cart.tip = { mode: 'custom', value: Math.max(0, Number(val) || 0) };
        tipButtons.forEach(b => b.classList.remove('active'));
        saveCart(); renderCart();
    }

    function setOrderType(type) {
        cart.orderType = type;
        if (deliveryFields) deliveryFields.hidden = type !== 'delivery';
        saveCart(); renderCart();
    }

    async function checkout() {
        if (!cart.items.length) { alert('Your cart is empty.'); return; }
        const meta = {
            orderType: cart.orderType,
            deliveryAddress: cart.orderType === 'delivery' ? (deliveryAddress.value || '') : '',
            deliveryInstructions: cart.orderType === 'delivery' ? (deliveryInstructions.value || '') : '',
            tip: cart.tip,
            taxRate: TAX_RATE,
            currency: 'USD'
        };
        const line_items = cart.items.map(i => ({
            name: i.name,
            unit_amount: Math.round(i.price * 100),
            quantity: i.qty,
            currency: 'usd'
        }));
        try {
            const res = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ line_items, meta })
            });
            if (!res.ok) { alert('Unable to start checkout yet.'); return; }
            const data = await res.json();
            if (data && data.url) { window.location.href = data.url; return; }
            alert('Checkout session created, but no redirect URL returned.');
        } catch(e) {
            alert('Checkout not available. This will work after connecting the Stripe endpoint.');
        }
    }

    loadCart();
    updateCartCount();
    injectAddButtons();
    renderCart();

    if (cartButton) cartButton.addEventListener('click', openCart);
    const orderCta = document.querySelector('.order-btn');
    if (orderCta) orderCta.addEventListener('click', function(){
        const menuLink = document.querySelector('[data-section="menu"]');
        if (menuLink) menuLink.click();
        // Do not auto-open cart; user will click Add on a menu item first
    });
    if (closeCart) closeCart.addEventListener('click', closeCartDrawer);

    orderTypeInputs.forEach(r => r.addEventListener('change', e => setOrderType(e.target.value)));
    tipButtons.forEach(b => b.addEventListener('click', ()=> setTipPercent(Number(b.dataset.tip))));
    if (customTipInput) customTipInput.addEventListener('input', (e)=> setCustomTip(e.target.value));
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
    if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

    // Quantity modal events
    if (qtyMinus) qtyMinus.addEventListener('click', () => {
        const v = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
        qtyInput.value = String(v);
    });
    if (qtyPlus) qtyPlus.addEventListener('click', () => {
        const v = Math.max(1, (parseInt(qtyInput.value, 10) || 1) + 1);
        qtyInput.value = String(v);
    });
    if (qtyInput) qtyInput.addEventListener('input', () => {
        const v = Math.max(1, parseInt(qtyInput.value, 10) || 1);
        qtyInput.value = String(v);
    });
    if (qtyCancel) qtyCancel.addEventListener('click', closeQtyModal);
    if (qtyBackdrop) qtyBackdrop.addEventListener('click', (e) => { if (e.target === qtyBackdrop) closeQtyModal(); });
    if (qtyConfirm) qtyConfirm.addEventListener('click', () => {
        if (!pendingItem) return closeQtyModal();
        const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
        addToCartWithQty(pendingItem.name, pendingItem.price, qty);
        closeQtyModal();
    });
    document.addEventListener('keydown', (e) => { if (!qtyBackdrop || qtyBackdrop.hidden) return; if (e.key === 'Escape') closeQtyModal(); });
});

