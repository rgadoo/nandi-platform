[![Build status](https://github.com/git/git/workflows/CI/badge.svg)](https://github.com/git/git/actions?query=branch%3Amaster+event%3Apush)

Git - fast, scalable, distributed revision control system
=========================================================

Git is a fast, scalable, distributed revision control system with an
unusually rich command set that provides both high-level operations
and full access to internals.

Git is an Open Source project covered by the GNU General Public
License version 2 (some parts of it are under different licenses,
compatible with the GPLv2). It was originally written by Linus
Torvalds with help of a group of hackers around the net.

Please read the file [INSTALL][] for installation instructions.

Many Git online resources are accessible from <https://git-scm.com/>
including full documentation and Git related tools.

See [Documentation/gittutorial.adoc][] to get started, then see
[Documentation/giteveryday.adoc][] for a useful minimum set of commands, and
`Documentation/git-<commandname>.adoc` for documentation of each command.
If git has been correctly installed, then the tutorial can also be
read with `man gittutorial` or `git help tutorial`, and the
documentation of each command with `man git-<commandname>` or `git help
<commandname>`.

CVS users may also want to read [Documentation/gitcvs-migration.adoc][]
(`man gitcvs-migration` or `git help cvs-migration` if git is
installed).

The user discussion and development of Git take place on the Git
mailing list -- everyone is welcome to post bug reports, feature
requests, comments and patches to git@vger.kernel.org (read
[Documentation/SubmittingPatches][] for instructions on patch submission
and [Documentation/CodingGuidelines][]).

Those wishing to help with error message, usage and informational message
string translations (localization l10) should see [po/README.md][]
(a `po` file is a Portable Object file that holds the translations).

To subscribe to the list, send an email to <git+subscribe@vger.kernel.org>
(see https://subspace.kernel.org/subscribing.html for details). The mailing
list archives are available at <https://lore.kernel.org/git/>,
<https://marc.info/?l=git> and other archival sites.

Issues which are security relevant should be disclosed privately to
the Git Security mailing list <git-security@googlegroups.com>.

The maintainer frequently sends the "What's cooking" reports that
list the current status of various development topics to the mailing
list.  The discussion following them give a good reference for
project status, development direction and remaining tasks.

The name "git" was given by Linus Torvalds when he wrote the very
first version. He described the tool as "the stupid content tracker"
and the name as (depending on your mood):

 - random three-letter combination that is pronounceable, and not
   actually used by any common UNIX command.  The fact that it is a
   mispronunciation of "get" may or may not be relevant.
 - stupid. contemptible and despicable. simple. Take your pick from the
   dictionary of slang.
 - "global information tracker": you're in a good mood, and it actually
   works for you. Angels sing, and a light suddenly fills the room.
 - "goddamn idiotic truckload of sh*t": when it breaks

[INSTALL]: INSTALL
[Documentation/gittutorial.adoc]: Documentation/gittutorial.adoc
[Documentation/giteveryday.adoc]: Documentation/giteveryday.adoc
[Documentation/gitcvs-migration.adoc]: Documentation/gitcvs-migration.adoc
[Documentation/SubmittingPatches]: Documentation/SubmittingPatches
[Documentation/CodingGuidelines]: Documentation/CodingGuidelines
[po/README.md]: po/README.md

# Chat Avatars

This directory contains avatar images used for the different chat bubbles in the application.

## Current Images

- `karma-avatar.png` - Avatar for the Karma Chat assistant
- `wisdom-avatar.png` - Avatar for the Wisdom Chat assistant
- `meditation-avatar.png` - Avatar for the Meditation Chat assistant

## How to Customize

1. **Replace existing avatars**: Simply replace any of the PNG files with your own image (keeping the same filename).
   - Recommended size: 128×128 pixels
   - Format: PNG with transparency works best
   - Square aspect ratio is recommended

2. **Add a new avatar**: If you want to add a new themed chat, add an image to this directory and update the `CHAT_THEMES` array in:
   ```
   /src/components/Chat/ChatManager.js
   ```

## Chat Theme Configuration

Each chat theme in the ChatManager component requires the following properties:

```javascript
{
  id: 'unique-id',
  name: 'Display Name',
  apiEndpoint: '/api/endpoint',
  icon: <IconComponent />,  // React icon component
  color: '#hexcolor',       // Primary color for the chat theme
  position: 'bottom-right', // Position on screen
  avatarImage: '/images/chat-avatars/your-avatar.png'
}
```

## Best Practices

- Keep images small (under 50KB) for fast loading
- Use PNG format for images with transparency
- Maintain consistency in style across all avatars
- Use descriptive filenames that match the theme

## Fallback Behavior

If an image fails to load, the component will automatically use a generated avatar from ui-avatars.com as a fallback.
