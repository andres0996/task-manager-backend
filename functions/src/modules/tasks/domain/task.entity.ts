/**
 * Task Entity
 *
 * Represents a task in the system. Each task is associated with a specific user
 * (email) and contains properties like title, description, completion status,
 * and timestamps for creation and completion.
 *
 */

export class Task {
  public id?: string;
  public userEmail: string;
  public title: string;
  public description: string;
  public completed: boolean;
  public completedAt?: Date | null;
  public createdAt: Date;

  /**
   * Constructs a new Task instance.
   *
   * @param data - Object containing the task properties
   * @param data.userEmail - Email of the user owning the task
   * @param data.title - Title of the task
   * @param data.description - Optional description
   * @param data.completed - Optional completion status (default: false)
   * @param data.completedAt - Optional completion timestamp
   */
  constructor(data: {
    userEmail: string;
    title: string;
    description?: string;
    completed?: boolean;
    completedAt?: Date | null;
    createdAt?: Date;
    id?:string
  }) {
    this.userEmail = data.userEmail;
    this.title = data.title;
    this.description = data.description ?? "";
    this.completed = data.completed ?? false;
    this.completedAt = data.completedAt ?? null;
    this.createdAt = data.createdAt ?? new Date();
    this.id = data.id
  }
}
