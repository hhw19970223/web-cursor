'use client';

import mitt, { Emitter, Handler } from 'mitt';
import { EventType } from './event.types';

export class GMitt {
  private _gMitt: Emitter<EventType>;

  constructor() {
    this._gMitt = mitt<EventType>();
  }

  public on<Key extends keyof EventType>(
    event: Key,
    cb: (data: EventType[Key]) => void,
  ) {
    this._gMitt.on(event, cb);
  }

  public off<Key extends keyof EventType>(
    event: Key,
    cb?: Handler<EventType[Key]>,
  ) {
    this._gMitt.off(event, cb);
  }

  public emit<Key extends keyof EventType>(event: Key, data: EventType[Key]) {
    this._gMitt.emit(event, data);
  }
}

/** 全局事件中心 */
export const gMitt: Emitter<EventType> = mitt<EventType>();
