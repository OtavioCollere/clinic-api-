export class StatusIsNotPedingError extends Error {
  constructor(){
    super("Status must be 'pending' to edit the appointment");
  }
}