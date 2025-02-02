# Language Teacher Prompter (LT-Prompter)

Language Teacher Prompter (lt-prompter) is a Progressive Web App (PWA) designed to assist language teachers in creating AI-generated prompts for various language learning exercises. The app provides an intuitive interface for building prompts tailored to vocabulary, grammar, listening comprehension, and reading comprehension tasks. By leveraging pre-built, customizable templates, teachers can quickly generate effective learning materials without being experts in AI prompt engineering.

Key Features:

1. **Vocabulary Exercises:**

   - Create exercises such as gap filling, using words in context, matching exercises, multiple-choice questions, and free-answer exercises where students provide example sentences.
   - Teachers can enter their own list of words or let the app suggest relevant words based on a specific topic.

2. **Grammar Exercises:**

   - Generate grammar gap-filling exercises by either uploading an existing exercise (as text, file, or image) or specifying a grammar topic and context.

3. **Listening Comprehension:**

   - Design listening exercises like true/false questions, multiple-choice questions, and gap-filling activities.
   - Teachers can choose to include one or a combination of these exercise types.
   - Upload an audio file or a transcript, and the app will create prompts based on the provided source.

4. **Reading Comprehension:**

   - Develop reading comprehension exercises such as true/false questions with line references, multiple-choice questions, and gap-filling activities.
   - Teachers can upload a text or a text file, and the app will generate appropriate prompts.

5. **Language and CEFR Level Selection:**

   - For every prompt, teachers must select the target language (English, French, Italian, Spanish) and the appropriate CEFR level (A1-C2).
   - The app remembers the last selected language and level for convenience, but these can be easily changed for each new prompt.

6. **Template Management:**

   - Teachers can view, edit, and save prompt templates for frequently used exercise structures.
   - Templates can be customized and reused, saving time in lesson preparation.

7. **User Preferences:**

   - Preferences, such as the last used language and CEFR level, are saved automatically to make the app more efficient for repeated use.

8. **Simple Navigation:**

   - The app features an easy-to-use sidebar menu with options to create new prompts, manage templates, adjust preferences, and access help resources.

9. **Light and Dark Mode:**
   - Users can switch between light and dark themes for comfortable use in different lighting conditions.

The app is hosted on Netlify and designed to be simple, efficient, and user-friendly, with minimal onboarding integrated into the sidebar menu.

## Tech Stack

- Framework: Angular with Angular Material for UI components.
- Storage: IndexedDB for storing user preferences and prompt templates, with potential migration to Supabase for cloud syncing in the future.
- UI: Angular Material for a consistent, responsive design with light and dark mode support.
- Deployment: Netlify for hosting and continuous deployment.
- PWA: Service workers for offline functionality and app-like experience.
