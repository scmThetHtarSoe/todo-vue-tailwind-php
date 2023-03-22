<?php
include_once("api/createDB.php");
include_once("api/createTable.php");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>To Do Lists</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body>
    <div class="flex justify-center items-center h-screen" id="todoApp">
        <div class="container shadow w-[500px] h-auto p-8">
            <h2 class="title text-3xl">Todo</h2>

            <form id="form" class="flex my-4" @submit.prevent="addList()">
                <input type="text" id="list" class="border border-gray-300 w-full p-2 focus:outline-blue-500" placeholder="Add New..." v-model="newList" />
                <button type="submit" class="bg-blue-400 px-4 py-1 text-xl text-white ml-2">
                    +
                </button>
            </form>

            <div class="flex">
                <button type="button" id="all" class="flex-1 border border-gray-200 px-12 py-2" @click="showAll()">
                    All
                </button>
                <button type="button" id="notdone" class="flex-1 border border-gray-200 px-12 py-2 mx-2" @click="showActive()">
                    Active
                </button>
                <button type="button" id="done" class="flex-1 border border-gray-200 px-8 py-2" @click="showCompleted()">
                    Completed
                </button>
            </div>

            <ul class="my-4 list-none list-group" id="list-group">
                <li v-for="(todo,index) in todos" class="bg-gray-200 text-black py-2.5 px-5 border-b-2 border-neutral-100 flex items-center">
                    <input type="checkbox" v-model="todo.status" @click="checkList(todo.uni_id,index)" :checked="todo.status = todo.status==1 ? true : false " />

                    <div v-show="todo.showEditingbox == false">
                        <span :class="todo.status? 'line-through ml-4' : 'ml-4'" @dblclick="todo.showEditingbox = true;showAutofocus(index)">{{ todo.text }}</span>
                    </div>
                    <input ref="editFocus" type="text" v-model="todo.text" class="w-[300px] p-2.5 border-1 border-neutral-100" v-show="todo.showEditingbox == true" v-on:blur="todo.showEditingbox = false;updateList($event,todo.uni_id)" @keyup.enter="todo.showEditingbox = false;updateList($event,todo.uni_id)" />
                    <button @click="deleteList(todo.uni_id,index)" class="text-xl text-red-600 bg-white py-1 px-2 ml-auto">
                        &times;
                    </button>
                </li>
            </ul>
            <p class="text-gray-500">
                <span>{{totalItem}}</span> items left
            </p>
            <div class="flex mt-4">
                <button type="button" id="checkAll" class="flex-1 border border-gray-200 px-8 py-2 mr-4" v-text="totalItem==0 && todos.length>0?'Uncheck All':'Check All'" @click="checkAll($event)">
                    Check All
                </button>
                <button type="button" id="cleardone" class="flex-1 border border-gray-200 px-8 py-2" @click="clearCompleted()">
                    Clear Completed
                </button>
            </div>
        </div>
    </div>
    <!-- vue-3 -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="./view/script.js"></script>
</body>

</html>