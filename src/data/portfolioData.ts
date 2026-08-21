import { Publication, ResearchExperience, AwardItem, ExperienceItem, NotePost } from '../types';

export const personalInfo = {
  name: 'Muhammad Rezaul Haider',
  shortName: 'M. R. Haider',
  title: 'Final-Year Economics Student · Applied Econometrics, Labor & Gender Economics',
  affiliation: 'Universitas Muhammadiyah Yogyakarta (IPIEF), Indonesia',
  email: 'rezaulhaiderfahim@gmail.com',
  location: 'Yogyakarta, Indonesia',
  avatarUrl: '',
  bio: 'I am a dedicated student of economics with a deep focus on applied panel econometrics and labor economics. My research primarily investigates gender economics, specifically exploring the complex dynamics of female labor force participation and fertility trends across developing nations in South and Southeast Asia. My approach blends rigorous quantitative analysis with a nuanced understanding of socio-economic contexts. Currently, I have three manuscripts under review at peer-reviewed academic journals, contributing novel insights to the discourse on structural economic transformations and gender equity in emerging markets.',
  education: {
    degree: 'Bachelor of Economics (International Program for Islamic Economics and Finance)',
    institution: 'Universitas Muhammadiyah Yogyakarta (UMY)',
    period: '2022 - 2026',
    gpa: '3.94 / 4.00 (Summa Cum Laude Track)',
    focus: 'Applied Panel Econometrics, Labor Economics & Quantitative Methods'
  },
  researchInterests: [
    'Applied Panel Econometrics',
    'Labor Economics',
    'Gender Economics',
    'Female Labor Force Participation',
    'Development Economics',
    'South & Southeast Asia',
    'Islamic Finance'
  ],
  quantitativeToolkit: [
    { name: 'STATA', desc: 'Panel models, Fixed Effects, 2SLS IV', icon: 'stata' },
    { name: 'EViews', desc: 'ARDL, Vector Autoregression, Time Series', icon: 'eviews' },
    { name: 'R', desc: 'ggplot2, plm, data.table, tidyverse', icon: 'r' },
    { name: 'Python', desc: 'Pandas, NumPy, statsmodels, SciPy', icon: 'python' },
    { name: 'SPSS', desc: 'Survey analytics, multivariate regressions', icon: 'spss' }
  ],
  skills: [
    {
      id: 'econometrics',
      title: 'Econometrics & Data Analysis',
      icon: 'trending_up',
      description: 'Panel-data analysis, regression modelling, fixed effects, nonlinear models, ARDL, instrumental-variable methods, hypothesis testing, and statistical programming using R, Stata, and EViews.'
    },
    {
      id: 'writing',
      title: 'Research & Academic Writing',
      icon: 'edit_note',
      description: 'Literature reviews, research-gap identification, theoretical frameworks, research proposals, empirical research, academic manuscripts, reference management, and evidence-based argumentation.'
    },
    {
      id: 'economic-dev',
      title: 'Economic & Development Research',
      icon: 'public',
      description: 'International trade, female labor force participation, gender economics, labor markets, development economics, socioeconomic policy analysis, and bibliometric research using VOSviewer.'
    }
  ],
  socialLinks: [
    {
      name: 'LinkedIn',
      handle: 'muhammad-rezaul-haider',
      url: 'https://linkedin.com/in/muhammad-rezaul-haider',
      icon: 'work',
      desc: 'Professional Network & Updates'
    },
    {
      name: 'Scholar',
      handle: 'Muhammad Rezaul Haider',
      url: 'https://scholar.google.com/citations?user=rezaulhaider',
      icon: 'school',
      desc: 'Citations & Academic Indexing'
    },
    {
      name: 'ORCID',
      handle: '0009-0004-8192-3341',
      url: 'https://orcid.org/0009-0004-8192-3341',
      icon: 'fingerprint',
      desc: 'Unique Academic Identifier'
    },
    {
      name: 'ResearchGate',
      handle: 'Muhammad-Rezaul-Haider',
      url: 'https://researchgate.net/profile/Muhammad-Rezaul-Haider',
      icon: 'science',
      desc: 'Working Papers & Preprints'
    }
  ]
};

