export interface SettingsEditState {
  // For file input/profile picture
  selectedFile: File | null
  isUploading: boolean

  // Editing toggles
  editingUsername: boolean
  editingBio: boolean

  // Local values before saving (optional, for v-model)
  newUsernameValue: string
  bioValue: string
}