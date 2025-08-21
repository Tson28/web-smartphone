// Updated: Product detail functionality refinements
// Author: Nguyen Thai Son - https://github.com/Tson28

var nameProduct, maProduct, sanPhamHienTai; // Tên sản phẩm trong trang này, 
// là biến toàn cục để có thể dùng ở bát cứ đâu trong trang
// không cần tính toán lấy tên từ url nhiều lần

window.onload = function () {
    khoiTao();

    // thêm tags (từ khóa) vào khung tìm kiếm
    var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
    for (var t of tags) addTags(t, "index.html?search=" + t, true);

    phanTich_URL_chiTietSanPham();

    // autocomplete cho khung tim kiem
    autocomplete(document.getElementById('search-box'), list_products);

    // Thêm gợi ý sản phẩm
    sanPhamHienTai && suggestion();
}

function khongTimThaySanPham() {
    document.getElementById('productNotFound').style.display = 'block';
    document.getElementsByClassName('chitietSanpham')[0].style.display = 'none';
}

function phanTich_URL_chiTietSanPham() {
    nameProduct = window.location.href.split('?')[1]; // lấy tên
    if(!nameProduct) return khongTimThaySanPham();

    // tách theo dấu '-' vào gắn lại bằng dấu ' ', code này giúp bỏ hết dấu '-' thay vào bằng khoảng trắng.
    // code này làm ngược lại so với lúc tạo href cho sản phẩm trong file classes.js
    nameProduct = nameProduct.split('-').join(' ');

    for(var p of list_products) {
        if(nameProduct == p.name) {
            maProduct = p.masp;
            break;
        }
    }

    sanPhamHienTai = timKiemTheoMa(list_products, maProduct);
    if(!sanPhamHienTai) return khongTimThaySanPham();

    var divChiTiet = document.getElementsByClassName('chitietSanpham')[0];

    // Đổi title
    document.title = nameProduct + ' - Thế giới điện thoại';

    // Cập nhật tên sản phẩm
    document.getElementById('productName').innerHTML = nameProduct;
    document.getElementById('reviewProductName').innerHTML = nameProduct;

    // Cập nhật thống kê sản phẩm
    updateProductStats();

    // Cập nhật giá và khuyến mãi
    updatePricing();

    // Cập nhật hình ảnh
    updateProductImages();

    // Cập nhật thông số kỹ thuật
    updateProductSpecs();

    // Cập nhật đánh giá
    updateProductReviews();

    // Cập nhật sản phẩm liên quan
    updateRelatedProducts();

    // Cập nhật sản phẩm đã xem
    updateRecentlyViewed();

    // Khởi động thư viện hỗ trợ banner - chỉ chạy sau khi tạo xong hình nhỏ
    var owl = $('.owl-carousel');
    owl.owlCarousel({
        items: 5,
        center: true,
        smartSpeed: 450,
    });
}

// Cập nhật thống kê sản phẩm
function updateProductStats() {
    // Giả lập số lượng đã bán
    var soldCount = Math.floor(Math.random() * 10000) + 1000;
    document.getElementById('soldCount').innerHTML = (soldCount / 1000).toFixed(1) + 'k';
    
    // Cập nhật đánh giá
    document.getElementById('ratingStars').innerHTML = sanPhamHienTai.star;
    document.getElementById('ratingCount').innerHTML = sanPhamHienTai.rateCount + ' đánh giá';
    
    // Cập nhật đánh giá lớn
    document.getElementById('bigRating').innerHTML = sanPhamHienTai.star;
    document.getElementById('satisfiedCustomers').innerHTML = (soldCount * 0.95).toFixed(0);
    document.getElementById('totalReviews').innerHTML = sanPhamHienTai.rateCount;
}

