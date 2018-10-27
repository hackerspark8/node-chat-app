class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const user = this.getUser(id);
    if (user) {
      this.users = this.users.filter(({ id: userID }) => userID !== id);
    }
    return user;
  }

  getUser(id) {
    const [user] = this.users.filter(({ id: userID }) => userID === id);
    return user;
  }

  getUserList(room) {
    return this.users
      .filter(({ room: userRoom }) => userRoom === room)
      .map(({ name }) => name);
  }
}

module.exports = { Users };
