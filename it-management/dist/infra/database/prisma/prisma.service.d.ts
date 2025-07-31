import { type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "generated/prisma";
export declare class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit {
    constructor();
    onModuleDestroy(): () => import("generated/prisma/runtime/library").JsPromise<void>;
    onModuleInit(): () => import("generated/prisma/runtime/library").JsPromise<void>;
}