// Cập nhật giá và khuyến mãi
function updatePricing() {
    var price = sanPhamHienTai.price;
    var originalPrice = price;
    
    // Tính giá khuyến mãi nếu có
    if (sanPhamHienTai.promo.name === 'giareonline' && sanPhamHienTai.promo.value) {
        price = sanPhamHienTai.promo.value;
    } else if (sanPhamHienTai.promo.name === 'giamgia' && sanPhamHienTai.promo.value) {
        price = (parseInt(price.replace(/\./g, '')) - parseInt(sanPhamHienTai.promo.value.replace(/\./g, ''))).toLocaleString('vi-VN');
    }
    
    // Cập nhật giá hiển thị
    document.getElementById('mainPrice').innerHTML = price;
    document.getElementById('originalPrice').innerHTML = originalPrice;
    
    // Tính phần trăm giảm giá
    var discountPercent = Math.floor(Math.random() * 20) + 5;
    document.getElementById('discountPercent').innerHTML = '-' + discountPercent + '%';
    
    // Cập nhật số suất còn lại
    var slotsRemaining = Math.floor(Math.random() * 10) + 1;
    document.getElementById('slotsRemaining').innerHTML = slotsRemaining;
    
    // Cập nhật giá trị khuyến mãi
    var promoValue = 500000 + (Math.floor(Math.random() * 500000));
    document.getElementById('promoValue').innerHTML = promoValue.toLocaleString('vi-VN');
    
    // Cập nhật điểm VIP
    var vipPoints = Math.floor(parseInt(price.replace(/\./g, '')) / 1000);
    document.getElementById('vipPoints').innerHTML = vipPoints.toLocaleString('vi-VN');
}

// Cập nhật hình ảnh sản phẩm
function updateProductImages() {
    var hinh = document.getElementById('mainImage');
    var bigImg = document.getElementById('bigimg');
    
    hinh.src = sanPhamHienTai.img;
    bigImg.src = sanPhamHienTai.img;
    
    // Tạo gallery hình ảnh
    createImageGallery();
}

// Tạo gallery hình ảnh
function createImageGallery() {
    var galleryThumbnails = document.getElementById('galleryThumbnails');
    var totalImages = 8; // Giả lập 8 hình
    
    // Xóa hình cũ
    galleryThumbnails.innerHTML = '';
    
    // Thêm hình chính
    var mainImg = document.createElement('img');
    mainImg.src = sanPhamHienTai.img;
    mainImg.onclick = function() { changepic(this.src); };
    galleryThumbnails.appendChild(mainImg);
    
    // Thêm hình phụ (giả lập)
    for (var i = 1; i < totalImages; i++) {
        var img = document.createElement('img');
        img.src = sanPhamHienTai.img; // Sử dụng cùng hình cho demo
        img.onclick = function() { changepic(this.src); };
        galleryThumbnails.appendChild(img);
    }
    
    document.getElementById('totalImages').innerHTML = totalImages;
}

// Cập nhật thông số kỹ thuật
function updateProductSpecs() {
    var d = sanPhamHienTai.detail;
    
    // Cập nhật thông số cấu hình
    document.getElementById('spec-os').innerHTML = d.os || 'Chưa công bố';
    document.getElementById('spec-cpu').innerHTML = d.cpu || 'Chưa công bố';
    document.getElementById('spec-cpu-speed').innerHTML = 'Hãng không công bố';
    document.getElementById('spec-gpu').innerHTML = d.cpu ? d.cpu.replace('nhân', 'nhân GPU') : 'Chưa công bố';
    document.getElementById('spec-ram').innerHTML = d.ram || 'Chưa công bố';
    document.getElementById('spec-storage').innerHTML = d.rom || 'Chưa công bố';
    
    // Tính dung lượng khả dụng
    if (d.rom) {
        var storage = parseInt(d.rom);
        var available = Math.floor(storage * 0.94); // Giả sử 94% dung lượng khả dụng
        document.getElementById('spec-available').innerHTML = available + ' GB';
    } else {
        document.getElementById('spec-available').innerHTML = 'Chưa công bố';
    }
    
    document.getElementById('spec-contacts').innerHTML = 'Không giới hạn';
    
    // Cập nhật thông số màn hình và camera
    document.getElementById('spec-screen').innerHTML = d.screen || 'Chưa công bố';
    document.getElementById('spec-camera').innerHTML = d.camara || 'Chưa công bố';
    document.getElementById('spec-front-camera').innerHTML = d.camaraFront || 'Chưa công bố';
    
    // Cập nhật thông số pin
    document.getElementById('spec-battery').innerHTML = d.battery || 'Chưa công bố';
    
    // Cập nhật thông số thẻ nhớ
    document.getElementById('spec-memory-card').innerHTML = d.microUSB || 'Chưa công bố';
}

// Cập nhật đánh giá sản phẩm
function updateProductReviews() {
    // Cập nhật đánh giá tổng quan
    var rating = sanPhamHienTai.star;
    var totalReviews = sanPhamHienTai.rateCount;
    
    // Tính phân bố đánh giá
    var ratingDistribution = calculateRatingDistribution(rating, totalReviews);
    
    // Cập nhật các thanh đánh giá
    updateRatingBars(ratingDistribution);
}

