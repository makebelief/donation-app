import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async () => {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return json(settings || getDefaultSettings());
  } catch (err) {
    console.error('Error fetching settings:', err);
    throw error(500, 'Internal server error');
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  try {
    const settings = await request.json();
    
    const updatedSettings = await prisma.siteSettings.upsert({
      where: { id: 1 }, // Assuming we only have one settings record
      create: settings,
      update: settings
    });

    return json(updatedSettings);
  } catch (err) {
    console.error('Error updating settings:', err);
    throw error(500, 'Internal server error');
  }
};

function getDefaultSettings() {
  return {
    site: {
      name: 'Donate',
      description: 'Empowering change through transparent and impactful donations',
      contactEmail: '',
      supportPhone: '',
      address: ''
    },
    payment: {
      currency: 'KES',
      minimumDonation: 100,
      paymentMethods: ['mpesa', 'card', 'bank'],
      mpesaPaybill: '',
      stripePublicKey: '',
      stripeSecretKey: ''
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      adminEmails: [],
      newDonationAlert: true,
      projectUpdateAlert: true,
      monthlyReportEnabled: true
    },
    social: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  };
} 