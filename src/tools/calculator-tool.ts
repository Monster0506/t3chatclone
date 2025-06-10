import { tool } from 'ai';
import { z } from 'zod';
import * as math from 'mathjs';

function analyzeValueType(value: any) {
  return {
    isComplex: math.isComplex(value),
    isMatrix: math.isMatrix(value),
    isUnit: math.isUnit(value),
    type: typeof value === 'object' && value !== null && value.constructor ? value.constructor.name : typeof value,
  };
}

export const calculatorTool = tool({
  description: 'Evaluate a math expression and return the result. Supports basic arithmetic, trigonometric functions, logarithms, matricies, and more.',
  parameters: z.object({
    expression: z.string().describe('A mathematical expression to evaluate. Examples: 2+2*3, sin(45), log(100), sqrt(16), pi*2'),
  }),
  execute: async ({ expression }) => {
    try {
      // Create a scope with common mathematical constants
      const scope = {
        pi: math.pi,
        e: math.e,
        i: math.i,
        inf: Infinity,
        NaN: NaN
      };

      // Try to parse the input to analyze its type
      let inputValue;
      try {
        inputValue = math.evaluate(expression, scope);
      } catch {
        inputValue = null;
      }
      const inputDetails = analyzeValueType(inputValue);

      // Evaluate the expression using math.js
      const result = math.evaluate(expression, scope);
      const resultDetails = analyzeValueType(result);

      // Format the result to be more readable
      let formattedResult;
      if (typeof result === 'number') {
        formattedResult = Number(result.toFixed(10));
      } else if (result.toString) {
        formattedResult = result.toString();
      } else {
        formattedResult = result;
      }

      return {
        expression,
        result: formattedResult,
        details: resultDetails,
        inputDetails,
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : 'Invalid expression',
        details: 'The expression could not be evaluated. Please check the syntax and try again.'
      };
    }
  },
}); 