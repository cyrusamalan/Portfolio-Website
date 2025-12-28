document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.job-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 1. Remove 'active' class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // 2. Add 'active' class to clicked tab
            tab.classList.add('active');

            // 3. Show corresponding content
            const target = document.querySelector(tab.getAttribute('data-target'));
            target.classList.add('active');
        });
    });

    // --- 3. Typewriter Effect ---
    
    const textId = 'typewriter-text';
    const element = document.getElementById(textId);
    
    if (element) {
        // The text you want to type
        const textToType = "I am a Data-driven Finance Professional with 3+ years of experience in Data Engineering and Quantitative Modeling. I leverage SQL, Python, and AWS to automate financial reporting and assess the health of complex initiatives.";
        
        let i = 0;
        const speed = 30; // Speed in milliseconds (lower is faster)
        const startDelay = 1500; // Wait 1.5s before starting (after hero animations)

        function typeWriter() {
            if (i < textToType.length) {
                element.textContent += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                // Optional: Remove cursor when done
                // element.classList.remove('cursor');
            }
        }

        // Start the typing loop after the delay
        setTimeout(typeWriter, startDelay);
    }
});