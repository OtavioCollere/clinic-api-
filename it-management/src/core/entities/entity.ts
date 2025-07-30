import { UniqueEntityID } from "./unique-entity-id"

export class Entity<EntityProps>{
  private _id : UniqueEntityID
  protected props: EntityProps
  
  get id() {
    return this._id
  }

  constructor(props : EntityProps, id? : UniqueEntityID){
    this._id = id ?? new UniqueEntityID()
    this.props = props;
  }
}