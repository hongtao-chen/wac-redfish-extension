<template>
  <form class="connectionForm" @submit="checkConnection">
    <p>
      <label for="deviceName">Device name</label>
      <input type="text" placeholder="Enter a device name" class="input" id="deviceName" name="deviceName" v-model="deviceName">
    </p>

    <p>
      <label for="username">User name</label>
      <input type="text" placeholder="User name" class="input" id="username" name="username" v-model="username">
    </p>

    <p>
      <label for="password">Password</label>
      <input type="password" placeholder="Password" class="input" id="password" name="password" v-model="password">
    </p>

    <p class="buttons">
      <input type="submit" value="Submit">
    </p>
  </form>
</template>

<script>
import manifest from "../manifest.json";

export default {
  props: {
    shell: { type: Object }
  },

  data() {
    return {
      deviceName: '',
      username: '',
      password: ''
    }
  },

  methods: {
    checkConnection: function(d) {
      const connectionType = manifest.entryPoints[1].connectionType
      this.shell.updateData({
        credentials: null,
        connections: [
          {
            name: this.deviceName,
            id: connectionType + "!" + this.deviceName,
            type: connectionType,
            // DO NOT store credential in connection, it's not secure. Here is for demo only.
            properties: {
              baseAuthorization: 'Basic ' + btoa(unescape(encodeURIComponent(this.username + ':' + this.password)))
            }
          }
        ]
      })

      d.preventDefault()
    }
  }
}
</script>

<style module>

.input {
  width: 100%;
}

.buttons {
  text-align: right;
}
</style>

