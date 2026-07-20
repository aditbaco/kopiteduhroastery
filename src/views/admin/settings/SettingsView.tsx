'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Typography from '@mui/material/Typography'

// Type Imports
import type { AdminVarietal } from '@/libs/admin/varietals/read'

// Component Imports
import ReferencesPanel from './ReferencesPanel'

type Props = {
  varietals: AdminVarietal[]
}

const SettingsView = ({ varietals }: Props) => {
  const [tab, setTab] = useState('company')

  return (
    <div className='flex flex-col gap-5'>
      <Typography variant='h4'>Pengaturan</Typography>

      <TabContext value={tab}>
        <TabList onChange={(_, value: string) => setTab(value)} aria-label='Bagian pengaturan'>
          <Tab value='company' label='Perusahaan' />
          <Tab value='references' label='Referensi' />
        </TabList>

        {/* TabPanel ships with its own padding; the panels below manage their
            own spacing, so it is zeroed here. */}
        <TabPanel value='company' className='p-0 pbs-5'>
          <Card>
            <CardContent className='flex flex-col items-center gap-2 text-center plb-12'>
              <i className='tabler-tools text-[2.5rem] text-textDisabled' />
              <Typography variant='h6'>Dalam pengembangan</Typography>
              <Typography variant='body2' color='text.secondary' className='max-is-[42ch]'>
                Detail perusahaan — nama, alamat, jam buka, kontak — masih dibaca dari
                <code className='mli-1'>src/configs/shopConfig.ts</code>. Bagian ini akan menggantikannya.
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value='references' className='p-0 pbs-5'>
          <ReferencesPanel varietals={varietals} />
        </TabPanel>
      </TabContext>
    </div>
  )
}

export default SettingsView
