import { TemperatureDepartment } from "./temperatureDepartment";

export interface TemperatureDepartmentResponse {
  total_count: number,
  results: Array<TemperatureDepartment>
}
