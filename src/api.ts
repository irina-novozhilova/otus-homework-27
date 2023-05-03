// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ToDo {
  export interface CrudInterface<T> {
    create(data: T): Promise<T>;
    readMany(data: T): Promise<T[]>;
    readOne(id: number): Promise<T>;
    update(id: number, data: T): Promise<T>;
    delete(id: number): Promise<void>;
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
    create(data: ToDo.TodoItemData): Promise<ToDo.TodoItemData> {
      const curId = Date.prototype.getMilliseconds();
      const currentData: ToDo.TodoItemData = data;
      currentData.id = curId;
      currentData.timestamp = Date.now();
      if (!currentData.status) {
        currentData.status = "создана";
      }
      localStorage.setItem(String(curId), JSON.stringify(currentData));
      return Promise.resolve(currentData);
    }

    delete(id: number): Promise<void> {
      localStorage.removeItem(String(id));
      return Promise.resolve(undefined);
    }

    readMany(data: ToDo.TodoItemData): Promise<ToDo.TodoItemData[]> {
      const filteredToDo: object[] = [];
      for (let item = 0; item < localStorage.length; item++) {
        const key = localStorage.key(item);
        let isGood = true;
        const todoObj: TodoItemData = JSON.parse(
          String(localStorage.getItem(String(key)))
        );
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
      }
      return Promise.resolve(filteredToDo);
    }

    readOne(id: number): Promise<ToDo.TodoItemData> {
      const oneToDo: TodoItemData = JSON.parse(
        String(localStorage.getItem(String(id)))
      );
      return Promise.resolve(oneToDo);
    }

    update(id: number, data: ToDo.TodoItemData): Promise<ToDo.TodoItemData> {
      let updatedToDo: TodoItemData = JSON.parse(
        String(localStorage.getItem(String(id)))
      );
      updatedToDo = Object.assign(updatedToDo, data);
      localStorage.setItem(String(id), JSON.stringify(updatedToDo));
      return Promise.resolve(updatedToDo);
    }
  }
}
