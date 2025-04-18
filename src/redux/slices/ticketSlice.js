import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTickets, addTicket, deleteTicket, collectTicketApi } from '../../api/ticketApi';

// Async thunks để gọi API
export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async () => {
  const data = await getTickets();
  return data;
});

export const addNewTicket = createAsyncThunk('tickets/addNewTicket', async (ticket) => {
  const data = await addTicket(ticket);
  return data;
});

export const removeTicket = createAsyncThunk('tickets/removeTicket', async (id) => {
  await deleteTicket(id);
  return id;
});

// Thu vé
export const collectTicket = createAsyncThunk(
  'tickets/collectTicket',
  async (id, { rejectWithValue }) => {
    try {
      const response = await collectTicketApi(id); // Gọi hàm từ ticketApi.js
      return response; // Trả về vé đã cập nhật
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// Tạo slice
const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch tickets
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tickets = action.payload?.data ?? [];
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add ticket
      .addCase(addNewTicket.fulfilled, (state, action) => {
        state.tickets.push(action.payload.data);
      })
      // Remove ticket
      .addCase(removeTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter((ticket) => ticket._id !== action.payload.data?._id);
      })
      // Collect ticket
      .addCase(collectTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex((ticket) => ticket._id === action.payload.data._id);
        if (index !== -1) {
          state.tickets[index] = action.payload.data;
        }
      });
  },
});

export default ticketSlice.reducer;