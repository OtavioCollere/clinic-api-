-- CreateEnum
CREATE TYPE "clinic"."ProcedureName" AS ENUM ('BOTOX', 'PREENCHIMENTO', 'LAVIEEN');

-- CreateTable
CREATE TABLE "clinic"."Procedure" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "updatedById" TEXT,
    "name" "clinic"."ProcedureName" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "product" TEXT,
    "region" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Procedure_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "clinic"."Procedure" ADD CONSTRAINT "Procedure_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "clinic"."Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic"."Procedure" ADD CONSTRAINT "Procedure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "clinic"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic"."Procedure" ADD CONSTRAINT "Procedure_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "clinic"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
