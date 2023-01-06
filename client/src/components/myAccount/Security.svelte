<script>
  import { onMount } from "svelte";
  import { getNotificationsContext } from "svelte-notifications";

  import { changePassword } from "../../apis/auth";
  import { user, errors } from "../../store";

  const { addNotification } = getNotificationsContext();

  onMount(() => {
    errors.set({});
  });

  let userData = {
    oldPw: "",
    password: "",
    password2: "",
  };

  let errs = {};

  errors.subscribe((value) => {
    errs = value;
  });

  user.subscribe((value) => {
    userData.avatar = value.avatar;
  });

  const changePW = async () => {
    const res = await changePassword(userData);

    if (res === "success") {
      addNotification({
        text: "Password successfully updated",
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

<div class="modal fade" id="security">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title text-white">Change Password</h4>
        <button type="button" class="close" data-dismiss="modal">&times;</button
        >
      </div>

      <!-- Modal body -->
      <div class="modal-body px-4">
        <div class="d-flex justify-content-center">
          <form
            class="text-left text-white py-3 pw-form"
            on:submit|preventDefault={changePW}
          >
            <div class="form-group">
              <label for="oldPw">Current Password:</label>
              <input
                type="password"
                class="form-control"
                placeholder="Enter current password"
                name="oldPw"
                id="oldPw"
                bind:value={userData.oldPw}
              />
              {#if errs.oldPw}
                <div class="mt-2 text-red">{errs.oldPw}</div>
              {/if}
            </div>
            <div class="form-group">
              <label for="password">New Password:</label>
              <input
                type="password"
                class="form-control"
                placeholder="Enter new password"
                name="password"
                id="password"
                bind:value={userData.password}
              />
              {#if errs.password}
                <div class="mt-2 text-red">{errs.password}</div>
              {/if}
            </div>
            <div class="form-group">
              <label for="password2">Confirm Password:</label>
              <input
                type="password"
                class="form-control"
                placeholder="Confirm password"
                name="password2"
                id="password2"
                bind:value={userData.password2}
              />
              {#if errs.password2}
                <div class="mt-2 text-red">{errs.password2}</div>
              {/if}
            </div>
            <button type="submit" class="btn btn-info">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .pw-form {
    width: 100%;
    min-width: 250px;
  }

  .text-red {
    color: rgb(255, 92, 92);
  }

  .modal-content {
    background-color: #615550;
  }

  .modal-dialog {
    min-width: 300px;
  }
</style>
