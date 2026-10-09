import type { SxProps, Theme } from '@mui/material';

/**
 * Shared MUI DataGrid sx configuration for all admin table pages.
 *
 * Usage:
 *   import { tableSx } from '@/components/ui/table/tableStyles';
 *   <DataGrid ... sx={tableSx} />
 */
export const tableSx: SxProps<Theme> = {
  border: 'none',

  // ── Column headers ──────────────────────────────────────────────────────────
  '& .MuiDataGrid-columnHeaders': {
    bgcolor: '#F8FAFC',
    borderBottom: '1px solid #E5E7EB',
  },
  '& .MuiDataGrid-columnHeader': {
    bgcolor: '#F8FAFC',
    px: '16px',
    '&:focus, &:focus-within': { outline: 'none' },
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 600,
    color: '#6B7280',
    fontSize: '12px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  '& .MuiDataGrid-columnSeparator': { display: 'none' },

  // ── Column header sorting ──────────────────────────────────────────────────
  '& .MuiDataGrid-iconButtonContainer': {
    visibility: 'hidden',
    width: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Show sort icon container when column is sorted OR when sortable header is hovered
  '& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-iconButtonContainer, & .MuiDataGrid-columnHeader--sortable:hover .MuiDataGrid-iconButtonContainer': {
    visibility: 'visible',
    width: 'auto',
  },

  // Base sort button styling
  '& .MuiDataGrid-sortButton': {
    opacity: 1,
    padding: 0,
    minWidth: 'auto',
    width: '16px',
    height: '24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748B',
    '&:hover': {
      bgcolor: 'transparent',
    },
  },

  // 1. UNSORTED state: hide single default sort icon when column is not sorted
  '& .MuiDataGrid-columnHeader:not(.MuiDataGrid-columnHeader--sorted) .MuiDataGrid-sortIcon': {
    display: 'none !important',
  },

  // 2. UNSORTED + HOVER state: show vector icon with two opposite arrows matching reference image
  '& .MuiDataGrid-columnHeader:not(.MuiDataGrid-columnHeader--sorted):hover .MuiDataGrid-sortButton': {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    '&::before': {
      display: 'none',
    },
    '&::after': {
      content: '""',
      display: 'block',
      width: '14px',
      height: '14px',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M7 20V4'/><path d='M3 8l4-4 4 4'/><path d='M17 4v16'/><path d='M13 16l4 4 4-4'/></svg>")`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
  },

  // 3 & 4. SORTED state (ASC or DESC): show single native sort arrow, hide pseudo elements
  '& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-sortIcon': {
    display: 'block !important',
    fontSize: '16px',
    color: '#475569',
  },
  '& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-sortButton::before, & .MuiDataGrid-columnHeader--sorted .MuiDataGrid-sortButton::after': {
    content: 'none',
  },

  // ── Rows & cells ────────────────────────────────────────────────────────────
  '& .MuiDataGrid-row': {
    bgcolor: '#FFFFFF',
    transition: 'background-color 0.12s ease',
    '&:hover': { bgcolor: '#F8FAFC' },
    '&:last-of-type .MuiDataGrid-cell': { borderBottom: 'none' },
  },
  '& .MuiDataGrid-cell': {
    borderBottom: '1px solid #F1F5F9',
    px: '16px',
    py: 0,
    display: 'flex',
    alignItems: 'center',
    '&:focus, &:focus-within': { outline: 'none' },
  },

  // ── Virtual scroller ────────────────────────────────────────────────────────
  '& .MuiDataGrid-virtualScroller': {
    overflowX: 'auto',
  },

  // ── Footer / pagination ─────────────────────────────────────────────────────
  '& .MuiDataGrid-footerContainer': {
    borderTop: '1px solid #E5E7EB',
    bgcolor: '#FFFFFF',
    minHeight: '48px',
    height: '48px',
    px: '8px',
  },
  '& .MuiTablePagination-root': {
    color: '#64748B',
  },
  '& .MuiTablePagination-toolbar': {
    minHeight: '48px',
    paddingLeft: '8px',
    paddingRight: '4px',
  },
  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
    fontSize: '13px',
    color: '#64748B',
    fontWeight: 500,
    margin: 0,
  },
  '& .MuiTablePagination-select': {
    fontSize: '13px',
    color: '#172033',
    fontWeight: 500,
    paddingTop: 0,
    paddingBottom: 0,
  },
  '& .MuiTablePagination-actions': {
    marginLeft: '8px',
  },
  '& .MuiTablePagination-actions .MuiIconButton-root': {
    color: '#64748B',
    borderRadius: '6px',
    padding: '4px',
    '&:hover': { bgcolor: '#F1F5F9' },
    '&.Mui-disabled': { color: '#CBD5E1' },
  },
};
