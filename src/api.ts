namespace ToDo {
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
    id?: number;
    name?: string;
    description?: string;
    timestamp?: number;
    status?: "создана" | "в работе" | "завершена";
    tags?: string[];
  }

  export class Crud implements CrudInterface<TodoItemData> {
    counter: number;
    constructor() {
      this.counter = this.getCounter() + 1;
    }
    getCounter(): number {
      return parseInt(localStorage.getItem("todocounter"));
    }
    setCounter(): void {
      localStorage.setItem("todocounter", String(this.counter));
      this.counter++;
    }

    create(data: ToDo.TodoItemData): Promise<ToDo.TodoItem> {
      let currentData: ToDo.TodoItemData = data;
      currentData.id = this.counter;
      currentData.timestamp = Date.now();
      if (!currentData.status) {
        currentData.status = "создана";
      }
      localStorage.setItem(String(this.counter), JSON.stringify(currentData));
      this.setCounter();
      return Promise.resolve(currentData);
    }

    delete(id: number): Promise<void> {
      localStorage.removeItem(String(id));
      return Promise.resolve(undefined);
    }

    readMany(data: ToDo.TodoItem): Promise<ToDo.TodoItem[]> {
      let filteredToDo: object[] = [];
      for (let item = 0; item < localStorage.length; item++) {
        let key = localStorage.key(item);
        let isGood = true;
        let todoObj = JSON.parse(localStorage.getItem(key));
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

    readOne(id: number): Promise<ToDo.TodoItem> {
      let oneToDo: TodoItem = JSON.parse(localStorage.getItem(String(id)));
      return Promise.resolve(oneToDo);
    }

    update(id: number, data: ToDo.TodoItemData): Promise<ToDo.TodoItem> {
      let updatedToDo: TodoItem = JSON.parse(localStorage.getItem(String(id)));
      updatedToDo = Object.assign(updatedToDo, data);
      localStorage.setItem(String(this.counter), JSON.stringify(updatedToDo));
      return Promise.resolve(updatedToDo);
    }
  }
}
