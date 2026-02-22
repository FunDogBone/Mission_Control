import { NextResponse } from 'next/server';
import { getRedisClient, FACTORY_STATUS_KEY } from '@/lib/redis';

// Agent definitions for fallback display
const AGENTS = [
  {
    id: 'vincent',
    name: 'Vincent',
    role: 'Front Desk',
    model: 'llama3.1',
    description: 'Greetings, simple queries, triage',
    color: '#22c55e',
  },
  {
    id: 'vector',
    name: 'Vector',
    role: 'Factory Manager',
    model: 'qwen2.5:32b',
    description: 'Planning, architecture, review',
    color: '#00d4ff',
  },
  {
    id: 'vivi',
    name: 'Vivi',
    role: 'Builder',
    model: 'qwen2.5-coder:32b',
    description: 'Code generation from specs',
    color: '#ff00aa',
  },
  {
    id: 'bigdawg',
    name: 'Big Dawg',
    role: 'Regional Manager',
    model: 'claude-sonnet-4-5',
    description: 'Strategy, crisis, brand',
    color: '#8b5cf6',
  },
];

interface FactoryStatus {
  timestamp: string;
  factory: {
    name: string;
    status: string;
    onlineAgents: number;
    busyAgents: number;
    totalAgents: number;
  };
  agents: Array<{
    id: string;
    name: string;
    role: string;
    model: string;
    description: string;
    color: string;
    status: 'online' | 'busy' | 'offline';
    currentTask: string | null;
    lastActive: string | null;
    sessionsCount: number;
  }>;
  activities: Array<{
    id: string;
    timestamp: string;
    agent: string;
    action: string;
    details: string;
  }>;
  metrics: {
    totalSessions: number;
    activeToday: number;
    tasksCompleted: number;
  };
}

export async function GET() {
  try {
    // Read status from Redis (pushed by local OpenClaw cron)
    const redis = getRedisClient();
    const status = await redis.get<FactoryStatus>(FACTORY_STATUS_KEY);

    if (status) {
      // Check if data is stale (>10 minutes old)
      const statusTime = new Date(status.timestamp).getTime();
      const now = Date.now();
      const staleThreshold = 10 * 60 * 1000; // 10 minutes

      if (now - statusTime > staleThreshold) {
        // Data is stale - mark all agents as offline
        return NextResponse.json({
          ...status,
          factory: {
            ...status.factory,
            status: 'stale',
            onlineAgents: 0,
          },
          agents: status.agents.map(a => ({ ...a, status: 'offline' as const })),
          staleWarning: `Last update: ${status.timestamp}`,
        });
      }

      return NextResponse.json(status);
    }

    // No data in Redis yet - return offline state
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      factory: {
        name: 'SpinTheBloc Factory',
        status: 'awaiting-connection',
        onlineAgents: 0,
        busyAgents: 0,
        totalAgents: AGENTS.length,
      },
      agents: AGENTS.map(a => ({
        ...a,
        status: 'offline' as const,
        currentTask: null,
        lastActive: null,
        sessionsCount: 0,
      })),
      activities: [],
      metrics: {
        totalSessions: 0,
        activeToday: 0,
        tasksCompleted: 0,
      },
      message: 'Waiting for factory to connect...',
    });

  } catch (error) {
    console.error('Redis error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch factory status' },
      { status: 500 }
    );
  }
}
