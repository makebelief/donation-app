import { createProject } from './db/index.js';

export function seedDatabase() {
  const projects = [
    {
      title: 'Clean Water for Rural Schools',
      description: 'Help provide clean drinking water to schools in rural Kenya by funding the installation of water purification systems and storage tanks.',
      target_amount: 500000
    },
    {
      title: 'Solar Power for Communities',
      description: 'Support the installation of solar panels in off-grid communities, providing sustainable electricity for homes, schools, and small businesses.',
      target_amount: 750000
    },
    {
      title: 'Women\'s Entrepreneurship Program',
      description: 'Empower women entrepreneurs through business training, mentorship, and micro-loans to start and grow their own businesses.',
      target_amount: 300000
    },
    {
      title: 'Youth Tech Education',
      description: 'Fund computer labs and coding bootcamps for underprivileged youth, preparing them for careers in technology.',
      target_amount: 450000
    }
  ];

  projects.forEach(project => {
    try {
      createProject(project);
      console.log(`Created project: ${project.title}`);
    } catch (error) {
      console.error(`Failed to create project ${project.title}:`, error);
    }
  });
} 