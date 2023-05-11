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
  status: "создана",
};

const expectedTasksUser1: ToDo.TodoItemData[] = [
  {
    name: "Wake Up",
    id: mSec,
    timestamp: timestamp,
    status: "создана",
  },
  {
    name: "Wake Up 2",
    id: mSec2,
    timestamp: timestamp,
    status: "в работе",
  },
  {
    name: "Wake Up 3",
    id: mSec3,
    timestamp: timestamp,
    status: "в работе",
  },
];

const expectedTasksUser2: ToDo.TodoItemData[] = [
  {
    name: "Wake Up 3",
    id: mSec3,
    timestamp: timestamp,
    status: "в работе",
  },
  {
    name: "Wake Up",
    id: mSec,
    timestamp: timestamp,
    status: "создана",
  },
];

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
    expect(api.find).toBeInstanceOf(Function);
    expect(api.readAll).toBeInstanceOf(Function);
  });

  it("readAll successfully returns all Tasks for 2 users", async () => {
    const api1 = new ToDo.Crud("user1");
    await api1.create(task);
    Date.prototype.getMilliseconds = jest.fn(() => parseInt(mSec2));
    await api1.create(task2);
    Date.prototype.getMilliseconds = jest.fn(() => parseInt(mSec3));
    await api1.create(task3);

    expect(await api1.readAll()).toStrictEqual(expectedTasksUser1);

    const api2 = new ToDo.Crud("user2");
    await api2.create(task3);
    Date.prototype.getMilliseconds = jest.fn(() => parseInt(mSec));
    await api2.create(task);

    expect(await api2.readAll()).toStrictEqual(expectedTasksUser2);
  });

  it("readAll return empty array when error", async () => {
    const api1 = new Crud("user1");
    await api1.create(task);
    localStorage.setItem("user1", "buggedinfo");
    const result = await api1.readAll();

    expect(result).toStrictEqual([]);
  });

  it("create is successfully add an item", async () => {
    const api1 = new ToDo.Crud("user1");
    await api1.create(task);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user1",
      JSON.stringify([expectedTask])
    );
  });

  it("readOne is successfully get an item", async () => {
    const api1 = new ToDo.Crud("user1");

    await api1.create(task);
    const readTask = await api1.readOne(mSec);

    expect(readTask).toStrictEqual(expectedTask);
  });

  it("readOne return undefined when error", async () => {
    const api1 = new ToDo.Crud("user1");
    const readTask = await api1.readOne(mSec);

    expect(readTask).toBeUndefined();
  });

  it("delete is successfully remove an item", async () => {
    const api1 = new ToDo.Crud("user1");

    await api1.create(task);
    await api1.delete(mSec);
    expect(await api1.readAll()).toStrictEqual([]);
  });

  it("update is successfully renew an item", async () => {
    const api1 = new ToDo.Crud("user1");

    const updatedTask: ToDo.TodoItemData = {
      status: "в работе",
    };
    await api1.create(task);
    await api1.update(mSec, updatedTask);

    const result = await api1.readOne(mSec);

    if (result) {
      expect(result.status).toStrictEqual("в работе");
    } else {
      expect(result).toBeUndefined();
    }
  });

  it("update return when element not found", async () => {
    const api1 = new ToDo.Crud("user1");
    await api1.create(task);

    const updatedTask: ToDo.TodoItemData = {
      status: "в работе",
    };
    const renewTask = await api1.update(mSec + 2, updatedTask);

    expect(renewTask).toStrictEqual(undefined);
  });

  it("find is successfully get an items", async () => {
    const api1 = new ToDo.Crud("user1");

    await api1.create(task);

    Date.prototype.getMilliseconds = jest.fn(() => parseInt(mSec2));
    await api1.create(task2);

    Date.prototype.getMilliseconds = jest.fn(() => parseInt(mSec3));
    await api1.create(task3);

    const filter: ToDo.TodoItemData = {
      status: "в работе",
    };

    const result = await api1.find(filter);

    expect(result.length).toStrictEqual(2);
  });
});
