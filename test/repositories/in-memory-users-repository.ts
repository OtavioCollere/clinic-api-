import type { UsersRepository } from "src/domain/management/application/repositories/users-repository";
import { User } from "src/domain/management/enterprise/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<User> {
    this.items.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
	return this.items.find(user => user.email === email) || null;
  }

  async findById(id: string): Promise<User | null> {
	return this.items.find((user) => user.id.toString() === id) || null;
  }

  async save(user: User): Promise<void> {
	const index = this.items.findIndex(u => u.id.toString() === user.id.toString());
	if (index !== -1) {
	  this.items[index] = user;
	}
  }

  async delete(id: string): Promise<void> {
	this.items = this.items.filter(user => user.id.toString() !== id);
  }
}