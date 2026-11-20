# Development guide

This document is a guide on how the project is put together and how to extend
its functionality. It describes the project in terms of its architecture,
conventions, testing, and tooling.

For operational instructions, see [README.md](README.md).

## Documentation and code agree

Documentation and code have to agree, in both directions. Neither is finished
until the other matches: a change to the code updates the comments and files
describing it in the same commit, and where documentation and code contradict
each other, one of them is a defect - decide which, then fix it.

## Project structure

```
src/
  components/   Reusable UI components
  pages/        Page components that own a route's logic
  providers/    Context providers
  routes/       App routing (file-based)
  services/     Application and business logic, organized by context - import
                paths reveal what a component depends on
  locales/      Translation catalogs (.po files)
  testing/      Test utilities - not shipped
  utilities/    Helpers usable anywhere
  build-info.ts Build-time project metadata
  router.tsx    Router instance
  main.tsx      App entry point
  main.css      Global styles
e2e/            End-to-end specs
public/         Static files Vite copies through untouched
bin/            Node executables for tooling, checks, and CI
```

## Module design

Every component, provider, and utility should be treated as a self-contained
module with a deliberate public surface - as if it could be extracted into its
own package at any time.

In practice this means:

- Each feature module exposes its API through an `index.ts` barrel export.
  Consumers import from the module directory, not from internal files. A
  category directory - one that groups modules, such as `components/` or
  `services/` - never has a barrel: a category-level barrel would bundle
  unrelated modules together and defeat tree-shaking.
- The barrel exports whole files, never a selection of names from one: what a
  module keeps to itself lives in a file the barrel leaves out, so its public
  surface is visible in the file tree. Split a file that has both.
- Types should always be exported, even if nothing in the project currently
  imports them - it depends only on the API the developer wants to create for
  consumers. A type describing something that is not itself exported, such as
  the props of a component local to its file, needs no export and is written
  inline while it is short. Once it would push the component's code out of
  sight, as in a file of several larger components, it gets a name.
- Everything is a named export - no default exports.
- Never export or expose something solely to make it testable. If a piece of
  code cannot be tested through the module's public interface, reconsider the
  design rather than widening the surface.

## Documentation (code comments)

