<template>
  <div class="nav-bar">
    <div>
      <router-link to="/account">
        <div class="nav-icon-container">
          <img src="/images/minimize_icon.png"/>
        </div>
        <span v-if="userName">
          Hi {{userName}}!
        </span>
        <span v-else>
          Sign In/Sign Up
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      userName: this.$cookie.get('url-shortener-auth')
    }
  },
};
</script>

<style scoped>
.nav-icon-container {
    width: 20px;
    height: 20px;
    display: inline-block;
}

.nav-icon-container img {
  width: inherit;
  height: inherit;
}
</style>
