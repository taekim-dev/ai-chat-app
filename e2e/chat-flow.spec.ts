import { test, expect } from '@playwright/test'

test.describe('Critical Chat Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page
    await page.goto('/')
    // Wait for the app to be loaded
    await expect(page.getByRole('heading', { name: 'AI Chat App' })).toBeVisible()
  })

  test('should handle basic chat navigation', async ({ page }) => {
    // Start new chat
    await page.getByRole('link', { name: 'Start New Chat' }).click()
    await page.waitForURL('**/new-chat')
    
    // Select Therapist and verify initial message
    await page.getByText('Therapist').click()
    
    // Wait for chat container and first message to be visible
    await page.waitForSelector('div.message')
    const therapistGreeting = page.locator('div.message div').filter({ hasText: 'professional therapist' }).first()
    await expect(therapistGreeting).toBeVisible()

    // Send a message and get response
    await page.getByPlaceholder('Type a message...').fill('Hello')
    const sendButton = page.getByRole('button', { name: 'Send' })
    await expect(sendButton).toBeEnabled()
    await sendButton.click()

    // Wait for response and cooldown
    await page.waitForTimeout(3500)

    // Go back to home
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'AI Chat App' })).toBeVisible()

    // Return to the same chat by clicking the chat item
    await page.getByText('Therapist').first().click()
    
    // Wait for URL to update
    await page.waitForURL('**/chat/*')
    
    // Wait for chat container and messages to load
    await page.waitForSelector('div.message', { timeout: 5000 })
    
    // Verify we're back in the same chat by checking for greeting
    const greetingAfterReturn = page.locator('div.message div').filter({ hasText: 'professional therapist' }).first()
    await expect(greetingAfterReturn).toBeVisible()
    
    // Verify we can still interact
    await page.getByPlaceholder('Type a message...').fill('How are you?')
    const sendButtonAfterReturn = page.getByRole('button', { name: 'Send' })
    await expect(sendButtonAfterReturn).toBeEnabled()
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Start new chat
    await page.getByRole('link', { name: 'Start New Chat' }).click()
    await page.waitForURL('**/new-chat')
    
    // Select a persona and wait for chat to initialize
    await page.getByText('Therapist').click()
    
    // Wait for chat to be created and loaded
    await page.waitForSelector('.bg-surface-50.text-content-400')
    await expect(page.locator('.bg-surface-50.text-content-400').first()).toBeVisible()

    // Try to send empty message
    const sendButton = page.getByRole('button', { name: 'Send' })
    await expect(sendButton).toBeDisabled()

    // Type a message
    await page.getByPlaceholder('Type a message...').fill('Test message')
    await expect(sendButton).toBeEnabled()

    // Send message
    await sendButton.click()

    // Wait for messages to appear
    await page.waitForTimeout(700) // Wait for animation
    const userMessage = page.locator('div.message div.bg-primary-500.text-white').filter({ hasText: 'Test message' })
    await expect(userMessage).toBeVisible()

    // Wait for AI response
    const aiResponse = page.locator('div.message div.bg-surface-50.text-content-400').last()
    await expect(aiResponse).toBeVisible()

    // Wait for input to clear
    await expect(page.getByPlaceholder('Type a message...')).toBeEmpty()
    
    // Wait for any cooldown to finish
    await page.waitForTimeout(3500)
    
    // Type a new message to verify button becomes enabled
    await page.getByPlaceholder('Type a message...').fill('Test')
    await expect(sendButton).toBeEnabled()
  })
}) 