import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { taskService, Task, CreateTaskRequest } from '@/services/taskService'
import { TaskForm } from '@/components/TaskForm'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { TaskTable } from '@/components/TaskTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function Dashboard() {
  const { user, token } = useAuth()
  const queryClient = useQueryClient()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  const isAdmin = user?.role === 'ADMIN'

  const [adminTab, setAdminTab] = useState<'my-tasks' | 'all-tasks'>(
    isAdmin ? 'all-tasks' : 'my-tasks'
  )

  useEffect(() => {
    if (adminTab === 'all-tasks' && isAdmin) {
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] })
    }
  }, [adminTab, isAdmin, queryClient])

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: adminTab === 'all-tasks' && isAdmin ? ['admin-tasks'] : ['tasks', user?.id],
    queryFn: async () => {
      if (isAdmin && adminTab === 'all-tasks') {
        const allTasks = await taskService.getAllTasks(token)
        return allTasks
      }
      return taskService.getTasks(token)
    },
    enabled: !!token && !!user?.id,
    staleTime: 0,
    refetchOnMount: true,
  })

  const createMutation = useMutation({
    mutationFn: (task: CreateTaskRequest) =>
      taskService.createTask(task, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
      if (isAdmin) {
        queryClient.invalidateQueries({ queryKey: ['admin-tasks'] })
      }
      toast.success('Task created successfully!')
      setCreateDialogOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create task')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (task: CreateTaskRequest) =>
      taskService.updateTask(selectedTask!.id, task, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
      if (isAdmin) {
        queryClient.invalidateQueries({ queryKey: ['admin-tasks'] })
      }
      toast.success('Task updated successfully!')
      setEditDialogOpen(false)
      setSelectedTask(null)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update task')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => taskService.deleteTask(selectedTask!.id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
      if (isAdmin) {
        queryClient.invalidateQueries({ queryKey: ['admin-tasks'] })
      }
      toast.success('Task deleted successfully!')
      setDeleteDialogOpen(false)
      setSelectedTask(null)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete task')
    },
  })

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    return true
  })

  const handleCreateTask = async (taskData: CreateTaskRequest): Promise<void> => {
    await createMutation.mutateAsync(taskData)
  }

  const handleUpdateTask = async (taskData: CreateTaskRequest): Promise<void> => {
    await updateMutation.mutateAsync(taskData)
  }

  const handleDeleteTask = () => {
    return deleteMutation.mutateAsync()
  }

  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    setEditDialogOpen(true)
  }

  const handleDelete = (task: Task) => {
    setSelectedTask(task)
    setDeleteDialogOpen(true)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {error instanceof Error ? error.message : 'Failed to load tasks'}
            </p>
            <Button
              onClick={() => {
                if (isAdmin && adminTab === 'all-tasks') {
                  queryClient.invalidateQueries({ queryKey: ['admin-tasks'] })
                } else {
                  queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
                }
              }}
              className="mt-4"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 
          </h1>
          <p className="text-gray-600">
            {isAdmin
              ? `Viewing ${adminTab === 'my-tasks' ? 'your' : 'all users'} tasks`
              : `You have ${filteredTasks.length} task${filteredTasks.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl">
                {isAdmin && adminTab === 'all-tasks' ? 'All Users Tasks' : 'My Tasks'}
              </CardTitle>
            </div>
            {(!isAdmin || adminTab === 'my-tasks') && (
              <Button
                onClick={() => {
                  setSelectedTask(null)
                  setCreateDialogOpen(true)
                }}
                disabled={isLoading}
              >
                + Add Task
              </Button>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {isAdmin && (
              <Tabs value={adminTab} onValueChange={(v) => setAdminTab(v as 'my-tasks' | 'all-tasks')}>
                <TabsList>
                  <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
                  <TabsTrigger value="all-tasks">All Users Tasks</TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All Tasks ({tasks.length})
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pending ({tasks.filter((t) => !t.completed).length})
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed ({tasks.filter((t) => t.completed).length})
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="ml-2 text-gray-600">Loading tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No tasks found</p>
              </div>
            ) : (
              <TaskTable
                tasks={filteredTasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={
                  isLoading ||
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      {(!isAdmin || adminTab === 'my-tasks') && (
        <>
          <TaskForm
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            task={null}
            onSubmit={handleCreateTask}
            isLoading={createMutation.isPending}
          />

          <TaskForm
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            task={selectedTask}
            onSubmit={handleUpdateTask}
            isLoading={updateMutation.isPending}
          />

          <DeleteConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteTask}
            title="Delete Task"
            description={`Are you sure you want to delete "${selectedTask?.title}"? This action cannot be undone.`}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  )
}

export default Dashboard
