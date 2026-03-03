import { NextResponse } from "next/server";
import { TestCase } from "@/services/models/types";

export interface ExecuteCodeRequest {
  code: string;
  testCases: TestCase[];
}

export interface TestCaseResult {
  id: string;
  description: string;
  passed: boolean;
}

export interface ExecuteCodeResponse {
  success: boolean;
  output: string;
  results: TestCaseResult[];
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as ExecuteCodeRequest;
    const { code, testCases } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code is required and must be a string." }, { status: 400 });
    }

    if (!testCases || !Array.isArray(testCases)) {
      return NextResponse.json({ error: "Test cases are required and must be an array." }, { status: 400 });
    }

    // In a real application, this would send the code to a secure compilation/execution backend.
    // Here, we simulate the execution and run the test cases locally via Regex for educational purposes.

    // 1. Simulate compilation time
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 2. Evaluate test cases
    const results: TestCaseResult[] = testCases.map((tc) => {
      let passed = true;
      if (tc.requiredPattern) {
        try {
          const regex = new RegExp(tc.requiredPattern);
          passed = regex.test(code);
        } catch (e) {
          console.error(`Invalid regex for test case ${tc.id}:`, e);
          passed = false; // Fail safe
        }
      }
      return {
        id: tc.id,
        description: tc.description,
        passed,
      };
    });

    const allPassed = results.every((r) => r.passed);

    // 3. Generate mock console output based on results
    let output = "Compiling program...\n";
    if (allPassed) {
      output += "Success! Program compiled and invoked successfully.\n\nSimulated Output:\n";
      // Basic mock output generation based on what might be in the code
      const msgMatch = code.match(/msg!\("(.*?)"\);/);
      if (msgMatch && msgMatch[1]) {
        output += `> ${msgMatch[1]}\n`;
      } else {
        output += "> Program executed without returning custom messages.\n";
      }
    } else {
      output += "Verification failed.\n\nErrors:\n";
      results.filter((r) => !r.passed).forEach((failedTest) => {
        output += `- Failed: ${failedTest.description}\n`;
      });
      output += "\nPlease review your code and try again.";
    }

    const responseFormat: ExecuteCodeResponse = {
      success: allPassed,
      output,
      results,
    };

    return NextResponse.json(responseFormat);
  } catch (error) {
    console.error("Error executing code:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
