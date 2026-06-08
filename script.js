(function() {
    // កំណត់គោលដៅ: ថ្ងៃទី 10 ខែសីហា (ខែ 8)
    const TARGET_MONTH = 7; // ខែសីហា = 7 (ព្រោះរាប់ពី 0: 0=មករា)
    const TARGET_DAY = 10;
    
    let targetDate = null;
    let intervalId = null;
    
    function getNextAugust10() {
        const today = new Date();
        let year = today.getFullYear();
        // បង្កើតកាលបរិច្ឆេទគោលដៅក្នុងឆ្នាំនេះ
        let candidate = new Date(year, TARGET_MONTH, TARGET_DAY, 0, 0, 0);
        
        // ប្រសិនបើថ្ងៃនេះកន្លងផុតថ្ងៃ 10/8 រួច ឬស្មើគ្នា (ចង់រាប់ទៅឆ្នាំក្រោយ)
        if (today >= candidate) {
            // ទៅឆ្នាំក្រោយ
            candidate = new Date(year + 1, TARGET_MONTH, TARGET_DAY, 0, 0, 0);
        }
        return candidate;
    }
    
    function updateCountdown() {
        if (!targetDate) return;
        
        const now = new Date();
        const diffMs = targetDate - now;
        
        // ប្រសិនបើដល់ពេលហើយ
        if (diffMs <= 0) {
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            const msgDiv = document.getElementById('message');
            msgDiv.innerHTML = '🎉 ថ្ងៃទី 10 សីហាបានមកដល់ហើយ! 🎉';
            msgDiv.style.background = '#ffe6b3';
            
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            return;
        }
        
        // គណនាថ្ងៃ ម៉ោង នាទី វិនាទី
        const totalSeconds = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // បង្ហាញជាទម្រង់ 2 ខ្ទង់
        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
        
        // បង្ហាញសារធម្មតា
        const msgDiv = document.getElementById('message');
        if (msgDiv.innerHTML.includes('បានមកដល់')) {
            msgDiv.innerHTML = 'កំពុងរាប់...';
            msgDiv.style.background = '';
        }
    }
    
    function init() {
        targetDate = getNextAugust10();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = targetDate.toLocaleDateString('km-KH', options);
        document.getElementById('targetDateDisplay').innerText = `ថ្ងៃទី 10 សីហា (${formattedDate})`;
        
        updateCountdown(); // បង្ហាញភ្លាម
        intervalId = setInterval(updateCountdown, 1000);
    }
    
    init();
})();
