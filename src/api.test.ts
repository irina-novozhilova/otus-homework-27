/* eslint-disable */
import * as ToDo from "./api";
import Crud = ToDo.Crud;

const mSec = "1187076708000";
const mSec2 = "1187076708010";
const mSec3 = "1187076708020";
const timestamp = 2287076708000;

const task: ToDo.TodoItemData = {
  name: "Wake Up",
};

const task2: ToDo.TodoItemData = {
  name: "Wake Up 2",
  status: "в работе",
};

const task3: ToDo.TodoItemData = {
  name: "Wake Up 3",
  status: "в работе",
};

const expectedTask: ToDo.TodoItemData = {
  name: "Wake Up",
  id: mSec,
  timestamp: timestamp,
  user: "user1",
  status: "создана",
};
const api = new ToDo.Crud("user1");

describe("ToDo", () => {
  beforeEach(() => {
    Date.prototype.getMilliseconds = jest.fn(() => parseInt(mSec));
    Date.now = jest.fn(() => timestamp);
    localStorage.clear();
  });
  it("api is instance of CrudInterface", () => {
    const api = new ToDo.Crud("user1");
    expect(api).toBeInstanceOf(ToDo.Crud);
  });
  it("api has all functions", () => {
    const api = new ToDo.Crud("user1");
    expect(api.create).toBeInstanceOf(Function);
    expect(api.update).toBeInstanceOf(Function);
    expect(api.delete).toBeInstanceOf(Function);
    expect(api.readOne).toBeInstanceOf(Function);
    expect(api.readMany).toBeInstanceOf(Function);
  });

  it("create is successfully add an item", async () => {
    await api.create(task);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "1187076708000",
      JSON.stringify(expectedTask)
    );
  });

  it("update is successfully renew an item", async () => {
    const updatedTask: ToDo.TodoItemData = {
      status: "в работе",
    };
    await api.create(task);
    await api.update(mSec, updatedTask);

    const renewTask = JSON.parse(localStorage.__STORE__[mSec]);

    expect(renewTask.status).toStrictEqual("в работе");
  });

  it("update return when element not found", async () => {
    const updatedTask: ToDo.TodoItemData = {
      status: "в работе",
    };
    const renewTask = await api.update(mSec + 2, updatedTask);

    expect(renewTask).toStrictEqual(undefined);
  });

  it("delete is successfully remove an item", async () => {
    await api.create(task);
    await api.delete(mSec);

    const renewTask = localStorage.__STORE__[mSec];

    expect(renewTask).toStrictEqual(undefined);
  });

  it("readOne return undefined when error", async () => {
    const readTask = await api.readOne(mSec + 3);

    expect(readTask).toBeUndefined();
  });

  it("readOne is successfully get an item", async () => {
    await api.create(task);
    const readTask = await api.readOne(mSec);

    expect(readTask).toStrictEqual(expectedTask);
  });

  it("readMany return empty array when error", async () => {
    const filter: ToDo.TodoItemData = {
      status: "в работе",
    };
    const apiLocal = new Crud("user1");
    localStorage.setItem("bug", "sdsfdsafdsafdsafdsaf");
    const result = await apiLocal.readMany(filter);

    expect(result).toStrictEqual([]);
  });

  it("readMany is successfully get an items", async () => {
    await api.create(task);

    Date.prototype.getMilliseconds = jest.fn(() => parseInt(mSec2));
    await api.create(task2);

    Date.prototype.getMilliseconds = jest.fn(() => parseInt(mSec3));
    await api.create(task3);

    const filter: ToDo.TodoItemData = {
      status: "в работе",
    };

    const result = await api.readMany(filter);

    expect(result.length).toStrictEqual(2);
  });
});
