import { Dao, MysqlCfg, initPool } from '../Dao';
export let mysql_hhw = initPool({"database":"hhw"});          
export class Dao_hhw<S, U> extends Dao<S, U> {
  constructor(cfg?: MysqlCfg) {
    super(cfg);
  }

  get client(): any {
    return this._promisePool || mysql_hhw;
  }
}
export const enum IHHW {
  /** 存储器名 */
  name = "name",
  /** 描述 */
  ext = "ext",
  /** 存储过程 */
  text = "text",
} 
export interface IHhw {
  /** 存储器名 */       
  name?: string;
  /** 描述 */       
  ext?: string;
  /** 存储过程 */       
  text?: string;
}
export class Hhw extends Dao_hhw<IHhw, IHHW>{
  constructor(cfg?: MysqlCfg) {
    super(cfg);
    this.needToList = [];
    this.needToDate = [];
    this.tableName = 'hhw';
  }
}
export let hhwDao: Hhw = new Hhw();