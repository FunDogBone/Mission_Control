'use client';

import { useEffect, useState } from 'react';
import { PipelinePanel } from '@/components/pipeline';

interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  status: 'online' | 'busy' | 'idle' | 'offline';
  currentTask: string | null;
  tasksCompleted?: number;
  tokensUsed?: number;
}

interface Activity {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  type?: 'success' | 'error' | 'warning';
}

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  status: 'in-progress' | 'queued' | 'completed' | 'failed';
}

interface Document {
  id: string;
  title: string;
  type: 'spec' | 'sop' | 'playbook' | 'research';
  updatedAt: string;
  path: string;
}

interface FactoryData {
  timestamp: string;
  factory: {
    status: string;
    onlineAgents: number;
    totalAgents: number;
  };
  agents: Agent[];
  activities: Activity[];
  metrics: {
    tokenSavings?: number;
    tokenSavingsChange?: number;
    tasksCompleted?: number;
    throughput?: number;
    successRate?: number;
    successRateChange?: number;
  };
  tasks: Task[];
}

type TabType = 'dashboard' | 'pipeline' | 'documents' | 'settings';

const AGENT_EMOJIS: Record<string, string> = {
  vincent: '📞',
  vector: '🧠',
  vivi: '⚙️',
  bigdawg: '🐕',
};

