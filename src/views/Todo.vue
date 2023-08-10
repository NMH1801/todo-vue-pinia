<template>
  <v-container style="max-width: 960px">
    <v-text-field
      v-model="newTask"
      label="What are you working on?"
      variant="solo"
      @keydown.enter="create"
    >
      <template v-slot:append-inner>
        <v-fade-transition>
          <v-btn
            v-show="newTask"
            icon="mdi-plus-circle"
            variant="text"
            @click="create"
          ></v-btn>
        </v-fade-transition>
      </template>
      <template v-slot:loader>
        <v-progress-linear
          :active="todoStore.loading"
          absolute
          height="2"
          indeterminate
        ></v-progress-linear>
      </template>
    </v-text-field>
    <div>
      <h2 class="text-h4 text-primary ps-4">
        Tasks:&nbsp;
        <v-fade-transition leave-absolute>
          <span :key="`tasks-${todoStore.tasks.length}`">
            {{ todoStore.tasks.length }}
          </span>
        </v-fade-transition>
      </h2>
      <v-row class="align-center mb-auto">
        <v-col cols="4">
          <v-radio-group
            inline
            v-model="todoStore.filter"
            @change="todoStore.getTask()"
            class="align-center d-flex"
          >
            <v-radio label="All" value="all"></v-radio>
            <v-radio label="Done" value="done"></v-radio>
            <v-radio label="On Going" value="onGoing"></v-radio>
          </v-radio-group>
        </v-col>

        <v-card-text>
          <v-text-field
            density="compact"
            variant="solo"
            label="Search"
            append-inner-icon="mdi-magnify"
            hide-details
            @click:append-inner="onClick"
          ></v-text-field>
        </v-card-text>

        <v-btn color="blue-darken-2" v-bind="props" @click="todoStore.sortText()">
          Sort
          <v-icon end icon="mdi-sort"></v-icon>
        </v-btn>
      </v-row>
      <v-row></v-row>
      <v-card v-if="todoStore.tasks.length > 0">
        <v-slide-y-transition class="py-0" group tag="v-list">
          <template
            v-for="task in todoStore.tasks"
            :key="`${task.id}-${task.text}`"
          >
            <v-divider
              v-if="task.id !== 0"
              :key="`${task.id}-divider`"
            ></v-divider>

            <v-list-item>
              <template v-slot:prepend>
                <v-checkbox-btn
                  v-model="task.done"
                  color="grey"
                  @click="todoStore.editTask(task.id, task.done , 'toggle')"
                ></v-checkbox-btn>
              </template>

              <v-list-item-title>
                <span :class="task.done ? 'text-grey' : 'text-primary'">{{
                  task.text
                }}</span>
              </v-list-item-title>

              <div class="justify-self-end"></div>
              <template v-slot:append>
                <v-expand-x-transition>
                  <v-row>
                    <v-col cols="auto">
                      <v-dialog width="576" content-class="custom-modal">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            size="small"
                            color="primary"
                            v-bind="props"
                            @click="editTextEdit(task)"
                          >
                            Edit
                            <v-icon end icon="mdi-wrench"></v-icon>
                          </v-btn>
                        </template>
                        <template v-slot:default="{ isActive }">
                          <v-card>
                            <v-toolbar
                              color="primary"
                              title="Edit"
                              density="compact"
                              ><v-icon
                                size="large"
                                color="grey-lighten-5"
                                @click="
                                  isActive.value = false;
                                  textEdit = '';
                                "
                                icon="$delete"
                                class="mr-3"
                              ></v-icon
                            ></v-toolbar>

                            <v-card-text>
                              <v-text-field
                                label="Task"
                                required
                                v-model="this.textEdit"
                              ></v-text-field>
                            </v-card-text>
                            <v-card-actions class="justify-center">
                              <v-btn
                                color="primary"
                                @click="todoStore.editTask(task.id, textEdit, 'edit')"
                                :disabled="todoStore.loading"
                                :loading="todoStore.loading"
                                size="large"
                                block
                                >Apply</v-btn
                              >
                            </v-card-actions>
                          </v-card>
                        </template>
                      </v-dialog>
                    </v-col>

                    <v-col cols="auto">
                      <v-dialog width="576" content-class="custom-modal">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            size="small"
                            color="red-darken-1"
                            v-bind="props"
                          >
                            Delete
                            <v-icon end icon="mdi-delete"></v-icon>
                          </v-btn>
                        </template>
                        <template v-slot:default="{ isActive }">
                          <v-card>
                            <v-toolbar
                              color="red-darken-2"
                              title="Are you sure ?"
                              density="compact"
                              ><v-icon
                                size="large"
                                color="grey-lighten-5"
                                @click="isActive.value = false"
                                icon="$delete"
                                class="mr-3"
                              ></v-icon
                            ></v-toolbar>

                            <v-card-text>
                              <div class="text-h6">
                                This will delete:
                                <strong
                                  class="text-h5 font-weight-bold text-red-darken-1"
                                  >{{ task.text }}</strong
                                >
                              </div>
                            </v-card-text>
                            <v-card-actions class="justify-center">
                              <v-btn
                                color="error"
                                @click="todoStore.deleteTask(task)"
                                :disabled="todoStore.loading"
                                :loading="todoStore.loading"
                                size="large"
                                block
                                >Apply</v-btn
                              >
                            </v-card-actions>
                          </v-card>
                        </template>
                      </v-dialog>
                    </v-col>
                  </v-row>
                </v-expand-x-transition>
              </template>
            </v-list-item>
          </template>
        </v-slide-y-transition>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import { useTodoStore } from "@/store/Todo";
export default {
  data: () => ({
    newTask: null,
    textEdit: "",
  }),
  setup() {
    const todoStore = useTodoStore();
    return { todoStore };
  },

  methods: {
    editTextEdit(task) {
      this.textEdit = task.text;
    },
    create() {
      this.todoStore.createTask(this.newTask);
      this.newTask = null;
    },

    edit(task, status) {
      this.loading = true;
      const url = import.meta.env.VITE_END_POINT + "/todos/" + task.id; // Thay thế URL thích hợp
      if (this.textEdit !== "" && status === 0) {
        task.text = this.textEdit;
      }
      const dataToSend = {
        text: task.text,
        done: task.done,
        // Thêm các khóa và giá trị dữ liệu bạn muốn gửi
      };

      setTimeout(() => {
        axios
          .patch(url, dataToSend)
          .then((response) => {
            console.log("Response:", response.data);
            // Xử lý dữ liệu trả về từ yêu cầu POST (response.data)
            this.todoStore.getTask;
          })
          .catch((error) => {
            console.error("Error:", error);
            // Xử lý lỗi nếu có
          });
      }, 500);
    },
  },
  mounted() {
    this.todoStore.getTask();
  },
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
  text-align: center;
}
.bgRed {
  background-color: red;
}
</style>
