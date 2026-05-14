# Waiter-shift-tracker

The goal of the app is that a waiter can open the app on his phone and install it locally. All data stays on the device.

When te app is opened the first time, a user gave his name, create a company he or she works on (name of the company), how much the payment is per hour in EURO. Additionally the user should be able to enter the start budget in euro.

User can add shifts (date and start time and are able to transfer that into Google calendar via url or Mac calendar via ics + share menu). When the shift ended, the user can go to this shift and enter the time the shift ended, how much tipp was generated. This data is recorded.

There is additionally the ability to change all not ended shifts, Its not possible to create shifts before the current month.

user should be able to see the amount of money accumulated. Additionaly they must be capable of tacking some of the money out. The budget is calculated into two pots (the shift money + the tipp money). If users retrieve some of the money from tipp, its tracked as expense or money transfer, only the tipp pot is changed.

**Add multilanguage support** english, german (german as default), changable in settings

- everythings needs to be fully typed
- types, functions and components need descriptive JSDOCS about their intented use
- all data needs to be stored in localstorage and synced throughout the application
- ui belongs in components in .component.tsx files
- business logic in hooks in .hook.ts files
- utils like transformers belong in .util.ts files 
- do not use css if not absolutly necessarty, use Mantine system as much as possible, this alsi includes their hooks and helpers
- use a clean reausable structure (folders and application)
- The README is only important for developers not users (keep it short and precise, no need for long explanations here)
- if possible use Zustand for state management and localstorage persistance, for example via zustand/middleware/persist
- use a clean and clear folder structure for the whole application
- do not use a database, the data should be stored in localstorage
- avoid to over-engineer the application, simple, clean and understandable code is better
- business logic should be separated from the ui
- use Mantine plugins or extensions for stuff like charts

**IMPORTANT** for the first iteration i provide some screenshots from the design tool, get inspiration from it. Te concept on the screenshots is close to what I want, but you can make changes if you think it makes sense. Do not make a pixel perfect copy.

screenshots >> ./specs/screenshots

Screens needed:
- onboarding screen (make basic settings the first time)
- dashboard/home (graphs and next shifts, etc.)
- shift-list screen (inlcuding a small calendar view of the current month)
- add-shift screen
- shift-detail screen
- settings screen (where everything can be changed)
- budget-income screen (overview of incoming, outgoing transactions)
- take-tipp-out-of-bucket screen