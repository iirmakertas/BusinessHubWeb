// ============================================
// ANKARA BAHARAT - ADMİN PANELİ JAVASCRIPT
// ============================================

// ---- OTURUM KONTROLÜ ----
(function checkAuth() {
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
    }
})();

// ============================================
// VERİ YÖNETİMİ (SUPABASE + CACHE)
// ============================================
window.GLOBAL_ADMIN_CACHE = { products: [], categories: [], deals: [], settings: {} };

const adminTranslations = {
    tr: {
        'admin.mainmenu': 'Ana Menü',
        'admin.dashboard': 'Dashboard',
        'admin.categories': 'Kategoriler',
        'admin.products': 'Ürünler',
        'admin.deals': 'Fırsatlar',
        'admin.orders': 'Siparişler',
        'admin.reports': 'Şikayetler',
        'admin.system': 'Sistem',
        'admin.settings': 'Ayarlar',
        'admin.logout': 'Çıkış Yap',
        'admin.viewsite': 'Siteyi Görüntüle',
        'admin.totalproducts': 'Toplam Ürün',
        'admin.activedeals': 'Aktif Fırsatlar',
        'admin.outofstock': 'Stokta Yok',
        'admin.addnewproduct': 'Yeni Ürün Ekle',
        'admin.addnewcategory': 'Yeni Kategori Ekle',
        'admin.addnewdeal': 'Yeni Fırsat Ekle',
        'admin.recentproducts': 'Son Eklenen Ürünler',
        'admin.viewall': 'Tümünü Gör',
        'admin.colproduct': 'Ürün',
        'admin.colcategory': 'Kategori',
        'admin.colprice': 'Fiyat',
        'admin.colstatus': 'Durum',
        'admin.colactions': 'İşlemler',
        'admin.colorderid': 'Sipariş ID',
        'admin.colcustomer': 'Müşteri',
        'admin.coldate': 'Tarih',
        'admin.coltotal': 'Tutar',
        'admin.colreportedby': 'Şikayet Eden',
        'admin.colcommenttext': 'Yorum Metni',
        'admin.newcategory': 'Yeni Kategori',
        'admin.newproduct': 'Yeni Ürün',
        'admin.searchplaceholder': 'Ürün ara...',
        'admin.allcategories': 'Tüm Kategoriler',
        'admin.allstatuses': 'Tüm Durumlar',
        'admin.statusinstock': 'Stokta Var',
        'admin.statusoutofstock': 'Stokta Yok',
        'admin.productnotfound': 'Ürün bulunamadı',
        'admin.productnotfounddesc': 'Arama kriterlerinize uygun ürün yok veya henüz ürün eklenmemiş.',
        'admin.addfirstproduct': 'İlk Ürünü Ekle',
        'admin.dealmanagement': 'Fırsat Yönetimi',
        'admin.newdeal': 'Yeni Fırsat',
        'admin.nodealsyet': 'Henüz fırsat yok',
        'admin.nodealsyetdesc': 'İndirimli ürünler ekleyerek müşterilerinizi cezbedebilirsiniz.',
        'admin.addfirstdeal': 'İlk Fırsatı Ekle',
        'admin.ordermanagement': 'Sipariş Yönetimi',
        'admin.reportmanagement': 'Şikayet Yönetimi',
        'admin.storeinfo': 'Mağaza Bilgileri',
        'admin.storename': 'Mağaza Adı',
        'admin.phone': 'Telefon',
        'admin.email': 'E-posta',
        'admin.address': 'Adres',
        'admin.workinghours': 'Çalışma Saatleri',
        'admin.weekdays': 'Hafta İçi / Cumartesi',
        'admin.sunday': 'Pazar',
        'admin.socialmedia': 'Sosyal Medya',
        'admin.savesettings': 'Ayarları Kaydet',
        'admin.newproducttitle': 'Yeni Ürün Ekle',
        'admin.prodname_tr': 'Ürün Adı (TR)',
        'admin.prodname_en': 'Ürün Adı (EN)',
        'admin.brand': 'Marka',
        'admin.prodprice': 'Fiyat (₺)',
        'admin.proddesc_tr': 'Açıklama (TR)',
        'admin.proddesc_en': 'Açıklama (EN)',
        'admin.prodphoto': 'Ürün Fotoğrafı',
        'admin.photoinstruction': 'Fotoğraf seçmek için tıklayın veya sürükleyip bırakın',
        'admin.photoformat': 'JPG, PNG, WEBP - Maks. 5MB',
        'admin.prodinstock': 'Stokta Mevcut',
        'admin.cancel': 'İptal',
        'admin.save': 'Kaydet',
        'admin.selectcategory': 'Kategori seçin',
        'admin.newcategorytitle': 'Yeni Kategori Ekle',
        'admin.catname': 'Kategori Adı',
        'admin.caticon': 'İkon (Font Awesome class)',
        'admin.desc': 'Açıklama',
        'admin.catslug': 'Sayfa Dosya Adı',
        'admin.newdealtitle': 'Yeni Fırsat Ekle',
        'admin.selectproductlbl': 'Ürün Seçin',
        'admin.saleprice': 'İndirimli Fiyat (₺)',
        'admin.originalprice': 'Normal Fiyat (₺)',
        'admin.startdate': 'Başlangıç Tarihi',
        'admin.enddate': 'Bitiş Tarihi',
        'admin.dealactive': 'Fırsat Aktif',
        'admin.selectproduct': 'Ürün seçin',
        'admin.confirmtitle': 'Silmek istediğinize emin misiniz?',
        'admin.confirmdesc': 'Bu işlem geri alınamaz.',
        'admin.delete': 'Sil',
        'admin.subtitle': 'Yönetim Paneli'
    },
    en: {
        'admin.mainmenu': 'Main Menu',
        'admin.dashboard': 'Dashboard',
        'admin.categories': 'Categories',
        'admin.products': 'Products',
        'admin.deals': 'Deals',
        'admin.orders': 'Orders',
        'admin.reports': 'Reports',
        'admin.system': 'System',
        'admin.settings': 'Settings',
        'admin.logout': 'Log Out',
        'admin.viewsite': 'View Site',
        'admin.totalproducts': 'Total Products',
        'admin.activedeals': 'Active Deals',
        'admin.outofstock': 'Out of Stock',
        'admin.addnewproduct': 'Add Product',
        'admin.addnewcategory': 'Add Category',
        'admin.addnewdeal': 'Add Deal',
        'admin.recentproducts': 'Recent Products',
        'admin.viewall': 'View All',
        'admin.colproduct': 'Product',
        'admin.colcategory': 'Category',
        'admin.colprice': 'Price',
        'admin.colstatus': 'Status',
        'admin.colactions': 'Actions',
        'admin.colorderid': 'Order ID',
        'admin.colcustomer': 'Customer',
        'admin.coldate': 'Date',
        'admin.coltotal': 'Total',
        'admin.colreportedby': 'Reported By',
        'admin.colcommenttext': 'Comment Text',
        'admin.newcategory': 'New Category',
        'admin.newproduct': 'New Product',
        'admin.searchplaceholder': 'Search products...',
        'admin.allcategories': 'All Categories',
        'admin.allstatuses': 'All Statuses',
        'admin.statusinstock': 'In Stock',
        'admin.statusoutofstock': 'Out of Stock',
        'admin.productnotfound': 'Product Not Found',
        'admin.productnotfounddesc': 'No products match your search criteria or no products added yet.',
        'admin.addfirstproduct': 'Add First Product',
        'admin.dealmanagement': 'Deal Management',
        'admin.newdeal': 'New Deal',
        'admin.nodealsyet': 'No Deals Yet',
        'admin.nodealsyetdesc': 'You can attract customers by adding promotional deals.',
        'admin.addfirstdeal': 'Add First Deal',
        'admin.ordermanagement': 'Order Management',
        'admin.reportmanagement': 'Report Management',
        'admin.storeinfo': 'Store Information',
        'admin.storename': 'Store Name',
        'admin.phone': 'Phone',
        'admin.email': 'Email',
        'admin.address': 'Address',
        'admin.workinghours': 'Working Hours',
        'admin.weekdays': 'Weekdays / Saturday',
        'admin.sunday': 'Sunday',
        'admin.socialmedia': 'Social Media',
        'admin.savesettings': 'Save Settings',
        'admin.newproducttitle': 'Add New Product',
        'admin.prodname_tr': 'Product Name (TR)',
        'admin.prodname_en': 'Product Name (EN)',
        'admin.brand': 'Brand',
        'admin.prodprice': 'Price (₺)',
        'admin.proddesc_tr': 'Description (TR)',
        'admin.proddesc_en': 'Description (EN)',
        'admin.prodphoto': 'Product Photo',
        'admin.photoinstruction': 'Click or drag & drop to select photo',
        'admin.photoformat': 'JPG, PNG, WEBP - Max. 5MB',
        'admin.prodinstock': 'In Stock',
        'admin.cancel': 'Cancel',
        'admin.save': 'Save',
        'admin.selectcategory': 'Select category',
        'admin.newcategorytitle': 'Add New Category',
        'admin.catname': 'Category Name',
        'admin.caticon': 'Icon (Font Awesome class)',
        'admin.desc': 'Description',
        'admin.catslug': 'Page Filename',
        'admin.newdealtitle': 'Add New Deal',
        'admin.selectproductlbl': 'Select Product',
        'admin.saleprice': 'Discounted Price (₺)',
        'admin.originalprice': 'Regular Price (₺)',
        'admin.startdate': 'Start Date',
        'admin.enddate': 'End Date',
        'admin.dealactive': 'Deal Active',
        'admin.selectproduct': 'Select product',
        'admin.confirmtitle': 'Are you sure you want to delete?',
        'admin.confirmdesc': 'This action cannot be undone.',
        'admin.delete': 'Delete',
        'admin.subtitle': 'Admin Panel'
    }
};

