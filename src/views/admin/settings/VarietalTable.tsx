'use client'

// React Imports
import { useState, useTransition } from 'react'

// MUI Imports
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// Type Imports
import type { AdminVarietal } from '@/libs/admin/varietals/read'

// Action Imports
import { deleteVarietalAction } from '@/app/(dashboard)/admin/settings/actions'

// Component Imports
import VarietalDialog from './VarietalDialog'

type Props = {
  rows: AdminVarietal[]
}

const VarietalTable = ({ rows }: Props) => {
  const [pending, startTransition] = useTransition()
  const [editing, setEditing] = useState<AdminVarietal | null | undefined>(undefined)
  const [target, setTarget] = useState<AdminVarietal | null>(null)
  const [error, setError] = useState<string | null>(null)

  // `undefined` means the dialog is closed; `null` means it is open for a new
  // row. Collapsing those two into one nullable would lose the distinction.
  const dialogOpen = editing !== undefined

  const confirmDelete = () => {
    if (!target) {
      return
    }

    startTransition(async () => {
      const result = await deleteVarietalAction(target.id)

      setTarget(null)
      setError(result.formError ?? result.fieldErrors?._form?.[0] ?? null)
    })
  }

  return (
    <>
      <Card>
        <CardContent className='flex justify-between items-center gap-4 flex-wrap'>
          <div>
            <Typography variant='h6'>Varietas</Typography>
            <Typography variant='body2' color='text.secondary'>
              {rows.length} varietas terdaftar
            </Typography>
          </div>
          <Button
            variant='contained'
            size='small'
            startIcon={<i className='tabler-plus' />}
            onClick={() => setEditing(null)}
          >
            Tambah varietas
          </Button>
        </CardContent>

        {error && (
          <Alert severity='error' onClose={() => setError(null)} className='mli-6 mbe-4'>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>Nama (EN)</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Dipakai</TableCell>
                <TableCell align='right'>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography className='text-center plb-6' color='text.secondary'>
                      Belum ada varietas.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {rows.map(row => {
                const inUse = row._count.products

                return (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Typography color='text.primary'>{row.name}</Typography>
                    </TableCell>
                    <TableCell>{row.nameEn ?? '—'}</TableCell>
                    <TableCell>
                      <Typography variant='caption' color='text.secondary'>
                        {row.slug}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={inUse > 0 ? 'primary' : 'secondary'}
                        label={`${inUse} produk`}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton size='small' onClick={() => setEditing(row)} aria-label={`Ubah ${row.name}`}>
                        <i className='tabler-edit' />
                      </IconButton>
                      {/* Disabled is a courtesy — the server refuses the same
                          delete, because the FK cascade would otherwise strip
                          this varietal from every product silently. A span is
                          needed for the tooltip to fire on a disabled button. */}
                      <Tooltip title={inUse > 0 ? `Dipakai ${inUse} produk` : 'Hapus'}>
                        <span>
                          <IconButton
                            size='small'
                            color='error'
                            disabled={inUse > 0}
                            onClick={() => setTarget(row)}
                            aria-label={`Hapus ${row.name}`}
                          >
                            <i className='tabler-trash' />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {dialogOpen && <VarietalDialog varietal={editing} onClose={() => setEditing(undefined)} />}

      <Dialog open={Boolean(target)} onClose={() => setTarget(null)}>
        <DialogTitle>Hapus varietas?</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{target?.name}</strong> akan dihapus permanen.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='tonal' color='secondary' onClick={() => setTarget(null)}>
            Batal
          </Button>
          <Button variant='contained' color='error' onClick={confirmDelete} disabled={pending}>
            {pending ? 'Menghapus…' : 'Hapus'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default VarietalTable
