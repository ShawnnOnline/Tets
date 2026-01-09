export const Navbar = (state) => `
    <nav class="p-4 flex justify-between items-center border-b border-white/5 mb-6">
        <h1 class="text-2xl font-bold gradient-text">SupGen</h1>
        <div class="flex items-center gap-4">
            ${state.user?.isAdmin ? `<button onclick="window.navigate('admin')" class="text-sm opacity-70 hover:opacity-100 flex items-center gap-1"><i data-lucide="settings" class="w-4"></i> Admin</button>` : ''}
            <button onclick="window.handleLogout()" class="text-sm opacity-70 hover:opacity-100 flex items-center gap-1"><i data-lucide="log-out" class="w-4"></i> Quitter</button>
        </div>
    </nav>
`;

export const Toast = (state) => `
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
        ${state.error ? `
            <div class="bg-red-500/20 border border-red-500/50 backdrop-blur-md text-red-200 px-4 py-2 rounded-lg flex items-center gap-2 animate-bounce">
                <i data-lucide="alert-circle" class="w-4"></i> ${state.error}
            </div>
        ` : ''}
        ${state.success ? `
            <div class="bg-green-500/20 border border-green-500/50 backdrop-blur-md text-green-200 px-4 py-2 rounded-lg flex items-center gap-2 animate-bounce">
                <i data-lucide="check-circle-2" class="w-4"></i> ${state.success}
            </div>
        ` : ''}
    </div>
`;

export const LoginPage = (state) => `
    <div class="flex-1 flex items-center justify-center p-4">
        <div class="glass-card p-8 w-full max-w-md">
            <h2 class="text-3xl font-bold mb-2 text-center">Connexion</h2>
            <form onsubmit="window.handleLogin(event)" class="space-y-4 mt-6">
                <div class="relative">
                    <i data-lucide="user" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 text-white/30"></i>
                    <input type="text" name="username" placeholder="Nom d'utilisateur" required class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-indigo-500 transition-all">
                </div>
                <div class="relative">
                    <i data-lucide="lock" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 text-white/30"></i>
                    <input type="password" name="password" placeholder="Mot de passe" required class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-indigo-500 transition-all">
                </div>
                <button type="submit" class="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center">
                    ${state.loading ? '<div class="loader w-5 h-5 border-2 border-white/30 rounded-full"></div>' : 'Se connecter'}
                </button>
            </form>
            <p class="mt-6 text-center text-sm text-white/40">Pas de compte ? <button onclick="window.navigate('register')" class="text-indigo-400 hover:underline">S'inscrire</button></p>
        </div>
    </div>
`;

export const RegisterPage = (state) => `
    <div class="flex-1 flex items-center justify-center p-4">
        <div class="glass-card p-8 w-full max-w-md">
            <h2 class="text-3xl font-bold mb-2 text-center">Inscription</h2>
            <form onsubmit="window.handleRegister(event)" class="space-y-4 mt-6">
                <div class="relative">
                    <i data-lucide="user" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 text-white/30"></i>
                    <input type="text" name="username" placeholder="Nom d'utilisateur" required class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-indigo-500 transition-all">
                </div>
                <div class="relative">
                    <i data-lucide="mail" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 text-white/30"></i>
                    <input type="email" name="email" placeholder="Email" required class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-indigo-500 transition-all">
                </div>
                <div class="relative">
                    <i data-lucide="lock" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 text-white/30"></i>
                    <input type="password" name="password" placeholder="Mot de passe" required class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-indigo-500 transition-all">
                </div>
                <button type="submit" class="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center">
                    ${state.loading ? '<div class="loader w-5 h-5 border-2 border-white/30 rounded-full"></div>' : "S'inscrire"}
                </button>
            </form>
            <p class="mt-6 text-center text-sm text-white/40">Déjà un compte ? <button onclick="window.navigate('login')" class="text-indigo-400 hover:underline">Se connecter</button></p>
        </div>
    </div>
`;

export const HomePage = (state) => `
    <div class="flex-1 max-w-5xl mx-auto w-full p-4">
        ${Navbar(state)}
        <header class="mb-10 text-center">
            <h2 class="text-4xl font-extrabold mb-2">Générateur</h2>
            <p class="text-white/40">Sélectionnez votre service</p>
        </header>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            ${state.services.map(s => `
                <div onclick="window.handleGenerate('${s.id}')" class="glass-card p-6 flex flex-col items-center cursor-pointer transition-all hover:scale-105 active:scale-95 group">
                    <div class="w-20 h-20 rounded-2xl overflow-hidden mb-4 bg-white/5 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-indigo-500/50">
                        <img src="${s.icon}" alt="${s.name}" class="w-full h-full object-cover">
                    </div>
                    <h3 class="font-bold text-lg text-center">${s.name}</h3>
                    <p class="text-xs text-white/30 mt-1">${s.stockCount} comptes</p>
                </div>
            `).join('')}
        </div>
    </div>
`;