function changeAdminLanguage(lang) {
    localStorage.setItem('ab_admin_lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (adminTranslations[lang] && adminTranslations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = adminTranslations[lang][key];
            } else {
                const icon = el.querySelector('i');
                if (icon) {
                    el.innerHTML = adminTranslations[lang][key] + ' ' + icon.outerHTML;
                } else {
                    const span = el.querySelector('span');
                    if (span && span.getAttribute('data-i18n') === key) {
                        span.textContent = adminTranslations[lang][key];
                    } else {
                        el.textContent = adminTranslations[lang][key];
                    }
                }
            }
        }
    });
    
    const indicator = document.getElementById('adminLangText');
    if (indicator) indicator.innerText = lang.toUpperCase();
}


function getData(key, defaults) {
    const data = localStorage.getItem('ab_' + key);
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return defaults;
        }
    }
    return defaults;
}

function setData(key, data) {
    localStorage.setItem('ab_' + key, JSON.stringify(data));
}

// Supabase Başlangıç
async function initSupabaseData() {
    try {
        const { data: p } = await _supabase.from('products').select('*');
        const { data: c } = await _supabase.from('categories').select('*');
        const { data: d } = await _supabase.from('deals').select('*');
        
        window.GLOBAL_ADMIN_CACHE.products = p || [];
        window.GLOBAL_ADMIN_CACHE.categories = c || [];
        window.GLOBAL_ADMIN_CACHE.deals = d || [];
        
        // Ayarlar şimdilik localStorage'da kalsın
        window.GLOBAL_ADMIN_CACHE.settings = getData('settings', {
            storeName: 'BusinessHub',
            phone: '+1 (555) 123-4567',
            email: 'demo@businesshub.com',
            address: '123 Business Ave, Tech District, City',
            weekdays: 'Pazartesi-Cumartesi: 08:30 - 20:30',
            sunday: 'Pazar: 10:00 - 20:00',
            facebook: '',
            instagram: '',
            whatsapp: ''
        });
        
        // Sayfayı güncelle
        renderDashboard();
        renderCategories();
        renderProducts();
        renderDeals();
        loadOrders();
        loadReports();
    } catch (e) {
        console.error("Supabase Error:", e);
        alert("Veritabanına bağlanılamadı! Hata detayı: " + e.message);
    }
}

