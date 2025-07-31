import { UniqueEntityID } from "./unique-entity-id";
export declare class Entity<EntityProps> {
    private _id;
    protected props: EntityProps;
    get id(): UniqueEntityID;
    constructor(props: EntityProps, id?: UniqueEntityID);
}
