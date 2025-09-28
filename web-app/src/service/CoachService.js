import { BaseService } from "./BaseService";

export class CoachService extends BaseService {
  constructor() {
    super("/coaches");
  }
}