// Kısa erişim (Önbellekten oku)
function getCategories() { return window.GLOBAL_ADMIN_CACHE.categories; }
function getProducts() { return window.GLOBAL_ADMIN_CACHE.products; }
function getDeals() { return window.GLOBAL_ADMIN_CACHE.deals; }
function getSettings() { return window.GLOBAL_ADMIN_CACHE.settings; }

// ============================================
// YARDIMCI FONKSİYONLAR
// ============================================
function generateId(prefix) {
    return prefix + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
}

function formatPrice(price) {
    return '₺' + parseFloat(price).toFixed(2).replace('.', ',');
}

function getCategoryName(categoryId) {
    const cat = getCategories().find(c => c.id === categoryId);
    return cat ? cat.name : 'Bilinmiyor';
}

function getCategoryIcon(categoryId) {
    const cat = getCategories().find(c => c.id === categoryId);
    return cat ? cat.icon : 'fas fa-folder';
}

function getProductById(productId) {
    return getProducts().find(p => p.id === productId);
}

function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

// ============================================
// NAVİGASYON
// ============================================
const sectionTitles = {
    tr: {
        dashboard: { title: 'Dashboard', subtitle: 'Genel bakış ve istatistikler' },
        categories: { title: 'Kategoriler', subtitle: 'Kategori yönetimi' },
        products: { title: 'Ürünler', subtitle: 'Ürün ekleme, düzenleme ve silme' },
        deals: { title: 'Fırsatlar', subtitle: 'İndirim ve kampanya yönetimi' },
        settings: { title: 'Ayarlar', subtitle: 'Site ayarları ve bilgileri' },
        orders: { title: 'Siparişler', subtitle: 'Müşteri sipariş yönetimi' },
        reports: { title: 'Şikayetler', subtitle: 'Kullanıcı yorum şikayetleri' }
    },
    en: {
        dashboard: { title: 'Dashboard', subtitle: 'Overview and statistics' },
        categories: { title: 'Categories', subtitle: 'Category management' },
        products: { title: 'Products', subtitle: 'Add, edit and delete products' },
        deals: { title: 'Deals', subtitle: 'Discount and campaign management' },
        settings: { title: 'Settings', subtitle: 'Site settings and information' },
        orders: { title: 'Orders', subtitle: 'Customer order management' },
        reports: { title: 'Reports', subtitle: 'User comment reports' }
    }
};

function navigateTo(section) {
    // Tüm bölümleri gizle
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    // Tüm nav item aktifliğini kaldır
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(n => n.classList.remove('active'));

    // İlgili bölümü göster
    const sectionEl = document.getElementById('section-' + section);
    if (sectionEl) sectionEl.classList.add('active');

    // İlgili nav item'ı aktifleştir
    const navEl = document.getElementById('nav-' + section);
    if (navEl) navEl.classList.add('active');

    // Başlığı güncelle
    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const info = sectionTitles[lang] ? sectionTitles[lang][section] : null;
    if (info) {
        document.getElementById('pageTitle').textContent = info.title;
        document.getElementById('pageSubtitle').textContent = info.subtitle;
    }

    // Sidebar'ı kapat (mobil)
    closeSidebar();

    // İlgili bölümün verilerini yenile
    switch (section) {
        case 'dashboard': renderDashboard(); break;
        case 'categories': renderCategories(); break;
        case 'products': renderProducts(); break;
        case 'deals': renderDeals(); break;
        case 'settings': loadSettings(); break;
        case 'orders': loadOrders(); break;
        case 'reports': loadReports(); break;
    }
}

// Sidebar nav tıklamaları
document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const section = item.dataset.section;
        if (section) navigateTo(section);
    });
});

// Mobil sidebar
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('adminSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('show');
    });
}

if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
}

// Çıkış
const logoutBtnEl = document.getElementById('logoutBtn');
if (logoutBtnEl) {
    logoutBtnEl.addEventListener('click', () => {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    });
}

// ============================================
// MODAL YÖNETİMİ
// ============================================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    document.body.style.overflow = '';
}

// ESC ile modal kapatma
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.show').forEach(m => {
            m.classList.remove('show');
        });
        document.body.style.overflow = '';
    }
});

// Overlay tıklaması ile modal kapatma
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
});

// ============================================
// TOAST BİLDİRİM SİSTEMİ
// ============================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(toast);

    // 4 saniye sonra otomatik kaldır
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// ============================================
// ONAY DİYALOGU
// ============================================
function showConfirm(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmBtn').onclick = () => {
        onConfirm();
        closeModal('confirmModal');
    };
    openModal('confirmModal');
}

// ============================================
// DASHBOARD
// ============================================
function renderDashboard() {
    const products = getProducts();
    const categories = getCategories();
    const deals = getDeals();
    const activeDeals = deals.filter(d => d.active && (!d.enddate || new Date(d.enddate) >= new Date()));
    const outOfStock = products.filter(p => !p.instock);

    // İstatistikleri animasyonlu güncelle
    animateCounter('statProducts', products.length);
    animateCounter('statCategories', categories.length);
    animateCounter('statDeals', activeDeals.length);
    animateCounter('statOutOfStock', outOfStock.length);

    // Ürün badge
    document.getElementById('productCountBadge').textContent = products.length;

    // Son eklenen ürünler (son 5)
    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';

    const recentProducts = [...products].sort((a, b) => {
        return (b.createdat || '').localeCompare(a.createdat || '');
    }).slice(0, 5);

    const tbody = document.getElementById('recentProductsTable');
    if (recentProducts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted); padding: 40px;">${isEn ? 'No products added yet' : 'Henüz ürün eklenmemiş'}</td></tr>`;
        return;
    }

    tbody.innerHTML = recentProducts.map(p => `
        <tr>
            <td>
                <div class="product-cell">
                    <img src="${p.image || 'https://placehold.co/44x44?text=Ürün'}" alt="${p.name}" class="product-thumb" onerror="this.src='https://placehold.co/44x44?text=Ürün'">
                    <div>
                        <div class="product-name">${escapeHtml(p.name)}</div>
                        <div class="product-desc">${escapeHtml(p.description || '')}</div>
                    </div>
                </div>
            </td>
            <td>${escapeHtml(getCategoryName(p.categoryid))}</td>
            <td><strong>${formatPrice(p.price)}</strong></td>
            <td><span class="status-badge ${p.instock ? 'active' : 'inactive'}">${p.instock ? (isEn ? 'In Stock' : 'Stokta') : (isEn ? 'Out of Stock' : 'Tükendi')}</span></td>
        </tr>
    `).join('');
}

