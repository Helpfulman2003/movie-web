import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getEmployees,
  getEmployeeById,
  updateEmployeeApi,
  deleteEmployee,
  addEmployee,
} from '../../api/employeeApi';

// Async thunks
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async (_, thunkAPI) => {
  try {
    return await getEmployees();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchEmployeeById = createAsyncThunk('employees/fetchEmployeeById', async (employeeId, thunkAPI) => {
  try {
    return await getEmployeeById(employeeId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const addEmployeeThunk = createAsyncThunk('employees/addEmployee', async (newEmployeeData, thunkAPI) => {
  try {
    return await addEmployee(newEmployeeData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateEmployeeThunk = createAsyncThunk(
  'employees/updateEmployee',
  async ({ employeeId, updatedData }, thunkAPI) => {
    try {
      return await updateEmployeeApi(employeeId, updatedData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const deleteEmployeeThunk = createAsyncThunk('employees/deleteEmployee', async (employeeId, thunkAPI) => {
  try {
    return await deleteEmployee(employeeId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Employee slice
const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    employee: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch employee by ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload.data;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add employee
      .addCase(addEmployeeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployeeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(addEmployeeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update employee
      .addCase(updateEmployeeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        state.loading = false;
        console.log('action.payload.data', action.payload.data);
        state.employee = { ...state.employee, ...action.payload.data };
        state.error = null;
      })
      .addCase(updateEmployeeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete employee
      .addCase(deleteEmployeeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter((emp) => emp._id !== action.payload._id);
      })
      .addCase(deleteEmployeeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;