// ========================================
// ROTA DA FARDA - Script Principal v2.0
// Sistema de Autenticação + Conteúdo Bloqueado
// ========================================

class ThemeManager {
    constructor() {
        this.html = document.documentElement;
        this.body = document.body;
        this.storageKey = 'rota-farda-theme';
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem(this.storageKey) || 'light';
        this.setTheme(savedTheme);
        
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }
    }

    setTheme(theme) {
        if (theme === 'dark') {
            this.html.classList.add('dark');
            this.body.classList.add('dark-mode');
            if (document.getElementById('darkModeToggle')) {
                document.getElementById('darkModeToggle').querySelector('span').textContent = '☀️';
            }
        } else {
            this.html.classList.remove('dark');
            this.body.classList.remove('dark-mode');
            if (document.getElementById('darkModeToggle')) {
                document.getElementById('darkModeToggle').querySelector('span').textContent = '🌙';
            }
        }
        localStorage.setItem(this.storageKey, theme);
    }

    toggle() {
        const current = localStorage.getItem(this.storageKey) || 'light';
        this.setTheme(current === 'dark' ? 'light' : 'dark');
    }
}

// ========================================
// Authentication Manager
// ========================================
class AuthManager {
    constructor() {
        this.storageKey = 'usuarioPMMG';
        this.init();
    }

    init() {
        const userBtn = document.getElementById('userBtn');
        const nomeUsuario = this.getUser();

        if (userBtn) {
            if (nomeUsuario) {
                userBtn.innerHTML = `<span class="text-neon-green">✅ ${nomeUsuario}</span>`;
                userBtn.style.cursor = 'pointer';
                userBtn.onclick = () => this.logout();
            } else {
                userBtn.onclick = () => window.location.href = 'login.html';
            }
        }

        this.checkLockedContent();
    }

    getUser() {
        return localStorage.getItem(this.storageKey) || 
               localStorage.getItem('nome') || 
               localStorage.getItem('usuarioLogado');
    }

    logout() {
        if (confirm('Deseja fazer logout?')) {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem('nome');
            localStorage.removeItem('usuarioLogado');
            window.location.reload();
        }
    }

    checkLockedContent() {
        const user = this.getUser();
        const lockedElements = document.querySelectorAll('[data-locked="true"]');

        lockedElements.forEach((el, index) => {
            // Primeira aula (index 0) sempre desbloqueada
            if (index === 0) {
                el.style.opacity = '1';
                el.style.pointerEvents = 'auto';
                el.classList.remove('locked-content');
            } else {
                // Aulas 2+ precisam de login
                if (!user) {
                    el.classList.add('locked-content');
                    el.innerHTML = `
                        <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); border-radius: 8px;">
                            <div style="text-align: center; color: white;">
                                <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
                                <p style="margin-bottom: 1rem; font-weight: bold;">Conteúdo Bloqueado</p>
                                <p style="margin-bottom: 1.5rem; font-size: 0.9rem;">Faça login para acessar</p>
                                <a href="login.html" style="display: inline-block; padding: 0.75rem 1.5rem; background: #4ade80; color: #0b0f1a; border-radius: 0.5rem; font-weight: bold; text-decoration: none; cursor: pointer;">
                                    Fazer Login
                                </a>
                            </div>
                        </div>
                    `;
                    el.style.pointerEvents = 'none';
                }
            }
        });
    }
}

// ========================================
// Progress Manager
// ========================================
class ProgressManager {
    constructor() {
        this.storageKey = 'rota-farda-progress';
        this.subjects = ['portugues', 'matematica', 'direito', 'ingles'];
        this.init();
    }

    init() {
        this.loadProgress();
    }

    loadProgress() {
        const progress = JSON.parse(localStorage.getItem(this.storageKey)) || {};
        
        this.subjects.forEach(subject => {
            const percentage = progress[subject] || 0;
            const progressEl = document.getElementById(`progresso-${subject === 'portugues' ? 'pt' : subject === 'matematica' ? 'mat' : subject === 'direito' ? 'dir' : 'ing'}`);
            const barEl = document.getElementById(`barra-${subject === 'portugues' ? 'pt' : subject === 'matematica' ? 'mat' : subject === 'direito' ? 'dir' : 'ing'}`);

            if (progressEl) progressEl.textContent = percentage + '%';
            if (barEl) barEl.style.width = percentage + '%';
        });
    }

    updateProgress(subject, percentage) {
        const progress = JSON.parse(localStorage.getItem(this.storageKey)) || {};
        progress[subject] = Math.min(100, percentage);
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
        this.loadProgress();
    }
}

// ========================================
// Utils
// ========================================
class Utils {
    static smoothScroll(target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }

    static getLastScore() {
        return localStorage.getItem('ultimo_score_portugues') || '--';
    }

    static setLastScore(score) {
        localStorage.setItem('ultimo_score_portugues', score);
    }
}

// ========================================
// Initialize on DOM Ready
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa gerenciadores
    new ThemeManager();
    new AuthManager();
    new ProgressManager();

    // Setup smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                Utils.smoothScroll(target);
            }
        });
    });

    // Debug helpers (pode remover em produção)
    window.clearAllData = () => {
        localStorage.clear();
        alert('Todos os dados foram limpos!');
        location.reload();
    };

    window.viewStorage = () => {
        console.log('LocalStorage Data:', localStorage);
    };
});
