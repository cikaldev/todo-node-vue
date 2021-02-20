const AppTemplate = `
  <div id="app">
    <div class="container">
      <h1 class="my-4 pb-1 text-center">Todo App</h1>
      <section v-show="!isForm">
        <div class="text-center mb-3">
          <button class="btn btn-primary" @click="isForm=true">New Todo</button>
        </div>
        <p v-show="todos.length <= 0" class="lead text-center text-primary p-5">No data available ...</p>
        <div class="row">
          <div class="col-md-6" v-for="rs in todos" v-bind:key="rs.id">
            <div class="card mb-4">
              <div class="card-header">{{rs.title}}</div>
              <div class="card-body">
                <p>{{rs.description}}</p>
                <p>
                  <button class="btn btn-sm btn-warning me-2" @click="updateTodo(rs.id)">Update</button>
                  <button class="btn btn-sm btn-danger" @click="deleteTodo(rs.id)">Delete</button>
                </p>
              </div>
              <div class="card-footer text-muted d-flex flex-wrap justify-content-between">
                <small>Created: {{rs.created_at}}</small>
                <small>Updated: {{rs.updated_at}}</small>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section v-show="isForm">
        <div class="row">
          <div class="col-md-8 mx-auto">
            <div class="d-flex flex-wrap justify-content-between mb-3">
              <button class="btn btn-warning" @click="resetForm()">Cancel</button>
              <div v-show="!isFormEdit">
                <button class="btn btn-success" @click="postTodo()">Save Todo</button>
              </div>
              <div v-show="isFormEdit">
                <button class="btn btn-success" @click="updateTodo()">Update Todo</button>
              </div>
            </div>
            <div class="card">
              <div class="card-header">New Todo</div>
              <div class="card-body">
                <div class="mb-3">
                  <label for="" class="form-label">Title</label>
                  <input type="text" v-model="formdata.title" class="form-control" />
                </div>
                <div class="mb-3">
                  <label for="" class="form-label">Description</label>
                  <textarea v-model="formdata.description" class="form-control" rows="5"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
`

export default {
  name: 'App',
  data() {
    return {
      todos: [],
      isForm: false,
      isFormEdit: false,
      formdata: {
        title: '',
        description: ''
      },
    }
  },
  methods: {
    resetForm() {
      this.formdata.title = ''
      this.formdata.description = ''
      this.isForm = false
      this.isFormEdit = false
    },
    fetchTodo() {
      fetch('/api/read')
        .then(res => res.json())
        .then(data => this.todos = data)
    },
    postTodo() {
      fetch('/api/create', {
        method: 'POST',
        headers:{'content-type': 'application/json'},
        body: JSON.stringify(this.formdata)
      })
      .then(res => res.json())
      .then(data => {
          this.todos = data
          this.resetForm()
      })
    },
    updateTodo(id) {
      console.log(id)
      if (!id) {
        fetch(`/api/update/${this.isFormEdit}`, {
          method: 'POST',
          headers:{'content-type': 'application/json'},
          body: JSON.stringify(this.formdata)
        })
        .then(res => res.json())
        .then(data => {
            this.todos = data
            this.resetForm()
        })
      } else {
        this.isFormEdit = id
        const temp = this.todos
        temp.map(rs => {
          if (rs.id === id) {
            this.formdata.title = rs.title
            this.formdata.description = rs.description
          }
        })
        this.isForm = true
      }
    },
    deleteTodo(id) {
      fetch(`/api/delete/${id}`)
        .then(res => res.json())
        .then(data => this.todos = data)
        .catch(err => console.error(err));
    }
  },
  mounted() {
    this.fetchTodo()
  },
  template: AppTemplate
}