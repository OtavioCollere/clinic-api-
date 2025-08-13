"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Procedure = void 0;
const entity_1 = require("../../../../core/entities/entity");
class Procedure extends entity_1.Entity {
    set value(value) {
        this.props.value = value;
    }
    get value() {
        return this.props.value;
    }
    set appointmentId(value) {
        this.props.appointmentId = this.appointmentId;
    }
    get appointmentId() {
        return this.props.appointmentId;
    }
    set userId(value) {
        this.props.userId = this.userId;
    }
    get userId() {
        return this.props.userId;
    }
    get name() {
        return this.props.name;
    }
    set name(value) {
        this.props.name = value;
        this.touch();
    }
    get product() {
        return this.props.product;
    }
    set product(value) {
        this.props.product = value;
        this.touch();
    }
    get region() {
        return this.props.region;
    }
    set region(value) {
        this.props.region = value;
        this.touch();
    }
    get updatedBy() {
        return this.props.updatedBy;
    }
    set updatedBy(value) {
        this.props.updatedBy = value;
        this.touch();
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    set updatedAt(value) {
        this.props.updatedAt = value;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    touch() {
        this.props.updatedAt = new Date();
    }
    static create(props, id) {
        const procedure = new Procedure({
            createdAt: props.createdAt ?? new Date(),
            ...props
        }, id);
        return procedure;
    }
}
exports.Procedure = Procedure;
//# sourceMappingURL=procedure.js.map