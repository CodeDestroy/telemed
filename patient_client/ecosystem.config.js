module.exports = {
  apps: [
    {
      name: "patient-client",
      cwd: "/home/loginparol0/telemed/current/patient_client",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
