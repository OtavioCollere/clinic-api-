"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidIntervalError = void 0;
class InvalidIntervalError extends Error {
    constructor({ existentAppointment, startHour, endHour }) {
        super(`Invalid interval error: there is already an appointment at ${existentAppointment.dateHour.toISOString()} that conflicts with interval ${startHour.toISOString()} - ${endHour.toISOString()}`);
    }
}
exports.InvalidIntervalError = InvalidIntervalError;
//# sourceMappingURL=invalid-interval-error.js.map