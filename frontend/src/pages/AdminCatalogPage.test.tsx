import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AdminCatalogPage from './AdminCatalogPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('AdminCatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads catalog data and shows route and driver records', async () => {
    vi.mocked(api.get).mockImplementation((url: string) => {
      if (url === '/admin/drivers') {
        return Promise.resolve({
          data: {
            data: [{ _id: 'd1', name: 'Rakesh Verma', phone: '9876543210', availabilityStatus: 'available' }],
          },
        });
      }

      if (url === '/admin/routes') {
        return Promise.resolve({
          data: {
            data: [{ _id: 'r1', origin: 'Ranchi', destination: 'Jamshedpur', status: 'active' }],
          },
        });
      }

      if (url === '/admin/vehicles') {
        return Promise.resolve({
          data: {
            data: [{ _id: 'v1', category: 'Sedan', passengerCapacity: 4, active: true }],
          },
        });
      }

      if (url === '/admin/fare-rules') {
        return Promise.resolve({
          data: {
            data: [{ _id: 'f1', name: 'Ranchi to Jamshedpur', baseFare: 1800, active: true }],
          },
        });
      }

      return Promise.resolve({ data: { data: [] } });
    });

    render(
      <MemoryRouter>
        <AdminCatalogPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Rakesh Verma/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Ranchi/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sedan/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Fleet and pricing/i)).toBeInTheDocument();
  });

  it('allows adding a new route from the catalog form', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [] } });
    vi.mocked(api.post).mockResolvedValue({ data: { success: true } });

    render(
      <MemoryRouter>
        <AdminCatalogPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument();
    });

    await vi.waitFor(() => expect(screen.getByRole('button', { name: /routes/i })).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /routes/i }));

    fireEvent.change(screen.getByLabelText(/origin/i), { target: { value: 'Dhanbad' } });
    fireEvent.change(screen.getByLabelText(/destination/i), { target: { value: 'Ranchi' } });

    fireEvent.click(screen.getByRole('button', { name: /save route/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/admin/routes',
        expect.objectContaining({ origin: 'Dhanbad', destination: 'Ranchi' }),
      );
    });
  });
});
