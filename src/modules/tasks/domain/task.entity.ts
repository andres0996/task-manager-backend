/**
 * Represents a Task entity in the system.
 * Each task is associated with a user (via email) and has a title, optional description, completion status, and timestamps.
 */
export class Task {
    public id?: string; // Optional unique identifier for the task (assigned by database)
    public userEmail: string;   // User's email address
    public title: string;   // Title of the task
    public description: string;    // Optional description of the task
    public completed: boolean;  // Indicates whether the task has been completed (default: false) 
    public completedAt?: Date | null;  // Optional timestamp marking when the task was completed
    public createdAt: Date; // // Timestamp when the task was created
  
    /**
     * Creates a new Task instance.
     *
     * @param data - Object containing the task properties
     * @param data.userEmail - Email of the user owning the task
     * @param data.title - Title of the task
     * @param data.description - Optional description of the task
     * @param data.completed - Optional completion status (default: false)
     * @param data.completedAt - Optional timestamp when task was completed
     * @param data.createdAt - Timestamp when task was created
     */
    constructor(data: {
      userEmail: string;
      title: string;
      description?: string;
      completed?: boolean;
      completedAt?: Date | null;
    }) {
      this.userEmail = data.userEmail;
      this.title = data.title;
      this.description = data.description ?? '';
      this.completed = data.completed ?? false;
      this.completedAt = data.completedAt ?? null;
      this.createdAt = new Date();
    }
  }
  