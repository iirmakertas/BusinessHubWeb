// Mobil Menü Aç/Kapa
const hamburger = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Dropdown menüler için dışarı tıklanınca kapat
document.addEventListener('click', (e) => {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.style.display = 'none';
            }
        }
    });
});

// Dropdown menü aç/kapa - hover yerine click ile
const dropdownLinks = document.querySelectorAll('.dropdown > a');
dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent document click handler from immediately closing
        const dropdownMenu = link.nextElementSibling;
        if (dropdownMenu) {
            // Diğer tüm menüleri kapat
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.style.display = 'none';
                }
            });
            
            // Tıklanan menüyü aç/kapat
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        }
    });
});

// Form gönderimi
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
        contactForm.reset();
    });
}

// Scroll animasyonları
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.category-card, .about-text, .about-image');
    
    elements.forEach(element => {
        // Zaten animasyonu tamamlanmış elementleri atla
        if (element.dataset.animated === 'true') return;
        
        // Henüz hazırlanmamış elementleri hazırla
        if (!element.dataset.animReady) {
            element.style.opacity = 0;
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.dataset.animReady = 'true';
            return; // Bir sonraki scroll'da animasyonu başlat
        }
        
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
            element.dataset.animated = 'true'; // Bir kere animasyon olduktan sonra tekrar tetikleme
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    // Statik about elementlerini hazırla (category-card'lar dinamik olarak gelecek)
    const staticElements = document.querySelectorAll('.about-text, .about-image');
    staticElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.dataset.animReady = 'true';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Sayfa yüklendiğinde kontrol et
});

// Responsive davranış için pencere yeniden boyutlandırıldığında
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('active');
        const dropdownMenus = document.querySelectorAll('.dropdown-menu');
        dropdownMenus.forEach(menu => {
            menu.style.display = '';
        });
    }
});

function toggleCart() {
    const cartPanel = document.getElementById('cart-panel');
    if (cartPanel) {
        cartPanel.classList.toggle('active');
    }
}

// Ürün detay sayfasına git (file:// protokolü için localStorage kullanıyoruz)
window.goToProduct = function(productId) {
    localStorage.setItem('ab_current_product', productId);
    window.location.href = 'urun-detay.html';
};

// Kategori sayfasına git (file:// protokolü için localStorage kullanıyoruz)
window.goToCategory = function(categoryId) {
    if(categoryId) {
        localStorage.setItem('ab_category_filter', categoryId);
    } else {
        localStorage.removeItem('ab_category_filter'); // Tümü
    }
    window.location.href = 'urunler.html';
};

