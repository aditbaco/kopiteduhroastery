'use client'

// MUI Imports
import type { TextFieldProps } from '@mui/material/TextField'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Every input in the product editor goes through here, so form density is one
// edit rather than thirty. `fullWidth` is the default because the editor lays
// fields out on a grid — the row editors opt out with an explicit width class.
const AdminField = (props: TextFieldProps) => <CustomTextField size='small' fullWidth {...props} />

export default AdminField
