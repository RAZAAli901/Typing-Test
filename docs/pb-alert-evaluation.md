# Personal Best Beat Alert Evaluation

## Feature Concept: "Someone Just Beat Your Personal Best" Alert
- **Goal**: Notify authenticated users in real time whenever another player submits a higher score in the mode where the logged-in user previously held top rank or a personal best score.
- **Trigger**: Client-side comparison in `useLeaderboardRealtime` or global notification wrapper comparing incoming `netWpm` against user's stored personal best.
- **Visual Styling**: Amber retro CRT toast notification styled consistently with existing retro alert components (`bg-amber-500/20 border-amber-500`).
- **Filtering**: IGNORES scores submitted by the user themselves and scores that do not exceed the user's personal best threshold.
