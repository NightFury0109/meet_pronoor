<script>
  export let user;
  export let delUser;
  export let change_role;
  export let set_state;
  export let selectUser;

  const changeBlockStatus = async (e) => {
    await set_state(user.nickname, e.target.value);
  };

  const changeRole = async (e) => {
    await change_role(user.nickname, e.target.value);
  };

  const deleteUser = async () => {
    await delUser(user.nickname);
  };

  const select_user = () => {
    selectUser(user);
  };
</script>

<tr>
  <td>{user.nickname}</td>
  <td>{user.email}</td>
  <td
    ><button
      type="button"
      class="btn btn-secondary btn-sm"
      on:click={select_user}>View</button
    ></td
  >
  <td>
    <div class="d-flex justify-content-center">
      <select
        class="form-control d-flex form-control-sm"
        name="state"
        id="state"
        on:change={changeBlockStatus}
      >
        {#if user.block}
          <option value={false}>Allow</option>
          <option value={true} selected>Block</option>
        {:else}
          <option value={false} selected>Allow</option>
          <option value={true}>Block</option>
        {/if}
      </select>
    </div>
  </td>
  <td>
    <div class="d-flex justify-content-center">
      <select
        class="form-control d-flex form-control-sm"
        name="role"
        id="role"
        on:change={changeRole}
      >
        {#if user.role === "user"}
          <option value="user" selected>User</option>
          <option value="admin">Administrator</option>
        {:else}
          <option value="user">User</option>
          <option value="admin" selected>Administrator</option>
        {/if}
      </select>
    </div>
  </td>
  <td
    ><button type="button" class="btn btn-danger btn-sm" on:click={deleteUser}
      >Delete</button
    ></td
  >
</tr>

<style>
  #state {
    width: 80px;
    min-width: 80px;
  }

  #role {
    width: 125px;
    min-width: 125px;
  }
</style>
