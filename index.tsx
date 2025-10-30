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
    originInfo: string;
}

interface MenuItem { id: number; categoryIds: string[]; name: string; tags: string[]; description: string; price: string; reviews: string | null; image: string; options?: string; }
interface MenuCategory { id:string; name: string; }
interface AppData { storeInfo: StoreInfo; menu: MenuItem[]; categories: MenuCategory[]; }

let activeCategoryId: string | null = null;
let editingCategoryId: string | null = null;
let adminSelectedCategoryIdForSort: string = 'all';
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
const storeExtraInfoSection = document.getElementById('store-extra-info-section') as HTMLElement;

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
const adminOriginInfo = document.getElementById('admin-origin-info') as HTMLTextAreaElement;
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
const adminMenuCategoryCheckboxes = document.getElementById('admin-menu-category-checkboxes') as HTMLElement;
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
const adminMenuSortCategorySelect = document.getElementById('admin-menu-sort-category') as HTMLSelectElement;

const initialData: AppData = {
    storeInfo: {
        name: "딱마리치킨",
        heroImages: [
            "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=1000&auto=format&fit=crop", 
            "https://images.unsplash.com/photo-1626082910309-8ad1055f1345?q=80&w=1000&auto=format&fit=crop", 
            "https://images.unsplash.com/photo-1569058242253-92a9c5552db3?q=80&w=1000&auto=format&fit=crop"
        ],
        homeScreenImage: "https://user-images.githubusercontent.com/1259185/180232475-1f633512-6148-4853-858f-2d7f45f1642d.png",
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
        introImages: [
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop", 
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop", 
            "https://images.unsplash.com/photo-1585517176484-08c1d23f7c46?q=80&w=800&auto=format&fit=crop", 
            "https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=800&auto=format&fit=crop"
        ],
        originInfo: "닭고기 (뼈, 순살): 국내산\n쌀: 국내산\n배추김치 (배추, 고춧가루): 국내산"
    },
    categories: [
        { id: 'popular', name: '인기메뉴' }, 
        { id: 'fried', name: '후라이드' }, 
        { id: 'seasoned', name: '양념치킨' }, 
        { id: 'siseuning', name: '시즈닝' }, 
        { id: 'set', name: '세트메뉴' }, 
        { id: 'side', name: '사이드메뉴' }, 
        { id: 'all', name: '전메뉴' }
    ],
    menu: [ { id: 1, categoryIds: ['popular'], name: '허니갈릭순살', tags: [], description: '꿀의 달콤함과 마늘의 알싸함이 조화로운 순살치킨(안심, 정육)', price: '26,000원', reviews: '150', image: 'https://images.unsplash.com/photo-1604908176997-12c1b27d4928?q=80&w=600&auto=format&fit=crop', options: '음료추가|max_4\n콜라 245ml,1000\n콜라 355ml,1500\n콜라 500ml,2000\n콜라 1.25L,2500\n추가선택|max_5\n치킨무,1000\n양념소스,500\n머스타드소스,500' } ]
};

let appData: AppData;

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

    const filteredMenu = activeCategoryId ? menu.filter(item => item.categoryIds.includes(activeCategoryId as string)) : menu;
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
    renderStoreExtraInfo();
}

