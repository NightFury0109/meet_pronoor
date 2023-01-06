<script>
  import { onMount } from "svelte";
  import { getNotificationsContext } from "svelte-notifications";
  import { Router, Link, navigate } from "svelte-navigator";

  import { login, sendResetPwReq } from "../../apis/auth";
  import { errors } from "../../store";
  import isEmpty from "../../utils/is-empty";

  const { addNotification } = getNotificationsContext();

  onMount(() => {
    errors.set({});
    if (localStorage.token) {
      navigate("/", { replace: true });
    }
  });

  let userData = {
    email: "",
    password: "",
  };

  let errs = {};

  errors.subscribe((value) => {
    errs = value;
  });

  const signIn = async () => {
    const res = await login(userData);
    if (res === "success") {
      addNotification({
        text: "You successfully logged in",
        position: "top-right",
        type: "success",
        removeAfter: 3000,
      });
    }
  };

  const requestResetPassword = async () => {
    await sendResetPwReq(userData.email);
  };
</script>

<div class="d-flex justify-content-center align-items-center full-height auth">
  <img src="../logo.png" alt="logo" class="logo" />
  <div>
    <h3 class="text-white">Login</h3>
    <div class="d-flex justify-content-center">
      <form
        class="text-left text-white py-3 login"
        on:submit|preventDefault={signIn}
        novalidate
      >
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            class="form-control"
            placeholder="Enter email"
            name="email"
            id="email"
            bind:value={userData.email}
          />
          {#if errs.email}
            <div class="mt-2 text-red">{errs.email}</div>
          {/if}
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            type="password"
            class="form-control"
            placeholder="Enter password"
            name="password"
            id="password"
            bind:value={userData.password}
          />
          {#if errs.password}
            <div class="mt-2 text-red">{errs.password}</div>
          {/if}
        </div>
        <p
          class="text-right forgot-password mb-1"
          on:click={requestResetPassword}
        >
          Forgot Password?
        </p>
        <div class="mt-0">
          <button type="submit" class="btn btn-info">Sign In</button>
          <Router>
            <Link to="/auth/register">
              <button type="button" class="btn btn-secondary ml-3"
                >Create Account</button
              >
            </Link>
          </Router>
        </div>
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

  .forgot-password {
    color: white;
  }

  .forgot-password:hover {
    color: #cecbc9;
    cursor: pointer;
    text-decoration: underline #cecbc9;
  }
</style>
