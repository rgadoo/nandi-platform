# Custom Chat Avatars

This directory contains avatar images used in the Nandi Chat components.

## Current Images:

- Chat avatars for different personalities in the app
- Mascot avatars for the cards and progress sections

## How to Customize:

1. **Replace existing avatars**: Simply replace the image files with your own (keeping the same filenames).
   - Recommended size: 128×128 pixels
   - Format: PNG with transparency for best results
   - Square aspect ratio is recommended

2. **Add a new avatar**: If you want to use a different avatar, add it to this directory and update the respective component files.

3. **User avatars**: If you want to add user avatars, add them to this directory and update the Chat components to include them for outgoing messages.

## Best Practices:

- Keep images small (under 50KB) for fast loading
- Use PNG format for images with transparency
- Use JPEG format for photos
- Maintain consistency in style across all avatars
- Use descriptive filenames (e.g., `karma-avatar.png`, `wisdom-avatar.png`)

## Fallback Behavior:

If an image fails to load, the components will automatically use a generated avatar from ui-avatars.com as a fallback. 