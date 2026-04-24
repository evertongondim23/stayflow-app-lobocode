import { BaseCrudService } from "./base-crud.service";
import { api } from "./api.service";

export type StayflowEntity = {
  id: string;
  [key: string]: unknown;
};

class GenericStayflowCrudService extends BaseCrudService<
  StayflowEntity,
  StayflowEntity,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor(resource: string) {
    super(resource, (item) => item);
  }
}

export const companiesService = new GenericStayflowCrudService("/companies");
export const usersService = new GenericStayflowCrudService("/users");
export const staysService = new GenericStayflowCrudService("/stays");
export const stayChargesService = new GenericStayflowCrudService("/stay-charges");
export const roomsService = new GenericStayflowCrudService("/rooms");
export const roomTypesService = new GenericStayflowCrudService("/room-types");
export const roomConsumptionItemsService = new GenericStayflowCrudService("/room-consumption-items");
export const hotelGuestsService = new GenericStayflowCrudService("/hotel-guests");
export const receptionActivityLogsService = new GenericStayflowCrudService("/reception-activity-logs");
export const openingHoursService = new GenericStayflowCrudService("/opening-hours");
export const paymentsService = new GenericStayflowCrudService("/payments");

export const dashboardService = {
  get: () => api.get<Record<string, unknown>>("/dashboard", { useCache: false }),
};
