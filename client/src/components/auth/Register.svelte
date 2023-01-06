<script>
  import { onMount } from "svelte";
  import { getNotificationsContext } from "svelte-notifications";
  import { Router, Link, navigate } from "svelte-navigator";

  import { register } from "../../apis/auth";
  import { errors } from "../../store";

  const { addNotification } = getNotificationsContext();

  onMount(() => {
    errors.set({});

    if (localStorage.token) {
      navigate("/", { replace: true });
    }
  });

  let newUser = {
    nickname: "",
    email: "",
    password: "",
    password2: "",
    image: null,
  };

  let errs = {};

  errors.subscribe((value) => {
    errs = value;
  });

  const signUp = async () => {
    const res = await register(newUser);
    if (res === "success") {
      addNotification({
        text: "Successfully registered",
        position: "top-right",
        type: "success",
        removeAfter: 3000,
      });
    }
  };
</script>

<div class="d-flex justify-content-center align-items-center full-height auth">
  <img src="../logo.png" alt="logo" class="logo" />
  <div>
    <h3 class="text-white">Register</h3>
    <div class="d-flex justify-content-center">
      <form
        class="text-left text-white py-3 register"
        on:submit|preventDefault={signUp}
      >
        <div class="form-group">
          <label for="nickname">Nickname:</label>
          <input
            type="text"
            class="form-control"
            placeholder="Enter your nickname"
            name="nickname"
            id="nickname"
            bind:value={newUser.nickname}
          />
          {#if errs.nickname}
            <div class="mt-2 text-red">{errs.nickname}</div>
          {/if}
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            class="form-control"
            placeholder="Enter email"
            name="email"
            id="email"
            bind:value={newUser.email}
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
            bind:value={newUser.password}
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
            bind:value={newUser.password2}
          />
          {#if errs.password2}
            <div class="mt-2 text-red">{errs.password2}</div>
          {/if}
        </div>
        <div class="mt-4">
          <button type="submit" class="btn btn-info">Sign Up</button>
          <Router>
            <Link to="/auth/login">
              <button type="button" class="btn btn-secondary ml-3"
                >Go to Login Page</button
              >
            </Link>
          </Router>
        </div>
      </form>
    </div>
  </div>
</div>

<style>
  .register {
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
