# Supabase Realtime Presence Evaluation

## Feature Concept: "X Competitors Online Now"
- **Goal**: Track live concurrent active typists across `/play` and broadcast aggregate user counts to the Home page and Navbar header.
- **Technology**: Supabase Realtime Presence (`supabaseClient.channel('presence:play')`).
- **State Schema**:
  ```ts
  interface TypistPresenceState {
    username: string;
    mode: string;
    joinedAt: string;
  }
  ```
- **Fallback Strategy**: Graceful degradation (if Presence state is unavailable or untracked, count gracefully hides without throwing UI errors).
