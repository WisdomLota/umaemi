// Copy and structure for the two journeys: joining the network and booking
// a consultation. Each has an introduction page and a four-step form.

export type Field = { name: string; placeholder: string; type?: "text" | "email" | "url"; required?: boolean };

export type Step =
  | { kind: "fields"; title: string; fields: Field[] }
  | { kind: "choice"; title: string; name: string; options: string[]; multiple?: boolean }
  | { kind: "message"; title: string; name: string; placeholder: string }
  | { kind: "schedule"; title: string };

export type IntroSection = {
  title: string;
  paragraphs: string[];
  /** Optional bullet list, with an optional lead-in and closing paragraph. */
  list?: { lead?: string; items: string[]; after?: string };
};

export type Flow = {
  id: "join" | "consultation";
  label: string;
  intro: IntroSection[];
  steps: Step[];
  /** Where the introduction's "Next" leads. */
  formHref: string;
};

const aboutYou = (full: boolean): Step => ({
  kind: "fields",
  title: "Tell us about yourself",
  fields: [
    { name: "fullName", placeholder: "Full Name", required: true },
    { name: "email", placeholder: "Email", type: "email", required: true },
    { name: "businessName", placeholder: "Business Name (Optional)" },
    ...(full
      ? [
          { name: "productOrService", placeholder: "Product or Service (Optional)" },
          { name: "website", placeholder: "Website or Social Media (Optional)" },
        ]
      : []),
  ],
});

export const joinFlow: Flow = {
  id: "join",
  label: "Join Umaemi Network",
  formHref: "/join/apply",
  intro: [
    {
      title: "Join the Umaemi network",
      paragraphs: [
        "Our community brings together businesses, professionals, entrepreneurs, and organizations looking to grow through meaningful connections and shared opportunities. Whether you're seeking partnerships, collaboration, guidance, or simply a network of like-minded people, the Umaemi Network is designed to help you build valuable relationships and discover new opportunities for growth.",
        "Join a community built on collaboration, innovation, and mutual success.",
      ],
    },
    {
      title: "What to expect",
      paragraphs: [
        "Joining the Umaemi Network is about more than receiving updates. It's about becoming part of a growing ecosystem where people support one another, share knowledge, and create opportunities together.",
      ],
      list: {
        lead: "As a member, you can expect to:",
        items: [
          "Connect with business owners, professionals, and organizations.",
          "Discover collaboration and partnership opportunities.",
          "Stay informed about community initiatives and events.",
          "Access valuable insights on branding, business, and technology.",
          "Become part of a network focused on growth and innovation.",
        ],
      },
    },
    {
      title: "Why Join the Network?",
      paragraphs: [
        "The best opportunities often come from the right connections.",
        "By joining the Umaemi Network, you'll gain access to a community that values collaboration, openness, and continuous growth. Whether you're looking for business partnerships, new projects, industry insights, or opportunities to expand your reach, the network is designed to help you connect with people who share your goals and ambitions.",
        "Together, we create an environment where ideas can grow into opportunities and relationships can become long-term partnerships.",
      ],
    },
    {
      title: "Start with a Connection",
      paragraphs: [
        "Joining the Umaemi Network comes with no obligation or long-term commitment. Our goal is simply to bring together businesses, organizations, and professionals who believe in the power of collaboration and shared growth. Whether you're looking for partnerships, support, opportunities, or inspiration, you'll find a welcoming community ready to grow alongside you.",
        "Your next opportunity could start with a simple connection.",
      ],
    },
  ],
  steps: [
    aboutYou(true),
    {
      kind: "choice",
      title: "How would you like to be involved?",
      name: "involvement",
      options: [
        "Community Member",
        "Business Partner",
        "Technology Partner",
        "Service Provider",
        "Event Collaborator",
        "Not sure yet",
      ],
    },
    {
      kind: "choice",
      title: "Areas of Interest",
      name: "interests",
      multiple: true,
      options: [
        "Business Growth",
        "Technology",
        "Partnerships",
        "Branding",
        "Community Events",
        "Learning Opportunities",
        "Networking",
      ],
    },
    {
      kind: "message",
      title: "Tell us more",
      name: "message",
      placeholder: "What are you hoping to gain from joining the Umaemi network?",
    },
  ],
};

export const consultationFlow: Flow = {
  id: "consultation",
  label: "Consultation Booking",
  formHref: "/consultation/book",
  intro: [
    {
      title: "Let’s explore what is possible together",
      paragraphs: [
        "Our process begins with a free consultation session designed to understand your business, challenges, and goals. Whether you're exploring an idea, looking to improve your brand, or searching for the right technology solution, we'll help you identify practical next steps without pressure or technical jargon.",
      ],
    },
    {
      title: "What you can expect",
      paragraphs: ["A consultation with Umaemi is designed to provide value from the very beginning. During our session, we will:"],
      list: {
        items: [
          "Learn about your business and objectives.",
          "Discuss current challenges and opportunities.",
          "Explore ideas and possible solutions.",
          "Answer any questions you may have.",
          "Recommend practical next steps tailored to your needs.",
        ],
        after:
          "By the end of the conversation, you'll have a clearer understanding of your options and how technology, branding, or digital solutions can support your goals.",
      },
    },
    {
      title: "Why start with a consultation?",
      paragraphs: [
        "We believe every successful project starts with understanding. That's why we take a value-first approach. Before discussing services or solutions, we focus on your goals, challenges, and opportunities. This helps us recommend solutions that genuinely fit your needs while giving you the information you need to make confident decisions.",
      ],
    },
    {
      title: "Looking forward to meeting you",
      paragraphs: [
        "Whether you have a fully formed idea or are still exploring your options, we're here to help. Every consultation is focused on providing clarity, guidance, and practical next steps tailored to your goals.",
      ],
    },
  ],
  steps: [
    aboutYou(false),
    {
      kind: "choice",
      title: "What are you looking for help with?",
      name: "helpWith",
      options: [
        "Branding & Visualization",
        "Consultation & Guidance",
        "Custom Tech Solutions",
        "White-Label Solutions",
        "Not sure yet",
      ],
    },
    { kind: "schedule", title: "What time works best for you?" },
    {
      kind: "message",
      title: "Tell us about your project",
      name: "message",
      placeholder: "What challenge are you trying to solve, or what would you like to achieve?",
    },
  ],
};

export const flows = { join: joinFlow, consultation: consultationFlow };
