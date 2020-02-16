module.exports = {
	head: {
		title: 'GIT.IO',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			}
		]
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
	css: ['animate.css', '@/scss/main.scss']
};
