<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { getNotificationsContext } from "svelte-notifications";
  import jwt_decode from "jwt-decode";

  import { getUsers, deleteUser, changeRole, setState } from "../../apis/auth";
  import { users, selectedUser } from "../../store";
  import User from "./User.svelte";

  const { addNotification } = getNotificationsContext();

  let totalUsers;
  let innerHeight;

  users.subscribe((v) => {
    totalUsers = v;
  });

  onMount(() => {
    getUsers();

    const decode = jwt_decode(localStorage.token);

    if (decode.user.role === "user") {
      navigate("/", { replace: true });
    }
  });

  const delUser = async (userNickname) => {
    const res = await deleteUser(userNickname);

    if (res === "success") {
      addNotification({
        text: `${userNickname} successfully deleted!`,
        position: "top-right",
        type: "success",
        removeAfter: 3000,
      });

      const removeIndex = totalUsers.findIndex((user) => {
        return user.nickname === userNickname;
      });

      totalUsers.splice(removeIndex, 1);

      users.set(totalUsers);
    } else {
      addNotification({
        text: "Error occured",
        position: "top-right",
        type: "danger",
        removeAfter: 3000,
      });
    }
  };

  const change_role = async (nickname, role) => {
    const res = await changeRole(nickname, role);

    if (res === "success") {
      addNotification({
        text: `${nickname}'s role changed`,
        position: "top-right",
        type: "success",
        removeAfter: 3000,
      });
    } else {
      addNotification({
        text: "Error occured",
        position: "top-right",
        type: "danger",
        removeAfter: 3000,
      });
    }
  };

  const set_state = async (nickname, state) => {
    const res = await setState(nickname, state);
    if (res === "success") {
      if (state === "true") {
        addNotification({
          text: `${nickname} blocked!`,
          position: "top-right",
          type: "warning",
          removeAfter: 3000,
        });
      } else {
        addNotification({
          text: `${nickname} allowed!`,
          position: "top-right",
          type: "success",
          removeAfter: 3000,
        });
      }
    } else {
      addNotification({
        text: "Error occured",
        position: "top-right",
        type: "danger",
        removeAfter: 3000,
      });
    }
  };

  const selectUser = (user) => {
    selectedUser.set(user);
    navigate("/administrator/view_message", { replace: true });
  };
</script>

<svelte:window bind:innerHeight />
<div class="admin-dashboard" style="height: {innerHeight}px;">
  <div class="container user-list" style="height: {innerHeight - 90}px;">
    <table class="table table-dark table-hover">
      <thead class="text-center thead-dark">
        <tr>
          <th>Nickname</th>
          <th>email</th>
          <th>View Message</th>
          <th>State</th>
          <th>Role</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {#each totalUsers as user}
          <User {user} {delUser} {change_role} {set_state} {selectUser} />
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .admin-dashboard {
    width: 100%;
    height: 100%;
    background-color: #cecbc9;
    padding-top: 80px;
  }

  .user-list {
    height: 100%;
    overflow-y: auto;
  }

  /* Custom scrollbar */
  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    /* box-shadow: inset 0 0 5px grey; */
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgb(119, 117, 117);
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(80, 78, 90);
  }
</style>
