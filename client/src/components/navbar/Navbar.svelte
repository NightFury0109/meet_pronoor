<script>
  import { Router, Link } from "svelte-navigator";
  import { user } from "../../store";
  import { logout } from "../../apis/auth";

  let userData;

  user.subscribe((v) => {
    userData = v;
  });

  const userLogout = async () => {
    await logout();
  };
</script>

<Router>
  <nav
    class="navbar navbar-expand-sm navbar-light py-0 px-4 justify-content-between"
  >
    <div class="d-flex">
      <Link class="navbar-brand py-0" to="/">
        <img src="/logo.png" alt="logo" class="logo" />
      </Link>
    </div>
    <ul class="navbar-nav">
      <li class="nav-item ml-3">
        <Link class="nav-link" to="/"><span>Chat Room</span></Link>
      </li>
      {#if userData.role === "admin"}
        <li class="nav-item ml-3">
          <Link class="nav-link" to="/administrator"
            ><span>Administrator</span></Link
          >
        </li>
        <li class="nav-item ml-3">
          <div class="nav-link" on:click={userLogout}>Logout</div>
        </li>
      {/if}
    </ul>
  </nav>
</Router>

<style>
  .navbar {
    overflow: hidden;
    position: fixed;
    width: 100vw;
    top: 0;
    z-index: 1500;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5);
    background-color: #615550;
  }

  .nav-item:hover {
    border-bottom: 3px solid #cecbc9;
    padding-left: 8px;
    padding-right: 8px;
    border-bottom-left-radius: 40%;
    border-bottom-right-radius: 40%;
  }

  .nav-item .nav-link span {
    color: #cecbc9 !important;
  }

  .nav-item:hover .nav-link span {
    color: #cecbc9 !important;
  }

  .nav-item .nav-link {
    color: #cecbc9 !important;
  }

  .nav-item:hover .nav-link {
    color: #cecbc9 !important;
    cursor: pointer;
  }

  .logo {
    width: 160px;
  }
</style>