function renderStoreExtraInfo() {
    const { originInfo } = appData.storeInfo;
    const storeNameForAlert = "딱마리치킨 구로점"; 
    storeExtraInfoSection.innerHTML = `
        <div class="info-accordion-item active">
            <div class="info-accordion-header">
                <span>가게 알림</span>
                <svg class="info-accordion-chevron" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path></svg>
            </div>
            <div class="info-accordion-content">
                <div class="store-alert-content">
                    <p class="alert-deco-line">✨ ✧˖° ${storeNameForAlert} °˖✧ ✨</p>
                    <p class="alert-main-text">■ 주문 시 물티슈, 젓가락 등 요청해주시면 보내드립니다!</p>
                    <p class="alert-sub-text">(일회용품 소진 시 제공이 어려울 수 있습니다!)</p>
                    <p class="alert-contact-text">※ 불편하신 점 있으셨다면 매장으로 연락주시면 신속한 해결 도와드리겠습니다.</p>
                </div>
            </div>
        </div>
        <div class="info-accordion-item">
            <div class="info-accordion-header">
                <span>가게 인증 내역</span>
                <svg class="info-accordion-chevron" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path></svg>
            </div>
            <div class="info-accordion-content">
                <div class="certification-item">
                    <span class="certification-label">CESCO</span>
                    <div class="certification-details">
                        <div>
                            <span class="certification-tag">세스코 멤버스</span>
                            <span class="info-icon">ⓘ</span>
                        </div>
                        <span class="certification-date">2025.10. 최근 해충방제 점검월</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="info-accordion-item">
            <div class="info-accordion-header">
                <span>가게 통계 <span class="info-icon-header">ⓘ</span></span>
                 <svg class="info-accordion-chevron" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path></svg>
            </div>
            <div class="info-accordion-content">
                <div class="stats-grid">
                    <span class="stats-label">최근 주문수</span><span class="stats-value">5,000+</span>
                    <span class="stats-label">전체 리뷰수</span><span class="stats-value">2,810</span>
                    <span class="stats-label">찜</span><span class="stats-value">1,260</span>
                </div>
            </div>
        </div>
        <div class="info-accordion-item">
            <div class="info-accordion-header">
                <span>원산지 표기</span>
                <svg class="info-accordion-chevron" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path></svg>
            </div>
            <div class="info-accordion-content">
                <pre class="origin-info-pre">${originInfo}</pre>
            </div>
        </div>
    `;
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
            
            if (lastCommaIndex > 0) { 
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
            } else { 
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
    adminOriginInfo.value = storeInfo.originInfo;
    storeInfo.introImages.forEach((src, i) => { if (adminIntroImageDropzones[i]) updateImagePreview(adminIntroImageDropzones[i], src); });
    
    renderAdminCategoryList();
    renderMenuCategoryCheckboxes();
    renderAdminMenuSortFilter();
    renderAdminMenuList();
}

function renderAdminCategoryList() {
    adminCategoryListContainer.innerHTML = appData.categories.map(cat => {
        if (cat.id === editingCategoryId) { return `
            <div class="admin-category-item" data-id="${cat.id}">
                <span class="drag-handle">⠿</span>
                <input type="text" class="edit-category-input" value="${cat.name}" data-id="${cat.id}">
                <button class="save-category-btn" data-id="${cat.id}">저장</button>
                <button class="cancel-edit-category-btn" data-id="${cat.id}">취소</button>
            </div>`;
        }
        return `
            <div class="admin-category-item" draggable="true" data-id="${cat.id}">
                <span class="drag-handle">⠿</span>
                <div class="admin-category-item-content">
                    <span>${cat.name}</span>
                </div>
                <div class="admin-category-item-actions">
                    <button class="edit-category-btn" data-id="${cat.id}">수정</button>
                    <button class="delete-category-btn" data-id="${cat.id}">삭제</button>
                </div>
            </div>`;
    }).join('');
 }
function renderMenuCategoryCheckboxes() {
    adminMenuCategoryCheckboxes.innerHTML = appData.categories.map(cat => `
        <div class="category-checkbox-item">
            <input type="checkbox" id="cat-check-${cat.id}" value="${cat.id}" name="menu-categories">
            <label for="cat-check-${cat.id}">${cat.name}</label>
        </div>
    `).join('');
}
 function renderAdminMenuSortFilter() {
    const categories = appData.categories;
    adminMenuSortCategorySelect.innerHTML = `
        <option value="all">전체 메뉴</option>
        ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
    `;
    adminMenuSortCategorySelect.value = adminSelectedCategoryIdForSort;
}
function renderAdminMenuList() {
    const filteredMenu = adminSelectedCategoryIdForSort === 'all'
        ? [...appData.menu]
        : appData.menu.filter(item => item.categoryIds.includes(adminSelectedCategoryIdForSort));
    
    adminMenuListContainer.innerHTML = filteredMenu.map(createAdminMenuItemHTML).join('');
}
function createAdminMenuItemHTML(item: MenuItem) { 
    const categoryNames = item.categoryIds
        .map(id => appData.categories.find(c => c.id === id)?.name)
        .filter(Boolean)
        .join(', ');
    return `
        <div class="admin-menu-item" draggable="true" data-id="${item.id}">
             <span class="drag-handle">⠿</span>
            <div class="admin-menu-item-info">
                <strong>${item.name}</strong>
                <span>${categoryNames} | ${item.price}</span>
            </div>
            <div class="admin-menu-item-actions">
                <button class="edit-btn" data-id="${item.id}">수정</button>
                <button class="delete-btn" data-id="${item.id}">삭제</button>
            </div>
        </div>`;
}

adminMenuSortCategorySelect.addEventListener('change', () => {
    adminSelectedCategoryIdForSort = adminMenuSortCategorySelect.value;
    renderAdminMenuList();
});

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
            
            let importedData = JSON.parse(text);

            // Validate the basic structure
            if (!importedData.storeInfo || !importedData.menu || !importedData.categories) {
                throw new Error("유효하지 않은 데이터 파일 형식입니다. storeInfo, menu, categories 키가 모두 필요합니다.");
            }

            // Perform migration directly on the imported data if necessary
            const needsMigration = importedData.menu.some((item: any) => item.categoryId !== undefined && !item.categoryIds);
            if (needsMigration) {
                console.log("Old data format detected in imported file. Migrating...");
                importedData.menu = importedData.menu.map((item: any) => {
                    if (item.categoryId !== undefined && !item.categoryIds) {
                        const { categoryId, ...rest } = item;
                        return { ...rest, categoryIds: [categoryId] };
                    }
                    return item;
                });
            }

            appData = importedData as AppData;
            saveData();
            
            editingCategoryId = null;
            currentSlideIndex = 0;
            activeCategoryId = appData.categories.length > 0 ? appData.categories[0].id : null;
            adminSelectedCategoryIdForSort = appData.categories.length > 0 ? appData.categories[0].id : 'all';
            
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
    info.originInfo = adminOriginInfo.value;
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
        if (confirm(`카테고리를 삭제하시겠습니까? 이 카테고리에만 속한 메뉴들은 다른 카테고리로 자동 이동됩니다.`)) {
            const firstRemainingCategory = appData.categories.find(c => c.id !== id);
            if (!firstRemainingCategory) {
                alert('오류: 남은 카테고리를 찾을 수 없습니다.');
                return;
            }
            const firstCategoryId = firstRemainingCategory.id;

            appData.menu.forEach(item => {
                item.categoryIds = item.categoryIds.filter(catId => catId !== id);
                if (item.categoryIds.length === 0) {
                    item.categoryIds.push(firstCategoryId);
                }
            });
            
            appData.categories = appData.categories.filter(cat => cat.id !== id);
            if (activeCategoryId === id) activeCategoryId = firstCategoryId;
            if (adminSelectedCategoryIdForSort === id) adminSelectedCategoryIdForSort = 'all';
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

    const selectedCategoryIds = Array.from(adminMenuCategoryCheckboxes.querySelectorAll('input:checked')).map(el => (el as HTMLInputElement).value);
    if (selectedCategoryIds.length === 0) {
        alert('카테고리를 하나 이상 선택해주세요.');
        return;
    }

    const id = adminMenuId.value ? parseInt(adminMenuId.value) : Date.now();
    const newItem: MenuItem = {
        id: id,
        categoryIds: selectedCategoryIds,
        name: adminMenuName.value,
        tags: adminMenuTags.value.split(',').map(t => t.trim()).filter(Boolean),
        description: adminMenuDescription.value,
        price: adminMenuPrice.value,
        reviews: adminMenuReviews.value || null,
        image: (adminMenuImageDropzone.querySelector('.image-preview') as HTMLImageElement).src,
        options: adminMenuOptions.value
    };
    const existingIndex = appData.menu.findIndex(item => item.id === id);
    if (existingIndex > -1) {
        appData.menu[existingIndex] = newItem;
    } else {
        appData.menu.push(newItem);
    }
    saveData();
    render();
    clearMenuForm();
});

