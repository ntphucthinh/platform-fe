import React from 'react'
import { Box, Button } from '@mui/material'

export type ItineraryTabKey = 'overview' | 'day-1' | 'day-2' | 'day-3'

interface ItineraryDayTabsProps {
  activeTab: ItineraryTabKey
  onSelectTab: (tab: ItineraryTabKey) => void
  dayCount: number
}

export const ItineraryDayTabs: React.FC<ItineraryDayTabsProps> = ({
  activeTab,
  onSelectTab,
  dayCount,
}) => {
  const tabs: Array<{ key: ItineraryTabKey; label: string }> = [
    { key: 'overview', label: 'Tổng quan' },
    ...Array.from({ length: dayCount }, (_, idx) => {
      const num = idx + 1
      return {
        key: `day-${num}` as ItineraryTabKey,
        label: `Ngày ${num}`,
      }
    }),
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        overflowX: 'auto',
        pb: 0.5,
        '::-webkit-scrollbar': {
          height: 4,
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#CBD5E1',
          borderRadius: 2,
        },
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <Button
            key={tab.key}
            variant="contained"
            onClick={() => onSelectTab(tab.key)}
            sx={{
              minWidth: { xs: 90, sm: 110 },
              px: { xs: 2.5, sm: 3 },
              py: 1,
              borderRadius: '24px',
              fontSize: '0.9rem',
              fontWeight: 700,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              boxShadow: 'none',
              bgcolor: isActive ? 'primary.main' : '#F1F5F9',
              color: isActive ? '#FFFFFF' : '#475569',
              border: isActive ? '1px solid transparent' : '1px solid #E2E8F0',
              '&:hover': {
                bgcolor: isActive ? 'primary.dark' : '#E2E8F0',
                boxShadow: 'none',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {tab.label}
          </Button>
        )
      })}
    </Box>
  )
}
