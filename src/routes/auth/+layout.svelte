<script lang="ts">
</script>

<div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] pt-12 pr-10">
	<div class="flex items-center justify-center py-12">
		<div class="mx-auto grid w-[350px] gap-6">
			<slot />
		</div>
	</div>
	<div class="hidden lg:block">
		<div class="h-full flex items-center justify-center">
			<img
				class="h-full object-cover"
				src="/img/login-page.webp"
				alt="placeholder"
				width="1920"
				height="1080"
			/>
		</div>
	</div>
</div>
