# Custom Chat Avatars

This directory contains avatar images used in the Mars Chat component.

## Current Images:

- `assistant-avatar.png` - The avatar displayed for the AI assistant in the chat window

## How to Customize:

1. **Replace the existing avatar**: Simply replace the `assistant-avatar.png` file with your own image (keeping the same filename).
   - Recommended size: 128×128 pixels
   - Format: PNG with transparency for best results
   - Square aspect ratio is recommended

2. **Add a new avatar**: If you want to use a different avatar, add it to this directory and update the `AVATAR_URL` constant in:
   ```
   /src/components/MarsChat/MarsChat.js
   ```

3. **User avatars**: If you want to add user avatars, add them to this directory and update the `MarsChat.js` file to include them for outgoing messages.

## Best Practices:

- Keep images small (under 50KB) for fast loading
- Use PNG format for images with transparency
- Use JPEG format for photos
- Maintain consistency in style across all avatars
- Use descriptive filenames (e.g., `customer-support-avatar.png`, `user-avatar.png`)

## Fallback Behavior:

If an image fails to load, the component will automatically use a generated avatar from ui-avatars.com as a fallback. 