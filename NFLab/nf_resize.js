/* 공통 메뉴는 실패 시에도 기본 링크를 유지합니다. */
(() => {
    const menuToggle = document.getElementById('sidebarToggle');
    const updateMenuState = () => {
        const toggled = document.body.classList.contains('sb-sidenav-toggled');
        const desktop = window.matchMedia('(min-width: 992px)').matches;
        menuToggle.setAttribute('aria-expanded', String(desktop ? !toggled : toggled));
    };
    menuToggle.addEventListener('click', () => {
        document.body.classList.toggle('sb-sidenav-toggled');
        updateMenuState();
    });
    window.addEventListener('resize', updateMenuState);
    updateMenuState();


    const english = {
        "skip": "Skip to content",
        "home": "NF Laboratory <span aria-hidden=\"true\">↗</span>",
        "lab": "NF Laboratory",
        "simulator": "Sailor Simulator",
        "sidebarDownload": "NF resize",
        "headline": "Your NavyFIELD.<br>Fit to your screen.",
        "lead": "Give your game window more room.<br>Adjust the scale and aspect ratio, or play in full screen.",
        "heroDownload": "Download NF resize 1.5 <span aria-hidden=\"true\">↓</span>",
        "platform": "Windows 10 / 11 · 64-bit · ZIP 28.2 KB",
        "asideScale": "Choose your size",
        "asideScaleValue": "Scale · Fit",
        "asideRatio": "Choose your aspect ratio",
        "asideRatioValue": "4 aspect ratios",
        "asideFullScreen": "Toggle full screen",
        "navFeatures": "Features",
        "navHowTo": "How to use",
        "navDownload": "Download <span aria-hidden=\"true\">↓</span>",
        "navFaq": "FAQ",
        "featuresTitle": "A screen that fits the way you play",
        "featuresNote": "Get started with a single EXE.",
        "scaleTitle": "Scale to your liking",
        "scaleDescription": "Choose 75%, 100%, 125%, 150%, or Fit. You can also enter a custom percentage.",
        "scaleNote": "Input: 1–999% · Available window space limits the applied scale",
        "ratioTitle": "Four aspect ratios",
        "ratioDescription": "Keep the default 4:3, or choose 16:9, 16:10, or 21:9 from the aspect ratio menu.",
        "ratioNote": "Reshapes the image · Does not extend your field of view",
        "fullscreenTitle": "Switch to full screen",
        "fullscreenDescription": "Press Alt+Enter to switch between window mode and full-screen mode. Alt+Tab releases the pointer when you switch to another app.",
        "fullscreenNote": "Restores the original game window settings and position on exit",
        "toolbarTitle": "The toolbar at a glance",
        "toolbarNote": "Program toolbar · App menus are in English.",
        "legendScale": "<b>Scale / Fit</b> Set the scale",
        "legendApply": "<b>Apply</b> Apply your percentage",
        "legendFullscreen": "<b>Full screen</b> Toggle full screen",
        "legendRatio": "<b>4:3</b> Choose an aspect ratio",
        "howToTitle": "Get started in five steps",
        "manualNote": "The Manual is included in the ZIP.",
        "step1Title": "Start the game in window mode",
        "step1": "First, launch NAVYFIELD in window mode. The entire original game image must fit within one monitor's desktop work area, excluding the taskbar.",
        "step2Title": "Run NF resize",
        "step2": "Extract the ZIP and run <code>NF resize 1.5.exe</code>. Accept the administrator prompt if shown.",
        "step3Title": "Choose the scale and aspect ratio",
        "step3": "Select a scale button or Fit. To set a custom percentage, enter a number and press Enter or Apply. The default aspect ratio is 4:3.",
        "step4Title": "Click the game image to play",
        "step4": "Click the image to confine the pointer to the game area. Press Alt+Enter or use Full screen to toggle full-screen mode.",
        "step5Title": "Switch apps or close the utility",
        "step5": "Use Alt+Tab to switch apps. After returning to window mode, click the image to resume play. Closing NF resize restores the original game window.",
        "shortcutsTitle": "Useful controls",
        "shortcutFullscreen": "Toggle full screen<br><small>While NF resize or its connected game is active</small>",
        "shortcutSwitch": "Switch to another app<br><small>Releases the pointer</small>",
        "shortcutClick": "Click the game image",
        "shortcutResume": "Resume pointer control",
        "returnNote": "Switching apps from full screen restores the previous window size and position. Reactivating the session resumes full screen.",
        "downloadTitle": "Download NF resize",
        "version": "Latest release · v1.5",
        "downloadHeading": "One EXE. No installation.",
        "downloadDescription": "No separate DLL or Python installation is needed.<br>The ZIP includes the EXE and a Manual in Korean, English, and Japanese.",
        "os": "Operating system",
        "osValue": "Windows 10 / 11 · 64-bit",
        "runtime": "Runtime",
        "gameSetting": "Game setting",
        "gameSettingValue": "NAVYFIELD in window mode",
        "release": "Release",
        "zipDownload": "Download ZIP <span class=\"resize-recommended\">ZIP</span>",
        "zipContents": "EXE + Manual · 28.2 KB",
        "packageNote": "Includes the EXE and a Manual in Korean, English, and Japanese.",
        "usageTitle": "About this utility",
        "windowsFeatures": "The utility uses only built-in Windows features for functions such as display scaling, window management, and pointer control.",
        "gmNotice": "The Korea server GM has advised that this utility may be used at the user's own risk.",
        "faqTitle": "Before you start",
        "faq1Title": "Does choosing 16:9 or 21:9 extend the field of view?",
        "faq1": "No. It displays the original image at the selected aspect ratio, changing its shape. It does not increase game resolution or field of view. Keep the default 4:3 to preserve the original proportions.",
        "faq2Title": "How do I move the pointer outside the game?",
        "faq2": "Alt+Tab releases the pointer when you switch to another app. In window mode, the pointer stays unlocked when you return; click the game image to resume play.",
        "faq3Title": "Are there image filters or sharpness settings?",
        "faq3": "Version 1.5 offers scaling and aspect ratio selection. It does not include image filters or sharpness options.",
        "faq4Title": "Will the original game window return when I exit?",
        "faq4": "Closing NF resize restores the original game window settings and position.",
        "faq5Title": "What has been tested?",
        "faq5": "Functional checks used test windows on Windows 11 x64. Manual testing with the actual NAVYFIELD client.",
        "footerHome": "Back to NF Laboratory <span aria-hidden=\"true\">↗</span>",
        "monitorRequirement": "Original image",
        "monitorRequirementValue": "Must fit within one monitor's desktop work area (excluding the taskbar)",
        "faq6Title": "Is there a size limit for the original game image?",
        "faq6": "The entire original game image must fit within one monitor's desktop work area, excluding the taskbar. If it is too large, the utility shows an error instead of starting input. At scales below 100%, the actual pointer confinement area may be larger than the displayed image."
};
    const korean = new Map([...document.querySelectorAll('[data-i18n]')].map(element => [element, element.innerHTML]));
    const labels = [...document.querySelectorAll('[data-aria-en], [data-alt-en]')].map(element => ({
        element, aria: element.getAttribute('aria-label'), alt: element.getAttribute('alt')
    }));
    const originalTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const originalDescription = description.content;
    function setLanguage(language) {
        const en = language === 'en';
        document.documentElement.lang = en ? 'en' : 'ko';
        korean.forEach((value, element) => {
            // Both languages are trusted, static page content; markup preserves keyboard labels and line breaks.
            element.innerHTML = en ? english[element.dataset.i18n] : value;
        });
        labels.forEach(({ element, aria, alt }) => {
            if (aria !== null) element.setAttribute('aria-label', en ? element.dataset.ariaEn : aria);
            if (alt !== null) element.setAttribute('alt', en ? element.dataset.altEn : alt);
        });
        document.title = en ? 'NF resize Download & Guide / NF Laboratory' : originalTitle;
        description.content = en ? 'Download NF resize 1.5 for NAVYFIELD. Learn how to adjust scale and aspect ratios, use full screen, and get started on Windows.' : originalDescription;
        document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
        try { localStorage.setItem('nf-resize-language', language); } catch { /* Language switching also works without storage. */ }
    }
    document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
    const browserLanguage = navigator.languages?.[0] || navigator.language || '';
    let initialLanguage = /^ko(?:[-_]|$)/i.test(browserLanguage) ? 'ko' : 'en';
    try {
        const savedLanguage = localStorage.getItem('nf-resize-language');
        if (savedLanguage === 'ko' || savedLanguage === 'en') initialLanguage = savedLanguage;
    } catch { /* Use the browser language when storage is unavailable. */ }
    setLanguage(initialLanguage);

    // file://로 열었을 때에는 기본 메뉴를 사용합니다.
    if (location.protocol === 'file:') return;
    fetch('../common/sidebar.html')
        .then(response => {
            if (!response.ok) throw new Error('Sidebar unavailable');
            return response.text();
        })
        .then(html => {
            const sidebar = document.getElementById('sidenavAccordion');
            sidebar.innerHTML = html;
            sidebar.querySelectorAll('a').forEach(link => {
                // '#' collapse controls are not links to the current page.
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && new URL(link.href).pathname === location.pathname) {
                    link.setAttribute('aria-current', 'page');
                }
            });
        })
        .catch(() => { /* 기본 메뉴로 계속 이용할 수 있습니다. */ });
})();
