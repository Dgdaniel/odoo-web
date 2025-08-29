import { User } from "./users";

export class Task {
  id!: string;
  title!: string;
  description!: string;
  status!: string;

  deadline?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  user: User = new User(); 
  priority!: string;
  assignee?:string;
  userId: string = ''
}