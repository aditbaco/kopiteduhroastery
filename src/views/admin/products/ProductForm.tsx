'use client'

// React Imports
import { useActionState, useState } from 'react'
import type { ReactNode } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// Type Imports
import type { ProductFormState } from '@/app/(dashboard)/admin/products/actions'
import type { AdminProductDetail, VarietalOption } from '@/libs/admin/products/read'
import type { TastingNoteRow, VariantRow } from './types'

// Component Imports
import AdminField from '../AdminField'
import HeroImageField from './HeroImageField'
import TastingNoteRows from './TastingNoteRows'
import VariantRows, { emptyVariant } from './VariantRows'

// Dictionary Imports
import dict from '@/dictionaries/id'

// Util Imports
import { fieldProps, newRowKey } from '../formHelpers'

type Props = {
  title: string
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>
  varietals: VarietalOption[]
  product?: AdminProductDetail
}

const toVariantRows = (product?: AdminProductDetail): VariantRow[] => {
  if (!product || product.variants.length === 0) {
    return [emptyVariant(0)]
  }

  return product.variants.map(variant => ({
    key: newRowKey(),
    id: variant.id,
    weightG: String(variant.weightG),
    priceIdr: String(variant.priceIdr),
    sku: variant.sku,
    isDefault: variant.isDefault,
    isActive: variant.isActive,
    sortOrder: String(variant.sortOrder)
  }))
}

const toTastingNoteRows = (product?: AdminProductDetail): TastingNoteRow[] =>
  (product?.tastingNotes ?? []).map(note => ({
    key: newRowKey(),
    id: note.id,
    label: note.label,
    labelEn: note.labelEn ?? '',
    sortOrder: String(note.sortOrder)
  }))

// Cards carry their own heading so the form reads as a stack of named groups
// rather than one undifferentiated wall of inputs.
const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <Card>
    <CardContent className='flex flex-col gap-4'>
      <Typography variant='h6'>{title}</Typography>
      {children}
    </CardContent>
  </Card>
)