function animateCounter(elementId, targetValue) {
    const el = document.getElementById(elementId);
    const currentValue = parseInt(el.textContent) || 0;
    const diff = targetValue - currentValue;
    if (diff === 0) { el.textContent = targetValue; return; }

    const duration = 600;
    const steps = 30;
    const stepDuration = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = Math.round(currentValue + diff * eased);
        if (step >= steps) {
            clearInterval(timer);
            el.textContent = targetValue;
        }
    }, stepDuration);
}

// ============================================
// KATEGORİ YÖNETİMİ
// ============================================
function renderCategories() {
    const categories = getCategories();
    const products = getProducts();
    const grid = document.getElementById('categoryGrid');

    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';

    if (categories.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-folder-open"></i>
                <h3>${isEn ? 'No categories yet' : 'Henüz kategori yok'}</h3>
                <p>${isEn ? 'Organize your products by adding a new category.' : 'Yeni kategori ekleyerek ürünlerinizi düzenleyin.'}</p>
                <button class="btn btn-primary-admin" onclick="openCategoryModal()">
                    <i class="fas fa-plus"></i> ${isEn ? 'Add First Category' : 'İlk Kategoriyi Ekle'}
                </button>
            </div>`;
        return;
    }

    grid.innerHTML = categories.map(cat => {
        const productCount = products.filter(p => p.categoryid === cat.id).length;
        return `
            <div class="category-admin-card">
                <div class="cat-top">
                    <div class="cat-icon"><i class="${cat.icon}"></i></div>
                    <div class="action-btns">
                        <button class="action-btn" title="${isEn ? 'Edit' : 'Düzenle'}" onclick="editCategory('${cat.id}')">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="action-btn delete" title="${isEn ? 'Delete' : 'Sil'}" onclick="deleteCategory('${cat.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="cat-name">${escapeHtml(cat.name)}</div>
                <div class="cat-desc">${escapeHtml(cat.description || (isEn ? 'No description' : 'Açıklama yok'))}</div>
                <div class="cat-footer">
                    <span class="cat-count"><strong>${productCount}</strong> ${isEn ? (productCount === 1 ? 'product' : 'products') : 'ürün'}</span>
                    ${cat.slug ? `<a href="${cat.slug}" target="_blank" style="font-size:0.8rem; color: var(--primary); text-decoration:none;"><i class="fas fa-external-link-alt"></i> ${isEn ? 'View Page' : 'Sayfayı Gör'}</a>` : ''}
                </div>
            </div>`;
    }).join('');
}

function openCategoryModal(editId) {
    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    const form = document.getElementById('categoryForm');
    form.reset();
    document.getElementById('categoryEditId').value = '';
    document.getElementById('categoryModalTitle').textContent = isEn ? 'Add New Category' : 'Yeni Kategori Ekle';

    if (editId) {
        const cat = getCategories().find(c => c.id === editId);
        if (cat) {
            document.getElementById('categoryEditId').value = cat.id;
            document.getElementById('categoryName').value = cat.name;
            document.getElementById('categoryIcon').value = cat.icon;
            document.getElementById('categoryDescription').value = cat.description || '';
            document.getElementById('categorySlug').value = cat.slug || '';
            document.getElementById('categoryModalTitle').textContent = isEn ? 'Edit Category' : 'Kategori Düzenle';
        }
    }
    openModal('categoryModal');
}

function editCategory(id) {
    openCategoryModal(id);
}

async function saveCategory() {
    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    const name = document.getElementById('categoryName').value.trim();
    const desc = document.getElementById('categoryDescription').value.trim();
    const icon = document.getElementById('categoryIcon').value.trim();
    const editId = document.getElementById('categoryEditId').value;

    if (!name) {
        alert(isEn ? 'Category name is required!' : 'Kategori adı zorunludur!');
        return;
    }

    const payload = {
        name: name,
        description: desc,
        icon: icon,
        slug: generateSlug(name) + '.html'
    };

    if (editId) {
        await _supabase.from('categories').update(payload).eq('id', editId);
    } else {
        payload.id = 'cat-' + Date.now();
        await _supabase.from('categories').insert([payload]);
    }

    closeModal('categoryModal');
    await initSupabaseData(); // Re-fetch
}

async function deleteCategory(id) {
    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    const title = isEn ? 'Delete Category?' : 'Kategoriyi Sil?';
    const desc = isEn ? 'Are you sure you want to delete this category? All sub-products will be deleted too!' : 'Bu kategoriyi silmek istediğinize emin misiniz? Altındaki tüm ürünler de silinecektir!';
    
    showConfirm(title, desc, async () => {
        await _supabase.from('categories').delete().eq('id', id);
        await initSupabaseData();
        showToast(isEn ? 'Category deleted successfully.' : 'Kategori başarıyla silindi.', 'success');
    });
}

// ============================================
// ÜRÜN YÖNETİMİ
// ============================================
function renderProducts() {
    updateCategorySelects();
    filterProducts();
}

function filterProducts() {
    const searchTerm = (document.getElementById('productSearch')?.value || '').toLowerCase();
    const categoryId = document.getElementById('categoryFilter')?.value || '';
    const stockFilter = document.getElementById('stockFilter')?.value || '';

    let products = getProducts();
    const deals = getDeals();

    if (searchTerm) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm) ||
            (p.description || '').toLowerCase().includes(searchTerm)
        );
    }

    if (categoryId) {
        products = products.filter(p => p.categoryid === categoryId);
    }

    if (stockFilter === 'active') {
        products = products.filter(p => p.instock);
    } else if (stockFilter === 'inactive') {
        products = products.filter(p => !p.instock);
    }

    const tbody = document.getElementById('productsTable');
    const emptyState = document.getElementById('productsEmpty');

    if (products.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        tbody.innerHTML = products.map(p => {
            // Aktif fırsat kontrolü
            const activeDeal = deals.find(d => 
                d.productid === p.id && 
                d.active && 
                (!d.enddate || new Date(d.enddate) >= new Date())
            );

            let priceHtml = `<strong>${formatPrice(p.price)}</strong>`;
            let badgeHtml = '';

            const lang = localStorage.getItem('ab_admin_lang') || 'tr';
            const isEn = lang === 'en';
            if (activeDeal) {
                priceHtml = `
                    <div style="display: flex; flex-direction: column;">
                        <span style="color: var(--primary); font-weight: 700; font-size: 1rem;">${formatPrice(activeDeal.saleprice)}</span>
                        <del style="color: var(--text-muted); font-size: 0.8rem;">${formatPrice(p.price)}</del>
                    </div>
                `;
                badgeHtml = `<span class="status-badge sale" style="margin-left: 8px;"><i class="fas fa-tag"></i> ${isEn ? 'Sale' : 'İndirim'}</span>`;
            }

            return `
            <tr>
                <td>
                    <div class="product-cell">
                        <img src="${p.image || 'https://placehold.co/44x44?text=Ürün'}" alt="${escapeHtml(p.name)}" class="product-thumb" onerror="this.src='https://placehold.co/44x44?text=Ürün'">
                        <div>
                            <div class="product-name" style="display: flex; align-items: center;">
                                ${escapeHtml(p.name)} ${badgeHtml}
                            </div>
                            <div class="product-desc">${escapeHtml(p.description || '')}</div>
                        </div>
                    </div>
                </td>
                <td>${escapeHtml(getCategoryName(p.categoryid))}</td>
                <td>${priceHtml}</td>
                <td><span class="status-badge ${p.instock ? 'active' : 'inactive'}">${p.instock ? (isEn ? 'In Stock' : 'Stokta') : (isEn ? 'Out of Stock' : 'Tükendi')}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn" title="${isEn ? 'Edit' : 'Düzenle'}" onclick="editProduct('${p.id}')">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="action-btn delete" title="${isEn ? 'Delete' : 'Sil'}" onclick="deleteProduct('${p.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
            `;
        }).join('');
    }
}

function updateCategorySelects() {
    const categories = getCategories();

    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    // Ürün form select
    const productCatSelect = document.getElementById('productCategory');
    if (productCatSelect) {
        const currentVal = productCatSelect.value;
        productCatSelect.innerHTML = `<option value="">${isEn ? 'Select category' : 'Kategori seçin'}</option>` +
            categories.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
        productCatSelect.value = currentVal;
    }

    // Filtre select
    const filterSelect = document.getElementById('categoryFilter');
    if (filterSelect) {
        const currentVal = filterSelect.value;
        filterSelect.innerHTML = `<option value="">${isEn ? 'All Categories' : 'Tüm Kategoriler'}</option>` +
            categories.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
        filterSelect.value = currentVal;
    }
}

function openProductModal(editId) {
    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    const form = document.getElementById('productForm');
    form.reset();
    document.getElementById('productEditId').value = '';
    document.getElementById('productModalTitle').textContent = isEn ? 'Add New Product' : 'Yeni Ürün Ekle';
    document.getElementById('productInStock').checked = true;
    document.getElementById('productImage').value = '';

    // Dosya önizlemesini sıfırla
    resetImagePreview();

    updateCategorySelects();

    if (editId) {
        const product = getProducts().find(p => p.id === editId);
        if (product) {
            document.getElementById('productEditId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productBrand').value = product.brand || '';
            document.getElementById('productCategory').value = product.categoryid;
            document.getElementById('productPrice').value = product.price;
            
            // Dil desteği için description pars et
            let descTr = product.description || '';
            let nameEn = '';
            let descEn = '';
            try {
                if (descTr.startsWith('{')) {
                    const data = JSON.parse(descTr);
                    if (data.tr !== undefined) {
                        descTr = data.tr;
                        if (data.en) {
                            nameEn = data.en.name || '';
                            descEn = data.en.description || '';
                        }
                    }
                }
            } catch(e) {}

            document.getElementById('productDescription').value = descTr;
            document.getElementById('productNameEn').value = nameEn;
            document.getElementById('productDescriptionEn').value = descEn;

            document.getElementById('productImage').value = product.image || '';
            document.getElementById('productInStock').checked = product.instock;
            document.getElementById('productModalTitle').textContent = isEn ? 'Edit Product' : 'Ürünü Düzenle';

            // Mevcut resmi önizlemede göster
            if (product.image) {
                showImagePreview(product.image);
            }
        }
    }
    openModal('productModal');
}

// Resim önizleme yardımcıları
function showImagePreview(src) {
    const placeholder = document.getElementById('uploadPlaceholder');
    const preview = document.getElementById('uploadPreview');
    const previewImg = document.getElementById('previewImg');
    placeholder.style.display = 'none';
    preview.style.display = 'flex';
    previewImg.src = src;
}

function resetImagePreview() {
    const placeholder = document.getElementById('uploadPlaceholder');
    const preview = document.getElementById('uploadPreview');
    const previewImg = document.getElementById('previewImg');
    const fileInput = document.getElementById('productImageFile');
    placeholder.style.display = 'block';
    preview.style.display = 'none';
    previewImg.src = '';
    if (fileInput) fileInput.value = '';
}

async function saveProduct() {
    const name = document.getElementById('productName').value.trim();
    const brand = document.getElementById('productBrand').value.trim();
    const catId = document.getElementById('productCategory').value;
    const price = document.getElementById('productPrice').value;
    const descTr = document.getElementById('productDescription').value.trim();
    const nameEn = document.getElementById('productNameEn').value.trim();
    const descEn = document.getElementById('productDescriptionEn').value.trim();
    
    // JSON olarak paketle
    const descPayload = JSON.stringify({
        tr: descTr,
        en: {
            name: nameEn,
            description: descEn
        }
    });

    const inStock = document.getElementById('productInStock').checked;
    const editId = document.getElementById('productEditId').value;
    const imagePreview = document.getElementById('previewImg');

    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    if (!name || !catId || !price) {
        alert(isEn ? 'Please fill in the required fields (*).' : 'Lütfen zorunlu alanları (*) doldurun.');
        return;
    }

    const payload = {
        name: name,
        brand: brand,
        categoryid: catId,
        price: parseFloat(price),
        description: descPayload,
        image: document.getElementById('productImage').value || '',
        instock: inStock
    };

    if (editId) {
        await _supabase.from('products').update(payload).eq('id', editId);
    } else {
        payload.id = 'prod-' + Date.now();
        payload.createdat = getTodayStr();
        const { error } = await _supabase.from('products').insert([payload]);
        if(error) console.error("Insert Error: ", error);
    }

    closeModal('productModal');
    await initSupabaseData();
}

async function deleteProduct(id) {
    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    const title = isEn ? 'Delete Product?' : 'Ürünü Sil?';
    const desc = isEn ? 'Are you sure you want to delete this product?' : 'Bu ürünü silmek istediğinize emin misiniz?';
    
    showConfirm(title, desc, async () => {
        await _supabase.from('products').delete().eq('id', id);
        await initSupabaseData();
        showToast(isEn ? 'Product deleted successfully.' : 'Ürün başarıyla silindi.', 'success');
    });
}

// ============================================
// FIRSAT YÖNETİMİ
// ============================================
function renderDeals() {
    const deals = getDeals();
    const container = document.getElementById('dealsList');
    const emptyState = document.getElementById('dealsEmpty');

    // Ürün seçim listesini güncelle
    updateDealProductSelect();

    if (deals.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    container.innerHTML = deals.map(deal => {
        const product = getProductById(deal.productid);
        const productName = product ? product.name : (isEn ? 'Deleted Product' : 'Silinmiş Ürün');
        const categoryName = product ? getCategoryName(product.categoryid) : '';
        const isExpired = deal.enddate && new Date(deal.enddate) < new Date();

        return `
            <div class="deal-card" style="${!deal.active || isExpired ? 'opacity: 0.6;' : ''}">
                <div class="deal-info">
                    <h4>${escapeHtml(productName)}</h4>
                    <div class="deal-meta">
                        ${categoryName ? `<span><i class="fas fa-folder"></i> ${escapeHtml(categoryName)}</span>` : ''}
                        ${deal.startdate ? `<span><i class="fas fa-calendar"></i> ${deal.startdate}</span>` : ''}
                        ${deal.enddate ? `<span><i class="fas fa-calendar-check"></i> ${deal.enddate}</span>` : ''}
                        <span class="status-badge ${deal.active && !isExpired ? 'active' : 'inactive'}">
                            ${isExpired ? (isEn ? 'Expired' : 'Süresi Doldu') : (deal.active ? (isEn ? 'Active' : 'Aktif') : (isEn ? 'Inactive' : 'Pasif'))}
                        </span>
                    </div>
                </div>
                <div class="deal-prices">
                    <div class="old-price">${formatPrice(deal.originalprice)}</div>
                    <div class="new-price">${formatPrice(deal.saleprice)}</div>
                </div>
                <div class="action-btns">
                    <button class="action-btn" title="${isEn ? 'Edit' : 'Düzenle'}" onclick="editDeal('${deal.id}')">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="action-btn delete" title="${isEn ? 'Delete' : 'Sil'}" onclick="deleteDeal('${deal.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
    }).join('');
}

