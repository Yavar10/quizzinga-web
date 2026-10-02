import { EvaluationMethod } from "@/types/answer";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface EvaluationResult {
  is_correct: boolean;
  evaluation_method: EvaluationMethod;
  confidence: number | null;
}

/**
 * Normalize a string for exact comparison:
 * trim, lowercase, collapse whitespace, strip surrounding punctuation.
 */
function normalize(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^[.,;:!?'"()\[\]{}\-—–]+/, "")
    .replace(/[.,;:!?'"()\[\]{}\-—–]+$/, "")
    .trim();
}

/**
 * Layer 1: Exact matching.
 * Compares normalized submitted answer against correct + accepted answers.
 */
function evaluateExact(
  submittedAnswer: string,
  correctAnswer: string,
  acceptedAnswers: string[]
): EvaluationResult | null {
  console.log(`[Eval: Exact] Normalizing submitted answer...`);
  const normalizedSubmitted = normalize(submittedAnswer);

  if (normalizedSubmitted === normalize(correctAnswer)) {
    console.log(`[Eval: Exact] ✅ Match found with correct answer.`);
    return { is_correct: true, evaluation_method: "exact", confidence: 1.0 };
  }

  for (const accepted of acceptedAnswers) {
    if (normalizedSubmitted === normalize(accepted)) {
      console.log(`[Eval: Exact] ✅ Match found with accepted answer variant: "${accepted}"`);
      return { is_correct: true, evaluation_method: "exact", confidence: 1.0 };
    }
  }

  console.log(`[Eval: Exact] ❌ No exact match found.`);
  return null; // No exact match — fall through to next layer
}

/**
 * Layer 2: Gemini AI semantic evaluation.
 * Calls Gemini to assess whether the submitted answer is semantically
 * equivalent to the correct answer even if phrased differently.
 */
async function evaluateWithAI(
  questionText: string,
  submittedAnswer: string,
  correctAnswer: string,
  acceptedAnswers: string[]
): Promise<EvaluationResult> {
  console.log(`[Eval: AI] Starting Gemini evaluation...`);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn(`[Eval: AI] ⚠️ No GEMINI_API_KEY found. Falling back to exact-match only behavior.`);
    return { is_correct: false, evaluation_method: "exact", confidence: 1.0 };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a quiz answer evaluator. Evaluate whether a participant's answer is correct.

QUESTION: "${questionText}"
CORRECT ANSWER: "${correctAnswer}"
ALSO ACCEPTED: ${acceptedAnswers.length > 0 ? acceptedAnswers.map((a) => `"${a}"`).join(", ") : "none"}
SUBMITTED ANSWER: "${submittedAnswer}"

Rules:
- Accept spelling variations and minor typos
- Accept abbreviations and their full forms
- Accept alternative phrasings that convey the same meaning
- Accept partial answers that clearly identify the correct concept
- Reject answers that are factually wrong or refer to something different

CRITICAL INSTRUCTION:
Respond with ONLY valid JSON containing EXACTLY these two keys: "is_correct" (boolean) and "confidence" (number between 0.0 and 1.0).
Do NOT include any explanations, conversational text, or markdown formatting.`;

    let text = "";
    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      try {
        console.log(`[Eval: AI] Prompt sent to Gemini (Attempt ${attempt + 1}/${maxRetries})...`);
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        });
        text = result.response.text().trim();
        break; // Success, exit retry loop
      } catch (e: any) {
        if (e?.status === 503 && attempt < maxRetries - 1) {
          attempt++;
          console.warn(`[Eval: AI] ⚠️ Gemini is overloaded (503). Retrying in ${attempt * 1.5} seconds...`);
          await new Promise(res => setTimeout(res, attempt * 1500));
        } else {
          throw e; // Re-throw if it's not a 503 or we've exhausted retries
        }
      }
    }
    
    console.log(`[Eval: AI] Raw response from Gemini:`, text);

    // Parse JSON from the response (handle potential markdown wrapping)
    const jsonStr = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(jsonStr);

    console.log(`[Eval: AI] ✅ Parsed AI verdict -> is_correct: ${parsed.is_correct}, confidence: ${parsed.confidence}`);

    return {
      is_correct: Boolean(parsed.is_correct),
      evaluation_method: "ai",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
    };
  } catch (error) {
    console.error("[Eval: AI] ❌ Gemini evaluation failed with error:", error);
    // On AI failure, fall back to marking incorrect with low confidence
    return { is_correct: false, evaluation_method: "exact", confidence: 0.0 };
  }
}

/**
 * Main evaluation pipeline:
 *   1. Exact match → instant correct (confidence 1.0)
 *   2. AI semantic evaluation → correct/incorrect with confidence
 *
 * Future layers (fuzzy similarity, threshold gates) can be
 * inserted between steps without rewriting the pipeline.
 */
export async function evaluateAnswer(
  questionText: string,
  submittedAnswer: string,
  correctAnswer: string,
  acceptedAnswers: string[]
): Promise<EvaluationResult> {
  console.log(`\n======================================================`);
  console.log(`[Evaluator] New Answer Received!`);
  console.log(`[Evaluator] Question: "${questionText}"`);
  console.log(`[Evaluator] Submitted Answer: "${submittedAnswer}"`);
  console.log(`[Evaluator] Target: "${correctAnswer}"`);
  console.log(`======================================================`);

  // Empty answer is always wrong
  if (!submittedAnswer.trim()) {
    console.log(`[Evaluator] Answer is empty. Immediately failing.`);
    return { is_correct: false, evaluation_method: "exact", confidence: 1.0 };
  }

  // Layer 1: Exact match
  const exactResult = evaluateExact(submittedAnswer, correctAnswer, acceptedAnswers);
  if (exactResult) {
    console.log(`[Evaluator] Final Verdict: CORRECT (via exact match)`);
    return exactResult;
  }

  // Layer 2: AI evaluation
  const aiResult = await evaluateWithAI(
    questionText,
    submittedAnswer,
    correctAnswer,
    acceptedAnswers
  );

  console.log(`[Evaluator] Final Verdict: ${aiResult.is_correct ? 'CORRECT' : 'INCORRECT'} (via AI, confidence: ${aiResult.confidence})`);
  return aiResult;
}
