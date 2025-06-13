import { tool } from 'ai';
import { z } from 'zod';
import * as math from 'mathjs';

function analyzeValueType(value: number | string | boolean | object | null | undefined) {
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
      const scope = {
        pi: math.pi,
        e: math.e,
        i: math.i,
        inf: Infinity,
        NaN: NaN
      };

      let inputValue;
      try {
        inputValue = math.evaluate(expression, scope);
      } catch {
        inputValue = null;
      }
      const inputDetails = analyzeValueType(inputValue);

      const result = math.evaluate(expression, scope);
      const resultDetails = analyzeValueType(result);

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
    } catch (e: unknown) {
      return {
        error: e instanceof Error ? e.message : 'Invalid expression',
        details: 'The expression could not be evaluated. Please check the syntax and try again.'
      };
    }
  },
}); 