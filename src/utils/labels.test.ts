import { describe, expect, it } from 'vitest';
import { priorityLabel, statusLabel } from './labels';

describe('labels utilities', () => {
  it('formats task statuses correctly', () => {
    expect(statusLabel('TODO')).toBe('Todo');
    expect(statusLabel('IN_PROGRESS')).toBe('In Progress');
    expect(statusLabel('DONE')).toBe('Done');
  });

  it('formats task priorities correctly', () => {
    expect(priorityLabel('LOW')).toBe('Low');
    expect(priorityLabel('MEDIUM')).toBe('Medium');
    expect(priorityLabel('HIGH')).toBe('High');
  });
});
