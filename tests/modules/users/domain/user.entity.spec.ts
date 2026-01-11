import { User } from '../../../../src/modules/users/domain/user.entity';
import { isValidEmail } from '../../../../src/shared/utils/validate-email';

/**
 * Unit tests for the `User` entity.
 * Ensures proper validation and assignment of properties.
 */
describe('User Entity', () => {

  // Should create a user with valid email
  it('should create a user with a valid email', () => {
    const email = 'test@example.com';
    const user = new User(email);

    expect(user.email).toBe(email);
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  // Should throw an error if email is empty
  it('should throw an error if email is empty', () => {
    expect(() => new User('')).toThrow('User must have a valid email');
  });

  // Should throw an error if email format is invalid
  it('should throw an error if email format is invalid', () => {
    expect(() => new User('invalid-email')).toThrow('User must have a valid email');
  });

  // Should throw an error if email is not a string
  it('should throw an error if email is not a string', () => {
    expect(() => new User(null as any)).toThrow('User must have a valid email');
    expect(() => new User(undefined as any)).toThrow('User must have a valid email');
    expect(() => new User(123 as any)).toThrow('User must have a valid email');
  });

  // Should assign the provided createdAt if given
  it('should assign createdAt if provided', () => {
    const email = 'test@example.com';
    const date = new Date('2026-01-10T12:00:00Z');
    const user = new User(email, date);

    expect(user.createdAt).toBe(date);
  });
});
