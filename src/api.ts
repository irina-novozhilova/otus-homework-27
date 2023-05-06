// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ToDo {
  export interface CrudInterface<T> {
    create(data: T): Promise<T>;
    readMany(data: T): Promise<T[]>;
    readOne(id: number): Promise<T | undefined>;
    update(id: number, data: T): Promise<T | undefined>;
    delete(id: number): Promise<boolean>;
  }

  export interface TodoItem {
    id: number;
    name: string;
    description?: string;
    timestamp: number;
    status: "создана" | "в работе" | "завершены";
    tags?: string[];
  }

  export interface TodoItemData {
    [index: string]: any;
    id?: number;
    name?: string;
    description?: string;
    timestamp?: number;
    status?: "создана" | "в работе" | "завершена";
    tags?: string[];
  }

  export class Crud implements CrudInterface<TodoItemData> {
    async create(data: TodoItemData): Promise<TodoItemData> {
      const date = new Date();
      const curId = date.getMilliseconds();
      const currentData: TodoItemData = data;
      currentData.id = curId;
      currentData.timestamp = Date.now();
      if (!currentData.status) {
        currentData.status = "создана";
      }
      localStorage.setItem(String(curId), JSON.stringify(currentData));
      return currentData;
    }

    async delete(id: number): Promise<boolean> {
      localStorage.removeItem(String(id));
      return true;
    }

    async readMany(data: TodoItemData): Promise<TodoItemData[]> {
      const filteredToDo: object[] = [];
      for (let item = 0; item < localStorage.length; item++) {
        const key = localStorage.key(item);
        let isGood = true;
        const value = String(localStorage.getItem(String(key)));
        try {
          const todoObj: TodoItemData = JSON.parse(value);
          // eslint-disable-next-line no-restricted-syntax
          for (const property in data) {
            if (data[property] !== todoObj[property]) {
              isGood = false;
              break;
            }
          }
          if (isGood) {
            filteredToDo.push(todoObj);
          }
        } catch (e) {
          return [];
        }
      }
      return filteredToDo;
    }

    async readOne(id: number): Promise<TodoItemData | undefined> {
      const item = localStorage.getItem(String(id));
      const value = item ? String(item) : "";
      try {
        return JSON.parse(value);
      } catch (e) {
        return undefined;
      }
    }

    async update(
      id: number,
      data: TodoItemData
    ): Promise<TodoItemData | undefined> {
      const value = String(localStorage.getItem(String(id)));
      try {
        let updatedToDo: TodoItemData = JSON.parse(value);
        updatedToDo = Object.assign(updatedToDo, data);
        localStorage.setItem(String(id), JSON.stringify(updatedToDo));
        return updatedToDo;
      } catch (e) {
        return undefined;
      }
    }
  }
}
