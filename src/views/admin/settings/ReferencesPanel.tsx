'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

// Type Imports
import type { AdminVarietal } from '@/libs/admin/varietals/read'

// Component Imports
import VarietalTable from './VarietalTable'

type Props = {
  varietals: AdminVarietal[]
}

/*
 * The left rail is data-driven even though it holds a single entry today.
 * Grind options and tasting-note vocabulary are the obvious next two, and this
 * shape means adding one is an entry plus a panel rather than a rewrite.
 */
const REFERENCE_TYPES = [{ key: 'varietal', label: 'Varietas', hint: 'Varietas kopi yang dipakai produk' }] as const

type ReferenceKey = (typeof REFERENCE_TYPES)[number]['key']

const ReferencesPanel = ({ varietals }: Props) => {
  const [selected, setSelected] = useState<ReferenceKey>('varietal')

  return (
    <Grid container spacing={5}>
      <Grid size={{ xs: 12, md: 4, lg: 3 }}>
        <Card>
          <Typography variant='h6' className='pli-5 pbs-5'>
            Jenis referensi
          </Typography>
          <List component='nav' aria-label='Jenis referensi'>
            {REFERENCE_TYPES.map(type => (
              <ListItemButton
                key={type.key}
                selected={selected === type.key}
                onClick={() => setSelected(type.key)}
              >
                <ListItemText primary={type.label} secondary={type.hint} />
              </ListItemButton>
            ))}
          </List>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 8, lg: 9 }}>{selected === 'varietal' && <VarietalTable rows={varietals} />}</Grid>
    </Grid>
  )
}

export default ReferencesPanel
