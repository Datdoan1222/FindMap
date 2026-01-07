import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'; // Import createAsyncThunk
import database from '@react-native-firebase/database';

// --- Async Thunks ---

// Fetches posts ONCE. Listener logic should ideally be in a component.
export const fetchPostsShareRoom = createAsyncThunk(
  'posts/fetchPostsShareRoom',
  async (_, {rejectWithValue}) => {
    // Added rejectWithValue for better error handling pattern
    try {
      const snapshot = await database().ref('/postsShareRoom').once('value');
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
  'postsShareRoom/toggleLike',
  async ({postId, userId}, {rejectWithValue}) => {
    try {
      const likeRef = database().ref(
        `postsShareRoom/${postId}/likes/${userId}`,
      );
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

export const addPostShareRoom = createAsyncThunk(
  'postsShareRoom/addPost',
  async (postData, {rejectWithValue}) => {
    try {
      // Tạo một ID mới
      const newPostRef = database().ref('/postsShareRoom').push();

      const newPost = {
        ...postData,
        createdAt: new Date().toISOString(),
        likes: {}, // Mặc định không có like
      };

      await newPostRef.set(newPost);

      // Trả về dữ liệu để cập nhật state (nếu cần)
      return {id: newPostRef.key, ...newPost};
    } catch (error) {
      console.error('Add Post Error:', error.message);
      return rejectWithValue(error.message);
    }
  },
);
export const deletePostShareRoom = createAsyncThunk(
  'postsShareRoom/deletePost',
  async (postId, {dispatch, rejectWithValue}) => {
    try {
      await database().ref(`/postsShareRoom/${postId}`).remove();
      // Nếu xóa thành công thì dispatch action removePost để update store
      dispatch(removePost(postId));
      return postId;
    } catch (error) {
      console.error('Delete Post Error:', error.message);
      return rejectWithValue(error.message);
    }
  },
);

// --- Slice Definition ---

const postShareRoomSlide = createSlice({
  name: 'postsShareRoomData',
  initialState: {
    postsShareRoomData: [], // Consistent property name
    error: null,
    loading: false,
  },
  reducers: {
    // Reducer to update posts, potentially used by a listener managed elsewhere
    updatePosts(state, action) {
      state.postsShareRoomData = action.payload;
      state.loading = false; // Assuming listener provides full updates
      state.error = null;
    },
    // Removed fetchPostsStart, fetchPostsSuccess, fetchPostsFail as createAsyncThunk handles these states
    // Removed unused setPosts
    removePost(state, action) {
      const postId = action.payload;
      state.postsShareRoomData = state.postsShareRoomData.filter(
        post => post.id !== postId,
      );
    },
  },
  extraReducers: builder => {
    builder
      // Handle fetchPosts lifecycle actions
      .addCase(fetchPostsShareRoom.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsShareRoom.fulfilled, (state, action) => {
        state.postsShareRoomData = action.payload; // Use state.posts
        state.loading = false;
      })
      .addCase(fetchPostsShareRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Payload comes from rejectWithValue
      })
      // Handle toggleLike lifecycle actions
      .addCase(toggleLike.fulfilled, (state, action) => {
        const {postId, userId, liked} = action.payload;
        // Use state.posts consistently
        const postIndex = state.postsShareRoomData.findIndex(
          p => p.id === postId,
        );
        if (postIndex === -1) return; // Post not found

        const postsShareRoomData = state.postsShareRoomData[postIndex];

        // Ensure likes object exists
        if (!postsShareRoomData.likes) {
          postsShareRoomData.likes = {};
        }

        // Immer allows direct mutation syntax here
        if (liked) {
          postsShareRoomData.likes[userId] = true;
        } else {
          delete postsShareRoomData.likes[userId];
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        // Optionally handle toggle like errors in the state
        console.error('Toggle like failed:', action.payload);
        state.error = `Failed to toggle like for post ${action.payload?.postId}: ${action.payload?.error}`;
      })
      .addCase(addPostShareRoom.fulfilled, (state, action) => {
        // Thêm bài viết mới vào đầu danh sách
        state.postsShareRoomData.unshift(action.payload);
      })
      .addCase(addPostShareRoom.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Export the new reducer if needed (e.g., for listener updates)
export const {updatePosts, removePost} = postShareRoomSlide.actions;
export default postShareRoomSlide.reducer;

// Note: fetchPosts and toggleLike are already exported as named exports above
