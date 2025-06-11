import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import DonationCard from '../DonationCard.svelte';
import DonationForm from '../DonationForm.svelte';
import DonationProgress from '../DonationProgress.svelte';

describe('Donation Flow Integration', () => {
  const mockCampaign = {
    title: 'Save the Libraries',
    description: 'Help us renovate local libraries',
    imageUrl: 'https://example.com/library.jpg',
    targetAmount: 50000,
    currentAmount: 25000,
    endDate: new Date('2024-12-31'),
    category: 'Education',
    donorCount: 150,
    startDate: new Date('2024-01-01'),
    recentDonations: [
      {
        amount: 1000,
        donor: 'John Doe',
        date: new Date('2024-03-15')
      }
    ]
  };

  it('updates progress when new donation is made', async () => {
    // Render the components
    const { component: progressComponent } = render(DonationProgress, {
      targetAmount: mockCampaign.targetAmount,
      currentAmount: mockCampaign.currentAmount,
      donorCount: mockCampaign.donorCount,
      endDate: mockCampaign.endDate,
      startDate: mockCampaign.startDate,
      recentDonations: mockCampaign.recentDonations
    });

    const { component: formComponent } = render(DonationForm, {
      campaignTitle: mockCampaign.title,
      minimumAmount: 5
    });

    // Simulate donation submission
    const donationAmount = 1000;
    const amountInput = screen.getByLabelText(/Custom Amount/i);
    await fireEvent.input(amountInput, { target: { value: donationAmount } });

    const submitButton = screen.getByRole('button', { name: /Donate/i });
    await fireEvent.click(submitButton);

    // Verify progress is updated
    const newAmount = mockCampaign.currentAmount + donationAmount;
    const newProgress = (newAmount / mockCampaign.targetAmount) * 100;

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.getAttribute('aria-valuenow')).toBe(newProgress.toString());
    expect(screen.getByText(`$${(newAmount).toLocaleString()}`)).toBeTruthy();
  });

  it('disables form submission for invalid amounts', async () => {
    render(DonationForm, {
      campaignTitle: mockCampaign.title,
      minimumAmount: 5
    });

    // Try submitting with amount below minimum
    const amountInput = screen.getByLabelText(/Custom Amount/i);
    await fireEvent.input(amountInput, { target: { value: '2' } });

    const submitButton = screen.getByRole('button', { name: /Donate/i });
    await fireEvent.click(submitButton);

    expect(screen.getByText(/Minimum donation amount is \$5/i)).toBeTruthy();
  });

  it('updates donor count and recent donations after successful donation', async () => {
    const { component: progressComponent } = render(DonationProgress, {
      targetAmount: mockCampaign.targetAmount,
      currentAmount: mockCampaign.currentAmount,
      donorCount: mockCampaign.donorCount,
      endDate: mockCampaign.endDate,
      startDate: mockCampaign.startDate,
      recentDonations: mockCampaign.recentDonations
    });

    // Initial state check
    expect(screen.getByText(`${mockCampaign.donorCount} donors`)).toBeTruthy();

    // Simulate successful donation
    const newDonation = {
      amount: 1000,
      donor: 'Jane Smith',
      date: new Date()
    };

    progressComponent.$set({
      donorCount: mockCampaign.donorCount + 1,
      recentDonations: [newDonation, ...mockCampaign.recentDonations]
    });

    // Verify updates
    expect(screen.getByText(`${mockCampaign.donorCount + 1} donors`)).toBeTruthy();
    expect(screen.getByText('Jane Smith')).toBeTruthy();
  });

  it('shows appropriate status messages based on campaign progress', () => {
    // Test fully funded scenario
    const fundedCampaign = {
      ...mockCampaign,
      currentAmount: mockCampaign.targetAmount
    };

    const { component } = render(DonationCard, fundedCampaign);
    expect(screen.getByText('Funded')).toBeTruthy();

    // Test expired scenario
    const expiredCampaign = {
      ...mockCampaign,
      endDate: new Date('2023-01-01')
    };

    component.$set(expiredCampaign);
    expect(screen.getByText('Expired')).toBeTruthy();

    // Test active scenario
    component.$set(mockCampaign);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('calculates and displays correct campaign statistics', () => {
    render(DonationProgress, {
      targetAmount: mockCampaign.targetAmount,
      currentAmount: mockCampaign.currentAmount,
      donorCount: mockCampaign.donorCount,
      endDate: mockCampaign.endDate,
      startDate: mockCampaign.startDate,
      recentDonations: mockCampaign.recentDonations
    });

    // Check average donation
    const averageDonation = mockCampaign.currentAmount / mockCampaign.donorCount;
    expect(screen.getByText(`$${averageDonation.toLocaleString()}`)).toBeTruthy();

    // Check remaining amount
    const remainingAmount = mockCampaign.targetAmount - mockCampaign.currentAmount;
    expect(screen.getByText(`$${remainingAmount.toLocaleString()}`)).toBeTruthy();

    // Check campaign duration
    const duration = Math.ceil(
      (new Date(mockCampaign.endDate).getTime() - new Date(mockCampaign.startDate).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    expect(screen.getByText(`${duration} days`)).toBeTruthy();
  });
}); 