import { PrismaClient, UserRole, ProjectStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        passwordHash: await bcrypt.hash(adminPassword, 12),
        role: UserRole.ADMIN,
        firstName: 'Admin',
        lastName: 'User'
      }
    });

    console.log('Admin user created:', adminUser.email);

    // Create project categories
    const categories = [
      'Education',
      'Healthcare',
      'Infrastructure',
      'Agriculture',
      'Technology',
      'Environment',
      'Social Enterprise'
    ];

    for (const name of categories) {
      await prisma.projectCategory.upsert({
        where: { name },
        update: {},
        create: { name }
      });
    }

    console.log('Project categories created');

    // Create sample projects
    const projects = [
      {
        id: 'proj_school_dev_001',
        title: 'Rural School Development',
        description: 'Building a new school in rural Kenya to provide education for 500 children.',
        goal: 50000,
        location: 'Kisumu, Kenya',
        categories: ['Education', 'Infrastructure'],
        imageUrl: 'https://example.com/school.jpg'
      },
      {
        id: 'proj_health_center_001',
        title: 'Community Health Center',
        description: 'Establishing a health center to serve 1000+ families in Tanzania.',
        goal: 75000,
        location: 'Arusha, Tanzania',
        categories: ['Healthcare', 'Infrastructure'],
        imageUrl: 'https://example.com/health.jpg'
      },
      {
        id: 'proj_farming_init_001',
        title: 'Sustainable Farming Initiative',
        description: 'Training and equipping 100 farmers with sustainable farming techniques.',
        goal: 25000,
        location: 'Kampala, Uganda',
        categories: ['Agriculture', 'Environment'],
        imageUrl: 'https://example.com/farm.jpg'
      }
    ];

    for (const project of projects) {
      const { categories: categoryNames, ...projectData } = project;
      
      await prisma.project.upsert({
        where: { id: project.id },
        update: {},
        create: {
          ...projectData,
          status: ProjectStatus.ACTIVE,
          categories: {
            connect: categoryNames.map(name => ({ name }))
          }
        }
      });
    }

    console.log('Sample projects created');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 