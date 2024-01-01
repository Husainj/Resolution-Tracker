document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resolutionForm');
    const input = document.getElementById('newResolution');
    const prioritySelect = document.getElementById('priority');
    const deadlineInput = document.getElementById('deadline');
    const resolutionList = document.getElementById('resolutionList');
    const progressBar = document.getElementById('progressBar').querySelector('div');
    const progressDisplay = document.getElementById('progressDisplay');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const clearAllButton = document.getElementById('clearAll');

    let resolutions = JSON.parse(localStorage.getItem('resolutions')) || [];
    let darkMode = localStorage.getItem('darkMode') === 'true';

    updateList();
    updateDarkMode();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addResolution(input.value, prioritySelect.value, deadlineInput.value);
        input.value = '';
        deadlineInput.value = '';
    });

    resolutionList.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            toggleResolution(e.target.dataset.id);
        }
    });

    darkModeToggle.addEventListener('change', function() {
        darkMode = !darkMode;
        localStorage.setItem('darkMode', darkMode);
        updateDarkMode();
    });

    clearAllButton.addEventListener('click', function() {
        resolutions = [];
        updateList();
        saveToLocalStorage();
    });

    function addResolution(text, priority, deadline) {
        if (text) {
            const resolution = { id: Date.now(), text, priority, deadline, completed: false };
            resolutions.push(resolution);
            updateList();
            saveToLocalStorage();
        }
    }

    function toggleResolution(id) {
        resolutions = resolutions.map(resolution =>
            resolution.id === parseInt(id) ? { ...resolution, completed: !resolution.completed } : resolution
        );
        updateList();
        saveToLocalStorage();
    }

    function updateList() {
        resolutionList.innerHTML = resolutions.map(resolution => {
            const formattedDate = resolution.deadline ? ` - Due by ${new Date(resolution.deadline).toDateString()}` : '';
            return `<li class="${resolution.completed ? 'completed ' : ''}${resolution.priority}" data-id="${resolution.id}">
                        ${resolution.text}${formattedDate}
                    </li>`;
        }).join('');

        updateProgressBar();
    }

    function updateProgressBar() {
        const total = resolutions.length;
        const completed = resolutions.filter(resolution => resolution.completed).length;
        const progress = total ? Math.round((completed / total) * 100) : 0;

        progressBar.style.width = `${progress}%`;
        progressDisplay.textContent = `Progress: ${progress}%`;
    }

    function saveToLocalStorage() {
        localStorage.setItem('resolutions', JSON.stringify(resolutions));
    }

    function updateDarkMode() {
        if (darkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            darkModeToggle.checked = false;
        }
    }
});
