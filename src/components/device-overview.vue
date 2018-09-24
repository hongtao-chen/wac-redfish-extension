<template>
  <div class="overview">
    <h4>BIOS version: {{ summary.BiosVersion }}</h4>
    <h4>Manufacturer: {{ summary.Manufacturer }}</h4>
    <h4>Model: {{ summary.Model }}</h4>
    <h4>SKU: {{ summary.SKU }}</h4>
    <h4>Serial Number: {{ summary.SerialNumber }}</h4>
    <h4 v-if="summary.ProcessorSummary">Processor Summary: {{ summary.ProcessorSummary.Count }} ({{ summary.ProcessorSummary.Model }})</h4>
    <h4 v-if="summary.MemorySummary">Total System Memory GiB: {{ summary.MemorySummary.TotalSystemMemoryGiB }}</h4>

    <div>{{ error }}</div>
  </div>
</template>

<script>
export default {
  props: {
    shell: { type: Object }
  },

  data() {
    return {
        summary: {},
        error: null
    }
  },

  mounted () {
    this.shell.fetch('features/rest/redfish/v1/Systems/1/')
    .then(res => this.summary = res.data)
    .catch(e => this.error = e)
  }
}
</script>