// ============================================
// ADMIN PANELİ İLE TAM SENKRONİZASYON (DİNAMİK RENDER)
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    let products = [];
    let categories = [];
    let deals = [];
    
    try {
        const { data: pData } = await _supabase.from('products').select('*');
        const { data: cData } = await _supabase.from('categories').select('*');
        const { data: dData } = await _supabase.from('deals').select('*');
        
        if (pData) {
            const lang = localStorage.getItem('ab_lang') || 'tr';
            products = pData.map(row => {
                let pName = row.name;
                let pDesc = row.description;
                try {
                    if (pDesc && pDesc.startsWith('{')) {
                        const parsed = JSON.parse(pDesc);
                        if (parsed.tr !== undefined) {
                            if (lang === 'en' && parsed.en) {
                                pName = parsed.en.name || pName;
                                pDesc = parsed.en.description || parsed.tr;
                            } else {
                                pDesc = parsed.tr;
                            }
                        }
                    }
                } catch(e) {}
                
                return {
                    ...row,
                    name: pName,
                    description: pDesc,
                    categoryId: row.categoryid,
                    inStock: row.instock,
                    createdAt: row.createdat
                };
            });
        }
        
        if (cData) categories = cData;
        
        if (dData) deals = dData.map(row => ({
            ...row,
            productId: row.productid,
            originalPrice: row.originalprice,
            salePrice: row.saleprice,
            startDate: row.startdate,
            endDate: row.enddate
        }));
        
        // Sepet ve favoriler için global değişkene kopyala
        window.GLOBAL_PRODUCTS = products;
        window.GLOBAL_DEALS = deals;

        // Cleanup cart and favorites from deleted products
        if (pData) {
            const activeProductIds = pData.map(p => p.id);
            
            // Clean up Cart
            let localCart = JSON.parse(localStorage.getItem('ab_cart') || '[]');
            const originalCartLen = localCart.length;
            localCart = localCart.filter(item => activeProductIds.includes(item.id));
            if (localCart.length !== originalCartLen) {
                localStorage.setItem('ab_cart', JSON.stringify(localCart));
                if (typeof cart !== 'undefined') {
                    cart = localCart;
                }
            }
            
            // Clean up Favorites
            let localFavs = JSON.parse(localStorage.getItem('ab_favorites') || '[]');
            const originalFavsLen = localFavs.length;
            localFavs = localFavs.filter(id => activeProductIds.includes(id));
            if (localFavs.length !== originalFavsLen) {
                localStorage.setItem('ab_favorites', JSON.stringify(localFavs));
            }
        }
    } catch (e) {
        console.error('Supabase veri çekme hatası', e);
    }

    // Helper: Fiyat formatlama
    const formatPrice = (price) => '₺' + parseFloat(price).toFixed(2).replace('.', ',');

    // Helper: Ürün kartı oluşturma HTML'i
    const createProductCardHTML = (product) => {
        // Aktif fırsat kontrolü
        const activeDeal = deals.find(d => 
            d.productid === product.id && 
            d.active && 
            (!d.enddate || new Date(d.enddate) >= new Date())
        );

        let priceHtml = `<span class="price">${formatPrice(product.price)}</span>`;
        let saleBadgeHtml = '';

        if (activeDeal) {
            const discountPercent = Math.round((1 - (activeDeal.saleprice / product.price)) * 100);
            saleBadgeHtml = `<span class="sale" style="display:inline-block; margin-bottom: 5px; padding: 2px 5px; border-radius: 3px; font-size: 11px;">%${discountPercent} <span data-i18n="prod.sale">İNDİRİMDE!</span></span>`;
            priceHtml = `
                <div class="price-container" style="display: flex; flex-direction: column; align-items: flex-start; margin-top: auto; margin-bottom: 10px;">
                    <span style="font-weight: 700; color: #1d4ed8; font-size: 1.2rem;">${formatPrice(activeDeal.saleprice)}</span>
                    <del style="color: #666; font-size: 0.9rem;">${formatPrice(product.price)}</del>
                </div>
            `;
        }

        let buttonHtml = `<button class="btn-primary" onclick="event.stopPropagation(); addToCart('${product.id}')" data-i18n="card.addcart">Sepete Ekle</button>`;
        let cardStyle = '';
        
        if (!product.instock) {
            cardStyle = 'style="opacity: 0.6;"';
            buttonHtml = `<button class="btn-primary" disabled style="background-color: #9ca3af; cursor: not-allowed;" data-i18n="card.nostock">Stokta Yok</button>`;
        }

        const imageSrc = product.image || 'https://placehold.co/300x300?text=Resim+Yok';

        const favs = JSON.parse(localStorage.getItem('ab_favorites')) || [];
        const isFav = favs.includes(product.id);
        const heartClass = isFav ? 'fas' : 'far';
        const activeClass = isFav ? 'active' : '';

        return `
            <div class="product-card" ${cardStyle} onclick="goToProduct('${product.id}')" style="cursor:pointer;">
                <div class="product-image">
                    <img src="${imageSrc}" alt="${product.name}" onerror="this.src='https://placehold.co/300x300?text=Resim+Yok'">
                    <div class="favorite-btn ${activeClass}" onclick="toggleFavorite('${product.id}', event)"><i class="${heartClass} fa-heart"></i></div>
                </div>
                <div class="product-info" style="padding-bottom: 10px;">
                    <h3>${product.brand ? '<strong>' + product.brand + '</strong> ' : ''}<span>${product.name}</span></h3>
                    ${saleBadgeHtml}
                    ${priceHtml}
                </div>
                <div class="product-info" style="padding-top: 0;">
                    ${buttonHtml}
                </div>
            </div>
        `;
    };

    // 1. ÜRÜN GRİD'LERİNİ DOLDUR
    const productGrids = document.querySelectorAll('.product-grid');
    productGrids.forEach(grid => {
        const categoryId = grid.getAttribute('data-category');
        const isDealsPage = grid.getAttribute('data-deals') === 'true';

        let productsToRender = [];

        if (isDealsPage) {
            // Sadece aktif fırsatı olan ürünleri çek
            const activeDealProductIds = deals
                .filter(d => d.active && (!d.enddate || new Date(d.enddate) >= new Date()))
                .map(d => d.productid);
            
            productsToRender = products.filter(p => activeDealProductIds.includes(p.id));
        } else if (categoryId) {
            // Belirli bir kategoriye ait ürünleri çek
            productsToRender = products.filter(p => p.categoryid === categoryId);
        } else if (window.location.pathname.includes('urunler.html')) {
            // Urunler.html sayfasında localStorage'dan kategori filtresini oku
            const activeCategoryId = localStorage.getItem('ab_category_filter');
            if (activeCategoryId) {
                productsToRender = products.filter(p => p.categoryid === activeCategoryId);
                
                // Başlığı da dinamik güncelle
                const activeCategory = categories.find(c => c.id === activeCategoryId);
                const titleEl = document.getElementById('urunler-page-title');
                if (titleEl && activeCategory) {
                    titleEl.innerText = activeCategory.name;
                    titleEl.setAttribute('data-i18n', 'dyn.' + activeCategory.name);
                }
            } else {
                productsToRender = products; // Tüm ürünler
            }
        }

        // Eğer ürün yoksa boş durum göster
        if (productsToRender.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;" data-i18n="empty.products">Bu bölümde henüz ürün bulunmamaktadır.</div>`;
        } else {
            // Ürünleri oluştur ve ekrana bas
            grid.innerHTML = productsToRender.map(p => createProductCardHTML(p)).join('');
        }
    });

    // 2. KATEGORİ GRİD'İNİ DOLDUR (Ana sayfa için)
    const categoryGrids = document.querySelectorAll('.category-grid[data-dynamic-categories="true"]');
    categoryGrids.forEach(grid => {
        if (categories.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">Kategoriler yükleniyor...</div>`;
            return;
        }

        grid.innerHTML = categories.map(cat => `
            <div class="category-card" onclick="goToCategory('${cat.id}')" style="cursor: pointer;">
                <i class="${cat.icon || 'fas fa-folder'}"></i>
                <h3 data-i18n="dyn.${cat.name}">${cat.name}</h3>
                <p data-i18n="dyn.desc.${cat.name}">${cat.description || ''}</p>
            </div>
        `).join('');
        
        // Yeni oluşturulan category-card'lara animasyonu uygula ve tetikle
        // Çift çağrı: ilk çağrı hazırlar, ikincisi görünür yapar
        requestAnimationFrame(() => {
            animateOnScroll();
            requestAnimationFrame(() => animateOnScroll());
        });
    });

    // 3. HEADER/FOOTER KATEGORİ MENÜLERİNİ DOLDUR
    const navCategoryMenu = document.getElementById('dynamic-nav-categories');
    const footerCategoryMenu = document.getElementById('footer-dynamic-categories');
    
    if (categories.length > 0) {
        const catLinks = categories.map(cat => `<li><a href="#" onclick="goToCategory('${cat.id}'); return false;" data-i18n="dyn.${cat.name}">${cat.name}</a></li>`).join('');
        if (navCategoryMenu) navCategoryMenu.innerHTML = catLinks;
        if (footerCategoryMenu) footerCategoryMenu.innerHTML = catLinks;
    }

    if(typeof changeLanguage === 'function') { changeLanguage(localStorage.getItem('ab_lang') || 'tr', true); }
});

