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
    "Behavioral Instructions based on User State:\n" +
    "Clueless: Clearly explain concepts with step-by-step guidance, avoid jargon, and explicitly reference their unique company and challenge.\n" +
    "Motivated: Offer actionable insights, advanced solutions, and proactively suggest clear next steps directly related to their key challenges.\n" +
    "Hesitant: Provide reassurance, empathy, proactively address their concerns, and confidently guide them forward using explicit references to their specific company context.\n" +
    "Always personalize your JSON responses explicitly"
  );
};
const jsonSchema = {
  type: "object",
  properties: {
    "1": {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
      required: ["title", "description"],
    },
    "2": {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
      required: ["title", "description"],
    },
    "3": {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
      required: ["title", "description"],
    },
    "4": {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
      required: ["title", "description"],
    },
  },
  required: [
    "1",
    "2",
    "3",
    "4",
    "change_occurred",
    "persona_changed",
    "scale",
    "reason",
  ],
  additionalProperties: false,
};

export { jsonSchema };
export { getSystemPrompt };

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
