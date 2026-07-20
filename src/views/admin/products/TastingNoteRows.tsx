'use client'

// MUI Imports
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// Type Imports
import type { FieldErrors } from '@/libs/admin/shared/result'
import type { TastingNoteRow } from './types'

// Component Imports
import AdminField from '../AdminField'

// Util Imports
import { fieldProps, newRowKey } from '../formHelpers'

type Props = {
  rows: TastingNoteRow[]
  onChange: (rows: TastingNoteRow[]) => void
  fieldErrors?: FieldErrors
}

export const emptyTastingNote = (sortOrder: number): TastingNoteRow => ({
  key: newRowKey(),
  label: '',
  labelEn: '',
  sortOrder: String(sortOrder)
})

const TastingNoteRows = ({ rows, onChange, fieldErrors }: Props) => {
  const update = (index: number, patch: Partial<TastingNoteRow>) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)))

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between items-center gap-4 flex-wrap'>
        <div>
          <Typography variant='h6'>Taste notes</Typography>
          <Typography variant='body2' color='text.secondary'>
            Ditampilkan berurutan di halaman produk.
          </Typography>
        </div>
        <Button
          variant='tonal'
          size='small'
          startIcon={<i className='tabler-plus' />}
          onClick={() => onChange([...rows, emptyTastingNote(rows.length)])}
        >
          Tambah catatan
        </Button>
      </div>

      {rows.map((row, index) => (
        <Grid key={row.key} container spacing={3} className='items-start'>
          <Grid size={{ xs: 12, sm: 5 }}>
            <AdminField
              label='Catatan (ID)'
              value={row.label}
              onChange={event => update(index, { label: event.target.value })}
              {...fieldProps(`tastingNotes.${index}.label`, fieldErrors)}
            />
          </Grid>
          <Grid size={{ xs: 8, sm: 4 }}>
            <AdminField
              label='Catatan (EN)'
              value={row.labelEn}
              onChange={event => update(index, { labelEn: event.target.value })}
              {...fieldProps(`tastingNotes.${index}.labelEn`, fieldErrors)}
            />
          </Grid>
          <Grid size={{ xs: 4, sm: 2 }}>
            <AdminField
              label='Urutan'
              type='number'
              value={row.sortOrder}
              onChange={event => update(index, { sortOrder: event.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 1 }}>
            <IconButton
              size='small'
              color='error'
              className='sm:mbs-6'
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
              aria-label='Hapus catatan'
            >
              <i className='tabler-trash' />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </div>
  )
}

export default TastingNoteRows
