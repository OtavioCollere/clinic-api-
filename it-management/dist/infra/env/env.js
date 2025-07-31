"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.default.object({
    PORT: zod_1.default.coerce.number().default(3333),
    DATABASE_URL: zod_1.default.string().url(),
    PRIVATE_KEY: zod_1.default.string(),
    PUBLIC_KEY: zod_1.default.string()
});
//# sourceMappingURL=env.js.map