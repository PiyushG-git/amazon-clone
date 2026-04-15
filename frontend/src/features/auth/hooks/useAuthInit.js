import { useEffect, useRef } from 'react';
import useAppStore from '../../../app/app.store';
import authService from '../services/auth.service';

const useAuthInit = () => {
    const token = useAppStore((state) => state.token);
    const setUser = useAppStore((state) => state.setUser);
    const setAuthLoading = useAppStore((state) => state.setAuthLoading);
    const resetStore = useAppStore((state) => state.resetStore);

    // Use a ref to track if we've already initialized for this token
    const initializedRef = useRef(false);

    useEffect(() => {
        // Reset on each new token change
        initializedRef.current = false;
    }, [token]);

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        const initAuth = async () => {
            if (!token) {
                setAuthLoading(false);
                return;
            }

            try {
                const user = await authService.getMe();
                setUser(user);
            } catch (error) {
                console.error("Auth initialization failed", error);
                resetStore();
            } finally {
                setAuthLoading(false);
            }
        };

        initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);
};

export default useAuthInit;
