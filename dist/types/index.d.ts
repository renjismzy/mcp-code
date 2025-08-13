/**
 * 代码分析结果类型定义
 */
export interface CodeAnalysisResult {
    filename: string;
    language: string;
    metrics: QualityMetrics;
    issues: CodeIssue[];
    overallScore: number;
    recommendations: string[];
}
export interface QualityMetrics {
    linesOfCode: number;
    complexity: number;
    maintainabilityIndex: number;
    duplicateLines: number;
    testCoverage: number;
}
export interface CodeIssue {
    type: 'style' | 'maintainability' | 'performance' | 'error-handling' | 'security';
    severity: 'error' | 'warning' | 'info';
    message: string;
    line: number;
    column: number;
    rule: string;
    suggestion?: string;
}
export interface SecurityScanResult {
    language: string;
    totalIssues: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
    issues: SecurityIssue[];
    recommendations: string[];
    riskScore: number;
}
export interface SecurityIssue {
    type: 'hardcoded-credentials' | 'code-injection' | 'sql-injection' | 'xss' | 'unsafe-deserialization' | 'weak-randomness' | 'information-disclosure' | 'regex-dos' | 'prototype-pollution' | 'xxe' | 'insecure-temp-file' | 'dangerous-operation';
    severity: 'critical' | 'high' | 'medium' | 'low';
    message: string;
    description: string;
    line: number;
    column: number;
    cwe: string;
    recommendation: string;
}
export interface RefactoringResult {
    language: string;
    focus: 'performance' | 'readability' | 'maintainability' | 'all';
    totalSuggestions: number;
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
    suggestions: RefactoringSuggestion[];
    summary: string;
}
export interface RefactoringSuggestion {
    type: 'performance' | 'readability' | 'maintainability' | 'modernization' | 'pythonic';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    line: number;
    originalCode: string;
    suggestedCode: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
}
export interface ComplexityResult {
    language: string;
    metrics: ComplexityMetrics;
    analysis: string;
    recommendations: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
export interface ComplexityMetrics {
    cyclomaticComplexity: number;
    cognitiveComplexity: number;
    halsteadComplexity: HalsteadMetrics;
    maintainabilityIndex: number;
    linesOfCode: number;
    logicalLinesOfCode: number;
    commentLines: number;
    blankLines: number;
}
export interface HalsteadMetrics {
    vocabulary: number;
    length: number;
    difficulty: number;
    volume: number;
    effort: number;
    bugs: number;
    time: number;
}
export interface DocumentationOptions {
    includePrivate?: boolean;
    includeInherited?: boolean;
    format?: 'markdown' | 'html' | 'json';
    template?: string;
}
export interface FunctionInfo {
    name: string;
    parameters: ParameterInfo[];
    returnType?: string;
    description?: string;
    complexity: number;
    startLine: number;
    endLine: number;
    code: string;
    signature: string;
    lineCount: number;
    parameterCount: number;
    hasComments: boolean;
}
export interface ParameterInfo {
    name: string;
    type?: string;
    description?: string;
    optional?: boolean;
    defaultValue?: string;
}
export interface ClassInfo {
    name: string;
    description?: string;
    properties: PropertyInfo[];
    methods: MethodInfo[];
    inheritance?: string[];
    interfaces?: string[];
}
export interface PropertyInfo {
    name: string;
    type?: string;
    description?: string;
    visibility?: 'public' | 'private' | 'protected';
    static?: boolean;
    readonly?: boolean;
}
export interface MethodInfo {
    name: string;
    parameters: ParameterInfo[];
    returnType?: string;
    description?: string;
    visibility?: 'public' | 'private' | 'protected';
    static?: boolean;
    abstract?: boolean;
    override?: boolean;
}
export interface AnalysisOptions {
    includeTests?: boolean;
    excludePatterns?: string[];
    maxFileSize?: number;
    timeout?: number;
}
export interface FileAnalysis {
    path: string;
    language: string;
    size: number;
    encoding: string;
    lastModified: Date;
}
export interface ProjectAnalysis {
    name: string;
    version?: string;
    description?: string;
    languages: string[];
    totalFiles: number;
    totalLines: number;
    files: FileAnalysis[];
}
export interface AnalysisError {
    code: string;
    message: string;
    file?: string;
    line?: number;
    column?: number;
    stack?: string;
}
export interface AnalysisWarning {
    code: string;
    message: string;
    file?: string;
    line?: number;
    column?: number;
}
export interface AnalysisConfig {
    rules?: Record<string, any>;
    plugins?: string[];
    extends?: string[];
    env?: Record<string, boolean>;
    globals?: Record<string, boolean>;
    parserOptions?: Record<string, any>;
}
export interface AnalysisReport {
    timestamp: Date;
    version: string;
    project: ProjectAnalysis;
    summary: ReportSummary;
    details: ReportDetails;
    recommendations: string[];
}
export interface ReportSummary {
    overallScore: number;
    totalIssues: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
    averageComplexity: number;
    maintainabilityIndex: number;
    testCoverage?: number;
}
export interface ReportDetails {
    codeQuality: CodeAnalysisResult[];
    security: SecurityScanResult[];
    complexity: ComplexityResult[];
    refactoring: RefactoringResult[];
}
export interface AnalysisPlugin {
    name: string;
    version: string;
    description: string;
    author: string;
    languages: string[];
    analyze: (code: string, language: string, options?: any) => Promise<any>;
}
export interface PluginRegistry {
    plugins: Map<string, AnalysisPlugin>;
    register: (plugin: AnalysisPlugin) => void;
    unregister: (name: string) => void;
    get: (name: string) => AnalysisPlugin | undefined;
    list: () => AnalysisPlugin[];
}
export interface CacheEntry<T> {
    key: string;
    value: T;
    timestamp: Date;
    ttl: number;
}
export interface AnalysisCache {
    get<T>(key: string): CacheEntry<T> | undefined;
    set<T>(key: string, value: T, ttl?: number): void;
    delete(key: string): boolean;
    clear(): void;
    size(): number;
}
export interface AnalysisEvent {
    type: 'start' | 'progress' | 'complete' | 'error' | 'warning';
    timestamp: Date;
    data?: any;
    error?: AnalysisError;
    warning?: AnalysisWarning;
}
export interface EventEmitter {
    on(event: string, listener: (event: AnalysisEvent) => void): void;
    off(event: string, listener: (event: AnalysisEvent) => void): void;
    emit(event: string, data: AnalysisEvent): void;
}
export interface StreamProcessor {
    process(chunk: string): Promise<void>;
    flush(): Promise<any>;
    reset(): void;
}
export interface AnalysisStream {
    write(data: string): boolean;
    end(): void;
    on(event: 'data' | 'end' | 'error', callback: Function): void;
}
export interface WorkerTask {
    id: string;
    type: string;
    data: any;
    priority: number;
    timeout?: number;
}
export interface WorkerResult {
    taskId: string;
    success: boolean;
    result?: any;
    error?: AnalysisError;
    duration: number;
}
export interface WorkerPool {
    submit(task: WorkerTask): Promise<WorkerResult>;
    shutdown(): Promise<void>;
    getStats(): {
        active: number;
        pending: number;
        completed: number;
        failed: number;
    };
}
//# sourceMappingURL=index.d.ts.map