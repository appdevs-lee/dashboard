// Zone 설정 및 순서
let zoneSettings = {
    A: { active: false, count: 6 },
    B: { active: false, count: 4 },
    C: { active: true, count: 6 },
    D: { active: true, count: 8 }
};

let zoneOrder = ['D', 'C', 'B', 'A'];

// 충전기 데이터 생성
function createChargerData(id) {
    return {
        id: id,
        status: Math.random() > 0.5 ? 'charging' : 'idle',
        percentage: Math.floor(Math.random() * 100),
        load: Math.random(),
        power: Math.floor(Math.random() * 50),
        usage: Math.floor(Math.random() * 1000),
        soc: Math.floor(Math.random() * 100)
    };
}

// 모니터링 화면 렌더링
function renderMonitoring() {
    const container = document.getElementById('monitoringContainer');
    container.innerHTML = '';

    // Zone을 2개씩 그룹화하여 렌더링
    for (let i = 0; i < zoneOrder.length; i += 2) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'zone-row';

        // 첫 번째 Zone
        if (zoneSettings[zoneOrder[i]].active) {
            rowDiv.appendChild(createZoneElement(zoneOrder[i]));
        }

        // 두 번째 Zone (있는 경우)
        if (i + 1 < zoneOrder.length && zoneSettings[zoneOrder[i + 1]].active) {
            rowDiv.appendChild(createZoneElement(zoneOrder[i + 1]));
        }

        if (rowDiv.children.length > 0) {
            container.appendChild(rowDiv);
        }
    }

    setupDragAndDrop();
}

// Zone 요소 생성
function createZoneElement(zone) {
    const zoneDiv = document.createElement('div');
    zoneDiv.className = 'zone-container';
    zoneDiv.draggable = true;
    zoneDiv.dataset.zone = zone;

    zoneDiv.innerHTML = `
        <div class="zone-drag-handle">
            <i class="fas fa-grip-lines"></i>
        </div>
        <h2 class="zone-title">${zone} Zone</h2>
        <div class="chargers-grid" id="zone-${zone}"></div>
    `;

    const chargerGrid = zoneDiv.querySelector('.chargers-grid');
    for (let i = 1; i <= zoneSettings[zone].count; i++) {
        const charger = createChargerData(`${zone}${i}`);
        chargerGrid.appendChild(createChargerElement(charger));
    }

    return zoneDiv;
}

// 충전기 요소 생성
function createChargerElement(charger) {
    const div = document.createElement('div');
    div.className = `charger-box ${getStatusClass(charger.load)}`;
    div.setAttribute('data-charger-id', charger.id);
    div.innerHTML = `
        <div class="charger-header">${charger.id}</div>
        <div class="charger-content">
            ${charger.status === 'charging' 
                ? `<div class="charging-percentage">${charger.percentage}%</div>`
                : `<div class="charger-image">⚡</div>`}
        </div>
    `;
    div.onclick = () => showChargerInfo(charger);
    return div;
}

// 상태에 따른 클래스
function getStatusClass(load) {
    if (load < 0.3) return 'status-normal';
    if (load < 0.7) return 'status-warning';
    return 'status-danger';
}

// 드래그 앤 드롭 설정
let draggedZone = null;

