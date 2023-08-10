import { defineStore } from "pinia";
import axios from "axios";
const todoURL = import.meta.env.VITE_END_POINT + "/todos";
export const useTodoStore = defineStore("todoStore", {
  state: () => ({
    filter: "all",
    sort: 0,
    loading: true,
    tasks: [],
  }),
  getters: {
    getFilterQuery() {
      switch (this.filter) {
        case "all":
          return "";
        case "done":
          return "done=true&";
        case "onGoing":
          return "done=false&";
        default:
          return "";
      }
    },
    getSortQuery() {
      switch (this.sort) {
        case 0:
          return "";
        case 1:
          return "_sort=text&_order=desc&";
        case 2:
          return "_sort=text&_order=asc&";
        default:
          return "";
      }
    },
  },

  actions: {
    sortText() {
      if (this.sort < 2) {
        this.sort++;
      } else {
        this.sort = 0;
      }
      this.getTask();
    },
    async getTask() {
      this.loading = true;
      try {
        const url = todoURL + "?" + this.getFilterQuery + this.getSortQuery;
        const response = await axios.get(url);
        this.tasks = response.data;
      } catch (error) {
        console.error("Error:", error);
        // Xử lý lỗi nếu có
      }
      this.loading = false;
    },
    async createTask(state) {
      this.loading = true;
      try {
        const taskData = {
          text: state,
          done: false,
        };
        const response = await axios.post(todoURL, taskData); // taskData là dữ liệu từ state
        // Xử lý dữ liệu trả về nếu cần
        this.getTask(); // Gọi lại action để cập nhật danh sách
      } catch (error) {
        console.error("Error:", error);
        // Xử lý lỗi nếu có
      }
      this.loading = false;
    },
    async deleteTask(state) {
      this.loading = true;
      try {
        const URL = todoURL + "/" + state.id;
        const response = await axios.delete(URL);

        this.getTask();
      } catch (error) {
        console.error("Error:", error);
      }
      this.loading = false;
    },
    async editTask(id, state, control) {
      this.loading = true;
      console.log(id, state, control);

      try {
        const URL = todoURL + "/" + id;
        if (control === "toggle") {
          const data = {
            done: !state,
          };
          const response = await axios.patch(URL, data);
        } else {
          const data = {
            text: state,
          };
          const response = await axios.patch(URL, data);
        }
        this.getTask();
      } catch (error) {
        console.error("Error:", error);
      }
      this.loading = false;
    },
  },
});
