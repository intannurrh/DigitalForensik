// Navigation Handler
document.addEventListener('DOMContentLoaded', function() {
    
    // Check user role and redirect if needed
    checkUserRole();
    
    // Highlight active menu based on current page
    highlightActiveMenu();
    
    // Handle logout
    setupLogoutHandler();
    
    // Handle form submissions
    setupFormHandlers();
    
    // Handle search functionality
    setupSearchHandler();
    
    // Handle filter functionality
    setupFilterHandlers();
    
    // Handle table interactions
    setupTableHandlers();
    
    // Handle notification click
    setupNotificationHandler();
});

// Check user role for admin pages
function checkUserRole() {
    const currentPage = window.location.pathname.split('/').pop();
    const adminPages = ['dashboard.html', 'incoming.html', 'manajemenInsiden.html', 'finalReport.html', 'setting.html'];
    const studentPages = ['mahasiswaDashboard.html', 'mahasiswaReport.html', 'mahasiswaNewReport.html'];
    
    const userRole = localStorage.getItem('userRole');
    
    // If on admin page, check if user is IRT
    if (adminPages.includes(currentPage)) {
        if (!userRole || userRole !== 'irt') {
            alert('Access denied. This page is only for IRT Admin.');
            window.location.href = '../login.html';
            return;
        }
    }
    
    // If on student page, check if user is mahasiswa
    if (studentPages.includes(currentPage)) {
        if (!userRole || userRole !== 'mahasiswa') {
            alert('Access denied. This page is only for Students.');
            window.location.href = '../login.html';
            return;
        }
    }
}

// Highlight active menu item based on current page
function highlightActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop();
    const menuLinks = document.querySelectorAll('aside nav a');
    
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Remove all active classes first
        link.classList.remove('bg-yellow-400', 'text-gray-800', 'font-medium');
        
        // Add default classes if not active
        if (!link.classList.contains('text-gray-600')) {
            link.classList.add('text-gray-600', 'hover:bg-gray-100', 'transition');
        }
        
        // Add active classes only if it matches current page
        if (href === currentPage) {
            link.classList.remove('text-gray-600', 'hover:bg-gray-50');
            link.classList.add('bg-primary', 'text-gray-800', 'font-medium');
        }
    });
}

// Setup logout handler
function setupLogoutHandler() {
    const logoutLinks = document.querySelectorAll('a[href="../login.html"], a[href="login.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                // Clear session storage
                sessionStorage.clear();
                localStorage.clear();
                // Redirect to login
                window.location.href = '../login.html';
            }
        });
    });
}

// Setup form handlers
function setupFormHandlers() {
    // Settings form
    const settingsForm = document.querySelector('form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(settingsForm);
            const username = document.querySelector('input[type="text"]').value;
            const email = document.querySelector('input[type="email"]').value;
            
            // Show success message
            showNotification('Settings updated successfully!', 'success');
            
            // Store in localStorage
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);
        });
        
        // Cancel button
        const cancelBtn = settingsForm.querySelector('button[type="button"]');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                if (confirm('Discard changes?')) {
                    settingsForm.reset();
                }
            });
        }
    }
}

// Setup search handler
function setupSearchHandler() {
    const searchInput = document.querySelector('input[placeholder="Search"]');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            // Search in table rows
            const tableRows = document.querySelectorAll('tbody tr');
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Search in cards
            const cards = document.querySelectorAll('.grid > div');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Setup filter handlers
function setupFilterHandlers() {
    const filterSelects = document.querySelectorAll('select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            applyFilters();
        });
    });
    
    // Reset filter button
    const resetBtn = document.querySelector('button:has(.fa-rotate-right)');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            filterSelects.forEach(select => {
                select.selectedIndex = 0;
            });
            applyFilters();
        });
    }
}

function applyFilters() {
    const tableRows = document.querySelectorAll('tbody tr');
    const dateFilter = document.querySelector('select')?.value;
    const statusFilter = document.querySelectorAll('select')[2]?.value;
    
    tableRows.forEach(row => {
        let showRow = true;
        
        if (dateFilter && dateFilter !== 'Filter By') {
            const dateCell = row.querySelector('td:nth-child(4)');
            if (dateCell && !dateCell.textContent.includes(dateFilter)) {
                showRow = false;
            }
        }
        
        if (statusFilter && statusFilter !== 'Status') {
            const statusCell = row.querySelector('td:last-child span');
            if (statusCell && !statusCell.textContent.includes(statusFilter)) {
                showRow = false;
            }
        }
        
        row.style.display = showRow ? '' : 'none';
    });
}

