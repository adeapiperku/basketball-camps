import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useDialogs } from '../../../hooks/useDialogs/useDialogs';
import useNotifications from '../../../hooks/useNotifications/useNotifications';
import PageContainer from '../../../components/PageContainer';
import { RegistrationService } from '../../../service/RegistrationService';

const INITIAL_PAGE_SIZE = 10;

export default function RegistrationList() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [paginationModel, setPaginationModel] = React.useState({
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : INITIAL_PAGE_SIZE,
  });

  const [rowsState, setRowsState] = React.useState({ rows: [], rowCount: 0 });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const handlePaginationModelChange = React.useCallback(
    (model) => {
      setPaginationModel(model);
      searchParams.set('page', String(model.page));
      searchParams.set('pageSize', String(model.pageSize));
      navigate(`${pathname}${searchParams.toString() ? '?' : ''}${searchParams.toString()}`);
    },
    [navigate, pathname, searchParams]
  );

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const service = new RegistrationService();
      const registrations = await service.findAll(); // fetch all registrations
      const rows = (Array.isArray(registrations) ? registrations : []).map((r) => ({
        id: r.id,
        participant: r.participantName,
        camp: r.campName,
        school: r.schoolName,
        jerseySize: r.jerseySize,
        status: r.status,
        registeredAt: r.registeredAt,
      }));
      setRowsState({ rows, rowCount: rows.length });
    } catch (err) {
      setError(err);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = React.useCallback(() => {
    if (!isLoading) loadData();
  }, [isLoading, loadData]);

  const handleRowClick = React.useCallback(
    ({ row }) => {
      navigate(`/admin/registrations/${row.id}`);
    },
    [navigate]
  );

  const handleRowDelete = React.useCallback(
    (registration) => async () => {
      const confirmed = await dialogs.confirm(
        `Do you want to delete registration of ${registration.participant}?`,
        { title: 'Delete registration?', severity: 'error', okText: 'Delete', cancelText: 'Cancel' }
      );

      if (confirmed) {
        setIsLoading(true);
        try {
          const service = new RegistrationService();
          await service.delete(registration.id);
          notifications.show('Registration deleted successfully.', { severity: 'success', autoHideDuration: 3000 });
          loadData();
        } catch (deleteError) {
          notifications.show(`Failed to delete registration. Reason: ${deleteError.message}`, { severity: 'error', autoHideDuration: 3000 });
        }
        setIsLoading(false);
      }
    },
    [dialogs, notifications, loadData]
  );

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'participant', headerName: 'Participant', width: 150 },
      { field: 'camp', headerName: 'Camp', width: 150 },
      { field: 'school', headerName: 'School', width: 150 },
      { field: 'jerseySize', headerName: 'Jersey Size', width: 100 },
      { field: 'status', headerName: 'Status', width: 120 },
      { field: 'registeredAt', headerName: 'Registered At', width: 160 },
      {
        field: 'actions',
        type: 'actions',
        flex: 1,
        align: 'right',
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="delete-item"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleRowDelete(row)}
          />,
        ],
      },
    ],
    [handleRowDelete]
  );

  return (
    <PageContainer
      title="Registrations"
      actions={
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Reload data" placement="right" enterDelay={1000}>
            <div>
              <IconButton size="small" aria-label="refresh" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: '100%' }}>
        {error ? (
          <Box sx={{ flexGrow: 1 }}>
            <Alert severity="error">{error.message}</Alert>
          </Box>
        ) : (
          <DataGrid
            rows={rowsState.rows}
            rowCount={rowsState.rowCount}
            columns={columns}
            pagination
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            loading={isLoading}
            pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: { outline: 'transparent' },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: { outline: 'none' },
              [`& .${gridClasses.row}:hover`]: { cursor: 'pointer' },
            }}
          />
        )}
      </Box>
    </PageContainer>
  );
}
