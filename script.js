document.addEventListener('DOMContentLoaded', function () {
  // ======================== БУРГЕР-МЕНЮ ========================
  // ======================== БУРГЕР-МЕНЮ ========================
  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (burger && mobileMenu) {
    // Убеждаемся, что меню скрыто при загрузке
    mobileMenu.classList.remove('active');
    burger.classList.remove('active');
    document.body.style.overflow = '';

    const openMenu = () => {
      document.body.style.overflow = 'hidden';
      burger.classList.add('active');
      mobileMenu.classList.add('active');
    };

const closeMenu = () => {
  document.body.style.overflow = '';
  burger.classList.remove('active');
  mobileMenu.classList.remove('active');
};

const mobileMenuClose = document.getElementById('mobileMenuClose');
if (mobileMenuClose) {
  mobileMenuClose.addEventListener('click', closeMenu);
}

burger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Закрываем при клике на ссылку внутри меню
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    // Закрываем при клике вне меню и бургера
    document.addEventListener('click', (event) => {
      if (mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(event.target) &&
        !burger.contains(event.target)) {
        closeMenu();
      }
    });
  }

  // ======================== МАТЕМАТИЧЕСКАЯ ПРОВЕРКА ДЛЯ ФОРМЫ ОТЗЫВА ========================
  let currentMathAnswer = null;
  const mathQuestionSpan = document.getElementById('mathQuestionText');
  const mathAnswerInput = document.getElementById('mathAnswerInput');

  function generateMathQuestion() {
    if (!mathQuestionSpan || !mathAnswerInput) return;
    const num1 = Math.floor(Math.random() * 9) + 2;
    const num2 = Math.floor(Math.random() * 9) + 2;
    currentMathAnswer = num1 + num2;
    mathQuestionSpan.textContent = `${num1} + ${num2}`;
    mathAnswerInput.value = '';
  }

  generateMathQuestion();

  // ======================== ФОРМЫ ========================
  const callbackForm = document.getElementById('callbackForm');
  const reviewForm = document.getElementById('reviewForm');

  if (callbackForm) {
    callbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Спасибо! Заявка на обучение отправлена (демо-режим).');
      callbackForm.reset();
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userAnswer = parseInt(mathAnswerInput?.value, 10);
      if (isNaN(userAnswer)) {
        alert('Пожалуйста, введите ответ на проверочный вопрос (число).');
        return;
      }
      if (userAnswer !== currentMathAnswer) {
        alert(`Неверный ответ. Попробуйте ещё раз. (Вопрос: ${mathQuestionSpan.textContent})`);
        generateMathQuestion();
        mathAnswerInput.value = '';
        mathAnswerInput.focus();
        return;
      }
      alert('Спасибо за ваш отзыв! Он очень важен для нас.');
      reviewForm.reset();
      generateMathQuestion();
    });
  }

  // ======================== СЛАЙДЕР АВТОМОБИЛЕЙ ========================
  (function () {
    const slider = document.querySelector('[data-autos-slider]');
    if (!slider) return;
    const track = slider.querySelector('.autos-slider__track');
    const slides = Array.from(slider.querySelectorAll('.autos-slide'));
    const prevBtn = slider.querySelector('.autos-slider__arrow--prev');
    const nextBtn = slider.querySelector('.autos-slider__arrow--next');
    const dotsWrap = slider.querySelector('.autos-slider__dots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false, isSwiping = false;
    let autoPlayInterval = null;
    const autoPlayDelay = 5000;

    function updateSliderPosition() {
      const offset = -currentIndex * 100;
      track.style.transform = `translateX(${offset}%)`;
      slides.forEach((slide, idx) => {
        if (idx === currentIndex) slide.classList.add('is-active');
        else slide.classList.remove('is-active');
      });
      const dots = slider.querySelectorAll('.autos-slider__dot');
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) dot.classList.add('is-active');
        else dot.classList.remove('is-active');
      });
    }

    function goToSlide(index) {
      if (index < 0) currentIndex = slides.length - 1;
      else if (index >= slides.length) currentIndex = 0;
      else currentIndex = index;
      updateSliderPosition();
      resetAutoPlay();
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }
    function resetAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'autos-slider__dot';
        dot.addEventListener('click', () => goToSlide(idx));
        dotsWrap.appendChild(dot);
      });
    }

    function onStart(e) {
      if (e.type === 'mousedown') {
        startX = e.clientX;
        isDragging = true;
      } else if (e.type === 'touchstart') {
        startX = e.touches[0].clientX;
        isSwiping = true;
      }
      track.style.transition = 'none';
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      e.preventDefault();
    }
    function onMove(e) {
      if (!isDragging && !isSwiping) return;
      let clientX = isDragging ? e.clientX : e.touches[0].clientX;
      const diff = clientX - startX;
      const percent = (diff / track.parentElement.clientWidth) * 100;
      let newTransform = -currentIndex * 100 + percent;
      newTransform = Math.min(0, Math.max(newTransform, -(slides.length - 1) * 100));
      track.style.transform = `translateX(${newTransform}%)`;
    }
    function onEnd(e) {
      if (!isDragging && !isSwiping) return;
      let clientX = isDragging ? e.clientX : (e.changedTouches ? e.changedTouches[0].clientX : startX);
      const diff = clientX - startX;
      track.style.transition = '';
      if (Math.abs(diff) > 50) {
        if (diff < 0) nextSlide();
        else prevSlide();
      } else {
        updateSliderPosition();
      }
      isDragging = false;
      isSwiping = false;
      resetAutoPlay();
    }
    track.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    track.addEventListener('touchstart', onStart, { passive: false });
    track.addEventListener('touchmove', onMove, { passive: false });
    track.addEventListener('touchend', onEnd);

    slider.addEventListener('mouseenter', () => { if (autoPlayInterval) clearInterval(autoPlayInterval); });
    slider.addEventListener('mouseleave', resetAutoPlay);

    updateSliderPosition();
    resetAutoPlay();
  })();

  // ======================== СЛАЙДЕР ИНСТРУКТОРОВ ========================
  (function () {
    const slider = document.querySelector('[data-instructors-slider]');
    if (!slider) return;
    const track = slider.querySelector('.instructors-slider__track');
    const slides = Array.from(slider.querySelectorAll('.instructors-slide'));
    const prevBtn = slider.querySelector('.instructors-slider__arrow--prev');
    const nextBtn = slider.querySelector('.instructors-slider__arrow--next');
    const dotsWrap = slider.querySelector('.instructors-slider__dots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false, isSwiping = false;
    let autoPlayInterval = null;
    const autoPlayDelay = 5000;

    function getVisibleSlides() {
      const slide = slides[0];
      if (!slide) return 1;
      const value = getComputedStyle(slide).getPropertyValue('--visible').trim();
      const num = parseInt(value, 10);
      return isNaN(num) ? 1 : num;
    }
    function getSlideWidth() {
      const slide = slides[0];
      const style = getComputedStyle(slide);
      const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return slide.offsetWidth + margin + gap;
    }
    function getMaxIndex() { return Math.max(0, slides.length - getVisibleSlides()); }
    function updateSliderPosition() {
      const offset = -currentIndex * getSlideWidth();
      track.style.transform = `translateX(${offset}px)`;
      const dots = slider.querySelectorAll('.instructors-slider__dot');
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) dot.classList.add('is-active');
        else dot.classList.remove('is-active');
      });
    }
    function goToSlide(index) {
      const maxIdx = getMaxIndex();
      currentIndex = Math.min(maxIdx, Math.max(0, index));
      updateSliderPosition();
      resetAutoPlay();
    }
    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }
    function resetAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    function rebuildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      const totalDots = slides.length - getVisibleSlides() + 1;
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('button');
        dot.className = 'instructors-slider__dot';
        dot.addEventListener('click', () => goToSlide(i));
        dotsWrap.appendChild(dot);
      }
      updateSliderPosition();
    }

    function onStart(e) {
      if (e.type === 'mousedown') { startX = e.clientX; isDragging = true; }
      else if (e.type === 'touchstart') { startX = e.touches[0].clientX; isSwiping = true; }
      track.style.transition = 'none';
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      e.preventDefault();
    }
    function onMove(e) {
      if (!isDragging && !isSwiping) return;
      let clientX = isDragging ? e.clientX : e.touches[0].clientX;
      const diff = clientX - startX;
      const slideW = getSlideWidth();
      const maxOffset = -(getMaxIndex() * slideW);
      let newTranslate = -currentIndex * slideW + diff;
      newTranslate = Math.min(0, Math.max(newTranslate, maxOffset));
      track.style.transform = `translateX(${newTranslate}px)`;
    }
    function onEnd(e) {
      if (!isDragging && !isSwiping) return;
      let clientX = isDragging ? e.clientX : (e.changedTouches ? e.changedTouches[0].clientX : startX);
      const diff = clientX - startX;
      track.style.transition = '';
      if (Math.abs(diff) > 30) {
        if (diff < 0) nextSlide();
        else prevSlide();
      } else {
        updateSliderPosition();
      }
      isDragging = false;
      isSwiping = false;
      resetAutoPlay();
    }
    track.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    track.addEventListener('touchstart', onStart, { passive: false });
    track.addEventListener('touchmove', onMove, { passive: false });
    track.addEventListener('touchend', onEnd);

    window.addEventListener('resize', () => {
      rebuildDots();
      const maxIdx = getMaxIndex();
      if (currentIndex > maxIdx) currentIndex = maxIdx;
      updateSliderPosition();
    });
    rebuildDots();
    resetAutoPlay();
  })();

  // ======================== ГАЛЕРЕЯ И ЛАЙТБОКС ========================
  (function () {

const allImages = [
  { src: "assets/gallery/01-ph.jpg", caption: "" },
  { src: "assets/gallery/02-ph.jpg", caption: "" },
  { src: "assets/gallery/03-ph.jpg", caption: "" },
  { src: "assets/gallery/04-ph.jpg", caption: "" },
  { src: "assets/gallery/05-ph.jpg", caption: "" },
  { src: "assets/gallery/06-ph.jpg", caption: "" },
  { src: "assets/gallery/07-ph.jpg", caption: "" },
  { src: "assets/gallery/08-ph.jpg", caption: "" },
  { src: "assets/gallery/09-ph.jpg", caption: "" },
  { src: "assets/gallery/10-ph.jpg", caption: "" },
  { src: "assets/gallery/11-ph.jpg", caption: "" },
  { src: "assets/gallery/12-ph.jpg", caption: "" },
  { src: "assets/gallery/13-ph.jpg", caption: "" },
  { src: "assets/gallery/14-ph.jpg", caption: "" },
  { src: "assets/gallery/15-ph.jpg", caption: "" },
  { src: "assets/gallery/16-ph.jpg", caption: "" },
  { src: "assets/gallery/17-ph.jpg", caption: "" },
  { src: "assets/gallery/18-ph.jpg", caption: "" },
  { src: "assets/gallery/19-ph.jpg", caption: "" },
  { src: "assets/gallery/20-ph.jpg", caption: "" },
  { src: "assets/gallery/21-ph.jpg", caption: "" },
  { src: "assets/gallery/22-ph.jpg", caption: "" },
  { src: "assets/gallery/23-ph.jpg", caption: "" },
  { src: "assets/gallery/24-ph.jpg", caption: "" }
];

function getItemsPerPage() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return 6;
  const value = getComputedStyle(grid).getPropertyValue('--per-page').trim();
  const num = parseInt(value, 10);
  return isNaN(num) ? 6 : num;
}

    let currentPage = 0;
    let totalPages = 0;
    let isAnimating = false;
    let currentItemsPerPage = getItemsPerPage();

    const grid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox?.querySelector('.lightbox__image');
    const lightboxCaption = lightbox?.querySelector('.lightbox__caption');
    const closeLightboxBtn = lightbox?.querySelector('.lightbox__close');
    const prevLightboxBtn = lightbox?.querySelector('.lightbox__prev');
    const nextLightboxBtn = lightbox?.querySelector('.lightbox__next');

    let moreContainer = document.querySelector('.gallery__more');
    if (!moreContainer && grid && grid.parentNode) {
      moreContainer = document.createElement('div');
      moreContainer.className = 'gallery__more';
      grid.parentNode.appendChild(moreContainer);
    }
    const prevRowBtn = document.createElement('button');
    prevRowBtn.id = 'prevRowBtn';
    prevRowBtn.className = 'btn btn--outline';
    prevRowBtn.textContent = '← сюда';
    const nextRowBtn = document.createElement('button');
    nextRowBtn.id = 'nextRowBtn';
    nextRowBtn.className = 'btn btn--outline';
    nextRowBtn.textContent = 'туда →';
    if (moreContainer) {
      moreContainer.innerHTML = '';
      moreContainer.appendChild(prevRowBtn);
      moreContainer.appendChild(nextRowBtn);
    }

    function updateTotalPages() {
      totalPages = Math.ceil(allImages.length / currentItemsPerPage);
      if (currentPage >= totalPages) currentPage = Math.max(0, totalPages - 1);
    }

    function renderSilent() {
      const start = currentPage * currentItemsPerPage;
      const end = Math.min(start + currentItemsPerPage, allImages.length);
      const pageImages = allImages.slice(start, end);
      grid.innerHTML = '';
      pageImages.forEach((img, idx) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
          <img class="gallery-item__img" src="${img.src}" alt="${img.caption}" loading="lazy">
          <div class="gallery-item__overlay">
            <span class="gallery-item__icon">
              <span class="iconify" data-icon="fa6-solid:magnifying-glass-plus"></span> Смотреть
            </span>
          </div>
        `;
        const globalIndex = start + idx;
        item.addEventListener('click', () => openLightbox(globalIndex));
        grid.appendChild(item);
      });
      if (window.iconify) window.iconify();

      prevRowBtn.disabled = (currentPage === 0) || isAnimating;
      prevRowBtn.style.opacity = (currentPage === 0) ? '0.5' : '1';
      const isLast = currentPage + 1 >= totalPages;
      nextRowBtn.disabled = isLast || isAnimating;
      nextRowBtn.style.opacity = isLast ? '0.5' : '1';
    }

    function changePage(delta) {
      if (isAnimating) return;
      const newPage = currentPage + delta;
      if (newPage < 0 || newPage >= totalPages) return;
      isAnimating = true;
      grid.style.transition = 'opacity 0.25s ease, transform 0.3s ease';
      grid.style.opacity = '0';
      grid.style.transform = 'scale(0.98) translateY(8px)';
      setTimeout(() => {
        currentPage = newPage;
        renderSilent();
        void grid.offsetHeight;
        grid.style.transition = 'opacity 0.35s ease, transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        grid.style.opacity = '1';
        grid.style.transform = 'scale(1) translateY(0)';
        setTimeout(() => {
          isAnimating = false;
          grid.style.transition = '';
          prevRowBtn.disabled = (currentPage === 0);
          nextRowBtn.disabled = (currentPage + 1 >= totalPages);
        }, 400);
      }, 250);
    }

    prevRowBtn.addEventListener('click', () => changePage(-1));
    nextRowBtn.addEventListener('click', () => changePage(1));

    function handleResize() {
      const newItemsPerPage = getItemsPerPage();
      if (newItemsPerPage !== currentItemsPerPage) {
        currentItemsPerPage = newItemsPerPage;
        updateTotalPages();
        if (currentPage >= totalPages) currentPage = Math.max(0, totalPages - 1);
        renderSilent();
      }
    }
    window.addEventListener('resize', () => setTimeout(handleResize, 100));

    let lightboxIndex = 0;
    let dragStartX = 0;
    let dragEndX = 0;
    let isDraggingImage = false;

    function openLightbox(globalIndex) {
      if (!lightbox || !lightboxImg) return;
      if (!allImages.length) return;
      lightboxIndex = globalIndex;
      updateLightboxImage();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function updateLightboxImage() {
      const img = allImages[lightboxIndex];
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.caption;
        if (lightboxCaption) lightboxCaption.textContent = img.caption;
      }
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function nextLightbox() {
      if (!allImages.length) return;
      lightboxIndex = (lightboxIndex + 1) % allImages.length;
      updateLightboxImage();
    }

    function prevLightbox() {
      if (!allImages.length) return;
      lightboxIndex = (lightboxIndex - 1 + allImages.length) % allImages.length;
      updateLightboxImage();
    }

    if (prevLightboxBtn) prevLightboxBtn.onclick = (e) => { e.stopPropagation(); prevLightbox(); };
    if (nextLightboxBtn) nextLightboxBtn.onclick = (e) => { e.stopPropagation(); nextLightbox(); };
    if (closeLightboxBtn) closeLightboxBtn.onclick = closeLightbox;

    const onImageDragStart = (e) => {
      e.preventDefault();
      isDraggingImage = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      dragStartX = clientX;
      dragEndX = dragStartX;
      lightboxImg.style.cursor = 'grabbing';
    };

    const onImageDragMove = (e) => {
      if (!isDraggingImage) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      dragEndX = clientX;
    };

    const onImageDragEnd = () => {
      if (!isDraggingImage) return;
      lightboxImg.style.cursor = '';
      const delta = dragEndX - dragStartX;
      if (Math.abs(delta) > 40) {
        if (delta > 0) prevLightbox();
        else nextLightbox();
      }
      isDraggingImage = false;
      dragStartX = 0;
      dragEndX = 0;
    };

    if (lightboxImg) {
      lightboxImg.addEventListener('mousedown', onImageDragStart);
      window.addEventListener('mousemove', onImageDragMove);
      window.addEventListener('mouseup', onImageDragEnd);
      lightboxImg.addEventListener('touchstart', onImageDragStart, { passive: false });
      lightboxImg.addEventListener('touchmove', onImageDragMove, { passive: false });
      lightboxImg.addEventListener('touchend', onImageDragEnd);
    }

    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!lightbox?.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    });

    currentItemsPerPage = getItemsPerPage();
    updateTotalPages();
    renderSilent();
    grid.style.opacity = '0';
    setTimeout(() => {
      grid.style.transition = 'opacity 0.4s ease';
      grid.style.opacity = '1';
    }, 50);
  })();
});