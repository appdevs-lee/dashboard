// 설정 및 데이터
const SAMPLE_DATA = {
    stations: [
        { id: 1, name: '서울역 충전소' },
        { id: 2, name: '강남역 충전소' },
        { id: 3, name: '부산역 충전소' }
    ],
    
    usageData: {
        labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'],
        values: [20, 35, 45, 80, 65, 75, 90, 60, 30]
    }
};

let zoneSettings = {
    A: { active: false, count: 6 },
    B: { active: false, count: 4 },
    C: { active: true, count: 6 },
    D: { active: true, count: 8 }
};

let zoneOrder = ['D', 'C', 'B', 'A'];