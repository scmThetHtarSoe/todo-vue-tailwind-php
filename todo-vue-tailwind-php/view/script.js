const { createApp } = Vue;
createApp({
  data() {
    return {
      todos: [],
      newList: "",
      leftLists: [],
      condition: "all",
    };
  },
  computed: {
    totalItem() {
      return this.leftLists.filter((data) => data.status != true).length;
    },
    items: function () {
      switch (this.condition) {
        case "all":
          return this.todos;
        case "active":
          return this.todos.filter((data) => data.status != true);
        case "inactive":
          return this.todos.filter((data) => data.status == true);
      }
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
      this.todos = this.todos.filter((data) => data.uni_id != index);
      var tasklistId = index;
      $.ajax({
        url: "/api/delete.php",
        method: "POST",
        data: {
          tasklistId: tasklistId,
        },
      });
      this.leftLists = this.todos;
    },
    checkList(idx) {
      this.todos.filter((data) => data.uni_id == idx).status == true
        ? false
        : true;
      $.ajax({
        url: "/api/updateStatus.php",
        method: "POST",
        data: {
          tasklistId: idx,
        },
      });
      this.leftLists = this.todos;
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
          var allLists = response.data;
          allLists.forEach(function (val) {
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
    this.todos.forEach((todo) => {
      todo.status = false;
    });
    var getAllLists = this.todos;

    $.ajax({
      url: "/api/allLists.php",
      type: "GET",
      success: function (response) {
        var allLists = response.data;
        allLists.forEach(function (val) {
          getAllLists.push({
            id: val.id,
            text: val.texts,
            status: Boolean(val.status),
            uni_id: val.unquid_id,
            showEditingbox: val.showEditingbox,
          });
        });
      },
    });
    this.leftLists = this.todos;
  },
}).mount("#todoApp");
