export class ITodo {
    id?: number;
    serverKey?: string;
    summary?: string;
    description?: string;
    labelIds?: string[];
    selectedLabels?: string[];
    createDate?: Date;
    updateDate?: Date;
    isCompleted?: number;
    isDeleted?: number;
    isDirty?: number;
    timestamp?: number;
}