// Setup table handlers
function setupTableHandlers() {
    // Handle attachment buttons
    const attachmentBtns = document.querySelectorAll('.fa-paperclip');
    attachmentBtns.forEach(btn => {
        btn.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Opening attachment...', 'info');
            // Open attachment modal or new window
        });
    });
    
    // Handle action buttons (thumbs up)
    const actionBtns = document.querySelectorAll('.fa-thumbs-up');
    actionBtns.forEach(btn => {
        btn.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Approve this incident?')) {
                showNotification('Incident approved successfully!', 'success');
                // Update status
            }
        });
    });
    
    // Handle row clicks
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Skip if clicking on button
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') {
                return;
            }
            
            // Highlight selected row
            tableRows.forEach(r => r.classList.remove('bg-yellow-50'));
            row.classList.add('bg-yellow-50');
            
            // Show detail if on management page
            const detailSection = document.querySelector('h3:contains("Detail Insiden")');
            if (detailSection) {
                detailSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Setup notification handler
function setupNotificationHandler() {
    const notificationBtn = document.querySelector('.fa-bell');
    if (notificationBtn) {
        notificationBtn.parentElement.addEventListener('click', function() {
            showNotificationPanel();
        });
    }
}

// Show notification panel
function showNotificationPanel() {
    const notifications = [
        { title: 'New incident reported', time: '5 minutes ago', type: 'new' },
        { title: 'Incident #00123 approved', time: '1 hour ago', type: 'success' }
    ];
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-4 z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl w-96 mt-16 mr-4">
            <div class="p-4 border-b flex justify-between items-center">
                <h3 class="font-bold text-lg">Notifications</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="max-h-96 overflow-y-auto">
                ${notifications.map(notif => `
                    <div class="p-4 border-b hover:bg-gray-50 cursor-pointer">
                        <p class="font-medium text-sm">${notif.title}</p>
                        <p class="text-xs text-gray-500 mt-1">${notif.time}</p>
                    </div>
                `).join('')}
            </div>
            <div class="p-4 text-center">
                <a href="#" class="text-yellow-500 hover:text-yellow-600 text-sm font-medium">View All</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Show notification toast
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Handle hamburger menu
const hamburgerBtn = document.querySelector('.fa-bars');
if (hamburgerBtn) {
    hamburgerBtn.parentElement.addEventListener('click', function() {
        const sidebar = document.querySelector('aside');
        sidebar.classList.toggle('-translate-x-full');
        sidebar.classList.toggle('translate-x-0');
    });
}

// Handle Open buttons in Final Report
document.addEventListener('click', function(e) {
    const openBtn = e.target.closest('button');
    if (openBtn && openBtn.textContent.includes('Open')) {
        const card = openBtn.closest('.bg-white');
        if (card) {
            const nameElement = card.querySelector('h3');
            const emailElement = card.querySelector('a[href^="mailto"]');
            
            if (nameElement && emailElement) {
                const name = nameElement.textContent;
                const email = emailElement.textContent;
                showReportModal(name, email);
            }
        }
    }
});

// Show report modal
function showReportModal(name, email) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                <h3 class="font-bold text-2xl">Final Report - ${name}</h3>
                <button class="text-gray-500 hover:text-gray-700 text-2xl" onclick="this.closest('.fixed').remove()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="p-6">
                <div class="mb-6">
                    <p class="text-gray-600 mb-2"><strong>Name:</strong> ${name}</p>
                    <p class="text-gray-600 mb-2"><strong>Email:</strong> ${email}</p>
                    <p class="text-gray-600 mb-2"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p class="text-gray-600 mb-2"><strong>Status:</strong> <span class="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">Completed</span></p>
                </div>
                
                <div class="border-t pt-6">
                    <h4 class="font-bold text-lg mb-4">Report Summary</h4>
                    <p class="text-gray-700 leading-relaxed mb-4">
                        This is a comprehensive final report for the incident reported by ${name}. 
                        The investigation has been completed and all necessary actions have been taken.
                    </p>
                    <p class="text-gray-700 leading-relaxed">
                        All evidence has been collected and documented. The case has been resolved successfully 
                        and the user's account security has been restored.
                    </p>
                </div>
                
                <div class="border-t pt-6 mt-6 flex justify-end space-x-4">
                    <button onclick="window.print()" class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition">
                        <i class="fa-solid fa-print mr-2"></i>Print
                    </button>
                    <button onclick="alert('Download started')" class="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl transition">
                        <i class="fa-solid fa-download mr-2"></i>Download PDF
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Utility function removed - using event delegation instead

// Auto-save for forms
const formInputs = document.querySelectorAll('input, textarea, select');
formInputs.forEach(input => {
    input.addEventListener('change', function() {
        const key = `autosave_${input.name || input.id}`;
        localStorage.setItem(key, input.value);
    });
    
    // Restore saved values
    const key = `autosave_${input.name || input.id}`;
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
        input.value = savedValue;
    }
});

// Pagination handlers
document.addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (btn && btn.textContent.includes('Prev')) {
        e.preventDefault();
        showNotification('Loading previous data...', 'info');
    }
    if (btn && btn.textContent.includes('Next')) {
        e.preventDefault();
        showNotification('Loading next data...', 'info');
    }
});

// Language selector
const languageSelector = document.querySelector('.fa-chevron-down')?.parentElement;
if (languageSelector) {
    languageSelector.addEventListener('click', function() {
        const languages = ['English', 'Indonesian', 'Spanish', 'French'];
        // Show language options
        showNotification('Language selector clicked', 'info');
    });
}

// User profile dropdown
const userProfile = document.querySelectorAll('.fa-chevron-down')[1]?.parentElement;
if (userProfile) {
    userProfile.addEventListener('click', function() {
        const dropdown = document.createElement('div');
        dropdown.className = 'absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50';
        dropdown.innerHTML = `
            <a href="setting.html" class="block px-4 py-2 hover:bg-gray-50">Profile Settings</a>
            <a href="#" class="block px-4 py-2 hover:bg-gray-50">Change Password</a>
            <hr class="my-1">
            <a href="login.html" class="block px-4 py-2 hover:bg-gray-50 text-red-600">Logout</a>
        `;
        
        // Remove existing dropdown
        document.querySelectorAll('.absolute.right-0.mt-2').forEach(el => el.remove());
        
        // Add new dropdown
        userProfile.style.position = 'relative';
        userProfile.appendChild(dropdown);
        
        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function handler(e) {
                if (!userProfile.contains(e.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', handler);
                }
            });
        }, 10);
    });
}

console.log('UniSafe Dashboard JavaScript loaded successfully!');
