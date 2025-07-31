export declare abstract class HashComparer {
    abstract compare(value: string, hashedPassword: string): Promise<boolean>;
}
