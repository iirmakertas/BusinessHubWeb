// ============================================
// MOCK SUPABASE CLIENT & OFFLINE SEED DATABASE
// ============================================
// Bu dosya, Supabase veritabanının artık erişilemez olması nedeniyle
// localStorage üzerinde çalışan bir mock istemci sağlar.
// Admin paneli ve müşteri arayüzü bu mock üzerinden çalışır.

const MOCK_DB_KEY = 'mock_supabase_db';
const MOCK_SESSION_KEY = 'mock_supabase_session';

const DEFAULT_CATEGORIES = [
    { id: 'cat-1', name: 'Baharatlar', icon: 'fas fa-pepper-hot', description: 'Taze ve aromatik baharatlarımızla yemeklerinize lezzet katın.', slug: 'index.html#urunler' },
    { id: 'cat-2', name: 'Bitki Yağları', icon: 'fas fa-spa', description: 'Saf ve aromatik bitki yağlarımız sağlığınızı destekler.', slug: 'index.html#urunler' },
    { id: 'cat-3', name: 'Bal-Macun-Pekmez', icon: 'fas fa-oil-can', description: 'Doğal tatlılık ve enerji için en saf ürünler.', slug: 'index.html#urunler' },
    { id: 'cat-4', name: 'Gıda Takviyeleri', icon: 'fas fa-capsules', description: 'Vücudunuz için doğal ve güvenilir destek ürünleri.', slug: 'index.html#urunler' },
    { id: 'cat-5', name: 'Kozmetik', icon: 'fas fa-heart', description: 'Doğal içeriklerle cildinize nazik bakım sunar.', slug: 'index.html#urunler' },
    { id: 'cat-6', name: 'Kuruyemişler', icon: 'fas fa-leaf', description: 'Doğal ve taze kuruyemişlerle gün boyu enerji kazanın.', slug: 'index.html#urunler' }
];

