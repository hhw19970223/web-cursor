import { createPool, format, escape } from "mysql2";
import { EventEmitter } from "events";
import dayjs from "dayjs";

export interface MysqlCfg {
  host?: string;
  user?: string;
  password?: string;
  database?: string;
  rowsAsArray?: boolean;
}

/** 初始化连接池 */
export function initPool(cfg: MysqlCfg) {
  if (!cfg || !cfg.database) {
    throw "lost database";
  }
  cfg.host = cfg.host || "127.0.0.1";
  cfg.user = cfg.user || "root";
  cfg.password = cfg.password || "123456";
  // cfg.rowsAsArray = true;
  const pool = createPool(cfg);
  // return pool.promise();
  return pool;
}

/**
 * S 接口 U 枚举
 */
export class Dao<S, U> extends EventEmitter {
  private _cfg: MysqlCfg;
  protected _promisePool: any;
  /** 表名 */
  private _tableName: string;
  /** dao名 */
  public daoName: string;
  public needToList: string[];
  public needToDate: string[];

  public set promisePool(v: any) {
    this._promisePool = v;
  }

  public get client(): any {
    return this._promisePool;
  }

  public set tableName(v: string) {
    this._tableName = v;
    let { daoName } = change(v);
    this.daoName = daoName;
  }

  public get tableName(): string {
    return this._tableName;
  }

  public set cfg(cfg: MysqlCfg) {
    this._cfg = cfg;
    this._promisePool = initPool(cfg);
  }

  constructor(cfg?: MysqlCfg) {
    super();
    this._cfg = <any>null;
    if (cfg) {
      this.cfg = cfg;
    }
    this._tableName = "";
    this.daoName = "";
    this.needToList = [];
    this.needToDate = [];
  }

