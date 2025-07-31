import { Either } from "src/core/either/either";
import { User } from "src/domain/management/enterprise/entities/user";
import { EmailAlreadyExistsError } from "src/core/errors/email-already-exists-error";
import { HashGenerator } from "../../cryptography/hash-generator";
import { UsersRepository } from "../../repositories/users-repository";
interface RegisterUserUseCaseRequest {
    name: string;
    email: string;
    password: string;
    sector: string;
}
type RegisterUserUseCaseResponse = Either<EmailAlreadyExistsError, {
    user: User;
}>;
export declare class RegisterUserUseCase {
    private usersRepository;
    private hashGenerator;
    constructor(usersRepository: UsersRepository, hashGenerator: HashGenerator);
    execute({ name, email, password, sector }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse>;
}
export {};
