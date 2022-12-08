<template>
  <div class="QnaReviewBox">
    <div>
      <div class="QnaReviewTitle">
        <span :class="(pageView)?'NowView':'NoView'" @click="pageViewChange">후기관리</span>
        <span :class="(pageView)?'NoView':'NowView'" @click="pageViewChange">QnA</span>
      </div>
      <div>
        <template v-if="pageView">
          <template v-if="role == 'ROLE_USER'">
            <review-view-user />
          </template>
          <template v-else>
            <review-view-host />
          </template>
        </template>
        <template v-else>
          <template v-if="role == 'ROLE_USER'">
            <qna-view-user />
          </template>
          <template v-else>
            <qna-view-host />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ReviewViewUser from '@/components/QnaReview/ReviewViewUser.vue'
import QnaViewUser from '@/components/QnaReview/QnaViewUser.vue'
import ReviewViewHost from '@/components/QnaReview/ReviewViewHost.vue'
import QnaViewHost from '@/components/QnaReview/QnaViewHost.vue'
export default {
  components: {
    ReviewViewUser,
    QnaViewUser,
    ReviewViewHost,
    QnaViewHost,
  },
  data(){
    return {
      role: this.$store.state.role,
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