import { DATA_TYPE, ITable } from 'jsstore';

export const TABLE_NAME_TODO: string = 'Todos';

export const TABLE_TODO: ITable = {
  name: TABLE_NAME_TODO,
  columns: {
    id: {
      primaryKey: true,
      autoIncrement: true
    },
    serverKey: {
      dataType: DATA_TYPE.String
    },
    summary: {
      dataType: DATA_TYPE.String,
    },
    description: {
      dataType: DATA_TYPE.String
    },
    createDate: {
      dataType: DATA_TYPE.DateTime,
    },
    updateDate: {
      dataType: DATA_TYPE.DateTime,
    },
    isCompleted: {
      dataType: DATA_TYPE.Number,
    },
    isDeleted: {
      dataType: DATA_TYPE.Number,
    },
    isDirty: {
      dataType: DATA_TYPE.Number,
    },
    timestamp: {
      dataType: DATA_TYPE.Number,
    }
  }
};