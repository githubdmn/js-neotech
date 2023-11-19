db.createUser({
  user: "user",
  pwd: "pass",
  roles: [
    {
      role: "readWrite",
      db: "my_database",
    },
  ],
});
