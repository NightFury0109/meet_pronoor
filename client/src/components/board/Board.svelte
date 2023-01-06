<script>
  import { afterUpdate, onMount } from "svelte";
  import { Icon } from "svelte-fontawesome";
  import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
  import { getNotificationsContext } from "svelte-notifications";
  import openSocket from "socket.io-client";
  import Dropdown from "sv-bootstrap-dropdown";
  import FileDrop from "filedrop-svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import Inputmask from "inputmask";
  import classnames from "classnames";

  import {
    user,
    usersExpUser,
    friends,
    selectedFriend,
    socketURL,
    messages,
  } from "../../store";
  import { getFriends, logout, getUsersExpUser } from "../../apis/auth";
  import { saveMessage, getMessages } from "../../apis/message";
  import isEmpty from "../../utils/is-empty";

  import MessageItem from "./MessageItem.svelte";
  import FriendItem from "./FriendItem.svelte";
  import Profile from "../myAccount/Profile.svelte";
  import Security from "../myAccount/Security.svelte";
  import Greeting from "./Greeting.svelte";

  const { addNotification } = getNotificationsContext();

  let search_key;
  let userData;
  let totalFriends;
  let friend;
  let users_exp_user;
  let socket_url;
  let message = "";
  let msgs = [];
  let dropdownTrigger;
  let innerHeight;
  let innerWidth;
  let file;
  let live_time = [60];
  let liveTime = "00:01:00";
  const im = new Inputmask("99:99:99");
  let time_format_error = false;
  let cursorPos;

  usersExpUser.subscribe((v) => {
    users_exp_user = v;
  });

  messages.subscribe((v) => {
    msgs = v;
  });

  socketURL.subscribe((v) => {
    socket_url = v;
  });

  onMount(() => {
    getFriends();
    getUsersExpUser();
  });

  const socket = openSocket(socket_url, { secure: true });

  socket.on("createMessage", (data) => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    data.receiver_time = date + " " + time;

    const newMsg = new Array();

    newMsg.sender = data.sender;
    newMsg.receiver = data.receiver;
    newMsg.message_type = data.message_type;
    newMsg.message = data.message;
    newMsg.sender_time = data.sender_time;
    newMsg.receiver_time = data.receiver_time;
    if (data.message_type === "file") {
      newMsg.filepath = data.filepath;
      newMsg.filename = data.filename;
    }

    // if (isEmpty(msgs)) {
    //   msgs[0] = newMsg;
    // } else {
    //   msgs.push(newMsg);
    // }

    // messages.set(msgs);

    socket.emit("updateTime", data);

    getMessages($selectedFriend.nickname);
  });

  socket.on("hideMessage", (data) => {
    const removeIndex = msgs.findIndex((msg) => {
      return (
        msg.sender === data.sender &&
        msg.receiver === data.receiver &&
        msg.sender_time === data.sender_time
      );
    });

    msgs.splice(removeIndex, 1);
    messages.set(msgs);
    // getMessages($selectedFriend.nickname);
  });

  afterUpdate(() => {
    const element = document.querySelector(".msg-appear-field");
    if (element !== null) element.scrollTop = element.scrollHeight;
  });

  user.subscribe((v) => {
    userData = v;
  });

  friends.subscribe((v) => {
    totalFriends = v;
  });

  selectedFriend.subscribe((v) => {
    friend = v;
  });

  const sendMessage = async () => {
    if (userData.block) {
      addNotification({
        text: "You are blocked!",
        position: "top-right",
        type: "warning",
        removeAfter: 3000,
      });
    } else if (friend.block) {
      addNotification({
        text: `${friend.nickname} is blocked!`,
        position: "top-right",
        type: "warning",
        removeAfter: 3000,
      });
    } else if (isEmpty(friend)) {
      addNotification({
        text: "Select a friend!",
        position: "top-right",
        type: "warning",
        removeAfter: 3000,
      });
    } else if (isEmpty(message) && isEmpty(file)) {
      addNotification({
        text: "Input a message!",
        position: "top-right",
        type: "warning",
        removeAfter: 3000,
      });
    } else {
      const msgData = new FormData();
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();
      const sender_time = date + " " + time;

      if (isEmpty(file)) {
        msgData.append("sender", userData.nickname);
        msgData.append("receiver", friend.nickname);
        msgData.append("message", message);
        msgData.append("sender_time", sender_time);
        msgData.append("receiver_time", "");
        msgData.append("message_type", "text");
        msgData.append("live_time", live_time * 1000);
      } else {
        msgData.append("sender", userData.nickname);
        msgData.append("receiver", friend.nickname);
        msgData.append("sender_time", sender_time);
        msgData.append("receiver_time", "");
        msgData.append("message", "");
        msgData.append("file", file);
        msgData.append("message_type", "file");
        msgData.append("live_time", live_time * 1000);
      }

      const res = await saveMessage(msgData);

      if (res.msg === "success") {
        message = "";
        file = "";
        socket.emit("createMessage", res.newMsg);
      }
    }
  };

  const clickLogout = () => {
    logout();
  };

  const searchFriend = () => {
    if (!isEmpty(search_key)) {
      const search_result = users_exp_user.filter((user) => {
        return user.nickname.toLowerCase().search(search_key) !== -1;
      });
      friends.set(search_result);
    } else {
      getFriends();
    }
  };

  const get_friends = (e) => {
    if (e.charCode === 13 && isEmpty(search_key)) getFriends();
  };

  const fileDrop = (e) => {
    file = e.detail.files.accepted[0];
    message = file.name;
    document.querySelector(".message-box").focus();
  };

  const changeLiveTime = () => {
    let hour = Math.floor(live_time / 3600);
    if (hour < 10) {
      hour = "0" + hour;
    }
    let minute = Math.floor((live_time % 3600) / 60);
    if (minute < 10) {
      minute = "0" + minute;
    }
    let second = live_time % 60;
    if (second < 10) {
      second = "0" + second;
    }
    liveTime = hour + ":" + minute + ":" + second;
  };

  const enterLiveTime = () => {
    im.mask(document.querySelector("#live_time"));
    const hour = parseInt(liveTime.substr(0, 2));
    const minute = parseInt(liveTime.substr(3, 2));
    const sec = parseInt(liveTime.substr(6, 2));

    if (
      hour <= 36 &&
      hour >= 0 &&
      minute < 60 &&
      minute >= 0 &&
      sec < 60 &&
      sec >= 0
    ) {
      if (hour === 0 && minute === 0 && sec < 30) {
        time_format_error = true;
      } else {
        time_format_error = false;
        const time = hour * 3600 + minute * 60 + sec;
        live_time[0] = time;
      }
    } else {
      time_format_error = true;
    }
  };

  const selectCursorPos = (e) => {
    cursorPos = e.target.selectionStart;
    console.log(cursorPos);
  };

  const wheelLiveTime = (e) => {
    let hour = parseInt(liveTime.substr(0, 2));
    let minute = parseInt(liveTime.substr(3, 2));
    let sec = parseInt(liveTime.substr(6, 2));

    // const cursorPos = e.target.selectionStart;
    const offset = e.deltaY;
    const element = document.getElementById("live_time");

    if (cursorPos === 0 || cursorPos === 1 || cursorPos === 2) {
      hour -= offset * 0.01;

      const time = hour * 3600 + minute * 60 + sec;

      if (hour < 10) {
        hour = "0" + hour;
      }

      if (minute < 10) {
        minute = "0" + minute;
      }

      if (sec < 10) {
        sec = "0" + sec;
      }

      if (hour >= 0 && hour <= 36) {
        liveTime = hour + ":" + minute + ":" + sec;
        live_time[0] = time;
      }
    } else if (cursorPos === 3 || cursorPos === 4 || cursorPos === 5) {
      minute -= offset * 0.01;

      const time = hour * 3600 + minute * 60 + sec;

      if (hour < 10) {
        hour = "0" + hour;
      }

      if (minute < 10) {
        minute = "0" + minute;
      }

      if (sec < 10) {
        sec = "0" + sec;
      }

      if (minute >= 0 && minute < 60) {
        liveTime = hour + ":" + minute + ":" + sec;
        live_time[0] = time;
      }
    } else if (cursorPos === 6 || cursorPos === 7 || cursorPos === 8) {
      sec = sec - offset * 0.01;

      const time = hour * 3600 + minute * 60 + sec;

      if (hour < 10) {
        hour = "0" + hour;
      }

      if (minute < 10) {
        minute = "0" + minute;
      }

      if (sec < 10) {
        sec = "0" + sec;
      }

      if (sec >= 0 && sec < 60) {
        liveTime = hour + ":" + minute + ":" + sec;
        live_time[0] = time;
      }
    }
  };

  window.process = {
    env: "production",
  };