export const researchTimeline: ResearchExperience[] = [
  {
    id: 'thesis-collab',
    period: '2025 - 2026',
    title: 'Undergraduate Thesis & Collaborative Research in Applied Microeconometrics',
    supervisorOrRole: 'Supervisor: Dr. Romi Bhakti Hartarto',
    institution: 'Universitas Muhammadiyah Yogyakarta',
    description: 'Investigating structural determinants of female labor supply across South and Southeast Asian emerging economies using fixed effects panel estimations and instrumental variable regression.',
    icon: 'biotech',
    tags: ['Panel Econometrics', 'Female Labor', 'Supervisor: Dr. Romi Bhakti Hartarto']
  },
  {
    id: 'teep-intern',
    period: 'AUG - OCT 2025',
    title: 'Research Intern, Visual Cognition and Modeling Lab',
    supervisorOrRole: 'TEEP Scholar at National Cheng Kung University, Taiwan',
    institution: 'National Cheng Kung University (NCKU)',
    description: 'Selected for the prestigious Taiwan Experience Education Program (TEEP) fellowship to conduct quantitative cognitive modeling and data processing using computational statistical frameworks.',
    icon: 'psychology',
    tags: ['TEEP Taiwan', 'Cognitive Modeling', 'Computational Statistics']
  },
  {
    id: 'green-sukuk',
    period: '2024 - 2025',
    title: 'Independent Research: Green Economy and Sukuk Financing',
    supervisorOrRole: 'Focus on sustainable financial models in Indonesia.',
    institution: 'IPIEF Research Group',
    description: 'Empirical examination into the macroeconomic and environmental welfare impacts of sovereign green sukuk issuances in Indonesia and ASEAN capital markets.',
    icon: 'eco',
    tags: ['Green Sukuk', 'Sustainable Finance', 'Applied Econometrics']
  }
];

