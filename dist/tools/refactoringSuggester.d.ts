import { RefactoringResult } from '../types/index.js';
/**
 * 提供代码重构建议
 */
export declare function suggestRefactoring(code: string, language: string, focus?: 'performance' | 'readability' | 'maintainability' | 'all'): Promise<RefactoringResult>;
//# sourceMappingURL=refactoringSuggester.d.ts.map