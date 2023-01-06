<script>
  import { selectedUser, selectedUser2 } from "../../store";
  import { getMessagesOfAdminPanel } from "../../apis/message";

  export let user;

  const selectUser = () => {
    selectedUser2.set(user);
    getMessagesOfAdminPanel($selectedUser.nickname, user.nickname);
  };
</script>

{#if $selectedUser2.nickname === user.nickname}
  <div class="mb-1 friend-item selected" on:click={selectUser}>
    <img src={`../../${user.avatar}`} alt="avatar2" class="friend-avatar" />
    <span class="ml-2 font-weight-bolder nickname">{user.nickname}</span>
  </div>
{:else}
  <div class="mb-1 friend-item" on:click={selectUser}>
    <img src={`../../${user.avatar}`} alt="avatar2" class="friend-avatar" />
    <span class="ml-2 font-weight-bolder nickname">{user.nickname}</span>
  </div>
{/if}

<style>
  .friend-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #cecbc9;
    cursor: pointer;
  }

  .friend-item {
    cursor: pointer;
    padding: 5px;
  }

  .friend-item:hover {
    background-color: #988781;
    border-radius: 15px;
  }

  .selected {
    background-color: #988781;
    border-radius: 15px;
  }

  .nickname {
    color: #cecbc9;
  }
</style>
