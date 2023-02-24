import { useEffect } from 'react';

export default function useTailwindLayout() {
    useEffect(() => {
        const body = document.querySelector('body');
        body?.classList.add('tailwind-layout');
        return () => {
            body?.classList.remove('tailwind-layout');
        }
    }, []);
}