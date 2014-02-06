module.exports = {
  db: process.env.MONGOHQ_DB,
  app: {
    name: "CodeWarmer"
  },
	baseURL: "http://www.codewarmer.com/",
	recaptcha: {
		public_key: process.env.RECAPTCHA_PUBLIC,
		private_key: process.env.RECAPTCHA_PRIVATE
	},
	//Social keys
  facebook: {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "http://www.codewarmer.com/auth/facebook/callback"
  },
  twitter: {
    clientID: process.env.TWITTER_ID,
    clientSecret: process.env.TWITTER_SECRET,
    callbackURL: "http://www.codewarmer.com/auth/twitter/callback"
  },
  github: {
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: "http://www.codewarmer.com/auth/github/callback"
  },
  google: {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://www.codewarmer.com/auth/google/callback"
  }
}