const DEFAULT_PRODUCTS = [
    {
        id: 'prod-1',
        name: 'Pul Biber (İpek)',
        brand: 'Ankara Baharat',
        categoryid: 'cat-1',
        price: 45.00,
        description: '{"tr": "Özel Maraş biberinden ipek çekim acı pul biber. Yemeklerinize renk ve enfes bir tat katacaktır.", "en": {"name": "Red Pepper Flakes (Silk)", "description": "Silk-ground spicy red pepper flakes made from special Maraş peppers."}}',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=300&h=300&q=80',
        instock: true,
        createdat: '2026-01-01'
    },
    {
        id: 'prod-2',
        name: 'Dağ Kekiği',
        brand: 'Ankara Baharat',
        categoryid: 'cat-1',
        price: 30.00,
        description: '{"tr": "Toros dağlarından özenle toplanmış kurutulmuş dağ kekiği. Çorbalar ve et yemekleri için vazgeçilmez lezzet.", "en": {"name": "Wild Thyme", "description": "Hand-picked dried wild thyme from the Taurus mountains."}}',
        image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=300&h=300&q=80',
        instock: true,
        createdat: '2026-01-02'
    },
    {
        id: 'prod-3',
        name: 'Soğuk Sıkım Çörek Otu Yağı',
        brand: 'Lokman Hekim',
        categoryid: 'cat-2',
        price: 120.00,
        description: '{"tr": "%100 doğal, koruyucusuz soğuk sıkım çörek otu yağı. Günlük gıda takviyesi olarak tüketilebilir.", "en": {"name": "Cold Pressed Black Cumin Oil", "description": "100% natural, preservative-free cold-pressed black cumin seed oil."}}',
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=300&h=300&q=80',
        instock: true,
        createdat: '2026-01-03'
    },
    {
        id: 'prod-4',
        name: 'Tatlı Badem Yağı',
        brand: 'Lokman Hekim',
        categoryid: 'cat-2',
        price: 75.00,
        description: '{"tr": "Saç ve cilt bakımı için saf tatlı badem yağı. Cildi besler ve nemlendirir.", "en": {"name": "Sweet Almond Oil", "description": "Pure sweet almond oil for hair and skin care."}}',
        image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=300&h=300&q=80',
        instock: true,
        createdat: '2026-01-04'
    },
    {
        id: 'prod-5',
        name: 'Karakovan Süzme Balı',
        brand: 'Eğriçayır',
        categoryid: 'cat-3',
        price: 350.00,
        description: '{"tr": "Sertifikalı organik karakovan süzme balı. Katkısız, şeker ilavesiz doğal bal lezzeti.", "en": {"name": "Organic Wild Honey", "description": "Certified organic wild honey, completely natural and additive-free."}}',
        image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=300&h=300&q=80',
        instock: true,
        createdat: '2026-01-05'
    },
    {
        id: 'prod-6',
        name: 'Doğal Keçiboynuzu Pekmezi',
        brand: 'Ankara Baharat',
        categoryid: 'cat-3',
        price: 90.00,
        description: '{"tr": "Geleneksel yöntemlerle odun ateşinde üretilmiş keçiboynuzu pekmezi. Yüksek demir kaynağıdır.", "en": {"name": "Carob Molasses", "description": "Traditionally made carob molasses cooked over a wood fire."}}',
        image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=300&h=300&q=80',
        instock: true,
        createdat: '2026-01-06'
    },
    {
        id: 'prod-7',
        name: 'Arı Sütü & Propolis Macunu',
        brand: 'Lokman Hekim',
        categoryid: 'cat-4',
        price: 180.00,
        description: '{"tr": "Bağışıklık sistemini destekleyen doğal arı sütü, polen ve propolis karışımı özel macun.", "en": {"name": "Royal Jelly & Propolis Paste", "description": "Special natural paste containing royal jelly, pollen, and propolis to support immunity."}}',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&h=300&q=80',
        instock: true,
        createdat: '2026-01-07'
    },
    {
        id: 'prod-8',
        name: 'Doğal Eşek Sütü Sabunu',
        brand: 'Lokman Hekim',
        categoryid: 'cat-5',
        price: 35.00,
        description: '{"tr": "Cilt gözeneklerini temizler, nemlendirir and lekelerin giderilmesine yardımcı olur. El yapımı.", "en": {"name": "Natural Donkey Milk Soap", "description": "Handmade soap that cleanses pores, moisturizes, and helps clear spots."}}',
        image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=300&h=300&q=80',
        instock: true,
        createdat: '2026-01-08'
    },
    {
        id: 'prod-9',
        name: 'Kavrulmuş İç Antep Fıstığı',
        brand: 'Ankara Baharat',
        categoryid: 'cat-6',
        price: 280.00,
        description: '{"tr": "Taptaze kavrulmuş, çıtır ve lezzetli duble boy iç Antep fıstığı.", "en": {"name": "Roasted Pistachio Kernels", "description": "Freshly roasted, crunchy, and delicious double-sized Turkish pistachio kernels."}}',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&h=300&q=80',
        instock: true,
        createdat: '2026-01-09'
    },
    {
        id: 'prod-10',
        name: 'Omega 3 Balık Yağı',
        brand: 'Lokman Hekim',
        categoryid: 'cat-4',
        price: 150.00,
        description: '{"tr": "Yüksek kaliteli Omega-3 yağ asitleri içeren balık yağı kapsülleri. Kalp ve beyin sağlığını destekler.", "en": {"name": "Omega 3 Fish Oil", "description": "Fish oil capsules containing high-quality Omega-3 fatty acids. Supports heart and brain health."}}',
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=300&h=300&q=80',
        instock: true,
        createdat: '2026-01-10'
    },
    {
        id: 'prod-11',
        name: 'Saf Gül Suyu',
        brand: 'Lokman Hekim',
        categoryid: 'cat-5',
        price: 65.00,
        description: '{"tr": "%100 doğal Isparta güllerinden elde edilmiş saf gül suyu. Cildi temizler, ferahlatır ve tonik etkisi yaratır.", "en": {"name": "Pure Rose Water", "description": "100% natural pure rose water obtained from Isparta roses. Cleanses, refreshes, and tones the skin."}}',
        image: 'https://images.unsplash.com/photo-1612240498936-65f5101365d2?auto=format&fit=crop&w=300&h=300&q=80',
        instock: true,
        createdat: '2026-01-11'
    },
    {
        id: 'prod-12',
        name: 'Çiğ Badem İçi',
        brand: 'Ankara Baharat',
        categoryid: 'cat-6',
        price: 190.00,
        description: '{"tr": "Taptaze, lezzetli ve besleyici yerli çiğ badem içi. Doğal enerji kaynağı.", "en": {"name": "Raw Almonds", "description": "Fresh, delicious, and nutritious raw almond kernels. A source of natural energy."}}',
        image: 'https://images.unsplash.com/photo-1541140111813-8222e9d90981?auto=format&fit=crop&w=300&h=300&q=80',
        instock: true,
        createdat: '2026-01-12'
    }
];