adminMenuClearBtn.addEventListener('click', clearMenuForm);
function clearMenuForm() {
    menuItemForm.reset();
    adminMenuId.value = '';
    const checkboxes = adminMenuCategoryCheckboxes.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => (cb as HTMLInputElement).checked = false);
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
            const checkboxes = adminMenuCategoryCheckboxes.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                const checkbox = cb as HTMLInputElement;
                checkbox.checked = itemToEdit.categoryIds.includes(checkbox.value);
            });
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
            return;
        }
    }

    const basePrice = parsePrice(detailMenuPrice.textContent);
    let optionsPrice = 0;
    const checkedOptions = detailMenuOptionsContainer.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked');
    
    checkedOptions.forEach(checkbox => {
        optionsPrice += parseInt(checkbox.dataset.price || '0', 10);
    });

    const totalPrice = basePrice + optionsPrice;
    footerTotalPrice.textContent = `${totalPrice.toLocaleString()}원`;
});

storeInfoView.addEventListener('click', e => {
    const header = (e.target as HTMLElement).closest('.info-accordion-header');
    if (header) {
        const item = header.parentElement;
        item?.classList.toggle('active');
    }
});

// Setup drag-to-scroll for menu tabs
const slider = menuTabsContainer;
let isDown = false;
let startX: number;
let scrollLeft: number;

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('dragging');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('dragging');
});
slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('dragging');
});
slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX);
    slider.scrollLeft = scrollLeft - walk;
});

