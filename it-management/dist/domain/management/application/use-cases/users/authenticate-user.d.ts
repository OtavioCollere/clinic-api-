import { type Either } from "src/core/either/either";
import { WrongCredentialsError } from "src/core/errors/wrong-credentials-error";
import type { UsersRepository } from "../../repositories/users-repository";
import type { HashComparer } from "../../cryptography/hash-comparer";
import type { Encrypter } from "../../cryptography/encrypter";
export declare class AuthenticatheUserUseCaseRequest {
    email: string;
    password: string;
}
type AuthenticatheUserUseCaseResponse = Either<WrongCredentialsError, {
    accessToken: string;
}>;
export declare class AuthenticatheUserUseCase {
    private usersRepository;
    private hashComparer;
    private encrypter;
    constructor(usersRepository: UsersRepository, hashComparer: HashComparer, encrypter: Encrypter);
    execute({ email, password }: AuthenticatheUserUseCaseRequest): Promise<AuthenticatheUserUseCaseResponse>;
}
export {};