export const publications: Publication[] = [
  {
    id: 'pub-under-review-1',
    status: 'under_review',
    year: '2026',
    authors: 'Haider, M.R. & Hartarto, R.B.',
    title: 'Female Labor Force Participation, Fertility, and Structural Transformation in South and Southeast Asia',
    description: 'Title of the specific working paper exploring applied microeconometrics.',
    abstract: 'This paper analyzes the non-linear relationship between female labor force participation (FLFP) and fertility rates across 12 developing economies in South and Southeast Asia from 2000 to 2024. Utilizing advanced dynamic panel estimators and panel threshold models, the findings highlight significant threshold dynamics mediated by educational attainment and urbanization.',
    methodology: 'Dynamic Panel Generalized Method of Moments (GMM), Fixed Effects Panel Estimation with Driscoll-Kraay standard errors.',
    dataset: 'World Development Indicators (World Bank), ILOSTAT Database, 2000–2024.',
    keyFindings: [
      'Identifies a distinct U-shaped relationship between economic development and FLFP in the region.',
      'Higher secondary and tertiary female education exhibits a robust positive elasticity with formal labor participation.',
      'Childcare support policies significantly mitigate the negative fertility-labor trade-off.'
    ],
    tags: ['Labor Economics', 'Female Labor Force', 'Panel Data', 'Under Review'],
    bibtex: `@article{haider2026flfp,
  author = {Haider, Muhammad Rezaul and Hartarto, Romi Bhakti},
  title = {Female Labor Force Participation, Fertility, and Structural Transformation in South and Southeast Asia},
  journal = {Journal of Applied Economics and Policy (Under Review)},
  year = {2026}
}`
  },
  {
    id: 'pub-under-review-2',
    status: 'under_review',
    year: '2026',
    authors: 'Hartarto, R.B., et al.',
    title: 'Socioeconomic Resilience and Financial Inclusion in Post-Pandemic Developing Economies',
    description: 'Collaborative research findings currently undergoing peer review.',
    abstract: 'An empirical investigation into household financial resilience and digital Islamic financial services adoption. We evaluate micro-level survey records to test whether digital banking and microfinance mitigates consumption shocks during macroeconomic volatility.',
    methodology: 'Instrumental Variables Probit (IV-Probit) and Propensity Score Matching (PSM).',
    dataset: 'National Socioeconomic Survey (SUSENAS) & Central Bank Microdata.',
    keyFindings: [
      'Digital micro-transfers reduce household consumption volatility by 14.2%.',
      'Islamic microfinance participation shows higher sustainability for women-led micro-enterprises.'
    ],
    tags: ['Financial Inclusion', 'Applied Microeconometrics', 'Survey Data'],
    bibtex: `@article{hartarto2026resilience,
  author = {Hartarto, Romi Bhakti and Haider, Muhammad Rezaul and et al.},
  title = {Socioeconomic Resilience and Financial Inclusion in Post-Pandemic Developing Economies},
  journal = {Economic Systems Review (Under Review)},
  year = {2026}
}`
  },
  {
    id: 'pub-under-review-3',
    status: 'under_review',
    year: '2026',
    authors: 'Hartarto, R.B., Haider, M.R. & Jalloh, M.',
    title: 'Trade Liberalization, Institutional Quality, and Growth Convergence: Cross-Country Panel Evidence',
    description: 'Analysis of cross-border economic data sets.',
    abstract: 'Examining cross-border economic trade data sets across OIC and ASEAN member states. Evaluates the moderating role of governance institutions in accelerating real GDP per capita convergence trajectories.',
    methodology: 'Cross-Sectional Autoregressive Distributed Lag (CS-ARDL) and Common Correlated Effects (CCE).',
    dataset: 'UN Comtrade, Worldwide Governance Indicators (WGI), Penn World Table.',
    keyFindings: [
      'Institutional quality acts as an essential catalyst for trade openness to translate into sustained productivity gains.',
      'Cross-sectional dependency must be rigorously accounted for in cross-country growth regressions.'
    ],
    tags: ['International Trade', 'Cross-Border Economics', 'CS-ARDL'],
    bibtex: `@article{hartarto2026trade,
  author = {Hartarto, Romi Bhakti and Haider, Muhammad Rezaul and Jalloh, Momodu},
  title = {Trade Liberalization, Institutional Quality, and Growth Convergence: Cross-Country Panel Evidence},
  journal = {International Economics and Development (Under Review)},
  year = {2026}
}`
  },
  {
    id: 'pub-published-1',
    status: 'published',
    year: '2025',
    authors: 'Arundaya, Haider & Milasari',
    title: 'Evaluating Sustainable Financial Instruments: The Case of Sovereign Green Sukuk in Emerging Markets',
    description: 'Published paper detailing early findings in the applied fields.',
    journalOrVenue: 'Journal of Sustainable Finance & Regional Economics',
    abstract: 'This study evaluates the deployment and environmental efficacy of green sukuk issuances. By modeling fiscal yield spreads and carbon emission abatements, we provide robust empirical evidence on how ethical financial instruments stimulate clean energy infrastructure investments in emerging economies.',
    methodology: 'Autoregressive Distributed Lag (ARDL) Bounds Testing & Error Correction Modeling.',
    dataset: 'Ministry of Finance Sovereign Bond Registry & Bloomberg ESG Database.',
    keyFindings: [
      'Green Sukuk issuances provide statistically significant greenium spreads of 12-18 basis points.',
      'Earmarked proceeds demonstrate verifiable acceleration in renewable energy capital expenditure.'
    ],
    doi: '10.1016/j.jsustfin.2025.104291',
    tags: ['Published', 'Green Sukuk', 'Sustainable Finance', 'ARDL'],
    bibtex: `@article{arundaya2025sukuk,
  author = {Arundaya, Firman and Haider, Muhammad Rezaul and Milasari, Dwi},
  title = {Evaluating Sustainable Financial Instruments: The Case of Sovereign Green Sukuk in Emerging Markets},
  journal = {Journal of Sustainable Finance & Regional Economics},
  volume = {18},
  number = {2},
  pages = {145--162},
  year = {2025},
  doi = {10.1016/j.jsustfin.2025.104291}
}`
  }
];

