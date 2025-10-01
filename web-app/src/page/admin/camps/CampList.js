import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useDialogs } from '../../../hooks/useDialogs/useDialogs';
import useNotifications from '../../../hooks/useNotifications/useNotifications';
import PageContainer from '../../../components/PageContainer';
import { CampService } from '../../../service/CampService';
import { CoachService } from '../../../service/CoachService';
import CoachesModal from './CoachesModal';

const INITIAL_PAGE_SIZE = 10;

export default function CampList() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [paginationModel, setPaginationModel] = React.useState({
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    pageSize: searchParams.get('pageSize')
      ? Number(searchParams.get('pageSize'))
      : INITIAL_PAGE_SIZE,
  });
  const [filterModel, setFilterModel] = React.useState(
    searchParams.get('filter')
      ? JSON.parse(searchParams.get('filter') ?? '')
      : { items: [] },
  );
  const [sortModel, setSortModel] = React.useState(
    searchParams.get('sort') ? JSON.parse(searchParams.get('sort') ?? '') : [],
  );

  const [rowsState, setRowsState] = React.useState({
    rows: [],
    rowCount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isCoachesModalOpen, setIsCoachesModalOpen] = React.useState(false);
  const [selectedCampId, setSelectedCampId] = React.useState(null);
  const [coaches, setCoaches] = React.useState([]);
  const [isLoadingCoaches, setIsLoadingCoaches] = React.useState(false);

  const fetchCoaches = async (campId) => {
    try {
      setIsLoadingCoaches(true);
      const response = await fetch(`http://localhost:8080/camp-coaches/${campId}`);
      if (!response.ok) throw new Error('Failed to fetch coaches');
      const data = await response.json();
      setCoaches(data);
      setSelectedCampId(campId);
      setIsCoachesModalOpen(true);
    } catch (error) {
      console.error('Error fetching coaches:', error);
      notifications.error('Failed to load coaches');
    } finally {
      setIsLoadingCoaches(false);
    }
  };

  const handleOpenCoachesModal = (campId) => {
    fetchCoaches(campId);
  };
  const handleCloseCoachesModal = () => {
    setIsCoachesModalOpen(false);
    setSelectedCampId(null);
    setCoaches([]);
  };

  const handlePaginationModelChange = React.useCallback(
    (model) => {
      setPaginationModel(model);

      searchParams.set('page', String(model.page));
      searchParams.set('pageSize', String(model.pageSize));

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
      );
    },
    [navigate, pathname, searchParams],
  );

  const handleFilterModelChange = React.useCallback(
    (model) => {
      setFilterModel(model);

      if (
        model.items.length > 0 ||
        (model.quickFilterValues && model.quickFilterValues.length > 0)
      ) {
        searchParams.set('filter', JSON.stringify(model));
      } else {
        searchParams.delete('filter');
      }

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
      );
    },
    [navigate, pathname, searchParams],
  );

  const handleSortModelChange = React.useCallback(
    (model) => {
      setSortModel(model);

      if (model.length > 0) {
        searchParams.set('sort', JSON.stringify(model));
      } else {
        searchParams.delete('sort');
      }

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
      );
    },
    [navigate, pathname, searchParams],
  );

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const service = new CampService();
      const coachService = new CoachService();
      const [camps, coaches] = await Promise.all([
        service.findAll(),
        coachService.findAll()
      ]);
      
      const coachMap = new Map(coaches.map(coach => [coach.id, `${coach.firstName} ${coach.lastName}`]));
      
      const rows = (Array.isArray(camps) ? camps : camps?.items ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        location: c.location,
        startDate: c.startDate,
        endDate: c.endDate,
        price: c.price,
        maxParticipants: c.maxParticipants,
        currentParticipants: c.currentParticipants,
        isActive: c.isActive,
        coachId: c.coachId,
        coachName: c.coachId ? coachMap.get(c.coachId) || 'N/A' : 'N/A',
      }));
      setRowsState({
        rows,
        rowCount: rows.length,
      });
    } catch (listDataError) {
      setError(listDataError);
    }

    setIsLoading(false);
  }, [paginationModel, sortModel, filterModel]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = React.useCallback(() => {
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, loadData]);

  const handleRowClick = React.useCallback(
    ({ row }) => {
      navigate(`/camps/${row.id}`);
    },
    [navigate],
  );

  const handleCreateClick = React.useCallback(() => {
    navigate('/camps/new');
  }, [navigate]);

  const handleRowEdit = React.useCallback(
    (camp) => () => {
      navigate(`/camps/${camp.id}/edit`);
    },
    [navigate],
  );

  const handleRowDelete = React.useCallback(
    (camp) => async () => {
      const confirmed = await dialogs.confirm(
        `Do you want to delete camp ${camp.name}?`,
        {
          title: `Delete camp?`,
          severity: 'error',
          okText: 'Delete',
          cancelText: 'Cancel',
        },
      );

      if (confirmed) {
        setIsLoading(true);
        try {
          const service = new CampService();
          await service.delete(Number(camp.id));

          notifications.show('Camp deleted successfully.', {
            severity: 'success',
            autoHideDuration: 3000,
          });
          loadData();
        } catch (deleteError) {
          notifications.show(
            `Failed to delete camp. Reason:' ${deleteError.message}`,
            {
              severity: 'error',
              autoHideDuration: 3000,
            },
          );
        }
        setIsLoading(false);
      }
    },
    [dialogs, notifications, loadData],
  );

  const initialState = React.useMemo(
    () => ({
      pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
    }),
    [],
  );

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'name', headerName: 'Name', width: 120 },
      { field: 'location', headerName: 'Location', width: 120 },
      {
        field: 'startDate',
        headerName: 'Start date',
        type: 'date',
        valueGetter: (value) => value && new Date(value),
        width: 140,
      },
      {
        field: 'endDate',
        headerName: 'End date',
        type: 'date',
        valueGetter: (value) => value && new Date(value),
        width: 140,
      },
      { field: 'price', headerName: 'Price', width: 120 },
      { field: 'currentParticipants', headerName: 'Current', width: 110 },
      { field: 'maxParticipants', headerName: 'Max', width: 90 },
      { field: 'isActive', headerName: 'Active', width: 100, type: 'boolean' },
      {
        field: 'coaches',
        headerName: 'Coaches',
        width: 150,
        renderCell: (params) => (
          <Button 
            variant="outlined" 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenCoachesModal(params.row.id);
            }}
          >
            View Coaches
          </Button>
        ),
      },
      {
        field: 'actions',
        type: 'actions',
        flex: 1,
        align: 'right',
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="edit-item"
            icon={<EditIcon />}
            label="Edit"
            onClick={handleRowEdit(row)}
          />,
          <GridActionsCellItem
            key="delete-item"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleRowDelete(row)}
          />,
        ],
      },
    ],
    [handleRowEdit, handleRowDelete],
  );

  const pageTitle = 'Camps';

  return (
    <PageContainer
      title={pageTitle}
      actions={
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Reload data" placement="right" enterDelay={1000}>
            <div>
              <IconButton size="small" aria-label="refresh" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            startIcon={<AddIcon />}
          >
            Create
          </Button>
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
            sortingMode="server"
            filterMode="server"
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            filterModel={filterModel}
            onFilterModelChange={handleFilterModelChange}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            loading={isLoading}
            initialState={initialState}
            showToolbar
            pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                outline: 'transparent',
              },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                {
                  outline: 'none',
                },
              [`& .${gridClasses.row}:hover`]: {
                cursor: 'pointer',
              },
            }}
            slotProps={{
              loadingOverlay: {
                variant: 'circular-progress',
                noRowsVariant: 'circular-progress',
              },
              baseIconButton: {
                size: 'small',
              },
            }}
          />
        )}
      </Box>
      <CoachesModal 
        open={isCoachesModalOpen} 
        onClose={handleCloseCoachesModal} 
        coaches={coaches} 
      />
    </PageContainer>
  );
}
