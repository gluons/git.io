<template lang="pug">
section.hero.is-fullheight: .hero-body: .container
	h1.title.has-text-centered.is-uppercase git.io
	h2.subtitle.has-text-centered
		| Shorten GitHub URL with your own code via #[a(:href='gitIOLink' target='_blank') git.io].
	section#input-container
		b-field(position='is-centered')
			b-input(
				v-model='url'
				type='url'
				size='is-medium'
				placeholder='Enter a URL to shorten'
				expanded
				autofocus
			)
			p.control
				b-button(
					type='is-primary'
					size='is-medium'
					icon-left='arrow-collapse'
					@click='shorten'
				) Shorten
		#code-container.columns.is-vcentered
			.column.is-2: b-field
				b-switch(v-model='doesUseCode') Use code
			.column.is-3
				transition(
					name='code-transition'
					enter-active-class='animated tada'
					leave-active-class='animated hinge'
				): b-field(v-if='doesUseCode')
					b-input(
						v-model='code'
						size='is-medium'
						placeholder='URL code'
						pattern='[a-z0-9_-]'
						validation-message='Please enter valid URL code.'
					)

</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import shortenUrl from '@/lib/shortenUrl';

@Component({
	name: 'Home'
})
export default class Home extends Vue {
	gitIOLink = 'https://git.io';
	doesUseCode = true;
	url = '';
	code = '';

	async shorten() {
		const { url, code } = this;

		if (!url) {
			this.$buefy.toast.open({
				message: 'Please enter URL.',
				type: 'is-danger'
			});

			return;
		}

		try {
			console.log(await shortenUrl(url, code));
		} catch (err) {
			console.error(err);

			this.$buefy.toast.open({
				message: err.toString(),
				type: 'is-danger'
			});
		}

	}
}
</script>

<style lang="scss">
#input-container {
	margin: 0 5%;
}
#code-container {
	min-height: 100px;
}
</style>