function updateDealProductSelect() {
    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    const products = getProducts();
    const select = document.getElementById('dealProduct');
    if (select) {
        const currentVal = select.value;
        select.innerHTML = `<option value="">${isEn ? 'Select product' : 'Ürün seçin'}</option>` +
            products.map(p => `<option value="${p.id}" data-price="${p.price}">${escapeHtml(p.name)} (${formatPrice(p.price)})</option>`).join('');
        select.value = currentVal;
    }
}

// Fırsat modalında ürün seçildiğinde fiyatı otomatik göster
document.getElementById('dealProduct')?.addEventListener('change', function () {
    const selectedOption = this.options[this.selectedIndex];
    const price = selectedOption?.dataset?.price || '';
    document.getElementById('dealOriginalPrice').value = price;
});

function openDealModal(editId) {
    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    const form = document.getElementById('dealForm');
    form.reset();
    document.getElementById('dealEditId').value = '';
    document.getElementById('dealModalTitle').textContent = isEn ? 'Add New Deal' : 'Yeni Fırsat Ekle';
    document.getElementById('dealActive').checked = true;
    document.getElementById('dealOriginalPrice').value = '';

    updateDealProductSelect();

    if (editId) {
        const deal = getDeals().find(d => d.id === editId);
        if (deal) {
            document.getElementById('dealEditId').value = deal.id;
            document.getElementById('dealProduct').value = deal.productid;
            document.getElementById('dealPrice').value = deal.saleprice;
            document.getElementById('dealOriginalPrice').value = deal.originalprice;
            document.getElementById('dealStartDate').value = deal.startdate || '';
            document.getElementById('dealEndDate').value = deal.enddate || '';
            document.getElementById('dealActive').checked = deal.active;
            document.getElementById('dealModalTitle').textContent = isEn ? 'Edit Deal' : 'Fırsat Düzenle';
        }
    }
    openModal('dealModal');
}