// ============================================
// SEPET YÖNETİMİ
// ============================================
let cart = JSON.parse(localStorage.getItem('ab_cart') || '[]');

function getProductForCart(productId) {
    const products = window.GLOBAL_PRODUCTS || [];
    const deals = window.GLOBAL_DEALS || [];
    const product = products.find(p => p.id === productId);
    if (!product) return null;
    
    let price = product.price;
    const activeDeal = deals.find(d => 
        d.productid === product.id && 
        d.active && 
        (!d.enddate || new Date(d.enddate) >= new Date())
    );
    if (activeDeal) {
        price = activeDeal.saleprice;
    }
    
    return {
        id: product.id,
        name: product.name,
        price: parseFloat(price),
        image: product.image || 'https://placehold.co/300x300?text=Resim+Yok',
        brand: product.brand || ''
    };
}

function addToCart(productId) {
    const p = getProductForCart(productId);
    if (!p) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...p, qty: 1 });
    }
    
    saveCart();
    renderCart();
    const cartPanel = document.getElementById('cart-panel');
    if (cartPanel && !cartPanel.classList.contains('active')) {
        cartPanel.classList.add('active'); // Sepeti otomatik aç
    }
}

function updateCartQty(productId, delta) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += delta;
        if (existing.qty <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        saveCart();
        renderCart();
    }
}

