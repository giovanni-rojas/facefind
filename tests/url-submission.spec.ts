import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';

const assetDir = path.join(__dirname, 'assets');

const imageUrls = readFileSync(path.join(assetDir, 'image-links.txt'), 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

test('detects correct face count via URL submission', async ({ page }) => {
    await page.goto('');

    for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        const expected = i;                 //0-indexed matched 0, 1, 2, 3 faces

        await page.getByPlaceholder('Enter image URL or upload image').fill(url);
        await page.getByRole('button', { name: /detect/i }).click();

        await expect(page.getByRole('heading', { name: `Faces Detected: ${expected}` })).toBeVisible();
    }
});