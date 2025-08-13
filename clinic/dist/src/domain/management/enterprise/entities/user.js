"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const entity_1 = require("../../../../core/entities/entity");
class User extends entity_1.Entity {
    touch() {
        this.props.updatedAt = new Date();
    }
    get name() {
        return this.props.name;
    }
    set name(value) {
        this.props.name = value;
        this.touch();
    }
    get email() {
        return this.props.email;
    }
    set email(value) {
        this.props.email = value;
        this.touch();
    }
    get sector() {
        return this.props.sector;
    }
    set sector(value) {
        this.props.sector = value;
        this.touch();
    }
    get password() {
        return this.props.password;
    }
    set password(value) {
        this.props.password = value;
        this.touch();
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    static create(props, id) {
        const user = new User({
            createdAt: props.updatedAt ?? new Date(),
            ...props
        }, id);
        return user;
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map