/**
 * Dynamic Task Generation Service
 * Intelligently generates task details based on user input
 * Auto-determines status, priority, and tags
 */

export interface TaskGenerationInput {
  title: string;
  description: string;
  startDate?: string;
  dueDate: string;
  assignedToId?: number;
  projectId: number;
  projectName?: string;
  assignedUserName?: string;
}

export interface GeneratedTask {
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate?: string;
  dueDate: string;
  assignedToId?: number;
  projectId: number;
  projectName?: string;
  assignedUserName?: string;
  tags: string[];
  estimatedHours?: number;
  metadata: {
    daysUntilDue: number;
    isOverdue: boolean;
    isActive: boolean;
    urgencyScore: number;
    generatedAt: string;
  };
}

class TaskGenerationService {
  /**
   * Generate task status based on dates
   */
  private generateStatus(
    startDate: string | undefined,
    dueDate: string,
    currentDate: Date = new Date()
  ): 'TODO' | 'IN_PROGRESS' | 'OVERDUE' {
    const start = startDate ? new Date(startDate) : null;
    const due = new Date(dueDate);
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    // Check if overdue
    if (due < today) {
      return 'OVERDUE';
    }

    // Check if in progress (started but not due)
    if (start && start <= today && due >= today) {
      return 'IN_PROGRESS';
    }

    // Default to TODO
    return 'TODO';
  }

