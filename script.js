(function() {
    const TARGET_MONTH = 7; // សីហា = 7
    const TARGET_DAY = 10;
    
    let targetDate = null;
    let intervalId = null;
    
    function getNextAugust10() {
        const today = new Date();
        let year = today.getFullYear();
        let candidate = new Date(year, TARGET_MONTH, TARGET_DAY, 0, 0, 0);
        
        if (today >= candidate) {
            candidate = new Date(year + 1, TARGET_MONTH, TARGET_DAY, 0, 0, 0);
        }
        return candidate;
    }
    
    function updateCountdown() {
        if (!targetDate) return;
        
        const now = new Date();
        const diffMs = targetDate - now;
        
        if (diffMs <= 0) {
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            const msgDiv = document.getElementById('message');
            msgDiv.innerHTML = '🎉 ថ្ងៃទី 10 សីហាបានមកដល់ហើយ! សូមអបអរសាទរ 🎉';
            msgDiv.style.background = '#ffe0b5';
            
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            return;
        }
        
        const totalSeconds = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
        
        const msgDiv = document.getElementById('message');
        if (!msgDiv.innerHTML.includes('បានមកដល់')) {
            msgDiv.innerHTML = '⏳ នៅសល់ពេលវេលាដូចបង្ហាញខាងលើ';
        }
    }
    
    function init() {
        targetDate = getNextAugust10();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = targetDate.toLocaleDateString('km-KH', options);
        document.getElementById('targetDateDisplay').innerHTML = `📅 ថ្ងៃកំណត់៖ 10 សីហា (${formattedDate})`;
        
        updateCountdown();
        intervalId = setInterval(updateCountdown, 1000);
    }
    
    init();
})();
