<template>
  <div>
    <ShortenerTitle/>
    <UserSettings/>
  </div>
</template>

<script>
import UserSettings from "../components/UserSettings.vue";
import ShortenerTitle from "../components/ShortenerTitle.vue";

export default {
  name: "account",
  components: {
    UserSettings,
    ShortenerTitle
  }
};
</script>
