'use client';

import { EventType, EVENT_MITT } from './event.types';
import { gMitt } from './mitt';

export type BroadcastInfo = {
  data: { [key: string]: unknown };
};

const channel: BroadcastChannel | null = BroadcastChannel
  ? new BroadcastChannel('h_jkasfjkasfkljaslkfh_jkasfjkasfkljaslkf')
  : null;

/**
 * broadcastChannel 发送消息
 * @param type
 * @param _data
 */
export function broadcastChannel<Key extends keyof EventType>(
  type: Key,
  _data?: EventType[Key],
) {
  const d: { [key: string]: EventType[Key] } = {};
  d[type] = _data as EventType[Key];

  const data: BroadcastInfo = {
    data: d,
  };

  channel?.postMessage(data);
}

/** 接收事件 */
export function onMessOnBroadcastChannel() {
  if (channel) {
    channel.onmessage = (e) => {
      const data = e.data;
      _onMessOnBroadcastChannel(data);
    };
  }
}

function _onMessOnBroadcastChannel(data: BroadcastInfo) {
  for (const key in data.data) {
    const _data = data.data[key] as any;
    gMitt.emit(key as EVENT_MITT, _data);
  }
}
