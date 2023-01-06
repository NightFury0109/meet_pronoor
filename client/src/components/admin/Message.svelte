<script>
  import { selectedUser } from "../../store";

  let selected_user;

  selectedUser.subscribe((v) => {
    selected_user = v;
  });

  export let message;
  export let user;
</script>

{#if user.nickname === message.receiver}
  <div class="d-flex justify-content-start">
    {#if message.message_type === "text"}
      <div class="message-item mb-2">
        <div class="d-flex justify-content-md-between px-2">
          <div class="d-flex align-items-center">
            <img
              src={`../../${selected_user.avatar}`}
              alt="avatar"
              class="friend-avatar"
            />
            <span class="ml-2 font-weight-bolder avatar-text"
              >{message.sender}</span
            >
          </div>
          <div class="d-flex align-items-center">
            <p class="m-0">{message.receiver_time}</p>
          </div>
        </div>
        <hr class="my-2" />
        <p class="mb-2 px-2 text-left">{message.message}</p>
      </div>
    {:else}
      <div class="file-item-field">
        <p class="m-1 text-right file-time">
          {message.receiver_time}
        </p>
        <div class="file-item mb-2">
          <a href={`../../${message.filepath}`}>{message.filename}</a>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <div class="d-flex justify-content-end">
    {#if message.message_type === "text"}
      <div class="message-item mb-2">
        <div class="d-flex justify-content-md-between px-2">
          <div class="d-flex align-items-center">
            <img
              src={`../../${user.avatar}`}
              alt="avatar"
              class="friend-avatar"
            />
            <span class="ml-2 font-weight-bolder avatar-text"
              >{message.sender}</span
            >
          </div>
          <div class="d-flex align-items-center">
            <p class="m-0">{message.sender_time}</p>
          </div>
        </div>
        <hr class="my-2" />
        <p class="mb-2 px-2 text-left">{message.message}</p>
      </div>
    {:else}
      <div class="file-item-field">
        <p class="m-1 text-right file-time">
          {message.sender_time}
        </p>
        <div class="file-item mb-2">
          <a href={`../../${message.filepath}`}>{message.filename}</a>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .message-item {
    border-radius: 10px;
    background-color: white;
    padding: 5px;
    min-width: 200px;
    max-width: 600px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 4px 10px 0 rgba(0, 0, 0, 0.19);
    z-index: 2;
  }

  .file-item {
    border-radius: 5px;
    background-color: #cecbc9;
    padding: 5px;
    min-width: 200px;
    max-width: 500px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 4px 10px 0 rgba(0, 0, 0, 0.19);
  }

  .file-item-field {
    z-index: 2;
  }

  .friend-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid #f96714;
    cursor: pointer;
  }

  .file-time {
    color: #cecbc9;
  }
</style>
