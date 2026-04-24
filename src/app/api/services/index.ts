export { api } from "./api.service";
export { BaseCrudService } from "./base-crud.service";
export { authService } from "./auth.service";
export { connectSocket, disconnectSocket, getSocket, onceConnected } from "./socket.service";
export { pushService } from "./push.service";
export { notificationsService } from "./notifications.service";
export {
  companiesService,
  usersService,
  staysService,
  stayChargesService,
  roomsService,
  roomTypesService,
  roomConsumptionItemsService,
  hotelGuestsService,
  receptionActivityLogsService,
  openingHoursService,
  paymentsService,
  dashboardService,
  type StayflowEntity,
} from "./stayflow-resources.service";