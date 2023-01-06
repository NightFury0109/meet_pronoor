<script>
  import { onMount } from "svelte";
  import { getNotificationsContext } from "svelte-notifications";

  import { resetPassword } from "../../apis/auth";
  import { errors } from "../../store";

  const { addNotification } = getNotificationsContext();

  let newPw = {
    password: "",
    password2: "",
  };

  let errs = {};

  export let params;

  onMount(() => {
    errors.set({});
  });

  errors.subscribe((value) => {
    errs = value;
  });

  const reset_password = async () => {
    const data = {
      password: newPw.password,
      password2: newPw.password2,
      userId: params.userId,
      token: params.token,
    };

    await resetPassword(data);
  };
</script>

<div class="d-flex justify-content-center align-items-center full-height auth">
  <img src="../../../logo.png" alt="logo" class="logo" />
  <div>
    <h3 class="text-white">Reset Password</h3>
    {#if errs.msg}
      <div class="mt-2 text-red">{errs.msg}</div>
    {/if}
    <div class="d-flex justify-content-center">
      <form
        class="text-left text-white py-3 login"
        on:submit|preventDefault={reset_password}
        novalidate
      >
        <div class="form-group">
          <label for="password">New Password:</label>
          <input
            type="password"
            class="form-control"
            placeholder="Enter new password"
            name="password"
            id="password"
            bind:value={newPw.password}
          />
          {#if errs.password}
            <div class="mt-2 text-red">{errs.password}</div>
          {/if}
        </div>
        <div class="form-group">
          <label for="password2">Confirm Password:</label>
          <input
            type="password"
            class="form-control"
            placeholder="Confirm password"
            name="password2"
            id="password2"
            bind:value={newPw.password2}
          />
          {#if errs.password2}
            <div class="mt-2 text-red">{errs.password2}</div>
          {/if}
        </div>
        <button type="submit" class="btn btn-info">Reset Password</button>
      </form>
    </div>
  </div>
</div>

<style>
  .login {
    width: 35vw;
    max-width: 400px;
    min-width: 250px;
  }

  .text-red {
    color: rgb(255, 92, 92);
  }

  .logo {
    width: 250px;
    position: absolute;
    top: 00.5rem;
    left: 1rem;
  }

  .logo:hover {
    cursor: pointer;
  }
</style>
