export default interface IRequest {
  id: string;
  status: string;
  parameters: { [key: string]: any };
  message?: string;
  start: Date;
  end?: Date;
}