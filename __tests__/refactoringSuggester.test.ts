import { suggestRefactoring } from '../src/tools/refactoringSuggester';

describe('suggestRefactoring', () => {
  it('should suggest refactorings for JavaScript code', async () => {
    const code = `
function example() {
  var x = 1 + 2;
  return x;
}
`;
    const result = await suggestRefactoring(code, 'javascript', 'all');
    expect(result.totalSuggestions).toBeGreaterThan(0);
    expect(result.suggestions.some(s => s.title === '使用现代变量声明')).toBe(true);
  });

  it('should handle Python code', async () => {
    const code = `def example():
    x = 1 + 2
    return x`;
    const result = await suggestRefactoring(code, 'python');
    expect(result.totalSuggestions).toBe(2);
  });
});