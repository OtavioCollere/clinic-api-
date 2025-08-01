"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../../../app.module");
const prisma_service_1 = require("../../../database/prisma/prisma.service");
const supertest_1 = require("supertest");
describe('Register User (E2E)', () => {
    let app;
    let prisma;
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        prisma = moduleRef.get(prisma_service_1.PrismaService);
        await app.init();
    });
    it("[POST] /users", async () => {
        const result = await (0, supertest_1.default)(app.getHttpServer()).post('/users').send({
            name: 'John Doe',
            email: 'jondoe@email.com',
            password: 'jondoe123',
            sector: 'comercial'
        });
        expect(result.statusCode).toEqual(201);
        const userOnDatabase = await prisma.user.findUnique({
            where: {
                email: 'jondoe@email.com'
            }
        });
        expect(userOnDatabase.name).toEqual('John Doe');
        expect(result.body).toEqual({
            user: {
                id: userOnDatabase.id,
            }
        });
    });
});
//# sourceMappingURL=register-user.js.map