"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueEntityID = void 0;
const node_crypto_1 = require("node:crypto");
class UniqueEntityID {
    constructor(value) {
        this.value = value ?? (0, node_crypto_1.randomUUID)();
    }
    toString() {
        return this.value;
    }
    toValue() {
        return this.value;
    }
}
exports.UniqueEntityID = UniqueEntityID;
//# sourceMappingURL=unique-entity-id.js.map