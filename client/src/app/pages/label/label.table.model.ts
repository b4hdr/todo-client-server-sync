import { DATA_TYPE, ITable } from 'jsstore';

export const TABLE_NAME_LABEL: string = 'Labels';

export const TABLE_LABEL: ITable = {
  name: TABLE_NAME_LABEL,
  columns: {
    id: {
      autoIncrement: true,
      primaryKey: true
    },
    serverKey: {
      dataType: DATA_TYPE.String
    },
    name: {
      dataType: DATA_TYPE.String,
    },
    createDate: {
      dataType: DATA_TYPE.DateTime,
    },
    updateDate: {
      dataType: DATA_TYPE.DateTime,
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