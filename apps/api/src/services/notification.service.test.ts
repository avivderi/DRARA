import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { FakeNotificationRepository } from '../repositories/notification.repository.fake';

import { NotificationService } from './notification.service';

describe('NotificationService (Unit Tests)', () => {
  it('should create and fetch user notifications with unread count', async () => {
    const notifRepo = new FakeNotificationRepository();
    const service = new NotificationService(notifRepo);

    await service.createNotification('user-1', 'new_match', { match_id: 'm-1' });
    await service.createNotification('user-1', 'new_message', { conversation_id: 'c-1' });

    const result = await service.getUserNotifications('user-1');
    assert.equal(result.unread_count, 2);
    assert.equal(result.notifications.length, 2);

    // Mark single read
    await service.markAsRead(result.notifications[0]!.id, 'user-1');
    const updatedResult = await service.getUserNotifications('user-1');
    assert.equal(updatedResult.unread_count, 1);
  });
});
