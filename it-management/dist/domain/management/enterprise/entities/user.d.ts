import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import type { Optional } from "src/core/types/optional";
export interface UserProps {
    name: string;
    email: string;
    sector: string;
    password: string;
    updatedAt?: Date;
    createdAt?: Date;
}
export declare class User extends Entity<UserProps> {
    private touch;
    get name(): string;
    set name(value: string);
    get email(): string;
    set email(value: string);
    get sector(): string;
    set sector(value: string);
    get password(): string;
    set password(value: string);
    get updatedAt(): Date | undefined;
    get createdAt(): Date | undefined;
    static create(props: Optional<UserProps, 'updatedAt' | 'createdAt'>, id?: UniqueEntityID): User;
}