const DEFAULT_DEALS = [
    {
        id: 'deal-1',
        productid: 'prod-3',
        originalprice: 120.00,
        saleprice: 99.00,
        startdate: '2026-01-01',
        enddate: '2027-01-01',
        active: true
    },
    {
        id: 'deal-2',
        productid: 'prod-5',
        originalprice: 350.00,
        saleprice: 299.00,
        startdate: '2026-01-01',
        enddate: '2027-01-01',
        active: true
    }
];

const DEFAULT_REVIEWS = [
    { id: 'rev-1', productid: 'prod-1', username: 'Mehmet Yılmaz', rating: 5, comment: 'Çok lezzetli, taze çekilmiş ve çok acı. Tam istediğim gibi!', created_at: '2026-05-10T12:00:00.000Z' },
    { id: 'rev-2', productid: 'prod-1', username: 'Ayşe Kaya', rating: 4, comment: 'Yemeklere harika bir koku veriyor, hızlı kargo için teşekkürler.', created_at: '2026-05-15T15:30:00.000Z' },
    { id: 'rev-3', productid: 'prod-3', username: 'Ali Demir', rating: 5, comment: 'Soğuk sıkım olduğu tadından belli, düzenli olarak kullanıyorum.', created_at: '2026-05-20T09:45:00.000Z' }
];

const DEFAULT_ORDERS = [
    { id: '1001', user_name: 'Ahmet Yılmaz', user_email: 'ahmet@example.com', items: '[]', total_price: 189.00, status: 'Kargolandı', created_at: '2026-05-25T11:00:00.000Z' },
    { id: '1002', user_name: 'Zeynep Aksoy', user_email: 'zeynep@example.com', items: '[]', total_price: 299.00, status: 'Bekliyor', created_at: '2026-06-01T14:20:00.000Z' }
];

const DEFAULT_REPORTS = [
    { id: 'rep-1', review_id: 'rev-2', reported_by: 'Ziyaretçi', status: 'İnceleniyor', created_at: '2026-06-02T16:00:00.000Z' }
];

// Veritabanını yalnızca yoksa veya bozuksa oluştur
function ensureMockDatabase() {
    const existing = localStorage.getItem(MOCK_DB_KEY);
    if (existing) {
        try {
            const db = JSON.parse(existing);
            // Temel tabloların var olduğunu kontrol et
            if (db && typeof db === 'object') {
                let migrated = false;
                
                if (Array.isArray(db.categories)) {
                    // Migration: Replace old anasayfa.html references in categories slug
                    db.categories.forEach(cat => {
                        if (cat.slug && typeof cat.slug === 'string' && cat.slug.includes('anasayfa.html')) {
                            cat.slug = cat.slug.replace('anasayfa.html', 'index.html');
                            migrated = true;
                        }
                    });
                } else {
                    db.categories = DEFAULT_CATEGORIES;
                    migrated = true;
                }

                if (!Array.isArray(db.products)) {
                    db.products = DEFAULT_PRODUCTS;
                    migrated = true;
                }

                // Eksik tabloları ekle (yapı bütünlüğü kontrolü)
                if (!Array.isArray(db.reviews)) {
                    db.reviews = DEFAULT_REVIEWS;
                    migrated = true;
                }
                if (!Array.isArray(db.orders)) {
                    db.orders = DEFAULT_ORDERS;
                    migrated = true;
                }
                if (!Array.isArray(db.reports)) {
                    db.reports = DEFAULT_REPORTS;
                    migrated = true;
                }
                if (!Array.isArray(db.deals)) {
                    db.deals = DEFAULT_DEALS;
                    migrated = true;
                }

                if (migrated) {
                    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db));
                }
                return db;
            }
        } catch (e) {
            console.error('[MockDB] Database load/migration error:', e);
            // JSON tamamen bozuk değilse veya kurtarılabiliyorsa sıfırlama yapma
        }
    }
    // Yeni veritabanı oluştur
    const db = {
        categories: DEFAULT_CATEGORIES,
        products: DEFAULT_PRODUCTS,
        deals: DEFAULT_DEALS,
        reviews: DEFAULT_REVIEWS,
        orders: DEFAULT_ORDERS,
        reports: DEFAULT_REPORTS
    };
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db));
    console.log('[MockDB] Veritabanı ilk kez oluşturuldu.');
    return db;
}

// Veritabanını oku
function getDB() {
    let db;
    try {
        db = JSON.parse(localStorage.getItem(MOCK_DB_KEY));
    } catch (e) {
        db = null;
    }
    if (!db || !db.categories || !db.products) {
        db = ensureMockDatabase();
    }
    return db;
}

