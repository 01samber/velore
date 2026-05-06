const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'super_admin' },
    update: {},
    create: { name: 'super_admin', description: 'Full access' }
  })

  await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', description: 'Admin access' }
  })

  // Needed by backend auth flow (customers default to role_id=3 in schema)
  await prisma.role.upsert({
    where: { name: 'customer' },
    update: {},
    create: { name: 'customer', description: 'Customer role' }
  })

  const hash = await bcrypt.hash('SuperAdmin123!', 10)

  const admin = await prisma.admin.upsert({
    where: { email: 'superadmin@velore.com' },
    update: {},
    create: {
      email: 'superadmin@velore.com',
      password_hash: hash,
      name: 'Super Admin',
      role_id: superAdminRole.role_id
    }
  })

  // eslint-disable-next-line no-console
  console.log('✅ Seed complete')
  // eslint-disable-next-line no-console
  console.log('✅ Super admin ready:', admin.email)
  // eslint-disable-next-line no-console
  console.log('🔑 Password: SuperAdmin123!')
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error('Seed error:', e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

