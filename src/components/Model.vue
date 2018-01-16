<!-- 模态框 -->
<template>
  <div>
      <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdshow}">
          <div class="md-modal-inner">
            <div class="md-top">
              <div class="md-title"></div>
              <button class="md-close" @click="closeModel">Close</button>
            </div>
            <div class="md-content">
              <div class="confirm-tips">
                <slot name="message"></slot>
              </div>
              <div class="btn-wrap">
                <slot name="btnGroup"></slot>
              </div>
            </div>
          </div>
        </div>
        <div class="md-overlay" v-if="mdshow" @click="closeModel"></div>
  </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    props:{
        mdshow:{
            type:Boolean,
            default:false
        }
    },
    components: {},
    methods: {
        closeModel(){
            this.$emit("close");
        }
    }
};
</script>
<style lang='css' scoped>

</style>