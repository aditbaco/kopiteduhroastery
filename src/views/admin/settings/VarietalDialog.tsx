'use client'

// React Imports
import { useActionState, useEffect } from 'react'

// MUI Imports
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

// Type Imports
import type { AdminVarietal } from '@/libs/admin/varietals/read'

// Action Imports
import { saveVarietalAction } from '@/app/(dashboard)/admin/settings/actions'

// Component Imports
import AdminField from '../AdminField'

// Util Imports
import { fieldProps } from '../formHelpers'

type Props = {

  // null = adding a new varietal
  varietal: AdminVarietal | null
  onClose: () => void
}

const VarietalDialog = ({ varietal, onClose }: Props) => {
  // The id is bound here, server-side, rather than travelling in the form —
  // the same rule the product editor follows.
  const [state, formAction, isPending] = useActionState(saveVarietalAction.bind(null, varietal?.id ?? null), {})

  const formLevelError = state.formError ?? state.fieldErrors?._form?.[0]

  // The action cannot close the dialog itself, so the component reacts to a
  // successful save instead. savedAt changes on every success, which a boolean
  // would not.
  useEffect(() => {
    if (state.savedAt) {
      onClose()
    }
  }, [state.savedAt, onClose])

  return (
    <Dialog open fullWidth maxWidth='xs' onClose={onClose}>
      <form action={formAction}>
        <DialogTitle>{varietal ? 'Ubah varietas' : 'Tambah varietas'}</DialogTitle>

        <DialogContent className='flex flex-col gap-4'>
          {formLevelError && <Alert severity='error'>{formLevelError}</Alert>}

          <AdminField
            required
            autoFocus
            label='Nama'
            name='name'
            defaultValue={varietal?.name ?? ''}
            {...fieldProps('name', state.fieldErrors)}
          />
          <AdminField
            label='Nama (EN)'
            name='nameEn'
            defaultValue={varietal?.nameEn ?? ''}
            {...fieldProps('nameEn', state.fieldErrors)}
          />
          <AdminField
            required
            label='Slug'
            name='slug'
            defaultValue={varietal?.slug ?? ''}
            placeholder='sigararutang'
            {...fieldProps('slug', state.fieldErrors)}
            helperText={state.fieldErrors?.slug?.[0] ?? 'Huruf kecil, angka, dan tanda hubung'}
          />
        </DialogContent>

        <DialogActions>
          <Button variant='tonal' color='secondary' onClick={onClose}>
            Batal
          </Button>
          <Button type='submit' variant='contained' disabled={isPending}>
            {isPending ? 'Menyimpan…' : 'Simpan'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default VarietalDialog