export const AdminPage = (state) => {
    if (!state.adminData) return '<div class="p-8 text-center">Chargement...</div>';
    return `
        <div class="flex-1 max-w-5xl mx-auto w-full p-4">
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-4">
                    <button onclick="window.navigate('home')" class="p-2 bg-white/5 rounded-full"><i data-lucide="refresh-cw" class="w-5 rotate-180"></i></button>
                    <h2 class="text-3xl font-bold">Panel Admin</h2>
                </div>
            </div>
            <div class="grid gap-6">
                <section class="glass-card p-6">
                    <h3 class="text-xl font-semibold mb-4 flex items-center gap-2"><i data-lucide="refresh-cw" class="text-indigo-400 w-5"></i> Cooldown</h3>
                    <form onsubmit="window.adminUpdateCooldown(event)" class="flex gap-4">
                        <input type="number" name="minutes" value="${state.adminData.config.cooldownMinutes}" class="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-indigo-500">
                        <button type="submit" class="btn-primary px-6 rounded-lg font-bold">Sauver</button>
                    </form>
                </section>

                <section class="glass-card p-6">
                    <h3 class="text-xl font-semibold mb-4 flex items-center gap-2"><i data-lucide="plus" class="text-green-400 w-5"></i> Nouveau Service</h3>
                    <form onsubmit="window.adminAddService(event)" class="grid gap-4 sm:grid-cols-2">
                        <input type="text" name="name" placeholder="Nom du service" required class="bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-indigo-500">
                        <div class="flex flex-col gap-1">
                            <label class="text-xs text-white/40 ml-1">Icone (Fichier Image)</label>
                            <input type="file" name="iconFile" accept="image/*" class="bg-white/5 border border-white/10 rounded-lg p-2 outline-none focus:border-indigo-500 text-sm">
                        </div>
                        <button type="submit" class="sm:col-span-2 btn-primary py-3 rounded-lg font-bold">Créer le Service</button>
                    </form>
                </section>

                <section class="glass-card p-6">
                    <h3 class="text-xl font-semibold mb-4 flex items-center gap-2"><i data-lucide="package" class="text-yellow-400 w-5"></i> Gestion Stock & Services</h3>
                    <div class="space-y-4">
                        ${state.adminData.services.map(s => `
                            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 gap-4">
                                <div class="flex items-center gap-3">
                                    <img src="${s.icon}" class="w-10 h-10 rounded-lg object-cover">
                                    <div>
                                        <p class="font-bold">${s.name}</p>
                                        <p class="text-xs text-white/40">${s.stock.length} comptes en stock</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2 w-full sm:w-auto">
                                    <label class="btn-primary px-3 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1">
                                        <i data-lucide="plus" class="w-3"></i> Restock .txt
                                        <input type="file" accept=".txt" class="hidden" onchange="window.adminRestockFile('${s.id}', this)">
                                    </label>
                                    <button onclick="window.adminDeleteService('${s.id}')" class="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-2 rounded-lg text-xs font-bold transition-colors">Supprimer</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
            </div>
        </div>
    `;
};

export const GeneratedModal = (state) => {
    if (!state.generatedAccount) return '';
    const date = new Date(state.generatedAccount.addedAt).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    return `
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div class="glass-card w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200">
                <button onclick="window.closeGeneratedModal()" class="absolute top-4 right-4 text-white/40 hover:text-white">
                    <i data-lucide="x" class="w-5"></i>
                </button>
                <div class="text-center">
                    <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="check-circle-2" class="text-green-400 w-8"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-1">Compte Généré !</h3>
                    <p class="text-white/40 text-sm mb-6">Ajouté le ${date}</p>
                    
                    <div class="bg-black/40 border border-white/10 rounded-xl p-4 mb-6 break-all font-mono text-indigo-300">
                        ${state.generatedAccount.account}
                    </div>

                    <button onclick="window.copyToClipboard('${state.generatedAccount.account}')" class="w-full btn-primary py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                        <i data-lucide="copy" class="w-4"></i> Copier les identifiants
                    </button>
                </div>
            </div>
        </div>
    `;
};