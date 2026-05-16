import type {
  CreateTaskInput,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskInput,
} from '../types/task'
import { graphqlClient } from '../graphql/client'
import {
  CREATE_TASK_MUTATION,
  DELETE_TASK_MUTATION,
  GET_TASK_QUERY,
  GET_TASKS_QUERY,
  UPDATE_TASK_MUTATION,
} from '../graphql/documents'

/** Ответ GraphQLZero для узла Todo */
export interface GqlTodo {
  id: string | null
  title: string | null
  completed: boolean | null
  user?: {
    id?: string | null
    name?: string | null
    email?: string | null
  } | null
}

interface GetTodosQueryResult {
  todos: { data: GqlTodo[] }
}

interface GetTodoQueryResult {
  todo: GqlTodo | null
}

interface CreateTodoMutationResult {
  createTodo: GqlTodo
}

interface UpdateTodoMutationResult {
  updateTodo: GqlTodo
}

interface DeleteTodoMutationResult {
  deleteTodo: boolean
}

interface GqlCreateTodoPayload {
  title: string
  completed: boolean
}

interface GqlUpdateTodoPayload {
  title?: string | null
  completed?: boolean | null
}

export function todoToTask(node: GqlTodo): Task | null {
  if (
    node.id == null ||
    node.title == null ||
    node.completed == null
  ) {
    return null
  }

  const idNum = Number.parseInt(node.id, 10) || 0
  const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH']
  const priority = priorities[idNum % 3] ?? 'MEDIUM'

  const status: TaskStatus = node.completed ? 'DONE' : 'TODO'

  const assignee = node.user?.name?.trim() || 'Unknown'
  const email = node.user?.email?.trim()
  const description =
    email && email.length > 0 ? `Contact: ${email}` : ''

  const createdAt = new Date(
    Date.UTC(2020, 0, 1) + idNum * 3600000,
  ).toISOString()

  return {
    id: node.id,
    title: node.title,
    description,
    status,
    priority,
    assignee,
    createdAt,
  }
}

function buildGraphQLZeroTitle(input: CreateTaskInput): string {
  const title = input.title.trim()
  const desc = input.description.trim()
  const person = input.assignee.trim()
  const parts = [
    title,
    desc && `— ${desc.slice(0, 200)}`,
    person && `@${person.replace(/\s+/g, '_').slice(0, 80)}`,
  ].filter(Boolean)
  return parts.join(' ').slice(0, 480)
}

function buildGqlUpdateTodoPayload(
  input: UpdateTaskInput,
): GqlUpdateTodoPayload {
  const gql: GqlUpdateTodoPayload = {}
  if (input.status !== undefined) {
    gql.completed = input.status === 'DONE'
  }
  if (input.title !== undefined) gql.title = input.title
  return gql
}

export async function fetchTasks(): Promise<Task[]> {
  const data = await graphqlClient.request<GetTodosQueryResult>(
    GET_TASKS_QUERY,
  )
  return data.todos.data
    .map(todoToTask)
    .filter((t): t is Task => t !== null)
}

export async function fetchTaskById(id: string): Promise<Task | null> {
  const data = await graphqlClient.request<GetTodoQueryResult, { id: string }>(
    GET_TASK_QUERY,
    { id },
  )
  if (!data.todo) return null
  return todoToTask(data.todo)
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const gqlInput: GqlCreateTodoPayload = {
    title: buildGraphQLZeroTitle(input),
    completed: false,
  }
  const data = await graphqlClient.request<
    CreateTodoMutationResult,
    { input: GqlCreateTodoPayload }
  >(CREATE_TASK_MUTATION, { input: gqlInput })
  const task = todoToTask(data.createTodo)
  if (!task) {
    throw new Error('Invalid todo payload from createTodo')
  }
  return task
}

export async function updateTask(input: UpdateTaskInput): Promise<Task> {
  const gqlInput = buildGqlUpdateTodoPayload(input)
  if (
    gqlInput.title === undefined &&
    gqlInput.completed === undefined
  ) {
    throw new Error('Nothing to update for GraphQLZero todo')
  }

  const data = await graphqlClient.request<
    UpdateTodoMutationResult,
    { id: string; input: GqlUpdateTodoPayload }
  >(UPDATE_TASK_MUTATION, {
    id: input.id,
    input: gqlInput,
  })

  const task = todoToTask(data.updateTodo)
  if (!task) {
    throw new Error('Invalid todo payload from updateTodo')
  }
  return task
}

export async function deleteTask(id: string): Promise<boolean> {
  const data = await graphqlClient.request<
    DeleteTodoMutationResult,
    { id: string }
  >(DELETE_TASK_MUTATION, { id })
  return data.deleteTodo
}