function editDeal(id) {
    openDealModal(id);
}

async function saveDeal() {
    const prodId = document.getElementById('dealProduct').value;
    const origPrice = parseFloat(document.getElementById('dealOriginalPrice').value);
    const salePrice = parseFloat(document.getElementById('dealPrice').value);
    const startDate = document.getElementById('dealStartDate').value;
    const endDate = document.getElementById('dealEndDate').value;
    const active = document.getElementById('dealActive').checked;
    const editId = document.getElementById('dealEditId').value;

    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    if (!prodId || isNaN(origPrice) || isNaN(salePrice)) {
        alert(isEn ? 'Please select a product and verify the prices.' : 'Lütfen ürün seçin ve fiyatları kontrol edin.');
        return;
    }
    if (salePrice >= origPrice) {
        alert(isEn ? 'Discounted price must be less than regular price!' : 'İndirimli fiyat, normal fiyattan küçük olmalıdır!');
        return;
    }
    
    const payload = {
        productid: prodId,
        saleprice: salePrice,
        originalprice: origPrice,
        startdate: startDate || getTodayStr(),
        enddate: endDate || null,
        active: active
    };

    if (editId) {
        await _supabase.from('deals').update(payload).eq('id', editId);
    } else {
        payload.id = 'deal-' + Date.now();
        await _supabase.from('deals').insert([payload]);
    }

    closeModal('dealModal');
    await initSupabaseData();
}

