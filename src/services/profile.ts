interface StaffProfile {
  firstName: string;
  lastName: string;
  role: string;
}

class ProfileService {
  private baseUrl: string = 'https://api-dev.bloodlink.site';

  async getCurrentStaffProfile(): Promise<StaffProfile> {
    const response = await fetch(`${this.baseUrl}/staffs/me`, {
      method: 'GET',
    });
    return response.json();
  }

  async updateCurrentStaffProfile(profile: Partial<StaffProfile>): Promise<any> {
    const response = await fetch(`${this.baseUrl}/staffs/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    return response.json();
  }
}

export default new ProfileService();