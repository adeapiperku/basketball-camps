import * as React from "react";
import { Box, IconButton, Stack, Tooltip, Alert, TextField, MenuItem } from "@mui/material";
import { DataGrid, GridActionsCellItem, gridClasses } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useDialogs } from "../../../hooks/useDialogs/useDialogs";
import useNotifications from "../../../hooks/useNotifications/useNotifications";
import PageContainer from "../../../components/PageContainer";
import { RegistrationService } from "../../../service/RegistrationService";
import useCamps from "../../../hooks/useCamps";
import { formatDateTime } from "../../../utils/dateUtils";

const INITIAL_PAGE_SIZE = 10;

export default function RegistrationList() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const [paginationModel, setPaginationModel] = React.useState({
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 0,
    pageSize: searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : INITIAL_PAGE_SIZE,
  });
  const [filterModel, setFilterModel] = React.useState(
    searchParams.get("filter")
      ? JSON.parse(searchParams.get("filter") ?? "")
      : { items: [] }
  );
  const [sortModel, setSortModel] = React.useState(
    searchParams.get("sort") ? JSON.parse(searchParams.get("sort") ?? "") : []
  );
  const [rowsState, setRowsState] = React.useState({ rows: [], rowCount: 0 });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { camps, loading: loadingCamps, error: campsError } = useCamps();
  const [selectedCamp, setSelectedCamp] = React.useState("");

  const handlePaginationModelChange = React.useCallback(
    (model) => {
      setPaginationModel(model);
      searchParams.set("page", String(model.page));
      searchParams.set("pageSize", String(model.pageSize));
      navigate(`${pathname}?${searchParams.toString()}`);
    },
    [navigate, pathname, searchParams]
  );

  const handleFilterModelChange = React.useCallback(
    (model) => {
      setFilterModel(model);
      if (
        model.items.length > 0 ||
        (model.quickFilterValues && model.quickFilterValues.length > 0)
      ) {
        searchParams.set("filter", JSON.stringify(model));
      } else {
        searchParams.delete("filter");
      }
      navigate(`${pathname}?${searchParams.toString()}`);
    },
    [navigate, pathname, searchParams]
  );

  const handleSortModelChange = React.useCallback(
    (model) => {
      setSortModel(model);
      if (model.length > 0) {
        searchParams.set("sort", JSON.stringify(model));
      } else {
        searchParams.delete("sort");
      }
      navigate(`${pathname}?${searchParams.toString()}`);
    },
    [navigate, pathname, searchParams]
  );

  const loadData = React.useCallback(async () => {
    if (!selectedCamp) {
      setRowsState({ rows: [], rowCount: 0 });
      setIsLoading(false);
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const service = new RegistrationService();
      const data = await service.findByCamp(selectedCamp);
      const rows = data.map((reg) => ({
        id: reg.id,
        participantName: `${reg.participant?.firstName ?? ""} ${ reg.participant?.lastName ?? "" }`.trim(),
        schoolName: reg.school?.name ?? "N/A",
        jerseySize: reg.jerseySize ?? "N/A",
        status: reg.status ?? "N/A",
        registeredAt: formatDateTime(reg.registeredAt),
        confirmedAt: formatDateTime(reg.confirmedAt),
        amountPaid: reg.amountPaid ? `$${parseFloat(reg.amountPaid).toFixed(2)}`: "$0.00",
        specialRequests: reg.specialRequests || "None",
      }));
      setRowsState({ rows, rowCount: rows.length });
    } catch (err) {
      console.error(err);
      setError(err);
    }
    setIsLoading(false);
  }, [selectedCamp, paginationModel, sortModel, filterModel]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = React.useCallback(() => {
    if (!isLoading) loadData();
  }, [isLoading, loadData]);

  const initialState = React.useMemo(
    () => ({ pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } } }), []);

  const columns = React.useMemo(
    () => [
      { field: "id", headerName: "ID", width: 80 },
      { field: "participantName", headerName: "Participant", flex: 1 },
      { field: "schoolName", headerName: "School", flex: 1 },
      { field: "jerseySize", headerName: "Jersey Size", width: 120 },
      {
        field: "status",
        headerName: "Status",
        width: 130,
        renderCell: (params) => (
          <span
            style={{
              color:
                params.value === "CONFIRMED"
                  ? "green"
                  : params.value === "PENDING"
                  ? "orange"
                  : "red",
              fontWeight: "bold",
            }}
          >
            {params.value}
          </span>
        ),
      },
      { field: "registeredAt", headerName: "Registered At", width: 180 },
      { field: "confirmedAt", headerName: "Confirmed At", width: 180 },
      { field: "amountPaid", headerName: "Amount Paid", width: 130 },
      {
        field: "specialRequests",
        headerName: "Special Requests",
        flex: 1,
        minWidth: 180,
      },
    ],
  );

  const pageTitle = "Registrations";

  return (
    <PageContainer
      title={pageTitle}
      actions={
        <Stack direction="row" alignItems="center" spacing={1}>
          <TextField
            select
            label="Select Camp"
            value={selectedCamp}
            onChange={(e) => setSelectedCamp(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            disabled={loadingCamps}
          >
          <MenuItem value="">Select Camp</MenuItem>
            {loadingCamps ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : campsError ? (
              <MenuItem disabled>Error loading camps</MenuItem>
            ) : (
              camps.map((camp) => (
                <MenuItem key={camp.id} value={camp.id}>
                  {camp.name}
                </MenuItem>
              ))
            )}
          </TextField>

          <Tooltip title="Reload data" placement="right" enterDelay={1000}>
            <div>
              <IconButton
                size="small"
                aria-label="refresh"
                onClick={handleRefresh}
              >
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: "100%" }}>
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
            loading={isLoading}
            initialState={initialState}
            showToolbar
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
