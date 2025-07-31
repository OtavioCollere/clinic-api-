export declare abstract class HashGenerator {
    abstract hash(plainText: string): Promise<string>;
}
