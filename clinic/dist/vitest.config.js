"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unplugin_swc_1 = require("unplugin-swc");
const config_1 = require("vitest/config");
const vite_tsconfig_paths_1 = require("vite-tsconfig-paths");
exports.default = (0, config_1.defineConfig)({
    root: './src',
    test: {
        globals: true,
        include: ['**/*.test.ts', '**/*.spec.ts'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '../data/**',
            '**/data/**',
        ],
        watchExclude: ['**/data/**', '../data/**'],
    },
    server: {
        watch: {
            ignored: ['**/data/**', '../data/**'],
        },
    },
    plugins: [
        (0, vite_tsconfig_paths_1.default)(),
        unplugin_swc_1.default.vite({ module: { type: 'es6' } }),
    ],
});
//# sourceMappingURL=vitest.config.js.map