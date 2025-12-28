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
});