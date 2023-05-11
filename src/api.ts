export interface CrudInterface<T> {
  create(data: T): Promise<T>;
  find(data: T): Promise<T[]>;
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

  async readAll(): Promise<TodoItemData[]> {
    try {
      const result = JSON.parse(localStorage.getItem(this.user) as string);
      return result || [];
    } catch (e) {
      return [];
    }
  }

  async create(data: TodoItemData): Promise<TodoItemData> {
    const tasks = await this.readAll();

    const date = new Date();
    const curId = String(date.getMilliseconds());
    const todo: TodoItemData = data;
    todo.id = curId;
    todo.timestamp = Date.now();

    if (!todo.status) {
      todo.status = "создана";
    }

    tasks.push(todo);
    localStorage.setItem(this.user, JSON.stringify(tasks));

    return todo;
  }

  async delete(id: string): Promise<boolean> {
    const tasks = await this.readAll();
    const result = tasks.filter((task) => task.id !== id);
    localStorage.setItem(this.user, JSON.stringify(result));
    return !!result;
  }

  async find(data: TodoItemData): Promise<TodoItemData[]> {
    const tasks = await this.readAll();
    return tasks.filter(
      (task) => !Object.keys(data).some((key) => data[key] !== task[key])
    );
  }

  async readOne(id: string): Promise<TodoItemData | undefined> {
    const tasks = await this.readAll();
    return tasks.filter((task) => task.id === id).pop();
  }

  async update(
    id: string,
    data: TodoItemData
  ): Promise<TodoItemData | undefined> {
    const tasks = await this.readAll();
    let updatedToDo;
    tasks.forEach((task) => {
      if (task.id === id) {
        updatedToDo = Object.assign(task, data);
        localStorage.setItem(this.user, JSON.stringify(tasks));
      }
    });

    return updatedToDo;
  }
}
