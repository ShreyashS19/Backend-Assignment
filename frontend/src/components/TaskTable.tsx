import { Task } from '@/services/taskService'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Edit2, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface TaskTableProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  isLoading?: boolean
}

export function TaskTable({
  tasks,
  onEdit,
  onDelete,
  isLoading = false,
}: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tasks yet. Create your first task!</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                {task.description || '—'}
              </TableCell>
              <TableCell>
                <Badge
                  variant={task.completed ? 'default' : 'secondary'}
                  className={
                    task.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {task.completed ? 'Completed' : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {format(new Date(task.createdAt), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(task)}
                    disabled={isLoading}
                    className="hover:bg-blue-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(task)}
                    disabled={isLoading}
                    className="hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