const TABS: { id: TabType; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'pipeline', label: 'Pipeline', icon: '🎯' },
  { id: 'documents', label: 'Documents', icon: '📁' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

// Mock documents for now - will be dynamic later
const MOCK_DOCUMENTS: Document[] = [
  { id: '1', title: 'Marketing Playbook', type: 'playbook', updatedAt: '2026-02-28', path: '/docs/marketing-playbook' },
  { id: '2', title: 'Pipeline Component Spec', type: 'spec', updatedAt: '2026-02-28', path: '/docs/pipeline-spec' },
  { id: '3', title: 'N8N Workflow Setup', type: 'sop', updatedAt: '2026-03-01', path: '/docs/n8n-setup' },
  { id: '4', title: 'Competitor Research', type: 'research', updatedAt: '2026-02-28', path: '/docs/competitor-research' },
  { id: '5', title: 'Client Onboarding Checklist', type: 'sop', updatedAt: '2026-03-01', path: '/docs/onboarding' },
];

export default function Dashboard() {
  const [data, setData] = useState<FactoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error('Failed to fetch:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const dataInterval = setInterval(fetchData, 10000);

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit', second: '2-digit'
      }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(timeInterval);
    };
  }, []);

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

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <div className="loading-text">Connecting to The Bloc...</div>
      </div>
    );
  }

  const agents = data?.agents || [];
  const activities = data?.activities || [];
  const tasks = data?.tasks || [];
  const metrics = data?.metrics || {};
  const factoryStatus = data?.factory?.status || 'offline';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pipeline':
        return (
          <div className="tab-content">
            <PipelinePanel initialExpanded={true} />
          </div>
        );
      
      case 'documents':
        return (
          <div className="tab-content">
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">📁 Documents & Resources</div>
              </div>
              <div className="documents-grid">
                {MOCK_DOCUMENTS.map((doc) => (
                  <div key={doc.id} className="document-card">
                    <div className="document-icon">
                      {doc.type === 'spec' && '📋'}
                      {doc.type === 'sop' && '📝'}
                      {doc.type === 'playbook' && '📖'}
                      {doc.type === 'research' && '🔬'}
                    </div>
                    <div className="document-info">
                      <div className="document-title">{doc.title}</div>
                      <div className="document-meta">
                        <span className="document-type">{doc.type.toUpperCase()}</span>
                        <span className="document-date">{doc.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="tab-content">
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">⚙️ Settings</div>
              </div>
              <div className="settings-section">
                <h3>Integrations</h3>
                <div className="setting-row">
                  <span className="setting-label">Supabase</span>
                  <span className="setting-status connected">Connected</span>
                </div>
                <div className="setting-row">
                  <span className="setting-label">Twilio</span>
                  <span className="setting-status pending">A2P Pending</span>
                </div>
                <div className="setting-row">
                  <span className="setting-label">N8N</span>
                  <span className="setting-status connected">Connected</span>
                </div>
              </div>
              <div className="settings-section">
                <h3>Factory</h3>
                <div className="setting-row">
                  <span className="setting-label">Auto-delegation</span>
                  <span className="setting-value">Enabled</span>
                </div>
                <div className="setting-row">
                  <span className="setting-label">Local Model Priority</span>
                  <span className="setting-value">High</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      default: // dashboard
        return (
          <>
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-value">
                  ${metrics.tokenSavings?.toFixed(2) || '0.00'}
                  {metrics.tokenSavingsChange && (
                    <span className={`stat-change ${metrics.tokenSavingsChange > 0 ? 'positive' : 'negative'}`}>
                      {metrics.tokenSavingsChange > 0 ? '+' : ''}{metrics.tokenSavingsChange}%
                    </span>
                  )}
                </div>
                <div className="stat-label">Token Savings</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{metrics.tasksCompleted || 0}</div>
                <div className="stat-label">Tasks Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{metrics.throughput?.toFixed(1) || '0.0'}</div>
                <div className="stat-label">Throughput (tasks/hr)</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {metrics.successRate || 0}%
                  {metrics.successRateChange && (
                    <span className={`stat-change ${metrics.successRateChange > 0 ? 'positive' : 'negative'}`}>
                      {metrics.successRateChange > 0 ? '+' : ''}{metrics.successRateChange}%
                    </span>
                  )}
                </div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">🔄 Task Flow</div>
              </div>
              <div className="task-flow">
                <div className="flow-node">
                  <div className="flow-avatar cyan">📞</div>
                  <div className="flow-name cyan">Vincent</div>
                  <div className="flow-role">intake</div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-node">
                  <div className="flow-avatar pink">🧠</div>
                  <div className="flow-name pink">Vector</div>
                  <div className="flow-role">plan</div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-node">
                  <div className="flow-avatar green">⚙️</div>
                  <div className="flow-name green">Vivi</div>
                  <div className="flow-role">build</div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-node">
                  <div className="flow-avatar purple">✅</div>
                  <div className="flow-name purple">Output</div>
                  <div className="flow-role">done</div>
                </div>
              </div>
              <div className="flow-oversight">
                <span>🐕</span>
                <span className="name">Big Dawg</span>
                <span>oversight</span>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">📋 Active Queue</div>
              </div>
              <div className="queue-list">
                {tasks.length === 0 ? (
                  <div className="empty-state">No active tasks</div>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="queue-item">
                      <div className="queue-info">
                        <h4>{task.title}</h4>
                        <p>→ {task.assignedTo}</p>
                      </div>
                      <div className={`queue-status ${task.status}`}>{task.status}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pipeline Preview on Dashboard */}
            <PipelinePanel initialExpanded={false} />
          </>
        );
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="logo">
          <div className="logo-icon">⚡</div>
          <div className="logo-text">SpinTheBloc<span>The Bloc</span></div>
        </div>
        
        {/* Tab Navigation */}
        <nav className="tab-nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="header-right">
          <div className="status-live">
            {factoryStatus === 'operational' ? 'OPERATIONAL' : factoryStatus.toUpperCase()}
          </div>
          <div className="current-time">{currentTime}</div>
        </div>
      </header>

      <aside className="sidebar">
        <div className="section-title">Agent Roster</div>
        <div className="agent-list">
          {agents.map((agent) => (
            <div key={agent.id} className="agent-card">
              <div className="agent-header">
                <div className={`agent-avatar ${agent.status}`}>
                  {AGENT_EMOJIS[agent.id] || '🤖'}
                  <div className={`status-ring ${agent.status}`} />
                </div>
                <div>
                  <div className="agent-role">{agent.role}</div>
                  <div className="agent-name">{agent.name}</div>
                  <div className="agent-model">{agent.model}</div>
                </div>
              </div>
              {agent.currentTask && (
                <div className="agent-task-preview">{agent.currentTask}</div>
              )}
              <div className="agent-stats">
                <span><span className="value">{agent.tasksCompleted || 0}</span> tasks</span>
                <span><span className="value">{((agent.tokensUsed || 0) / 1000).toFixed(0)}K</span> tokens</span>
              </div>
            </div>
          ))}
        </div>

        <div className="system-info">
          <div className="section-title">System</div>
          <div className="system-row">
            <span className="system-label">Status</span>
            <span className="system-value">{factoryStatus}</span>
          </div>
          <div className="system-row">
            <span className="system-label">Agents</span>
            <span className="system-value">{data?.factory?.onlineAgents || 0}/{data?.factory?.totalAgents || 0}</span>
          </div>
          <div className="system-row">
            <span className="system-label">Updated</span>
            <span className="system-value">{data?.timestamp ? formatTime(data.timestamp) : 'N/A'}</span>
          </div>
        </div>
      </aside>

      <main className="main">
        {renderTabContent()}
      </main>

      <aside className="activity-panel">
        <div className="section-title">Live Activity</div>
        <div className="activity-list">
          {activities.length === 0 ? (
            <div className="empty-state">No recent activity</div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className={`activity-item ${activity.type || ''}`}>
                <div className="activity-header">
                  <div className="activity-source">{activity.agent}</div>
                  <div className="activity-time">{formatTime(activity.timestamp)}</div>
                </div>
                <div className="activity-message">{activity.action}</div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
