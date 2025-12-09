module.exports = {
  apps: [
    {
      name: "telemed-server",
      cwd: "/home/loginparol0/telemed/current/server",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 8443
      }
    }
  ]
};
