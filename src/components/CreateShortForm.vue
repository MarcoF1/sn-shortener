<template>
  <div class="subcontainer">
    <div class="header primary-header">
      URL Shortener
    </div>
    <div class="short-form-container">
      <!-- the submit event will no longer reload the page -->
      <form id='create-short' v-on:submit.prevent='createShort' method='post'>

        <input id='name' v-model.trim='shortName' type='text' name='shortName'  placeholder="Enter Short Name">
        <input id='url' v-model.trim='url' type='url' name='url' placeholder="Enter URL">

        <input type='submit' value="Create Short" id="createFreet" class="button">

        <div v-if='success' class="success-message">
          {{ success }}
        </div>

        <div v-if='errors.length' class="error-message">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for='error in errors' v-bind:key='error.id'>{{ error }}</li>
          </ul>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "CreateShortForm",

  data() {
    return {
      errors: [],
      success: "",
      shortName: "",
      url: ""
    };
  },

  methods: {
    createShort: function() {
      this.errors = [];

      if (this.shortName === "" || this.url === "") {
        if (this.shortName === "") {
          this.errors.push("Short name is required");
        }

        if (this.url === "") {
          this.errors.push("URL is required");
        }

        this.clearMessages();
      } else {
        const bodyContent = { shortName: this.shortName, url: this.url };
        axios
          .post("/api/shorts", bodyContent)
          .then(short => {
            // handle success
            this.success = "Short created successfully!";
            eventBus.$emit("create-short-success", short);
          })
          .catch(err => {
            // handle error
            this.errors.push(err.response.data.error);
          })
          .then(() => {
            // always executed
            this.resetForm();
            this.clearMessages();
          });
      }
    },

    resetForm: function() {
      this.shortName = "";
      this.url = "";
    },

    clearMessages: function() {
      setInterval(() => {
        this.errors = [];
        this.success = "";
      }, 5000);
    }
  }
};
</script>
