import { UsersRepository } from "src/domain/management/application/repositories/users-repository";
import { User } from "src/domain/management/enterprise/entities/user";
import { PrismaService } from "../prisma.service";
export declare class PrismaUsersRepository implements UsersRepository {
    private prismaService;
    constructor(prismaService: PrismaService);
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<void>;
    delete(id: string): Promise<void>;
}