</script>

<svelte:window bind:innerHeight bind:innerWidth />
<Profile />
<Security />
<div class="d-flex total-height">
  <!-- Users list field -->
  <div class="users-field" style="height: {innerHeight}px;">
    <div>
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <img
            src={`../../${userData.avatar}`}
            alt="avatar"
            class="main-avatar"
          />
          <span class="ml-2 font-weight-bolder user-nickname"
            >{userData.nickname}</span
          >
        </div>
        <Dropdown triggerElement={dropdownTrigger}>
          <button type="button" class="btn btn-link" bind:this={dropdownTrigger}
            ><Icon icon={faEllipsisV} class="icon" /></button
          >
          <div slot="DropdownMenu">
            <button
              class="dropdown-item"
              type="button"
              data-toggle="modal"
              data-target="#profile">Profile</button
            >
            <button
              class="dropdown-item"
              type="button"
              data-toggle="modal"
              data-target="#security">Security</button
            >
            <button class="dropdown-item" type="button" on:click={clickLogout}
              >Logout</button
            >
          </div>
        </Dropdown>
      </div>
    </div>
    <input
      type="text"
      class="form-control form-control-sm mt-2 search-input"
      placeholder="Search users"
      bind:value={search_key}
      on:input={searchFriend}
      on:keypress={get_friends}
    />
    <div
      class="users-list mt-3 text-left"
      style="height: {innerHeight - 190}px;"
    >
      {#if !isEmpty(totalFriends)}
        {#each totalFriends as friend}
          <FriendItem {friend} />
        {/each}
      {/if}
    </div>
  </div>

  {#if isEmpty(friend)}
    <Greeting />
  {:else}
    <!-- Chat field -->
    <div
      class="chat-field"
      style="height: {innerHeight}px;width:{innerWidth}px"
    >
      <!-- Tools field -->
      <div class="d-flex justify-content-between px-3">
        <div class="d-flex align-items-center">
          <img
            src={`../../${friend.avatar}`}
            alt="avatar2"
            class="friend-avatar"
          />
          <span class="ml-2 font-weight-bolder friend-nickname"
            >{friend.nickname}</span
          >
        </div>
        <div class="d-flex align-items-center">
          <div style="width: 300px;">
            <RangeSlider
              bind:values={live_time}
              min={30}
              max={129600}
              range="min"
              on:change={changeLiveTime}
            />
          </div>
          <input
            type="text"
            class={classnames("form-control live-time ml-3", {
              "is-invalid": time_format_error,
            })}
            id="live_time"
            bind:value={liveTime}
            on:input={enterLiveTime}
            on:mousewheel={wheelLiveTime}
            on:mouseup={selectCursorPos}
          />
        </div>
      </div>
      <!-- Message field -->
      <div class="message-field mt-2" style="height: {innerHeight - 140}px;">
        <FileDrop on:filedrop={fileDrop}>
          <div
            class="filedrop-field"
            style="height: {innerHeight - 160}px;width:{innerWidth - 435}px"
          />
        </FileDrop>
        <form
          class="d-flex justify-content-center"
          on:submit|preventDefault={sendMessage}
        >
          <input
            type="text"
            placeholder="Type a message"
            class="form-control-lg form-control message-box"
            bind:value={message}
          />
        </form>
        <div class="msg-appear-field">
          {#if !isEmpty(msgs)}
            {#each msgs as msg}
              <MessageItem message={msg} />
            {/each}
          {/if}
        </div>
      </div>
    </div>
  {/if}
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
    padding: 0 1rem 5rem 1rem;
    position: relative;
    background-color: #615550;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .filedrop-field {
    width: 100%;
    padding: 1rem;
    position: absolute;
    left: 10px;
    top: 10px;
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

  .live-time {
    width: 118px;
    font-size: 18px;
  }

  .message-box {
    position: absolute;
    bottom: 10px;
    width: 80%;
    max-width: 800px;
    border-radius: 20px;
    padding: 10px 25px;
    border-color: #cecbc9 !important;
    z-index: 3;
  }
  .message-box:focus {
    border-color: #cecbc9 !important;
    box-shadow: 0 0 0 0.2rem rgba(211, 209, 209, 0.25);
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
