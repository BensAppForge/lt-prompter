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
- An "Export as PDF" button that uses html2pdf.js library to export the document
- A toggle button to switch between "inline corrections" view and "side-by-side" view (original | corrected)

**CSS requirements for A4 PDF export:**
- Page dimensions: 210mm × 297mm (A4 format)
- Margins: 20mm on all sides
- Use CSS page-break properties (page-break-before, page-break-after, page-break-inside: avoid) for proper pagination
- Ensure content flows properly across multiple pages if needed
- Hide interactive buttons during PDF export
- Clean, readable typography with appropriate font sizes for print (body: 12pt, headings: 14-18pt)
- Set a max-width container that fits within A4 printable area

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
- Un bouton « Exporter en PDF » utilisant la bibliothèque html2pdf.js pour exporter le document
- Un bouton de basculement pour passer de la vue « corrections intégrées » à la vue « côte à côte » (original | corrigé)

**Exigences CSS pour l'export PDF A4 :**
- Dimensions de page : 210mm × 297mm (format A4)
- Marges : 20mm sur tous les côtés
- Utiliser les propriétés CSS de saut de page (page-break-before, page-break-after, page-break-inside: avoid) pour une pagination correcte
- Assurer que le contenu s'écoule correctement sur plusieurs pages si nécessaire
- Masquer les boutons interactifs lors de l'export PDF
- Typographie propre et lisible avec des tailles de police appropriées pour l'impression (corps : 12pt, titres : 14-18pt)
- Définir un conteneur max-width qui s'adapte à la zone imprimable A4

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
- Un botón "Exportar como PDF" que utiliza la biblioteca html2pdf.js para exportar el documento
- Un botón de alternancia para cambiar entre vista de "correcciones en línea" y vista "lado a lado" (original | corregido)

**Requisitos de CSS para exportación PDF A4:**
- Dimensiones de página: 210mm × 297mm (formato A4)
- Márgenes: 20mm en todos los lados
- Usar propiedades CSS de salto de página (page-break-before, page-break-after, page-break-inside: avoid) para una paginación correcta
- Asegurar que el contenido fluya correctamente en múltiples páginas si es necesario
- Ocultar botones interactivos durante la exportación PDF
- Tipografía limpia y legible con tamaños de fuente apropiados para impresión (cuerpo: 12pt, títulos: 14-18pt)
- Establecer un contenedor max-width que se ajuste al área imprimible A4

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
- Un pulsante "Esporta come PDF" che utilizza la libreria html2pdf.js per esportare il documento
- Un pulsante di alternanza per passare dalla vista "correzioni in linea" alla vista "affiancata" (originale | corretto)

**Requisiti CSS per esportazione PDF A4:**
- Dimensioni pagina: 210mm × 297mm (formato A4)
- Margini: 20mm su tutti i lati
- Utilizzare le proprietà CSS di interruzione pagina (page-break-before, page-break-after, page-break-inside: avoid) per una corretta paginazione
- Assicurare che il contenuto scorra correttamente su più pagine se necessario
- Nascondere i pulsanti interattivi durante l'esportazione PDF
- Tipografia pulita e leggibile con dimensioni dei caratteri appropriate per la stampa (corpo: 12pt, titoli: 14-18pt)
- Impostare un contenitore max-width che si adatti all'area stampabile A4

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
