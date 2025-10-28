document.addEventListener('DOMContentLoaded', () => {
    const DB_KEY = 'baedal_app_data_v4_kyochon_pixel_perfect';

    // Type definitions
    interface StoreInfo {
        name: string;
        heroImages: string[];
        homeScreenImage: string;
        promoBannerMain: string;
        rating: number;
        reviewCount: number;
        badges: string[];
        minOrder: string;
        thriftyDeliveryTag: string;
        promoDeliveryText: string;
        originalDeliveryFee: string;
        operationStatus: string;
        couponInfoText: string;
        address: string;
        hours: string;
        holidays: string;
        phone: string;
        facilities: string;
        introText: string;
        introImages: string[];
    }

    interface MenuItem { id: number; categoryId: string; name: string; tags: string[]; description: string; price: string; reviews: string | null; image: string; options?: string; }
    interface MenuCategory { id: string; name: string; }
    interface AppData { storeInfo: StoreInfo; menu: MenuItem[]; categories: MenuCategory[]; }
    
    let activeCategoryId: string | null = null;
    let editingCategoryId: string | null = null;
    let currentView: 'home' | 'customer' | 'admin' | 'store-info' | 'menu-detail' = 'home';
    let slideInterval: ReturnType<typeof setInterval> | null = null;
    let currentSlideIndex = 0;

    const homeView = document.getElementById('home-view') as HTMLElement;
    const customerView = document.getElementById('customer-view') as HTMLElement;
    const adminView = document.getElementById('admin-view') as HTMLElement;
    const storeInfoView = document.getElementById('store-info-view') as HTMLElement;
    const menuDetailView = document.getElementById('menu-detail-view') as HTMLElement;
    const viewToggleBtn = document.getElementById('view-toggle-btn') as HTMLButtonElement;
    
    const homeImageContainer = document.getElementById('home-image-container') as HTMLElement;
    const chickenCategoryBtn = document.getElementById('clickable-chicken-area') as HTMLElement;
    const backToHomeBtn = document.getElementById('back-to-home-btn') as HTMLElement;
    const storeInfoLink = document.getElementById('store-info-link') as HTMLElement;
    const backToCustomerBtn = document.getElementById('back-to-customer-btn') as HTMLElement;
    const backToCustomerFromDetailBtn = document.getElementById('back-to-customer-from-detail-btn') as HTMLElement;


    // --- DOM ELEMENTS (Customer View - PIXEL PERFECT) ---
    const storeNameHeader = document.getElementById('store-name-header') as HTMLElement;
    const slidesContainer = document.getElementById('slides-container') as HTMLElement;
    const slideDotsContainer = document.getElementById('slide-dots') as HTMLElement;
    const promoBannerMain = document.getElementById('promo-banner-main') as HTMLElement;
    const storeNameMain = document.getElementById('store-name-main') as HTMLElement;
    const storeRatingDisplay = document.getElementById('store-rating-display') as HTMLElement;
    const storeBadges = document.getElementById('store-badges') as HTMLElement;
    const minOrderDisplay = document.getElementById('min-order-display') as HTMLElement;
    const thriftyDeliveryTag = document.getElementById('thrifty-delivery-tag') as HTMLElement;
    const promoDeliveryText = document.getElementById('promo-delivery-text') as HTMLElement;
    const originalDeliveryFee = document.getElementById('original-delivery-fee') as HTMLElement;
    const operationStatus = document.getElementById('operation-status') as HTMLElement;
    const couponBanner = document.getElementById('coupon-banner') as HTMLElement;
    const menuTabsContainer = document.getElementById('menu-tabs-container') as HTMLElement;
    const mainMenuList = document.getElementById('main-menu-list') as HTMLElement;

    // --- DOM ELEMENTS (Store Info View) ---
    const infoListSection = document.getElementById('info-list-section') as HTMLElement;
    const storePhotoGrid = document.getElementById('store-photo-grid') as HTMLElement;
    const storeIntroText = document.getElementById('store-intro-text') as HTMLElement;

    // --- DOM ELEMENTS (Menu Detail View) ---
    const detailMenuImage = document.getElementById('detail-menu-image') as HTMLImageElement;
    const detailMenuName = document.getElementById('detail-menu-name') as HTMLElement;
    const detailMenuDescription = document.getElementById('detail-menu-description') as HTMLElement;
    const detailMenuPrice = document.getElementById('detail-menu-price') as HTMLElement;
    const detailMenuOptionsContainer = document.getElementById('detail-menu-options-container') as HTMLElement;
    const footerTotalPrice = document.getElementById('footer-total-price') as HTMLElement;


    // --- DOM ELEMENTS (Admin View - PIXEL PERFECT) ---
    const downloadDataBtn = document.getElementById('download-data-btn') as HTMLButtonElement;
    const importDataBtn = document.getElementById('import-data-btn') as HTMLButtonElement;
    const importDataInput = document.getElementById('import-data-input') as HTMLInputElement;
    const storeInfoForm = document.getElementById('store-info-form') as HTMLFormElement;
    const adminHomeImageDropzone = document.getElementById('admin-home-image-dropzone') as HTMLElement;
    const adminStoreName = document.getElementById('admin-store-name') as HTMLInputElement;
    const adminHeroImageDropzones = [
        document.getElementById('admin-hero-image-dropzone-1') as HTMLElement,
        document.getElementById('admin-hero-image-dropzone-2') as HTMLElement,
        document.getElementById('admin-hero-image-dropzone-3') as HTMLElement,
    ];
    const adminPromoBannerMain = document.getElementById('admin-promo-banner-main') as HTMLInputElement;
    const adminRating = document.getElementById('admin-rating') as HTMLInputElement;
    const adminReviewCount = document.getElementById('admin-review-count') as HTMLInputElement;
    const adminBadges = document.getElementById('admin-badges') as HTMLInputElement;
    const adminMinOrder = document.getElementById('admin-min-order') as HTMLInputElement;
    const adminThriftyDeliveryTag = document.getElementById('admin-thrifty-delivery-tag') as HTMLInputElement;
    const adminPromoDeliveryText = document.getElementById('admin-promo-delivery-text') as HTMLInputElement;
    const adminOriginalDeliveryFee = document.getElementById('admin-original-delivery-fee') as HTMLInputElement;
    const adminOperationStatus = document.getElementById('admin-operation-status') as HTMLInputElement;
    const adminCouponBanner = document.getElementById('admin-coupon-banner') as HTMLInputElement;
    
    const storeDetailsForm = document.getElementById('store-details-form') as HTMLFormElement;
    const adminAddress = document.getElementById('admin-address') as HTMLInputElement;
    const adminHours = document.getElementById('admin-hours') as HTMLInputElement;
    const adminHolidays = document.getElementById('admin-holidays') as HTMLInputElement;
    const adminPhone = document.getElementById('admin-phone') as HTMLInputElement;
    const adminFacilities = document.getElementById('admin-facilities') as HTMLInputElement;
    const adminIntroText = document.getElementById('admin-intro-text') as HTMLTextAreaElement;
    const adminIntroImageDropzones = [
        document.getElementById('admin-intro-image-1') as HTMLElement,
        document.getElementById('admin-intro-image-2') as HTMLElement,
        document.getElementById('admin-intro-image-3') as HTMLElement,
        document.getElementById('admin-intro-image-4') as HTMLElement
    ];

    const categoryForm = document.getElementById('category-form') as HTMLFormElement;
    const newCategoryNameInput = document.getElementById('admin-new-category-name') as HTMLInputElement;
    const adminCategoryListContainer = document.getElementById('admin-category-list-container') as HTMLElement;

    const menuItemForm = document.getElementById('menu-item-form') as HTMLFormElement;
    const adminMenuId = document.getElementById('admin-menu-id') as HTMLInputElement;
    const adminMenuCategory = document.getElementById('admin-menu-category') as HTMLSelectElement;
    const adminMenuName = document.getElementById('admin-menu-name') as HTMLInputElement;
    const adminMenuTags = document.getElementById('admin-menu-tags') as HTMLInputElement;
    const adminMenuDescription = document.getElementById('admin-menu-description') as HTMLTextAreaElement;
    const adminMenuPrice = document.getElementById('admin-menu-price') as HTMLInputElement;
    const adminMenuReviews = document.getElementById('admin-menu-reviews') as HTMLInputElement;
    const adminMenuOptions = document.getElementById('admin-menu-options') as HTMLTextAreaElement;
    const adminMenuImageDropzone = document.getElementById('admin-menu-image-dropzone') as HTMLElement;
    const adminMenuSubmitBtn = document.getElementById('admin-menu-submit-btn') as HTMLButtonElement;
    const adminMenuClearBtn = document.getElementById('admin-menu-clear-btn') as HTMLButtonElement;
    const adminMenuListContainer = document.getElementById('admin-menu-list-container') as HTMLElement;

    const initialData: AppData = {
        storeInfo: {
            name: "교촌치킨 산본1호점",
            heroImages: ["https://i.ibb.co/LQr9xKx/kyochon-hero-1.jpg", "https://i.ibb.co/hK2V47h/kyochon-hero-2.jpg", "https://i.ibb.co/qY5JcBD/kyochon-hero-3.jpg"],
            homeScreenImage: "https://i.ibb.co/bF9m2p6/baemin-home.png",
            promoBannerMain: "무료배달X5회 혜택",
            rating: 4.7, reviewCount: 88,
            badges: ["소비쿠폰", "식약처 위생인증", "세스코 멤버스"],
            minOrder: "19,000원",
            thriftyDeliveryTag: "가장 저렴해요",
            promoDeliveryText: "첫주문 무료배달",
            originalDeliveryFee: "1,900원",
            operationStatus: "오늘 오후 12:00 오픈",
            couponInfoText: "소비쿠폰은 가게배달 및 만나서 카드 결제 시 사용 가능",
            address: "경기도 군포시 고산로 515 GS휘트니스클럽빌딩 1층 102호(산본동)",
            hours: "매일 - 오후 12:00 ~ 밤 12:00", holidays: "연중무휴", phone: "050-7538-6538",
            facilities: "주차, 무선 인터넷",
            introText: "안녕하세요! 고객님~ 교촌 산본 1호점입니다.\n고객님들의 만족을 위해 최선을 다하고 있습니다.",
            introImages: ["https://i.ibb.co/W2N2K2z/kyochon-intro-1.jpg", "https://i.ibb.co/wJMyMhB/kyochon-intro-2.jpg", "https://i.ibb.co/z5wF2Mh/kyochon-intro-3.jpg", "https://i.ibb.co/FqsxXN3/kyochon-intro-4.jpg"]
        },
        categories: [{ id: 'popular', name: '인기 메뉴' }, { id: 'side', name: '사이드 메뉴' }],
        menu: [ { id: 1, categoryId: 'popular', name: '허니갈릭순살', tags: [], description: '꿀의 달콤함과 마늘의 알싸함이 조화로운 순살치킨(안심, 정육)', price: '26,000원', reviews: '150', image: 'https://i.ibb.co/gR3d25R/kyochon-detail-menu.jpg', options: '음료추가|max_4\n콜라 245ml,1000\n콜라 355ml,1500\n콜라 500ml,2000\n콜라 1.25L,2500\n추가선택|max_5\n치킨무,1000\n양념소스,500\n머스타드소스,500' } ]
    };

    let appData: AppData;
    function loadData() {
        const savedData = localStorage.getItem(DB_KEY);
        appData = savedData ? JSON.parse(savedData) as AppData : JSON.parse(JSON.stringify(initialData));
        activeCategoryId = appData.categories.length > 0 ? appData.categories[0].id : null;
    }
    function saveData() {
        try { localStorage.setItem(DB_KEY, JSON.stringify(appData)); } catch (e) {
            console.error("Error saving data", e);
            alert("데이터 저장 실패. 이미지 파일이 너무 클 수 있습니다.");
        }
    }

    function parsePrice(priceStr: string | null | undefined): number {
        if (!priceStr) return 0;
        return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
    }
    
    function showView(viewName: 'home' | 'customer' | 'admin' | 'store-info' | 'menu-detail') {
        currentView = viewName;
        [homeView, customerView, adminView, storeInfoView, menuDetailView].forEach(v => v.classList.add('hidden'));
        stopCarousel();

        let viewToShow: HTMLElement;
        switch(viewName) {
            case 'home': viewToShow = homeView; viewToggleBtn.textContent = '⚙️'; break;
            case 'customer': viewToShow = customerView; viewToggleBtn.textContent = '⚙️'; startCarousel(); break;
            case 'admin': viewToShow = adminView; viewToggleBtn.textContent = '🏠'; break;
            case 'store-info': viewToShow = storeInfoView; viewToggleBtn.textContent = '⚙️'; break;
            case 'menu-detail': viewToShow = menuDetailView; viewToggleBtn.textContent = '⚙️'; break;
        }
        viewToShow.classList.remove('hidden');
    }

    function startCarousel() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            currentSlideIndex = (currentSlideIndex + 1) % appData.storeInfo.heroImages.length;
            renderCarousel();
        }, 3000);
    }
    function stopCarousel() { if (slideInterval) clearInterval(slideInterval); slideInterval = null; }
    function renderCarousel() {
        slidesContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        const dots = slideDotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => { dot.classList.toggle('active', index === currentSlideIndex); });
    }

    function render() {
        renderHomeView();
        renderCustomerView();
        renderStoreInfoView();
        renderAdminView();
    }
    
    function renderHomeView() { homeImageContainer.style.backgroundImage = `url('${appData.storeInfo.homeScreenImage}')`; }

    function renderCustomerView() {
        const { storeInfo, menu, categories } = appData;
        storeNameHeader.textContent = storeInfo.name;
        slidesContainer.innerHTML = storeInfo.heroImages.map(src => `<img src="${src}" class="slide">`).join('');
        slideDotsContainer.innerHTML = storeInfo.heroImages.map((_, index) => `<div class="dot ${index === 0 ? 'active' : ''}"></div>`).join('');
        renderCarousel();

        promoBannerMain.textContent = storeInfo.promoBannerMain;
        storeNameMain.textContent = storeInfo.name;
        storeRatingDisplay.innerHTML = `<span class="stars">★</span> ${storeInfo.rating} (${storeInfo.reviewCount}) >`;
        storeBadges.innerHTML = storeInfo.badges.map(b => `<span class="store-badge">${b}</span>`).join('·');
        minOrderDisplay.textContent = storeInfo.minOrder;
        thriftyDeliveryTag.textContent = storeInfo.thriftyDeliveryTag;
        promoDeliveryText.textContent = storeInfo.promoDeliveryText;
        originalDeliveryFee.textContent = storeInfo.originalDeliveryFee;
        operationStatus.textContent = storeInfo.operationStatus;
        couponBanner.textContent = storeInfo.couponInfoText;
        
        menuTabsContainer.innerHTML = categories.map(cat => `
            <button class="menu-tab ${cat.id === activeCategoryId ? 'active' : ''}" data-category-id="${cat.id}">${cat.name}</button>
        `).join('');

        const filteredMenu = menu.filter(item => item.categoryId === activeCategoryId);
        mainMenuList.innerHTML = filteredMenu.length > 0 ? filteredMenu.map(createMenuItemHTML).join('') : '<p>메뉴가 없습니다.</p>';
    }

    function renderStoreInfoView() {
        const { address, hours, holidays, phone, facilities, introText, introImages } = appData.storeInfo;
        infoListSection.innerHTML = `
            <div class="info-list-item"><span class="label">주소</span><span class="value">${address}</span></div>
            <div class="info-list-item"><span class="label">운영시간</span><span class="value">${hours}</span></div>
            <div class="info-list-item"><span class="label">휴무일</span><span class="value">${holidays}</span></div>
            <div class="info-list-item"><span class="label">전화번호</span><span class="value">${phone}</span></div>
            <div class="info-list-item"><span class="label">편의시설</span><span class="value">${facilities}</span></div>`;
        storePhotoGrid.innerHTML = introImages.map(src => `<img src="${src}" alt="가게 소개 사진">`).join('');
        storeIntroText.innerText = introText;
    }

    function renderMenuDetailView(item: MenuItem) {
        detailMenuImage.src = item.image;
        detailMenuName.textContent = item.name;
        detailMenuDescription.textContent = item.description;
        detailMenuPrice.textContent = item.price;
        
        const basePrice = parsePrice(item.price);
        footerTotalPrice.textContent = `${basePrice.toLocaleString()}원`;

        detailMenuOptionsContainer.innerHTML = ''; // Clear previous options
        if (item.options) {
            const groups = item.options.split('\n').filter(line => line.trim() !== '');
            let currentGroup: { element: HTMLElement; max: number | null } | null = null;
    
            groups.forEach(line => {
                const lastCommaIndex = line.lastIndexOf(',');
                
                // An option line has a name and a price separated by the *last* comma.
                if (lastCommaIndex > 0) { // It's an option item. `> 0` ensures there's a name before the comma.
                    if (currentGroup) {
                        const name = line.substring(0, lastCommaIndex).trim();
                        const priceStr = line.substring(lastCommaIndex + 1).trim();
                        const price = parsePrice(priceStr);
                        const optionId = `option-${Date.now()}-${Math.random()}`;
                        const formattedPrice = `+${price.toLocaleString()}원`;
                        const optionHTML = `
                            <div class="option-item">
                                <input type="checkbox" id="${optionId}" data-price="${price}">
                                <label for="${optionId}">
                                    <span class="option-name">${name}</span>
                                    <span class="option-price">${formattedPrice}</span>
                                </label>
                            </div>`;
                        currentGroup.element.innerHTML += optionHTML;
                    }
                } else { // This is a group title
                    if (currentGroup) {
                        detailMenuOptionsContainer.appendChild(currentGroup.element);
                        detailMenuOptionsContainer.insertAdjacentHTML('beforeend', '<div class="divider thick"></div>');
                    }
                    
                    let groupTitle = line;
                    let maxSelection: number | null = null;
                    if (line.includes('|max_')) {
                        const parts = line.split('|max_');
                        groupTitle = parts[0];
                        maxSelection = parseInt(parts[1], 10);
                    }
    
                    const groupElement = document.createElement('div');
                    groupElement.className = 'options-group';
                    if (maxSelection) {
                        groupElement.dataset.maxSelection = String(maxSelection);
                    }
    
                    groupElement.innerHTML = `
                        <div class="options-group-header">
                            <h3 class="options-group-title">${groupTitle}</h3>
                            ${maxSelection ? `<span class="max-selection-badge">최대 ${maxSelection}개 선택</span>` : ''}
                        </div>`;
                    currentGroup = { element: groupElement, max: maxSelection };
                }
            });
    
            if (currentGroup) {
                detailMenuOptionsContainer.appendChild(currentGroup.element);
                 detailMenuOptionsContainer.insertAdjacentHTML('beforeend', '<div class="divider thick"></div>');
            }
        }
    }


    function createMenuItemHTML(item: MenuItem) { return `
            <div class="menu-item" data-menu-id="${item.id}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <span class="price">${item.price}</span>
                </div>
                <div class="item-visual"><img src="${item.image}" alt="${item.name}"></div>
            </div>`; 
    }

    function renderAdminView() {
        const { storeInfo } = appData;
        updateImagePreview(adminHomeImageDropzone, storeInfo.homeScreenImage);
        adminStoreName.value = storeInfo.name;
        storeInfo.heroImages.forEach((src, i) => { if (adminHeroImageDropzones[i]) updateImagePreview(adminHeroImageDropzones[i], src); });
        adminPromoBannerMain.value = storeInfo.promoBannerMain;
        adminRating.value = String(storeInfo.rating);
        adminReviewCount.value = String(storeInfo.reviewCount);
        adminBadges.value = storeInfo.badges.join(', ');
        adminMinOrder.value = storeInfo.minOrder;
        adminThriftyDeliveryTag.value = storeInfo.thriftyDeliveryTag;
        adminPromoDeliveryText.value = storeInfo.promoDeliveryText;
        adminOriginalDeliveryFee.value = storeInfo.originalDeliveryFee;
        adminOperationStatus.value = storeInfo.operationStatus;
        adminCouponBanner.value = storeInfo.couponInfoText;
        
        adminAddress.value = storeInfo.address;
        adminHours.value = storeInfo.hours;
        adminHolidays.value = storeInfo.holidays;
        adminPhone.value = storeInfo.phone;
        adminFacilities.value = storeInfo.facilities;
        adminIntroText.value = storeInfo.introText;
        storeInfo.introImages.forEach((src, i) => { if (adminIntroImageDropzones[i]) updateImagePreview(adminIntroImageDropzones[i], src); });
        
        renderAdminCategoryList();
        renderMenuCategoryDropdown();
        adminMenuListContainer.innerHTML = appData.menu.map(createAdminMenuItemHTML).join('');
    }

    function renderAdminCategoryList() {
        adminCategoryListContainer.innerHTML = appData.categories.map(cat => {
            if (cat.id === editingCategoryId) { return `
                <div class="admin-category-item">
                    <input type="text" class="edit-category-input" value="${cat.name}" data-id="${cat.id}">
                    <button class="save-category-btn" data-id="${cat.id}">저장</button>
                    <button class="cancel-edit-category-btn" data-id="${cat.id}">취소</button>
                </div>`;
            }
            return `
                <div class="admin-category-item">
                    <span>${cat.name}</span>
                    <div>
                        <button class="edit-category-btn" data-id="${cat.id}">수정</button>
                        <button class="delete-category-btn" data-id="${cat.id}">삭제</button>
                    </div>
                </div>`;
        }).join('');
     }
    function renderMenuCategoryDropdown() {
        adminMenuCategory.innerHTML = appData.categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    }
    function createAdminMenuItemHTML(item: MenuItem) { 
        const categoryName = appData.categories.find(c => c.id === item.categoryId)?.name || 'N/A';
        return `
            <div class="admin-menu-item">
                <div class="admin-menu-item-info">
                    <strong>${item.name}</strong>
                    <span>${categoryName} | ${item.price}</span>
                </div>
                <div class="admin-menu-item-actions">
                    <button class="edit-btn" data-id="${item.id}">수정</button>
                    <button class="delete-btn" data-id="${item.id}">삭제</button>
                </div>
            </div>`;
    }

    function setupImageUploader(dropZoneElement: HTMLElement) {
        const inputElement = dropZoneElement.querySelector('.image-input-hidden') as HTMLInputElement;
        dropZoneElement.addEventListener('click', () => inputElement.click());
        dropZoneElement.addEventListener('dragover', (e) => { e.preventDefault(); dropZoneElement.classList.add('dragover'); });
        dropZoneElement.addEventListener('dragleave', () => { dropZoneElement.classList.remove('dragover'); });
        dropZoneElement.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZoneElement.classList.remove('dragover');
            const files = e.dataTransfer?.files;
            if (files && files.length > 0) handleFile(files[0], dropZoneElement);
        });
        inputElement.addEventListener('change', (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) handleFile(files[0], dropZoneElement);
        });
     }
    function handleFile(file: File, dropZoneElement: HTMLElement) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => updateImagePreview(dropZoneElement, reader.result as string);
            reader.readAsDataURL(file);
        } else {
            alert('이미지 파일만 업로드 가능합니다.');
        }
     }
    function updateImagePreview(dropZoneElement: HTMLElement, src: string) {
        const previewElement = dropZoneElement.querySelector('.image-preview') as HTMLImageElement;
        if (src) {
            previewElement.src = src;
            previewElement.classList.add('has-image');
            dropZoneElement.classList.add('has-image');
        } else {
            previewElement.src = '';
            previewElement.classList.remove('has-image');
            dropZoneElement.classList.remove('has-image');
        }
    }
    
    viewToggleBtn.addEventListener('click', () => { currentView === 'admin' ? showView('home') : showView('admin'); });
    chickenCategoryBtn.addEventListener('click', (e) => { e.preventDefault(); showView('customer'); });
    backToHomeBtn.addEventListener('click', () => showView('home'));
    storeInfoLink.addEventListener('click', () => showView('store-info'));
    backToCustomerBtn.addEventListener('click', () => showView('customer'));
    backToCustomerFromDetailBtn.addEventListener('click', () => showView('customer'));

    downloadDataBtn.addEventListener('click', () => {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `baedal_app_data_${timestamp}.json`;
            const dataStr = JSON.stringify(appData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('데이터 다운로드가 시작됩니다.');
        } catch (error) {
            console.error('Failed to download data:', error);
            alert('데이터 다운로드에 실패했습니다. 콘솔을 확인해주세요.');
        }
    });

    importDataBtn.addEventListener('click', () => importDataInput.click());
    
    function handleDataImport(e: Event) {
        const input = e.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) { return; }
        const file = input.files[0];
        if (file.type !== 'application/json') {
            alert('JSON 파일만 업로드할 수 있습니다.');
            input.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                if (!text) { throw new Error("파일을 읽을 수 없습니다."); }
                const importedData = JSON.parse(text);

                if (!importedData.storeInfo || !importedData.menu || !importedData.categories) {
                    throw new Error("유효하지 않은 데이터 파일 형식입니다.");
                }

                appData = importedData as AppData;
                saveData();
                activeCategoryId = appData.categories.length > 0 ? appData.categories[0].id : null;
                editingCategoryId = null;
                currentSlideIndex = 0;
                
                render();
                alert('데이터를 성공적으로 불러왔습니다!');

            } catch (error) {
                console.error("데이터 불러오기 실패:", error);
                alert(`데이터를 불러오는데 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
            } finally {
                input.value = '';
            }
        };
        reader.onerror = () => {
             alert('파일을 읽는 중 오류가 발생했습니다.');
             input.value = '';
        }
        reader.readAsText(file);
    }
    importDataInput.addEventListener('change', handleDataImport);

    storeInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const info = appData.storeInfo;
        info.homeScreenImage = (adminHomeImageDropzone.querySelector('.image-preview') as HTMLImageElement).src;
        info.name = adminStoreName.value;
        info.heroImages = adminHeroImageDropzones.map(el => (el.querySelector('.image-preview') as HTMLImageElement).src).filter(Boolean);
        info.promoBannerMain = adminPromoBannerMain.value;
        info.rating = parseFloat(adminRating.value);
        info.reviewCount = parseInt(adminReviewCount.value);
        info.badges = adminBadges.value.split(',').map(b => b.trim()).filter(Boolean);
        info.minOrder = adminMinOrder.value;
        info.thriftyDeliveryTag = adminThriftyDeliveryTag.value;
        info.promoDeliveryText = adminPromoDeliveryText.value;
        info.originalDeliveryFee = adminOriginalDeliveryFee.value;
        info.operationStatus = adminOperationStatus.value;
        info.couponInfoText = adminCouponBanner.value;
        saveData();
        render();
        alert('가게 정보가 저장되었습니다.');
    });

    storeDetailsForm.addEventListener('submit', e => {
        e.preventDefault();
        const info = appData.storeInfo;
        info.address = adminAddress.value;
        info.hours = adminHours.value;
        info.holidays = adminHolidays.value;
        info.phone = adminPhone.value;
        info.facilities = adminFacilities.value;
        info.introText = adminIntroText.value;
        info.introImages = adminIntroImageDropzones.map(el => (el.querySelector('.image-preview') as HTMLImageElement).src).filter(Boolean);
        saveData();
        render();
        alert('가게 상세 정보가 저장되었습니다.');
    });

    categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = newCategoryNameInput.value.trim();
        if (newName) {
            appData.categories.push({ id: `cat_${Date.now()}`, name: newName });
            saveData();
            render();
            newCategoryNameInput.value = '';
        }
    });

    adminCategoryListContainer.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        const id = target.dataset.id;
        if (!id) return;

        if (target.classList.contains('delete-category-btn')) {
             if (appData.categories.length <= 1) { alert('최소 한 개의 카테고리는 남겨두어야 합니다.'); return; }
            if (confirm(`카테고리를 삭제하시겠습니까? 이 카테고리의 메뉴들은 첫번째 카테고리로 이동됩니다.`)) {
                const firstCategoryId = appData.categories[0].id;
                appData.menu.forEach(item => { if (item.categoryId === id) item.categoryId = firstCategoryId; });
                appData.categories = appData.categories.filter(cat => cat.id !== id);
                if (activeCategoryId === id) activeCategoryId = firstCategoryId;
                saveData();
                render();
            }
        }
        if (target.classList.contains('edit-category-btn')) { editingCategoryId = id; renderAdminCategoryList(); }
        if (target.classList.contains('cancel-edit-category-btn')) { editingCategoryId = null; renderAdminCategoryList(); }
        if (target.classList.contains('save-category-btn')) {
            const inputEl = adminCategoryListContainer.querySelector(`.edit-category-input[data-id="${id}"]`) as HTMLInputElement;
            const category = appData.categories.find(c => c.id === id);
            if (category) category.name = inputEl.value.trim();
            editingCategoryId = null;
            saveData();
            render();
        }
    });

    menuItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = adminMenuId.value ? parseInt(adminMenuId.value) : Date.now();
        const newItem: MenuItem = {
            id: id,
            categoryId: adminMenuCategory.value,
            name: adminMenuName.value,
            tags: adminMenuTags.value.split(',').map(t => t.trim()).filter(Boolean),
            description: adminMenuDescription.value,
            price: adminMenuPrice.value,
            reviews: adminMenuReviews.value || null,
            image: (adminMenuImageDropzone.querySelector('.image-preview') as HTMLImageElement).src,
            options: adminMenuOptions.value
        };
        const existingIndex = appData.menu.findIndex(item => item.id === id);
        if (existingIndex > -1) appData.menu[existingIndex] = newItem; else appData.menu.push(newItem);
        saveData();
        render();
        clearMenuForm();
    });

    adminMenuClearBtn.addEventListener('click', clearMenuForm);
    function clearMenuForm() {
        menuItemForm.reset();
        adminMenuId.value = '';
        updateImagePreview(adminMenuImageDropzone, '');
        adminMenuSubmitBtn.textContent = '메뉴 추가';
    }
    
    adminMenuListContainer.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const id = target.dataset.id ? parseInt(target.dataset.id) : null;
        if (!id) return;
        if (target.classList.contains('delete-btn')) {
            if (confirm('메뉴를 삭제하시겠습니까?')) {
                appData.menu = appData.menu.filter(item => item.id !== id);
                saveData();
                render();
            }
        }
        if (target.classList.contains('edit-btn')) {
            const itemToEdit = appData.menu.find(item => item.id === id);
            if (itemToEdit) {
                adminMenuId.value = String(itemToEdit.id);
                adminMenuCategory.value = itemToEdit.categoryId;
                adminMenuName.value = itemToEdit.name;
                adminMenuTags.value = itemToEdit.tags.join(', ');
                adminMenuDescription.value = itemToEdit.description;
                adminMenuPrice.value = itemToEdit.price;
                adminMenuReviews.value = itemToEdit.reviews || '';
                adminMenuOptions.value = itemToEdit.options || '';
                updateImagePreview(adminMenuImageDropzone, itemToEdit.image);
                adminMenuSubmitBtn.textContent = '메뉴 수정';
                menuItemForm.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    menuTabsContainer.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const categoryId = target.dataset.categoryId;
        if (categoryId) { activeCategoryId = categoryId; renderCustomerView(); }
    });
    
    mainMenuList.addEventListener('click', (e) => {
        const menuItemEl = (e.target as HTMLElement).closest<HTMLElement>('.menu-item');
        if (menuItemEl && menuItemEl.dataset.menuId) {
            const menuId = parseInt(menuItemEl.dataset.menuId);
            const item = appData.menu.find(m => m.id === menuId);
            if (item) {
                renderMenuDetailView(item);
                showView('menu-detail');
            }
        }
    });

    detailMenuOptionsContainer.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.type !== 'checkbox') return;
    
        const group = target.closest<HTMLElement>('.options-group');
        if (group && group.dataset.maxSelection) {
            const max = parseInt(group.dataset.maxSelection, 10);
            const checkboxes = group.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        
            if (checkedCount > max) {
                target.checked = false;
                 // Price will not be updated if selection is invalid
                return;
            }
        }
    
        // Recalculate total price
        const basePrice = parsePrice(detailMenuPrice.textContent);
        let optionsPrice = 0;
        const checkedOptions = detailMenuOptionsContainer.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked');
        
        checkedOptions.forEach(checkbox => {
            optionsPrice += parseInt(checkbox.dataset.price || '0', 10);
        });
    
        const totalPrice = basePrice + optionsPrice;
        footerTotalPrice.textContent = `${totalPrice.toLocaleString()}원`;
    });

    loadData();
    if (!localStorage.getItem(DB_KEY)) {
        saveData();
    }
    render();
    showView('home');

    setupImageUploader(adminHomeImageDropzone);
    adminHeroImageDropzones.forEach(setupImageUploader);
    adminIntroImageDropzones.forEach(setupImageUploader);
    setupImageUploader(adminMenuImageDropzone);
});