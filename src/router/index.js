import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: () => import("../layouts/MainLayout.vue"),
      children: [
        {
          path: "book-list",
          name: "bookList",
          component: () => import("../pages/BookListPage.vue"),
        },
        {
          path: "book-edit/:id?",
          name:"bookEdit",
          component: () => import("../pages/BookEditPage.vue"),
          props: true,
        },
        {
          path: "author-list",
          name: "authorList",
          component: () => import("../pages/AuthorListPage.vue"),
        },
        {
          path: "author-edit/:id?",
          name: "authorEdit",
          component: () => import("../pages/AuthorEditPage.vue"),
          props: true,
        },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0, left: 0 };
  },
});
export default router;
