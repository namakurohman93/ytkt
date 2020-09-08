const { CronJob } = require('cron')

module.exports = new CronJob("*/5 * * * * *", function() {
  console.log("Running at", new Date())
}, null, true, "Asia/Jakarta")
