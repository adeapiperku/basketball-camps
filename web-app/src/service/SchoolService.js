import { BaseService } from "./BaseService";

export class SchoolService extends BaseService {
  constructor() {
    super("/schools");
  }
}
