import useAppStore from '../../../app/app.store';
import authService from '../services/auth.service';

const useAuth = () => {
    // Individual selectors to prevent re-renders from other state changes
    const user = useAppStore((state) => state.user);
    const token = useAppStore((state) => state.token);
    const setUser = useAppStore((state) => state.setUser);
    const setToken = useAppStore((state) => state.setToken);
    const resetStore = useAppStore((state) => state.resetStore);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const register = async (name, email, password) => {
        const data = await authService.register(name, email, password);
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (e) {
            console.error("Logout failed on server", e);
        } finally {
            resetStore();
        }
    };

    return {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token
    };
};

export default useAuth;
