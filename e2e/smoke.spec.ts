import { test, expect, Page } from '@playwright/test';

/**
 * Smoke suite: drives every exercise editor end-to-end and guards the
 * invariants that have broken before (leftover [PLACEHOLDER] tokens,
 * library save/restore, validation messages).
 */

async function selectMat(page: Page, control: string, option: string) {
  await page.click(`mat-select[formcontrolname="${control}"]`);
  await page.getByRole('option', { name: option, exact: true }).click();
  await page.waitForTimeout(250);
}

async function generatedPrompt(page: Page): Promise<string> {
  await page.getByRole('button', { name: 'Prompt generieren' }).click();
  await page.waitForSelector('.prompt-container pre');
  await page.waitForTimeout(400);
  return page.locator('.prompt-container pre').innerText();
}

/** No template placeholder like [CEFR] or [TARGET_LANGUAGE] may survive. */
function expectNoPlaceholders(prompt: string) {
  expect(prompt).not.toMatch(/\[[A-Z_]{3,}\]/);
}

test('vocabulary: generate (manual mode) without leftover placeholders', async ({ page }) => {
  await page.goto('/vocabulary');
  await selectMat(page, 'targetLanguage', 'English');
  await selectMat(page, 'cefr', 'B1');
  const chipInput = page.locator('mat-chip-grid input').first();
  for (const word of ['house', 'garden', 'tree']) {
    await chipInput.fill(word);
    await chipInput.press('Enter');
  }
  await page.locator('mat-checkbox').nth(0).click();
  await page.locator('mat-checkbox').nth(1).click();
  const prompt = await generatedPrompt(page);
  expectNoPlaceholders(prompt);
  expect(prompt).toContain('house, garden, tree');
});

test('vocabulary: pasted word list splits into chips', async ({ page }) => {
  await page.goto('/vocabulary');
  await page.locator('mat-chip-grid input').first().focus();
  await page.evaluate(() => {
    const input = document.querySelector('mat-chip-grid input')!;
    const dt = new DataTransfer();
    dt.setData('text/plain', 'one, two; three\nfour');
    input.dispatchEvent(
      new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })
    );
  });
  await expect(page.locator('mat-chip-row')).toHaveCount(4);
});

test('grammar: generate with exact instances count', async ({ page }) => {
  await page.goto('/grammar');
  await selectMat(page, 'targetLanguage', 'English');
  await selectMat(page, 'cefr', 'B2');
  const phen = page.locator('input[aria-label="Grammatisches Phänomen eingeben"]');
  await phen.fill('past tense');
  await phen.press('Enter');
  await expect(page.locator('.phenomenon-item')).toHaveCount(1);
  await page.locator('.item-count-section mat-slide-toggle').click();
  const prompt = await generatedPrompt(page);
  expectNoPlaceholders(prompt);
  expect(prompt).toContain('Include exactly 3 instances of each grammatical phenomenon.');
});

test('comprehension: min-2 validation, counts in prompt', async ({ page }) => {
  await page.goto('/comprehension');
  await selectMat(page, 'targetLanguage', 'English');
  await selectMat(page, 'cefr', 'A2');
  await page.locator('mat-checkbox').nth(0).click();
  await expect(page.locator('mat-error.exercise-type-error')).toBeVisible();
  await page.locator('mat-checkbox').nth(1).click();
  await expect(page.locator('mat-error.exercise-type-error')).toHaveCount(0);
  await selectMat(page, 'sourceType', 'Kopierter Text');
  await page.locator('.item-count-section mat-slide-toggle').click();
  const prompt = await generatedPrompt(page);
  expectNoPlaceholders(prompt);
  expect(prompt).toContain('Include exactly 4 statements.');
  expect(prompt).toContain('Include exactly 4 questions.');
});

