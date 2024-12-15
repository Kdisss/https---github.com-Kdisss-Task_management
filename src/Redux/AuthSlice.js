import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, setBaseUrl, setAuthHeader } from "src/api/api";  


export const login = createAsyncThunk("auth/login", async (userData) => {
    setBaseUrl('user'); 
    try {
        const { data } = await api.post("/auth/signin", userData);  // Make API call to the user service
        localStorage.setItem("jwt", data.jwt);  // Store the JWT in localStorage
        console.log("Login Successful", data);
        return data;
    } catch (error) {
        console.log("catch error", error);
        throw Error(error.response?.data?.error || error.message);
    }
});


export const register = createAsyncThunk("auth/register", async (userData) => {
    setBaseUrl('user');  // Set the base URL for the user service
    try {
        const { data } = await api.post("/auth/signup", userData);  // Make API call to the user service
        localStorage.setItem("jwt", data.jwt);  // Store the JWT in localStorage
        console.log("Register Successful", data);
        return data;
    } catch (error) {
        console.log("catch error", error);
        throw Error(error.response?.data?.error || error.message);
    }
});


export const logout = createAsyncThunk("auth/logout", async () => {
    try {
        localStorage.clear();  // Clear JWT from localStorage
        console.log("Logged out successfully");
    } catch (error) {
        console.log("catch error", error);
        throw Error(error.response?.data?.error || error.message);
    }
});


export const getUserProfile = createAsyncThunk("auth/getUserProfile", async (jwt) => {
    setBaseUrl('user');  // Set the base URL for the user service
    setAuthHeader(jwt);  // Set the Authorization header with the JWT
    try {
        const { data } = await api.get("/api/users/profile");  // Make API call to get the user profile
        console.log("User Profile Successful", data);
        return data;
    } catch (error) {
        console.log("catch error", error);
        throw Error(error.response?.data?.error || error.message);
    }
});


export const getUserList = createAsyncThunk("auth/getUserList", async (jwt) => {
    setBaseUrl('user');  // Set the base URL for the user service
    setAuthHeader(jwt);  // Set the Authorization header with the JWT
    try {
        const { data } = await api.get("/auth/users");  // Make API call to get the list of users
        console.log("getUserList Successful", data);
        return data;
    } catch (error) {
        console.log("catch error", error);
        throw Error(error.response?.data?.error || error.message);
    }
});


const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loggedIn: false,
        loading: false,
        error: null,
        jwt: null,
        users: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.jwt = action.payload.jwt;
                state.loggedIn = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.jwt = action.payload.jwt;
                state.loggedIn = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.loggedIn = true;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(getUserList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserList.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                state.loggedIn = true;
            })
            .addCase(getUserList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.error = null;
                state.jwt = null;
                state.users = [];
                state.loggedIn = false;
            });
    }
});

export default authSlice.reducer;
