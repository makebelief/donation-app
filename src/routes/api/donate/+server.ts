import { json } from '@sveltejs/kit';
import { createDonation, getProject } from '$lib/db/index.js';
import { initiateSTKPush } from '$lib/mpesa/index.js';

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { projectId, amount, phoneNumber } = data;

    // Validate input
    if (!projectId || !amount || !phoneNumber) {
      return json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = getProject(projectId);
    if (!project) {
      return json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Create donation record
    const donation = createDonation({
      project_id: projectId,
      amount: Number(amount),
      phone_number: phoneNumber
    });

    // Initiate Mpesa STK Push
    const mpesaResponse = await initiateSTKPush(
      phoneNumber,
      amount,
      `Project-${projectId}`
    );

    if (!mpesaResponse.success) {
      return json(
        { error: mpesaResponse.error },
        { status: 400 }
      );
    }

    return json({
      success: true,
      donationId: donation.lastInsertRowid,
      mpesaData: mpesaResponse.data
    });
  } catch (error) {
    console.error('Error processing donation:', error);
    return json(
      { error: 'Failed to process donation' },
      { status: 500 }
    );
  }
} 