document.addEventListener('DOMContentLoaded', function() {
    const columnList = document.querySelector('.column-list');
    const selectedList = document.querySelector('.selected-list');
    const addButton = document.getElementById('add-column');
    const removeButton = document.getElementById('remove-column');
    const reportTable = document.getElementById('report-table');
    
    // 샘플 데이터
    const sampleData = [
        {
            number: '1',
            station_name: '서울역 충전소',
            charger_name: 'CH001',
            available_time: '24시간',
            env_display: '표시',
            station_type: '급속',
            reg_date: '2024-02-01'
        },
        {
            number: '2',
            station_name: '강남역 충전소',
            charger_name: 'CH002',
            available_time: '09:00-18:00',
            env_display: '미표시',
            station_type: '완속',
            reg_date: '2024-02-02'
        }
    ];
    
    // 컬럼 데이터 매핑
    const columnMap = {
        number: '번호',
        station_name: '충전소 명',
        charger_name: '충전기 명',
        available_time: '이용가능시간',
        env_display: '환경부 표시 여부',
        station_type: '충전소 유형',
        reg_date: '등록일'
    };
    
    // 아이템 선택 토글
    function toggleSelection(element) {
        element.classList.toggle('selected');
    }
    
    // 컬럼 리스트 클릭 이벤트
    columnList.addEventListener('click', function(e) {
        if (e.target.classList.contains('column-item')) {
            toggleSelection(e.target);
        }
    });
    
    // 선택된 리스트 클릭 이벤트
    selectedList.addEventListener('click', function(e) {
        if (e.target.classList.contains('column-item')) {
            toggleSelection(e.target);
        }
    });
    
    // 컬럼 추가 버튼 클릭
    addButton.addEventListener('click', function() {
        const selectedItems = columnList.querySelectorAll('.column-item.selected');
        selectedItems.forEach(item => {
            item.classList.remove('selected');
            selectedList.appendChild(item.cloneNode(true));
            item.remove();
        });
        updateTable();
    });
    
    // 컬럼 제거 버튼 클릭
    removeButton.addEventListener('click', function() {
        const selectedItems = selectedList.querySelectorAll('.column-item.selected');
        selectedItems.forEach(item => {
            item.classList.remove('selected');
            columnList.appendChild(item.cloneNode(true));
            item.remove();
        });
        updateTable();
    });
    
    // 테이블 업데이트
    function updateTable() {
        const selectedColumns = Array.from(selectedList.children).map(item => item.dataset.column);
        const thead = reportTable.querySelector('thead tr');
        const tbody = reportTable.querySelector('tbody');
        
        // 헤더 업데이트
        thead.innerHTML = '';
        selectedColumns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = columnMap[column];
            thead.appendChild(th);
        });
        
        // 데이터 로우 업데이트
        tbody.innerHTML = '';
        sampleData.forEach(row => {
            const tr = document.createElement('tr');
            selectedColumns.forEach(column => {
                const td = document.createElement('td');
                td.textContent = row[column];
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }
});