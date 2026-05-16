# Supabase email templates

These are the brand-customised email templates for ClaimLens™. Supabase
stores email templates in its dashboard, not in source control — this
folder is the canonical source so we have a version history and can
roll back if the dashboard gets edited by hand.

## How to apply

1. Open the file in your editor (any text editor or IDE — VS Code,
   Sublime, JetBrains, vim, etc.):

   ```
   supabase/email-templates/magic-link.html
   ```

2. Select all content and copy it to your clipboard.

3. Open the Supabase dashboard → **Authentication** → **Email Templates**.

4. For each `.html` file in this folder, open the corresponding template
   tab in the dashboard and paste the contents:

   | File                   | Supabase template          | Subject                           |
   | ---------------------- | -------------------------- | --------------------------------- |
   | `magic-link.html`      | "Magic Link"               | `Sign in to ClaimLens™`           |

5. If the Supabase editor strips the HTML on paste, enable the **Source**
   / `<>` mode before pasting (some plain-text editors auto-escape on
   first paste; toggling to source mode preserves the markup).

6. Click **Save changes**. The new template is live immediately — the
   next sign-in attempt uses it.

## Tokens

Supabase substitutes the following at send time (Go template syntax —
do not rename, the dashboard parser looks for exactly these strings):

- `{{ .ConfirmationURL }}` — the magic link itself
- `{{ .Email }}` — the recipient's address
- `{{ .Token }}` — the raw OTP token (not used in our template)
- `{{ .SiteURL }}` — the project's configured site URL

## Notes on rendering

Email clients are decades behind web browsers. Constraints we follow:

- Inline CSS only. `<style>` blocks are stripped by Gmail in some
  contexts. No `@media`, no `:hover`.
- Tables for layout. Outlook's rendering engine is Word — flexbox is
  not an option.
- System fonts only (no `@import` of Google Fonts). Most major mail
  clients block web fonts.
- Max width 560px keeps lines readable on phones and within Gmail's
  desktop reading pane.
- `color-scheme: light only` keeps iOS Mail dark-mode from inverting
  the gold accent into something muddy.

If you need to tweak a subject line, button label, or footer text, edit
the file here, paste into Supabase, save. Don't edit the Supabase
dashboard copy directly without updating this file too — otherwise the
next maintainer overwrites your changes thinking they're applying a
fresh version.

## Verifying after install

Once the template is saved in Supabase, do a smoke test:

1. Sign out (if you're signed in).
2. Open `/login`, enter your email, click "Email me a sign-in link".
3. Open the email. You should see:
   - Dark "ClaimLens™" header with the gold subhead
   - Black "SIGN IN TO CLAIMLENS™" button
   - A fallback URL below the button
   - The disclaimer footer

If you see the default Supabase template instead (purple-ish styling,
"Confirm your signup" subject), the change didn't apply — re-paste and
make sure you saved in the right tab (Magic Link, not Confirm signup).
