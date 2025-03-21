import { CompanyProfile } from "@/types/companyProfile";

const getSystemPrompt = (companyProfile: CompanyProfile) => {
  return (
    `You are a helpful assistant chatting with a user who is currently motivated.` + //TODO: change back | ${userState}
    `Take the user and company info as written under "User and company context gathered from survey" into account. The general theme of this conversation is guiding the user toward innovative thinking.` +
    "Current Conversation State:\n" +
    `conversation_state: overview` + //TODO: change this back | ${conversationState}
    "\n" +
    "User and company context gathered from survey:\n" +
    `Company Size: ${companyProfile.companySize}` +
    `Company Industry: ${companyProfile.industry}` +
    `Revenue Range: ${companyProfile.revenueRange}` +
    `Profitability Status: ${companyProfile.profitability}` +
    `Market Position: ${companyProfile.marketPosition}` +
    `Competitive Landscape: ${companyProfile.competitiveLandscape}` +
    `Key Challenges: ${companyProfile.keyChallenges}` +
    `Customer Base: ${companyProfile.customerBase}` +
    `Geographical Presence: ${companyProfile.geographicalPresence}` +
    "\n" +
    "For the titles use 2-3 words" +
    "For the descriptions use a maximum of 20 words" +
    "Behavioral Instructions based on User State:\n" +
    "Clueless: Clearly explain concepts with step-by-step guidance, avoid jargon, and explicitly reference their unique company and challenge.\n" +
    "Motivated: Offer actionable insights, advanced solutions, and proactively suggest clear next steps directly related to their key challenges.\n" +
    "Hesitant: Provide reassurance, empathy, proactively address their concerns, and confidently guide them forward using explicit references to their specific company context.\n" +
    "Always personalize your JSON responses explicitly"
  );
};
const jsonSchema = {
  type: "object",
  additionalProperties: false, // disallows additional top-level properties
  properties: {
    "1": {
      type: "object",
      additionalProperties: false, // disallows extra properties in object "1"
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
      required: ["title", "description"],
    },
    "2": {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
      required: ["title", "description"],
    },
    "3": {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
      required: ["title", "description"],
    },
    "4": {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
      required: ["title", "description"],
    },
  },
  required: ["1", "2", "3", "4"],
};

const getDeepDivePrompt = (companyProfile: CompanyProfile) => {
  return (
    'You are a helpful assistant chatting with a user who is currently motivated. Take the user and company info as written under "User and company context gathered from survey" into account. The general theme of this conversation is guiding the user toward innovative thinking. ' +
    "User and company context gathered from survey:\n" +
    `Company Size: ${companyProfile.companySize}` +
    `Company Industry: ${companyProfile.industry}` +
    `Revenue Range: ${companyProfile.revenueRange}` +
    `Profitability Status: ${companyProfile.profitability}` +
    `Market Position: ${companyProfile.marketPosition}` +
    `Competitive Landscape: ${companyProfile.competitiveLandscape}` +
    `Key Challenges: ${companyProfile.keyChallenges}` +
    `Customer Base: ${companyProfile.customerBase}` +
    `Geographical Presence: ${companyProfile.geographicalPresence}` +
    "\n"
  );
};

const getDeepDiveUserInput = (title: string, description: string) => {
  return (
    "for the following topic please research some additional information and give back the most important parts TOPIC: title: " +
    title +
    " description: " +
    description +
    "Please give your research in 2-3 short paragraphs which consist of 1 sentence maximum and make a small list with next possible steps which are at most one sentence"
  );
};

const jsonSchemaDeepDive = {
  type: "object",
  additionalProperties: false, // disallows additional top-level properties
  properties: {
    paragraphs: {
      type: "object",
      additionalProperties: false, // disallows extra properties in object "1"
      properties: {
        first_paragraph: { type: "string" },
        second_paragraph: { type: "string" },
        third_paragraph: { type: "string" },
      },
      required: ["first_paragraph", "second_paragraph", "third_paragraph"],
    },
    next_steps: {
      type: "object",
      additionalProperties: false,
      properties: {
        step_1: { type: "string" },
        step_2: { type: "string" },
        step_3: { type: "string" },
      },
      required: ["step_1", "step_2", "step_3"],
    },
  },
  required: ["paragraphs", "next_steps"],
};

export { jsonSchema };
export { jsonSchemaDeepDive };
export { getSystemPrompt };
export { getDeepDiveUserInput };
export { getDeepDivePrompt };


/*
[
  ,
  {
    "id": 2,
    "title": "concise and clear title (3-6 words)",
    "description": "exactly one actionable sentence describing this bullet point (approximately 10-20 words)"
  },
  {
    "id": 3,
    "title": "concise and clear title (3-6 words)",
    "description": "exactly one actionable sentence describing this bullet point (approximately 10-20 words)"
  },
  {
    "id": 4,
    "title": "concise and clear title (3-6 words)",
    "description": "exactly one actionable sentence describing this bullet point (approximately 10-20 words)"
  }
]
 */
