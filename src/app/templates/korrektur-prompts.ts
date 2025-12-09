import { Language } from '../models/preferences.model';

export interface KorrekturPromptTemplate {
  intro: string;
}

export type KorrekturPromptTemplates = {
  [key in Language]: KorrekturPromptTemplate;
};

const englishIntro = `Create a static website in your canvas environment where you visualise the language mistakes in the text that I'll provide as a [KORREKTUR_SOURCE_TYPE].

**Visual formatting:**
- Visualise deletions with red text and strikethrough
- Visualise insertions, edits or corrections with green text
- Categorize each error by type: spelling (SP), grammar (GR), vocabulary (VOC), or punctuation (P) - add the abbreviation in superscript after each correction

**Page structure:**
1. Header section with:
   - Editable field for student name
   - Date field (pre-filled with today's date)
   - Display the CEFR level: [CEFR]

2. Legend/Key explaining:
   - Red strikethrough = deletion
   - Green text = correction/insertion
   - Error type abbreviations (SP, GR, VOC, P)

3. Main content area with the corrected text

4. Summary section at the bottom with:
   - Total error count
   - Breakdown by error type (spelling, grammar, vocabulary, punctuation)

**Interactive elements:**
- A print button that triggers window.print()
- A toggle button to switch between "inline corrections" view and "side-by-side" view (original | corrected)

**CSS requirements:**
- Optimized for A4 printing using @media print
- Hide interactive buttons when printing
- Clean, readable typography

**Correction leniency:**
Your strictness in correction depends on the author's CEFR level ([CEFR]):
- At lower levels (A1-A2): Focus only on major errors that affect comprehension
- At intermediate levels (B1-B2): Include grammatical accuracy and vocabulary appropriateness
- At higher levels (C1-C2): Include stylistic suggestions and nuanced language use`;

const frenchIntro = `Créez un site web statique dans votre environnement canvas où vous visualisez les erreurs de langue dans le texte que je fournirai sous forme de [KORREKTUR_SOURCE_TYPE].

**Formatage visuel :**
- Visualisez les suppressions en rouge avec texte barré
- Visualisez les insertions, modifications ou corrections en texte vert
- Catégorisez chaque erreur par type : orthographe (ORTH), grammaire (GR), vocabulaire (VOC), ou ponctuation (P) - ajoutez l'abréviation en exposant après chaque correction

**Structure de la page :**
1. Section d'en-tête avec :
   - Champ modifiable pour le nom de l'élève
   - Champ de date (pré-rempli avec la date du jour)
   - Affichage du niveau CECR : [CEFR]

2. Légende expliquant :
   - Rouge barré = suppression
   - Texte vert = correction/insertion
   - Abréviations des types d'erreurs (ORTH, GR, VOC, P)

3. Zone de contenu principal avec le texte corrigé

4. Section récapitulative en bas avec :
   - Nombre total d'erreurs
   - Répartition par type d'erreur (orthographe, grammaire, vocabulaire, ponctuation)

**Éléments interactifs :**
- Un bouton d'impression qui déclenche window.print()
- Un bouton de basculement pour passer de la vue « corrections intégrées » à la vue « côte à côte » (original | corrigé)

**Exigences CSS :**
- Optimisé pour l'impression A4 avec @media print
- Masquer les boutons interactifs lors de l'impression
- Typographie propre et lisible

**Indulgence de correction :**
Votre rigueur dans la correction dépend du niveau CECR de l'auteur ([CEFR]) :
- Aux niveaux inférieurs (A1-A2) : Concentrez-vous uniquement sur les erreurs majeures affectant la compréhension
- Aux niveaux intermédiaires (B1-B2) : Incluez la précision grammaticale et la pertinence du vocabulaire
- Aux niveaux supérieurs (C1-C2) : Incluez les suggestions stylistiques et l'utilisation nuancée de la langue`;

