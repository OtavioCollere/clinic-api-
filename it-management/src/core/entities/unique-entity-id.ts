import { randomUUID } from "node:crypto"

export class UniqueEntityID{
  private value : string

  constructor(id? : string) {
      this.value = id ?? randomUUID()
  }

  get id() {
    return this.value
  }

  toString() {
    return this.value
  }
}