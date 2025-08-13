"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("@nestjs/jwt");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../../../../app.module");
const database_module_1 = require("../../../../database/database.module");
const prisma_service_1 = require("../../../../database/prisma/prisma.service");
const supertest_1 = require("supertest");
const make_appointment_1 = require("../../../../../../test/factories/make-appointment");
const make_user_1 = require("../../../../../../test/factories/make-user");
const vitest_1 = require("vitest");
(0, vitest_1.describe)('Reschedule appointment (E2E)', () => {
    let app;
    let appointmentFactory;
    let userFactory;
    let jwt;
    let prisma;
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule, database_module_1.DatabaseModule],
            providers: [make_user_1.UserFactory, make_appointment_1.AppointmentFactory],
        }).compile();
        app = moduleRef.createNestApplication();
        prisma = moduleRef.get(prisma_service_1.PrismaService);
        appointmentFactory = moduleRef.get(make_appointment_1.AppointmentFactory);
        userFactory = moduleRef.get(make_user_1.UserFactory);
        jwt = moduleRef.get(jwt_1.JwtService);
        await app.init();
    });
    (0, vitest_1.it)('[PATCH] /appointments/reschedule', async () => {
        const user = await userFactory.makePrismaUser({
            name: 'Otavio',
        });
        const access_token = jwt.sign({
            sub: user.id.toString(),
        });
        const appointment = await appointmentFactory.makePrismaAppointment({
            userId: user.id,
            name: 'Consulta inicial',
            duration: 30,
            dateHour: new Date(Date.now() + 60 * 60 * 1000),
        });
        const newDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
        const result = await (0, supertest_1.default)(app.getHttpServer())
            .patch('/appointments/reschedule')
            .send({
            appointmentId: appointment.id.toString(),
            userId: user.id.toString(),
            name: 'Consulta reagendada',
            duration: 45,
            description: 'Paciente pediu novo horário',
            dateHour: newDate.toISOString(),
        })
            .set('Authorization', `Bearer ${access_token}`);
        (0, vitest_1.expect)(result.statusCode).toEqual(200);
        const updatedAppointment = await prisma.appointment.findUnique({
            where: {
                id: appointment.id.toString(),
            },
        });
        (0, vitest_1.expect)(updatedAppointment.status).toEqual('RESCHEDULED');
        (0, vitest_1.expect)(updatedAppointment.name).toEqual('Consulta reagendada');
        (0, vitest_1.expect)(new Date(updatedAppointment.dateHour).getTime()).toEqual(newDate.getTime());
    });
});
//# sourceMappingURL=reeschedule-appointment.js.map