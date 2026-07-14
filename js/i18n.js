/* ==========================================================================
   i18n.js — functional EN / ES / IT / PT switcher
   Include on every page. Persists the choice in localStorage under
   "site-lang" so it carries across page navigation. Translates any
   element carrying a [data-i18n] key.

   Per-page translations (e.g. article body copy) can be registered at
   runtime via window.i18nRegister(extraDict). The extraDict format is
   identical to the built-in translations object:
     { en: { key: "value" }, es: { key: "valor" }, ... }
   After registering, call window.i18nApply() to re-render.
   ========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "site-lang";
  var DEFAULT_LANG = "en";

  var translations = {
    en: {
      nav_home: "Home",
      nav_projects: "Projects",
      nav_articles: "Articles",
      nav_contact: "Contact",
      hero_title: "AI & NLP Engineer",
      hero_subtitle: "Prompt Engineer · Computational Linguist · Multilingual AI Developer",
      hero_location: "Based in Venice, Italy",
      hero_cta: "See My Projects",
      about_heading: "About Me",
      about_p1: "Prompt Engineer and NLP specialist with hands-on experience at TELUS International and Appen, combined with an MSc in Computational Linguistics (LLM track) at Ca' Foscari University, Venice. Fluent in four languages and skilled across the full AI/NLP stack — from model fine-tuning and prompt optimization to multilingual content strategy and LLM deployment.",
      about_p2: "I bring a rare combination of technical depth, linguistic expertise, instructional design, and domain knowledge in hospitality technology. Equally comfortable building and evaluating AI systems as writing the documentation, curriculum, or content that surrounds them.",
      skills_heading: "Core Competencies",
      skill_cat1: "AI & NLP Engineering",
      skill_cat2: "Language & Content",
      skill_cat3: "Domain & Tools",
      exp_heading: "Experience",
      exp_label: "EXPERIENCE",
      exp_hotel_role: "Front Desk & Hospitality Systems",
      exp_hotel_desc: "<ul><li>Operated Oracle OPERA PMS and OPERA Cloud daily for reservations, rate and availability management, and guest profiles — processing bookings from direct, GDS and OTA channels.</li><li>Played a hands-on role in the property's legacy-to-cloud PMS migration: configured system settings, mapped and reconciled reservation data between platforms, built Excel trackers to monitor transfer progress, and authored go-live documentation.</li><li>Monitored reservation and availability flows to catch discrepancies early and help prevent overbooking and rate misalignment across channels.</li><li>Acted as multilingual point of contact (IT/EN/ES/PT) for guests and partners, handling escalations and time-sensitive requests.</li><li>Trained new front-desk staff on systems, workflows and service protocols.</li></ul>",
      exp_dev4side_role: "Web Content Specialist",
      exp_dev4side_desc: "<ul><li>Automated content publishing and performance tracking via CMS and analytics API integrations, gaining hands-on exposure to REST API workflows.</li></ul>",
      exp_cafoscari_role: "Language Specialist / Web Translator",
      exp_cafoscari_desc: "<ul><li>Post-edited machine-translated institutional content across EN/ES/IT, systematically validating and correcting AI-generated output for accuracy, terminology, and contextual fit.</li><li>Maintained terminological consistency across academic and administrative domains — a discipline directly relevant to prompt engineering and multilingual output quality control.</li></ul>",
      exp_appen_role: "Prompt Engineer / AI Language Consultant",
      exp_appen_desc: "<ul><li>Designed and evaluated multilingual (EN/ES/IT) training datasets and prompt structures, building an early foundation in structured prompt engineering across languages.</li><li>Delivered structured feedback loops to improve model coherence and factual accuracy — the same evaluation discipline used to validate RAG and agentic system outputs.</li></ul>",
      exp_telus_role: "Prompt Engineer",
      exp_telus_desc: "<ul><li>Designed, tested, and iteratively refined prompt structures across multiple language models to improve output accuracy and relevance — directly applicable to prompt engineering and output validation for enterprise GenAI systems.</li><li>Collaborated with cross-functional ML and engineering teams on NLP pipeline development, gaining early exposure to production data workflows comparable to RAG data preparation and platform integration.</li><li>Owned data preprocessing and quality control, foundational to the testing/validation discipline required for reliable AI outputs.</li></ul>",
      exp_nubank_role: "Creative Copy / UX Writer & Instructional Designer",
      exp_nubank_desc: "<ul><li>Produced UX copy, marketing campaigns and learning content at scale for a leading fintech and media brands.</li><li>Built e-learning and revenue enablement programmes at Infosys.</li></ul>",
      cta_heading: "Want to see what I build?",
      cta_p: "I work on AI systems, NLP tools, and multilingual applications. Take a look at my projects.",
      cta_button: "View Projects",
      projects_heading: "Projects",
      projects_intro: "A selection of AI tools, NLP pipelines, and full-stack applications I have built. Each project reflects a real problem I set out to solve.",
      project_link: "View Project →",
      articles_heading: "Articles",
      articles_intro: "Writing on AI, NLP, prompt engineering, and multilingual language technology — what I am learning, building, and thinking about.",
      articles_empty_title: "No entries yet",
      articles_empty_body: "New articles will appear here as they're published.",
      contact_heading: "Get in Touch",
      contact_intro: "I'm open to AI/NLP engineering, full-stack, and hospitality-tech roles — remote or in the Veneto region. Reach out via the form below or connect with me directly.",
      label_name: "Name",
      label_email: "Email",
      label_subject: "Subject",
      label_message: "Message",
      submit_button: "Send Message",
      contact_links_heading: "Or reach me directly",
      footer_location: "Mestre (VE), Italy"
    },
    es: {
      nav_home: "Inicio",
      nav_projects: "Proyectos",
      nav_articles: "Artículos",
      nav_contact: "Contacto",
      hero_title: "Ingeniero de IA y PLN",
      hero_subtitle: "Ingeniero de Prompts · Lingüista Computacional · Desarrollador de IA Multilingüe",
      hero_location: "Con base en Venecia, Italia",
      hero_cta: "Ver Mis Proyectos",
      about_heading: "Sobre Mí",
      about_p1: "Ingeniero de prompts y especialista en PLN con experiencia práctica en TELUS International y Appen, combinada con un Máster en Lingüística Computacional (especialización en LLM) en la Universidad Ca' Foscari de Venecia. Hablo cuatro idiomas con fluidez y domino toda la pila de IA/PLN — desde el ajuste fino de modelos y la optimización de prompts hasta la estrategia de contenido multilingüe y el despliegue de LLMs.",
      about_p2: "Aporto una combinación poco común de profundidad técnica, experiencia lingüística, diseño instruccional y conocimiento del sector de la tecnología hotelera. Me siento igual de cómodo construyendo y evaluando sistemas de IA que redactando la documentación, el currículo o el contenido que los acompaña.",
      skills_heading: "Competencias Clave",
      skill_cat1: "Ingeniería de IA y PLN",
      skill_cat2: "Idioma y Contenido",
      skill_cat3: "Dominio y Herramientas",
      exp_heading: "Experiencia",
      exp_label: "EXPERIENCIA",
      exp_hotel_role: "Recepción y Sistemas de Hospitalidad",
      exp_hotel_desc: "<ul><li>Operé Oracle OPERA PMS y OPERA Cloud a diario para la gestión de reservas, tarifas, disponibilidad y perfiles de huéspedes — procesando reservas procedentes de canales directos, GDS y OTA.</li><li>Participé activamente en la migración del PMS legacy a la nube: configuré ajustes del sistema, mapeé y concilié datos de reservas entre plataformas, construí trackers en Excel para monitorear el progreso de la transferencia y redacté documentación de puesta en marcha.</li><li>Supervisé los flujos de reservas y disponibilidad para detectar discrepancias a tiempo y ayudar a prevenir overbooking y desajustes tarifarios entre canales.</li><li>Actué como punto de contacto multilingüe (IT/EN/ES/PT) para huéspedes y socios, gestionando escalaciones y solicitudes urgentes.</li><li>Formé al nuevo personal de recepción en sistemas, flujos de trabajo y protocolos de servicio.</li></ul>",
      exp_dev4side_role: "Especialista en Contenido Web",
      exp_dev4side_desc: "<ul><li>Automaticé la publicación de contenido y el seguimiento de rendimiento mediante integraciones con CMS y APIs de analítica, adquiriendo experiencia práctica en flujos de trabajo con APIs REST.</li></ul>",
      exp_cafoscari_role: "Especialista Lingüístico / Traductor Web",
      exp_cafoscari_desc: "<ul><li>Post-edité contenido institucional traducido automáticamente en EN/ES/IT, validando y corrigiendo sistemáticamente los resultados generados por IA en cuanto a precisión, terminología y adecuación contextual.</li><li>Mantuve la consistencia terminológica en dominios académicos y administrativos — una disciplina directamente relevante para la ingeniería de prompts y el control de calidad de resultados multilingües.</li></ul>",
      exp_appen_role: "Ingeniero de Prompts / Consultor Lingüístico de IA",
      exp_appen_desc: "<ul><li>Diseñé y evalué datasets de entrenamiento multilingüe (EN/ES/IT) y estructuras de prompts, construyendo una base temprana en ingeniería de prompts estructurada en varios idiomas.</li><li>Implementé ciclos de retroalimentación estructurada para mejorar la coherencia y precisión factual de los modelos — la misma disciplina de evaluación utilizada para validar resultados de sistemas RAG y agénticos.</li></ul>",
      exp_telus_role: "Ingeniero de Prompts",
      exp_telus_desc: "<ul><li>Diseñé, probé y refiné iterativamente estructuras de prompts en múltiples modelos de lenguaje para mejorar la precisión y relevancia de los resultados — directamente aplicable a la ingeniería de prompts y validación de salidas en sistemas GenAI empresariales.</li><li>Colaboré con equipos multifuncionales de ML e ingeniería en el desarrollo de pipelines de PLN, adquiriendo experiencia temprana en flujos de datos de producción comparables a la preparación de datos RAG e integración de plataformas.</li><li>Responsable del preprocesamiento de datos y control de calidad, base fundamental de la disciplina de pruebas y validación requerida para resultados de IA fiables.</li></ul>",
      exp_nubank_role: "Redactor Creativo / UX Writer y Diseñador Instruccional",
      exp_nubank_desc: "<ul><li>Produje copy de UX, campañas de marketing y contenido de aprendizaje a escala para una fintech líder y marcas de medios.</li><li>Construí programas de e-learning y habilitación de ingresos en Infosys.</li></ul>",
      cta_heading: "¿Quieres ver lo que construyo?",
      cta_p: "Trabajo en sistemas de IA, herramientas de PLN y aplicaciones multilingües. Echa un vistazo a mis proyectos.",
      cta_button: "Ver Proyectos",
      projects_heading: "Proyectos",
      projects_intro: "Una selección de herramientas de IA, pipelines de PLN y aplicaciones full-stack que he construido. Cada proyecto refleja un problema real que me propuse resolver.",
      project_link: "Ver Proyecto →",
      articles_heading: "Artículos",
      articles_intro: "Escritos sobre IA, PLN, ingeniería de prompts y tecnología del lenguaje multilingüe — lo que estoy aprendiendo, construyendo y pensando.",
      articles_empty_title: "Aún no hay entradas",
      articles_empty_body: "Los nuevos artículos aparecerán aquí a medida que se publiquen.",
      contact_heading: "Ponte en Contacto",
      contact_intro: "Estoy abierto a roles de ingeniería de IA/PLN, full-stack y tecnología hotelera — remoto o en la región del Véneto. Escríbeme mediante el formulario o contáctame directamente.",
      label_name: "Nombre",
      label_email: "Correo Electrónico",
      label_subject: "Asunto",
      label_message: "Mensaje",
      submit_button: "Enviar Mensaje",
      contact_links_heading: "O contáctame directamente",
      footer_location: "Mestre (VE), Italia"
    },
    it: {
      nav_home: "Home",
      nav_projects: "Progetti",
      nav_articles: "Articoli",
      nav_contact: "Contatti",
      hero_title: "Ingegnere IA e NLP",
      hero_subtitle: "Prompt Engineer · Linguista Computazionale · Sviluppatore IA Multilingue",
      hero_location: "Con base a Venezia, Italia",
      hero_cta: "Guarda i Miei Progetti",
      about_heading: "Chi Sono",
      about_p1: "Prompt Engineer e specialista NLP con esperienza pratica presso TELUS International e Appen, unita a un Master in Linguistica Computazionale (indirizzo LLM) all'Università Ca' Foscari di Venezia. Parlo fluentemente quattro lingue e padroneggio l'intero stack IA/NLP — dal fine-tuning dei modelli e l'ottimizzazione dei prompt alla strategia di contenuti multilingue e al deployment di LLM.",
      about_p2: "Porto una combinazione rara di profondità tecnica, competenza linguistica, progettazione didattica e conoscenza del settore dell'ospitalità. Mi trovo a mio agio sia nel costruire e valutare sistemi IA sia nello scrivere la documentazione, i contenuti formativi o i testi che li accompagnano.",
      skills_heading: "Competenze Principali",
      skill_cat1: "Ingegneria IA e NLP",
      skill_cat2: "Lingua e Contenuti",
      skill_cat3: "Dominio e Strumenti",
      exp_heading: "Esperienza",
      exp_label: "ESPERIENZA",
      exp_hotel_role: "Reception e Sistemi di Ospitalità",
      exp_hotel_desc: "<ul><li>Ho operato quotidianamente con Oracle OPERA PMS e OPERA Cloud per la gestione di prenotazioni, tariffe, disponibilità e profili ospiti — elaborando prenotazioni provenienti da canali diretti, GDS e OTA.</li><li>Ho partecipato attivamente alla migrazione del PMS legacy al cloud: configurazione delle impostazioni di sistema, mappatura e riconciliazione dei dati di prenotazione tra piattaforme, creazione di tracker Excel per monitorare l'avanzamento del trasferimento e redazione della documentazione di go-live.</li><li>Ho monitorato i flussi di prenotazione e disponibilità per individuare tempestivamente le discrepanze e prevenire overbooking e disallineamenti tariffari tra i canali.</li><li>Ho agito come punto di contatto multilingue (IT/EN/ES/PT) per ospiti e partner, gestendo escalation e richieste urgenti.</li><li>Ho formato il nuovo personale di reception su sistemi, flussi di lavoro e protocolli di servizio.</li></ul>",
      exp_dev4side_role: "Specialista Contenuti Web",
      exp_dev4side_desc: "<ul><li>Ho automatizzato la pubblicazione di contenuti e il monitoraggio delle performance tramite integrazioni con CMS e API di analisi, acquisendo esperienza pratica nei flussi di lavoro con API REST.</li></ul>",
      exp_cafoscari_role: "Specialista Linguistico / Traduttore Web",
      exp_cafoscari_desc: "<ul><li>Ho post-editato contenuti istituzionali tradotti automaticamente in EN/ES/IT, validando e correggendo sistematicamente gli output generati dall'IA per accuratezza, terminologia e adeguatezza contestuale.</li><li>Ho mantenuto la coerenza terminologica nei domini accademico e amministrativo — una disciplina direttamente rilevante per l'ingegneria dei prompt e il controllo qualità degli output multilingue.</li></ul>",
      exp_appen_role: "Prompt Engineer / Consulente Linguistico IA",
      exp_appen_desc: "<ul><li>Ho progettato e valutato dataset di addestramento multilingue (EN/ES/IT) e strutture di prompt, costruendo una base solida nell'ingegneria strutturata dei prompt in più lingue.</li><li>Ho implementato cicli di feedback strutturato per migliorare la coerenza e l'accuratezza fattuale dei modelli — la stessa disciplina di valutazione utilizzata per validare output di sistemi RAG e agentici.</li></ul>",
      exp_telus_role: "Prompt Engineer",
      exp_telus_desc: "<ul><li>Ho progettato, testato e perfezionato iterativamente strutture di prompt su più modelli linguistici per migliorare accuratezza e pertinenza degli output — direttamente applicabile all'ingegneria dei prompt e alla validazione degli output per sistemi GenAI enterprise.</li><li>Ho collaborato con team interfunzionali di ML e ingegneria nello sviluppo di pipeline NLP, acquisendo un'esposizione precoce a flussi di dati di produzione paragonabili alla preparazione dati RAG e all'integrazione di piattaforme.</li><li>Responsabile del preprocessing dei dati e del controllo qualità, fondamentali per la disciplina di testing e validazione richiesta per output IA affidabili.</li></ul>",
      exp_nubank_role: "Copywriter Creativo / UX Writer e Instructional Designer",
      exp_nubank_desc: "<ul><li>Ho prodotto copy UX, campagne di marketing e contenuti formativi su larga scala per una fintech leader e brand media.</li><li>Ho costruito programmi di e-learning e abilitazione commerciale presso Infosys.</li></ul>",
      cta_heading: "Vuoi vedere cosa costruisco?",
      cta_p: "Lavoro su sistemi IA, strumenti NLP e applicazioni multilingue. Dai un'occhiata ai miei progetti.",
      cta_button: "Vedi i Progetti",
      projects_heading: "Progetti",
      projects_intro: "Una selezione di strumenti IA, pipeline NLP e applicazioni full-stack che ho realizzato. Ogni progetto riflette un problema reale che ho voluto risolvere.",
      project_link: "Vedi il Progetto →",
      articles_heading: "Articoli",
      articles_intro: "Scritti su IA, NLP, prompt engineering e tecnologia del linguaggio multilingue — ciò che sto imparando, costruendo e su cui rifletto.",
      articles_empty_title: "Nessun articolo ancora",
      articles_empty_body: "I nuovi articoli appariranno qui non appena pubblicati.",
      contact_heading: "Mettiti in Contatto",
      contact_intro: "Sono aperto a ruoli di ingegneria IA/NLP, full-stack e tecnologia dell'ospitalità — da remoto o nella regione Veneto. Scrivimi tramite il modulo qui sotto o contattami direttamente.",
      label_name: "Nome",
      label_email: "Email",
      label_subject: "Oggetto",
      label_message: "Messaggio",
      submit_button: "Invia Messaggio",
      contact_links_heading: "Oppure contattami direttamente",
      footer_location: "Mestre (VE), Italia"
    },
    pt: {
      nav_home: "Início",
      nav_projects: "Projetos",
      nav_articles: "Artigos",
      nav_contact: "Contato",
      hero_title: "Engenheiro de IA e PLN",
      hero_subtitle: "Engenheiro de Prompts · Linguista Computacional · Desenvolvedor de IA Multilíngue",
      hero_location: "Baseado em Veneza, Itália",
      hero_cta: "Ver Meus Projetos",
      about_heading: "Sobre Mim",
      about_p1: "Engenheiro de prompts e especialista em PLN com experiência prática na TELUS International e na Appen, aliada a um Mestrado em Linguística Computacional (área de LLM) na Universidade Ca' Foscari de Veneza. Fluente em quatro idiomas e capacitado em toda a stack de IA/PLN — do ajuste fino de modelos e otimização de prompts à estratégia de conteúdo multilíngue e implantação de LLMs.",
      about_p2: "Trago uma combinação rara de profundidade técnica, experiência linguística, design instrucional e conhecimento do setor de tecnologia hoteleira. Sinto-me igualmente à vontade construindo e avaliando sistemas de IA como escrevendo a documentação, o currículo ou o conteúdo que os acompanha.",
      skills_heading: "Competências Essenciais",
      skill_cat1: "Engenharia de IA e PLN",
      skill_cat2: "Idioma e Conteúdo",
      skill_cat3: "Domínio e Ferramentas",
      exp_heading: "Experiência",
      exp_label: "EXPERIÊNCIA",
      exp_hotel_role: "Recepção e Sistemas de Hospitalidade",
      exp_hotel_desc: "<ul><li>Operei Oracle OPERA PMS e OPERA Cloud diariamente para gestão de reservas, tarifas, disponibilidade e perfis de hóspedes — processando reservas provenientes de canais diretos, GDS e OTA.</li><li>Participei ativamente na migração do PMS legado para a nuvem: configurei definições do sistema, mapeei e reconciliei dados de reservas entre plataformas, criei trackers em Excel para monitorar o progresso da transferência e redigi documentação de go-live.</li><li>Monitorei os fluxos de reservas e disponibilidade para detectar discrepâncias precocemente e ajudar a prevenir overbooking e desalinhamentos tarifários entre canais.</li><li>Atuei como ponto de contato multilíngue (IT/EN/ES/PT) para hóspedes e parceiros, lidando com escalações e solicitações urgentes.</li><li>Treinei novos funcionários da recepção em sistemas, fluxos de trabalho e protocolos de serviço.</li></ul>",
      exp_dev4side_role: "Especialista em Conteúdo Web",
      exp_dev4side_desc: "<ul><li>Automatizei a publicação de conteúdo e o acompanhamento de desempenho via integrações com CMS e APIs de análise, adquirindo experiência prática em fluxos de trabalho com APIs REST.</li></ul>",
      exp_cafoscari_role: "Especialista Linguístico / Tradutor Web",
      exp_cafoscari_desc: "<ul><li>Pós-editei conteúdo institucional traduzido automaticamente em EN/ES/IT, validando e corrigindo sistematicamente os resultados gerados por IA quanto à precisão, terminologia e adequação contextual.</li><li>Mantive a consistência terminológica em domínios acadêmicos e administrativos — uma disciplina diretamente relevante para a engenharia de prompts e o controle de qualidade de resultados multilíngues.</li></ul>",
      exp_appen_role: "Engenheiro de Prompts / Consultor Linguístico de IA",
      exp_appen_desc: "<ul><li>Projetei e avaliei datasets de treinamento multilíngue (EN/ES/IT) e estruturas de prompts, construindo uma base sólida em engenharia de prompts estruturada em vários idiomas.</li><li>Implementei ciclos de feedback estruturado para melhorar a coerência e precisão factual dos modelos — a mesma disciplina de avaliação utilizada para validar saídas de sistemas RAG e agênticos.</li></ul>",
      exp_telus_role: "Engenheiro de Prompts",
      exp_telus_desc: "<ul><li>Projetei, testei e refinei iterativamente estruturas de prompts em múltiplos modelos de linguagem para melhorar a precisão e relevância dos resultados — diretamente aplicável à engenharia de prompts e validação de saídas em sistemas GenAI empresariais.</li><li>Colaborei com equipes multifuncionais de ML e engenharia no desenvolvimento de pipelines de PLN, adquirindo exposição precoce a fluxos de dados de produção comparáveis à preparação de dados RAG e integração de plataformas.</li><li>Responsável pelo pré-processamento de dados e controle de qualidade, base fundamental da disciplina de testes e validação necessária para resultados de IA confiáveis.</li></ul>",
      exp_nubank_role: "Redator Criativo / UX Writer e Designer Instrucional",
      exp_nubank_desc: "<ul><li>Produzi copy de UX, campanhas de marketing e conteúdo de aprendizagem em escala para uma fintech líder e marcas de mídia.</li><li>Construí programas de e-learning e capacitação comercial na Infosys.</li></ul>",
      cta_heading: "Quer ver o que eu construo?",
      cta_p: "Trabalho com sistemas de IA, ferramentas de PLN e aplicações multilíngues. Dê uma olhada nos meus projetos.",
      cta_button: "Ver Projetos",
      projects_heading: "Projetos",
      projects_intro: "Uma seleção de ferramentas de IA, pipelines de PLN e aplicações full-stack que já construí. Cada projeto reflete um problema real que me propus a resolver.",
      project_link: "Ver Projeto →",
      articles_heading: "Artigos",
      articles_intro: "Textos sobre IA, PLN, engenharia de prompts e tecnologia de linguagem multilíngue — o que estou aprendendo, construindo e pensando.",
      articles_empty_title: "Ainda sem publicações",
      articles_empty_body: "Novos artigos aparecerão aqui assim que forem publicados.",
      contact_heading: "Entre em Contato",
      contact_intro: "Estou aberto a vagas de engenharia de IA/PLN, full-stack e tecnologia hoteleira — remoto ou na região do Vêneto. Fale comigo pelo formulário abaixo ou entre em contato diretamente.",
      label_name: "Nome",
      label_email: "E-mail",
      label_subject: "Assunto",
      label_message: "Mensagem",
      submit_button: "Enviar Mensagem",
      contact_links_heading: "Ou fale comigo diretamente",
      footer_location: "Mestre (VE), Itália"
    }
  };

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  /* Per-page extra translations (merged on top of the built-in dict) */
  var extras = { en: {}, es: {}, it: {}, pt: {} };

  function applyLang(lang) {
    var base = translations[lang] || translations[DEFAULT_LANG];
    var extra = extras[lang] || {};
    /* Merge: per-page keys override built-in keys */
    var dict = Object.assign({}, base, extra);

    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] != null) {
        /* Support HTML content (e.g. <code> inside paragraphs) */
        if (dict[key].indexOf("<") !== -1) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    /* Notify other scripts (e.g. typewriter.js) that translations have been applied */
    document.dispatchEvent(new CustomEvent("i18n:applied", { detail: { lang: lang } }));
  }

  /* Public API: register extra translations from article pages */
  window.i18nRegister = function (extraDict) {
    ["en", "es", "it", "pt"].forEach(function (lang) {
      if (extraDict[lang]) {
        Object.assign(extras[lang], extraDict[lang]);
      }
    });
  };

  /* Public API: re-apply current language (call after i18nRegister) */
  window.i18nApply = function () {
    applyLang(getLang());
  };

  document.addEventListener("DOMContentLoaded", function () {
    var current = getLang();
    applyLang(current);

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang");
        setLang(lang);
        applyLang(lang);
      });
    });
  });
})();
