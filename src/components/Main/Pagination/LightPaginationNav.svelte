<script>
  import PaginationNav from './PaginationNav.svelte'
</script>

<div class="light-pagination-nav">
  <PaginationNav {...$$props} on:setPage />
</div>

<style>
.light-pagination-nav :global(.pagination-nav) {
  display: flex;
  justify-content: center;
  /* background: #FFF; */
  border-radius: 3px;
}
.light-pagination-nav :global(.option) {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s all ease-out;
  user-select: none;
  color: var(--main-text-color);
}

.light-pagination-nav :global(.option.number),
.light-pagination-nav :global(.option.ellipsis) {
  padding: 10px 15px;
}
.light-pagination-nav :global(.option:hover) {
  background: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.light-pagination-nav :global(.option.active) {
  color: var(--main-theme-color);
}
</style>