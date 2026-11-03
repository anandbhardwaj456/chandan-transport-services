import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AdminBookingsPage from './AdminBookingsPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('AdminBookingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads bookings and shows customer information', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        data: [
          {
            _id: 'b1',
            bookingReference: 'CTS-1001',
            customerName: 'Aditi Sharma',
            pickupLocation: 'Ranchi',
            destination: 'Jamshedpur',
            status: 'confirmed',
            totalAmount: 2400,
          },
        ],
      },
    });

    render(
      <MemoryRouter>
        <AdminBookingsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Aditi Sharma/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/CTS-1001/i)).toBeInTheDocument();
    expect(screen.getByText(/Manage bookings/i)).toBeInTheDocument();
  });
});
