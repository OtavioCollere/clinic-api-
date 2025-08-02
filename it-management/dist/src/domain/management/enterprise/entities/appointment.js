"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const entity_1 = require("../../../../core/entities/entity");
class Appointment extends entity_1.Entity {
    static create(props, id) {
        const appointment = new Appointment({
            status: 'PENDING',
            createdAt: props.createdAt ?? new Date(),
            ...props
        }, id);
        return appointment;
    }
    get userId() {
        return this.props.userId.toString();
    }
    get name() {
        return this.props.name;
    }
    set name(value) {
        this.props.name = value;
        this.touch();
    }
    get description() {
        return this.props.description;
    }
    set description(value) {
        this.props.description = value;
        this.touch();
    }
    get duration() {
        return this.props.duration;
    }
    set duration(value) {
        this.props.duration = value;
        this.touch();
    }
    get status() {
        return this.props.status;
    }
    set status(value) {
        this.props.status = value;
        this.touch();
    }
    get dateHour() {
        return this.props.dateHour;
    }
    set dateHour(value) {
        this.props.dateHour = value;
        this.touch();
    }
    get updatedBy() {
        return this.props.updatedBy;
    }
    set updatedBy(value) {
        this.props.updatedBy = value;
        this.touch();
    }
    get createdAt() {
        return this.props.createdAt;
    }
    set createdAt(value) {
        this.props.createdAt = value;
        this.touch();
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    set updatedAt(value) {
        this.props.updatedAt = value;
        this.touch();
    }
    touch() {
        this.props.updatedAt = new Date();
    }
}
exports.Appointment = Appointment;
//# sourceMappingURL=appointment.js.map