async function deleteDeal(id) {
    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    const title = isEn ? 'Delete Deal?' : 'Fırsatı Sil?';
    const desc = isEn ? 'Are you sure you want to delete this deal?' : 'Bu fırsatı silmek istediğinize emin misiniz?';
    
    showConfirm(title, desc, async () => {
        await _supabase.from('deals').delete().eq('id', id);
        await initSupabaseData();
        showToast(isEn ? 'Deal deleted successfully.' : 'Fırsat başarıyla silindi.', 'success');
    });
}

// ============================================
// AYARLAR
// ============================================
function loadSettings() {
    const settings = getSettings();
    document.getElementById('settingStoreName').value = settings.storeName || '';
    document.getElementById('settingPhone').value = settings.phone || '';
    document.getElementById('settingEmail').value = settings.email || '';
    document.getElementById('settingAddress').value = settings.address || '';
    document.getElementById('settingWeekdays').value = settings.weekdays || '';
    document.getElementById('settingSunday').value = settings.sunday || '';
    document.getElementById('settingFacebook').value = settings.facebook || '';
    document.getElementById('settingInstagram').value = settings.instagram || '';
    document.getElementById('settingWhatsapp').value = settings.whatsapp || '';
}

const settingsFormEl = document.getElementById('settingsForm');
if (settingsFormEl) {
    settingsFormEl.addEventListener('submit', function (e) {
        e.preventDefault();
        const settings = {
            storeName: document.getElementById('settingStoreName').value.trim(),
            phone: document.getElementById('settingPhone').value.trim(),
            email: document.getElementById('settingEmail').value.trim(),
            address: document.getElementById('settingAddress').value.trim(),
            weekdays: document.getElementById('settingWeekdays').value.trim(),
            sunday: document.getElementById('settingSunday').value.trim(),
            facebook: document.getElementById('settingFacebook').value.trim(),
            instagram: document.getElementById('settingInstagram').value.trim(),
            whatsapp: document.getElementById('settingWhatsapp').value.trim()
        };
        setData('settings', settings);
        showToast('Ayarlar başarıyla kaydedildi!', 'success');
    });
}

// ============================================
// XSS KORUMASI
// ============================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// SAYFA BAŞLANGIÇ
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initSupabaseData(); // Starts the UI after fetching
});

// ============================================
// DOSYA YÜKLEME İŞLEMLERİ
// ============================================
(function initFileUpload() {
    const uploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('productImageFile');
    const removeBtn = document.getElementById('removePreview');

    if (!uploadArea || !fileInput) return;

    // Tıklayınca dosya seçici aç
    uploadArea.addEventListener('click', (e) => {
        // Sil butonuna tıklandıysa dosya seçici açma
        if (e.target.closest('.preview-remove')) return;
        fileInput.click();
    });

    // Dosya seçildiğinde
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFileSelect(file);
    });

    // Sürükle-bırak
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileSelect(file);
        } else {
            showToast('Lütfen geçerli bir resim dosyası seçin!', 'error');
        }
    });

    // Fotoğrafı kaldır
    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('productImage').value = '';
            resetImagePreview();
        });
    }
})();

function compressAndLoadImage(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Max dimensions for e-commerce catalog image
            const MAX_WIDTH = 400;
            const MAX_HEIGHT = 400;
            
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Compress to JPEG with 0.6 quality to stay well under 30KB
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
            callback(compressedBase64);
        };
        img.onerror = function() {
            showToast('Resim yüklenirken hata oluştu.', 'error');
        };
        img.src = event.target.result;
    };
    reader.onerror = function() {
        showToast('Dosya okunamadı.', 'error');
    };
    reader.readAsDataURL(file);
}

function handleFileSelect(file) {
    // Tip kontrolü
    if (!file.type.startsWith('image/')) {
        showToast('Lütfen geçerli bir resim dosyası seçin!', 'error');
        return;
    }

    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';

    showToast(isEn ? 'Processing and compressing image...' : 'Görüntü işleniyor ve sıkıştırılıyor...', 'info');

    compressAndLoadImage(file, (compressedBase64) => {
        document.getElementById('productImage').value = compressedBase64;
        showImagePreview(compressedBase64);
        showToast(isEn ? 'Image optimized and loaded!' : 'Görüntü optimize edildi ve yüklendi!', 'success');
    });
}

// ============================================
// SİPARİŞ VE ŞİKAYET YÖNETİMİ
// ============================================

async function loadOrders() {
    try {
        const { data: orders, error } = await _supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        
        document.getElementById('orderCountBadge').textContent = orders.length;
        
        const tbody = document.getElementById('ordersTable');
        if (!tbody) return;
        
        const lang = localStorage.getItem('ab_admin_lang') || 'tr';
        const isEn = lang === 'en';
        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">${isEn ? 'No orders yet.' : 'Henüz sipariş yok.'}</td></tr>`;
            return;
        }
        
        tbody.innerHTML = orders.map(order => {
            const date = new Date(order.created_at).toLocaleDateString(isEn ? 'en-US' : 'tr-TR');
            const total = parseFloat(order.total_price).toFixed(2) + ' ₺';
            const statusText = order.status === 'Bekliyor' ? (isEn ? 'Pending' : 'Bekliyor') : (isEn ? 'Shipped' : 'Kargolandı');
            const badgeClass = order.status === 'Bekliyor' ? 'badge-warning' : 'badge-success';
            
            return `
                <tr>
                    <td>#${order.id}</td>
                    <td>
                        <strong>${order.user_name}</strong><br>
                        <small style="color:#666;">${order.user_email}</small>
                    </td>
                    <td>${date}</td>
                    <td><strong>${total}</strong></td>
                    <td><span class="badge ${badgeClass}">${statusText}</span></td>
                    <td>
                        ${order.status === 'Bekliyor' ? 
                            `<button class="btn btn-sm btn-primary-admin" onclick="markOrderShipped('${order.id}')" title="${isEn ? 'Mark as Shipped' : 'Kargolandı İşaretle'}"><i class="fas fa-truck"></i></button>` : 
                            `<span style="color:var(--success);"><i class="fas fa-check-circle"></i> ${isEn ? 'Completed' : 'Tamamlandı'}</span>`
                        }
                    </td>
                </tr>
            `;
        }).join('');
    } catch(e) {
        console.error('Siparişler yüklenirken hata:', e);
    }
}

