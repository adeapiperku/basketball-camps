import { BaseService } from "./BaseService";

export class ParticipantService extends BaseService {
  constructor() {
    super("/participants");
  }
}
