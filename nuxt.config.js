module.exports = {
	head: {
		title: 'GIT.IO'
	},
	buildModules: ['@nuxt/typescript-build'],
	modules: [
		'@nuxtjs/axios',
		[
			'nuxt-buefy',
			{
				css: false
			}
		]
	],
	css: [
		'animate.css',
		'@/scss/main.scss'
	]
};
