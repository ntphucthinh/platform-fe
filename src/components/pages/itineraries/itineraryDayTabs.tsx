import React, { useRef, useEffect } from 'react'
import { Box, Button, type SxProps, type Theme } from '@mui/material'

export type ItineraryTabKey =
  | 'overview'
  | 'day-1'
  | 'day-2'
  | 'day-3'
  | `day-${number}`

export interface ItineraryDayTabsProps {
  activeTab: ItineraryTabKey
  onSelectTab: (tab: ItineraryTabKey) => void
  dayCount: number
  sx?: SxProps<Theme>
}

export const ItineraryDayTabs: React.FC<ItineraryDayTabsProps> = ({
  activeTab,
  onSelectTab,
  dayCount,
  sx,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

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

  // Keep the active tab visible inside the horizontal scroll area on mobile
  useEffect(() => {
    const container = containerRef.current
    const tabEl = tabRefs.current[activeTab]
    if (container && tabEl) {
      const containerRect = container.getBoundingClientRect()
      const tabRect = tabEl.getBoundingClientRect()
      if (tabRect.left < containerRect.left) {
        container.scrollLeft -= containerRect.left - tabRect.left + 16
      } else if (tabRect.right > containerRect.right) {
        container.scrollLeft += tabRect.right - containerRect.right + 16
      }
    }
  }, [activeTab])

  return (
    <Box
      ref={containerRef}
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          overflowX: 'auto',
          pb: { xs: 0.75, sm: 0.5 },
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E1 transparent',
          '::-webkit-scrollbar': {
            height: 3,
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#CBD5E1',
            borderRadius: 2,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <Button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[tab.key] = el
            }}
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