// --- Drag and Drop Sorting Logic ---
function setupDragAndDrop<T extends {id: string | number}>(
    container: HTMLElement,
    getDataArray: () => T[],
    onReorder: () => void
) {
    let draggedItem: HTMLElement | null = null;

    container.addEventListener('dragstart', (e) => {
        const target = e.target as HTMLElement;
        // Ensure we are dragging the correct item
        if (target.classList.contains('admin-menu-item') || target.classList.contains('admin-category-item')) {
            draggedItem = target;
            setTimeout(() => {
                if(draggedItem) draggedItem.classList.add('dragging');
            }, 0);
        }
    });

    container.addEventListener('dragend', () => {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
        }
        draggedItem = null;
        // Clean up any lingering visual indicators
        container.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(el => {
            el.classList.remove('drag-over-top', 'drag-over-bottom');
        });
    });

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!draggedItem) return;

        const target = (e.target as HTMLElement).closest<HTMLElement>('.admin-menu-item, .admin-category-item');
        
        // Clear all previous indicators
        container.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(el => {
            el.classList.remove('drag-over-top', 'drag-over-bottom');
        });

        if (target && target !== draggedItem) {
            const rect = target.getBoundingClientRect();
            const offsetY = e.clientY - rect.top;

            if (offsetY < rect.height / 2) {
                target.classList.add('drag-over-top');
            } else {
                target.classList.add('drag-over-bottom');
            }
        }
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedItem) return;

        const dataArray = getDataArray();
        const target = (e.target as HTMLElement).closest<HTMLElement>('.admin-menu-item, .admin-category-item');
        
        // Cleanup UI
        container.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(el => {
            el.classList.remove('drag-over-top', 'drag-over-bottom');
        });
        draggedItem.classList.remove('dragging');
        
        const draggedId = draggedItem.dataset.id;
        const targetId = target ? target.dataset.id : null;

        if (draggedId) {
            const draggedIndex = dataArray.findIndex(item => String(item.id) === draggedId);
            if (draggedIndex === -1) { return; } // Should not happen

            const [movedItem] = dataArray.splice(draggedIndex, 1);
            
            if (targetId && targetId !== draggedId) {
                let targetIndex = dataArray.findIndex(item => String(item.id) === targetId);
                
                if (targetIndex !== -1) {
                     const rect = target!.getBoundingClientRect();
                     const offsetY = e.clientY - rect.top;
                
                    if (offsetY >= rect.height / 2) {
                        targetIndex += 1;
                    }
                    dataArray.splice(targetIndex, 0, movedItem);
                } else {
                    dataArray.push(movedItem);
                }
            } else {
                dataArray.push(movedItem);
            }
            onReorder();
        }
        draggedItem = null;
    });
}

