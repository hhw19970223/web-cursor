'use client';

/** 全局推送事件 */

export const enum EVENT_MITT {
  error = 'error',
  finish = 'finish',
  all = '*',
}

export type EventType = {
  [EVENT_MITT.error]: any;
  [EVENT_MITT.finish]: any;
  [EVENT_MITT.all]: void;
};
