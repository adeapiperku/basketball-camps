import { BaseService } from "./BaseService";

export class CampCoachService extends BaseService {
  constructor() {
    super("/camp-coaches");
  }

  async assignCoachesToCamp(data) {
    return this.client.post(this.requestMapping, data);
  }

  // Fetch all coaches for a specific camp
  async getCoachesForCamp(campId) {
    const response = await this.client.get(`${this.requestMapping}/${campId}`);
    return response.data;
  }
}