// Veritabanını kaydet
function saveDB(db) {
    try {
        localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db));
    } catch (e) {
        console.error('[MockDB] Kayıt Hatası:', e);
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            alert('Hata: Tarayıcı hafızası (localStorage) doldu! Fotoğraflarınız çok büyük olabilir. Resimleri küçülterek tekrar deneyin.');
        } else {
            alert('Veritabanı güncellenirken bir hata oluştu: ' + e.message);
        }
    }
}

// ============================================
// MOCK QUERY BUILDER
// ============================================
class MockSupabaseQuery {
    constructor(tableName) {
        this.tableName = tableName;
        this.filters = [];
        this.orderCol = null;
        this.orderAsc = true;
        this.isSingle = false;
        this.action = 'select';
        this.payload = null;
    }

    select(_columns) {
        this.action = 'select';
        return this;
    }

    insert(data) {
        this.action = 'insert';
        this.payload = data;
        return this;
    }

    update(data) {
        this.action = 'update';
        this.payload = data;
        return this;
    }

    delete() {
        this.action = 'delete';
        return this;
    }

    eq(column, value) {
        this.filters.push({ type: 'eq', column, value });
        return this;
    }

    in(column, values) {
        this.filters.push({ type: 'in', column, value: values });
        return this;
    }

    single() {
        this.isSingle = true;
        return this;
    }

    order(column, options) {
        this.orderCol = column;
        this.orderAsc = options && options.ascending === false ? false : true;
        return this;
    }

    // Thenable - await ile çalışmasını sağlar
    then(resolve, reject) {
        return this.execute().then(resolve, reject);
    }

    // Catch desteği
    catch(reject) {
        return this.execute().catch(reject);
    }

    execute() {
        return new Promise((resolve) => {
            try {
                const db = getDB();
                const tableData = db[this.tableName] || [];

                if (this.action === 'select') {
                    let filtered = [...tableData];

                    // Filtreleri uygula
                    for (const f of this.filters) {
                        if (f.type === 'eq') {
                            filtered = filtered.filter(item => {
                                // Hem orijinal kolon adını hem de lowercase versiyonunu dene
                                const val = item[f.column] !== undefined ? item[f.column] : item[f.column.toLowerCase()];
                                return String(val) === String(f.value);
                            });
                        } else if (f.type === 'in') {
                            filtered = filtered.filter(item => {
                                const val = item[f.column] !== undefined ? item[f.column] : item[f.column.toLowerCase()];
                                return f.value.includes(val) || f.value.includes(String(val));
                            });
                        }
                    }

                    // Sıralama
                    if (this.orderCol) {
                        const col = this.orderCol;
                        filtered.sort((a, b) => {
                            const valA = a[col] !== undefined ? a[col] : (a[col.toLowerCase()] || '');
                            const valB = b[col] !== undefined ? b[col] : (b[col.toLowerCase()] || '');
                            if (valA < valB) return this.orderAsc ? -1 : 1;
                            if (valA > valB) return this.orderAsc ? 1 : -1;
                            return 0;
                        });
                    }

                    if (this.isSingle) {
                        resolve({ data: filtered[0] || null, error: null });
                    } else {
                        resolve({ data: filtered, error: null });
                    }
                    return;
                }

                if (this.action === 'insert') {
                    const newItems = Array.isArray(this.payload) ? this.payload : [this.payload];
                    const now = new Date().toISOString();
                    const processedItems = newItems.map(item => ({
                        created_at: now,
                        createdat: now,
                        ...item,
                        id: item.id || (this.tableName.slice(0, 3) + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5))
                    }));

                    const updatedTable = [...tableData, ...processedItems];
                    db[this.tableName] = updatedTable;
                    saveDB(db);

                    resolve({ data: this.isSingle ? processedItems[0] : processedItems, error: null });
                    return;
                }

                if (this.action === 'update') {
                    const updatedTable = tableData.map(item => {
                        let matches = true;
                        for (const f of this.filters) {
                            if (f.type === 'eq') {
                                const val = item[f.column] !== undefined ? item[f.column] : item[f.column.toLowerCase()];
                                if (String(val) !== String(f.value)) matches = false;
                            }
                        }
                        return matches ? { ...item, ...this.payload } : item;
                    });

                    db[this.tableName] = updatedTable;
                    saveDB(db);
                    resolve({ data: updatedTable, error: null });
                    return;
                }

                if (this.action === 'delete') {
                    const toDelete = [];
                    const remaining = [];
                    
                    tableData.forEach(item => {
                        let matches = true;
                        for (const f of this.filters) {
                            if (f.type === 'eq') {
                                const val = item[f.column] !== undefined ? item[f.column] : item[f.column.toLowerCase()];
                                if (String(val) !== String(f.value)) matches = false;
                            }
                        }
                        if (matches) {
                            toDelete.push(item);
                        } else {
                            remaining.push(item);
                        }
                    });

                    db[this.tableName] = remaining;

                    // Cascade deletions
                    if (this.tableName === 'categories' && toDelete.length > 0) {
                        const categoryIds = toDelete.map(c => c.id);
                        
                        // Find products in these categories
                        const productsToDelete = (db.products || []).filter(p => categoryIds.includes(p.categoryid));
                        const productIds = productsToDelete.map(p => p.id);
                        
                        // Remove products
                        if (db.products) {
                            db.products = db.products.filter(p => !categoryIds.includes(p.categoryid));
                        }
                        
                        // Remove deals
                        if (db.deals) {
                            db.deals = db.deals.filter(d => !productIds.includes(d.productid));
                        }
                        
                        // Remove reviews
                        if (db.reviews) {
                            db.reviews = db.reviews.filter(r => !productIds.includes(r.productid));
                        }
                    } else if (this.tableName === 'products' && toDelete.length > 0) {
                        const productIds = toDelete.map(p => p.id);
                        
                        // Remove deals
                        if (db.deals) {
                            db.deals = db.deals.filter(d => !productIds.includes(d.productid));
                        }
                        
                        // Remove reviews
                        if (db.reviews) {
                            db.reviews = db.reviews.filter(r => !productIds.includes(r.productid));
                        }
                    }

                    saveDB(db);
                    resolve({ data: null, error: null });
                    return;
                }

                resolve({ data: null, error: 'Unknown action' });
            } catch (err) {
                console.error('[MockDB] Query Error:', err);
                resolve({ data: null, error: err.message });
            }
        });
    }
}

