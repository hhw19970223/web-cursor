'use client';

/** 全局推送事件 */

export const enum EVENT_MITT {
  test = 'test',
}

export type EventType = {
  [EVENT_MITT.test]: void;
};
