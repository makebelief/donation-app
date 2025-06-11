import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import DonationCard from '../DonationCard.svelte';

describe('DonationCard', () => {
  const mockProps = {
    title: 'Test Campaign',
    description: 'A test campaign description',
    imageUrl: 'https://example.com/image.jpg',
    targetAmount: 10000,
    currentAmount: 5000,
    endDate: new Date('2024-12-31'),
    category: 'Education',
    donorCount: 50
  };

  it('renders campaign information correctly', () => {
    render(DonationCard, mockProps);

    expect(screen.getByText('Test Campaign')).toBeTruthy();
    expect(screen.getByText('A test campaign description')).toBeTruthy();
    expect(screen.getByText('50 donors')).toBeTruthy();
  });

  it('displays correct progress percentage', () => {
    render(DonationCard, mockProps);
    
    // Progress should be 50% (5000/10000)
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.getAttribute('aria-valuenow')).toBe('50');
  });

  it('shows expired status when end date is past', () => {
    const expiredProps = {
      ...mockProps,
      endDate: new Date('2023-01-01')
    };

    render(DonationCard, expiredProps);
    expect(screen.getByText('Expired')).toBeTruthy();
  });

  it('shows funded status when target is reached', () => {
    const fundedProps = {
      ...mockProps,
      currentAmount: 10000
    };

    render(DonationCard, fundedProps);
    expect(screen.getByText('Funded')).toBeTruthy();
  });

  it('shows active status for ongoing campaigns', () => {
    render(DonationCard, mockProps);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('formats currency values correctly', () => {
    render(DonationCard, mockProps);
    expect(screen.getByText('$5,000')).toBeTruthy();
    expect(screen.getByText('of $10,000')).toBeTruthy();
  });

  it('disables donate button when campaign is expired', () => {
    const expiredProps = {
      ...mockProps,
      endDate: new Date('2023-01-01')
    };

    render(DonationCard, expiredProps);
    const donateButton = screen.getByRole('link', { name: /Campaign Ended/i });
    expect(donateButton).toHaveAttribute('disabled');
  });

  it('disables donate button when campaign is fully funded', () => {
    const fundedProps = {
      ...mockProps,
      currentAmount: 10000
    };

    render(DonationCard, fundedProps);
    const donateButton = screen.getByRole('link', { name: /Fully Funded/i });
    expect(donateButton).toHaveAttribute('disabled');
  });

  it('shows remaining amount on donate button for active campaigns', () => {
    render(DonationCard, mockProps);
    expect(screen.getByText('Donate $5,000 to go')).toBeTruthy();
  });
}); 