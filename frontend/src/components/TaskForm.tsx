import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Task, CreateTaskRequest } from '@/services/taskService'

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  onSubmit: (task: CreateTaskRequest) => Promise<void>
  isLoading?: boolean
}

export function TaskForm({
  open,
  onOpenChange,
  task,
  onSubmit,
  isLoading = false,
}: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: task?.title || '',
    description: task?.description || '',
    completed: task?.completed || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Title is required')
      return
    }
    try {
      await onSubmit(formData)
      setFormData({ title: '', description: '', completed: false })
      onOpenChange(false)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {task
              ? 'Update the task details below'
              : 'Add a new task to your dashboard'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="completed"
              checked={formData.completed}
              onChange={(e) =>
                setFormData({ ...formData, completed: e.target.checked })
              }
              disabled={isLoading}
              className="w-4 h-4"
            />
            <Label htmlFor="completed" className="cursor-pointer">
              Mark as completed
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
