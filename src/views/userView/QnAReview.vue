<template>
  <div class="QnaReviewBox">
    <div>
      <div class="QnaReviewTitle">
        <span :class="(pageView)?'NowView':'NoView'" @click="pageViewChange">후기관리</span>
        <span :class="(pageView)?'NoView':'NowView'" @click="pageViewChange">QnA</span>
      </div>
      <div>
        <template v-if="pageView">
          <review-view-vue />
        </template>
        <template v-else>
          <qna-view-vue />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ReviewViewVue from '@/components/user/ReviewView.vue'
import QnaViewVue from '@/components/user/QnaView.vue'
export default {
  components: {
    ReviewViewVue,
    QnaViewVue,
  },
  data(){
    return {
      pageView: true,
    }
  },
  methods: {
    pageViewChange(){
      this.pageView = !this.pageView
    },
  },
}
</script>

<style scoped>
.QnaReviewBox{
  position: relative;
  justify-content: center;
  background: rgb(230, 230, 230);
  display: flex;
  height: 110vh;
}
.QnaReviewTitle{
  margin: 5vh 0;
  text-align: center;
}
.QnaReviewTitle span{
  border-radius: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1rem;
  padding: 0 3vw;
  margin: 0 2vw;
  background: white;
}
.NowView{
  border-bottom: 5px solid rgb(0, 0, 0);
  pointer-events: none;
}
.NoView{
  color: gray;
  cursor: pointer;
}
</style>