interface Donor {
  id: string;
  firstName: string;
  lastName: string;
}

interface Campaign {
  id: string;
  name: string;
}

interface DonationRequest {
  id: string;
  donor: Donor;
  campaign: Campaign;
  amount: number;
  note: string;
  appointmentDate: string;
  currentStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface DonationResponse {
  data: DonationRequest[];
  meta: Meta;
}

interface UpdateStatusRequest {
  status: string;
  appointmentDate?: string;
  note?: string;
}

class DonationService {
  private baseUrl: string = 'https://api-dev.bloodlink.site';

  async getDonationRequests(status?: string): Promise<DonationResponse> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);

    const response = await fetch(`${this.baseUrl}/donations/requests?${params.toString()}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Failed to fetch donation requests');
    return response.json();
  }

  async getDonationRequestById(id: string): Promise<DonationRequest> {
    const response = await fetch(`${this.baseUrl}/donations/requests/${id}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Failed to fetch donation request');
    return response.json();
  }

  async updateDonationRequestStatus(id: string, body: UpdateStatusRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/donations/requests/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Failed to update donation request status');
  }
}

export default new DonationService();