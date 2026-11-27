# AI Log

I used Cursor throughout the development of Tapza Care. I mainly used it to speed up implementation, work through different approaches, fix issues, and improve the overall UI.

Below is a summary of the main instructions I gave Cursor and the decisions I made while building the application. These are summarised in my own words, not copied word for word.

## Prompts and instructions

1. **Initial project requirements:** I shared the assignment PDF with Cursor and asked it to build the app based on the requirements. I wanted the code to be simple and maintainable, with reusable components, a consistent UI, and an Android-first approach.

2. **Project setup:** The project was already a bare React Native application. I asked Cursor to add only the libraries needed for navigation, local storage, safe area handling, and gradients. I wanted to avoid unnecessary dependencies.

3. **Mock backend:** I asked Cursor to create a mock backend using the API endpoints and response structures from the assignment. I also wanted runtime switches to simulate slow network responses and API failures.

4. **Dynamic home screen:** I asked for a home screen that could be completely controlled by remote configuration. Each section should have its own component, and unknown section types or invalid items should not break the screen.

5. **Booking flow:** I wanted the booking process to feel responsive. The booking should appear successful immediately, while the API request runs in the background. If the server rejects it, the app should undo the booking and show the appropriate error.

6. **Testing:** I asked Cursor to add tests for the important parts, especially config validation, section rendering, booking state changes, and mock API behaviour.

7. **UI feedback:** After running the app on my phone, I gave feedback in several rounds: the text was too big, I wanted a more premium and compact look, I wanted real images for services and doctors, and I wanted the same section order on both days.

## What I rejected from Cursor's output

- **Emoji icons:** the first tab bar and chips used emoji. They looked cheap, so I asked for SVG line icons everywhere.
- **Random doctor photos:** the first doctor images looked random, so they were replaced with initials. Later I asked for proper portraits and kept the initials only as a fallback.
- **Service photos that didn't match:** the first photos were guesses and some were wrong. The diabetes card showed surgeons. They were replaced with photos I checked one by one.
- **Big text and heavy cards:** the first version looked large and plain. I asked for smaller text and one shared card style.
- **Extra sections:** I removed the "More consultations" section, the timing strip at the bottom, and the offer strip under the hero banner.
- **Different section order for the festival day:** Cursor had put quick actions before the chips. I asked for the same order on both days.

## Approaches I considered

During development, I also discussed a few different implementation options with Cursor.

- **Reanimated vs Animated:** I stayed with React Native's built-in Animated API and PanResponder to avoid additional native setup.
- **Icon libraries:** Instead of adding a large icon package, I used `react-native-svg` to create lightweight line icons.
- **State management:** Redux or Zustand felt unnecessary for this version, so I used React Context and a booking reducer.
- **API state handling:** I created a reusable `useRequest` hook instead of introducing React Query.
- **Config validation:** I used a custom `parseConfig.ts` implementation instead of adding Zod as another dependency.
- **Loading and error states:** I kept the handling inside individual screens and reused common components where needed.
- **Offline support:** Instead of showing an error screen when the config request fails, I added a fallback using cached and bundled configurations.
- **Additional features:** I kept notifications, localisation, Lottie animations, and end-to-end testing out of the current scope.

## Issues I fixed during development

While testing the app, I noticed a few UI and rendering issues and used Cursor to help investigate and fix them.

- The four quick action cards in a single row were cutting off the Prescriptions text, so I changed the layout to a 2 × 2 grid.
- The offer strip looked too tall, so I added a `thin` option to `SectionShell`.
- Some sections were not playing their entrance animations when they became visible. I fixed the FlatList rendering issue using `extraData`.

## UI and design improvements

After getting the initial screens working, I spent some time improving the overall appearance.

Some of the changes included:

- Reduced text sizes and made the cards more compact.
- Used a consistent card style with soft shadows.
- Replaced emoji-based navigation icons with SVG line icons.
- Improved the service cards with more relevant images.
- Updated doctor cards with better layouts, profile images, consultation fees, and booking actions.
- Kept initials as a fallback when doctor images fail to load.
- Made the section order consistent between normal and festival configurations.
- Prices on the home screen now use one smaller font size, the same as the doctor list in booking.
- Redesigned the booking confirmation screen with an animated tick and a ticket-style appointment card.
- Removed sections that made the home screen unnecessarily long. The offer strip now sits only at the bottom of the page.

I also checked the images used in the app and replaced a few that didn't match the actual services.

## Final note

Cursor helped me move faster during development, but I reviewed the implementation, tested the main flows, and made changes whenever something didn't behave or look right.

My main focus was to keep the application straightforward, maintainable, and aligned with the assignment requirements rather than adding unnecessary libraries or complexity.
