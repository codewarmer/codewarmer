module.exports = {
  db: process.env.MONGOHQ_DB,
  app: {
    name: "CodeWarmer"
  },
	recaptcha: {
		public_key: process.env.RECAPTCHA_PUBLIC,
		private_key: process.env.RECAPTCHA_PRIVATE
	},
	//Social keys
  facebook: {
    clientID: "APP_ID",
    clientSecret: "APP_SECRET",
    callbackURL: "http://codewarmer.com/auth/facebook/callback"
  },
  twitter: {
    clientID: "CONSUMER_KEY",
    clientSecret: "CONSUMER_SECRET",
    callbackURL: "http://codewarmer.com/auth/twitter/callback"
  },
  github: {
    clientID: "APP_ID",
    clientSecret: "APP_SECRET",
    callbackURL: "http://codewarmer.com/auth/github/callback"
  },
  google: {
    clientID: "APP_ID",
    clientSecret: "APP_SECRET",
    callbackURL: "http://codewarmer.com/auth/google/callback"
  }
}
