module.exports = {
  db: "mongodb://localhost/mean-dev",
  app: {
    name: "MEAN - A Modern Stack - Development"
  },
	recaptcha: {
		public_key: '6LcIsu0SAAAAAInHdlg3iuysUOOESy9ioWqDM9iD',
		private_key: '6LcIsu0SAAAAANBQGO_7UVzIcopKF_lsWeDdbgnG'
	},
	//Social keys
  facebook: {
    clientID: "APP_ID",
    clientSecret: "APP_SECRET",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  twitter: {
    clientID: "CONSUMER_KEY",
    clientSecret: "CONSUMER_SECRET",
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  github: {
    clientID: "APP_ID",
    clientSecret: "APP_SECRET",
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  google: {
    clientID: "APP_ID",
    clientSecret: "APP_SECRET",
    callbackURL: "http://localhost:3000/auth/google/callback"
  }
}