function setupDragAndDrop() {
    const containers = document.querySelectorAll('.zone-container');
    
    containers.forEach(container => {
        container.addEventListener('dragstart', handleDragStart);
        container.addEventListener('dragend', handleDragEnd);
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    draggedZone = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedZone = null;
}

function handleDragOver(e) {
    e.preventDefault();
    return false;
}

function handleDrop(e) {
    e.preventDefault();
    if (draggedZone && draggedZone !== this) {
        const fromZone = draggedZone.dataset.zone;
        const toZone = this.dataset.zone;
        
        const fromIndex = zoneOrder.indexOf(fromZone);
        const toIndex = zoneOrder.indexOf(toZone);
        
        [zoneOrder[fromIndex], zoneOrder[toIndex]] = [zoneOrder[toIndex], zoneOrder[fromIndex]];
        renderMonitoring();
    }
    return false;
}

// 충전기 정보 관련 함수들
function showChargerInfo(charger) {
    const modal = document.getElementById('chargerModal');
    document.getElementById('chargerId').textContent = charger.id;
    document.getElementById('chargerStatus').textContent = charger.status === 'charging' ? '충전 중' : '대기 중';
    document.getElementById('chargerPower').textContent = `${charger.power}kW`;
    document.getElementById('chargerUsage').textContent = `${charger.usage}kWh`;
    document.getElementById('chargerSoc').textContent = `${charger.soc}%`;
    modal.style.display = 'block';
}

function closeChargerModal() {
    document.getElementById('chargerModal').style.display = 'none';
}

function togglePower() {
    if (confirm('정말로 전력을 차단하시겠습니까?')) {
        alert('전력이 차단되었습니다.');
        closeChargerModal();
    }
}

function setSocLimit() {
    const socLimit = prompt('SOC 제한값을 입력하세요 (0-100%)', '80');
    if (socLimit !== null) {
        const value = parseInt(socLimit);
        if (!isNaN(value) && value >= 0 && value <= 100) {
            alert(`SOC가 ${value}%로 제한되었습니다.`);
            closeChargerModal();
        } else {
            alert('0에서 100 사이의 값을 입력해주세요.');
        }
    }
}

// 모달 닫기 이벤트
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
}

// 설정 관련 함수들
function openSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'block';
    renderSettings();
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

function renderSettings() {
    const container = document.querySelector('.zone-settings');
    container.innerHTML = '';

    zoneOrder.forEach(zone => {
        const settings = zoneSettings[zone];
        const rowHtml = `
            <div class="info-row">
                <span class="zone-name">${zone} Zone</span>
                <div class="zone-controls">
                    <label class="switch">
                        <input type="checkbox" 
                            ${settings.active ? 'checked' : ''} 
                            onchange="updateZoneActive('${zone}', this.checked)">
                        <span class="slider round"></span>
                    </label>
                    <div class="charger-count">
                        <label>충전기 수:</label>
                        <input type="number" 
                            class="number-input" 
                            min="1" 
                            max="20" 
                            value="${settings.count}"
                            onchange="updateChargerCount('${zone}', this.value)"
                            ${!settings.active ? 'disabled' : ''}>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', rowHtml);
    });
}

function updateZoneActive(zone, active) {
    zoneSettings[zone].active = active;
    const countInput = document.querySelector(`.zone-settings input[type="number"][onchange*="${zone}"]`);
    countInput.disabled = !active;
}

function updateChargerCount(zone, count) {
    const value = parseInt(count);
    if (!isNaN(value) && value >= 1 && value <= 20) {
        zoneSettings[zone].count = value;
    }
}

function saveSettings() {
    renderMonitoring();
    closeSettings();
}

// 예시 데이터
const SAMPLE_DATA = {
    stations: [
        { id: 1, name: '서울역 충전소' },
        { id: 2, name: '강남역 충전소' },
        { id: 3, name: '부산역 충전소' }
    ],
    
    // 시간대별 사용량 데이터
    usageData: {
        labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'],
        values: [20, 35, 45, 80, 65, 75, 90, 60, 30]
    },
    
    // 충전기 상태 샘플 데이터
    chargerStatus: [
        { id: 'A1', status: 'charging', percentage: 75, remainingTime: 25 },
        { id: 'A2', status: 'empty', percentage: 0, remainingTime: 0 },
        { id: 'B1', status: 'error', percentage: 0, remainingTime: 0 },
        { id: 'B2', status: 'charging', percentage: 45, remainingTime: 40 },
        { id: 'C1', status: 'empty', percentage: 0, remainingTime: 0 },
        { id: 'C2', status: 'charging', percentage: 90, remainingTime: 10 }
    ]
};

// 그래프 초기화 및 데이터 설정
function initGraph() {
    const ctx = document.getElementById('usageGraph').getContext('2d');
    const { labels, values } = SAMPLE_DATA.usageData;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '충전기 사용량',
                data: values,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                }
            }
        }
    });
}

// 충전소 선택 드롭다운 초기화
function initStationSelect() {
    const select = document.querySelector('.station-select');
    select.innerHTML = `
        <option value="">충전소 선택</option>
        ${SAMPLE_DATA.stations.map(station => 
            `<option value="${station.id}">${station.name}</option>`
        ).join('')}
    `;
}

// 달력형 상태 테이블 업데이트
function updateStatusTable() {
    const tbody = document.getElementById('statusTableBody');
    const allChargers = getZoneChargers(); // 모든 zone의 충전기 데이터 수집
    const rows = Math.ceil(allChargers.length / 7); // 7일씩 표시하는 달력 스타일
    let html = '';

    for (let row = 0; row < rows; row++) {
        html += '<tr>';
        for (let col = 0; col < 7; col++) {
            const index = row * 7 + col;
            if (index < allChargers.length) {
                const charger = allChargers[index];
                html += `
                    <td class="status-cell ${getStatusClass(charger)}">
                        <div class="charger-id">${charger.id}</div>
                        <div class="charger-status">${charger.percentage ? charger.percentage + '%' : ''}</div>
                    </td>
                `;
            } else {
                html += '<td class="status-cell empty"></td>';
            }
        }
        html += '</tr>';
    }
    tbody.innerHTML = html;
}

// Zone의 충전기 데이터 수집
function getZoneChargers() {
    const chargers = [];
    Object.entries(zoneSettings).forEach(([zone, settings]) => {
        if (settings.active) {
            for (let i = 1; i <= settings.count; i++) {
                const chargerId = `${zone}${i}`;
                const chargerData = createChargerData(chargerId); // 기존 데이터 생성 함수 활용
                chargers.push(chargerData);
            }
        }
    });
    return chargers;
}

// 상태 텍스트 반환
function getStatusText(status) {
    switch(status) {
        case 'charging': return '충전중';
        case 'empty': return '대기중';
        case 'error': return '고장';
        default: return '알수없음';
    }
}

// 충전 중인 충전기 리스트 업데이트
function updateChargingList() {
    const tbody = document.getElementById('chargingListBody');
    const chargingChargers = SAMPLE_DATA.chargerStatus.filter(c => c.status === 'charging');
    
    tbody.innerHTML = chargingChargers.map(charger => `
        <tr>
            <td>${charger.id}</td>
            <td>
                <div class="charging-progress">
                    <div class="progress-bar" style="width: ${charger.percentage}%"></div>
                </div>
                <div class="progress-text">${charger.percentage}%</div>
            </td>
            <td>${charger.remainingTime}분</td>
        </tr>
    `).join('');
}

// 데이터 자동 업데이트 (시연용)
function startAutoUpdate() {
    setInterval(() => {
        // 랜덤하게 데이터 변경
        SAMPLE_DATA.chargerStatus.forEach(charger => {
            if (charger.status === 'charging') {
                charger.percentage += Math.floor(Math.random() * 5);
                if (charger.percentage >= 100) {
                    charger.percentage = 0;
                    charger.status = 'empty';
                }
                charger.remainingTime = Math.max(0, charger.remainingTime - 1);
            } else if (charger.status === 'empty' && Math.random() > 0.8) {
                charger.status = 'charging';
                charger.percentage = 0;
                charger.remainingTime = Math.floor(Math.random() * 60) + 20;
            }
        });

        updateStatusTable();
        updateChargingList();
    }, 2000); // 2초마다 업데이트
}

// 초기화 함수
function initDashboard() {
    initStationSelect();
    initGraph();
    updateStatusTable();
    updateChargingList();
    startAutoUpdate();
}

// 초기 렌더링
document.addEventListener('DOMContentLoaded', function() {
    renderMonitoring();
    initDashboard();
});