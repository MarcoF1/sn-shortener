<template>
  <div class="short-container">
    <div class="short-name"> {{ short.shortName }}</div>
    <p>Creator ID: {{ creatorIdentity }}</p>
    <p>Short URL: <a target="_blank" v-bind:href=" 'http://localhost:3000/' + short.shortName">
      http://localhost:3000/{{short.shortName  }}
    </a> </p>
    <a target="_blank" v-bind:href="short.url">
      {{ short.url }}
    </a>
    <div class="short-item-actions">
      <input class="edit" v-model.trim='url' type="text" name="url" placeholder="New Url">
      <button v-on:click="updateShort">Update</button>
      <button v-on:click="deleteShort">Delete</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "ShortListItem",

  props: {
    short: Object
  },

  data() {
    return {
      url: ""
    };
  },

  computed: {
    creatorIdentity: function() {
      return this.short.creator ? this.short.creator : "anonymous";
    }
  },

  methods: {
    updateShort: function() {
      const body = { url: this.url };
      axios
        .put(`/api/shorts/${this.short.shortName}`, body)
        .then((res) => {
          // handle success
          eventBus.$emit("update-short-success", res);
        })
        .catch(err => {
          // handle error
          eventBus.$emit("update-short-error", err);
        })
        .then(() => (this.url = ""));
    },

    deleteShort: function() {
      axios
        .delete(`/api/shorts/${this.short.shortName}`, {})
        .then(() => {
          eventBus.$emit("delete-short-success", this.short);
        })
        .catch(err => {
          eventBus.$emit("delete-short-error", err);
        })
    }
  }
};
</script>
