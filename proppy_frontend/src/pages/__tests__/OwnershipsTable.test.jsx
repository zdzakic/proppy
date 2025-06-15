import { render, screen, waitFor } from '@testing-library/react';
import OwnershipsTable from '../OwnershipPage';
import axios from '../../util/axios';
import { vi } from 'vitest';

// Mock axios
vi.mock('../../util/axios');

describe('OwnershipsTable', () => {
  test('renders heading "Ownerships"', () => {
    axios.get.mockResolvedValue({ data: [] });

    render(<OwnershipsTable />);

    expect(screen.getByText(/ownerships/i)).toBeInTheDocument();
  });

  test('displays ownership data from API', async () => {
    const mockData = [
      {
        owner_name: 'John Smith',
        owner_email: 'john@example.com',
        property_name: 'Flat A',
        block_id: 101,
        comment: 'Two-bedroom unit',
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<OwnershipsTable />);

    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Flat A')).toBeInTheDocument();
      expect(screen.getByText('101')).toBeInTheDocument();
      expect(screen.getByText('Two-bedroom unit')).toBeInTheDocument();
    });
  });

  test('logs error when API call fails', async () => {
    const error = new Error('Network error');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  
    axios.get.mockRejectedValueOnce(error);
  
    render(<OwnershipsTable />);
  
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching ownerships:',
        error
      );
    });
  
    consoleSpy.mockRestore();
  });
});
