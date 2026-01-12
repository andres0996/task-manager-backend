import { Task } from '../../../../src/modules/tasks/domain/task.entity';

/**
 * Unit tests for the Task entity.
 * Ensures that a new Task instance is created correctly with default and provided values.
 */
describe('Task Entity', () => {
  it('should create a new Task instance with required properties', () => {
    // Create a new Task instance
    const task = new Task({
      title: 'Test Task',
      userEmail: 'test@example.com',
    });

    // Verify that the provided properties are assigned correctly
    expect(task.userEmail).toBe('test@example.com');
    expect(task.title).toBe('Test Task');

    // Verify that completed defaults to false
    expect(task.completed).toBe(false);

    // Verify that createdAt is automatically set to a Date instance
    expect(task.createdAt).toBeInstanceOf(Date);
  });
});
