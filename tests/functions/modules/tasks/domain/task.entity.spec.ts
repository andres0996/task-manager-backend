import { Task } from '../../../../../functions/src/modules/tasks/domain/task.entity';

/**
 * Unit tests for the Task entity.
 * Ensures that a new Task instance is created correctly with default and provided values.
 */
describe('Task Entity', () => {
  it('should create a new Task instance with required properties', () => {
    const task = new Task({
      title: 'Test Task',
      userEmail: 'test@example.com',
    });

    expect(task.userEmail).toBe('test@example.com');
    expect(task.title).toBe('Test Task');

    expect(task.completed).toBe(false);

    expect(task.createdAt).toBeInstanceOf(Date);
  });
});
