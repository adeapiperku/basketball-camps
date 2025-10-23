import { BaseService } from "./BaseService";

export class CampService extends BaseService {
    constructor() {
      super("/camps");
    }

    async findById(id) {
      try {
        const response = await this.client.get(`${this.requestMapping}/${id}`);
        const responseData = response.data || response;
        
        if (!responseData) {
          console.error('[CampService] No data in response');
          throw new Error('Camp not found');
        }
        
        const campData = {
          ...responseData,
          registeredParticipants: responseData.currentParticipants || 0,
        };
        
        return campData;
        
      } catch (error) {
        console.error('[CampService] Error in findById:', {
          message: error.message,
          response: error.response?.data || error.response,
          status: error.response?.status,
          config: {
            url: error.config?.url,
            method: error.config?.method
          },
          error: error
        });
        throw error;
      }
    }
}