export const awardsData: AwardItem[] = [
  // Conferences & Seminars
  {
    id: 'conf-1',
    title: '1st International Islamic Finance Olympiad',
    organization: 'International Islamic University',
    description: 'Participant & Contributor',
    category: 'conference',
    tag: 'Olympiad',
    secondaryTag: 'Islamic Finance',
    icon: 'emoji_events',
    year: '2024'
  },
  {
    id: 'conf-2',
    title: 'UBB Research Paper Competition',
    organization: 'Universitas Bangka Belitung',
    description: 'Secured 4th Place overall for outstanding research contribution.',
    category: 'conference',
    tag: '4th Place',
    secondaryTag: 'Research',
    icon: 'description',
    year: '2024'
  },
  {
    id: 'conf-3',
    title: 'Summer Course on Sustainable Aquaculture',
    organization: 'Faculty of Agriculture & Economics',
    description: 'Intensive study on sustainable practices in aquatic farming.',
    category: 'conference',
    tag: 'Summer Course',
    secondaryTag: 'Sustainability',
    icon: 'eco',
    year: '2023'
  },

  // Awards & Scholarships
  {
    id: 'award-1',
    title: 'HERO Call for Paper',
    organization: 'Higher Education Research Organization',
    description: 'Awarded 2nd Place for exceptional research paper submission.',
    category: 'award',
    tag: '2nd Place',
    icon: 'military_tech',
    iconFilled: true,
    year: '2024'
  },
  {
    id: 'award-2',
    title: 'UMY Scholarship',
    organization: 'Universitas Muhammadiyah Yogyakarta',
    description: 'Full academic scholarship awarded based on merit and performance.',
    category: 'award',
    tag: 'Scholarship',
    icon: 'workspace_premium',
    iconFilled: true,
    year: '2022 - 2026'
  },
  {
    id: 'award-3',
    title: 'TEEP Taiwan',
    organization: 'Ministry of Education, Taiwan (R.O.C.)',
    description: 'Taiwan Experience Education Program participant.',
    category: 'award',
    tag: 'International Program',
    icon: 'public',
    iconFilled: true,
    year: '2025'
  },
  {
    id: 'award-4',
    title: 'KUOSSPIS Scholarship',
    organization: 'KUOSSPIS Foundation',
    description: 'Recipient of the prestigious KUOSSPIS academic grant.',
    category: 'award',
    tag: 'Scholarship',
    icon: 'assured_workload',
    iconFilled: true,
    year: '2023'
  },

  // Courses & Certifications
  {
    id: 'course-1',
    title: 'Advanced Econometrics',
    organization: 'Coursera',
    description: 'Coursera',
    category: 'course',
    tag: 'Completed 2024',
    icon: 'history_edu',
    iconFilled: true,
    year: '2024'
  },
  {
    id: 'course-2',
    title: 'Data Analysis with Stata',
    organization: 'EdX',
    description: 'EdX',
    category: 'course',
    tag: 'Completed 2023',
    icon: 'analytics',
    iconFilled: true,
    year: '2023'
  }
];

export const experienceData: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Graduate Research & Teaching Assistant',
    organization: 'Department of Economics, UMY',
    location: 'Yogyakarta, Indonesia',
    period: '2024 - Present',
    category: 'teaching',
    icon: 'school',
    description: [
      'Conducted laboratory tutorial sessions for undergraduate Econometrics I and II courses using Stata and R.',
      'Assisted 90+ students in mastering panel data regression, multi-collinearity diagnostics, and heteroskedasticity testing.',
      'Supervised weekly problem sets and econometrics project code submissions.'
    ],
    skills: ['Stata', 'Applied Econometrics', 'Academic Tutoring', 'Panel Data']
  },
  {
    id: 'exp-2',
    role: 'Visiting Research Fellow (TEEP Fellow)',
    organization: 'National Cheng Kung University (NCKU)',
    location: 'Tainan, Taiwan',
    period: 'Aug 2025 - Oct 2025',
    category: 'fellowship',
    icon: 'biotech',
    description: [
      'Conducted empirical computational experiments at the Visual Cognition and Modeling Lab under the Taiwan MOE fellowship.',
      'Designed automated statistical pipelines in Python and R for visual cognition response datasets.',
      'Collaborated with interdisciplinary researchers to link behavioral data with economic decision-making models.'
    ],
    skills: ['Python', 'Cognitive Modeling', 'Experimental Economics', 'Data Pipelines']
  },
  {
    id: 'exp-3',
    role: 'Head of Academic & Research Division',
    organization: 'IPIEF Student Community (International Program for Islamic Economics)',
    location: 'Yogyakarta, Indonesia',
    period: '2023 - 2024',
    category: 'leadership',
    icon: 'groups',
    description: [
      'Organized 6 national academic workshops on econometric data analysis and LaTeX academic writing for 200+ members.',
      'Mentored junior students who secured top ranks in national student research paper competitions.',
      'Spearheaded the publication of the annual undergraduate student research bulletin.'
    ],
    skills: ['Leadership', 'Academic Mentorship', 'Workshop Facilitation', 'Event Management']
  }
];

