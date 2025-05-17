import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'; // Import createAsyncThunk
import database from '@react-native-firebase/database';

// --- Async Thunks ---

// Fetches posts ONCE. Listener logic should ideally be in a component.
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, {rejectWithValue}) => {
    // Added rejectWithValue for better error handling pattern
    try {
      const snapshot = await database().ref('/posts').once('value');
      const data = snapshot.val();
      const posts = data
        ? Object.keys(data).map(key => ({id: key, ...data[key]}))
        : [];
      return posts; // Return the data for the fulfilled action
    } catch (error) {
      console.error('Fetch Posts Error:', error.message);
      // Use rejectWithValue to send a standardized error payload
      return rejectWithValue(error.message);
    }
  },
);

// Thunk for toggling likes remains largely the same, added try/catch
export const toggleLike = createAsyncThunk(
  'posts/toggleLike',
  async ({postId, userId}, {rejectWithValue}) => {
    try {
      const likeRef = database().ref(`posts/${postId}/likes/${userId}`);
      const snapshot = await likeRef.once('value');

      if (snapshot.exists()) {
        await likeRef.remove();
        return {postId, userId, liked: false};
      } else {
        await likeRef.set(true);
        return {postId, userId, liked: true};
      }
    } catch (error) {
      console.error('Toggle Like Error:', error.message);
      return rejectWithValue({postId, userId, error: error.message}); // Include context in error
    }
  },
);

// --- Slice Definition ---

const postsSlice = createSlice({
  name: 'postsData',
  initialState: {
    posts: [], // Consistent property name
    error: null,
    loading: false,
  },
  reducers: {
    // Reducer to update posts, potentially used by a listener managed elsewhere
    updatePosts(state, action) {
      state.posts = action.payload;
      state.loading = false; // Assuming listener provides full updates
      state.error = null;
    },
    // Removed fetchPostsStart, fetchPostsSuccess, fetchPostsFail as createAsyncThunk handles these states
    // Removed unused setPosts
  },
  extraReducers: builder => {
    builder
      // Handle fetchPosts lifecycle actions
      .addCase(fetchPosts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload; // Use state.posts
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Payload comes from rejectWithValue
      })
      // Handle toggleLike lifecycle actions
      .addCase(toggleLike.fulfilled, (state, action) => {
        const {postId, userId, liked} = action.payload;
        // Use state.posts consistently
        const postIndex = state.posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return; // Post not found

        const post = state.posts[postIndex];

        // Ensure likes object exists
        if (!post.likes) {
          post.likes = {};
        }

        // Immer allows direct mutation syntax here
        if (liked) {
          post.likes[userId] = true;
        } else {
          delete post.likes[userId];
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        // Optionally handle toggle like errors in the state
        console.error('Toggle like failed:', action.payload);
        state.error = `Failed to toggle like for post ${action.payload?.postId}: ${action.payload?.error}`;
      });
  },
});

// Export the new reducer if needed (e.g., for listener updates)
export const {updatePosts} = postsSlice.actions;
export default postsSlice.reducer;

// Note: fetchPosts and toggleLike are already exported as named exports above
