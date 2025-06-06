interface Campaign {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: string;
  banner: string;
}

class CampaignService {
  private baseUrl: string = 'https://api-dev.bloodlink.site';

  async createCampaign(campaign: Campaign): Promise<any> {
    const response = await fetch(`${this.baseUrl}/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaign),
    });
    return response.json();
  }

  async getCampaigns(search?: string, status?: string, limit?: number, page?: number): Promise<any> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (limit) params.append('limit', limit.toString());
    if (page) params.append('page', page.toString());

    const response = await fetch(`${this.baseUrl}/campaigns?${params.toString()}`, {
      method: 'GET',
    });
    return response.json();
  }

  async getCampaignById(id: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/campaigns/${id}`, {
      method: 'GET',
    });
    return response.json();
  }

  async updateCampaign(id: string, campaign: Partial<Campaign>): Promise<any> {
    const response = await fetch(`${this.baseUrl}/campaigns/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaign),
    });
    return response.json();
  }

  async deleteCampaign(id: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/campaigns/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}

export default new CampaignService();