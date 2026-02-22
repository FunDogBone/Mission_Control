'use client';

import { useEffect, useState } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  description: string;
  color: string;
  status: 'online' | 'busy' | 'idle' | 'offline';
  currentTask: string | null;
  lastActive: string | null;
  sessionsCount: number;
  tasksCompleted: number;
  tokensUsed: number;
}

interface Activity {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  details: string;
}

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  status: 'in-progress' | 'queued' | 'completed' | 'failed';
}

interface FactoryData {
  timestamp: string;
  factory: {
    name: string;
    status: string;
    onlineAgents: number;
    busyAgents: number;
    totalAgents: number;
  };
  agents: Agent[];
  activities: Activity[];
  metrics: {
    totalSessions: number;
    activeToday: number;
    tasksCompleted: number;
    tokenSavings: number;
    tokenSavingsChange: number;
    throughput: number;
    successRate: number;
    successRateChange: number;
  };
  tasks: Task[];
}

export default function Dashboard() {
  const [data, setData] = useState<FactoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/status', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError('Failed to connect to factory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Connecting to factory...</p>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    tokenSavings: 47.82,
    tokenSavingsChange: 23,
    tasksCompleted: 96,
    throughput: 4.2,
    successRate: 94,
    successRateChange: 2
  };

  const agents = data?.agents || [];
  const activities = data?.activities || [];
  const tasks = data?.tasks || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#22c55e';
      case 'busy': return '#facc15';
      case 'idle': return '#fbbf24';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getTaskStatusBadge = (status: string) => {
    const styles = {
      'in-progress': { bg: '#06b6d4', text: 'in-progress' },
      'queued': { bg: '#eab308', text: 'queued' },
      'completed': { bg: '#22c55e', text: 'completed' },
      'failed': { bg: '#ef4444', text: 'failed' }
    };
    return styles[status as keyof typeof styles] || styles.queued;
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">S</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-white">SpinTheBloc</span>
              <span className="text-pink-500 ml-3">Mission Control</span>
            </h1>
            <p className="text-sm text-gray-500">AI Factory Operations Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-500 text-sm font-medium">LIVE</span>
        </div>
      </header>

      {/* Top Metrics Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-3xl font-bold text-white">
            ${metrics.tokenSavings}
            <span className="text-green-400 text-base ml-2">+{metrics.tokenSavingsChange}%</span>
          </div>
          <div className="text-sm text-gray-400 mt-1">Token Savings (today)</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-3xl font-bold text-white">
            {metrics.tasksCompleted}
            <span className="text-green-400 text-base ml-2">+12%</span>
          </div>
          <div className="text-sm text-gray-400 mt-1">Tasks Completed</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-3xl font-bold text-white">{metrics.throughput}</div>
          <div className="text-sm text-gray-400 mt-1">Throughput (tasks/hr)</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-3xl font-bold text-white">
            {metrics.successRate}%
            <span className="text-green-400 text-base ml-2">+{metrics.successRateChange}%</span>
          </div>
          <div className="text-sm text-gray-400 mt-1">Success Rate</div>
        </div>
      </div>

      {/* Main Grid: 3 Columns */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Agent Roster */}
        <div className="col-span-3">
          <div className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Agent Roster</div>
          <div className="space-y-3">
            {agents.map((agent) => (
              <div 
                key={agent.id}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white">{agent.name}</h3>
                    <p className="text-xs text-gray-400">{agent.role}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">{agent.status}</span>
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(agent.status) }}
                    />
                  </div>
                </div>
                
                <div className="text-xs font-mono text-gray-500 mb-2">{agent.model}</div>
                
                {agent.currentTask && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded px-2 py-1 mb-3">
                    <div className="text-xs text-blue-400 font-medium">Current Task:</div>
                    <div className="text-xs text-gray-300">{agent.currentTask}</div>
                  </div>
                )}
                
                <div className="flex justify-between text-xs mt-3">
                  <div>
                    <span className="text-cyan-400 font-bold">{agent.tasksCompleted || 0}</span>
                    <span className="text-gray-500 ml-1">tasks</span>
                  </div>
                  <div>
                    <span className="text-pink-400 font-bold">{((agent.tokensUsed || 0) / 1000).toFixed(0)}K</span>
                    <span className="text-gray-500 ml-1">tokens</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Task Flow + Active Queue */}
        <div className="col-span-6">
          {/* Task Flow */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-pink-500 rounded-full" />
              <h2 className="text-lg font-bold text-white">Task Flow</h2>
            </div>
            
            <div className="flex items-center justify-center gap-8 mb-6">
              {/* Vincent - Intake */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 border-2 border-cyan-400 flex items-center justify-center mb-2">
                  <span className="text-3xl">📞</span>
                </div>
                <div className="text-sm font-bold text-cyan-400">Vincent</div>
                <div className="text-xs text-gray-500">intake</div>
              </div>
              
              <div className="text-2xl text-cyan-400">→</div>
              
              {/* Vector - Plan */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/30 to-pink-600/30 border-2 border-pink-400 flex items-center justify-center mb-2">
                  <span className="text-3xl">🧠</span>
                </div>
                <div className="text-sm font-bold text-pink-400">Vector</div>
                <div className="text-xs text-gray-500">plan</div>
              </div>
              
              <div className="text-2xl text-pink-400">→</div>
              
              {/* Vivi - Build */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/30 to-green-600/30 border-2 border-green-400 flex items-center justify-center mb-2">
                  <span className="text-3xl">⚙️</span>
                </div>
                <div className="text-sm font-bold text-green-400">Vivi</div>
                <div className="text-xs text-gray-500">build</div>
              </div>
              
              <div className="text-2xl text-green-400">→</div>
              
              {/* Output - Done */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-purple-600/30 border-2 border-purple-400 flex items-center justify-center mb-2">
                  <span className="text-3xl">✅</span>
                </div>
                <div className="text-sm font-bold text-purple-400">Output</div>
                <div className="text-xs text-gray-500">done</div>
              </div>
            </div>
            
            {/* Big Dawg Oversight */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-2xl">🐕</span>
              <span className="font-bold text-yellow-400">Big Dawg</span>
              <span className="text-gray-500">oversight</span>
            </div>
          </div>
          
          {/* Active Queue */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">Active Queue</h2>
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-gray-500 text-sm">No active tasks</p>
              ) : (
                tasks.map((task) => {
                  const badge = getTaskStatusBadge(task.status);
                  return (
                    <div 
                      key={task.id}
                      className="flex items-center justify-between bg-gray-900/40 border border-gray-700/30 rounded-lg p-3"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{task.title}</div>
                        <div className="text-xs text-gray-500 mt-1">→ {task.assignedTo}</div>
                      </div>
                      <div 
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: badge.bg, color: '#fff' }}
                      >
                        {badge.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Activity */}
        <div className="col-span-3">
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-lg p-6 h-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
              <h2 className="text-lg font-bold text-white">Live Activity</h2>
            </div>
            
            <div className="space-y-4 max-h-[calc(100vh-20rem)] overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent activity</p>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="border-l-2 border-purple-500/50 pl-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-cyan-400">{activity.agent}</span>
                      <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                    </div>
                    <div className="text-sm text-gray-300">{activity.action}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}