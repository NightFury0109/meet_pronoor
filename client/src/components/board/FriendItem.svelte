<script>
  import { beforeUpdate } from "svelte";
  import { getNotificationsContext } from "svelte-notifications";
  import { Icon } from "svelte-fontawesome";
  import { faUserSlash } from "@fortawesome/free-solid-svg-icons/faUserSlash";

  import { selectedFriend, friends, immutableFriends } from "../../store";
  import { getMessages } from "../../apis/message";
  import { addFriend, getFriends, removeFriend } from "../../apis/auth";

  const { addNotification } = getNotificationsContext();

  export let friend;

  let index;

  beforeUpdate(() => {
    index = $immutableFriends.findIndex((f) => {
      return f.nickname === friend.nickname;
    });
  });

  const add_friend = async () => {
    const friendData = {
      nickname: friend.nickname,
      avatar: friend.avatar,
    };

    const res = await addFriend(friendData);

    if (res === "success") {
      getFriends();
      addNotification({
        text: `${friend.nickname} added in Friend list`,
        position: "top-right",
        type: "success",
        removeAfter: 3000,
      });
    }
  };

  const selectFriend = () => {
    selectedFriend.set(friend);

    if (index === -1) add_friend();

    friends.set([friend]);
    getMessages(friend.nickname);
  };

  const remove_friend = async () => {
    const res = await removeFriend(friend.nickname);

    if (res === "success") {
      getFriends();
      addNotification({
        text: `${friend.nickname} removed in Friend list`,
        position: "top-right",
        type: "warning",
        removeAfter: 3000,
      });
    }
  };
</script>

{#if $selectedFriend.nickname === friend.nickname}
  {#if index === -1}
    <div class="mb-1 friend-item selected">
      <div
        class="d-flex align-items-center select-area"
        on:click={selectFriend}
      >
        <img
          src={`../../${friend.avatar}`}
          alt="avatar2"
          class="friend-avatar"
        />
        <span class="ml-2 font-weight-bolder nickname">{friend.nickname}</span>
      </div>
    </div>
  {:else}
    <div class="mb-1 friend-item selected">
      <div class="d-flex justify-content-between align-items-center">
        <div
          class="d-flex align-items-center select-area"
          on:click={selectFriend}
        >
          <img
            src={`../../${friend.avatar}`}
            alt="avatar2"
            class="friend-avatar"
          />
          <span class="ml-2 font-weight-bolder nickname">{friend.nickname}</span
          >
        </div>
        <button type="button" class="btn btn-link" on:click={remove_friend}
          ><Icon icon={faUserSlash} class="icon" /></button
        >
      </div>
    </div>
  {/if}
{/if}

{#if $selectedFriend.nickname !== friend.nickname}
  {#if index === -1}
    <div class="mb-1 friend-item">
      <div
        class="d-flex align-items-center select-area"
        on:click={selectFriend}
      >
        <img
          src={`../../${friend.avatar}`}
          alt="avatar2"
          class="friend-avatar"
        />
        <span class="ml-2 font-weight-bolder nickname">{friend.nickname}</span>
      </div>
    </div>
  {:else}
    <div class="mb-1 friend-item">
      <div class="d-flex justify-content-between align-items-center">
        <div
          class="d-flex align-items-center select-area"
          on:click={selectFriend}
        >
          <img
            src={`../../${friend.avatar}`}
            alt="avatar2"
            class="friend-avatar"
          />
          <span class="ml-2 font-weight-bolder nickname">{friend.nickname}</span
          >
        </div>
        <button type="button" class="btn btn-link" on:click={remove_friend}
          ><Icon icon={faUserSlash} class="icon" /></button
        >
      </div>
    </div>
  {/if}
{/if}

<style>
  .friend-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #cecbc9;
  }

  .friend-item {
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

  .select-area {
    cursor: pointer;
  }
</style>
