'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  Filter,
  Calendar,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { TaskStatus, TaskPriority } from '@nexaflow/shared-types';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      const [tsks, team] = await Promise.all([
        apiRequest<any[]>('/tasks'),
        apiRequest<any[]>('/users/team'),
      ]);
      setTasks(tsks);
      setTeamMembers(team);
      if (team.length > 0) setAssignedUserId(team[0].userId);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsSubmitting(true);
    try {
      await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          assignedUserId,
          priority,
          dueDate,
        }),
      });

      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err: any) {
      alert(`Error creating task: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: TaskStatus) => {
    try {
      await apiRequest(`/tasks/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'PENDING') return t.status === TaskStatus.PENDING;
    if (filterStatus === 'COMPLETED') return t.status === TaskStatus.COMPLETED;
    if (filterStatus === 'HIGH') return t.priority === 'HIGH' || t.priority === 'URGENT';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#356AE6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#202938] tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#356AE6]" />
            Task Management & Follow-ups
          </h1>
          <p className="text-xs text-[#707B8B]">
            Automated WhatsApp lead follow-ups, consultation reminders, and team action items.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#243B5A] hover:bg-[#1a2d45] text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4 text-white" />
          Create Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-[#E6EAF0] shadow-xs text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#707B8B] font-medium flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-[#98A2B3]" /> Filter:
          </span>
          {[
            { id: 'ALL', label: `All (${tasks.length})` },
            { id: 'PENDING', label: `Pending (${tasks.filter((t) => t.status !== TaskStatus.COMPLETED).length})` },
            { id: 'HIGH', label: `High Priority (${tasks.filter((t) => t.priority === 'HIGH' || t.priority === 'URGENT').length})` },
            { id: 'COMPLETED', label: `Completed (${tasks.filter((t) => t.status === TaskStatus.COMPLETED).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === tab.id
                  ? 'bg-[#243B5A] text-white shadow-xs'
                  : 'text-[#707B8B] hover:text-[#202938] hover:bg-[#F2F4F7]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-white rounded-xl border border-[#E6EAF0] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E6EAF0] flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider">
            Follow-up Queue
          </h3>
          <span className="text-xs bg-[#F2F4F7] px-2.5 py-0.5 rounded-md font-semibold text-[#202938]">
            {filteredTasks.length} Showing
          </span>
        </div>

        <div className="divide-y divide-[#E6EAF0]">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 text-xs text-[#98A2B3]">
              No tasks matching this filter.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isCompleted = task.status === TaskStatus.COMPLETED;
              return (
                <div
                  key={task.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#F7F8FA] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          task.id,
                          isCompleted ? TaskStatus.PENDING : TaskStatus.COMPLETED,
                        )
                      }
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all mt-0.5 ${
                        isCompleted
                          ? 'bg-[#23865B] border-[#23865B] text-white'
                          : 'border-[#E6EAF0] hover:border-[#23865B] bg-white'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div>
                      <h4
                        className={`text-xs font-semibold ${
                          isCompleted ? 'line-through text-[#98A2B3]' : 'text-[#202938]'
                        }`}
                      >
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-[11px] text-[#707B8B] mt-0.5">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#707B8B]">
                        {task.dueDate && (
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-[#98A2B3]" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <span>•</span>
                        <span>Assignee: <strong className="text-[#202938]">{task.assignedUser?.fullName || 'Front Desk'}</strong></span>
                        {task.customer && (
                          <>
                            <span>•</span>
                            <span className="font-medium text-[#356AE6]">
                              Contact: {task.customer.name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                        task.priority === 'HIGH' || task.priority === 'URGENT'
                          ? 'bg-[#D64B50]/10 text-[#D64B50] border-[#D64B50]/20'
                          : 'bg-[#F2F4F7] text-[#707B8B] border-[#E6EAF0]'
                      }`}
                    >
                      {task.priority}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                        isCompleted
                          ? 'bg-[#23865B]/10 text-[#23865B] border-[#23865B]/20'
                          : 'bg-[#B98535]/10 text-[#B98535] border-[#B98535]/20'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal: Create Task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#202938]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-5 max-w-md w-full shadow-lg border border-[#E6EAF0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF0]">
              <h3 className="text-sm font-bold text-[#202938]">Create Follow-up Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#98A2B3] hover:text-[#202938]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#202938]">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call patient to confirm lab prescription..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:border-[#356AE6] outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938]">Assign To Employee</label>
                <select
                  value={assignedUserId}
                  onChange={(e) => setAssignedUserId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] bg-white focus:border-[#356AE6] outline-none"
                >
                  {teamMembers.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.user?.fullName} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#202938]">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:border-[#356AE6] outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#202938]">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] bg-white focus:border-[#356AE6] outline-none"
                  >
                    <option value={TaskPriority.LOW}>Low</option>
                    <option value={TaskPriority.MEDIUM}>Medium</option>
                    <option value={TaskPriority.HIGH}>High</option>
                    <option value={TaskPriority.URGENT}>Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#202938]">Task Details</label>
                <textarea
                  rows={2}
                  placeholder="Additional context or medical instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:border-[#356AE6] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E6EAF0] text-xs font-semibold text-[#707B8B] hover:bg-[#F2F4F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#243B5A] text-white font-semibold text-xs hover:bg-[#1a2d45] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
