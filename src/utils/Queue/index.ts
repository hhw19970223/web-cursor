import { EVENT_MITT } from "../broadcast/event.types";
import { GMitt } from "../broadcast/mitt";


export class Queue extends GMitt {
  private _max: number;
  private _queue: Array<() => Promise<void>>;
  private _running: number;
  private _retry: number;

  private _isLast: boolean;
  private _isError: boolean;
  private _isStop: () => boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(max: number, isStop: () => boolean, retry = 0) {
    super();
    this._max = max; // 最大并发数量
    this._queue = []; // 任务队列
    this._running = 0; // 当前运行中的任务数量
    this._retry = retry;
    this._isLast = false;
    this._isError = false;
    this._isStop = isStop;
  }

  async _next() {
    if (this._isError) {
      return;
    }

    if (this._isStop()) {
      this._isError = true;
      this.emit(EVENT_MITT.error, 'Cancel-Upload');
      this.off(EVENT_MITT.all);
      return;
    }

    if (this._queue.length === 0 && this._isLast && this._running === 0) {
      this.emit(EVENT_MITT.finish, undefined);
      this.off(EVENT_MITT.all);
      return;
    }

    if (this._queue.length === 0 || this._running >= this._max) {
      return;
    }

    const task = this._queue.shift(); // 取出队列中的第一个任务

    if (task) {
      this._running++; // 增加当前运行任务的计数
      this.run(task);
    } else {
      this._next();
    }
  }

  /**
   * 执行某个任务
   * @param task
   * @param retry
   */
  async run(task: () => Promise<void>, retry = 0) {
    try {
      await task();
      this._running--;
      this._next(); // 执行下一个任务
    } catch (error) {
      console.error('Task failed:', error);

      if (retry < this._retry) {
        await this.run(task, retry + 1);
      } else {
        this._isError = true;
        this.emit(EVENT_MITT.error, error);
        this.off(EVENT_MITT.all);
      }
    }
  }

  add(task: () => Promise<void>, isLast = false) {
    if (this._isError) {
      return;
    }

    this._queue.push(task); // 将任务添加到队列中

    if (isLast) {
      this._isLast = true;
    }

    this._next(); // 尝试启动任务
  }
}
