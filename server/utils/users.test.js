const expect = require("expect");
const { Users } = require("./users");

describe("Users", () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: "1",
        name: "Deepak",
        room: "This"
      },
      {
        id: "2",
        name: "Sowmya",
        room: "This"
      },
      {
        id: "3",
        name: "Swati",
        room: "That"
      }
    ];
  });

  it("should add new user", () => {
    const users = new Users();
    const user = {
      id: "143",
      name: "Sowmya",
      room: "Here"
    };
    const resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it("should return names for This", () => {
    const userList = users.getUserList("This");
    expect(userList).toEqual(["Deepak", "Sowmya"]);
  });

  it("should return names for That", () => {
    const userList = users.getUserList("That");
    expect(userList).toEqual(["Swati"]);
  });

  it("should find user", () => {
    const userID = "2";
    const user = users.getUser(userID);
    expect(user.id).toBe(userID);
  });

  it("should not find user", () => {
    const userID = "143";
    const user = users.getUser(userID);
    expect(user).toNotExist();
  });

  it("should remove a user", () => {
    const userID = "3";
    const user = users.removeUser(userID);
    expect(user.id).toBe(userID);
    expect(users.users.length).toBe(2);
  });

  it("should not remove a user", () => {
    const userID = "143";
    const user = users.removeUser(userID);
    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });
});