  public async query(sql: string): Promise<any> {
    let self = this;
    return new Promise((resolve, reject) => {
      self.client.query(sql, function (err: any, rows: S[], fields: any) {
        if (err) {
          console.error("sql", sql);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    }).catch((err) => {
      console.error("sql", sql);
      throw err;
    });
  }

  /**
   * 列表查询
   * @param cnd
   * @param cols
   * @param postfix 后缀 比如 limit
   * @returns
   */
  public async list(
    cnd: S | string,
    cols?: U[],
    postfix?: string
  ): Promise<S[]> {
    let colStr = cols && cols.length ? cols.join(",") : "*";
    let sql = "select " + colStr + " from " + this.tableName + " where 1=1";
    if (typeof cnd == "object") {
      for (let key in cnd) {
        if (cnd[key] && this.needToList.indexOf(key) > -1) {
          cnd[key] = <any>JSON.stringify(cnd[key]);
        } else if (cnd[key] && this.needToDate.indexOf(key) > -1) {
          cnd[key] = dayjs(cnd[key] as any).format("YYYY-MM-DD HH:mm:ss") as any;
        }
        sql += " and " + key + " = '" + cnd[key] + "'";
      }
    } else {
      sql += cnd;
    }

    if (postfix) {
      sql += ` ${postfix}`;
    }

    const formattedQuery = format(sql);
    let rows: S[] = await this.query(formattedQuery);
    rows = rows || [];
    for (let i = 0; i < rows.length; i++) {
      for (let key in rows[i]) {
        try {
          if (rows[i][key] && this.needToList.indexOf(key) > -1) {
            rows[i][key] = JSON.parse(<any>rows[i][key]);
          } else if (rows[i][key] && this.needToDate.indexOf(key) > -1) {
            rows[i][key] = <any>new Date(<any>rows[i][key]);
          }
        } catch (e) {
          console.error("数据有误:" + key, JSON.stringify(rows[i]));
        }
      }
    }
    return rows;
  }

  /**
   * 单条查询
   * @param cnd
   * @param cols
   * @param order
   */
  public async select(cnd: S | string, cols?: U[], order?: string): Promise<S> {
    let list: S[] = await this.list(
      cnd,
      cols,
      order ? order + " limit 0,1" : "limit 0,1"
    );
    return list[0];
  }

  /**
   * 创建
   * @param data
   * @returns
   */
  public async create(data: S): Promise<any> {
    let sql = `INSERT INTO ${this.tableName}`;
    let keyStr: string = "";
    let valueStr: string = "";
    data = Object.assign({}, data);
    for (let key in data) {
      if (data[key] === null || data[key] === undefined) {
        delete data[key];
        continue;
      }
      if (data[key] && this.needToList.indexOf(key) > -1) {
        data[key] = <any>JSON.stringify(data[key]);
      } else if (data[key] && this.needToDate.indexOf(key) > -1) {
        data[key] = dayjs(data[key] as any).format("YYYY-MM-DD HH:mm:ss") as any;
      }

      if (!keyStr) {
        keyStr = "`" + key + "`";
      } else {
        keyStr += "," + "`" + key + "`";
      }

      if (!valueStr) {
        valueStr = escape(data[key]);
      } else {
        valueStr += "," + escape(data[key]);
      }
    }
    sql += ` (${keyStr}) VALUES (${valueStr})`;
    return await this.query(sql);
  }

  /**
   * 更新
   * @param data
   * @param cnd
   * @returns
   */
  public async update(data: S, cnd: S | string): Promise<any> {
    let sql = `update ${this.tableName}`;
    let dataStr: string = "";
    data = Object.assign({}, data);
    for (let key in data) {
      this._changeToSrt(data, key);
      if (!dataStr) {
        dataStr = ` set ${key} = ${escape(data[key])}`;
      } else {
        dataStr += ` , ${key} = ${escape(data[key])}`;
      }
    }

    sql += ` ${dataStr} where 1=1`;

    if (typeof cnd == "object") {
      cnd = Object.assign({}, cnd);
      for (let key in cnd) {
        this._changeToSrt(cnd, key);
        sql += " and " + key + "='" + cnd[key] + "'";
      }
    } else if (typeof cnd == "string") {
      sql += cnd;
    }
    return await this.query(sql);
  }

  public async del(cnd: S | string): Promise<any> {
    let sql = "delete from " + this.tableName + " where 1=1";
    if (typeof cnd == "object") {
      cnd = Object.assign({}, cnd);
      for (let key in cnd) {
        this._changeToSrt(cnd, key);
        sql += " and " + key + " = " + cnd[key];
      }
    } else {
      sql += cnd;
    }
    return await this.query(sql);
  }

  /**
   * 全部转换成字符窜
   * @param cnd
   * @param key
   * @private
   */
  private _changeToSrt(cnd: S, key: string) {
    // @ts-expect-error string
    if (!cnd[key] || typeof cnd[key] === "string") return;

    if (this.needToList.indexOf(key) > -1) {
      // @ts-expect-error string
      cnd[key] = <any>JSON.stringify(cnd[key]);
    } else if (this.needToDate.indexOf(key) > -1) {
      // @ts-expect-error string
      cnd[key] = dayjs(cnd[key] as any).format("YYYY-MM-DD HH:mm:ss") as any;
    }
  }
}

function change(tableName: string): { daoName: string; entity: string } {
  let daoName = "";
  let flag = false; //下个字母是否需要大写
  for (let i = 0; i < tableName.length; i++) {
    let word = tableName[i];
    if (isSpecialWord(word)) {
      flag = true;
      continue;
    }
    if (flag) {
      word = word.toUpperCase();
    }
    daoName += word;
    flag = false;
  }
  let entity: string = "I" + daoName[0].toUpperCase() + daoName.substring(1);
  daoName += "Dao";
  return {
    daoName,
    entity,
  };
}

export function isSpecialWord(value: string): boolean {
    let patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
    if (!patrn.test(value)) {// 如果包含特殊字符返回false
        return false;
    }
    return true;
}
