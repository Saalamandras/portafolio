/* ==========================================================================
   i18n.js — functional EN / ES / IT / PT switcher
   Include on every page. Persists the choice in localStorage under
   "site-lang" so it carries across page navigation. Translates any
   element carrying a [data-i18n] key; article body copy is intentionally
   left out of this system (individual posts are authored in one language).
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
      cta_heading: "Want to see what I build?",
      cta_p: "I work on AI systems, NLP tools, and multilingual applications. Take a look at my projects.",
      cta_button: "View Projects",
      projects_heading: "Projects",
      projects_intro: "A selection of AI tools, NLP pipelines, and full-stack applications I have built. Each project reflects a real problem I set out to solve.",
      project_link: "View Project",
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
      cta_heading: "¿Quieres ver lo que construyo?",
      cta_p: "Trabajo en sistemas de IA, herramientas de PLN y aplicaciones multilingües. Echa un vistazo a mis proyectos.",
      cta_button: "Ver Proyectos",
      projects_heading: "Proyectos",
      projects_intro: "Una selección de herramientas de IA, pipelines de PLN y aplicaciones full-stack que he construido. Cada proyecto refleja un problema real que me propuse resolver.",
      project_link: "Ver Proyecto",
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
      cta_heading: "Vuoi vedere cosa costruisco?",
      cta_p: "Lavoro su sistemi IA, strumenti NLP e applicazioni multilingue. Dai un'occhiata ai miei progetti.",
      cta_button: "Vedi i Progetti",
      projects_heading: "Progetti",
      projects_intro: "Una selezione di strumenti IA, pipeline NLP e applicazioni full-stack che ho realizzato. Ogni progetto riflette un problema reale che ho voluto risolvere.",
      project_link: "Vedi il Progetto",
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
      cta_heading: "Quer ver o que eu construo?",
      cta_p: "Trabalho com sistemas de IA, ferramentas de PLN e aplicações multilíngues. Dê uma olhada nos meus projetos.",
      cta_button: "Ver Projetos",
      projects_heading: "Projetos",
      projects_intro: "Uma seleção de ferramentas de IA, pipelines de PLN e aplicações full-stack que já construí. Cada projeto reflete um problema real que me propus a resolver.",
      project_link: "Ver Projeto",
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

  function applyLang(lang) {
    var dict = translations[lang] || translations[DEFAULT_LANG];
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    /* Notify other scripts (e.g. typewriter.js) that translations have been applied */
    document.dispatchEvent(new CustomEvent("i18n:applied", { detail: { lang: lang } }));
  }

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
