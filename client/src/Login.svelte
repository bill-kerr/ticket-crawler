<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { User } from './entities/User';
  import { login } from './auth';
  export let pendingUser: User | null;

  const dispatch = createEventDispatcher();

  let formData = {
    email: '',
    password: ''
  };

  async function handleSubmit(event: Event) {
    console.log(formData.email, formData.password)
    const user = await login(formData.email, formData.password);
    console.log(user)
    formData.email = '';
    formData.password = '';
  }

  function handleLogin() {
    dispatch('login', pendingUser);
    pendingUser = null;
  }
</script>

<div>
  {#if pendingUser}
    <div>Welcome back, {pendingUser.email}!</div>
    <button on:click={handleLogin}>Login</button>
  {:else}
    <form on:submit|preventDefault={handleSubmit}>
      <div>
        <label for="email">Email:</label>
        <input type="text" name="email" id="email" bind:value={formData.email} />
        <div></div>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" name="password" id="password" bind:value={formData.password} />
      </div>
      <button type="submit" class="p-2 bg-red-800 rounded text-white text-xs font-bold">Login</button>
    </form>
  {/if}
</div>

