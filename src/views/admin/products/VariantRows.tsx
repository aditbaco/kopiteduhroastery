'use client'

// MUI Imports
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Radio from '@mui/material/Radio'
import Typography from '@mui/material/Typography'

// Type Imports
import type { FieldErrors } from '@/libs/admin/shared/result'
import type { VariantRow } from './types'

// Component Imports
import AdminField from '../AdminField'

// Util Imports
import { fieldProps, newRowKey } from '../formHelpers'

type Props = {
  rows: VariantRow[]
  onChange: (rows: VariantRow[]) => void
  fieldErrors?: FieldErrors
}

export const emptyVariant = (sortOrder: number): VariantRow => ({
  key: newRowKey(),
  weightG: '',
  priceIdr: '',
  sku: '',
  isDefault: false,
  isActive: true,
  sortOrder: String(sortOrder)
})

const VariantRows = ({ rows, onChange, fieldErrors }: Props) => {
  const update = (index: number, patch: Partial<VariantRow>) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)))

  // Exactly one default, mirrored from the server's own normalization so the
  // form never shows a state the database would silently rewrite.
  const setDefault = (index: number) => onChange(rows.map((row, i) => ({ ...row, isDefault: i === index })))

  const remove = (index: number) => onChange(rows.filter((_, i) => i !== index))

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between items-center gap-4 flex-wrap'>
        <div>
          <Typography variant='h6'>Varian</Typography>
          <Typography variant='body2' color='text.secondary'>
            Berat dan harga yang bisa dibeli. Minimal satu varian.
          </Typography>
        </div>
        <Button
          variant='tonal'
          size='small'
          startIcon={<i className='tabler-plus' />}
          onClick={() => onChange([...rows, emptyVariant(rows.length)])}
        >
          Tambah varian
        </Button>
      </div>

      {fieldErrors?.variants && (
        <Typography variant='body2' color='error'>
          {fieldErrors.variants[0]}
        </Typography>
      )}

      {/* One grid row per variant: the fields reflow onto two lines on narrow
          screens instead of overflowing the card. */}
      {rows.map((row, index) => (
        <Grid key={row.key} container spacing={3} className='items-start border rounded pli-3 plb-4'>
          <Grid size={{ xs: 4, sm: 2 }}>
            <AdminField
              label='Berat (g)'
              type='number'
              value={row.weightG}
              onChange={event => update(index, { weightG: event.target.value })}
              {...fieldProps(`variants.${index}.weightG`, fieldErrors)}
            />
          </Grid>
          <Grid size={{ xs: 8, sm: 4 }}>
            <AdminField
              label='Harga (Rp)'
              type='number'
              value={row.priceIdr}
              onChange={event => update(index, { priceIdr: event.target.value })}
              {...fieldProps(`variants.${index}.priceIdr`, fieldErrors)}
            />
          </Grid>
          <Grid size={{ xs: 8, sm: 4 }}>
            <AdminField
              label='SKU'
              value={row.sku}
              onChange={event => update(index, { sku: event.target.value })}
              {...fieldProps(`variants.${index}.sku`, fieldErrors)}
            />
          </Grid>
          <Grid size={{ xs: 4, sm: 2 }}>
            <AdminField
              label='Urutan'
              type='number'
              value={row.sortOrder}
              onChange={event => update(index, { sortOrder: event.target.value })}
              {...fieldProps(`variants.${index}.sortOrder`, fieldErrors)}
            />
          </Grid>

          {/* The flags get their own strip: squeezed onto the field line they
              left the three controls sharing ~130px. */}
          <Grid size={{ xs: 12 }}>
            <div className='flex items-center gap-2 flex-wrap'>
              <FormControlLabel
                control={<Radio size='small' checked={row.isDefault} onChange={() => setDefault(index)} />}
                label='Utama'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size='small'
                    checked={row.isActive}
                    onChange={event => update(index, { isActive: event.target.checked })}
                  />
                }
                label='Aktif'
              />
              <IconButton
                size='small'
                color='error'
                className='mis-auto'
                onClick={() => remove(index)}
                aria-label='Hapus varian'
              >
                <i className='tabler-trash' />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      ))}
    </div>
  )
}

export default VariantRows
