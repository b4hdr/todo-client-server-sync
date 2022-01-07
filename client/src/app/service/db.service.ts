import * as JsStore from 'jsstore';
import { IDataBase } from 'jsstore';
import { environment } from 'src/environments/environment';
import { TABLE_LABEL } from '../pages/label/label.table.model';
import { TABLE_TODO } from '../pages/todo/todo.table.model';

declare var require: any;

const getWorkerPath = () => {
  if (environment.production) {
    return require('file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js');
  } else {
    return require('file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.js');
  }
};

// This will ensure that we are using only one instance. 
// Otherwise due to multiple instance multiple worker will be created.
export const dbConnection = new JsStore.Connection(new Worker(getWorkerPath().default));
export const dbName = 'TODO';

const getDatabase = () => {
  const dataBase: IDataBase = {
    name: dbName,
    version: 1,
    tables: [
      TABLE_TODO,
      TABLE_LABEL
    ],
  };

  return dataBase;
};

export const initJsStore = async () => {
  const dataBase = getDatabase();
  const isDbCreated = await dbConnection.initDb(dataBase);
};