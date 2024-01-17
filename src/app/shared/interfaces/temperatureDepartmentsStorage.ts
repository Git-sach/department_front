import { TemperatureDepartment } from "./temperatureDepartment";

export interface TemperatureDepartmentsStorage {
  [date: string]: TemperatureDepartment[]
}
