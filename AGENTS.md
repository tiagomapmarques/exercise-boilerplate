# Agents

This file is written for code agents; the files it points to are written for the
humans working on the project - read them, and keep them written for that
audience.

Read [README.md](README.md) for stack, scripts, and quick-start instructions.

Read [DEVELOPMENT.md](DEVELOPMENT.md) for architecture, conventions, testing,
and tooling, plus the guidance to follow when extending the project.

Read [DEVELOPER.md](DEVELOPER.md) for developer-specific preferences that extend
the conventions in DEVELOPMENT.md and user-preferences. This file is not tracked
by git and may not exist - that is fine.

## Documentation (markdown files)

Tests document the features; these files document the ideas. A behavior a test
already pins down needs no prose, and an idea no test can express - why the
design has this shape, which rule to apply to the next case - has nowhere else
to live.

Every fact has one home, and the files above say which. A fact repeated in a
second file means one copy is already wrong, so link to the owner instead.
Cross-references are links, within a file as well as across them:
`[Testing](DEVELOPMENT.md#testing)`.

Write the principle, not the cases. State the invariant, give at most one
example, and let the reader derive the rest: if deleting a list of instances
leaves the rule still deciding the case, delete the list. Enumerations date the
moment the code grows a case they do not mention, and they invite the reader to
look for their situation rather than apply the rule.

Do not restate a library's documentation. Keep our rule and drop the mechanics
behind it - those are one search away, maintained by someone else, and will
outlive whatever we wrote about them. Keep a reason only where the rule reads as
arbitrary without it.

Markdown files use a maximum line length of 80 characters. Fill lines to the
limit - break at the latest word boundary that fits. Newline characters are not
counted towards this limit. Tables and fenced code blocks are exempt.

Beyond that, the code-comment standard applies to prose too - see
[DEVELOPMENT.md](DEVELOPMENT.md#documentation-code-comments).

## Code generation

Read the section that governs the change before writing it, not after. These
rules decide questions a reasonable-looking guess gets wrong, and the guess is
rewritten rather than reviewed. A rule that turns out to be wrong for the case
at hand is changed in the documentation as part of the same change, never worked
around silently - see
[Documentation and code agree](DEVELOPMENT.md#documentation-and-code-agree).

[DEVELOPMENT.md](DEVELOPMENT.md) is organized by the kind of decision each
section settles, so its headings are the index - a change touching styling reads
Styling, one adding a module reads Module design.

A change is not done until `pnpm lint` passes clean. Fix the violation the rule
is pointing at first - reach for a `biome-ignore` comment only once fixing turns
out to be the wrong move for that line, not as the first response to a failing
rule. See
[Documentation (code comments)](DEVELOPMENT.md#documentation-code-comments) for
what a suppression's reason then has to say.
