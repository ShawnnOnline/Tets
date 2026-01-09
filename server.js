class SupGenServer {
    constructor() {
        this.STORAGE_KEY = 'supgen_v2_db';
        this.data = this._load();
    }

    _load() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) return JSON.parse(saved);
        
        return {
            users: [
                { id: 'admin-root', user: 'admin', password: 'ShawnnUhq', email: 'admin@supgen.com', isAdmin: true, lastGenerated: 0 }
            ],
            services: [
                { id: 's1', name: 'Netflix', icon: '/service_netflix.png', stock: [{ data: 'premium1@net.com:pass123', addedAt: Date.now() }, { data: 'family2@net.com:secure99', addedAt: Date.now() }] },
                { id: 's2', name: 'Spotify', icon: '/service_spotify.png', stock: [{ data: 'user@spot.com:music1', addedAt: Date.now() }, { data: 'hi@spot.com:hello', addedAt: Date.now() }] },
                { id: 's3', name: 'Disney+', icon: '/service_disney.png', stock: [{ data: 'mouse@dis.com:mickey1', addedAt: Date.now() }] }
            ],
            config: {
                cooldownMinutes: 10
            }
        };
    }

    _save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    }

    async handleRequest(action, payload) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = this._router(action, payload);
                resolve(result);
            }, 250);
        });
    }

    _router(action, payload) {
        switch (action) {
            case 'REGISTER':
                if (this.data.users.find(u => u.user === payload.username || u.email === payload.email)) {
                    return { success: false, error: 'Utilisateur déjà existant' };
                }
                const newUser = { 
                    user: payload.username,
                    id: 'u_' + Math.random().toString(36).substr(2, 9), 
                    email: payload.email,
                    password: payload.password,
                    isAdmin: false, 
                    lastGenerated: 0 
                };
                this.data.users.push(newUser);
                this._save();
                return { success: true, token: newUser.id };

            case 'LOGIN':
                const user = this.data.users.find(u => u.user === payload.username && u.password === payload.password);
                if (user) return { success: true, token: user.id, isAdmin: user.isAdmin };
                return { success: false, error: 'Identifiants invalides' };

            case 'VALIDATE_TOKEN':
                const u = this.data.users.find(u => u.id === payload.token);
                if (u) return { success: true, user: { id: u.id, username: u.user, isAdmin: u.isAdmin } };
                return { success: false };

            case 'GET_SERVICES':
                return { 
                    success: true, 
                    services: this.data.services.map(s => ({ 
                        id: s.id, 
                        name: s.name, 
                        icon: s.icon, 
                        stockCount: s.stock.length 
                    })) 
                };

            case 'GENERATE':
                const genUser = this.data.users.find(u => u.id === payload.token);
                const service = this.data.services.find(s => s.id === payload.serviceId);
                
                if (!genUser) return { success: false, error: 'Non autorisé' };
                if (!service) return { success: false, error: 'Service introuvable' };
                if (service.stock.length === 0) return { success: false, error: 'Rupture de stock' };

                const now = Date.now();
                const cooldownMs = this.data.config.cooldownMinutes * 60 * 1000;
                const timePassed = now - genUser.lastGenerated;

                if (timePassed < cooldownMs) {
                    const remaining = Math.ceil((cooldownMs - timePassed) / 1000 / 60);
                    return { success: false, error: `Veuillez patienter ${remaining} minutes` };
                }

                const accountObj = service.stock.shift();
                genUser.lastGenerated = now;
                this._save();
                return { 
                    success: true, 
                    account: accountObj.data, 
                    addedAt: accountObj.addedAt 
                };

            case 'ADMIN_UPDATE_COOLDOWN':
                this.data.config.cooldownMinutes = parseInt(payload.minutes);
                this._save();
                return { success: true };

            case 'ADMIN_ADD_SERVICE':
                this.data.services.push({
                    id: 's_' + Date.now(),
                    name: payload.name,
                    icon: payload.icon || '/service_netflix.png',
                    stock: []
                });
                this._save();
                return { success: true };

            case 'ADMIN_ADD_STOCK':
                const sIdx = this.data.services.findIndex(s => s.id === payload.serviceId);
                if (sIdx !== -1) {
                    const now = Date.now();
                    const lines = payload.stockText.split('\n')
                        .map(l => l.trim())
                        .filter(l => l.length > 0)
                        .map(data => ({ data, addedAt: now }));
                    this.data.services[sIdx].stock.push(...lines);
                    this._save();
                    return { success: true };
                }
                return { success: false, error: 'Service introuvable' };

            case 'ADMIN_DELETE_SERVICE':
                this.data.services = this.data.services.filter(s => s.id !== payload.serviceId);
                this._save();
                return { success: true };

            case 'ADMIN_GET_CONFIG':
                return { success: true, config: this.data.config, services: this.data.services };

            default:
                return { success: false, error: 'Action inconnue' };
        }
    }
}

export function createServer() {
    return new SupGenServer();
}