import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@checkvet.com' },
    update: {},
    create: {
      email: 'admin@checkvet.com',
      passwordHash: adminPassword,
      fullName: 'Administrador CheckVet',
      phone: '(11) 99999-0000',
      role: 'ADMIN',
      clinicName: 'CheckVet Hospital Veterinário',
      status: 'ACTIVE',
    },
  });
  console.log(`Admin created: ${admin.email}`);

  // Create veterinarian user
  const vetPassword = await bcrypt.hash('123456', 12);
  const vet = await prisma.user.upsert({
    where: { email: 'vet@checkvet.com' },
    update: {},
    create: {
      email: 'vet@checkvet.com',
      passwordHash: vetPassword,
      fullName: 'Dr. João Silva',
      phone: '(11) 98765-4321',
      role: 'VETERINARIAN',
      crmv: 'SP-12345',
      specialization: 'GENERAL',
      clinicName: 'CheckVet Hospital Veterinário',
      status: 'ACTIVE',
    },
  });
  console.log(`Vet created: ${vet.email}`);

  // Create second vet
  const vet2 = await prisma.user.upsert({
    where: { email: 'ana@checkvet.com' },
    update: {},
    create: {
      email: 'ana@checkvet.com',
      passwordHash: vetPassword,
      fullName: 'Dra. Ana Costa',
      phone: '(11) 91234-5678',
      role: 'VETERINARIAN',
      crmv: 'SP-67890',
      specialization: 'CARDIOLOGY',
      clinicName: 'CheckVet Hospital Veterinário',
      status: 'ACTIVE',
    },
  });
  console.log(`Vet created: ${vet2.email}`);

  // Create protocols
  const generalExam = await prisma.protocol.upsert({
    where: { id: 'protocol-general-exam' },
    update: {},
    create: {
      id: 'protocol-general-exam',
      name: 'Exame Clínico Geral',
      description: 'Protocolo padrão para exame clínico geral em cães e gatos',
      type: 'GENERAL_EXAM',
      items: {
        create: [
          { name: 'Anamnese completa', order: 1, isRequired: true },
          { name: 'Aferição de temperatura', order: 2, isRequired: true },
          { name: 'Auscultação cardíaca', order: 3, isRequired: true },
          { name: 'Auscultação pulmonar', order: 4, isRequired: true },
          { name: 'Palpação abdominal', order: 5, isRequired: true },
          { name: 'Avaliação de mucosas', order: 6, isRequired: true },
          { name: 'Teste de hidratação (TPC)', order: 7, isRequired: true },
          { name: 'Escore de condição corporal', order: 8, isRequired: false },
          { name: 'Registro em prontuário', order: 9, isRequired: true },
          { name: 'Orientações ao tutor', order: 10, isRequired: true },
        ],
      },
    },
  });
  console.log(`Protocol created: ${generalExam.name}`);

  const vaccination = await prisma.protocol.upsert({
    where: { id: 'protocol-vaccination' },
    update: {},
    create: {
      id: 'protocol-vaccination',
      name: 'Protocolo de Vacinação',
      description: 'Protocolo para vacinação de cães e gatos',
      type: 'VACCINATION',
      items: {
        create: [
          { name: 'Anamnese completa', order: 1, isRequired: true },
          { name: 'Aferição de temperatura', order: 2, isRequired: true },
          { name: 'Exame clínico prévio', order: 3, isRequired: true },
          { name: 'Vacinação polivalente', order: 4, isRequired: true },
          { name: 'Vacinação antirrábica', order: 5, isRequired: false },
          { name: 'Vermifugação', order: 6, isRequired: false },
          { name: 'Registro em carteira de vacinação', order: 7, isRequired: true },
          { name: 'Orientações ao tutor', order: 8, isRequired: true },
          { name: 'Agendamento de retorno', order: 9, isRequired: true },
          { name: 'Registro em prontuário', order: 10, isRequired: true },
        ],
      },
    },
  });
  console.log(`Protocol created: ${vaccination.name}`);

  const emergency = await prisma.protocol.upsert({
    where: { id: 'protocol-emergency' },
    update: {},
    create: {
      id: 'protocol-emergency',
      name: 'Atendimento de Emergência',
      description: 'Protocolo para atendimento de emergência',
      type: 'EMERGENCY',
      items: {
        create: [
          { name: 'Triagem e avaliação inicial', order: 1, isRequired: true },
          { name: 'Estabilização do paciente', order: 2, isRequired: true },
          { name: 'Aferição de sinais vitais', order: 3, isRequired: true },
          { name: 'Acesso venoso', order: 4, isRequired: true },
          { name: 'Exames laboratoriais de urgência', order: 5, isRequired: true },
          { name: 'Diagnóstico por imagem (se necessário)', order: 6, isRequired: false },
          { name: 'Medicação de emergência', order: 7, isRequired: true },
          { name: 'Monitoramento contínuo', order: 8, isRequired: true },
          { name: 'Assinatura do termo de consentimento', order: 9, isRequired: true },
          { name: 'Registro em prontuário', order: 10, isRequired: true },
        ],
      },
    },
  });
  console.log(`Protocol created: ${emergency.name}`);

  const preSurgery = await prisma.protocol.upsert({
    where: { id: 'protocol-pre-surgery' },
    update: {},
    create: {
      id: 'protocol-pre-surgery',
      name: 'Pré-operatório Completo',
      description: 'Protocolo pré-operatório completo',
      type: 'PRE_SURGERY',
      items: {
        create: [
          { name: 'Exames laboratoriais pré-operatórios', order: 1, isRequired: true },
          { name: 'Eletrocardiograma', order: 2, isRequired: true },
          { name: 'Avaliação anestésica', order: 3, isRequired: true },
          { name: 'Jejum pré-operatório confirmado', order: 4, isRequired: true },
          { name: 'Assinatura do termo de consentimento', order: 5, isRequired: true },
          { name: 'Registro em prontuário', order: 6, isRequired: true },
        ],
      },
    },
  });
  console.log(`Protocol created: ${preSurgery.name}`);

  const postSurgery = await prisma.protocol.upsert({
    where: { id: 'protocol-post-surgery' },
    update: {},
    create: {
      id: 'protocol-post-surgery',
      name: 'Acompanhamento Pós-cirúrgico',
      description: 'Protocolo de acompanhamento pós-cirúrgico',
      type: 'POST_SURGERY',
      items: {
        create: [
          { name: 'Monitoramento pós-anestésico', order: 1, isRequired: true },
          { name: 'Aferição de sinais vitais', order: 2, isRequired: true },
          { name: 'Avaliação da ferida cirúrgica', order: 3, isRequired: true },
          { name: 'Prescrição de medicação', order: 4, isRequired: true },
          { name: 'Orientações de cuidados ao tutor', order: 5, isRequired: true },
          { name: 'Agendamento de retorno', order: 6, isRequired: true },
          { name: 'Registro em prontuário', order: 7, isRequired: true },
        ],
      },
    },
  });
  console.log(`Protocol created: ${postSurgery.name}`);

  // Create an owner with a patient
  const owner = await prisma.owner.upsert({
    where: { id: 'owner-demo-1' },
    update: {},
    create: {
      id: 'owner-demo-1',
      fullName: 'Maria Santos',
      email: 'maria@email.com',
      phone: '(11) 98765-4321',
      address: 'Rua das Flores, 123 - São Paulo',
    },
  });
  console.log(`Owner created: ${owner.fullName}`);

  const patient = await prisma.patient.upsert({
    where: { id: 'patient-demo-1' },
    update: {},
    create: {
      id: 'patient-demo-1',
      name: 'Rex',
      ownerId: owner.id,
      species: 'CANINE',
      breed: 'Golden Retriever',
      gender: 'MALE',
      age: '3 anos',
      weight: 32.5,
    },
  });
  console.log(`Patient created: ${patient.name}`);

  // Create system settings
  await prisma.systemSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      hospitalName: 'CheckVet Hospital Veterinário',
      emailNotifications: true,
      smsNotifications: false,
      adherenceThreshold: 80,
      autoBackup: true,
      backupFrequency: 'DAILY',
      requireDocumentation: true,
      allowEditing: true,
    },
  });
  console.log('System settings created');

  console.log('\nSeed completed successfully!');
  console.log('\nDemo credentials:');
  console.log('  Admin: admin@checkvet.com / 123456');
  console.log('  Vet:   vet@checkvet.com / 123456');
  console.log('  Vet 2: ana@checkvet.com / 123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