function saveCart() {
    localStorage.setItem('ab_cart', JSON.stringify(cart));
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const badge = document.getElementById('cartBadge');
    const totalEl = document.getElementById('cartTotal');
    
    if (!badge) return; // Sepet HTML'i sayfada yoksa
    
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // Rozeti güncelle
    if (totalItems > 0) {
        badge.style.display = 'flex';
        badge.textContent = totalItems;
    } else {
        badge.style.display = 'none';
    }
    
    if (!container || !totalEl) return;
    
    // Toplamı güncelle
    totalEl.textContent = '₺' + totalPrice.toFixed(2).replace('.', ',');
    
    // Ürünleri listele
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#666; margin-top:20px;" data-i18n="empty.cart">Sepetiniz boş.</p>';
        if (typeof changeLanguage === 'function') {
            changeLanguage(localStorage.getItem('ab_lang') || 'tr', true);
        }
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/300x300?text=Resim+Yok'">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.brand ? '<strong>'+item.brand+'</strong> ' : ''}${item.name}</div>
                <div class="cart-item-price">₺${item.price.toFixed(2).replace('.', ',')}</div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
                    <span class="remove-item" onclick="updateCartQty('${item.id}', -${item.qty})"><i class="fas fa-trash"></i></span>
                </div>
            </div>
        </div>
    `).join('');
    
    if (typeof changeLanguage === 'function') {
        changeLanguage(localStorage.getItem('ab_lang') || 'tr', true);
    }
}

async function checkout() {
    if (cart.length === 0) {
        alert('Sepetiniz boş!');
        return;
    }
    
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session || !session.user) {
        alert('Sipariş vermek için lütfen giriş yapın veya üye olun.');
        openAuthModal();
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const orderData = {
        user_name: session.user.user_metadata?.name || session.user.email,
        user_email: session.user.email,
        items: JSON.stringify(cart),
        total_price: total,
        status: 'Bekliyor'
    };

    const { error } = await _supabase.from('orders').insert([orderData]);

    if (error) {
        alert('Siparişiniz kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
        console.error(error);
        return;
    }

    alert('Siparişiniz başarıyla alındı! Bizi tercih ettiğiniz için teşekkür ederiz.');
    cart = [];
    saveCart();
    renderCart();
    toggleCart();
}

// Başlangıçta sepeti render et
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    checkAuthStatus();
});

window.addEventListener('languageChanged', (e) => {
    checkAuthStatus();
    // Dil değişince kategori kartlarının animasyonunu sıfırla ve görünür yap
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.style.opacity = 1;
        card.style.transform = 'translateY(0)';
        card.dataset.animated = 'true';
    });
    // Ürün detay sayfasında içerikleri yeniden yükle
    if (window.location.pathname.includes('urun-detay')) {
        const productId = localStorage.getItem('ab_current_product');
        if (productId) loadProductDetails(productId);
    }
});

// ============================================
// ÜYELİK SİSTEMİ (AUTH) - SUPABASE AUTH YÖNTEMİ
// ============================================

// Oturum durumu değiştiğinde tetiklenir (Giriş yapıldı, çıkış yapıldı, token yenilendi, şifre sıfırlama talebi geldi)
_supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
        // Kullanıcı şifre sıfırlama linkine tıkladı, auth modal'ı açıp şifre yenileme sekmesine geç
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('active');
            switchAuthTab('reset');
        }
    } else if (event === 'SIGNED_IN') {
        checkAuthStatus();
    } else if (event === 'SIGNED_OUT') {
        checkAuthStatus();
    }
});

async function checkAuthStatus() {
    const authText = document.getElementById('authText');
    const authWrapper = document.querySelector('.auth-wrapper');
    if (!authText || !authWrapper) return;
    
    const { data: { session } } = await _supabase.auth.getSession();
    
    const lang = localStorage.getItem('ab_lang') || 'tr';
    const isEn = lang === 'en';
    
    if (session && session.user) {
        // Kullanıcının adını metadata'dan çek
        const name = session.user.user_metadata?.name || session.user.email;
        authText.textContent = name; authText.removeAttribute('data-i18n');
        authWrapper.title = isEn ? "My Account" : "Hesabım";
    } else {
        authText.textContent = isEn ? 'Log In' : 'Giriş Yap';
        authText.setAttribute('data-i18n', 'auth.btn.login');
        authWrapper.title = isEn ? "Log In / Sign Up" : "Giriş Yap / Üye Ol";
    }
}

async function toggleAuthModal() {
    const { data: { session } } = await _supabase.auth.getSession();
    
    if (session && session.user) {
        toggleAccountPanel();
        return;
    }
    
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.toggle('active');
        if (modal.classList.contains('active')) {
            switchAuthTab('login'); // Default to login
        }
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
}

function switchAuthTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    
    const tabElement = document.getElementById('tab-' + tabName);
    if(tabElement) tabElement.classList.add('active');
    
    document.getElementById('form-' + tabName).classList.add('active');
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-pass').value;
    
    if (!name || !email || !password) return;
    
    const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: name
            }
        }
    });
    
    if (error) {
        alert('Kayıt olurken bir hata oluştu: ' + error.message);
        return;
    }
    
    // Eğer Supabase ayarlarında Email Confirmation açıksa, session null döner ve kullanıcıdan mailini onaylaması istenir.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
       alert('Bu e-posta adresi zaten kullanımda.');
       return;
    }
    
    if (!data.session) {
        alert('Kayıt başarılı! Lütfen e-posta adresinize gönderilen doğrulama linkine tıklayarak hesabınızı aktifleştirin.');
    } else {
        alert('Kayıt başarılı! Hoş geldiniz, ' + name);
        checkAuthStatus();
    }
    
    document.getElementById('register-form').reset();
    closeAuthModal();
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-pass').value;
    
    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    
    if (error) {
        if (error.message.includes("Email not confirmed")) {
            alert('Lütfen giriş yapmadan önce e-posta adresinize gelen linke tıklayarak hesabınızı doğrulayın.');
        } else {
            alert('Hatalı e-posta veya şifre! Veya geçersiz kayıt.');
        }
        return;
    }
    
    document.getElementById('login-form').reset();
    closeAuthModal();
    checkAuthStatus();
    alert('Giriş başarılı! Hoş geldiniz, ' + (data.user.user_metadata?.name || data.user.email));
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    
    // Supabase şifre sıfırlama maili gönder (Redirect URL anasayfaya yönlendirir)
    const { data, error } = await _supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
        alert('Mail gönderilirken hata oluştu: ' + error.message);
        return;
    }
    
    alert('Şifre sıfırlama linki e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.');
    closeAuthModal();
}

async function handlePasswordResetForm(e) {
    e.preventDefault();
    const newPassword = document.getElementById('reset-new-pass').value;
    
    const { data, error } = await _supabase.auth.updateUser({
        password: newPassword
    });
    
    if (error) {
        alert('Şifre güncellenirken hata oluştu: ' + error.message);
        return;
    }
    
    alert('Şifreniz başarıyla yenilendi! Yeni şifrenizle giriş yapabilirsiniz.');
    document.getElementById('reset-form').reset();
    closeAuthModal();
    switchAuthTab('login');
}

async function logout() {
    const { error } = await _supabase.auth.signOut();
    if (error) {
        alert('Çıkış yaparken hata oluştu: ' + error.message);
        return;
    }
    
    checkAuthStatus();
    const panel = document.getElementById('account-panel');
    if (panel && panel.classList.contains('active')) {
        panel.classList.remove('active');
    }
}

function toggleAccountPanel() {
    const panel = document.getElementById('account-panel');
    if (panel) {
        panel.classList.toggle('active');
        
        // Paneli açarken bilgileri doldur
        if (panel.classList.contains('active')) {
            _supabase.auth.getSession().then(({ data: { session } }) => {
                if (session && session.user) {
                    const name = session.user.user_metadata?.name || '-';
                    const email = session.user.email || '-';
                    document.getElementById('acc-name-display').textContent = name;
                    document.getElementById('acc-email-display').textContent = email;
                    
                    const extraData = JSON.parse(localStorage.getItem('ab_extraData_' + session.user.id)) || {};
                    document.getElementById('acc-phone').value = extraData.phone || '';
                    document.getElementById('acc-address').value = extraData.address || '';
                }
            });
        }
    }
}

async function switchAccTab(tabName) {
    document.querySelectorAll('.acc-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.acc-section').forEach(s => s.classList.remove('active'));
    
    const tabEl = document.getElementById('tab-acc-' + tabName);
    const secEl = document.getElementById('section-acc-' + tabName);
    if (tabEl) tabEl.classList.add('active');
    if (secEl) secEl.classList.add('active');
    
    if (tabName === 'orders') {
        await loadUserOrders();
    }
}

async function loadUserOrders() {
    const container = document.getElementById('section-acc-orders');
    if (!container) return;
    
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session || !session.user) {
        container.innerHTML = '<div style="text-align:center; padding: 40px 20px; color: #666;"><p>Lütfen giriş yapın.</p></div>';
        return;
    }
    
    container.innerHTML = `
        <div style="text-align: center; padding: 30px;">
            <i class="fas fa-spinner fa-spin fa-2x" style="color: var(--primary);"></i>
            <p style="margin-top: 10px;">Siparişleriniz yükleniyor...</p>
        </div>
    `;
    
    try {
        const { data: orders, error } = await _supabase.from('orders').select('*').eq('user_email', session.user.email);
        
        if (error || !orders || orders.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding: 40px 20px; color: #666;">
                    <i class="fas fa-box-open" style="font-size: 3rem; color: #ccc; margin-bottom: 15px; display: block;"></i>
                    <p data-i18n="empty.orders">Henüz siparişiniz bulunmuyor.</p>
                </div>
            `;
            if (typeof changeLanguage === 'function') {
                changeLanguage(localStorage.getItem('ab_lang') || 'tr', true);
            }
            return;
        }
        
        // Siparişleri tarihe göre azalan sırada sıralayalım
        orders.sort((a, b) => new Date(b.created_at || b.createdat) - new Date(a.created_at || a.createdat));
        
        const lang = localStorage.getItem('ab_lang') || 'tr';
        const isEn = lang === 'en';
        
        let html = '<div class="user-orders-list" style="display:flex; flex-direction:column; gap:15px; max-height: 380px; overflow-y: auto; padding-right: 5px;">';
        orders.forEach(order => {
            const date = new Date(order.created_at || order.createdat).toLocaleDateString(isEn ? 'en-US' : 'tr-TR');
            const total = parseFloat(order.total_price).toFixed(2) + ' ₺';
            const statusText = order.status === 'Bekliyor' ? (isEn ? 'Pending' : 'Bekliyor') : (isEn ? 'Shipped' : 'Kargolandı');
            const badgeClass = order.status === 'Bekliyor' ? 'badge-warning' : 'badge-success';
            const badgeColor = order.status === 'Bekliyor' ? '#f2c94c' : '#22c55e';
            
            let items = [];
            try {
                items = JSON.parse(order.items || '[]');
            } catch(e) {}
            
            const itemsHtml = items.map(item => `
                <div class="user-order-item" style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--text-muted); margin-bottom:4px;">
                    <span>${item.qty}x ${item.name}</span>
                    <span>₺${(item.price * item.qty).toFixed(2)}</span>
                </div>
            `).join('');
            
            html += `
                <div class="user-order-card" style="border:1px solid var(--border); border-radius:8px; padding:12px; background:var(--bg-light);">
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border); padding-bottom:6px; margin-bottom:6px; font-weight:bold; font-size:0.85rem;">
                        <span>Sipariş #${order.id}</span>
                        <span class="badge ${badgeClass}" style="padding:2px 8px; border-radius:4px; font-size:0.75rem; color:#fff; background-color:${badgeColor}">${statusText}</span>
                    </div>
                    <div style="margin-bottom:6px;">
                        ${itemsHtml}
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:bold; border-top:1px dashed var(--border); padding-top:6px;">
                        <span style="color:var(--text-muted); font-weight:normal;">${date}</span>
                        <span>Toplam: ${total}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
        
    } catch(e) {
        console.error('Siparişler yüklenirken hata:', e);
        container.innerHTML = '<p style="text-align:center; padding:20px; color:#ff4d4f;">Siparişler yüklenirken bir hata oluştu.</p>';
    }
}

async function handlePasswordUpdate(e) {
    e.preventDefault();
    const newPassword = document.getElementById('acc-new-pass').value;
    
    const { data, error } = await _supabase.auth.updateUser({
        password: newPassword
    });
    
    if (error) {
        alert('Şifre güncellenirken bir hata oluştu: ' + error.message);
    } else {
        alert('Şifreniz başarıyla güncellendi!');
        document.getElementById('acc-new-pass').value = '';
    }
}

async function handleContactUpdate(e) {
    e.preventDefault();
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session || !session.user) return;
    
    const phone = document.getElementById('acc-phone').value.trim();
    const address = document.getElementById('acc-address').value.trim();
    
    localStorage.setItem('ab_extraData_' + session.user.id, JSON.stringify({ phone, address }));
    alert('İletişim ve adres bilgileriniz başarıyla kaydedildi!');
}

// ============================================
// ÜRÜN DETAY VE YORUM SİSTEMİ
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('urun-detay')) {
        // URL'den veya localStorage'dan ürün ID'sini al
        const urlParams = new URLSearchParams(window.location.search);
        let productId = urlParams.get('id');
        
        // file:// protokolünde query string çalışmayabilir, localStorage'a bak
        if (!productId) {
            productId = localStorage.getItem('ab_current_product');
        }
        
        if (productId) {
            loadProductDetails(productId);
        } else {
            window.location.href = 'index.html';
        }

        // Yıldız seçimi logic
        const stars = document.querySelectorAll('.star-rating-select i');
        const ratingInput = document.getElementById('selectedRating');
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = e.target.getAttribute('data-rating');
                ratingInput.value = rating;
                stars.forEach(s => s.classList.remove('active', 'fas'));
                stars.forEach(s => s.classList.add('far'));
                for(let i = 0; i < rating; i++) {
                    stars[i].classList.remove('far');
                    stars[i].classList.add('fas', 'active');
                }
            });
        });
    }
});

async function loadProductDetails(productId) {
    const formatPrice = (price) => '₺' + parseFloat(price).toFixed(2).replace('.', ',');
    const container = document.getElementById('productDetailContainer');
    
    try {
        let { data: product, error } = await _supabase.from('products').select('*').eq('id', productId).single();
        
        if (error || !product) {
            container.innerHTML = '<h2 style="text-align:center; padding: 50px;">Ürün bulunamadı!</h2>';
            return;
        }

        const lang = localStorage.getItem('ab_lang') || 'tr';
        let pName = product.name;
        let pDesc = product.description;
        try {
            if (pDesc && pDesc.startsWith('{')) {
                const parsed = JSON.parse(pDesc);
                if (parsed.tr !== undefined) {
                    if (lang === 'en' && parsed.en) {
                        pName = parsed.en.name || pName;
                        pDesc = parsed.en.description || parsed.tr;
                    } else {
                        pDesc = parsed.tr;
                    }
                }
            }
        } catch(e) {}

        // Map PostgreSQL columns
        product = {
            ...product,
            name: pName,
            description: pDesc,
            categoryId: product.categoryid,
            inStock: product.instock,
            createdAt: product.createdat
        };

        // Check if there is an active deal for this product
        const { data: deals } = await _supabase.from('deals').select('*').eq('productid', productId).eq('active', true);
        const activeDeal = (deals && deals.length > 0) ? deals.map(d => ({...d, endDate: d.enddate, salePrice: d.saleprice})).find(d => !d.enddate || new Date(d.enddate) >= new Date()) : null;

        let priceHtml = `<div class="product-detail-price">${formatPrice(product.price)}</div>`;
        if (activeDeal) {
            priceHtml = `
                <div class="product-detail-price" style="display: flex; flex-direction: column;">
                    <span style="color: #1d4ed8;">${formatPrice(activeDeal.saleprice)}</span>
                    <del style="color: #999; font-size: 1.2rem;">${formatPrice(product.price)}</del>
                </div>
            `;
        }

        const cartBtnText = lang === 'en' ? 'ADD TO CART' : 'SEPETE EKLE';
        const noStockText = lang === 'en' ? 'OUT OF STOCK' : 'STOKTA YOK';
        let buttonHtml = `<button class="add-to-cart-large" onclick="addToCart('${product.id}')" data-i18n="detail.addcart"><i class="fas fa-shopping-cart"></i> ${cartBtnText}</button>`;
        if (!product.instock) {
            buttonHtml = `<button class="add-to-cart-large" disabled style="background-color: #9ca3af; cursor: not-allowed;" data-i18n="detail.nostock">${noStockText}</button>`;
        }

        const imageSrc = product.image || 'https://placehold.co/500x500?text=Resim+Yok';

        // Yorumların ortalamasını al
        const { data: revData } = await _supabase.from('reviews').select('rating').eq('productid', productId);
        let reviewCount = 0;
        let starsHtml = '<i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>';
        
        if (revData && revData.length > 0) {
            reviewCount = revData.length;
            const total = revData.reduce((sum, r) => sum + r.rating, 0);
            const avg = total / reviewCount;
            starsHtml = '';
            for(let i=1; i<=5; i++) {
                if(i <= avg) starsHtml += '<i class="fas fa-star"></i>';
                else if(i - 0.5 <= avg) starsHtml += '<i class="fas fa-star-half-alt"></i>';
                else starsHtml += '<i class="far fa-star"></i>';
            }
        }

        container.innerHTML = `
            <div class="product-detail-wrapper">
                <div class="product-detail-image">
                    <img src="${imageSrc}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h1 style="font-size: 2.4rem; color: #1d4ed8; margin-top: 0; margin-bottom: 15px; font-weight: 700; line-height: 1.2;">
                        ${product.brand ? '<strong style="color: #666; font-size: 1.4rem; display: block; margin-bottom: 5px;">' + escapeHtml(product.brand) + '</strong>' : ''}
                        <span>${escapeHtml(product.name || '')}</span>
                    </h1>
                    
                    <div class="product-detail-rating-summary">
                        <div class="stars">${starsHtml}</div>
                        <a href="#reviews" class="reviews-link" onclick="event.preventDefault(); document.querySelector('.reviews-section').scrollIntoView({behavior: 'smooth'})">
                            ${reviewCount > 0 ? reviewCount + ' <span data-i18n="detail.revcount">Değerlendirme</span>' : '<span data-i18n="detail.firstrev">İlk Değerlendiren Sen Ol</span>'}
                        </a>
                    </div>
                    
                    ${priceHtml}
                    
                    <div class="product-detail-desc">
                        ${product.description ? product.description.replace(/\\n/g, '<br>') : '<span data-i18n="detail.nodesc">Bu ürün için detaylı açıklama bulunmamaktadır.</span>'}
                    </div>
                    <div style="margin-top: auto;">
                        ${buttonHtml}
                    </div>
                </div>
            </div>
        `;

        // Yorumları yükle
        await loadReviews(productId);
        
        // Breadcrumb Güncelleme
        const breadcrumbEl = document.getElementById('breadcrumb-product');
        if (breadcrumbEl) {
            breadcrumbEl.innerHTML = `<span>${product.name}</span>`;
        }
        
        // Sayfa dili yeniden ayarla
        if(typeof changeLanguage === 'function') { changeLanguage(localStorage.getItem('ab_lang') || 'tr'); }
        
        // Yorum yapma alanını göster/gizle
        const { data: { session } } = await _supabase.auth.getSession();
        if (session && session.user) {
            document.getElementById('addReviewFormArea').style.display = 'block';
            document.getElementById('loginToReviewMessage').style.display = 'none';
        }
        
    } catch (e) {
        container.innerHTML = '<h2 style="text-align:center; padding: 50px;">Bir hata oluştu!</h2>';
    }
}

async function loadReviews(productId) {
    const listContainer = document.getElementById('reviewsList');
    try {
        const { data: reviews, error } = await _supabase.from('reviews').select('*').eq('productid', productId).order('created_at', { ascending: false });
        
        if (error || !reviews || reviews.length === 0) {
            listContainer.innerHTML = '<p style="text-align:center; color:#666; padding: 20px;" data-i18n="detail.noreviews">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>';
            return;
        }

        let html = '';
        reviews.forEach(review => {
            let starsHtml = '';
            for(let i=0; i<5; i++) {
                starsHtml += i < review.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
            }
            
            const dateStr = new Date(review.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
            
            html += `
                <div class="review-item">
                    <div class="review-header">
                        <span class="review-author"><i class="fas fa-user-circle"></i> ${review.username}</span>
                        <span class="review-date">${dateStr}</span>
                        <a href="#" onclick="reportComment('${review.id}', '${review.username}'); return false;" style="color: #dc3545; font-size: 0.8rem; text-decoration: underline; margin-left: 15px;"><i class="fas fa-flag"></i> Bildir</a>
                    </div>
                    <div class="review-stars">${starsHtml}</div>
                    <div class="review-text">${escapeHtml(review.comment || '')}</div>
                </div>
            `;
        });
        
        listContainer.innerHTML = html;
        
    } catch (e) {
        listContainer.innerHTML = '<p style="text-align:center; color:#666;">Yorumlar yüklenirken hata oluştu.</p>';
    }
}

// URL'den parametre okuma yardımcısı
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Kullanıcı dili manuel değiştirdiğinde (buton tıklama) sayfayı yenile
let _currentLoadedLang = localStorage.getItem('ab_lang') || 'tr';
window.addEventListener('languageChanged', (e) => {
    const newLang = e.detail && e.detail.lang;
    const isManual = e.detail && e.detail.isManual;
    // Sadece kullanıcı butona tıklayarak manuel değiştirdiyse sayfayı yenile (sonsuz döngüyü engeller)
    if (isManual && newLang && newLang !== _currentLoadedLang) {
        _currentLoadedLang = newLang;
        window.location.reload();
    }
});

async function submitReview() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const { data: { session } } = await _supabase.auth.getSession();
    
    if (!productId || !session || !session.user) return;
    const currentUser = { name: session.user.user_metadata?.name || session.user.email };
    
    const rating = parseInt(document.getElementById('selectedRating').value);
    const comment = document.getElementById('reviewComment').value.trim();
    
    if (rating === 0) {
        alert('Lütfen yıldız vererek puanınızı seçin!');
        return;
    }
    
    const payload = {
        productid: productId,
        username: currentUser.name,
        rating: rating,
        comment: comment
    };
    
    const { error } = await _supabase.from('reviews').insert([payload]);
    
    if (error) {
        alert('Yorum kaydedilirken bir hata oluştu!');
        console.error(error);
    } else {
        alert('Yorumunuz başarıyla eklendi! Teşekkür ederiz.');
        document.getElementById('reviewComment').value = '';
        document.getElementById('selectedRating').value = '0';
        const stars = document.querySelectorAll('.star-rating-select i');
        stars.forEach(s => s.classList.remove('active', 'fas'));
        stars.forEach(s => s.classList.add('far'));
        
        loadReviews(productId);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Favorilere Ekleme / Çıkarma
window.toggleFavorite = function(productId, event) {
    if(event) {
        event.preventDefault(); // A tag linkine gitmesini engelle
        event.stopPropagation(); // Event bubbling engelle
    }
    
    let favs = JSON.parse(localStorage.getItem('ab_favorites')) || [];
    const btn = event ? event.currentTarget : null;
    
    if (favs.includes(productId)) {
        favs = favs.filter(id => id !== productId);
        if(btn) {
            btn.classList.remove('active');
            btn.querySelector('i').classList.remove('fas');
            btn.querySelector('i').classList.add('far');
        }
    } else {
        favs.push(productId);
        if(btn) {
            btn.classList.add('active');
            btn.querySelector('i').classList.remove('far');
            btn.querySelector('i').classList.add('fas');
        }
    }
    
    localStorage.setItem('ab_favorites', JSON.stringify(favs));
    
    // Eğer favoriler sayfasındaysak listeyi yenile
    if (window.location.pathname.includes('favoriler')) {
        renderFavorites();
    }
};

window.renderFavorites = function() {
    const grid = document.getElementById('favoritesGrid');
    if (!grid) return;
    
    let favs = JSON.parse(localStorage.getItem('ab_favorites')) || [];
    
    if (favs.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666; font-size: 1.1rem;"><i class="fas fa-heart-broken" style="font-size:3rem; color:#ccc; margin-bottom:15px; display:block;"></i><span data-i18n="empty.favs">Henüz favorilere eklediğiniz bir ürün bulunmuyor.</span><br><br><a href="index.html" class="btn-primary" style="display:inline-block; text-decoration:none;" data-i18n="btn.startshop">Alışverişe Başla</a></div>';
        if (typeof changeLanguage === 'function') {
            changeLanguage(localStorage.getItem('ab_lang') || 'tr', true);
        }
        return;
    }
    
    // We can use the GLOBAL_PRODUCTS cache which is populated in DOMContentLoaded
    // But since Supabase fetch is async, we should wait or render based on it.
    // The easiest way is to use window.GLOBAL_PRODUCTS
    if (window.GLOBAL_PRODUCTS && window.GLOBAL_PRODUCTS.length > 0) {
        const favProducts = window.GLOBAL_PRODUCTS.filter(p => favs.includes(p.id));
        grid.innerHTML = favProducts.map(p => {
            // Need to recreate the createProductCardHTML logic here since it's inside another scope
            const formatPrice = (price) => '₺' + parseFloat(price).toFixed(2).replace('.', ',');
            const deals = window.GLOBAL_DEALS || [];
            const activeDeal = deals.find(d => 
                d.productid === p.id && 
                d.active && 
                (!d.enddate || new Date(d.enddate) >= new Date())
            );

            let priceHtml = `<span class="price">${formatPrice(p.price)}</span>`;
            let saleBadgeHtml = '';

            if (activeDeal) {
                const discountPercent = Math.round((1 - (activeDeal.saleprice / p.price)) * 100);
                saleBadgeHtml = `<span class="sale" style="display:inline-block; margin-bottom: 5px; padding: 2px 5px; border-radius: 3px; font-size: 11px;">%${discountPercent} İNDİRİMDE!</span>`;
                priceHtml = `
                    <div class="price-container" style="display: flex; flex-direction: column; align-items: flex-start; margin-top: auto; margin-bottom: 10px;">
                        <span style="font-weight: 700; color: #1d4ed8; font-size: 1.2rem;">${formatPrice(activeDeal.saleprice)}</span>
                        <del style="color: #666; font-size: 0.9rem;">${formatPrice(p.price)}</del>
                    </div>
                `;
            }

            let buttonHtml = `<button class="btn-primary" onclick="event.stopPropagation(); addToCart('${p.id}')" data-i18n="card.addcart">Sepete Ekle</button>`;
            let cardStyle = '';
            
            if (!p.instock) {
                cardStyle = 'style="opacity: 0.6;"';
                buttonHtml = `<button class="btn-primary" disabled style="background-color: #9ca3af; cursor: not-allowed;" data-i18n="card.nostock">Stokta Yok</button>`;
            }

            const imageSrc = p.image || 'https://placehold.co/300x300?text=Resim+Yok';
            const heartClass = 'fas';
            const activeClass = 'active';

            return `
                <div class="product-card" ${cardStyle} onclick="goToProduct('${p.id}')" style="cursor:pointer;">
                    <div class="product-image">
                        <img src="${imageSrc}" alt="${p.name}" onerror="this.src='https://placehold.co/300x300?text=Resim+Yok'">
                        <div class="favorite-btn ${activeClass}" onclick="toggleFavorite('${p.id}', event)"><i class="${heartClass} fa-heart"></i></div>
                    </div>
                    <div class="product-info" style="padding-bottom: 10px;">
                        <h3>${p.brand ? '<strong>' + p.brand + '</strong> ' : ''}<span>${p.name}</span></h3>
                        ${saleBadgeHtml}
                        ${priceHtml}
                    </div>
                    <div class="product-info" style="padding-top: 0;">
                        ${buttonHtml}
                    </div>
                </div>
            `;
        }).join('');
        if (typeof changeLanguage === 'function') {
            changeLanguage(localStorage.getItem('ab_lang') || 'tr', true);
        }
    } else {
        // Data not loaded yet, retry shortly
        setTimeout(window.renderFavorites, 500);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('favoriler')) {
        renderFavorites();
    }
});

function deleteAccount() {
    if(confirm("Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
        alert("Hesap silme talebiniz yöneticiye iletildi. Güvenlik nedeniyle çıkış yapılıyor.");
        logout();
    }
}

async function reportComment(reviewId, username) {
    if(!confirm("Bu yorumu şikayet etmek istiyor musunuz?")) return;
    
    const { data: { session } } = await _supabase.auth.getSession();
    const reporter = session && session.user ? (session.user.user_metadata?.name || session.user.email) : 'Ziyaretçi';
    
    const { error } = await _supabase.from('reports').insert([{
        review_id: reviewId,
        reported_by: reporter,
        status: 'İnceleniyor'
    }]);
    
    if (error) {
        alert('Şikayet iletilemedi, lütfen daha sonra tekrar deneyin.');
        console.error(error);
    } else {
        alert("Yorum incelemeye alınmak üzere raporlandı. Teşekkür ederiz.");
    }
}
