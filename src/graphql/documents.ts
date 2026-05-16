/** GraphQLZero (JSONPlaceholder) — документация: https://graphqlzero.almansi.me */

export const GET_TASKS_QUERY = /* GraphQL */ `
  query GetTasks($options: PageQueryOptions) {
    todos(options: $options) {
      data {
        id
        title
        completed
        user {
          id
          name
          email
        }
      }
      meta {
        totalCount
      }
    }
  }
`

export const GET_TASK_QUERY = /* GraphQL */ `
  query GetTask($id: ID!) {
    todo(id: $id) {
      id
      title
      completed
      user {
        id
        name
        email
      }
    }
  }
`

export const CREATE_TASK_MUTATION = /* GraphQL */ `
  mutation CreateTask($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
      title
      completed
      user {
        id
        name
        email
      }
    }
  }
`

export const UPDATE_TASK_MUTATION = /* GraphQL */ `
  mutation UpdateTask($id: ID!, $input: UpdateTodoInput!) {
    updateTodo(id: $id, input: $input) {
      id
      title
      completed
      user {
        id
        name
        email
      }
    }
  }
`

export const DELETE_TASK_MUTATION = /* GraphQL */ `
  mutation DeleteTask($id: ID!) {
    deleteTodo(id: $id)
  }
`
