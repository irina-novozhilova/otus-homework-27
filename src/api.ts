export interface CrudInterface<T> {
  create(data: T): Promise<T>;
  readMany(data: T): Promise<T[]>;
  readOne(id: string): Promise<T | undefined>;
  update(id: string, data: T): Promise<T | undefined>;
  delete(id: string): Promise<boolean>;
}

export interface TodoItemData {
  [index: string]: number | string | undefined | string[];
  id?: string;
  name?: string;
  description?: string;
  timestamp?: number;
  status?: "создана" | "в работе" | "завершена";
  tags?: string[];
  user?: string;
}

export class Crud implements CrudInterface<TodoItemData> {
  user: string;

  constructor(user: string) {
    this.user = user;
  }

  async create(data: TodoItemData): Promise<TodoItemData> {
    const date = new Date();
    const curId = String(date.getMilliseconds());
    const currentData: TodoItemData = data;
    currentData.id = curId;
    currentData.timestamp = Date.now();
    currentData.user = this.user;
    if (!currentData.status) {
      currentData.status = "создана";
    }
    localStorage.setItem(curId, JSON.stringify(currentData));
    return currentData;
  }

  async delete(id: string): Promise<boolean> {
    localStorage.removeItem(id);
    return true;
  }

  async readMany(data: TodoItemData): Promise<TodoItemData[]> {
    const filteredToDo = [];
    for (let item = 0; item < localStorage.length; item++) {
      const key = localStorage.key(item);
      const value = String(localStorage.getItem(String(key)));
      try {
        const todoObj: TodoItemData = JSON.parse(value);
        filteredToDo.push(todoObj);
      } catch (e) {
        return [];
      }
    }
    return filteredToDo.filter(
      (todoItem) =>
        !Object.keys(data).some((key) => data[key] !== todoItem[key])
    );
  }

  async readOne(id: string): Promise<TodoItemData | undefined> {
    const item = localStorage.getItem(id);
    const value = item || "";
    try {
      return JSON.parse(value);
    } catch (e) {
      return undefined;
    }
  }

  async update(
    id: string,
    data: TodoItemData
  ): Promise<TodoItemData | undefined> {
    const value = String(localStorage.getItem(id));
    try {
      let updatedToDo: TodoItemData = JSON.parse(value);
      updatedToDo = Object.assign(updatedToDo, data);
      localStorage.setItem(id, JSON.stringify(updatedToDo));
      return updatedToDo;
    } catch (e) {
      return undefined;
    }
  }
}