function onCategoryReorder() {
    saveData();
    render();
}

function onMenuReorder() {
    saveData();
    renderAdminMenuList(); // Only re-render the menu list to keep filter state
}

async function loadAndApplyExternalData() {
    let loadedData: AppData | null = null;
    const savedData = localStorage.getItem(DB_KEY);

    if (savedData) {
        try {
            loadedData = JSON.parse(savedData) as AppData;
        } catch (e) {
            console.error("Failed to parse data from localStorage", e);
            localStorage.removeItem(DB_KEY); // Clear corrupted data
        }
    } 
    
    if (!loadedData) { // Only fetch if localStorage is empty or corrupt
        try {
            const response = await fetch('/db.json', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`Failed to fetch db.json: ${response.statusText}`);
            }
            loadedData = await response.json() as AppData;
            console.log("Loaded initial data from /db.json");
        } catch (error) {
            console.warn("Could not load any external data, sticking with built-in initial data.", error);
            return; // Exit if no external data can be loaded; app is already running on initialData
        }
    }

    if (loadedData) {
        // Migration for old data format
        const needsMigration = loadedData.menu.some(item => (item as any).categoryId !== undefined && !item.categoryIds);
        if (needsMigration) {
            console.log("Old data format detected. Migrating menu items...");
            loadedData.menu = loadedData.menu.map(item => {
                const oldItem = item as any;
                if (oldItem.categoryId !== undefined && !item.categoryIds) {
                    const { categoryId, ...rest } = oldItem;
                    return { ...rest, categoryIds: [categoryId] };
                }
                return item;
            });
        }
        
        if (!loadedData.storeInfo.originInfo) {
            loadedData.storeInfo.originInfo = initialData.storeInfo.originInfo;
        }
        
        appData = loadedData;
        saveData(); // Save the correct data (fetched or migrated) to localStorage
        
        // Re-initialize state variables and re-render with the new data
        activeCategoryId = appData.categories.length > 0 ? appData.categories[0].id : null;
        adminSelectedCategoryIdForSort = appData.categories.length > 0 ? appData.categories[0].id : 'all';
        currentSlideIndex = 0;
        
        render();
        console.log("App updated with loaded data.");
    }
}

// --- Initial App Load: Synchronous First Render ---
// 1. Immediately initialize with built-in data to prevent a blank screen.
appData = JSON.parse(JSON.stringify(initialData));
activeCategoryId = appData.categories.length > 0 ? appData.categories[0].id : null;
adminSelectedCategoryIdForSort = appData.categories.length > 0 ? appData.categories[0].id : 'all';

// 2. Perform the first render synchronously.
render();
showView('home');

// 3. Setup all UI event listeners.
setupImageUploader(adminHomeImageDropzone);
adminHeroImageDropzones.forEach(setupImageUploader);
adminIntroImageDropzones.forEach(setupImageUploader);
setupImageUploader(adminMenuImageDropzone);
setupDragAndDrop(adminCategoryListContainer, () => appData.categories, onCategoryReorder);
setupDragAndDrop(adminMenuListContainer, () => {
    return adminSelectedCategoryIdForSort === 'all'
        ? appData.menu
        : appData.menu.filter(item => item.categoryIds.includes(adminSelectedCategoryIdForSort));
}, onMenuReorder);

// 4. Asynchronously load external data (from localStorage or /db.json) and update the UI if successful.
loadAndApplyExternalData();