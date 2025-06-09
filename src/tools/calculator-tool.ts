import { tool } from 'ai';
import { z } from 'zod';

export const calculatorTool = tool({
  description: 'Evaluate a math expression and return the result.',
  parameters: z.object({
    expression: z.string().describe('A mathematical expression to evaluate, e.g. 2+2*3'),
  }),
  execute: async ({ expression }) => {
    try {
      // Only allow numbers and math operators for safety
      if (!/^[0-9+\-*/().\s^%]+$/.test(expression)) {
        throw new Error('Invalid characters in expression');
      }
      // eslint-disable-next-line no-eval
      // You may want to use a library like mathjs for more complex math
      // @ts-ignore
      const result = eval(expression);
      console.log('calculatorTool result', result);
      return { expression, result };
    } catch (e) {
      return { error: 'Invalid expression' };
    }
  },
}); 