async function markOrderShipped(id) {
    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    if(!confirm(isEn ? 'Do you want to mark this order as shipped?' : 'Bu siparişi kargolandı olarak işaretlemek istiyor musunuz?')) return;
    try {
        const { error } = await _supabase.from('orders').update({ status: 'Kargolandı' }).eq('id', id);
        if (error) throw error;
        showToast(isEn ? 'Order status updated successfully.' : 'Sipariş kargolandı olarak güncellendi.', 'success');
        loadOrders();
    } catch(e) {
        showToast(isEn ? 'Update error.' : 'Güncelleme hatası.', 'error');
    }
}

async function loadReports() {
    try {
        const { data: reports, error } = await _supabase
            .from('reports')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        const activeReports = reports.filter(r => r.status === 'İnceleniyor');
        const badge = document.getElementById('reportCountBadge');
        if(badge) badge.textContent = activeReports.length;
        
        const tbody = document.getElementById('reportsTable');
        if (!tbody) return;
        
        if (reports.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Henüz şikayet yok.</td></tr>';
            return;
        }

        const reviewIds = reports.map(r => r.review_id).filter(id => id);
        let reviewsObj = {};
        if (reviewIds.length > 0) {
            const { data: reviewsData } = await _supabase.from('reviews').select('id, comment, username').in('id', reviewIds);
            if (reviewsData) {
                reviewsData.forEach(r => reviewsObj[r.id] = r);
            }
        }
        
        tbody.innerHTML = reports.map(report => {
            const date = new Date(report.created_at).toLocaleDateString('tr-TR');
            const relatedReview = reviewsObj[report.review_id];
            const reviewComment = relatedReview ? relatedReview.comment : 'Yorum silinmiş veya bulunamadı';
            const reviewUser = relatedReview ? relatedReview.username : '-';
            const isResolved = report.status !== 'İnceleniyor';
            
            return `
                <tr>
                    <td><strong>${escapeHtml(report.reported_by || 'Bilinmiyor')}</strong></td>
                    <td>${date}</td>
                    <td>
                        <div style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(reviewComment)}">
                            <em>"${escapeHtml(reviewComment)}"</em><br>
                            <small style="color:#666;">Yazar: ${escapeHtml(reviewUser)}</small>
                        </div>
                    </td>
                    <td><span class="badge ${isResolved ? 'badge-success' : 'badge-warning'}">${escapeHtml(report.status)}</span></td>
                    <td>
                        ${!isResolved ? `
                            <button class="btn btn-sm btn-danger" onclick="deleteReportedComment('${report.id}', '${report.review_id}')" title="Yorumu Sil"><i class="fas fa-trash"></i></button>
                            <button class="btn btn-sm btn-secondary-admin" onclick="dismissReport('${report.id}')" title="Şikayeti Yoksay"><i class="fas fa-times"></i></button>
                        ` : `<span style="color:#666;">${escapeHtml(report.status)}</span>`}
                    </td>
                </tr>
            `;
        }).join('');
    } catch(e) {
        console.error('Şikayetler yüklenirken hata:', e);
    }
}

async function deleteReportedComment(reportId, reviewId) {
    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    if(!confirm(isEn ? 'Are you sure you want to permanently delete this comment?' : 'Bu yorumu kalıcı olarak silmek istediğinize emin misiniz?')) return;
    try {
        // Yorumu sil
        if(reviewId && reviewId !== 'null') {
            await _supabase.from('reviews').delete().eq('id', reviewId);
        }
        // Şikayeti güncelleyelim
        await _supabase.from('reports').update({ status: 'Yorum Silindi' }).eq('id', reportId);
        showToast(isEn ? 'Comment deleted successfully.' : 'Yorum başarıyla silindi.', 'success');
        loadReports();
    } catch(e) {
        showToast(isEn ? 'Delete error.' : 'Silme hatası.', 'error');
    }
}

async function dismissReport(reportId) {
    const lang = localStorage.getItem('ab_admin_lang') || 'tr';
    const isEn = lang === 'en';
    if(!confirm(isEn ? 'Do you want to dismiss (close) this report?' : 'Bu şikayeti yoksaymak (kapatmak) istiyor musunuz?')) return;
    try {
        await _supabase.from('reports').update({ status: 'Reddedildi' }).eq('id', reportId);
        showToast(isEn ? 'Report closed successfully.' : 'Şikayet kapatıldı.', 'success');
        loadReports();
    } catch(e) {
        showToast(isEn ? 'Update error.' : 'Güncelleme hatası.', 'error');
    }
}

function editProduct(id) {
    openProductModal(id);
}

function generateSlug(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

// Admin Theme & Language
function initAdminSettings() {
    const savedTheme = localStorage.getItem('ab_admin_theme') || 'light';
    if(savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('adminThemeIcon').className = 'fas fa-sun';
    }
    const savedLang = localStorage.getItem('ab_admin_lang') || 'tr';
    changeAdminLanguage(savedLang);
}

function toggleAdminTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('ab_admin_theme', newTheme);
    document.getElementById('adminThemeIcon').className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

function toggleAdminLanguage() {
    const currentLang = localStorage.getItem('ab_admin_lang') || 'tr';
    const newLang = currentLang === 'tr' ? 'en' : 'tr';
    changeAdminLanguage(newLang);
    
    // Refresh active section
    const currentSection = document.querySelector('.admin-section.active');
    if (currentSection) {
        const sectionId = currentSection.id.replace('section-', '');
        navigateTo(sectionId);
    }
}

document.addEventListener('DOMContentLoaded', initAdminSettings);
