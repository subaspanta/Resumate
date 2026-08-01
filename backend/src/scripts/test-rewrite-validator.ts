// Standalone test for validateRewrite. No test framework is configured in this
// project yet, so this is a plain tsx script (run: npx tsx src/scripts/test-rewrite-validator.ts).
// Prints pass/fail per case and exits non-zero if any case fails.

import { validateRewrite } from "../modules/analysis/agents/rewrite-validator.js";

interface Case {
  name: string;
  original: string;
  rewrite: string;
  expectValid: boolean;
  // Substring the reason should contain when we expect a failure.
  expectReasonIncludes?: string;
}

const cases: Case[] = [
  {
    name: "good rewrite stays close to original",
    original: "Responsible for making the website faster for users",
    rewrite: "Optimized website performance, making it faster for users",
    expectValid: true,
  },
  {
    name: "rewrite invents a new date",
    original: "Built the payments feature for the checkout flow",
    rewrite: "Built the payments feature for the checkout flow in 2021",
    expectValid: false,
    expectReasonIncludes: "date",
  },
  {
    name: "rewrite is more than 2x original length",
    original: "Led the onboarding project",
    rewrite:
      "Led the onboarding project by coordinating multiple cross functional teams across product design engineering and support while personally driving every milestone forward",
    expectValid: false,
    expectReasonIncludes: "2x original length",
  },
  {
    name: "rewrite has very low word overlap",
    original: "Managed customer support tickets and resolved billing issues",
    rewrite: "cooked delicious pasta every single evening without help",
    expectValid: false,
    expectReasonIncludes: "less than 30%",
  },
];

let failures = 0;

for (const testCase of cases) {
  const result = validateRewrite(testCase.original, testCase.rewrite);
  let passed = result.valid === testCase.expectValid;

  if (passed && !testCase.expectValid && testCase.expectReasonIncludes) {
    passed = (result.reason ?? "").includes(testCase.expectReasonIncludes);
  }

  if (passed) {
    console.log(`PASS: ${testCase.name}`);
  } else {
    failures++;
    console.log(`FAIL: ${testCase.name}`);
    console.log(
      `   expected valid=${testCase.expectValid}` +
        (testCase.expectReasonIncludes
          ? ` reason~="${testCase.expectReasonIncludes}"`
          : ""),
    );
    console.log(
      `   got      valid=${result.valid} reason="${result.reason ?? ""}"`,
    );
  }
}

console.log(
  `\n${cases.length - failures}/${cases.length} passed, ${failures} failed`,
);

if (failures > 0) {
  process.exit(1);
}