// Tính phân bố đánh giá
function calculateRatingDistribution(avgRating, totalReviews) {
    var distribution = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    };
    
    if (totalReviews > 0) {
        // Giả lập phân bố dựa trên đánh giá trung bình
        var fiveStar = Math.floor(totalReviews * (avgRating / 5) * 0.8);
        var fourStar = Math.floor(totalReviews * (avgRating / 5) * 0.15);
        var threeStar = Math.floor(totalReviews * (avgRating / 5) * 0.03);
        var twoStar = Math.floor(totalReviews * (avgRating / 5) * 0.015);
        var oneStar = totalReviews - fiveStar - fourStar - threeStar - twoStar;
        
        distribution[5] = fiveStar;
        distribution[4] = fourStar;
        distribution[3] = threeStar;
        distribution[2] = twoStar;
        distribution[1] = oneStar;
    }
    
    return distribution;
}

// Cập nhật thanh đánh giá
function updateRatingBars(distribution) {
    var totalReviews = Object.values(distribution).reduce((a, b) => a + b, 0);
    
    for (var i = 5; i >= 1; i--) {
        var percentage = totalReviews > 0 ? (distribution[i] / totalReviews * 100).toFixed(1) : 0;
        var barFill = document.querySelectorAll('.rating-bar')[5 - i].querySelector('.bar-fill');
        var percentageSpan = document.querySelectorAll('.rating-bar')[5 - i].querySelector('.percentage');
        
        barFill.style.width = percentage + '%';
        percentageSpan.innerHTML = percentage + '%';
    }
}

// Cập nhật sản phẩm liên quan
function updateRelatedProducts() {
    // Tìm sản phẩm cùng hãng
    var relatedProduct = null;
    for (var p of list_products) {
        if (p.company === sanPhamHienTai.company && p.masp !== sanPhamHienTai.masp) {
            relatedProduct = p;
            break;
        }
    }
    
    if (relatedProduct) {
        document.getElementById('relatedImage').src = relatedProduct.img;
        document.getElementById('relatedName').innerHTML = relatedProduct.name;
        document.getElementById('relatedPrice').innerHTML = relatedProduct.price;
        
        // Giả lập ngày bảo hành
        var warrantyDate = new Date();
        warrantyDate.setFullYear(warrantyDate.getFullYear() + 1);
        document.getElementById('relatedWarranty').innerHTML = warrantyDate.toLocaleDateString('vi-VN');
    }
}

// Cập nhật sản phẩm đã xem
function updateRecentlyViewed() {
    document.getElementById('recentImage').src = sanPhamHienTai.img;
    document.getElementById('recentName').innerHTML = sanPhamHienTai.name;
    document.getElementById('recentPrice').innerHTML = sanPhamHienTai.price + '₫';
}

// Chi tiết khuyến mãi
function getDetailPromo(sp) {
    switch (sp.promo.name) {
        case 'tragop':
            var span = `<span style="font-weight: bold"> lãi suất ` + sp.promo.value + `% </span>`;
            return `Khách hàng có thể mua trả góp sản phẩm với ` + span + `với thời hạn 6 tháng kể từ khi mua hàng.`;

        case 'giamgia':
            var span = `<span style="font-weight: bold">` + sp.promo.value + `</span>`;
            return `Khách hàng sẽ được giảm ` + span + `₫ khi tới mua trực tiếp tại cửa hàng`;

        case 'moiramat':
            return `Khách hàng sẽ được thử máy miễn phí tại cửa hàng. Có thể đổi trả lỗi trong vòng 2 tháng.`;

        case 'giareonline':
            var del = stringToNum(sp.price) - stringToNum(sp.promo.value);
            var span = `<span style="font-weight: bold">` + numToString(del) + `</span>`;
            return `Sản phẩm sẽ được giảm ` + span + `₫ khi mua hàng online bằng thẻ VPBank hoặc tin nhắn SMS`;

        default:
            var span = `<span style="font-weight: bold">61 xe Wave Alpha</span>`;
            return `Cơ hội trúng ` + span + ` khi trả góp Home Credit`;
    }
}

function addThongSo(ten, giatri) {
    return `<li>
                <p>` + ten + `</p>
                <div>` + giatri + `</div>
            </li>`;
}

// add hình
function addSmallImg(img) {
    var newDiv = `<div class='item'>
                        <a>
                            <img src=` + img + ` onclick="changepic(this.src)">
                        </a>
                    </div>`;
    var banner = document.getElementsByClassName('owl-carousel')[0];
    banner.innerHTML += newDiv;
}

