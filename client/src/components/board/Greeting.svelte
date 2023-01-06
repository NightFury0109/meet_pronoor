<script>
  import { user } from "../../store";

  let userData;

  user.subscribe((v) => {
    userData = v;
  });
</script>

<div class="greeting d-flex justify-content-center align-items-center">
  <div>
    <h3 class="user-nickname mb-3">Welcome, {userData.nickname}</h3>
    <img src={`../../${userData.avatar}`} alt="avatar" class="user-avatar" />
    <p class="user-nickname mt-2 lead">Please select a friend to start chat!</p>
  </div>
</div>

<style>
  .greeting {
    background-color: #cecbc9;
    width: 100%;
  }

  .user-avatar {
    width: 150px;
    height: 150px;
    border: 2px solid #615550;
    border-radius: 15px;
  }

  .user-avatar:hover {
    cursor: pointer;
  }

  .user-nickname {
    color: #615550;
    font-weight: bolder;
  }
</style>