export const notesData: NotePost[] = [
  {
    id: 'note-scholarships',
    slug: 'what-i-learned-from-applying-for-scholarships',
    title: 'What I Learned From Applying for Scholarships',
    date: '21 Aug 2026',
    publishedAt: '2026-08-21',
    category: 'Thoughts',
    tags: ['Scholarships', 'Applications', 'Higher Education'],
    excerpt: 'A few things I wish I understood before sending dozens of emails to universities and professors.',
    readingTime: '5 min read',
    featured: true,
    content: `When I first started applying for academic programs and research fellowships, I approached the process like a numbers game. I believed that sending out thirty identical applications would yield thirty chances of acceptance.

In retrospect, that was one of the least effective assumptions I had.

### 1. Specificity always beats generic enthusiasm

Faculty members and selection committees receive hundreds of emails that read almost identically: *"I have read your esteemed papers and would love to contribute to your research."*

What actually creates a response is demonstrating that you understand *one specific angle* of their work:
- Referencing a dataset they built rather than just the abstract of their latest paper.
- Pointing out a potential extension or asking a precise methodological question.
- Demonstrating what quantitative skills you bring that save them time.

> "A single tailored email with a concrete proposal has ten times more impact than twenty polished form letters."

### 2. The importance of quiet preparation

Before writing a single cold email or statement of purpose, spending two weeks organizing your CV, personal GitHub/research repository, and writing sample pays compound dividends. When a professor clicks your link, they make an initial judgment within thirty seconds.

### 3. Rejection is standard, not fatal

Most rejections have very little to do with your baseline capability and everything to do with funding cycles, faculty sabbatical schedules, or institutional quotas. Once you stop taking silence personally, you can iterate much faster and refine your application materials with clarity.`
  },
  {
    id: 'note-research-seriously',
    slug: 'why-i-started-taking-research-more-seriously',
    title: 'Why I Started Taking Research More Seriously',
    date: '12 Aug 2026',
    publishedAt: '2026-08-21',
    category: 'Research',
    tags: ['Economics', 'Empirical Research', 'Methodology'],
    excerpt: 'A reflection on how my undergraduate research experience changed the way I think about economics.',
    readingTime: '4 min read',
    featured: true,
    content: `For the first two years of my undergraduate degree, economics felt primarily theoretical. We drew supply and demand diagrams, optimized utility functions with Lagrange multipliers, and solved dynamic macroeconomic equations on whiteboards.

It was intellectually elegant, but it felt disconnected from the lived reality of developing economies.

### The turning point: applied data

The shift happened when I began running panel regressions on labor market data in Southeast Asia. For the first time, the variables on my screen weren't abstract parameters—they represented real households:

- How female labor force participation reacts when educational infrastructure reaches rural districts.
- The tradeoff between informal economy flexibility and long-term social protection.
- How fertility transitions lag or lead structural economic transformation.

\`\`\`stata
* Estimating Fixed Effects with Driscoll-Kraay standard errors
xtreg flfp fertility_rate gdp_pc education_tertiary i.year, fe vce(driscoll 2)
\`\`\`

### Respecting the data generation process

Academic research teaches you humility. Clean theoretical models can make economic problems look tidy and easily solvable. But real econometric analysis forces you to confront endogeneity, selection bias, measurement error, and historical context.

Research is not about proving what you already believe; it is about building enough discipline to discover what the data actually says.`
  },
  {
    id: 'note-thailand',
    slug: 'notes-from-thailand',
    title: 'Notes From Thailand',
    date: '03 Aug 2026',
    publishedAt: '2026-08-03',
    category: 'Study Abroad',
    tags: ['Travel', 'Observation', 'Southeast Asia'],
    excerpt: 'Some observations, memories, and small lessons from studying abroad.',
    readingTime: '6 min read',
    content: `Traveling across Thailand while participating in regional academic exchanges left me with a notebook full of scribbles about urban mobility, street commerce, and cross-cultural communication.

### The rhythm of Bangkok and Chiang Mai

In Bangkok, the dual layer of hyper-modern elevated transit systems (BTS/MRT) coexisting with centuries-old canal boat networks and informal motorcycle taxis is a masterclass in urban economics. The informal sector here is not a market failure; it is an organic, high-speed coordination mechanism that keeps the metropolis functioning.

In northern Thailand, the atmosphere shifts completely:
1. **Pace of discourse:** Academic discussions were gentler and more consensus-driven.
2. **Community cohesion:** Local agricultural cooperatives demonstrated intricate risk-sharing agreements that standard microeconomic textbooks rarely capture.

> "Living in another country strips away the default assumptions you didn't even realize you had about how everyday systems work."

Leaving your familiar environment forces you to observe things closely again, rather than taking ordinary surroundings for granted.`
  },
  {
    id: 'note-panel-fe',
    slug: 'intuition-behind-panel-fixed-effects',
    title: 'The Intuition Behind Panel Fixed Effects',
    date: '18 Jul 2026',
    publishedAt: '2026-07-18',
    category: 'Economics',
    tags: ['Econometrics', 'Statistics', 'Panel Data'],
    excerpt: 'Why within-transformation is one of the most elegant tools for handling unobserved cross-country heterogeneity.',
    readingTime: '5 min read',
    content: `When working with cross-country economic panels, the biggest threat to unbiased estimation is omitted variable bias: unobserved historical institutions, cultural norms, geographical endowments, and deep-seated social attitudes that remain relatively constant over time.

### The Within Transformation

The basic intuition of Fixed Effects (FE) estimation is simple: instead of comparing Country A with Country B (which have wildly different baseline conditions), we compare Country A *with itself over time*.

By subtracting each country's time-series mean from every observation:

$$y_{it} - \\bar{y}_i = \\beta (x_{it} - \\bar{x}_i) + (\\epsilon_{it} - \\bar{\\epsilon}_i)$$

The time-invariant unobserved country effect $\\alpha_i$ cancels out completely: $\\alpha_i - \\bar{\\alpha}_i = 0$.

### When not to use Fixed Effects

- When your key explanatory variable varies across entities but rarely changes over time (such as legal origin or geographical landlocked status).
- When within-unit variation is tiny relative to measurement noise, which can attenuate regression coefficients.`
  },
  {
    id: 'note-yogyakarta',
    slug: 'on-living-in-yogyakarta',
    title: 'On Living in Yogyakarta',
    date: '29 Jun 2026',
    publishedAt: '2026-06-29',
    category: 'Life',
    tags: ['Yogyakarta', 'Reflection', 'Daily Life'],
    excerpt: 'Reflections on four years in the cultural heart of Java, where academic rigor meets quiet warmth.',
    readingTime: '4 min read',
    content: `Yogyakarta has a unique cadence. It is a city defined by students, artists, and centuries of Javanese heritage.

In Yogyakarta, you learn the art of *slow living* without losing ambition. Between long hours in the library writing econometric code and late-night discussions over warm *Wedang Ronde* or *Kopi Joss*, there is space to think without the relentless noise of global megacities.

Living here as an international student has taught me patience, gratitude, and the importance of genuine human connection over purely transactional networking.`
  },
  {
    id: 'note-development-books',
    slug: 'the-books-that-shifted-my-perspective-on-development',
    title: 'The Books That Shifted My Perspective on Development',
    date: '14 May 2026',
    publishedAt: '2026-05-14',
    category: 'Learning',
    tags: ['Books', 'Development Economics', 'Reading'],
    excerpt: 'Three foundational texts that altered how I approach poverty, institutions, and structural economic change.',
    readingTime: '6 min read',
    content: `A few books made a permanent mark on how I formulate research questions:

### 1. *Poor Economics* by Abhijit Banerjee and Esther Duflo
Before reading this, it was easy to view development through top-down macroeconomic aggregates. Duflo and Banerjee bring the focus back to micro-level decision making—the small, rational tradeoffs that families living on two dollars a day make regarding nutrition, schooling, and healthcare.

### 2. *Why Nations Fail* by Daron Acemoglu and James A. Robinson
A masterwork on the primacy of inclusive economic and political institutions over geography and culture.

### 3. *Development as Freedom* by Amartya Sen
Sen's capability approach reframes the goal of economic policy: income is merely a means; expanding individual human agency and substantive freedoms is the true end.`
  }
];

