<script>
  import { afterUpdate, onMount } from "svelte";
  import openSocket from "socket.io-client";
  import jwt_decode from "jwt-decode";
  import { navigate } from "svelte-navigator";

  import {
    usersExpOne,
    selectedUser,
    selectedUser2,
    socketURL,
    messagesOfAdminPanel,
  } from "../../store";
  import { getUsersExpOne } from "../../apis/auth";
  import { getMessagesOfAdminPanel } from "../../apis/message";
  import isEmpty from "../../utils/is-empty";

  import Message from "./Message.svelte";
  import UserItem from "./UserItem.svelte";

  let user = $selectedUser;
  let search_key;
  let totalUsers;
  let selected_user;
  let socket_url;
  let msgs = [];
  let innerHeight;
  let innerWidth;

  messagesOfAdminPanel.subscribe((v) => {
    msgs = v;
  });

  socketURL.subscribe((v) => {
    socket_url = v;
  });

  const socket = openSocket(socket_url, { secure: true });

  socket.on("create_message", () => {
    if (!isEmpty(user)) {
      getMessagesOfAdminPanel($selectedUser.nickname, $selectedUser2.nickname);
    }
  });

  // socket.on("deleteMessage", (data) => {
  //   const removeIndex = msgs.findIndex((msg) => {
  //     return (
  //       msg.sender === data.sender &&
  //       msg.receiver === data.receiver &&
  //       msg.sender_time === data.sender_time
  //     );
  //   });

  //   msgs.splice(removeIndex, 1);
  //   messagesOfAdminPanel.set(msgs);
  // });

  onMount(() => {
    getUsersExpOne(user.nickname);

    const decode = jwt_decode(localStorage.token);

    if (decode.user.role === "user") {
      navigate("/", { replace: true });
    }

    if (isEmpty(user)) {
      navigate("/administrator", { replace: true });
    }
  });

  afterUpdate(() => {
    const element = document.querySelector(".msg-appear-field");
    if (element !== null) element.scrollTop = element.scrollHeight;
  });

  usersExpOne.subscribe((v) => {
    totalUsers = v;
  });

  selectedUser2.subscribe((v) => {
    selected_user = v;
  });

  const searchUser = () => {
    if (!isEmpty(search_key)) {
      const search_result = totalUsers.filter((user) => {
        return user.nickname.toLowerCase().search(search_key) !== -1;
      });
      usersExpOne.set(search_result);
    } else {
      getUsersExpOne(user.nickname);
    }
  };

  window.process = {
    env: "production",
  };
</script>

<svelte:window bind:innerHeight bind:innerWidth />
<div class="d-flex total-height">
  <!-- Users list field -->
  <div class="users-field" style="height: {innerHeight}px;">
    <div>
      <div class="d-flex justify-content-start align-items-center">
        <div class="d-flex align-items-center">
          <img src={`../../${user.avatar}`} alt="avatar" class="main-avatar" />
          <span class="ml-2 font-weight-bolder user-nickname"
            >{user.nickname}</span
          >
        </div>
      </div>
    </div>
    <input
      type="text"
      class="form-control form-control-sm mt-2 search-input"
      placeholder="Search users"
      bind:value={search_key}
      on:input={searchUser}
    />
    <div
      class="users-list mt-3 text-left"
      style="height: {innerHeight - 190}px;"
    >
      {#if !isEmpty(totalUsers)}
        {#each totalUsers as user}
          <UserItem {user} />
        {/each}
      {/if}
    </div>
  </div>

  <!-- Chat field -->
  <div class="chat-field" style="height: {innerHeight}px;width:{innerWidth}px">
    <!-- Tools field -->
    <div class="d-flex justify-content-between px-3">
      <div class="d-flex align-items-center selected-user">
        {#if !isEmpty(selected_user)}
          <img
            src={`../../${selected_user.avatar}`}
            alt="avatar2"
            class="friend-avatar"
          />
          <span class="ml-2 font-weight-bolder friend-nickname"
            >{selected_user.nickname}</span
          >
        {/if}
      </div>
    </div>
    <!-- Message field -->
    <div class="message-field mt-2" style="height: {innerHeight - 140}px;">
      <div class="msg-appear-field">
        {#if !isEmpty(msgs)}
          {#each msgs as msg}
            <Message message={msg} {user} />
          {/each}
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .users-field {
    position: relative;
    width: 350px;
    /* max-width: 600px; */
    min-width: 350px;
    background-color: #615550;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.8);
    z-index: 1;
    padding-top: 70px;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 2rem;
  }

  .main-avatar {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    border: 2px solid #cecbc9;
    cursor: pointer;
  }

  .friend-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #615550;
    cursor: pointer;
  }

  .selected-user {
    height: 50px;
  }

  .chat-field {
    width: 100%;
    padding-top: 70px;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-bottom: 1.5rem;
    background-color: #cecbc9;
    position: relative;
  }

  .message-field {
    border-radius: 15px;
    padding: 1rem 1rem 1rem 1rem;
    position: relative;
    background-color: #615550;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .msg-appear-field {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    z-index: 1;
  }

  .users-list {
    width: 100%;
    overflow-y: auto;
  }

  .search-input:focus {
    border-color: #cecbc9 !important;
    box-shadow: 0 0 0 0.2rem rgba(211, 209, 209, 0.25);
  }

  :global(.icon) {
    color: #cecbc9;
    font-size: 1.5em;
  }

  :global(.icon:hover) {
    /* font-size: 1.7em; */
    cursor: pointer;
  }

  .user-nickname {
    color: #cecbc9;
  }

  .friend-nickname {
    color: #615550;
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
    background: lightgrey;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(167, 165, 165);
  }
</style>
