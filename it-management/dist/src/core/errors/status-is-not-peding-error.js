"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusIsNotPedingError = void 0;
class StatusIsNotPedingError extends Error {
    constructor() {
        super("Status must be 'pending' to edit the appointment");
    }
}
exports.StatusIsNotPedingError = StatusIsNotPedingError;
//# sourceMappingURL=status-is-not-peding-error.js.map