  /**
   * Calculate urgency score (0-100)
   */
  private calculateUrgencyScore(
    dueDate: string,
    priority: string,
    currentDate: Date = new Date()
  ): number {
    const due = new Date(dueDate);
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Base score from priority
    const priorityScores: Record<string, number> = {
      'LOW': 20,
      'MEDIUM': 50,
      'HIGH': 75,
      'URGENT': 95
    };

    let score = priorityScores[priority] || 50;

    // Adjust based on days until due
    if (daysUntilDue <= 0) {
      score = Math.min(100, score + 30); // Overdue
    } else if (daysUntilDue <= 1) {
      score = Math.min(100, score + 25); // Due tomorrow
    } else if (daysUntilDue <= 3) {
      score = Math.min(100, score + 15); // Due within 3 days
    } else if (daysUntilDue <= 7) {
      score = Math.min(100, score + 5); // Due within a week
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Generate priority based on description keywords and urgency
   */
  private generatePriority(
    description: string,
    dueDate: string,
    currentDate: Date = new Date()
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
    const desc = description.toLowerCase();
    const due = new Date(dueDate);
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Urgent keywords
    const urgentKeywords = ['urgent', 'critical', 'asap', 'immediately', 'emergency', 'blocker', 'critical bug', 'production issue'];
    if (urgentKeywords.some(kw => desc.includes(kw))) {
      return 'URGENT';
    }

    // High priority keywords
    const highKeywords = ['important', 'high priority', 'deadline', 'release', 'launch', 'security', 'bug fix', 'hotfix'];
    if (highKeywords.some(kw => desc.includes(kw))) {
      return 'HIGH';
    }

    // Check due date urgency
    if (daysUntilDue <= 1) {
      return 'HIGH';
    } else if (daysUntilDue <= 3) {
      return 'MEDIUM';
    }

    // Low priority keywords
    const lowKeywords = ['nice to have', 'optional', 'enhancement', 'improvement', 'refactor', 'cleanup', 'documentation'];
    if (lowKeywords.some(kw => desc.includes(kw))) {
      return 'LOW';
    }

    // Default based on timeline
    if (daysUntilDue > 14) {
      return 'LOW';
    } else if (daysUntilDue > 7) {
      return 'MEDIUM';
    } else {
      return 'HIGH';
    }
  }

  /**
   * Auto-generate tags based on description keywords
   */
  private generateTags(description: string, title: string): string[] {
    const text = (description + ' ' + title).toLowerCase();
    const tags: string[] = [];

    // Tag mappings
    const tagKeywords: Record<string, string[]> = {
      'UI/UX': ['ui', 'ux', 'design', 'interface', 'layout', 'styling', 'css', 'component', 'button', 'form', 'modal', 'dialog', 'page', 'screen', 'visual'],
      'Backend': ['backend', 'server', 'api', 'endpoint', 'route', 'controller', 'service', 'logic', 'algorithm', 'calculation', 'processing'],
      'API': ['api', 'endpoint', 'rest', 'graphql', 'webhook', 'integration', 'external', 'third-party', 'request', 'response'],
      'Database': ['database', 'db', 'sql', 'query', 'migration', 'schema', 'table', 'model', 'data', 'storage', 'cache', 'redis', 'mongodb', 'postgres'],
      'Authentication': ['auth', 'login', 'logout', 'password', 'token', 'jwt', 'oauth', 'session', 'permission', 'role', 'access', 'security'],
      'Performance': ['performance', 'optimization', 'speed', 'fast', 'slow', 'lag', 'latency', 'caching', 'memory', 'cpu', 'load', 'scalability'],
      'Testing': ['test', 'unit test', 'integration test', 'e2e', 'qa', 'quality', 'bug', 'fix', 'debug', 'error', 'issue'],
      'Documentation': ['documentation', 'doc', 'readme', 'guide', 'tutorial', 'comment', 'javadoc', 'jsdoc', 'wiki'],
      'DevOps': ['devops', 'deployment', 'docker', 'kubernetes', 'ci/cd', 'pipeline', 'build', 'release', 'infrastructure', 'cloud'],
      'Mobile': ['mobile', 'ios', 'android', 'react native', 'flutter', 'app', 'responsive'],
      'Security': ['security', 'vulnerability', 'exploit', 'xss', 'sql injection', 'csrf', 'encryption', 'ssl', 'https', 'firewall'],
      'Analytics': ['analytics', 'tracking', 'metrics', 'monitoring', 'logging', 'telemetry', 'dashboard', 'report'],
    };

    // Check each tag category
    for (const [tag, keywords] of Object.entries(tagKeywords)) {
      if (keywords.some(kw => text.includes(kw))) {
        tags.push(tag);
      }
    }

    // Remove duplicates and limit to 5 tags
    return [...new Set(tags)].slice(0, 5);
  }

  /**
   * Estimate hours based on description complexity
   */
  private estimateHours(description: string, priority: string): number {
    const desc = description.toLowerCase();
    let baseHours = 4; // Default

    // Complexity indicators
    const complexKeywords = ['complex', 'complicated', 'difficult', 'refactor', 'rewrite', 'redesign', 'migration'];
    const simpleKeywords = ['simple', 'easy', 'quick', 'minor', 'small', 'typo', 'fix'];

    if (complexKeywords.some(kw => desc.includes(kw))) {
      baseHours = 16;
    } else if (simpleKeywords.some(kw => desc.includes(kw))) {
      baseHours = 2;
    }

    // Adjust based on priority
    const priorityMultipliers: Record<string, number> = {
      'LOW': 0.8,
      'MEDIUM': 1,
      'HIGH': 1.2,
      'URGENT': 1.5
    };

    return Math.round(baseHours * (priorityMultipliers[priority] || 1));
  }

  /**
   * Validate dates
   */
  private validateDates(startDate: string | undefined, dueDate: string): { valid: boolean; error?: string } {
    try {
      const due = new Date(dueDate);
      if (isNaN(due.getTime())) {
        return { valid: false, error: 'Invalid due date format' };
      }

      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          return { valid: false, error: 'Invalid start date format' };
        }

        if (start > due) {
          return { valid: false, error: 'Start date cannot be after due date' };
        }
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Date validation error' };
    }
  }

  /**
   * Calculate days until due
   */
  private calculateDaysUntilDue(dueDate: string, currentDate: Date = new Date()): number {
    const due = new Date(dueDate);
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Generate enhanced task title
   */
  private generateTitle(input: string): string {
    // Capitalize first letter and ensure it's descriptive
    let title = input.trim();
    if (title.length === 0) {
      return 'Untitled Task';
    }

    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);

    // Ensure it ends with proper punctuation or action verb
    if (!title.match(/[.!?:]$/)) {
      // Check if it starts with action verb
      const actionVerbs = ['implement', 'fix', 'update', 'create', 'design', 'review', 'test', 'deploy', 'refactor', 'optimize', 'document', 'investigate'];
      const startsWithVerb = actionVerbs.some(verb => title.toLowerCase().startsWith(verb));

      if (!startsWithVerb && !title.includes(' ')) {
        // Add action verb if it's just a noun
        title = `Implement ${title}`;
      }
    }

    return title;
  }

  /**
   * Main method: Generate complete task from input
   */
  public generateTask(input: TaskGenerationInput, currentDate: Date = new Date()): GeneratedTask {
    // Validate dates
    const dateValidation = this.validateDates(input.startDate, input.dueDate);
    if (!dateValidation.valid) {
      throw new Error(dateValidation.error || 'Invalid dates');
    }

    // Generate priority
    const priority = this.generatePriority(input.description, input.dueDate, currentDate);

    // Generate status
    const status = this.generateStatus(input.startDate, input.dueDate, currentDate);

    // Generate tags
    const tags = this.generateTags(input.description, input.title);

    // Calculate metadata
    const daysUntilDue = this.calculateDaysUntilDue(input.dueDate, currentDate);
    const urgencyScore = this.calculateUrgencyScore(input.dueDate, priority, currentDate);
    const estimatedHours = this.estimateHours(input.description, priority);

    // Generate enhanced title
    const enhancedTitle = this.generateTitle(input.title);

    return {
      title: enhancedTitle,
      description: input.description.trim(),
      status: status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED',
      priority,
      startDate: input.startDate,
      dueDate: input.dueDate,
      assignedToId: input.assignedToId,
      projectId: input.projectId,
      projectName: input.projectName,
      assignedUserName: input.assignedUserName,
      tags,
      estimatedHours,
      metadata: {
        daysUntilDue,
        isOverdue: daysUntilDue < 0,
        isActive: status === 'IN_PROGRESS',
        urgencyScore,
        generatedAt: new Date(currentDate).toISOString()
      }
    };
  }

  /**
   * Batch generate tasks
   */
  public generateTasks(inputs: TaskGenerationInput[], currentDate: Date = new Date()): GeneratedTask[] {
    return inputs.map(input => this.generateTask(input, currentDate));
  }

  /**
   * Get task summary for display
   */
  public getTaskSummary(task: GeneratedTask): string {
    const lines = [
      `📋 ${task.title}`,
      `📝 ${task.description.substring(0, 100)}${task.description.length > 100 ? '...' : ''}`,
      `🎯 Priority: ${task.priority} | Status: ${task.status}`,
      `📅 Due: ${task.dueDate} (${task.metadata.daysUntilDue} days)`,
      `⏱️ Estimated: ${task.estimatedHours}h`,
      `🏷️ Tags: ${task.tags.join(', ') || 'None'}`,
      `⚡ Urgency: ${task.metadata.urgencyScore}/100`
    ];

    if (task.assignedUserName) {
      lines.push(`👤 Assigned to: ${task.assignedUserName}`);
    }

    return lines.join('\n');
  }
}

export const taskGenerationService = new TaskGenerationService();
