import { User as PrismaUser, type Prisma } from '@prisma/client';
import { User } from 'src/domain/management/enterprise/entities/user';
export declare class PrismaUserMapper {
    static toDomain(raw: PrismaUser): User;
    static toPrisma(user: User): Prisma.UserUncheckedCreateInput;
}
