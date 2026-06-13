# BusinessHub - E-Commerce & Admin Panel Portfolio Project

## Projenin Amacı
Bu proje, modern bir e-ticaret sitesinin hem müşteri arayüzünü (frontend) hem de işletme sahipleri için kapsamlı bir yönetim panelini (backend/admin) barındıran uçtan uca bir sistemin demosudur. Portföy amaçlı olarak, gerçek bir ticari altyapının nasıl çalışacağını ve yönetileceğini göstermek için geliştirilmiştir.

## Kullanılan Teknolojiler
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+), FontAwesome
* **Backend / Veritabanı:** Supabase (PostgreSQL, Auth, REST API - Çevrimdışı testler için localStorage tabanlı Mock DB entegre edilmiştir)
* **Tasarım:** Responsive, modern UI/UX, Flexbox & CSS Grid, Dinamik Modal Sistemi

## Özellikler
* Tam teşekküllü Üyelik Sistemi (Giriş, Kayıt, Şifre Sıfırlama)
* Sepet ve Favoriler Yönetimi
* Dinamik Ürün Değerlendirme ve Yorum/Şikayet Sistemi
* Kategorilendirilmiş Dinamik Ürün Listeleme
* İndirim ve Kampanya (Fırsatlar) Altyapısı
* Optimize Edilmiş Resim Yükleme (Görseller yüklenirken tarayıcı tarafında otomatik sıkıştırılarak localStorage boyut limiti korunur)

## Admin Panel Özellikleri
* **Dashboard:** Sipariş, ürün ve kategori sayılarının canlı istatistikleri.
* **Sipariş Yönetimi:** Müşterilerden gelen siparişlerin listelenmesi ve kargolanma süreçlerinin yönetimi.
* **Ürün ve Kategori Yönetimi:** Dinamik ürün ekleme, stok takibi, fiyat ve kategori düzenleme (Cascade silme desteği ile ilişkili veriler otomatik temizlenir).
* **Kampanya Yönetimi:** Süreli indirimlerin ve özel fırsatların oluşturulması.
* **Şikayet Yönetimi:** Müşterilerin şikayet ettiği yorumların incelenmesi, silinmesi veya reddedilmesi.

## Kurulum ve Çalıştırma Adımları

Tarayıcıların güvenlik politikaları (Same-Origin Policy) nedeniyle sayfaların doğrudan çift tıklanarak (`file://` protokolü ile) açılması durumunda sayfalar arası veritabanı paylaşımı (`localStorage`) engellenebilmektedir. Bu nedenle projenin yerel bir sunucu üzerinden çalıştırılması gerekir.

### Yöntem 1: Node.js ile (Hızlı ve Bağımsız)
Bilgisayarınızda Node.js kurulu ise terminalden aşağıdaki komutu çalıştırarak projeyi anında başlatabilirsiniz:
```bash
node server_temp.js
```
Daha sonra tarayıcınızdan **`http://localhost:9000`** adresine gidin.

### Yöntem 2: NPM ile
Bağımlılıkları yükleyip sunucuyu başlatmak için:
```bash
npm install
npm run dev
```
Daha sonra tarayıcınızdan **`http://localhost:9000`** adresine gidin.

## Giriş Bilgileri
* **Müşteri Girişi:** Giriş yap / Üye ol modallarını kullanarak yeni hesaplar oluşturabilirsiniz.
* **Yönetim Paneli Girişi:** Sağ alttaki "Yönetim Paneli" linkinden veya `/admin-login.html` sayfasından gidebilirsiniz.
  * **Kullanıcı Adı:** `admin`
  * **Şifre:** `ankara2024`