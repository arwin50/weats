// store/formSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormData {
  maxPrice: number;
  foodPreference: string;
  dietaryPreference: string;
  locationEnabled: boolean;
  locationCoords?: { lat: number; lng: number };
  wizardCompleted: boolean;
}

const initialState: FormData = {
  maxPrice: 75,
  foodPreference: "Surprise me, Choosee!",
  dietaryPreference: "Not choosy atm!",
  locationEnabled: false,
  locationCoords: { lat: 10.3157, lng: 123.8854 },
  wizardCompleted: false,
};

const promptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    setPromptData: (state, action: PayloadAction<Partial<FormData>>) => {
      Object.assign(state, action.payload);
    },
    resetPromptData: () => initialState,
    completeWizard: (state) => {
      state.wizardCompleted = true;
    },
  },
});

export const { setPromptData, resetPromptData, completeWizard } =
  promptSlice.actions;
export default promptSlice.reducer;
