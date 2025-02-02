// 모바일 메뉴 토글 기능
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    toggleBtn.style.cssText = `
        position: fixed;
        top: 1rem;
        left: 1rem;
        z-index: 1001;
        background: white;
        border: none;
        padding: 0.5rem;
        border-radius: 0.375rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        display: none;
    `;
    
    document.body.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    // 반응형 처리
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    function handleResize(e) {
        toggleBtn.style.display = e.matches ? 'block' : 'none';
    }
    mediaQuery.addListener(handleResize);
    handleResize(mediaQuery);
});