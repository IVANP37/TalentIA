import { CandidateStatus } from '../types.js';

export const MOCK_JOBS = [
  {
    id: 'job-1',
    title: { en: 'Senior Frontend Engineer', es: 'Ingeniero/a Frontend Senior' },
    department: { en: 'Technology', es: 'Tecnología' },
    location: { en: 'Remote', es: 'Remoto' },
    salary: '$120,000 - $160,000',
    description: {
      en: 'We are looking for an experienced Frontend Engineer to build and maintain our cutting-edge web applications using React and modern web technologies.',
      es: 'Buscamos un/a Ingeniero/a Frontend experimentado/a para construir y mantener nuestras aplicaciones web de vanguardia usando React y tecnologías modernas.'
    },
    requirements: [
      { en: '5+ years of React experience', es: 'Más de 5 años de experiencia en React' },
      { en: 'Expertise in TypeScript', es: 'Dominio de TypeScript' },
      { en: 'Strong understanding of UI/UX principles', es: 'Sólido entendimiento de principios de UI/UX' },
      { en: 'Experience with Tailwind CSS', es: 'Experiencia con Tailwind CSS' }
    ],
    status: 'Abierta',
  },
  {
    id: 'job-2',
    title: { en: 'UX/UI Designer', es: 'Diseñador/a UX/UI' },
    department: { en: 'Design', es: 'Diseño' },
    location: { en: 'Rosario, Santa Fe', es: 'Rosario, Santa Fe' },
    salary: '$90,000 - $110,000',
    description: {
      en: 'Seeking a creative UX/UI designer to create intuitive and visually appealing user interfaces for our product suite.',
      es: 'Buscamos un/a diseñador/a UX/UI creativo/a para crear interfaces de usuario intuitivas y atractivas para nuestra suite de productos.'
    },
    requirements: [
      { en: 'Portfolio of design projects', es: 'Portafolio de proyectos de diseño' },
      { en: 'Proficiency in Figma or Sketch', es: 'Dominio de Figma o Sketch' },
      { en: 'Experience with user research', es: 'Experiencia en investigación de usuarios' },
      { en: 'Strong communication skills', es: 'Excelentes habilidades de comunicación' }
    ],
    status: 'Cerrado',
  },
  {
    id: 'job-3',
    title: { en: 'Product Manager', es: 'Gerente de Producto' },
    department: { en: 'Product', es: 'Producto' },
    location: { en: 'Rosario, Santa Fe', es: 'Rosario, Santa Fe' },
    salary: '$130,000 - $170,000',
    description: {
      en: 'Join our product team to define the future of our platform. You will be responsible for the product planning and execution throughout the Product Lifecycle.',
      es: 'Únete a nuestro equipo de producto para definir el futuro de nuestra plataforma. Serás responsable de la planificación y ejecución del producto durante todo su ciclo de vida.'
    },
    requirements: [
      { en: '3+ years in Product Management', es: 'Más de 3 años en gestión de productos' },
      { en: 'Experience with Agile methodologies', es: 'Experiencia con metodologías ágiles' },
      { en: 'Excellent analytical skills', es: 'Excelentes habilidades analíticas' },
      { en: 'BSc in Computer Science or related field', es: 'Licenciatura en Informática o campo relacionado' }
    ],
    status: 'Abierta',
  },
];

