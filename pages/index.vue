<template lang="pug">
section.hero.is-fullheight: .hero-body: .container
	h1.title.has-text-centered.is-uppercase git.io
	h2.subtitle.has-text-centered
		| Shorten GitHub URL with your own code via #[a(:href='gitIOLink' target='_blank') git.io].
	section.horizontal-margin
		b-field(position='is-centered')
			b-input(
				ref='urlInput'
				v-model='url'
				type='url'
				size='is-medium'
				placeholder='Enter a GitHub URL to shorten'
				expanded
				autofocus
				@keyup.enter.native='shorten'
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
						pattern='[a-zA-Z0-9_-]*'
						validation-message='Please enter valid URL code.'
					)
	transition(
		name='code-transition'
		enter-active-class='animated fadeIn'
		leave-active-class='animated fadeOut'
		:duration='300'
	)
		b-message(
			v-if='hasResult'
			title='Short URL'
			aria-close-label='Close'
			@close='clearResult'
		)#result-container.horizontal-margin
			#result.is-size-5
				span {{shortUrl}}
				b-tooltip(label='Copy to clipboard' type='is-info' position='is-top' animated)
					b-icon(
						icon='clipboard-text'
						type='is-info'
						size='is-medium'
						@click.native='copyResult'
					)
</template>

<script lang="ts">
import copy from 'copy-text-to-clipboard';
import Vue from 'vue';
import Component from 'nuxt-class-component';
import { Watch } from 'nuxt-property-decorator';

import shortenUrl from '@/lib/shortenUrl';

@Component({
	name: 'Home'
})
export default class Home extends Vue {
	gitIOLink = 'https://git.io';
	doesUseCode = true;
	url = '';
	code = '';
	shortUrl = '';

	get hasResult(): boolean {
		return !!this.shortUrl;
	}

	async shorten() {
		const { url, code, doesUseCode } = this;

		this.clearResult();

		if (!url) {
			this.$buefy.toast.open({
				message: 'Please enter URL.',
				type: 'is-danger'
			});

			const urlInput = this.$refs['urlInput'] as HTMLInputElement;

			urlInput.focus();

			return;
		}

		const loadingComponent = this.$buefy.loading.open({
			isFullPage: true
		});

		try {
			const shortUrl = await shortenUrl(url, doesUseCode ? code : void 0);

			this.shortUrl = shortUrl;
		} catch (e) {
			const err: Error = e;

			this.$buefy.toast.open({
				message: err.message,
				type: 'is-danger'
			});
		} finally {
			loadingComponent.close();
		}
	}
	clearResult() {
		this.shortUrl = '';
	}
	copyResult() {
		const { shortUrl } = this;

		if (!shortUrl) {
			return;
		}

		if (copy(shortUrl)) {
			this.$buefy.toast.open({
				message: 'Copied',
				type: 'is-success'
			});
		}
	}

	@Watch('doesUseCode')
	onDoesUseCodeChange(newValue: boolean) {
		// Clear code when disable "Use code"
		if (!newValue) {
			this.code = '';
		}
	}
}
</script>

<style lang="scss">
.horizontal-margin {
	margin: 0 5%;
}
#result-container {
	margin-top: 1rem;
}
#result {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	& > * + * {
		margin-left: 1rem;
	}
	.icon {
		cursor: pointer;
	}
}
#code-container {
	min-height: 100px;
}
</style>
