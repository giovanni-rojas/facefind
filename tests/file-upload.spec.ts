import { test, expect } from '@playwright/test';
import path from 'path';

const assetDir = path.join(__dirname, 'assets');

const imageFiles = [
    { file: '0-faces.png', expected: 0},
    { file: '1-faces.jpg', expected: 1},
    { file: '2-faces.jpg', expected: 2},
    { file: '3-faces.jpg', expected: 3},
];

test('detects correct face count via file upload', async ({ page }) => {
    await page.goto('');

    for (const { file, expected } of imageFiles) {
        const filePath = path.join(assetDir, file)

        await page.locator('input[type="file"]').setInputFiles(filePath);
        await page.getByRole('button', { name: /detect/i }).click();

        await expect(page.getByRole('heading', { name: `Faces Detected: ${expected}` })).toBeVisible();
    }
});