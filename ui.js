import { createIcons, User, Lock, Mail, Server, Plus, LogOut, Settings, Package, RefreshCw, AlertCircle, CheckCircle2, Copy, X } from 'lucide';
import * as Templates from './ui_templates.js';

export function createUI(server) {
    const app = document.getElementById('app');
    let state = {
        currentPage: 'login',
        user: null,
        token: localStorage.getItem('supgen_token'),
        loading: false,
        error: null,
        success: null,
        services: [],
        adminData: null,
        generatedAccount: null
    };

    const setState = (newState) => {
        state = { ...state, ...newState };
        render();
    };

    const showToast = (msg, type = 'error') => {
        if (type === 'error') {
            setState({ error: msg });
            setTimeout(() => setState({ error: null }), 3000);
        } else {
            setState({ success: msg });
            setTimeout(() => setState({ success: null }), 3000);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('supgen_token');
        setState({ user: null, token: null, currentPage: 'login' });
    };

    // tombstone: removed Navbar() template
    // tombstone: removed Toast() template
    // tombstone: removed LoginPage() template
    // tombstone: removed RegisterPage() template
    // tombstone: removed HomePage() template
    // tombstone: removed AdminPage() template
    // tombstone: removed GeneratedModal() template

    const render = () => {
        let content = '';
        switch (state.currentPage) {
            case 'login': content = Templates.LoginPage(state); break;
            case 'register': content = Templates.RegisterPage(state); break;
            case 'home': content = Templates.HomePage(state); break;
            case 'admin': content = Templates.AdminPage(state); break;
        }
        app.innerHTML = content + Templates.Toast(state) + Templates.GeneratedModal(state);
        createIcons({ icons: { User, Lock, Mail, Server, Plus, LogOut, Settings, Package, RefreshCw, AlertCircle, CheckCircle2, Copy, X } });
    };

    window.handleLogin = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        setState({ loading: true });
        const res = await server.handleRequest('LOGIN', data);
        setState({ loading: false });
        if (res.success) {
            localStorage.setItem('supgen_token', res.token);
            setState({ token: res.token, user: { isAdmin: res.isAdmin }, currentPage: 'home' });
            initHome();
        } else showToast(res.error);
    };

    window.handleRegister = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        setState({ loading: true });
        const res = await server.handleRequest('REGISTER', data);
        setState({ loading: false });
        if (res.success) {
            localStorage.setItem('supgen_token', res.token);
            setState({ token: res.token, user: { isAdmin: false }, currentPage: 'home' });
            initHome();
        } else showToast(res.error);
    };

    window.handleGenerate = async (serviceId) => {
        setState({ loading: true });
        const res = await server.handleRequest('GENERATE', { token: state.token, serviceId });
        setState({ loading: false });
        if (res.success) {
            setState({ 
                generatedAccount: { 
                    account: res.account, 
                    addedAt: res.addedAt 
                } 
            });
            showToast('Généré avec succès !', 'success');
            initHome();
        } else showToast(res.error);
    };

    window.closeGeneratedModal = () => {
        setState({ generatedAccount: null });
    };

    window.copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showToast('Copié !', 'success');
    };

    window.adminUpdateCooldown = async (e) => {
        e.preventDefault();
        const res = await server.handleRequest('ADMIN_UPDATE_COOLDOWN', { minutes: e.target.minutes.value });
        if (res.success) { showToast('Mis à jour', 'success'); initAdmin(); }
    };

    window.adminAddService = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const iconFile = e.target.iconFile.files[0];
        let iconData = '/service_netflix.png';

        if (iconFile) {
            iconData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (ev) => resolve(ev.target.result);
                reader.readAsDataURL(iconFile);
            });
        }

        const res = await server.handleRequest('ADMIN_ADD_SERVICE', { name, icon: iconData });
        if (res.success) { showToast('Service ajouté', 'success'); e.target.reset(); initAdmin(); }
    };

    window.adminRestockFile = async (serviceId, input) => {
        const file = input.files[0];
        if (!file) return;
        
        const text = await file.text();
        const res = await server.handleRequest('ADMIN_ADD_STOCK', { serviceId, stockText: text });
        if (res.success) { 
            showToast('Stock mis à jour', 'success'); 
            initAdmin(); 
        } else {
            showToast(res.error);
        }
    };

    window.adminDeleteService = async (serviceId) => {
        if (!confirm('Supprimer ce service et tout son stock ?')) return;
        const res = await server.handleRequest('ADMIN_DELETE_SERVICE', { serviceId });
        if (res.success) {
            showToast('Service supprimé', 'success');
            initAdmin();
        }
    };

    window.navigate = (page) => {
        if (page === 'admin') initAdmin();
        if (page === 'home') initHome();
        setState({ currentPage: page });
    };

    window.handleLogout = handleLogout;

    const initHome = async () => {
        const res = await server.handleRequest('GET_SERVICES');
        if (res.success) setState({ services: res.services });
    };

    const initAdmin = async () => {
        const res = await server.handleRequest('ADMIN_GET_CONFIG');
        if (res.success) setState({ adminData: res });
    };

    return {
        init: async () => {
            if (state.token) {
                const res = await server.handleRequest('VALIDATE_TOKEN', { token: state.token });
                if (res.success) {
                    setState({ user: res.user, currentPage: 'home' });
                    initHome();
                } else {
                    localStorage.removeItem('supgen_token');
                    setState({ token: null, currentPage: 'login' });
                }
            }
            render();
        }
    };
}