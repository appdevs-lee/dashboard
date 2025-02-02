document.addEventListener('DOMContentLoaded', function() {
    // Submenu Toggle
    const submenuItems = document.querySelectorAll('.menu-item.has-submenu');
    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 현재 열려있는 다른 서브메뉴 닫기
            submenuItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 현재 클릭한 메뉴의 서브메뉴 토글
            this.classList.toggle('active');
        });
    });
    
    // URL에 따라 해당하는 서브메뉴 자동 열기
    const currentPath = window.location.pathname;
    submenuItems.forEach(item => {
        const submenuLinks = item.nextElementSibling.querySelectorAll('a');
        submenuLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                item.classList.add('active');
            }
        });
    });
    // Elements
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const contentWrapper = document.querySelector('.content-wrapper');
    
    // Toggle sidebar
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('hidden');
        contentWrapper.classList.toggle('sidebar-hidden');
    });

    // Mobile menu handling
    if (window.innerWidth <= 768) {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                sidebar.classList.add('hidden');
                contentWrapper.classList.add('sidebar-hidden');
            });
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.app-search .form-control');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            // 검색 로직 구현
            console.log('Search query:', e.target.value);
        });
    }
});