test('clone: item-count override replaces same-length rule', async ({ page }) => {
  await page.goto('/clone');
  await selectMat(page, 'targetLanguage', 'Français');
  await selectMat(page, 'cefr', 'A2');
  await selectMat(page, 'sourceType', 'PDF');
  await page.locator('input[formcontrolname="itemCount"]').fill('8');
  const prompt = await generatedPrompt(page);
  expectNoPlaceholders(prompt);
  expect(prompt).toContain('exactement 8 éléments');
  expect(prompt).not.toContain('même longueur');
});

test('wordfield: generate without leftover placeholders', async ({ page }) => {
  await page.goto('/wordfield');
  await selectMat(page, 'targetLanguage', 'Italiano');
  await selectMat(page, 'cefr', 'B1');
  await page.click('mat-select[formcontrolname="sourceType"]');
  await page.locator('mat-option').first().click();
  await page.waitForTimeout(200);
  await page.click('mat-select[formcontrolname="outputType"]');
  await page.locator('mat-option').first().click();
  await page.waitForTimeout(200);
  const prompt = await generatedPrompt(page);
  expectNoPlaceholders(prompt);
});

test('korrektur: CEFR appears in strictness section, feedback optional', async ({ page }) => {
  await page.goto('/korrektur');
  await selectMat(page, 'targetLanguage', 'English');
  await selectMat(page, 'cefr', 'B1');
  await selectMat(page, 'sourceType', 'Kopierter Text');
  await page.locator('.feedback-section mat-checkbox').first().click();
  const prompt = await generatedPrompt(page);
  expectNoPlaceholders(prompt);
  expect(prompt).toContain("CEFR level (B1)");
  expect(prompt).toContain('Written feedback on structure and content');
});

test('library: save with Sammlung, reopen in editor, regenerate', async ({ page }) => {
  await page.goto('/vocabulary');
  await selectMat(page, 'targetLanguage', 'English');
  await selectMat(page, 'cefr', 'B1');
  const chipInput = page.locator('mat-chip-grid input').first();
  await chipInput.fill('apple');
  await chipInput.press('Enter');
  await page.locator('mat-checkbox').nth(0).click();
  await generatedPrompt(page);
  await page.getByRole('button', { name: 'In Bibliothek speichern' }).click();
  await page.waitForSelector('mat-dialog-container');
  await page
    .locator('mat-dialog-container input[formcontrolname="collection"]')
    .fill('Smoke-Test');
  await page
    .locator('mat-dialog-container button', { hasText: /Speichern/ })
    .last()
    .click();
  await page.waitForTimeout(600);

  await page.goto('/library');
  await expect(page.locator('.prompt-card').first()).toContainText('Smoke-Test');
  await page
    .locator('.prompt-card button[aria-label="Prompt im Editor öffnen"]')
    .first()
    .click();
  await page.waitForURL('**/vocabulary');
  await expect(page.locator('mat-chip-row')).toHaveCount(1);
  const prompt = await generatedPrompt(page);
  expect(prompt).toContain('apple');
});

test('settings: defaults prefill editors', async ({ page }) => {
  await page.goto('/settings');
  await page.locator('mat-select').nth(0).click();
  await page.getByRole('option', { name: 'Español', exact: true }).click();
  await page.waitForTimeout(600);
  await page.keyboard.press('Escape');
  await page.locator('mat-select').nth(1).click({ force: true });
  await page.getByRole('option', { name: 'A2', exact: true }).click();
  await page.waitForTimeout(400);
  await page.goto('/grammar');
  await expect(
    page.locator('mat-select[formcontrolname="targetLanguage"]')
  ).toContainText('Español');
  await expect(
    page.locator('mat-select[formcontrolname="cefr"]')
  ).toContainText('A2');
});

