module.exports = {
  apps: [
    {
      name: "tmk-server",
      cwd: "./server",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "tmk-next",
      cwd: "./patient_client",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
}
