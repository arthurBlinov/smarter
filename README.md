# Smarter
Smarter is an intuitive expense management app designed to help users organize their finances.

## Features

### Key Functionalities
- **Expense Tracking**: Log your daily expenses with just a few taps.
- **Calendar Integration**: Visualize expenses on a calendar to identify spending patterns.
- **Monthly Summaries**: View detailed breakdowns and insights for each month.
- **Local Storage**: All data is securely stored locally on your device using SQLite.
- **Dynamic Animations**: Enjoy smooth animations for better user experience.
- **Offline Capability**: Record and view expenses even without an internet connection.

### Screens
**Start Screen**
- User inputs their name to personalize the app experience.
- Includes dynamic animations for a welcoming user interaction.
**Home Screen**
- Displays the user’s name and a quick navigation button to expense management features.
**Calendar Screen**
- Month-view calendar with marked dates for logged expenses.
- Allows users to navigate between months and select specific dates for detailed insights.
**Add Expense Screen**
- Log expenses with fields for amount, category, and notes.
- Input validations ensure accurate data entry.
**Monthly Expenses Screen**
- Summarizes monthly spending with detailed reports.
- Graphical visualizations for easy analysis of financial trends.

### State Management
- Implemented using `useReducer` for predictable and maintainable state management.
- Context API for global state management.

### Technical Highlights
- **Local Database**: SQLite is used for storing and managing expense records.
- **Animations**: Leveraged React Native’s Animated API for smooth transitions and effects.
- **RTL Support**: Fully supports right-to-left languages.

## Installation

**Clone the repository:**
- git clone https://github.com/arthurBlinov/smarter.git

**Install dependencies:**
- npm install

**Start the development server:**
- npx expo start
