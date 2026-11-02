/* All service links and the sidebar are delivered as static HTML. */
(() => {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('layoutSidenav_nav');
    const desktop = window.matchMedia('(min-width: 992px)');
    const updateMenuState = () => {
        const toggled = document.body.classList.contains('sb-sidenav-toggled');
        const open = desktop.matches ? !toggled : toggled;
        toggle.setAttribute('aria-expanded', String(open));
        sidebar.inert = !open;
    };
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('sb-sidenav-toggled');
        updateMenuState();
    });
    desktop.addEventListener('change', updateMenuState);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !desktop.matches && toggle.getAttribute('aria-expanded') === 'true') {
            document.body.classList.remove('sb-sidenav-toggled');
            updateMenuState();
            toggle.focus();
        }
    });
    sidebar.addEventListener('click', event => {
        const link = event.target.closest('a');
        if (link && !link.hasAttribute('data-bs-toggle') && !desktop.matches) {
            document.body.classList.remove('sb-sidenav-toggled');
            updateMenuState();
        }
    });
    updateMenuState();

    if (location.protocol === 'file:') return;
    fetch('./common/navbar.html')
        .then(response => {
            if (!response.ok) throw new Error('Navbar unavailable');
            return response.text();
        })
        .then(html => { document.getElementById('navbar').innerHTML = html; })
        .catch(() => { /* Keep the static blog link when the common navbar is unavailable. */ });
})();
