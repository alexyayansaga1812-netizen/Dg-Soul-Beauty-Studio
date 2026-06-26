/* ==========================================
   Dg soul beauty studio - JavaScript Functionality
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --------------------------------------------------
    // 1. Navigation & Scroll Effects
    // --------------------------------------------------
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
  // Admin UI elements
  const adminBtn = document.getElementById('adminBtn');
  const adminDashboard = document.getElementById('admin-dashboard');
  const adminStatsBody = document.getElementById('admin-stats-body');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  const adminDetail = document.getElementById('admin-detail');
  const adminBackBtn = document.getElementById('adminBackBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle hamburger icon animation/text if needed
            const isActive = navLinks.classList.contains('active');
            navToggle.innerHTML = isActive 
                ? '&#x2715;' // Close Unicode character (X)
                : '&#x2630;'; // Hamburger Unicode character
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.innerHTML = '&#x2630;';
            });
        });
    }

    // --------------------------------------------------
    // 2. Services Tabs — Exclusive (one open at a time)
    // --------------------------------------------------
    const tabBtns = document.querySelectorAll('.tab-btn');
    const serviceGrids = document.querySelectorAll('.services-grid');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetCategory = btn.getAttribute('data-tab');
            const matchingGrid = document.getElementById(`${targetCategory}-services`);
            if (!matchingGrid) return;

            const isAlreadyOpen = btn.classList.contains('active');

            // Close all tabs first
            tabBtns.forEach(b => b.classList.remove('active'));
            serviceGrids.forEach(g => g.classList.remove('active'));

            if (!isAlreadyOpen) {
                // Open the clicked one
                btn.classList.add('active');
                matchingGrid.classList.add('active');
            }
        });
    });


    // --------------------------------------------------
    // 3. Interactive Budget Calculator & Reservation Form
    // --------------------------------------------------
    const serviceCheckboxes = document.querySelectorAll('.service-checkbox');
    const summaryItemsContainer = document.getElementById('summaryItems');
    const totalPriceDisplay = document.getElementById('totalPrice');
    const bookingForm = document.getElementById('bookingForm');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    const clientNameSpan = document.getElementById('clientName');

    const servicePrices = {
        // Pestañas
        'lifting-pestanas': { name: 'Lifting de Pestañas', price: 200 },
        'pestanas-hibridas': { name: 'Pestañas Híbridas', price: 350 },
        'retoque-hibridas': { name: 'Retoque Híbridas', price: 220 },
        'pestanas-griegas': { name: 'Pestañas Griegas', price: 380 },
        'retoque-griegas': { name: 'Retoque Griegas', price: 250 },
        'pestanas-egipcias': { name: 'Pestañas Egipcias', price: 480 },
        'retoque-egipcias': { name: 'Retoque Egipcias', price: 300 },
        'pestanas-wispy': { name: 'Pestañas Wispy', price: 500 },
        'retoque-wispy': { name: 'Retoque Wispy', price: 320 },
        'retiro-pestanas': { name: 'Retiro de Pestañas', price: 100 },
        // Uñas
        'unas-gelish': { name: 'Gelish', price: 150 },
        'unas-softgel': { name: 'Soft Gel', price: 200 },
        'unas-acrilicas': { name: 'Uñas Acrílicas', price: 280 },
        'unas-retiro': { name: 'Retiro de Uñas', price: 100 },
        // Cabello (precio por longitud = 0)
        'alaciado-tailandes': { name: 'Alaciado Tailandés', price: 0 },
        'keratina-pura': { name: 'Keratina Pura', price: 0 },
        'alaciado-japones': { name: 'Alaciado Japonés', price: 0 },
        'nanoplastia': { name: 'Nanoplastia', price: 0 },
        'taninoplastia': { name: 'Taninoplastia', price: 0 },
        'ultra-nano-mango': { name: 'Ultra Nano Mango', price: 0 },
        'efecto-seda': { name: 'Efecto Seda', price: 0 },
        'encerado-chocolate': { name: 'Encerado de Chocolate', price: 0 },
        'tratamiento-caribeño': { name: 'Tratamiento Caribeño', price: 0 },
        // Otros Servicios
        'pedi-gelish': { name: 'Pedi + Gelish', price: 250 },
        'pedi-spa': { name: 'Pedi Spa + Gelish', price: 380 },
        'laminado-ceja': { name: 'Laminado de Ceja', price: 200 }
    };

    function updateCalculator() {
        let total = 0;
        summaryItemsContainer.innerHTML = ''; // Clear previous items

        let hasSelectedServices = false;

        serviceCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                hasSelectedServices = true;
                const serviceKey = checkbox.value;
                const serviceInfo = servicePrices[serviceKey];
                
                if (serviceInfo) {
                    total += serviceInfo.price;

                    // Create item row in summary
                    const li = document.createElement('li');
                    const priceDisplay = serviceInfo.price > 0 ? `$${serviceInfo.price}.00` : '<span style="font-size:0.75rem;">Por longitud</span>';
                    li.innerHTML = `
                        <span>${serviceInfo.name}</span>
                        <span>${priceDisplay}</span>
                    `;
                    summaryItemsContainer.appendChild(li);
                }
            }
        });

        // If no services selected, show placeholder text
        if (!hasSelectedServices) {
            summaryItemsContainer.innerHTML = `
                <li style="border-bottom: none; text-align: center; color: var(--clr-text-muted);">
                    Selecciona al menos un servicio para cotizar
                </li>
            `;
        }

        // Animate price change
        animatePriceValue(total);
    }

    // Smooth price animation helper
    let currentAnimatedPrice = 0;
    function animatePriceValue(targetPrice) {
        const duration = 300; // ms
        const start = currentAnimatedPrice;
        const end = targetPrice;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad formula
            const ease = progress * (2 - progress);
            const value = Math.round(start + (end - start) * ease);
            
            totalPriceDisplay.textContent = `$${value}.00`;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                currentAnimatedPrice = end;
                totalPriceDisplay.textContent = `$${end}.00`;
            }
        }
        
        requestAnimationFrame(update);
    }

    // Attach click listeners to all checkboxes
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCalculator);
    });

    // Run once at start to verify empty state is styled correctly
    updateCalculator();

    // --------------------------------------------------
    // 4. Form Submission Handling (Success Modal)
    // --------------------------------------------------
    // --------------------------------------------------
    // Local DB & Session Helpers
    // --------------------------------------------------
    function getUsers() {
        return JSON.parse(localStorage.getItem('dg_studio_users')) || {};
    }

    function saveUsers(users) {
        localStorage.setItem('dg_studio_users', JSON.stringify(users));
    }

    function getUnregisteredVisits() {
        return JSON.parse(localStorage.getItem('dg_studio_unregistered_visits')) || [];
    }

    function saveUnregisteredVisits(visits) {
        localStorage.setItem('dg_studio_unregistered_visits', JSON.stringify(visits));
    }

    function getLoggedInUser() {
        return JSON.parse(localStorage.getItem('dg_studio_logged_in_user')) || null;
    }

    function setLoggedInUser(user) {
        if (user) {
            localStorage.setItem('dg_studio_logged_in_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('dg_studio_logged_in_user');
        }
    }

    // --------------------------------------------------
    // 4. Form Submission Handling (Success Modal & Visit Record)
    // --------------------------------------------------
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent standard page reload
            
            // Validate that at least one service is selected
            const selectedServices = Array.from(serviceCheckboxes).some(cb => cb.checked);
            if (!selectedServices) {
                alert('Por favor, selecciona al menos un servicio de uñas o pelo para cotizar tu cita.');
                return;
            }

            // Extract client info
            const nameInput = document.getElementById('name');
            const clientName = nameInput ? nameInput.value.trim() : 'Cliente';
            
            const phoneInput = document.getElementById('whatsapp');
            const clientPhone = phoneInput ? phoneInput.value.trim() : 'No especificado';

            const emailInput = document.getElementById('bookingEmail');
            const clientEmail = emailInput ? emailInput.value.trim().toLowerCase() : '';

            const dateInput = document.getElementById('date');
            const bookingDate = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];
            
            // Get selected services
            const selectedServiceNamesArr = Array.from(serviceCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => servicePrices[cb.value] ? servicePrices[cb.value].name : cb.value);

            const selectedServiceNamesStr = selectedServiceNamesArr.join(', ');

            if (clientNameSpan) {
                clientNameSpan.textContent = clientName;
            }

            // Record the visit
            const newVisit = {
                date: bookingDate,
                services: selectedServiceNamesArr
            };

            const loggedInUser = getLoggedInUser();
            if (loggedInUser) {
                const users = getUsers();
                const userInDb = users[loggedInUser.email];
                if (userInDb) {
                    if (!userInDb.visits) userInDb.visits = [];
                    userInDb.visits.push(newVisit);
                    users[loggedInUser.email] = userInDb;
                    saveUsers(users);
                    setLoggedInUser(userInDb);
                }
            } else {
                const users = getUsers();
                let matchedUserKey = null;
                for (const key in users) {
                    if (users[key].email === clientEmail || users[key].phone === clientPhone) {
                        matchedUserKey = key;
                        break;
                    }
                }

                if (matchedUserKey) {
                    const userInDb = users[matchedUserKey];
                    if (!userInDb.visits) userInDb.visits = [];
                    userInDb.visits.push(newVisit);
                    users[matchedUserKey] = userInDb;
                    saveUsers(users);
                } else {
                    const unregisteredVisits = getUnregisteredVisits();
                    unregisteredVisits.push({
                        name: clientName,
                        phone: clientPhone,
                        email: clientEmail,
                        date: bookingDate,
                        services: selectedServiceNamesArr
                    });
                    saveUnregisteredVisits(unregisteredVisits);
                }
            }

            // Update session UI details if profile panel is opened
            const updatedUser = getLoggedInUser();
            if (updatedUser) {
                renderProfilePanel(updatedUser);
            }

            // Create WhatsApp message
            const whatsappNumber = '525573923128';
            const message = `Hola Dg soul beauty studio! Me gustaría agendar una cita.\nNombre: ${clientName}\nTeléfono: ${clientPhone}\nTratamientos deseados: ${selectedServiceNamesStr}`;

            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

            // Open the success popup modal
            if (successModal) {
                successModal.classList.add('active');
            }
        });
    }

    // Close modal logic
    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            
            // Reset the form (keep values if logged in)
            if (bookingForm) {
                const loggedInUser = getLoggedInUser();
                bookingForm.reset();
                if (loggedInUser) {
                    updateAuthUI(); // restores name, phone, email fields to read-only values
                }
            }
            
            // Reset all checkboxes and update the calculator
            serviceCheckboxes.forEach(cb => cb.checked = false);
            updateCalculator();
        });

        // Close modal when clicking outside content area
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                if (bookingForm) {
                    const loggedInUser = getLoggedInUser();
                    bookingForm.reset();
                    if (loggedInUser) updateAuthUI();
                }
                serviceCheckboxes.forEach(cb => cb.checked = false);
                updateCalculator();
            }
        });
    }

    // --------------------------------------------------
    // 5. Authentication & Session Flow Logic
    // --------------------------------------------------
    const authBtn = document.getElementById('authBtn');
    const authBtnText = document.getElementById('authBtnText');
    const authModal = document.getElementById('authModal');
    const authModalClose = document.getElementById('authModalClose');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');

    const profilePanel = document.getElementById('profilePanel');
    const profileOverlay = document.getElementById('profileOverlay');
    const profilePanelClose = document.getElementById('profilePanelClose');
    const profileName = document.getElementById('profileName');
    const profilePhone = document.getElementById('profilePhone');
    const profileEmail = document.getElementById('profileEmail');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileVisits = document.getElementById('profileVisits');
    const logoutBtn = document.getElementById('logoutBtn');

    function updateAuthUI() {
        const loggedInUser = getLoggedInUser();
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('whatsapp');
        const emailInput = document.getElementById('bookingEmail');

        if (loggedInUser) {
            if (authBtn) authBtn.classList.add('logged-in');
            if (authBtnText) authBtnText.textContent = loggedInUser.name;
            
            if (nameInput) {
                nameInput.value = loggedInUser.name;
                nameInput.readOnly = true;
                nameInput.style.opacity = '0.85';
            }
            if (phoneInput) {
                phoneInput.value = loggedInUser.phone;
                phoneInput.readOnly = true;
                phoneInput.style.opacity = '0.85';
            }
            if (emailInput) {
                emailInput.value = loggedInUser.email;
                emailInput.readOnly = true;
                emailInput.style.opacity = '0.85';
            }
        } else {
            if (authBtn) authBtn.classList.remove('logged-in');
            if (authBtnText) authBtnText.textContent = 'Iniciar / Crear Sesión';
            
            if (nameInput) {
                nameInput.readOnly = false;
                nameInput.style.opacity = '1';
            }
            if (phoneInput) {
                phoneInput.readOnly = false;
                phoneInput.style.opacity = '1';
            }
            if (emailInput) {
                emailInput.readOnly = false;
                emailInput.style.opacity = '1';
            }
        }
    }

    function logout() {
        setLoggedInUser(null);
        updateAuthUI();

        // Clear booking form fields
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('whatsapp');
        const emailInput = document.getElementById('bookingEmail');
        if (nameInput) nameInput.value = '';
        if (phoneInput) phoneInput.value = '';
        if (emailInput) emailInput.value = '';

        // Close profile panel
        if (profilePanel) profilePanel.classList.remove('active');
        if (profileOverlay) profileOverlay.classList.remove('active');
    }

    

function renderAdminDashboard() {
    const users = getUsers();
    const nameToPrice = {};
    Object.values(servicePrices).forEach(s => { nameToPrice[s.name] = s.price; });
    adminStatsBody.innerHTML = '';
    Object.values(users).forEach(user => {
        const visits = user.visits || [];
        const visitCount = visits.length;
        let lastVisit = '';
        if (visitCount > 0) {
            const sorted = [...visits].sort((a,b) => new Date(b.date) - new Date(a.date));
            lastVisit = new Date(sorted[0].date).toLocaleDateString('es-ES');
        }
        let totalSpent = 0;
        visits.forEach(v => { v.services.forEach(sName => { totalSpent += nameToPrice[sName] || 0; }); });
        const row = document.createElement('tr');
        row.dataset.userId = user.email; // unique identifier
        row.innerHTML = `<td>${user.name}</td><td>${visitCount}</td><td>${lastVisit}</td><td>$${totalSpent}</td>`;
        row.addEventListener('click', () => renderAdminDetail(user));
        adminStatsBody.appendChild(row);
    });
}

function renderAdminDetail(user) {
    const detailDiv = document.getElementById('admin-detail-content');
    if (!detailDiv) return;
    let html = `<h2>${user.name}</h2>`;
    html += `<p><strong>Teléfono:</strong> ${user.phone}</p>`;
    html += `<p><strong>Correo:</strong> ${user.email}</p>`;
    const visitCount = (user.visits && user.visits.length) || 0;
    html += `<p><strong>Total visitas:</strong> ${visitCount}</p>`;
    html += `<h3>Visitas</h3>`;
    if (visitCount === 0) {
        html += '<p>No hay visitas registradas.</p>';
    } else {
        html += '<ul>';
        const sorted = [...user.visits].reverse();
        sorted.forEach(v => {
            let dateStr = v.date;
            try { const d = new Date(v.date + "T00:00:00"); dateStr = d.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); } catch(e) {}
            const services = v.services.join(', ');
            html += `<li><strong>${dateStr}:</strong> ${services}</li>`;
        });
        html += '</ul>';
    }
    detailDiv.innerHTML = html;
    // Switch panels
    adminDashboard.classList.add('hidden');
    adminDetail.classList.remove('hidden');
}

adminBackBtn && adminBackBtn.addEventListener('click', () => {
    adminDetail.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
});

if (adminBtn) {
    // Helper to generate a simple HTML page with aggregate admin statistics
    const generateAdminHTML = () => {
        const users = getUsers();
        let totalVisits = 0;
        let lastVisit = '';
        const treatmentsSet = new Set();
        for (const userKey in users) {
            const user = users[userKey];
            const visits = user.visits || [];
            totalVisits += visits.length;
            visits.forEach(v => {
                // Track last visit date
                if (!lastVisit || new Date(v.date) > new Date(lastVisit)) {
                    lastVisit = v.date;
                }
                // Collect treatment names
                v.services.forEach(s => treatmentsSet.add(s));
            });
        }
        const treatmentsList = Array.from(treatmentsSet).join(', ');
        const formattedLastVisit = lastVisit ? new Date(lastVisit).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
        return `
            <html><head><title>Admin Summary</title>
            <style>body{font-family:Arial,sans-serif;padding:20px;background:#f9f9f9;}h1{color:#333;}p{margin:5px 0;}</style>
            </head><body>
            <h1>Resumen de Administrador</h1>
            <p><strong>Total de visitas:</strong> ${totalVisits}</p>
            <p><strong>Última visita:</strong> ${formattedLastVisit}</p>
            <p><strong>Tratamientos realizados:</strong> ${treatmentsList || 'Ninguno'}</p>
            </body></html>`;
    };

    adminBtn.addEventListener('click', () => {
    const pwd = prompt('Enter admin password:');
    if (pwd === 'Dianaestefania') {
        // Hide the admin button after successful login
        adminBtn.style.display = 'none';
        // Open a new window with client statistics
        const win = window.open('', 'AdminData', 'width=900,height=600');
        const users = getUsers();
        const nameToPrice = {};
        Object.values(servicePrices).forEach(s => { nameToPrice[s.name] = s.price; });
        let html = `
            <html>
            <head>
                <title>Datos de Clientes</title>
                <style>
                    body {font-family:Arial,sans-serif;padding:20px;background:#fafafa;}
                    table {width:100%;border-collapse:collapse;margin-top:20px;}
                    th, td {border:1px solid #ccc;padding:8px;text-align:left;}
                    th {background:#eee;}
                </style>
            </head>
            <body>
                <h2>Resumen de Clientes</h2>
                <table>
                     <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Correo</th>
                            <th>Visitas</th>
                            <th>Última visita</th>
                            <th>Detalle Tratamientos</th>
                            <th>Total gastado</th>
                        </tr>
                     </thead>
                    <tbody>`;
        Object.values(users).forEach(user => {
            const visits = user.visits || [];
            const visitCount = visits.length;
            let lastVisit = 'N/A';
            if (visitCount > 0) {
                const sorted = [...visits].sort((a,b) => new Date(b.date) - new Date(a.date));
                lastVisit = new Date(sorted[0].date).toLocaleDateString('es-ES');
            }
            let totalSpent = 0;
            // Count total spent and per-treatment occurrences
            const treatmentCounts = {};
            visits.forEach(v => {
                v.services.forEach(sName => {
                    totalSpent += nameToPrice[sName] || 0;
                    treatmentCounts[sName] = (treatmentCounts[sName] || 0) + 1;
                });
            });
            // Build a summary string like "Corte(2), Pintura(1)"
            const treatmentSummary = Object.entries(treatmentCounts)
                .map(([name, cnt]) => `${name}(${cnt})`)
                .join(', ');

            html += `<tr>
                        <td>${user.name}</td>
                        <td>${user.phone}</td>
                        <td>${user.email}</td>
                        <td>${visitCount}</td>
                        <td>${lastVisit}</td>
                        <td>${treatmentSummary}</td>
                        <td>$${totalSpent}</td>
                    </tr>`;
        });
        html += `
                    </tbody>
                </table>
            </body>
            </html>`;
        win.document.write(html);
        win.document.close();
    } else {
        alert('Incorrect password');
    }
});
}

if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
        if (adminDashboard) adminDashboard.classList.add('hidden');
    });
}

function renderProfilePanel(user) {
    if (profileName) profileName.textContent = user.name;
    if (profilePhone) profilePhone.textContent = user.phone;
    if (profileEmail) profileEmail.textContent = user.email;
    if (profileAvatar) {
        const initials = user.name.split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
        profileAvatar.textContent = initials || '--';
    }

    if (profileVisits) {
        profileVisits.innerHTML = '';
        if (!user.visits || user.visits.length === 0) {
            const li = document.createElement('li');
            li.className = 'profile-visit-empty';
            li.innerHTML = `Aún no tienes visitas registradas.<br><small>Cuando reserves una cita, aparecerá aquí.</small>`;
            profileVisits.appendChild(li);
        } else {
            const sortedVisits = [...user.visits].reverse();
            sortedVisits.forEach(visit => {
                const li = document.createElement('li');
                
                // Format date beautifully if possible
                let formattedDate = visit.date;
                try {
                    const dateObj = new Date(visit.date + 'T00:00:00');
                    formattedDate = dateObj.toLocaleDateString('es-ES', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    });
                } catch (e) {
                    formattedDate = visit.date;
                }

                li.innerHTML = `
                    <span class="visit-date">📅 ${formattedDate}</span>
                    <span class="visit-services">${visit.services.join(', ')}</span>
                `;
                profileVisits.appendChild(li);
            });
        }
    }
}

    function switchTab(tab) {
        if (tab === 'login') {
            if (tabLogin) tabLogin.classList.add('active');
            if (tabRegister) tabRegister.classList.remove('active');
            if (loginForm) loginForm.classList.add('active');
            if (registerForm) registerForm.classList.remove('active');
        } else {
            if (tabRegister) tabRegister.classList.add('active');
            if (tabLogin) tabLogin.classList.remove('active');
            if (registerForm) registerForm.classList.add('active');
            if (loginForm) loginForm.classList.remove('active');
        }
    }

    // Modal Trigger Listeners
    if (authBtn) {
        authBtn.addEventListener('click', () => {
            const loggedInUser = getLoggedInUser();
            if (loggedInUser) {
                renderProfilePanel(loggedInUser);
                if (profilePanel) profilePanel.classList.add('active');
                if (profileOverlay) profileOverlay.classList.add('active');
            } else {
                if (authModal) authModal.classList.add('active');
                if (loginError) loginError.textContent = '';
                if (registerError) registerError.textContent = '';
                switchTab('login');
            }
        });
    }


    // Close Auth Modal
    if (authModalClose && authModal) {
        authModalClose.addEventListener('click', () => {
            authModal.classList.remove('active');
        });
    }

    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.classList.remove('active');
            }
        });
    }

    // Close Profile Panel
    if (profilePanelClose && profilePanel && profileOverlay) {
        profilePanelClose.addEventListener('click', () => {
            profilePanel.classList.remove('active');
            profileOverlay.classList.remove('active');
        });
    }

    if (profileOverlay && profilePanel) {
        profileOverlay.addEventListener('click', () => {
            profilePanel.classList.remove('active');
            profileOverlay.classList.remove('active');
        });
    }

    // Switch Tabs Click Listeners
    if (tabLogin) {
        tabLogin.addEventListener('click', () => {
            switchTab('login');
            if (loginError) loginError.textContent = '';
        });
    }
    if (tabRegister) {
        tabRegister.addEventListener('click', () => {
            switchTab('register');
            if (registerError) registerError.textContent = '';
        });
    }

    // Form Submissions
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('loginName').value.trim().toLowerCase();
            const phone = document.getElementById('loginPhone').value.trim();

            if (!name || !phone) {
                if (loginError) loginError.textContent = 'Por favor, llena todos los campos.';
                return;
            }

            const users = getUsers();
            const user = Object.values(users).find(u => u.name.toLowerCase() === name && u.phone === phone);

            if (user) {
                setLoggedInUser(user);
                updateAuthUI();
                loginForm.reset();
                if (authModal) authModal.classList.remove('active');
            } else {
                if (loginError) loginError.textContent = 'Nombre o teléfono incorrectos, o cuenta inexistente.';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const phone = document.getElementById('regPhone').value.trim();
            const email = document.getElementById('regEmail').value.trim().toLowerCase();

            if (!name || !phone || !email) {
                if (registerError) registerError.textContent = 'Por favor, llena todos los campos.';
                return;
            }

            const users = getUsers();

            const emailExists = Object.values(users).some(u => u.email === email);
            const phoneExists = Object.values(users).some(u => u.phone === phone);

            if (emailExists || phoneExists) {
                if (registerError) registerError.textContent = 'El correo o número de teléfono ya está registrado.';
                return;
            }

            // Create new profile
            const newUser = {
                name: name,
                phone: phone,
                email: email,
                visits: []
            };

            // Migrate unregistered visits matching phone or email
            let unregisteredVisits = getUnregisteredVisits();
            const matchingVisits = unregisteredVisits.filter(v => v.email === email || v.phone === phone);
            matchingVisits.forEach(v => {
                newUser.visits.push({
                    date: v.date,
                    services: v.services
                });
            });

            // Remove matching from unregistered visits database
            unregisteredVisits = unregisteredVisits.filter(v => v.email !== email && v.phone !== phone);
            saveUnregisteredVisits(unregisteredVisits);

            // Save to DB & Log in
            users[email] = newUser;
            saveUsers(users);
            setLoggedInUser(newUser);
            updateAuthUI();

            registerForm.reset();
            if (authModal) authModal.classList.remove('active');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Initialize UI Auth State on Load
    updateAuthUI();
});