// đóng mở xem hình
function opencertain() {
    document.getElementById("overlaycertainimg").style.display = "block";
    setTimeout(() => {
        document.getElementById("overlaycertainimg").classList.add("show");
    }, 10);
}

function closecertain() {
    document.getElementById("overlaycertainimg").classList.remove("show");
    setTimeout(() => {
        document.getElementById("overlaycertainimg").style.display = "none";
    }, 300);
}

// đổi hình trong chế độ xem hình
function changepic(src) {
    document.getElementById("bigimg").src = src;
}

// Thêm sản phẩm vào các khung sản phẩm
function addKhungSanPham(list_sanpham, tenKhung, color, ele) {
	// convert color to code
	var gradient = `background-image: linear-gradient(120deg, ` + color[0] + ` 0%, ` + color[1] + ` 50%, ` + color[0] + ` 100%);`
	var borderColor = `border-color: ` + color[0];
	var borderA = `	border-left: 2px solid ` + color[0] + `;
					border-right: 2px solid ` + color[0] + `;`;

	// mở tag
	var s = `<div class="khungSanPham" style="` + borderColor + `">
				<h3 class="tenKhung" style="` + gradient + `">* ` + tenKhung + ` *</h3>
				<div class="listSpTrongKhung flexContain">`;

	for (var i = 0; i < list_sanpham.length; i++) {
		s += addProduct(list_sanpham[i], null, true);
		// truyền vào 'true' để trả về chuỗi rồi gán vào s
	}

	// thêm khung vào contain-khung
	ele.innerHTML += s;
}

/// gợi ý sản phẩm
function suggestion(){
    // ====== Lay ra thong tin san pham hien tai ====== 
    const giaSanPhamHienTai = stringToNum(sanPhamHienTai.price);

    // ====== Tìm các sản phẩm tương tự theo tiêu chí ====== 
    const sanPhamTuongTu = list_products
    // Lọc sản phẩm trùng
    .filter((_) => _.masp !== sanPhamHienTai.masp)
    // Tính điểm cho từng sản phẩm
    .map(sanPham => {
        // Tiêu chí 1: giá sản phẩm ko lệch nhau quá 1 triệu
        const giaSanPham = stringToNum(sanPham.price);
        let giaTienGanGiong = Math.abs(giaSanPham - giaSanPhamHienTai) < 1000000;

        // Tiêu chí 2: các thông số kỹ thuật giống nhau
        let soLuongChiTietGiongNhau = 0;
        for(let key in sanPham.detail) {
            let value = sanPham.detail[key];
            let currentValue = sanPhamHienTai.detail[key];

            if(value == currentValue) soLuongChiTietGiongNhau++;
        }
        let giongThongSoKyThuat  = soLuongChiTietGiongNhau >= 3;

        // Tiêu chí 3: cùng hãng sản xuất 
        let cungHangSanXuat = sanPham.company ===  sanPhamHienTai.company

        // Tiêu chí 4: cùng loại khuyến mãi
        let cungLoaiKhuyenMai = sanPham.promo?.name === sanPhamHienTai.promo?.name;
        
        // Tiêu chí 5: có đánh giá, số sao
        let soDanhGia = Number.parseInt(sanPham.rateCount, 10)
        let soSao = Number.parseInt(sanPham.star, 10);

        // Tính điểm cho sản phẩm này (càng thoả nhiều tiêu chí điểm càng cao => càng nên gợi ý)
        let diem = 0;
        if(giaTienGanGiong) diem += 20;
        if(giongThongSoKyThuat) diem += soLuongChiTietGiongNhau;
        if(cungHangSanXuat) diem += 15;
        if(cungLoaiKhuyenMai) diem += 10;
        if(soDanhGia > 0) diem += (soDanhGia + '').length;
        diem += soSao;

        // Thêm thuộc tính diem vào dữ liệu trả về
        return {
            ...sanPham,
            diem: diem
        };
    })
    // Sắp xếp theo số điểm cao xuống thấp
    .sort((a,b) => b.diem - a.diem)
    // Lấy ra 10 sản phẩm đầu tiên
    .slice(0, 10);

    console.log(sanPhamTuongTu)

    // ====== Hiển thị 5 sản phẩm lên web ====== 
    if(sanPhamTuongTu.length) {
        let div = document.getElementById('goiYSanPham');
        addKhungSanPham(sanPhamTuongTu, 'Bạn có thể thích', ['#434aa8', '#ec1f1f'], div);
    }
}