// ============================================
// MOCK AUTH
// ============================================
const mockAuth = {
    _callbacks: [],

    _fireEvent(event, session) {
        this._callbacks.forEach(cb => {
            try { cb(event, session); } catch(e) { console.error('[MockAuth] Callback error:', e); }
        });
    },

    getSession() {
        const session = JSON.parse(localStorage.getItem(MOCK_SESSION_KEY) || 'null');
        return Promise.resolve({ data: { session }, error: null });
    },

    onAuthStateChange(callback) {
        this._callbacks.push(callback);

        // İlk durumu bildir
        const session = JSON.parse(localStorage.getItem(MOCK_SESSION_KEY) || 'null');
        setTimeout(() => callback('INITIAL_SESSION', session), 0);

        return { data: { subscription: { unsubscribe() {} } } };
    },

    signUp({ email, password, options }) {
        const name = options?.data?.name || email.split('@')[0];
        const user = {
            id: 'usr-' + Date.now(),
            email,
            identities: [{ id: '1' }],
            user_metadata: { name }
        };
        const session = { user, access_token: 'mock-token-' + Date.now() };
        localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
        this._fireEvent('SIGNED_IN', session);
        return Promise.resolve({ data: { user, session }, error: null });
    },

    signInWithPassword({ email, password }) {
        const user = {
            id: 'usr-default',
            email,
            user_metadata: { name: email.split('@')[0] }
        };
        const session = { user, access_token: 'mock-token-default' };
        localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
        this._fireEvent('SIGNED_IN', session);
        return Promise.resolve({ data: { user, session }, error: null });
    },

    resetPasswordForEmail(_email) {
        return Promise.resolve({ data: {}, error: null });
    },

    updateUser({ password }) {
        const session = JSON.parse(localStorage.getItem(MOCK_SESSION_KEY) || '{}');
        if (session && session.user) {
            session.user.updated_at = new Date().toISOString();
            localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
        }
        return Promise.resolve({ data: { user: session?.user || null }, error: null });
    },

    signOut() {
        localStorage.removeItem(MOCK_SESSION_KEY);
        this._fireEvent('SIGNED_OUT', null);
        return Promise.resolve({ error: null });
    }
};

// ============================================
// GLOBAL EXPORT
// ============================================
const _supabase = {
    from(tableName) {
        return new MockSupabaseQuery(tableName);
    },
    auth: mockAuth
};

// İlk yükleme - veritabanını hazırla (varsa dokunma)
ensureMockDatabase();
console.log('[MockDB] Mock Supabase Client başarıyla başlatıldı (Offline Mode).');
