const { createApp } = Vue;
createApp({
  data() {
    return {
      todos: [],
      newList: "",
      leftLists: [],
    };
  },
  computed: {
    totalItem() {
      return this.leftLists.filter((data) => data.status != true).length;
    },
  },
  methods: {
    addList() {
      if (this.newList.trim() != "") {
        var list = {
          uni_id: Date.now(),
          texts: this.newList,
        };
        this.todos.push({
          uni_id: Date.now(),
          text: this.newList,
          status: 0,
          showEditingbox: 0,
        });
        this.newList = "";
        $.ajax({
          url: "/api/create.php",
          type: "POST",
          data: list,
        });
      }
      this.leftLists = this.todos;
    },
    deleteList(index, idx) {
      this.todos.splice(idx, 1);
      var tasklistId = index;
      $.ajax({
        url: "/api/delete.php",
        method: "POST",
        data: {
          tasklistId: tasklistId,
        },
      });
    },
    checkList(idx, index) {
      this.todos[index].status =
        this.todos[index].status == true ? false : true;
      $.ajax({
        url: "/api/updateStatus.php",
        method: "POST",
        data: {
          tasklistId: idx,
        },
      });
      this.leftLists = this.todos;
    },
    showAll() {
      this.todos = [];
      this.todos = this.all();
      this.leftLists = this.todos;
    },
    showActive() {
      this.todos = [];
      $active = this.todos;
      $.ajax({
        url: "/api/active.php",
        type: "GET",
        success: function (response) {
          $allLists = response.data;
          $allLists.forEach(function (val) {
            this.$active.push({
              id: val.id,
              text: val.texts,
              status: val.status,
              uni_id: val.unquid_id,
              showEditingbox: val.showEditingbox,
            });
          });
        },
      });
      this.leftLists = this.todos;
    },
    showCompleted() {
      this.todos = [];
      $active = this.todos;
      $.ajax({
        url: "/api/completed.php",
        type: "GET",
        success: function (response) {
          $allLists = response.data;
          $allLists.forEach(function (val) {
            this.$active.push({
              id: val.id,
              text: val.texts,
              status: val.status,
              uni_id: val.unquid_id,
              showEditingbox: val.showEditingbox,
            });
          });
        },
      });
    },
    checkAll(el) {
      if (el.target.innerText == "Check All") {
        this.todos.filter((data) => (data.status = true));
        $.ajax({
          url: "/api/checkAll.php",
          method: "POST",
          data: $(this).serialize(),
        });
      } else {
        this.todos.filter((data) => (data.status = false));
        $.ajax({
          url: "/api/uncheckAll.php",
          method: "POST",
          data: $(this).serialize(),
        });
      }
    },
    clearCompleted() {
      this.todos = this.todos.filter((data) => data.status != true);
      $.ajax({
        url: "/api/clearCompleted.php",
        type: "POST",
      });
    },
    updateList(el, idx) {
      var val = el.target.value;
      if (el.target.value.trim() != "") {
        $.ajax({
          url: "/api/update.php",
          type: "POST",
          data: {
            tasklistId: idx,
            gettexts: val,
          },
        });
      } else {
        this.todos = [];
        this.all();
      }
      this.leftLists = this.todos;
    },
    showAutofocus(index) {
      this.$nextTick(() => this.$refs["editFocus"][index].focus());
    },
    all() {
      const getAllLists = this.todos;
      $.ajax({
        url: "/api/allLists.php",
        type: "GET",
        success: function (response) {
          $allLists = response.data;
          $allLists.forEach(function (val) {
            getAllLists.push({
              id: val.id,
              text: val.texts,
              status: val.status,
              uni_id: val.unquid_id,
              showEditingbox: val.showEditingbox,
            });
          });
        },
      });
      return getAllLists;
    },
  },
  created() {
    $getAllLists = this.todos;

    $.ajax({
      url: "/api/allLists.php",
      type: "GET",
      success: function (response) {
        $allLists = response.data;
        $allLists.forEach(function (val) {
          this.$getAllLists.push({
            id: val.id,
            text: val.texts,
            status: val.status,
            uni_id: val.unquid_id,
            showEditingbox: val.showEditingbox,
          });
        });
      },
    });
    this.leftLists = this.todos;
  },
}).mount("#todoApp");
