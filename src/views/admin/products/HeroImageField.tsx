'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'

// Constraint Imports
import { ACCEPT_ATTRIBUTE, ALLOWED_IMAGE_MIMES, MAX_IMAGE_BYTES } from '@/libs/admin/storage/constraints'

type Props = {
  currentImage: string | null
  error?: string
}

const HeroImageField = ({ currentImage, error }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [removed, setRemoved] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  // Object URLs leak until revoked, and a user can swap the file repeatedly.
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    // Client-side checks are for instant feedback only — the server re-validates
    // and sniffs the actual bytes, and that is the check that counts.
    if (file.size > MAX_IMAGE_BYTES) {
      setLocalError(`Ukuran gambar maksimal ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))}MB`)
      event.target.value = ''

      return
    }

    if (!ALLOWED_IMAGE_MIMES.includes(file.type)) {
      setLocalError('Format gambar harus JPG, PNG, atau WebP')
      event.target.value = ''

      return
    }

    setLocalError(null)
    setRemoved(false)
    setPreview(URL.createObjectURL(file))
  }

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }

    setPreview(null)
    setRemoved(true)
    setLocalError(null)
  }

  const shownImage = preview ?? (removed ? null : currentImage)
  const message = localError ?? error

  return (
    <div className='flex flex-col gap-3'>
      {/* Only the intent is submitted. The existing path is never sent back —
          the server resolves "keep" against the live row instead. */}
      <input type='hidden' name='removeHeroImage' value={removed ? 'true' : 'false'} />

      <div className='flex items-start gap-4 flex-wrap'>
        {/* Square, so the preview shows exactly the crop the storefront will
            render — a portrait box here would hide what 1:1 cuts off. */}
        <Box
          sx={{
            inlineSize: 132,
            aspectRatio: '1 / 1',
            borderRadius: 1,
            border: theme => `1px dashed ${theme.palette.divider}`,
            backgroundColor: 'action.hover',
            backgroundImage: shownImage ? `url(${shownImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {!shownImage && (
            <Typography variant='caption' color='text.disabled'>
              Belum ada foto
            </Typography>
          )}
        </Box>

        <div className='flex flex-col gap-2'>
          <Button variant='tonal' size='small' onClick={() => inputRef.current?.click()}>
            {shownImage ? 'Ganti foto' : 'Pilih foto'}
          </Button>

          {shownImage && (
            <Button variant='text' color='error' size='small' onClick={handleRemove}>
              Hapus foto
            </Button>
          )}

          <Typography variant='caption' color='text.disabled'>
            JPG, PNG, atau WebP. Maksimal {Math.round(MAX_IMAGE_BYTES / (1024 * 1024))}MB.
          </Typography>
          {/* The frames crop to 1:1 rather than the file being resized on
              upload, so a non-square photo loses its edges — say so here. */}
          <Typography variant='caption' color='text.disabled'>
            Gunakan rasio 1:1 (mis. 1000×1000). Foto non-persegi akan dipotong di bagian tengah.
          </Typography>
        </div>
      </div>

      <input
        ref={inputRef}
        type='file'
        name='heroImageFile'
        accept={ACCEPT_ATTRIBUTE}
        onChange={handleChange}
        className='hidden'
      />

      {message && <FormHelperText error>{message}</FormHelperText>}
    </div>
  )
}

export default HeroImageField