For the markdown files, see [AGENTS.md](AGENTS.md#documentation-markdown-files).

All exported types, functions, and hooks require a JSDoc comment. Component
functions are the exception - their props type and tests serve as documentation
instead. Attributes inside a type also get a comment, placed on the line above
the attribute.

Keep comments to a single sentence - the name and a short description should be
enough to fully understand it. A function whose behavior branches on its inputs
is no exception as long as that sentence names each case; only when it cannot,
give each case a short paragraph of its own. Documentation describes what code
does, not where it is used.

A comment ends with a full stop unless it is a single, standalone `//` line - a
quick dev note. A JSDoc comment (`/** ... */`) always gets one, whether it fits
on one line or grows into a multi-line starred block; so does a `//` comment
that runs across several consecutive lines.

These rules hold in every language we write, not only TypeScript. A linter
directive keeps whatever form its tool parses.

Documentation should be written in plain English: common words, short sentences,
no idioms and no figures of speech. Assume that not everyone will be a native
English speaker, and that a comment which has to be read twice has failed.
Prefer "waits until the value arrives" over "waits for the value to land", and
say the thing rather than allude to it.

Code should be self-explanatory: libraries have their own documentation and our
tests already fully describe the features of our code. Write a comment only to
cite something outside that scope, like a bug being worked around. A comment
that fails that test is not redeemed by being true - the explanation belongs in
the code, so rename or restructure until the comment is unnecessary.

Multi-line comment runs use a maximum line length of 80 characters. Fill lines
to the limit - break at the latest word boundary that fits. Newline characters
are not counted towards this limit. Single-line comments are exempt.

```ts
/** Props for the `MyComponent` component. */
export type MyComponentProps = {
  /** Locale whose flag to display. */
  locale: Locale;
  /** Whether the component is disabled - hides interactive elements. */
  disabled?: boolean;
};

/** Hook returning the current locale and a setter. */
export const useLocale = () => { ... };
```

Note that a `biome-ignore` reason is `False positive` and nothing else whenever
the rule is wrong about the code - the linter's limitation is not worth a
sentence. Suppressing a warning that is correct is a different matter: name what
the rule cannot see, as with any other comment.

## Import conventions

The `@/` alias maps to `src/` and the `~/` alias maps to `e2e/`. Use them
instead of relative paths - `../` imports are forbidden wherever an alias can
reach the target, which leaves a target outside both folders and a dynamic
import built from a variable, where Vite does not resolve the aliases. The two
sides stay separate: source files never import `~/`, and end-to-end specs never
import `@/` - a spec drives the built app from the outside, so anything it needs
it declares itself. Keep paths shallow: anything 3+ levels deep (e.g. `@/a/b/c`)
is a sign the code should be restructured/split - except in test code
(`*.test.*` and `src/testing`), where mocking a dependency needs the module that
defines it, not the barrel re-exporting it, so reaching past the barrel there is
expected rather than a smell.

`@testing-library/react`, `vitest`, and `vitest/browser` cannot be imported
directly - use `@/testing` instead. From `@lingui/core`, only types and
`setupI18n` can be imported: the app never activates Lingui's global `i18n`,
since each `LocaleProvider` sets up its own instance, which components read
through `useLingui`. The `console` module is off-limits too; use the global
`console` variable, whose calls Biome also flags, so each one carries a
suppression that names why the output is wanted.

Biome sorts and groups imports itself, in the order `organizeImports` sets in
`biome.json`.

## Routing

Routes use TanStack Router's file-based routing. Every route is split into a
`.ts` for its configuration and a `.lazy.ts` for its component:

```ts
// src/routes/about.ts - configuration
export const Route = createFileRoute('/about')({});

// src/routes/about.lazy.ts - component (lazy-loaded)
export const Route = createLazyFileRoute('/about')({
  component: AboutPage,
});
```

The app is served under a configurable path (`VITE_BASE_PATH`, `/` by default).
Every URL we own is relative to that base; every URL someone else owns is not.
The router takes the base from `import.meta.env.BASE_URL` and anything we build
at runtime does the same, while Gateway's routes stay absolute because they are
Gateway's.

A URL inside a file Vite copies through untouched, such as anything in
`public/`, has to be relative to the file carrying it.

The root route (`__root.ts`) renders an `AppShell`, which wraps any mandatory
global providers and the global layout. The root route is exempt from the
`.ts + .lazy.ts` split - it is always loaded, so lazy-splitting it would add
indirection with no payoff.

Unknown URLs and unexpected render/load errors are handled globally, by
`NotFoundPage` and `UnexpectedErrorPage` respectively. Preloading is on
(`defaultPreload: 'intent'`).

Pages must never import other pages. Each page is imported only by route files
that need it, or by `router.tsx` for the router-level fallbacks.

## Internationalization

Translations use Lingui with PO files. Supported locales are defined in
`src/providers/locale/constants.mts`.

After adding a string, run `pnpm i18n`, fill in the new entries in
`src/locales/{locale}.po`, then run it again - anything still untranslated
surfaces on the second pass.

The locale is the one last picked in this browser, else the best match for the
browser's languages, else `en-GB`.

### Translation keys

Keys are three `kebab-case` segments: `<namespace>.<context>.<name>`. Use the
namespace that best describes the string's role. This convention applies to
production keys only - test message keys are free-form. Use `generic` as the
context for strings reused across multiple features.

| Namespace | Used for |
|---|---|
| `pages.<page>.<slot>` | Page-specific strings - `title`, `content`, `instructions` |
| `labels.<context>.<name>` | Short UI labels that name an element - app name, menu |
| `messages.<context>.<name>` | Status and feedback messages - loading, error |
| `actions.<context>.<name>` | Interactive labels - button text, link text |

## Styling

Mantine is the component library. Component-level styles use CSS modules
(`.module.css` files colocated with the component).

CSS module imports are always named `classes`:

```ts
import classes from './my-component.module.css';
```

Class names use PascalCase when the class corresponds to a named component or
element (`Navigation`, `NavigationLink`), and camelCase for structural, layout,
or state-modifier classes (`bottom`, `linkActive`).

Doubling a CSS class (`.Page.Page`) must be the last resort when a selector
needs higher specificity - prefer using the element (`div.Page`) instead.

Write spacing in `rem`, which Mantine's responsive spacing system depends on.

The Mantine theme is defined in `AppShell` via `createTheme`. Color scheme
defaults to `'auto'`. When overriding Mantine variables, do it in `main.css`.

### Responsive design

Every feature is responsive, and mobile-first wherever the layout allows it: the
narrowest supported viewport is the base case and wider ones are additions on
top of it, never a desktop layout narrowed down afterwards - checking mobile
only as an afterthought routinely misses what turns out unreachable or broken
there.

A control shown at one width has a home at every other. A wide layout may put it
in the navigation and a narrow one beside the page title, but no width leaves it
unreachable.

A behavior that differs by viewport is a requirement per viewport, and its tests
are mobile-first too. Every test starts on a narrow viewport, so the narrow
behavior is the base feature set, and each wider viewport gets a nested
`describe` that names the width and resizes to it.

A width in CSS comes from a `$mantine-breakpoint-<size>` variable passed to a
mixin, such as `@mixin larger-than $mantine-breakpoint-sm`, and one in
TypeScript from `useViewport`, never from a literal.

## State management

There is no centralized state library. State is managed with either React
context providers or by using `useSyncExternalStore`. Each provider lives under
`src/providers/` with its own context, hook, and types. Add new providers there
if a feature needs shared state.

Providers must not couple to other providers and should support multiple
instances so they can be nested to provide sub-contexts. The exception is a
provider for something the browser holds only once or for a provider whose
feature is specifically connecting multiple providers.

A hook wrapping a TanStack Query returns that query's result untouched. Picking
fields out into an object of your own hides the rest of the result from
consumers, and a default belongs at the call site instead - as in
`const { data: rules = [] } = useRules()`.

Read the result through its status fields rather than the derived booleans, and
reach for a boolean only where a case needs two statuses at once. Hooks of our
own are free to return a plain flag.

A typical provider module looks like this:

```
providers/my-feature/
  context.ts               Context object and type definitions
  my-feature-provider.tsx  Provider component
  use-my-feature.ts        Consumer hook
  index.ts                 Barrel export
```

These file names are the starting point, not a checklist. Name each file after
what it holds and merge or split them to suit - a provider whose context sits
alongside a module-level singleton can keep both in `constants.ts`, and one with
no types of its own needs no `types.ts`. Only the barrel is public either way,
so the split costs nothing to change later.

## Code conventions

Variable, parameter, and property names must be fully spelled out - no
abbreviations, even in short lambdas or callbacks. Industry-standard initialisms
or library-specific terms (`i18n`, `url`, `id`, and similar) are fine, and a few
words have a fixed form - see [Nomenclature](#nomenclature).

Everything must be defined before its first use in a file. If `main` calls
`helper`, `helper` appears earlier in the file. This applies to functions,
variables, and types - do not rely on hoisting.

Anything that produces UI is a component used as JSX, never a `renderThing()`
function returning elements - only the former gets an identity of its own in the
component tree. Branches between several outcomes belong inside a component that
returns early, since nested ternaries are not allowed.

When writing JSX, don't add empty lines between parent and child components, but
add them between sibling components.

When creating a type for a component's props, place it immediately above the
component.

An optional prop should not have a default that is falsy (examples: `false`,
`undefined`, `null`, `0`, `''`) when deconstructing props/options in a component
or hook. This enables the component/hook to know if the consumer is choosing an
option or leaving it up to the component/hook to decide, which is additional
information that the component/hook may want for its functionality.

```ts
const MyComponent = ({ hideButton = false }) => { ... };  // incorrect
const MyComponent = ({ icon = null }) => { ... };         // incorrect
const MyComponent = ({ variant = 'default' }) => { ... }; // correct
const MyComponent = ({ position = 'top' }) => { ... };    // correct
```

For a boolean specifically, this also decides its name: name it for the behavior
it turns on, not the one it turns off, so an omitted prop always means the
default. `<input disabled>` already follows this - an input is enabled by
default, so the exceptional case gets the name, not the default one; there is no
`enabled` prop defaulting to `true`. Do the same for our own props: write
`disableX`/`hideX`/`noX`, so they can implicitly default to `false`, for a
feature that is normally on. Never write `enableX`/`showX` when its default
value is `true`.

A props type is ordered in two passes. First, every required field before any
optional one - that split never breaks. Second, within each of those two groups,
a field that pairs with its own callback (a value or state prop and its
`onXChange`) stays adjacent to it, with nothing else between them. A field with
no paired callback has no adjacency requirement of its own, but must not be
placed so it wedges a pair apart. Keep a component's destructured parameters,
and its JSX usage elsewhere, in that same order, so the type and the code it
describes never drift apart.

This ordering governs a type's own hand-authored fields only: a type built as
`LibraryProps & { ownField }` keeps the library's own fields in whatever order
the library declares them - only where `ownField` itself sits is ours to decide.
A type built from several of our own feature types, keeps each part's fields
together in the order that part declares them, its own fields included; the
order of the parts is free.

React `key` props follow the pattern
`ComponentName-Container[-ItemElement]-${uniqueValue}`, where `ComponentName` is
the component's name as React knows it, `Container` is a readable label for the
part that owns the list, `ItemElement` is a readable label for the repeating
item and is optional (include it when it adds clarity), and `uniqueValue` is the
item's natural stable identifier. Never use array index as a key. Omit
`Container` only when the component renders a single list. Always use PascalCase
for the segments of a key.

Arrow function bodies longer than 3 lines (once formatted) use a block body,
with an explicit `return` if the value is still needed. A body stays bare at any
length instead when it only assembles or selects already-available values into
one result - a literal object, array, or JSX, or a plain ternary between
existing values - rather than chaining operations or calling something that does
real work. In tests, `act` and `waitFor` always get a block body, except when
the whole call fits on one line once formatted.

### Nomenclature

- `Params`, not `Parameters`, for what a request carries - `requestParams`. A
  function's own parameters stay spelled out.
- `Props`, not `Properties`, for what a React component receives - `PageProps`.
  Any other object's properties stay spelled out.
- `Regex`, not `Pattern`, for a regular expression - `uuidRegex`.

## Testing

In watch mode, tests will use a non-deterministic browser.

Unexpected `console.log`, `console.warn`, and `console.error` calls cause test
failures - but only outside watch mode. This keeps CI clean while allowing
console output during local development. If a test legitimately needs to assert
on console output, use the `mockConsole` utility from `@/testing` directly and
inspect the returned mock.

The test ID attribute is `data-slot` instead of the default `data-testid`. Its
value must be written as a React component name. Use `data-slot` only when role
or other attributes are not enough to query an element.

### Structure

Every test file must have at least one `describe` block - loose `it` calls at
file level are not allowed. E2E specs use Playwright's `test.describe`: the
folder names the feature area and the block names the scenario the file covers,
so the reporter reads as area, then scenario, then expectation.

Top-level `describe` blocks should pass the function, component, or hook under
test as their label. Vitest uses the `.name` property, so the label stays in
sync with any rename:

```ts
describe(useMyHook, () => { ... });   // correct
describe(MyComponent, () => { ... }); // correct
describe('useMyHook', () => { ... }); // avoid
```

Use strings only for nested `describe` blocks that describe a scenario or
behavior: `describe('the locale is unknown', ...)`. A string is also acceptable
for a top-level block that covers a group of related constants rather than a
single function or hook.

Prefer a title with no apostrophe. Only keep one where removing it would force a
stilted rewrite - a natural contraction is worth more than an awkward workaround
chosen just to avoid a single character.

Each `it` block describes a single observable behavior. Tests within a
`describe` may assume all preceding tests have passed - write them as a
sequential feature specification, not independent scenarios.

A test that exercises a change - a click, a rerender, an async update - states
the initial state before triggering it, then the resulting state after: setup,
assert initial, act, assert final. A value captured for a later comparison but
never itself asserted proves nothing about the starting point on its own;
skipping that first assertion lets a broken trigger and a working one look
identical, since neither ran against a confirmed starting state. Whenever
possible, the first assertion and the final should be opposites (for example
`not.toBeInTheDocument()` and `toBeVisible()`) since only that pair ties the
action to the specific change the test guarantees.

Read top to bottom, a file's `describe`/`it` titles are the requirements for the
component, service, or provider under test - what it is guaranteed to do, not
how. A behavior missing from that list is unspecified, whatever the coverage
number says; a title that adds no guarantee beyond one already on the list is
not a new requirement and does not belong.

Tests should read naturally: a nested `describe` title reads as if it followed
"when", which it leaves out, and `it` blocks are read literally. An `it`
describes a feature of whatever its enclosing `describe` is about; a nested
`describe` only narrows that with a further condition. A block's own `it`s are
therefore its base feature set, and come before any nested `describe`:

```ts
describe(MyComponent, () => {
  it('displays a header', () => { ... });       // "it displays a header"

  describe('loading', () => {                   // "when loading..."
    it('displays a skeleton', () => { ... });   // "...it displays a skeleton"
  });
});
```

Use the most specific matcher available - prefer dedicated, argument-free
matchers over generic ones, and assertions that express intent directly over
those that merely check truthiness.

Avoid mocks. Prefer real implementations and the provider injection described
below. Only mock when a dependency is non-deterministic or has side effects that
cannot be fully controlled otherwise.

When a mock is needed, keep its `vi.mock` factory a bare placeholder - wrap the
real implementation (`vi.fn(original.thing)`) or return an empty `vi.fn()` - and
set the behavior a test actually needs in `beforeEach` or the `it` itself.
Implementing behavior inside the factory is a last resort, for state a mock
needs before any hook or test can run.

All mocks are reset before each test, so no explicit `mockClear()` is needed
between tests. A reset puts a `vi.fn(impl)` back to `impl` rather than emptying
it, so a factory's placeholder is what every test starts from.

A test file that outgrows the line limit is a prompt to look at the source
first, not the test file. The limit exists to push a large unit toward smaller,
independently testable pieces; splitting only the test file skips that and
leaves the same oversized unit behind. Pull out whatever part of the behavior is
pure logic with no rendering dependency - a computation, a state machine - into
its own module, testable on its own with no rendering involved at all; its test
file naturally takes that module's name, since it is that module's own
`describe` subject.

A source file split into an exported piece and an internal, non-exported
implementation detail does not get this for free: rendering a component still
goes through its exported name, so every one of its tests still `describe`s that
name, however many internal modules its own rendering touches. Name the test
file after what its `describe` block names, not after whichever internal module
it happens to exercise most. Only once a component's source is already split as
far as it usefully can be, and its test file is still too large, split the test
file itself: `<component>.test.tsx` for what the component is documented to
guarantee, `<component>-<functionality>.test.tsx` per distinct piece of
interactive, opt-in functionality layered on top of it (e.g.
`my-component-selection.test.tsx`, `my-component-grouping.test.tsx`) - all still
`describe`ing the same component.

A module of compound components, such as `Table`, describes the contract its
components share under the root component, and the behavior of a single
component under that component's own top-level `describe`.

### Data

Build fixtures from a generator instead of a hand-typed object literal: one
factory per shape in `src/testing/data`, backed by realistic fake data,
overridden with only the fields a test's behavior actually depends on.
Everything else comes from the generator rather than being spelled out, so a
newly required field surfaces as a type error instead of a fixture silently
missing it.

### Scope

Declare a helper, constant or fixture in the narrowest block that uses it - in
the `it` block when a single test needs it, in the `describe` block when the
tests of one scenario share it, and above the outermost `describe` only when the
whole file depends on it. File level is not the default.

A declaration wider than its use makes a reader search the file for what a
single test depends on, and it invites the next test to reuse a value that was
never shaped for it, which ties tests together that should be free to change
apart.

Two things have to stay at file level whatever they serve: a regex literal in an
end-to-end spec, which Biome requires there, and anything a hoisted `vi.mock`
factory reads, which runs before any block exists.

### Render utilities

`render` and `renderHook` from `@/testing` wrap the Testing Library equivalents
and accept a `providers` option to inject app providers:

```ts
// Default: wraps with i18n + mantine
render(<MyComponent />);

// Opt in to router
render(<MyComponent />, { providers: { router: true } });

// Pass options to a provider
render(<MyComponent />, { providers: { router: { initialEntries: ['/about'] } } });

// Disable a default provider
render(<MyComponent />, { providers: { mantine: false } });
```

Only override the default provider when strictly necessary and only disable a
default provider when its absence is what the test is about - a component that
has to render without it, or an assertion that depends on it being missing. A
provider the subject never reads changes nothing, so switching it off for
tidiness only adds noise to every render call. The tests of a provider module
are the exception: they switch off every default provider their subject does not
need, which proves the module stands alone - see
[State management](#state-management).

Call `render` and `renderHook` directly in every test. Wrapping them in a local
helper hides what a test actually mounts, and repeating the call is cheaper to
read than the indirection. Factories for the data or dependencies a test needs
are fine - it is the render itself that stays in plain sight.

`renderHook` has no default providers - pass what the hook needs explicitly.

Pass the hook directly - never wrap it in an arrow function:

```ts
renderHook(useMyHook, options);         // correct
renderHook(() => useMyHook(), options); // wrong
```

Both return a `providers` field on the result object, which gives access to each
provider's instance (e.g. `providers.i18n`, `providers.router.instance`) for
assertions. Assert against those values rather than overriding a provider to
plant them.

When adding a new provider, register a simplified testing variant in
`createWrapper` in `@/testing/render-providers.tsx` so it can be injected via
the `providers` option in `render` and `renderHook`. Nest it in the order the
app nests it, so a component sees the same providers around it in both places.

### ControlledPromise

Use `ControlledPromise` from `@/testing` to pause async flows mid-test and
assert on intermediate state:

```ts
const promise = new ControlledPromise();
const mockFetch = vi.fn(() => promise.wait());

render(<MyComponent fetch={mockFetch} />);
// component is now blocked - assert loading state here

await promise.resolve(); // resolve: assert success state
// or
await promise.reject(); // reject: assert error state
```

### End-to-end

E2E tests use Playwright directly (not Vitest). They run against a production
build previewed on `localhost:8080` - `pnpm test:e2e` handles the build and the
preview automatically via `webServer` in `playwright.config.mts`. In watch mode
they run against the dev server instead.

The preview serves the bundle and nothing else, so a spec owns every response
the page depends on - stub them with `page.route`, or from inside the page for a
response that has to stay open, such as a live stream, which `page.route` cannot
hold open. A missing stub does not fail as a failed request - it surfaces as the
page reporting an error instead of the state under test.

Organize specs by feature area. A single file is the default - name it after the
area and group its scenarios in `describe` blocks. Split into a subdirectory
only once an area's scenarios no longer read well as one file - the folder then
names the area and each file names one scenario, together forming the grouping
in Playwright's reporter. Helpers live in `e2e/testing`, reachable as
`~/testing`. Each scenario is a user flow end-to-end - navigation, interactions,
and observable outcomes. Unit and integration tests cover component behavior in
isolation; e2e tests cover what a real user would do and see.

### Coverage

Coverage is enforced at 100% for `src/**`, except for the files that
`coverage.exclude` lists in `vitest.config.mts`. All new code must be fully
covered or added to that list with justification.

Code excluded from coverage - that list, plus tooling outside `src/` such as
`bin/` - is not unit-tested and should not be, as it is generated, wiring, or
tooling code rather than application logic.

100% is a consequence of specifying every requirement, never a target of its
own - see [Structure](#structure). A test written only to reach a line, with no
requirement behind it, inflates the count without completing the spec - and
dropping it is not the fix, since the line would then go uncovered. Fold the
assertion into the test for the requirement that line already serves, or rewrite
the code so the line no longer needs one; if no requirement exists at all, the
line itself is not required, and it is the code that should go, not just the
test.

## Compatibility

Production build targets the `defaults` browserslist query - single modern
bundle with polyfills injected, no ES5 fallback. IE11 is not supported.

The project's default Node version should always be LTS for stability and
security. However, the project should also support the latest version of Node in
order to make sure it is compatible with future versions of Node - hence the two
Node versions listed in the `package.json` file (LTS and latest). Note that
latest-only APIs should be avoided and that the `@types/node` does not always
neatly track the latest Node version available.

## Dependencies

`dependencies` contains everything that contributes to the production build:
runtime code, bundlers, compilers, plugins, and code generators.
`devDependencies` is reserved for tooling with zero influence on build output:
linters, type checkers, test runners, and similar.

This deviates from the common npm convention for libraries, but this is an
end-project - the split is about audit scope, build machine safety, and
transparency over what code may run on the end-user's device. Keeping build
tools in `dependencies` ensures they are included in `pnpm audit --prod`
reviews, and prevents `devDependencies` postinstall scripts from running on
machines that should only produce a production build.