const spanishIntro = `Crea un sitio web estático en tu entorno canvas donde visualices los errores de idioma en el texto que proporcionaré como [KORREKTUR_SOURCE_TYPE].

**Formato visual:**
- Visualiza las eliminaciones con texto rojo y tachado
- Visualiza las inserciones, ediciones o correcciones con texto verde
- Categoriza cada error por tipo: ortografía (ORT), gramática (GR), vocabulario (VOC), o puntuación (P) - añade la abreviatura en superíndice después de cada corrección

**Estructura de la página:**
1. Sección de encabezado con:
   - Campo editable para el nombre del estudiante
   - Campo de fecha (pre-rellenado con la fecha de hoy)
   - Mostrar el nivel MCER: [CEFR]

2. Leyenda explicando:
   - Rojo tachado = eliminación
   - Texto verde = corrección/inserción
   - Abreviaturas de tipos de error (ORT, GR, VOC, P)

3. Área de contenido principal con el texto corregido

4. Sección de resumen al final con:
   - Recuento total de errores
   - Desglose por tipo de error (ortografía, gramática, vocabulario, puntuación)

**Elementos interactivos:**
- Un botón de impresión que active window.print()
- Un botón de alternancia para cambiar entre vista de "correcciones en línea" y vista "lado a lado" (original | corregido)

**Requisitos de CSS:**
- Optimizado para impresión A4 usando @media print
- Ocultar botones interactivos al imprimir
- Tipografía limpia y legible

**Indulgencia en la corrección:**
Tu rigurosidad en la corrección depende del nivel MCER del autor ([CEFR]):
- En niveles inferiores (A1-A2): Enfócate solo en errores importantes que afecten la comprensión
- En niveles intermedios (B1-B2): Incluye precisión gramatical y adecuación del vocabulario
- En niveles superiores (C1-C2): Incluye sugerencias estilísticas y uso matizado del lenguaje`;

const italianIntro = `Crea un sito web statico nel tuo ambiente canvas dove visualizzi gli errori linguistici nel testo che fornirò come [KORREKTUR_SOURCE_TYPE].

**Formattazione visiva:**
- Visualizza le eliminazioni con testo rosso e barrato
- Visualizza le inserzioni, modifiche o correzioni con testo verde
- Categorizza ogni errore per tipo: ortografia (ORT), grammatica (GR), vocabolario (VOC), o punteggiatura (P) - aggiungi l'abbreviazione in apice dopo ogni correzione

**Struttura della pagina:**
1. Sezione intestazione con:
   - Campo modificabile per il nome dello studente
   - Campo data (precompilato con la data odierna)
   - Visualizzazione del livello QCER: [CEFR]

2. Legenda che spiega:
   - Rosso barrato = eliminazione
   - Testo verde = correzione/inserzione
   - Abbreviazioni dei tipi di errore (ORT, GR, VOC, P)

3. Area contenuto principale con il testo corretto

4. Sezione riepilogativa in fondo con:
   - Conteggio totale degli errori
   - Suddivisione per tipo di errore (ortografia, grammatica, vocabolario, punteggiatura)

**Elementi interattivi:**
- Un pulsante di stampa che attiva window.print()
- Un pulsante di alternanza per passare dalla vista "correzioni in linea" alla vista "affiancata" (originale | corretto)

**Requisiti CSS:**
- Ottimizzato per la stampa A4 usando @media print
- Nascondere i pulsanti interattivi durante la stampa
- Tipografia pulita e leggibile

**Indulgenza nella correzione:**
La tua severità nella correzione dipende dal livello QCER dell'autore ([CEFR]):
- Ai livelli inferiori (A1-A2): Concentrati solo sugli errori importanti che influenzano la comprensione
- Ai livelli intermedi (B1-B2): Includi la precisione grammaticale e l'appropriatezza del vocabolario
- Ai livelli superiori (C1-C2): Includi suggerimenti stilistici e uso sfumato della lingua`;

export const korrekturPromptTemplates: KorrekturPromptTemplates = {
  English: {
    intro: englishIntro,
  },
  français: {
    intro: frenchIntro,
  },
  español: {
    intro: spanishIntro,
  },
  italiano: {
    intro: italianIntro,
  },
};