export const MOCK_CANDIDATES = [
  {
    id: 'cand-1',
    jobId: 'job-1',
    status: CandidateStatus.INTERVIEW,
    appliedDate: new Date('2024-07-20T10:00:00Z').toISOString(),
    cvText: {
      en: 'Vanesa Valtorta is a skilled frontend developer with 7 years of experience in React and Vue.',
      es: 'Vanesa Valtorta es una desarrolladora frontend con 7 años de experiencia en React y Vue.'
    },
    parsedData: {
      name: 'Vanesa Valtorta',
      email: 'vanesaval@gmail.com',
      phone: '123-456-7890',
      dni: '34.567.890-V', // DNI añadido
      gender: 'Female', // Género añadido
      summary: {
        en: 'Senior Frontend Engineer with 7 years of experience specializing in React, TypeScript, and performance optimization. Proven track record of leading teams and delivering high-quality, scalable web applications.',
        es: 'Ingeniera Frontend Senior con 7 años de experiencia especializada en React, TypeScript y optimización de rendimiento. Historial comprobado liderando equipos y entregando aplicaciones web escalables y de alta calidad.'
      },
      experience: [
        {
          title: { en: 'Lead Frontend Developer', es: 'Desarrolladora Frontend Líder' },
          company: 'TechCorp',
          duration: { en: '2020-Present', es: '2020-Actualidad' },
          description: {
            en: 'Led development of a major e-commerce platform.',
            es: 'Lideró el desarrollo de una importante plataforma de comercio electrónico.'
          }
        }
      ],
      education: [
        {
          institution: 'State University',
          degree: { en: 'B.S. in Computer Science', es: 'Licenciatura en Ciencias de la Computación' },
          year: '2017'
        }
      ],
      skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Tailwind CSS', 'Webpack'],
    },
    matchAnalysis: {
      score: 92,
      summary: {
        en: 'Excellent fit. Vanesa has extensive experience with the core technologies required for this role and has leadership experience. Her skills align perfectly with the job requirements.',
        es: 'Excelente candidata. Vanesa tiene amplia experiencia con las tecnologías clave requeridas para este puesto y experiencia en liderazgo. Sus habilidades se alinean perfectamente con los requisitos del puesto.'
      },
      strengths: [
        { en: 'Strong React & TypeScript skills', es: 'Sólidas habilidades en React y TypeScript' },
        { en: 'Leadership experience', es: 'Experiencia en liderazgo' },
        { en: 'Familiarity with modern tooling', es: 'Familiaridad con herramientas modernas' }
      ],
      weaknesses: [
        { en: 'No specific mention of mobile development experience.', es: 'No se menciona experiencia específica en desarrollo móvil.' }
      ],
    },
    notes: [
      { en: 'Great technical screening. Strong communicator.', es: 'Gran evaluación técnica. Excelente comunicadora.' },
      { en: 'Scheduled for final round interview.', es: 'Entrevista final programada.' }
    ],
    interviewDate: new Date('2024-08-05T14:00:00Z').toISOString(),
  },
  {
    id: 'cand-2',
    jobId: 'job-1',
    status: CandidateStatus.REVIEWING,
    appliedDate: new Date('2024-07-22T11:30:00Z').toISOString(),
    cvText: {
      en: 'Iñaki Maidagan is a junior developer with 2 years of experience working with React.',
      es: 'Iñaki Maidagan es un desarrollador junior con 2 años de experiencia trabajando con React.'
    },
    parsedData: {
      name: 'Iñaki Maidagan',
      email: 'akimaidagan@gmail.com',
      phone: '234-567-8901',
      dni: '23.456.789-I', // DNI añadido
      gender: 'Male', // Género añadido
      summary: {
        en: 'Enthusiastic frontend developer with 2 years of professional experience using React and Redux. Eager to grow and contribute to a fast-paced team.',
        es: 'Desarrollador frontend entusiasta con 2 años de experiencia profesional usando React y Redux. Deseoso de crecer y contribuir en un equipo dinámico.'
      },
      experience: [
        {
          title: { en: 'Junior Developer', es: 'Desarrollador Junior' },
          company: 'WebStart',
          duration: { en: '2022-Present', es: '2022-Actualidad' },
          description: {
            en: 'Contributed to building client-facing dashboards.',
            es: 'Contribuyó en la construcción de paneles para clientes.'
          }
        }
      ],
      education: [
        {
          institution: 'Community College',
          degree: { en: 'Associate in Web Development', es: 'Técnico en Desarrollo Web' },
          year: '2022'
        }
      ],
      skills: ['React', 'JavaScript', 'Redux', 'CSS', 'HTML'],
    },
    matchAnalysis: {
      score: 65,
      summary: {
        en: 'Potential fit, but lacks the senior-level experience required. Iñaki has a good foundation in React but does not meet the 5+ years requirement. Could be considered for a more junior role.',
        es: 'Candidato potencial, pero le falta la experiencia de nivel senior requerida. Iñaki tiene una buena base en React pero no cumple con el requisito de más de 5 años. Podría considerarse para un puesto más junior.'
      },
      strengths: [
        { en: 'Solid React fundamentals', es: 'Fundamentos sólidos de React' },
        { en: 'Eagerness to learn', es: 'Ganas de aprender' }
      ],
      weaknesses: [
        { en: 'Lacks required years of experience', es: 'Le faltan los años de experiencia requeridos' },
        { en: 'No TypeScript listed', es: 'No menciona TypeScript' },
        { en: 'No leadership experience', es: 'Sin experiencia en liderazgo' }
      ],
    },
    notes: [
      { en: 'Promising but not a fit for the senior role.', es: 'Prometedor pero no encaja para el puesto senior.' }
    ],
    interviewDate: null,
  },
  {
    id: 'cand-3',
    jobId: 'job-2',
    status: CandidateStatus.FINALIST,
    appliedDate: new Date('2024-07-19T09:00:00Z').toISOString(),
    cvText: {
      en: 'Carolina Martinez is a creative UI/UX designer with 4 years of experience.',
      es: 'Carolina Martinez es una creativa diseñadora UX/UI con 4 años de experiencia.'
    },
    parsedData: {
      name: 'Carolina Martinez',
      email: 'carol.m@gmail.com',
      phone: '345-678-9012',
      dni: '45.678.901-C', // DNI añadido
      gender: 'Female', // Género añadido
      summary: {
        en: 'A user-centric UX/UI Designer with 4 years of experience in creating beautiful and functional digital products. Passionate about solving complex problems through design thinking.',
        es: 'Diseñadora UX/UI centrada en el usuario con 4 años de experiencia creando productos digitales bellos y funcionales. Apasionada por resolver problemas complejos mediante el design thinking.'
      },
      experience: [
        {
          title: { en: 'UX/UI Designer', es: 'Diseñadora UX/UI' },
          company: 'DesignCo',
          duration: { en: '2020-Present', es: '2020-Actualidad' },
          description: {
            en: 'Designed mobile and web apps from concept to launch.',
            es: 'Diseñó aplicaciones móviles y web desde el concepto hasta el lanzamiento.'
          }
        }
      ],
      education: [
        {
          institution: 'Design Institute',
          degree: { en: 'BFA in Graphic Design', es: 'Licenciatura en Diseño Gráfico' },
          year: '2020'
        }
      ],
      skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Prototyping', 'Wireframing'],
    },
    matchAnalysis: {
      score: 88,
      summary: {
        en: 'Strong candidate for the UX/UI role. Carolina has a solid portfolio and proficiency in all the required tools. Her experience in user research is a significant plus.',
        es: 'Candidata fuerte para el puesto de UX/UI. Carolina tiene un portafolio sólido y dominio de todas las herramientas requeridas. Su experiencia en investigación de usuarios es un gran plus.'
      },
      strengths: [
        { en: 'Proficient in Figma', es: 'Dominio de Figma' },
        { en: 'Strong portfolio', es: 'Portafolio sólido' },
        { en: 'Experience in user research and prototyping', es: 'Experiencia en investigación de usuarios y prototipado' }
      ],
      weaknesses: [
        { en: 'Slightly less experience than some other candidates, but makes up for it in quality of work.', es: 'Un poco menos de experiencia que otros candidatos, pero lo compensa con la calidad de su trabajo.' }
      ],
    },
    notes: [
      { en: 'Portfolio is impressive.', es: 'El portafolio es impresionante.' },
      { en: 'Positive feedback from the design team.', es: 'Comentarios positivos del equipo de diseño.' }
    ],
    interviewDate: new Date('2024-08-01T10:00:00Z').toISOString(),
  },
  { // Nuevo candidato para Product Manager
    id: 'cand-4',
    jobId: 'job-3',
    status: CandidateStatus.APPLIED,
    appliedDate: new Date('2024-07-23T15:00:00Z').toISOString(),
    cvText: {
      en: 'Juan Perez is a product manager with 6 years of experience in SaaS products.',
      es: 'Juan Pérez es un gerente de producto con 6 años de experiencia en productos SaaS.'
    },
    parsedData: {
      name: 'Juan Pérez García',
      email: 'juan.perez@email.com',
      phone: '+34 612 345 678',
      dni: '12.345.678-A', // DNI añadido
      gender: 'Male', // Género añadido
      summary: {
        en: 'Product Manager with 6 years of experience in the full product lifecycle, from ideation to launch and optimization. Proven ability to translate customer needs into clear product requirements and lead cross-functional teams.',
        es: 'Gerente de Producto con 6 años de experiencia en el ciclo de vida completo del producto, desde la ideación hasta el lanzamiento y la optimización. Habilidad demostrada para traducir las necesidades del cliente en requisitos de producto claros y liderar equipos multifuncionales.'
      },
      experience: [
        {
          title: { en: 'Senior Product Manager', es: 'Gerente de Producto Senior' },
          company: 'Tech Solutions S.L.',
          duration: { en: '2022-Present', es: '2022-Actualidad' },
          description: {
            en: 'Led product strategy for SaaS platform, increasing retention by 25%.',
            es: 'Lideró la estrategia de producto para plataforma SaaS, aumentando la retención en un 25%.'
          }
        }
      ],
      education: [
        {
          institution: 'Business School',
          degree: { en: 'MBA', es: 'MBA' },
          year: '2018'
        }
      ],
      skills: ['Product Strategy', 'Roadmapping', 'Agile', 'Jira', 'Figma', 'Analytics'],
    },
    matchAnalysis: {
      score: 95,
      summary: {
        en: 'Outstanding candidate for Product Manager. Juan’s extensive experience in SaaS products and leadership skills make him an ideal fit. His strong analytical background is a significant asset.',
        es: 'Candidato sobresaliente para Gerente de Producto. La amplia experiencia de Juan en productos SaaS y sus habilidades de liderazgo lo convierten en un candidato ideal. Su sólida formación analítica es un activo importante.'
      },
      strengths: [
        { en: 'Extensive SaaS product experience', es: 'Amplia experiencia en productos SaaS' },
        { en: 'Strong leadership and strategic thinking', es: 'Fuerte liderazgo y pensamiento estratégico' },
        { en: 'Proficiency in product management tools', es: 'Dominio de herramientas de gestión de producto' }
      ],
      weaknesses: [
        { en: 'No specific mention of mobile app product management.', es: 'No se menciona gestión de productos de aplicaciones móviles específicamente.' }
      ],
    },
    notes: [],
    interviewDate: null,
  },
  { // Segundo nuevo candidato para Product Manager
    id: 'cand-5',
    jobId: 'job-3',
    status: CandidateStatus.REVIEWING,
    appliedDate: new Date('2024-07-24T09:30:00Z').toISOString(),
    cvText: {
      en: 'Carlos Gomez is a product professional with 7 years of experience in B2B solutions.',
      es: 'Carlos Gómez es un profesional de producto con 7 años de experiencia en soluciones B2B.'
    },
    parsedData: {
      name: 'Carlos Alberto Gómez Ruiz',
      email: 'carlos.gomez@email.com',
      phone: '+34 600 987 654',
      dni: '98.765.432-B', // DNI añadido
      gender: 'Male', // Género añadido
      summary: {
        en: 'Product professional with 7 years of experience in developing and launching digital products, specializing in B2B solutions and data platforms. Expert in defining product vision and managing backlogs.',
        es: 'Profesional de producto con 7 años de experiencia en el desarrollo y lanzamiento de productos digitales, especializándose en soluciones B2B y plataformas de datos. Experto en la definición de visión de producto y gestión de backlogs.'
      },
      experience: [
        {
          title: { en: 'Product Director', es: 'Director de Producto' },
          company: 'Data Solutions Corp.',
          duration: { en: '2021-Present', es: '2021-Actualidad' },
          description: {
            en: 'Defined product strategy for B2B data analytics suite, achieving 30% growth.',
            es: 'Definió la estrategia de producto para suite de análisis de datos B2B, logrando un crecimiento del 30%.'
          }
        }
      ],
      education: [
        {
          institution: 'EOI Business School',
          degree: { en: 'Master in Big Data & Business Analytics', es: 'Máster en Big Data & Business Analytics' },
          year: '2017'
        }
      ],
      skills: ['Product Strategy', 'B2B SaaS', 'Data Platforms', 'Agile', 'Jira', 'Tableau'],
    },
    matchAnalysis: {
      score: 90,
      summary: {
        en: 'Highly skilled Product Manager with strong background in B2B and data products. Carlos’s experience in leading product strategy and managing teams is a great asset. His data analytics background is a plus.',
        es: 'Gerente de Producto altamente cualificado con sólida experiencia en productos B2B y de datos. La experiencia de Carlos liderando la estrategia de producto y gestionando equipos es un gran activo. Su formación en análisis de datos es un plus.'
      },
      strengths: [
        { en: 'Expertise in B2B and data products', es: 'Experiencia en productos B2B y de datos' },
        { en: 'Experience leading product strategy', es: 'Experiencia liderando estrategia de producto' },
        { en: 'Strong analytical background', es: 'Sólida formación analítica' }
      ],
      weaknesses: [
        { en: 'Less direct experience with consumer-facing products.', es: 'Menos experiencia directa con productos orientados al consumidor.' }
      ],
    },
    notes: [],
    interviewDate: null,
  },
];