const ProductForm = ({ title, action, varietals, product }: Props) => {
  const [state, formAction, isPending] = useActionState(action, {})

  const [variants, setVariants] = useState<VariantRow[]>(() => toVariantRows(product))
  const [tastingNotes, setTastingNotes] = useState<TastingNoteRow[]>(() => toTastingNoteRows(product))
  const [varietalIds, setVarietalIds] = useState<number[]>(() => product?.varietals.map(link => link.varietalId) ?? [])
  const [isActive, setIsActive] = useState(product?.isActive ?? true)
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false)

  const errors = state.fieldErrors

  // _form catches anything that has no field to land on — an unrecognised
  // unique constraint, say. Without this it would fail silently.
  const formLevelError = state.formError ?? errors?._form?.[0]

  return (
    <form action={formAction} className='flex flex-col gap-5'>
      <Typography variant='h4'>{title}</Typography>

      {formLevelError && <Alert severity='error'>{formLevelError}</Alert>}

      {/* Collections ride as JSON rather than indexed FormData keys, so the
          server needs one JSON.parse instead of bespoke reconstruction. */}
      <input type='hidden' name='variants' value={JSON.stringify(variants)} />
      <input type='hidden' name='tastingNotes' value={JSON.stringify(tastingNotes)} />
      <input type='hidden' name='varietalIds' value={JSON.stringify(varietalIds)} />
      <input type='hidden' name='isActive' value={isActive ? 'true' : 'false'} />
      <input type='hidden' name='isFeatured' value={isFeatured ? 'true' : 'false'} />

      {/*
       * Two columns: what the product *is* on the left, how it is published on
       * the right. The sidebar fields are the ones an editor changes without
       * reading the rest of the form, so they stay in view instead of being
       * buried under the descriptions.
       */}
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <div className='flex flex-col gap-5'>
            <Section title='Identitas'>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AdminField
                    required
                    label='Nama (ID)'
                    name='name'
                    defaultValue={product?.name ?? ''}
                    {...fieldProps('name', errors)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AdminField
                    label='Nama (EN)'
                    name='nameEn'
                    defaultValue={product?.nameEn ?? ''}
                    {...fieldProps('nameEn', errors)}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <AdminField
                    required
                    label='Slug'
                    name='slug'
                    defaultValue={product?.slug ?? ''}
                    placeholder='arabika-sulawesi-lore'
                    {...fieldProps('slug', errors)}
                    helperText={errors?.slug?.[0] ?? 'Dipakai di URL halaman produk'}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <AdminField
                    label='Deskripsi singkat (ID)'
                    name='shortDesc'
                    defaultValue={product?.shortDesc ?? ''}
                    {...fieldProps('shortDesc', errors)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AdminField
                    label='Deskripsi singkat (EN)'
                    name='shortDescEn'
                    defaultValue={product?.shortDescEn ?? ''}
                    {...fieldProps('shortDescEn', errors)}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <AdminField
                    required
                    multiline
                    minRows={5}
                    label='Deskripsi (ID)'
                    name='description'
                    defaultValue={product?.description ?? ''}
                    {...fieldProps('description', errors)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AdminField
                    multiline
                    minRows={5}
                    label='Deskripsi (EN)'
                    name='descriptionEn'
                    defaultValue={product?.descriptionEn ?? ''}
                    {...fieldProps('descriptionEn', errors)}
                  />
                </Grid>
              </Grid>
            </Section>

            <Section title='Asal & karakter'>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <AdminField
                    required
                    label='Asal'
                    name='origin'
                    defaultValue={product?.origin ?? ''}
                    {...fieldProps('origin', errors)}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <AdminField
                    required
                    label='Kabupaten'
                    name='regency'
                    defaultValue={product?.regency ?? ''}
                    {...fieldProps('regency', errors)}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <AdminField
                    required
                    label='Provinsi'
                    name='province'
                    defaultValue={product?.province ?? 'Sulawesi Tengah'}
                    {...fieldProps('province', errors)}
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 3 }}>
                  <AdminField
                    required
                    type='number'
                    label='Ketinggian min'
                    name='altitudeMin'
                    defaultValue={product?.altitudeMin ?? ''}
                    {...fieldProps('altitudeMin', errors)}
                    helperText={errors?.altitudeMin?.[0] ?? 'mdpl'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <AdminField
                    required
                    type='number'
                    label='Ketinggian max'
                    name='altitudeMax'
                    defaultValue={product?.altitudeMax ?? ''}
                    {...fieldProps('altitudeMax', errors)}
                    helperText={errors?.altitudeMax?.[0] ?? 'mdpl'}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <AdminField
                    select
                    required
                    label='Jenis'
                    name='species'
                    defaultValue={product?.species ?? 'ARABICA'}
                    {...fieldProps('species', errors)}
                  >
                    {Object.entries(dict.species).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </AdminField>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <AdminField
                    select
                    required
                    label='Proses'
                    name='process'
                    defaultValue={product?.process ?? 'WASHED'}
                    {...fieldProps('process', errors)}
                  >
                    {Object.entries(dict.process).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </AdminField>
                </Grid>

                <Grid size={{ xs: 6, sm: 3 }}>
                  <AdminField
                    select
                    required
                    label='Sangrai'
                    name='roastLevel'
                    defaultValue={product?.roastLevel ?? 'MEDIUM'}
                    {...fieldProps('roastLevel', errors)}
                  >
                    {Object.entries(dict.roast).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </AdminField>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <AdminField
                    type='number'
                    label='Bermitra sejak'
                    name='partnerSince'
                    defaultValue={product?.partnerSince ?? ''}
                    {...fieldProps('partnerSince', errors)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AdminField
                    label='Petani / produsen'
                    name='producer'
                    defaultValue={product?.producer ?? ''}
                    {...fieldProps('producer', errors)}
                  />
                </Grid>
                {/* Varietal sits with the rest of the character fields rather
                    than in its own sidebar card — it describes the coffee, not
                    how it is published. */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AdminField
                    select
                    label='Varietas'
                    value={varietalIds}
                    onChange={event => setVarietalIds((event.target.value as unknown as number[]).map(Number))}
                    slotProps={{ select: { multiple: true } }}
                  >
                    {varietals.map(varietal => (
                      <MenuItem key={varietal.id} value={varietal.id}>
                        {varietal.name}
                      </MenuItem>
                    ))}
                  </AdminField>
                </Grid>
              </Grid>
            </Section>

            <Card>
              <CardContent>
                <VariantRows rows={variants} onChange={setVariants} fieldErrors={errors} />
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <TastingNoteRows rows={tastingNotes} onChange={setTastingNotes} fieldErrors={errors} />
              </CardContent>
            </Card>
          </div>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Sticks alongside the long left column on wide screens; on narrow
              ones it is just the last block in the stack. */}
          <Box sx={{ position: { lg: 'sticky' }, insetBlockStart: theme => theme.spacing(6) }}>
            <div className='flex flex-col gap-5'>
              <Section title='Publikasi'>
                <div className='flex flex-col'>
                  <FormControlLabel
                    control={<Checkbox checked={isActive} onChange={event => setIsActive(event.target.checked)} />}
                    label='Aktif (tampil di katalog)'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={isFeatured} onChange={event => setIsFeatured(event.target.checked)} />}
                    label='Unggulan (tampil di beranda)'
                  />
                </div>
                <AdminField
                  type='number'
                  label='Urutan tampil'
                  name='sortOrder'
                  defaultValue={product?.sortOrder ?? 0}
                  {...fieldProps('sortOrder', errors)}
                />
              </Section>

              <Section title='Foto'>
                <HeroImageField currentImage={product?.heroImage ?? null} error={errors?.heroImage?.[0]} />
              </Section>
            </div>
          </Box>
        </Grid>
      </Grid>

      {/* The form is taller than a viewport, so the actions follow the scroll
          rather than making the editor hunt for them at the bottom. */}
      <Box
        sx={{
          position: 'sticky',
          insetBlockEnd: 0,
          zIndex: 5,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 3,
          paddingBlock: 4,
          backgroundColor: 'var(--mui-palette-background-default)',
          borderBlockStart: '1px solid var(--mui-palette-divider)'
        }}
      >
        <Button variant='tonal' color='secondary' component={Link} href='/admin/products'>
          Batal
        </Button>
        <Button type='submit' variant='contained' disabled={isPending}>
          {isPending ? 'Menyimpan…' : 'Simpan produk'}
        </Button>
      </Box>
    </form>
  )
}

export default ProductForm
