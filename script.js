// ========================================
// DOMContentLoaded
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initScrollAnimations();
    initDidScroll();
    initNumberAnimation();
    initAccordions();
    // initFormValidation();
});

// ========================================
// スムーズスクロール
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// スクロールアニメーション (Fade In)
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ========================================
// ヘッダー & Sticky CTA 制御
// ========================================
function initDidScroll() {
    const header = document.querySelector('header');
    const stickyCta = document.getElementById('stickyCta');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;

        // ヘッダーの背景制御
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Sticky CTA 表示制御 (スマホのみ、ある程度スクロールしたら表示)
        // 画面幅が768px以下の場合のみ
        if (window.innerWidth <= 768) {
            if (currentScrollY > 500) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        } else {
            stickyCta.classList.remove('visible');
        }

        lastScrollY = currentScrollY;
    });
}

// ========================================
// 数字カウントアップアニメーション
// ========================================
function initNumberAnimation() {
    function animateValue(element, start, end, duration, suffix = '') {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // イージング効果 (easeOutQuad)
            const easeProgress = 1 - (1 - progress) * (1 - progress);

            const value = Math.floor(easeProgress * (end - start) + start);
            element.textContent = value + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const target = entry.target;
                const finalValue = parseInt(target.dataset.value);
                const suffix = target.dataset.suffix || '';
                animateValue(target, 0, finalValue, 1500, suffix);
                target.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(stat => observer.observe(stat));
}

// ========================================
// アコーディオン (FAQ / Checkpoints)
// ========================================
function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');

            // 他のアコーディオンを閉じる (オプション: ひとつだけ開く挙動にするなら)
            // document.querySelectorAll('.accordion-header').forEach(h => {
            //     if (h !== header) {
            //         h.classList.remove('active');
            //         h.nextElementSibling.style.maxHeight = null;
            //     }
            // });

            header.classList.toggle('active');

            if (!isActive) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });
}

// ========================================
// フォームバリデーション
// ========================================
/*
function initFormValidation() {
    const form = document.getElementById('applicationForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        let isValid = true;
        const errors = [];

        // 必須フィールドのチェック
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            // チェックボックスの場合は個別にチェックしない（グループで見るため）
            if (field.type === 'checkbox') {
                // Checkbox required attribute is not standard for groups, handled below
                // But if individual required exists (like privacy policy), check it
                if (!field.checked) {
                    isValid = false;
                    field.parentElement.style.color = '#ff6b6b'; // エラー時赤字
                } else {
                    field.parentElement.style.color = '';
                }
            } else {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff6b6b';
                } else {
                    field.style.borderColor = '';
                }
            }
        });

        // チェックボックスグループのチェック (最低1つ選択)
        const groups = [
            { name: 'experience_domain', label: '経験領域' },
            { name: 'available_scope', label: '対応可能範囲' }
        ];

        groups.forEach(group => {
            const checkboxes = form.querySelectorAll(`input[name="${group.name}"]`);
            if (checkboxes.length > 0) {
                const checked = Array.from(checkboxes).some(cb => cb.checked);
                const container = checkboxes[0].closest('.checkbox-group');

                if (!checked) {
                    isValid = false;
                    container.style.border = '1px solid #ff6b6b';
                } else {
                    container.style.border = 'none';
                }
            }
        });

        if (!isValid) {
            e.preventDefault(); // バリデーションNGの場合のみ送信をキャンセル
            alert('入力内容に不備があります。赤枠の項目をご確認ください。');
            return;
        }

        // バリデーションOKなら、そのままフォーム送信（Formspreeへ）が行われます
    });
}
*/
