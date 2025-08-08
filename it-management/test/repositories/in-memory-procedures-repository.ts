import type { ProceduresRepository } from "src/domain/management/application/repositories/procedures-repository";
import { Procedure } from "src/domain/management/enterprise/entities/procedure";

export class InMemoryProceduresRepository implements ProceduresRepository {
  public items: Procedure[] = [];

  async create(procedure: Procedure): Promise<Procedure> {
    this.items.push(procedure);
    return procedure;
  }

  async findById(id: string): Promise<Procedure | null> {
    return this.items.find((procedure) => procedure.id.toString() === id) || null;
  }

  async findByUserId(userId: string): Promise<Procedure[]> {
    return this.items.filter((procedure) => procedure.userId.toString() === userId);
  }

  async save(procedure: Procedure): Promise<Procedure> {
    const index = this.items.findIndex((p) => p.id.toString() === procedure.id.toString());
    if (index !== -1) {
      this.items[index] = procedure;
    } else {
      this.items.push(procedure);
    }
    return procedure;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((procedure) => procedure.id.toString() !== id);
  }

  async getAll(): Promise<Procedure[]> {
    return this.items;
  }
}
