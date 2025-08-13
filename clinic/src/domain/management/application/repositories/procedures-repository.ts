import { Procedure } from "../../enterprise/entities/procedure";

export interface QueryParams{
  query? : string
  page? : number
}

export abstract class ProceduresRepository {
  abstract create(procedure : Procedure) : Promise<Procedure>
  abstract save(procedure : Procedure) : Promise<Procedure>
  abstract findById(id : string) : Promise<Procedure | null>
  abstract getAll({query, page} : QueryParams ) : Promise<Procedure[]>
  abstract findByUserId(userId : string) : Promise<Procedure[]>
}