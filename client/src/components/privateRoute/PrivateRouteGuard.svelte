<script>
  import { useNavigate, useLocation } from "svelte-navigator";
  // import { user } from "../../store";

  const navigate = useNavigate();
  const location = useLocation();

  // let userData;

  // user.subscribe((value) => {
  //   userData = value;
  // });

  $: if (!localStorage.token) {
    navigate("/auth/login", {
      state: { from: $location.pathname },
      replace: true,
    });
  }
</script>

{#if localStorage.token}
  <slot />
{/if}
