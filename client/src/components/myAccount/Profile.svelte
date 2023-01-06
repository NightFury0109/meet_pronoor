<script>
  import { onMount } from "svelte";
  import { getNotificationsContext } from "svelte-notifications";

  import { updateUserData } from "../../apis/auth";
  import { user, errors } from "../../store";

  const { addNotification } = getNotificationsContext();

  onMount(() => {
    errors.set({});
  });

  let userData = {
    nickname: "",
    email: "",
    avatar: "",
  };

  let avatarFile;

  let errs = {};

  errors.subscribe((value) => {
    errs = value;
  });

  user.subscribe((value) => {
    userData.nickname = value.nickname;
    userData.email = value.email;
    userData.avatar = value.avatar;
  });

  const selectAvatar = (e) => {
    const file = e.target.files[0];
    let reader = new FileReader();

    reader.onload = function () {
      document.getElementById("avatar").src = reader.result;
    };

    reader.readAsDataURL(file);
    avatarFile = file;
  };

  const updateUser = async () => {
    const formData = new FormData();
    formData.append("nickname", userData.nickname);
    formData.append("email", userData.email);
    formData.append("avatar", avatarFile);

    const res = await updateUserData(formData);

    if (res === "success") {
      addNotification({
        text: "Successfully saved",
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
</script>

<div class="modal fade" id="profile">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title text-white">Your Profile</h4>
        <button type="button" class="close" data-dismiss="modal">&times;</button
        >
      </div>

      <!-- Modal body -->
      <div class="modal-body px-4">
        <div class="d-flex justify-content-center">
          <form
            class="text-left text-white py-2 update-form"
            on:submit|preventDefault={updateUser}
          >
            <label>
              <img
                src={`../../${userData.avatar}`}
                alt="avatar"
                id="avatar"
                class="user-avatar"
              />
              <input
                type="file"
                class="my-3 form-control-file"
                style="display: none;"
                on:change={selectAvatar}
              />
            </label>
            <div class="form-group">
              <label for="nickname">Nickname:</label>
              <input
                type="text"
                class="form-control"
                placeholder="Enter last name"
                name="nickname"
                id="nickname"
                bind:value={userData.nickname}
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
                bind:value={userData.email}
              />
              {#if errs.email}
                <div class="mt-2 text-red">{errs.email}</div>
              {/if}
            </div>
            <button type="submit" class="btn btn-info">Save</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .update-form {
    width: 100%;
    min-width: 250px;
  }

  .text-red {
    color: rgb(255, 92, 92);
  }

  .user-avatar {
    width: 150px;
    height: 150px;
    border-radius: 10px;
    border: 2px solid #cecbc9;
    cursor: pointer;
  }

  .modal-content {
    background-color: #615550;
  }

  .modal-dialog {
    min-width: 300px;
  }

  /* .modal {
    z-index: 100 !important;
  } */
</style>
