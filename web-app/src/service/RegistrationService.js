import { BaseService } from "./BaseService";

export class RegistrationService extends BaseService {
  constructor() {
    super("/registrations");
  }
}
