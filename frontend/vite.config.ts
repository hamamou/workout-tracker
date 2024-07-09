import {TanStackRouterVite} from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import {defineConfig} from 'vite';

export default defineConfig({
    plugins: [react(), TanStackRouterVite()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
    resolve: {
        alias: {
            '@server': new URL('../server', import.meta.url).pathname,
            '@lib': new URL('./src/lib', import.meta.url).pathname,
        },
    },
});