test('output as file: prompt asks for the chosen file, saved prompt restores it', async ({ page }) => {
  await page.goto('/clone');
  await selectMat(page, 'targetLanguage', 'English');
  await selectMat(page, 'cefr', 'B1');
  await selectMat(page, 'sourceType', 'PDF');
  let prompt = await generatedPrompt(page);
  expect(prompt).not.toContain('Output format:');

  await page.click('app-output-format-field mat-select');
  await page.getByRole('option', { name: 'Word- und PDF-Datei', exact: true }).click();
  await page.waitForTimeout(250);
  prompt = await generatedPrompt(page);
  expectNoPlaceholders(prompt);
  expect(prompt).toContain('Output format:');
  expect(prompt).toContain('a Word document (.docx) and a PDF file');
  expect(prompt).toContain('If you cannot create files');

  await page.locator('.save-button').click();
  await page.waitForSelector('mat-dialog-container');
  await page
    .locator('mat-dialog-container button', { hasText: /Speichern/ })
    .last()
    .click();
  await page.waitForTimeout(600);
  await page.goto('/library');
  await page
    .locator('.prompt-card button[aria-label="Prompt im Editor öffnen"]')
    .first()
    .click();
  await page.waitForURL('**/clone');
  await expect(page.locator('app-output-format-field mat-select')).toContainText(
    'Word- und PDF-Datei'
  );
});

test('output as file: not offered for Korrektur or mind-map markdown', async ({ page }) => {
  await page.goto('/korrektur');
  await expect(page.locator('form')).toBeVisible();
  await expect(page.locator('app-output-format-field')).toHaveCount(0);

  await page.goto('/wordfield');
  await expect(page.locator('app-output-format-field')).toHaveCount(1);
  await selectMat(page, 'outputType', 'Markdown für Mind-Mapping');
  await expect(page.locator('app-output-format-field')).toHaveCount(0);
});

test('persona chat: generate, save and reopen from the library', async ({ page }) => {
  await page.goto('/dashboard');
  await page.locator('.card-link', { hasText: 'Persona-Chat' }).click();
  await page.waitForURL('**/persona');

  await expect(page.getByRole('button', { name: 'Prompt generieren' })).toBeDisabled();
  await selectMat(page, 'targetLanguage', 'Italiano');
  await selectMat(page, 'cefr', 'A2');
  await page.locator('input[formcontrolname="persona"]').fill('Leonardo da Vinci');
  await page
    .locator('input[formcontrolname="personaDescription"]')
    .fill('pittore e inventore del Rinascimento');
  await page
    .locator('textarea[formcontrolname="researchGoal"]')
    .fill('Scoprire quali macchine ha disegnato Leonardo');

  const prompt = await generatedPrompt(page);
  expectNoPlaceholders(prompt);
  expect(prompt).toContain(
    'vesti i panni di Leonardo da Vinci, pittore e inventore del Rinascimento.'
  );
  expect(prompt).toContain('livello A2 del QCER');
  expect(prompt).toContain('Il passato remoto è escluso');
  expect(prompt).toContain('al massimo 4 frasi');
  expect(prompt).toContain('«Scoprire quali macchine ha disegnato Leonardo»');
  expect(prompt).toContain('4. Regole da rispettare');
  expect(prompt).toContain('5. Per concludere');
  expect(prompt).not.toContain('Formato di output');

  await page.locator('.save-button').click();
  await page.waitForSelector('mat-dialog-container');
  await page
    .locator('mat-dialog-container button', { hasText: /Speichern/ })
    .last()
    .click();
  await page.waitForTimeout(600);

  await page.goto('/library');
  const card = page.locator('.prompt-card', { hasText: 'Persona-Chat - Leonardo da Vinci' });
  await expect(card).toHaveCount(1);
  await card.locator('button[aria-label="Prompt im Editor öffnen"]').click();
  await page.waitForURL('**/persona');
  await expect(page.locator('input[formcontrolname="persona"]')).toHaveValue('Leonardo da Vinci');
  await expect(page.locator('mat-select[formcontrolname="cefr"]')).toContainText('A2');
});
