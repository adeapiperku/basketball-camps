import { BaseService } from "./BaseService";

export class RegistrationService extends BaseService {
  constructor() {
    super("/registrations");
  }

  async findByCamp(campId) {
    try {
      const response = await this.client.get(`${this.requestMapping}/camp/${campId}`);
      // console.log('Raw API Response:', response);

      let registrations;
      if (Array.isArray(response.data)) {
        registrations = response.data;
      } else if (response.data) {
        registrations = [response.data];
      } else if (Array.isArray(response)) {
        registrations = response;
      } else {
        console.error('Unexpected response format:', response);
        return [];
      }

      // console.log('Registrations data:', registrations);
      return registrations;
    } catch (error) {
      console.error('Error in findByCamp:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  }

}
