<script lang="ts">
	import './Tailwind.svelte';
	import { initAuth } from './auth';
	import type { User } from './entities/User';
	import Login from './Login.svelte';

	let pendingUser: User | null = null;
	let user: User | null;
	initAuth((newUser: User) => pendingUser = newUser);

	function handleLogin() {
		console.log('a login occured.')
	}
</script>

<main class="mx-auto max-w-screen-xl px-6">
	{#if !user}
		 <Login {pendingUser} on:login={handleLogin} />
	{:else}
		<div>logged in</div>
	{/if}
</main>

<style>
</style>